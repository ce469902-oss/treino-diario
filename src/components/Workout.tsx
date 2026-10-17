import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Dumbbell, Pause, Play, RotateCcw, Wind } from 'lucide-react'
import { dateKey, exercises } from '../data'
import type { AppData, Exercise } from '../types'

interface Props { data: AppData; update: (fn: (d: AppData) => AppData) => void; onBack: () => void; notify: (m: string) => void }

export default function Workout({ data, update, onBack, notify }: Props) {
  const [started, setStarted] = useState(false)
  const [active, setActive] = useState(0)
  const [setNumber, setSetNumber] = useState(1)
  const [completed, setCompleted] = useState<string[]>([])
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [effort, setEffort] = useState(6)
  const [details, setDetails] = useState<string | null>(null)
  const selected = useMemo(() => exercises.slice(0, data.profile?.maxWorkoutMinutes === 15 ? 3 : 6), [data.profile?.maxWorkoutMinutes])
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(timer) }, [running])
  const exercise = selected[active]
  const finishSet = () => {
    if (setNumber < exercise.sets) { setSetNumber(n => n + 1); setSeconds(exercise.rest); setRunning(false); notify(`Série ${setNumber} concluída. Descanse ${exercise.rest}s.`); return }
    setCompleted(list => [...list, exercise.id]); setSetNumber(1); setSeconds(0)
    if (active < selected.length - 1) setActive(i => i + 1)
  }
  const finishWorkout = () => {
    const duration = Math.max(1, Math.round(seconds / 60) || Math.round((data.profile?.maxWorkoutMinutes ?? 30) * completed.length / selected.length))
    update(d => ({ ...d,
      workouts: [...d.workouts, { id: crypto.randomUUID(), date: dateKey(), type: 'força', title: 'Força — corpo inteiro', duration, effort, completedExercises: completed.length }],
      tasksByDate: { ...d.tasksByDate, [dateKey()]: (d.tasksByDate[dateKey()] ?? []).map(t => t.id === 'training' ? { ...t, done: true } : t) }
    }))
    notify('Treino salvo no seu histórico')
    onBack()
  }
  if (!started) return <div className="page workout-intro">
    <button className="back-button" onClick={onBack}><ArrowLeft/> Hoje</button>
    <div className="workout-cover"><div className="cover-art"><Dumbbell/><span>FORÇA 01</span></div><div className="cover-gradient"/><div className="cover-copy"><span className="tag">CORPO INTEIRO</span><h1>Base forte</h1><p>{selected.length} exercícios • {data.profile?.maxWorkoutMinutes} min • esforço moderado</p></div></div>
    <div className="readiness-note"><Wind/><div><strong>Hoje, controle antes de acelerar.</strong><p>Você deve terminar cada série sentindo que conseguiria fazer mais 2 ou 3 repetições.</p></div></div>
    {data.profile?.injuries && <div className="safety-card"><AlertTriangle/><div><strong>Considere o que você informou</strong><p>Você registrou: “{data.profile.injuries}”. O app não consegue avaliar essa condição. Não faça movimentos que contrariem orientação profissional ou provoquem dor.</p></div></div>}
    <section className="workout-list"><div className="section-heading"><h2>Sua sessão</h2><span>{selected.length} exercícios</span></div>
      <div className="phase"><span>A</span><div><strong>Aquecimento</strong><small>4 minutos • mobilidade dinâmica</small></div><ChevronRight/></div>
      {selected.map((item, i) => <ExerciseRow key={item.id} exercise={item} number={i + 1} open={details === item.id} onToggle={() => setDetails(details === item.id ? null : item.id)}/>) }
      <div className="phase"><span>C</span><div><strong>Desacelerar</strong><small>3 minutos • respiração e mobilidade leve</small></div><ChevronRight/></div>
    </section>
    <button className="primary-button sticky-action big" onClick={() => { setStarted(true); setRunning(true) }}><Play fill="currentColor"/> Começar treino</button>
  </div>

  return <div className="guided-workout">
    <header><button className="icon-button" onClick={() => setStarted(false)}><ArrowLeft/></button><div><span>EXERCÍCIO {active + 1} DE {selected.length}</span><div className="step-progress"><i style={{ width: `${(active + 1) / selected.length * 100}%` }}/></div></div><span>{completed.length}/{selected.length}</span></header>
    <main>
      <div className="exercise-visual"><ExerciseFigure id={exercise.id}/><span className="muscle-label">{exercise.group}</span></div>
      <div className="exercise-main-copy"><p className="eyebrow">SÉRIE {setNumber} DE {exercise.sets}</p><h1>{exercise.name}</h1><p>{exercise.steps[0]}</p></div>
      <div className="rep-box"><div><span>REPETIÇÕES</span><strong>{exercise.reps}</strong></div><div><span>DESCANSO</span><strong>{exercise.rest}s</strong></div></div>
      <details className="technique-details"><summary>Ver execução e segurança <ChevronDown/></summary><ol>{exercise.steps.map(s => <li key={s}>{s}</li>)}</ol><p><strong>Respiração:</strong> {exercise.breathing}</p><p className="warning-text"><AlertTriangle/> {exercise.stopSigns}</p></details>
      <div className="workout-clock"><Clock3/><span>{String(Math.floor(seconds / 60)).padStart(2,'0')}:{String(seconds % 60).padStart(2,'0')}</span><button onClick={() => setRunning(!running)}>{running ? <Pause/> : <Play/>}</button><button onClick={() => setSeconds(0)}><RotateCcw/></button></div>
    </main>
    <footer>{completed.length === selected.length ? <div className="finish-panel"><h3>Sessão concluída</h3><label>Esforço percebido: <strong>{effort}/10</strong><input type="range" min="1" max="10" value={effort} onChange={e => setEffort(+e.target.value)}/></label><button className="primary-button big" onClick={finishWorkout}><Check/> Salvar treino</button></div> : <button className="primary-button big" onClick={finishSet}><Check/> {setNumber < exercise.sets ? 'Concluir série' : active < selected.length - 1 ? 'Próximo exercício' : 'Concluir exercício'}</button>}</footer>
  </div>
}

