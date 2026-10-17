import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react'
import type { AppData, FitnessLevel, Goal, Profile, RunLevel } from '../types'

const goals: Goal[] = ['Ganhar massa', 'Reduzir gordura', 'Condicionamento', 'Correr 5 km', 'Saúde e disposição', 'Disciplina']
const equipment = ['Nenhum', 'Tapete', 'Elástico', 'Halteres', 'Barra fixa']

const initial: Profile = {
  name: '', goals: ['Saúde e disposição'], primaryGoal: 'Saúde e disposição', level: 'iniciante', runLevel: 'nao-corro',
  wakeTime: '06:30', sleepTime: '22:30', workStart: '08:00', workEnd: '17:30', lunchTime: '12:30',
  maxWorkoutMinutes: 35, workoutDays: [1, 2, 3, 5, 6], injuries: '', equipment: ['Nenhum'],
  foodPreferences: '', foodRestrictions: '', mealsPerDay: 4, fluidRestriction: false
}

interface Props { onComplete: (profile: Profile) => void; existing?: AppData['profile'] }

export default function Onboarding({ onComplete, existing }: Props) {
  const [step, setStep] = useState(existing ? 1 : 0)
  const [profile, setProfile] = useState<Profile>(existing ?? initial)
  const total = 5
  const patch = (values: Partial<Profile>) => setProfile(current => ({ ...current, ...values }))
  const toggleGoal = (goal: Goal) => {
    const next = profile.goals.includes(goal) ? profile.goals.filter(g => g !== goal) : [...profile.goals, goal]
    patch({ goals: next, primaryGoal: next.includes(profile.primaryGoal) ? profile.primaryGoal : next[0] ?? 'Saúde e disposição' })
  }
  const toggleDay = (day: number) => patch({ workoutDays: profile.workoutDays.includes(day) ? profile.workoutDays.filter(d => d !== day) : [...profile.workoutDays, day] })

  if (step === 0) return (
    <main className="welcome-shell">
      <div className="welcome-mark"><span>EV</span></div>
      <p className="eyebrow">SUA EVOLUÇÃO COMEÇA HOJE</p>
      <h1>Um plano que se adapta à sua <em>vida real.</em></h1>
      <p className="welcome-copy">Treino, corrida, alimentação e recuperação organizados em uma rotina simples para você seguir.</p>
      <div className="welcome-points">
        <span><Sparkles size={18}/> Plano personalizado</span><span><ShieldCheck size={18}/> Dados no seu aparelho</span><span><HeartPulse size={18}/> Recuperação em primeiro lugar</span>
      </div>
      <button className="primary-button big" onClick={() => setStep(1)}>Criar meu plano <ArrowRight size={20}/></button>
      <p className="microcopy">Leva cerca de 3 minutos. Você poderá editar tudo depois.</p>
    </main>
  )

  const canContinue = step !== 1 || Boolean(profile.name.trim() && profile.age && profile.age >= 14 && profile.height && profile.weight)

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <button className="icon-button" aria-label="Voltar" onClick={() => setStep(s => s - 1)}><ArrowLeft/></button>
        <div className="progress-track"><span style={{ width: `${step / total * 100}%` }}/></div>
        <span className="step-count">{step}/{total}</span>
      </header>
      <section className="onboarding-card">
        {step === 1 && <>
          <p className="eyebrow">VAMOS NOS CONHECER</p><h2>Seu ponto de partida</h2><p className="muted">Usamos esses dados apenas para estimativas e ajustes do seu plano.</p>
          <label>Como quer ser chamado?<input autoFocus value={profile.name} onChange={e => patch({ name: e.target.value })} placeholder="Seu nome" /></label>
          <div className="field-grid three">
            <label>Idade<input type="number" inputMode="numeric" min="14" max="100" value={profile.age ?? ''} onChange={e => patch({ age: +e.target.value || undefined })} placeholder="Ex: 28" /></label>
            <label>Altura (cm)<input type="number" inputMode="numeric" min="120" max="230" value={profile.height ?? ''} onChange={e => patch({ height: +e.target.value || undefined })} placeholder="175" /></label>
            <label>Peso (kg)<input type="number" inputMode="decimal" min="35" max="300" value={profile.weight ?? ''} onChange={e => patch({ weight: +e.target.value || undefined })} placeholder="72" /></label>
          </div>
          <label>Sexo biológico <span className="optional">opcional, para estimativas</span><select value={profile.biologicalSex ?? ''} onChange={e => patch({ biologicalSex: e.target.value as Profile['biologicalSex'] || undefined })}><option value="">Não informar agora</option><option value="feminino">Feminino</option><option value="masculino">Masculino</option><option value="prefiro-nao-informar">Prefiro não informar</option></select></label>
        </>}
        {step === 2 && <>
          <p className="eyebrow">O QUE MOVE VOCÊ?</p><h2>Escolha seus objetivos</h2><p className="muted">Pode escolher mais de um. Depois, indique sua prioridade.</p>
          <div className="choice-grid">{goals.map(goal => <button key={goal} className={`choice ${profile.goals.includes(goal) ? 'selected' : ''}`} onClick={() => toggleGoal(goal)}><span>{goal}</span>{profile.goals.includes(goal) && <Check size={18}/>}</button>)}</div>
          {profile.goals.length > 1 && <label>Objetivo prioritário<select value={profile.primaryGoal} onChange={e => patch({ primaryGoal: e.target.value as Goal })}>{profile.goals.map(g => <option key={g}>{g}</option>)}</select></label>}
        </>}
        {step === 3 && <>
          <p className="eyebrow">SUA ROTINA</p><h2>Quando o plano cabe no seu dia?</h2><div className="field-grid two">
            <label>Acordo às<input type="time" value={profile.wakeTime} onChange={e => patch({ wakeTime: e.target.value })}/></label><label>Durmo às<input type="time" value={profile.sleepTime} onChange={e => patch({ sleepTime: e.target.value })}/></label>
            <label>Trabalho começa<input type="time" value={profile.workStart} onChange={e => patch({ workStart: e.target.value })}/></label><label>Trabalho termina<input type="time" value={profile.workEnd} onChange={e => patch({ workEnd: e.target.value })}/></label>
            <label>Horário de almoço<input type="time" value={profile.lunchTime} onChange={e => patch({ lunchTime: e.target.value })}/></label><label>Tempo para treino<select value={profile.maxWorkoutMinutes} onChange={e => patch({ maxWorkoutMinutes: +e.target.value })}><option value="15">15 minutos</option><option value="25">25 minutos</option><option value="35">35 minutos</option><option value="45">45 minutos</option><option value="60">60 minutos</option></select></label>
          </div><label>Dias disponíveis</label><div className="day-picker">{['D','S','T','Q','Q','S','S'].map((d, i) => <button key={i} aria-label={['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][i]} className={profile.workoutDays.includes(i) ? 'active' : ''} onClick={() => toggleDay(i)}>{d}</button>)}</div>
        </>}
        {step === 4 && <>
          <p className="eyebrow">MOVIMENTO</p><h2>Qual é seu momento atual?</h2>
          <label>Experiência com exercício<select value={profile.level} onChange={e => patch({ level: e.target.value as FitnessLevel })}><option value="iniciante">Estou começando ou voltando</option><option value="intermediário">Treino há alguns meses</option><option value="avançado">Treino com consistência</option></select></label>
          <label>Capacidade atual de corrida<select value={profile.runLevel} onChange={e => patch({ runLevel: e.target.value as RunLevel })}><option value="nao-corro">Ainda não consigo correr</option><option value="caminha-corre">Alterno caminhada e corrida</option><option value="alguns-minutos">Corro alguns minutos</option><option value="3k">Corro 3 km</option><option value="5k">Corro 5 km</option><option value="mais-5k">Corro mais de 5 km</option></select></label>
          <label>Lesões, dores ou restrições <span className="optional">opcional</span><textarea value={profile.injuries} onChange={e => patch({ injuries: e.target.value })} placeholder="Conte o que devemos considerar. O app não substitui avaliação profissional." /></label>
          <label>Equipamentos disponíveis</label><div className="chip-row">{equipment.map(item => <button key={item} className={profile.equipment.includes(item) ? 'active' : ''} onClick={() => patch({ equipment: profile.equipment.includes(item) ? profile.equipment.filter(x => x !== item) : [...profile.equipment, item] })}>{item}</button>)}</div>
        </>}
        {step === 5 && <>
          <p className="eyebrow">ALIMENTAÇÃO</p><h2>Um plano possível de seguir</h2>
          <div className="field-grid two"><label>Refeições por dia<select value={profile.mealsPerDay} onChange={e => patch({ mealsPerDay: +e.target.value })}><option value="3">3 refeições</option><option value="4">4 refeições</option><option value="5">5 refeições</option><option value="6">6 refeições</option></select></label><label>Orçamento semanal <span className="optional">opcional</span><input type="number" min="0" inputMode="decimal" value={profile.weeklyBudget ?? ''} onChange={e => patch({ weeklyBudget: +e.target.value || undefined })} placeholder="R$ 180"/></label></div>
          <label>Preferências <span className="optional">opcional</span><textarea value={profile.foodPreferences} onChange={e => patch({ foodPreferences: e.target.value })} placeholder="Ex: gosto de ovos, arroz, feijão e frutas"/></label>
          <label>Restrições, alergias ou alimentos que não consome <span className="optional">opcional</span><textarea value={profile.foodRestrictions} onChange={e => patch({ foodRestrictions: e.target.value })} placeholder="Ex: intolerância à lactose"/></label>
          <label className="checkbox-line"><input type="checkbox" checked={profile.fluidRestriction} onChange={e => patch({ fluidRestriction: e.target.checked })}/><span>Tenho orientação profissional para restringir líquidos</span></label>
          <div className="privacy-note"><ShieldCheck/><div><strong>Privacidade por padrão</strong><p>Seus dados ficam neste aparelho. Você pode exportar ou apagar tudo quando quiser.</p></div></div>
        </>}
      </section>
      <footer className="onboarding-footer"><button className="primary-button big" disabled={!canContinue || (step === 2 && !profile.goals.length)} onClick={() => step < total ? setStep(s => s + 1) : onComplete(profile)}>{step === total ? 'Criar minha rotina' : 'Continuar'} <ChevronRight/></button></footer>
    </main>
  )
}
