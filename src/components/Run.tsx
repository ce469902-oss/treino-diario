import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeft, Footprints, LocateFixed, MapPin, Pause, Play, Save, Shield, Square } from 'lucide-react'
import { dateKey } from '../data'
import type { AppData } from '../types'

interface Props { data: AppData; update: (fn: (d: AppData) => AppData) => void; onBack: () => void; notify: (m: string) => void }

const plans = {
  'nao-corro': { goal: 'Correr 20 minutos', session: '1 min corrida + 2 min caminhada', rounds: 7, intensity: 'Leve — você consegue conversar' },
  'caminha-corre': { goal: 'Correr 20 minutos', session: '2 min corrida + 2 min caminhada', rounds: 6, intensity: 'Leve — teste da fala confortável' },
  'alguns-minutos': { goal: 'Completar 3 km', session: '4 min corrida + 1 min caminhada', rounds: 6, intensity: 'Confortável, sem buscar velocidade' },
  '3k': { goal: 'Completar 5 km', session: 'Corrida contínua leve', rounds: 1, intensity: 'Ritmo em que frases curtas são possíveis' },
  '5k': { goal: '5 km com conforto', session: 'Corrida leve + 4 acelerações curtas', rounds: 1, intensity: 'Leve a moderado' },
  'mais-5k': { goal: 'Evoluir resistência', session: 'Corrida contínua progressiva', rounds: 1, intensity: 'Comece leve e termine moderado' }
}

function metersBetween(a: GeolocationCoordinates, b: GeolocationCoordinates) {
  const R = 6371e3, p1 = a.latitude * Math.PI / 180, p2 = b.latitude * Math.PI / 180, dp = (b.latitude-a.latitude)*Math.PI/180, dl=(b.longitude-a.longitude)*Math.PI/180
  const x = Math.sin(dp/2)**2 + Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}