function ExerciseRow({ exercise, number, open, onToggle }: { exercise: Exercise; number: number; open: boolean; onToggle: () => void }) {
  return <div className={`exercise-row ${open ? 'open' : ''}`}><button onClick={onToggle}><span className="exercise-number">{String(number).padStart(2,'0')}</span><div><strong>{exercise.name}</strong><small>{exercise.sets} × {exercise.reps} • {exercise.group}</small></div><ChevronDown/></button>{open && <div className="exercise-expanded"><p>{exercise.objective}</p><ol>{exercise.steps.map(s => <li key={s}>{s}</li>)}</ol><div className="adapt-grid"><span><b>Mais fácil</b>{exercise.easier}</span><span><b>Progressão</b>{exercise.harder}</span></div><p className="warning-text"><CircleHelp/> {exercise.stopSigns}</p></div>}</div>
}

function ExerciseFigure({ id }: { id: string }) {
  const pose = id === 'squat' ? 'squat' : id === 'incline-pushup' ? 'pushup' : id === 'glute-bridge' ? 'bridge' : 'core'
  return <svg viewBox="0 0 320 260" role="img" aria-label="Ilustração simplificada da posição do exercício"><circle cx={pose === 'pushup' ? 85 : 160} cy={pose === 'squat' ? 55 : pose === 'bridge' ? 150 : 55} r="25"/><g className={`pose ${pose}`}><path d="M160 82 L160 150 M160 105 L115 140 M160 105 L205 140 M160 150 L125 210 M160 150 L205 205"/></g><path className="ground" d="M45 225H275"/></svg>
}
