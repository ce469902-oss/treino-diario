import { useState } from 'react'
import { AlertTriangle, BatteryMedium, Brain, Check, Moon, Sparkles, Zap } from 'lucide-react'
import { dateKey } from '../data'
import type { AppData, RecoveryLog } from '../types'

interface Props { data: AppData; update: (fn:(d:AppData)=>AppData)=>void; notify:(m:string)=>void; onDone?:()=>void }

export default function Recovery({ data, update, notify, onDone }: Props) {
  const existing = data.recovery.find(r => r.date === dateKey())
  const [values,setValues] = useState<RecoveryLog>(existing ?? { date:dateKey(), sleep:7, sleepQuality:3, fatigue:2, soreness:2, energy:3, stress:2 })
  const patch = (key:keyof RecoveryLog,value:number) => setValues(v=>({...v,[key]:value}))
  const readiness = Math.max(0,Math.min(100,Math.round(100 - values.fatigue*9 - values.soreness*7 - values.stress*5 + values.energy*7 + values.sleepQuality*4)))
  const save=()=>{ update(d=>({...d,recovery:[...d.recovery.filter(r=>r.date!==values.date),values]})); notify('Check-in salvo e plano atualizado'); onDone?.() }
  return <div className="page recovery-page"><header className="page-header"><div><p className="eyebrow">RECUPERAÇÃO</p><h1>Como você está hoje?</h1><p>Leva menos de um minuto.</p></div><div className="readiness-orb"><strong>{readiness}</strong><span>prontidão</span></div></header>
    <section className="recovery-form card"><Metric icon={<Moon/>} title="Horas de sono" value={values.sleep} min={3} max={12} step={.5} label={`${values.sleep}h`} onChange={v=>patch('sleep',v)}/><Metric icon={<Sparkles/>} title="Qualidade do sono" value={values.sleepQuality} onChange={v=>patch('sleepQuality',v)}/><Metric icon={<BatteryMedium/>} title="Fadiga" value={values.fatigue} onChange={v=>patch('fatigue',v)}/><Metric icon={<Zap/>} title="Dor muscular" value={values.soreness} onChange={v=>patch('soreness',v)}/><Metric icon={<Brain/>} title="Estresse" value={values.stress} onChange={v=>patch('stress',v)}/></section>
    <div className={`recovery-advice ${readiness<55?'caution':''}`}>{readiness<55?<AlertTriangle/>:<Sparkles/>}<div><strong>{readiness<55?'Hoje pede menos intensidade':'Seu corpo parece pronto'}</strong><p>{readiness<55?'Prefira caminhada, mobilidade ou uma sessão curta. Recuperar também é treinar.':'Mantenha o plano e ajuste durante o treino se o esforço parecer incomum.'}</p></div></div>
    <div className="red-flags"><AlertTriangle/><p>Dor no peito, desmaio, falta de ar desproporcional ou dor intensa: interrompa a atividade e procure atendimento adequado.</p></div>
    <button className="primary-button big" onClick={save}><Check/> Salvar check-in</button></div>
}

function Metric({icon,title,value,onChange,min=1,max=5,step=1,label}:{icon:React.ReactNode;title:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;step?:number;label?:string}){return <label className="metric-row"><span className="metric-icon">{icon}</span><div><span>{title}</span><strong>{label??`${value}/5`}</strong><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/></div></label>}