export default function Run({ data, update, onBack, notify }: Props) {
  const plan = plans[data.profile?.runLevel ?? 'nao-corro']
  const [mode, setMode] = useState<'plan'|'tracking'|'manual'>('plan')
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [distance, setDistance] = useState(0)
  const [gps, setGps] = useState<'idle'|'searching'|'ready'|'denied'>('idle')
  const [effort, setEffort] = useState(5)
  const last = useRef<GeolocationCoordinates | null>(null), watch = useRef<number | null>(null)
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds(s => s+1), 1000); return () => clearInterval(timer) }, [running])
  useEffect(() => () => { if (watch.current !== null) navigator.geolocation.clearWatch(watch.current) }, [])
  const startGps = () => {
    if (!navigator.geolocation) { setGps('denied'); return }
    setGps('searching')
    watch.current = navigator.geolocation.watchPosition(pos => {
      setGps('ready'); if (last.current && pos.coords.accuracy < 50) setDistance(d => d + metersBetween(last.current!, pos.coords)); last.current = pos.coords
    }, () => setGps('denied'), { enableHighAccuracy: true, maximumAge: 3000 })
    setRunning(true); setMode('tracking')
  }
  const save = (manual?: { duration: number; distance: number }) => {
    const mins = manual?.duration ?? Math.max(1, Math.round(seconds/60)), km = manual?.distance ?? +(distance/1000).toFixed(2)
    update(d => ({ ...d, workouts: [...d.workouts, { id: crypto.randomUUID(), date: dateKey(), type: 'corrida', title: 'Corrida ao ar livre', duration: mins, effort, distance: km, pace: km ? +(mins/km).toFixed(2) : undefined }], tasksByDate: { ...d.tasksByDate, [dateKey()]: (d.tasksByDate[dateKey()] ?? []).map(t => t.id === 'training' ? { ...t, done: true } : t) } }))
    notify('Corrida salva no histórico'); onBack()
  }
  if (mode === 'manual') return <ManualRun onBack={() => setMode('plan')} onSave={save}/>
  if (mode === 'tracking') return <div className="run-tracking">
    <header><button className="icon-button" onClick={() => setMode('plan')}><ArrowLeft/></button><span>CORRIDA EM ANDAMENTO</span><i className={gps}/></header>
    <main><div className={`gps-orbit ${gps}`}><LocateFixed/><span>{gps === 'ready' ? 'GPS ativo' : gps === 'denied' ? 'GPS indisponível' : 'Buscando sinal'}</span></div><div className="run-primary"><strong>{(distance/1000).toFixed(2)}</strong><span>QUILÔMETROS</span></div><div className="run-stats"><div><strong>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</strong><span>TEMPO</span></div><div><strong>{distance > 50 ? (seconds/60/(distance/1000)).toFixed(1) : '—'}</strong><span>RITMO /KM</span></div></div>{gps === 'denied' && <p className="gps-error">Sem acesso à localização. O tempo continuará e você poderá informar a distância ao final.</p>}</main>
    <footer><button className="run-control secondary" onClick={() => setRunning(r => !r)}>{running ? <Pause/> : <Play/>}</button><button className="run-control stop" onClick={() => { setRunning(false); if (watch.current !== null) navigator.geolocation.clearWatch(watch.current); save() }}><Square fill="currentColor"/></button></footer>
  </div>
  return <div className="page run-page">
    <button className="back-button" onClick={onBack}><ArrowLeft/> Hoje</button>
    <header className="run-hero"><div className="run-hero-art"><Footprints/><span>SEMANA 1</span></div><div><p className="eyebrow">SEU PLANO DE CORRIDA</p><h1>{plan.goal}</h1><p>Progressão baseada no seu nível e na recuperação.</p></div></header>
    <section className="today-run card"><span className="tag">TREINO DE HOJE</span><h2>{plan.session}</h2><p>{plan.rounds > 1 ? `${plan.rounds} ciclos • ` : ''}aquecimento e desaquecimento incluídos</p><div className="intensity"><span>ESFORÇO</span><strong>4–6 / 10</strong><small>{plan.intensity}</small></div></section>
    <div className="safety-card"><Shield/><div><strong>Antes de sair</strong><p>Observe calor, iluminação, trânsito e segurança do percurso. Leve identificação e interrompa se sentir dor no peito, desmaio ou falta de ar desproporcional.</p></div></div>
    <section><div className="section-heading"><h2>Sessão</h2></div><ol className="run-steps"><li><span>05:00</span><div><strong>Caminhada ativa</strong><p>Aqueça gradualmente.</p></div></li><li><span>24:00</span><div><strong>{plan.session}</strong><p>Mantenha o teste da fala.</p></div></li><li><span>05:00</span><div><strong>Caminhada leve</strong><p>Respire e desacelere.</p></div></li></ol></section>
    <button className="primary-button big" onClick={startGps}><MapPin/> Iniciar com GPS</button><button className="secondary-button big" onClick={() => setMode('manual')}><Save/> Registrar manualmente</button>
    <p className="microcopy"><AlertTriangle size={14}/> O GPS só é usado após sua permissão e nenhuma rota é enviada a servidores.</p>
  </div>
}

function ManualRun({ onBack, onSave }: { onBack: () => void; onSave: (v: {duration:number;distance:number}) => void }) {
  const [duration, setDuration] = useState(30), [distance, setDistance] = useState(3)
  return <div className="page form-page"><button className="back-button" onClick={onBack}><ArrowLeft/> Corrida</button><p className="eyebrow">REGISTRO MANUAL</p><h1>Como foi sua corrida?</h1><p className="muted">Registre somente o que você mediu. O ritmo será calculado automaticamente.</p><div className="card form-card"><label>Duração (min)<input type="number" min="1" value={duration} onChange={e => setDuration(+e.target.value)}/></label><label>Distância (km)<input type="number" min="0" step="0.1" inputMode="decimal" value={distance} onChange={e => setDistance(+e.target.value)}/></label>{distance > 0 && <div className="calculated"><span>RITMO CALCULADO</span><strong>{Math.floor(duration/distance)}:{String(Math.round((duration/distance%1)*60)).padStart(2,'0')} min/km</strong></div>}</div><button className="primary-button big" disabled={!duration || !distance} onClick={() => onSave({ duration, distance })}>Salvar corrida</button></div>
}
