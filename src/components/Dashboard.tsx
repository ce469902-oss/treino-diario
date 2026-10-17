import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronRight, Circle, Clock3, CupSoda, Dumbbell, Footprints, Moon, Play, RefreshCw, Salad, Sparkles, TimerReset } from 'lucide-react'
import { dateKey, generateRoutine, waterTarget } from '../data'
import type { AppData, RoutineTask } from '../types'

interface Props {
  data: AppData
  update: (recipe: (current: AppData) => AppData) => void
  onNavigate: (page: string) => void
  notify: (message: string) => void
}

const icons = { water: CupSoda, meal: Salad, workout: Dumbbell, run: Footprints, recovery: RefreshCw, sleep: Moon }

export default function Dashboard({ data, update, onNavigate, notify }: Props) {
  const profile = data.profile!
  const today = dateKey()
  const tasks = data.tasksByDate[today] ?? generateRoutine(profile)
  const completed = tasks.filter(t => t.done).length
  const percent = Math.round(completed / tasks.length * 100)
  const water = data.water.filter(w => w.date === today).reduce((sum, w) => sum + w.amount, 0)
  const target = waterTarget(profile)
  const recovery = data.recovery.find(r => r.date === today)
  const [reschedule, setReschedule] = useState<RoutineTask | null>(null)
  const next = useMemo(() => tasks.find(t => !t.done), [tasks])
  const saveTasks = (nextTasks: RoutineTask[]) => update(d => ({ ...d, tasksByDate: { ...d.tasksByDate, [today]: nextTasks } }))
  const toggle = (id: string) => saveTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const addWater = (amount: number) => { update(d => ({ ...d, water: [...d.water, { id: crypto.randomUUID(), date: today, amount }] })); notify(`+${amount} ml registrados`) }
  const moveTask = (time: string) => { if (!reschedule) return; saveTasks(tasks.map(t => t.id === reschedule.id ? { ...t, time } : t).sort((a,b) => a.time.localeCompare(b.time))); setReschedule(null); notify('Horário atualizado') }
  const activity = tasks.find(t => t.id === 'training')
  const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return <div className="page dashboard-page">
    <header className="dashboard-hero">
      <div><p className="date-line">{dateLabel}</p><h1>Olá, {profile.name.split(' ')[0]}.</h1><p>{percent === 100 ? 'Dia concluído. Boa recuperação!' : next ? `Próximo: ${next.title} às ${next.time}` : 'Sua rotina está livre agora.'}</p></div>
      <button className="avatar" onClick={() => onNavigate('profile')} aria-label="Abrir perfil">{profile.name[0]?.toUpperCase()}</button>
    </header>

    <section className="daily-score card">
      <div className="ring" style={{ '--value': `${percent * 3.6}deg` } as React.CSSProperties}><div><strong>{percent}%</strong><span>do dia</span></div></div>
      <div className="score-copy"><span className="tag"><Sparkles size={14}/> FOCO DO DIA</span><h2>{activity?.title}</h2><p>{profile.primaryGoal} • {profile.maxWorkoutMinutes} min disponíveis</p></div>
    </section>

    {!recovery && <button className="checkin-banner" onClick={() => onNavigate('recovery')}><div><span>CHECK-IN DE RECUPERAÇÃO</span><strong>Como seu corpo está hoje?</strong></div><ChevronRight/></button>}
    {recovery && recovery.fatigue >= 4 && <div className="adaptation-banner"><RefreshCw/><div><strong>Plano ajustável</strong><p>Sua fadiga está alta. Considere trocar intensidade por mobilidade hoje.</p></div></div>}

    <section className="section-block">
      <div className="section-heading"><div><p className="eyebrow">MINHA ROTINA</p><h2>Hoje</h2></div><span>{completed}/{tasks.length} concluídos</span></div>
      <div className="timeline">{tasks.map((task, index) => {
        const Icon = icons[task.type]
        return <div className={`timeline-item ${task.done ? 'done' : ''}`} key={task.id}>
          <button className="task-check" onClick={() => toggle(task.id)} aria-label={task.done ? `Desmarcar ${task.title}` : `Concluir ${task.title}`}>{task.done ? <Check/> : <Circle/>}</button>
          <div className="timeline-rail">{index < tasks.length - 1 && <span/>}</div>
          <div className="time">{task.time}</div><div className="task-icon"><Icon/></div>
          <button className="task-copy" onClick={() => task.id === 'training' ? onNavigate(task.type === 'run' ? 'run' : task.type === 'workout' ? 'workout' : 'recovery') : setReschedule(task)}><strong>{task.title}</strong><span>{task.subtitle}</span></button>
          <button className="more-time" aria-label={`Reagendar ${task.title}`} onClick={() => setReschedule(task)}><Clock3/></button>
        </div>
      })}</div>
    </section>

    <section className="water-card card">
      <div className="water-icon"><CupSoda/></div><div className="water-copy"><span>HIDRATAÇÃO</span><strong>{water.toLocaleString('pt-BR')} <small>/ {target ? `${target.toLocaleString('pt-BR')} ml` : 'meta individual'}</small></strong><div className="mini-progress"><span style={{ width: target ? `${Math.min(100, water / target * 100)}%` : '0%' }}/></div></div>
      <button onClick={() => addWater(250)}>+ 250 ml</button>
      {profile.fluidRestriction && <p className="inline-warning">Siga a meta indicada pelo profissional que acompanha você.</p>}
    </section>

    <button className="start-workout" onClick={() => onNavigate(activity?.type === 'run' ? 'run' : activity?.type === 'workout' ? 'workout' : 'recovery')}><span className="play-bubble"><Play fill="currentColor"/></span><span><small>ATIVIDADE DE HOJE</small><strong>{activity?.title}</strong></span><ChevronRight/></button>

    {reschedule && <div className="modal-backdrop" onClick={() => setReschedule(null)}><div className="bottom-sheet" onClick={e => e.stopPropagation()}><div className="sheet-handle"/><TimerReset/><h3>Reagendar {reschedule.title}</h3><p>Escolha um novo horário. O restante da rotina permanece organizado.</p><input type="time" defaultValue={reschedule.time} id="new-task-time"/><button className="primary-button" onClick={() => moveTask((document.getElementById('new-task-time') as HTMLInputElement).value)}>Salvar novo horário</button><button className="text-button" onClick={() => setReschedule(null)}>Cancelar</button></div></div>}
  </div>
}
