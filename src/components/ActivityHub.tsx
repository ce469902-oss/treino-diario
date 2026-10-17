import { ChevronRight, Dumbbell, Footprints, HeartPulse, Library, TimerReset, Zap } from 'lucide-react'
import { exercises } from '../data'
import type { AppData } from '../types'

export default function ActivityHub({data,onNavigate}:{data:AppData;onNavigate:(p:string)=>void}){
  return <div className="page activity-page"><header className="page-header"><div><p className="eyebrow">MOVIMENTO</p><h1>Escolha como se mover.</h1><p>Seu plano favorece consistência e recuperação.</p></div><div className="header-icon"><Zap/></div></header>
    <section className="activity-feature strength" onClick={()=>onNavigate('workout')}><div className="feature-art"><Dumbbell/></div><div><span className="tag">{data.profile?.maxWorkoutMinutes} MIN</span><h2>Força em casa</h2><p>Corpo inteiro, progressivo e sem equipamento obrigatório.</p><button>Ver treino <ChevronRight/></button></div></section>
    <section className="activity-feature running" onClick={()=>onNavigate('run')}><div className="feature-art"><Footprints/></div><div><span className="tag">PLANO PROGRESSIVO</span><h2>Corrida na rua</h2><p>Do primeiro minuto aos 5 km, no seu ritmo.</p><button>Ver corrida <ChevronRight/></button></div></section>
    <div className="quick-activity-grid"><button onClick={()=>onNavigate('workout')}><TimerReset/><strong>Treino curto</strong><span>15 minutos</span></button><button onClick={()=>onNavigate('recovery')}><HeartPulse/><strong>Recuperação</strong><span>Check-in diário</span></button></div>
    <section className="library-preview"><div className="section-heading"><div><p className="eyebrow">BIBLIOTECA</p><h2>Domine os movimentos</h2></div><Library/></div>{exercises.slice(0,4).map(e=><button key={e.id} onClick={()=>onNavigate('workout')}><span>{e.name.slice(0,2).toUpperCase()}</span><div><strong>{e.name}</strong><p>{e.group} • {e.difficulty}</p></div><ChevronRight/></button>)}</section>
  </div>
}
