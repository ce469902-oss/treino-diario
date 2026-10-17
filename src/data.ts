import type { Exercise, Profile, RoutineTask } from './types'

export const exercises: Exercise[] = [
  {
    id: 'squat', name: 'Agachamento livre', group: 'Pernas e glúteos', objective: 'Força e controle dos membros inferiores', difficulty: 'iniciante', sets: 3, reps: '10–14', rest: 50,
    steps: ['Pés na largura dos ombros e pontas levemente para fora.', 'Leve o quadril para trás e flexione os joelhos.', 'Desça apenas até manter controle e suba empurrando o chão.'], breathing: 'Inspire ao descer; expire ao subir.',
    mistakes: ['Joelhos colapsando para dentro', 'Tirar os calcanhares do chão', 'Acelerar sem controle'], stopSigns: 'Interrompa se houver dor aguda no joelho, quadril ou lombar.', easier: 'Agache até um sofá firme, tocando-o levemente.', harder: 'Pause por 2 segundos na parte baixa.', equipment: 'Nenhum', progression: 'Ao completar 14 repetições com esforço até 6/10 em duas sessões, use a pausa.'
  },
  {
    id: 'incline-pushup', name: 'Flexão inclinada', group: 'Peito, ombros e tríceps', objective: 'Desenvolver força de empurrar com técnica', difficulty: 'iniciante', sets: 3, reps: '6–12', rest: 60,
    steps: ['Apoie as mãos em superfície firme e estável.', 'Mantenha corpo alinhado da cabeça aos calcanhares.', 'Aproxime o peito do apoio e empurre de volta.'], breathing: 'Inspire ao descer; expire ao empurrar.', mistakes: ['Quadril caído', 'Cotovelos muito abertos', 'Apoio instável'], stopSigns: 'Interrompa em caso de dor aguda no peito, ombro ou punho.', easier: 'Use uma superfície mais alta, como parede firme.', harder: 'Use uma superfície mais baixa ou faça no chão.', equipment: 'Bancada fixa ou parede', progression: 'Reduza gradualmente a altura do apoio quando fizer 12 repetições controladas.'
  },
  {
    id: 'glute-bridge', name: 'Ponte de glúteos', group: 'Glúteos e posteriores', objective: 'Fortalecer extensão de quadril', difficulty: 'iniciante', sets: 3, reps: '12–16', rest: 45,
    steps: ['Deite com joelhos flexionados e pés no chão.', 'Contraia o abdômen e eleve o quadril.', 'Aperte os glúteos no topo e desça devagar.'], breathing: 'Expire ao elevar; inspire ao descer.', mistakes: ['Arquear a lombar', 'Empurrar pela ponta dos pés'], stopSigns: 'Pare se sentir dor aguda na lombar ou no quadril.', easier: 'Faça com menor amplitude.', harder: 'Faça unilateralmente, alternando os lados.', equipment: 'Tapete opcional', progression: 'Aumente a pausa no topo antes de tentar a versão unilateral.'
  },
  {
    id: 'bird-dog', name: 'Bird dog', group: 'Core e estabilidade', objective: 'Estabilidade lombopélvica e coordenação', difficulty: 'iniciante', sets: 3, reps: '8 por lado', rest: 40,
    steps: ['Fique em quatro apoios.', 'Estenda braço e perna oposta sem girar o quadril.', 'Volte com controle e alterne.'], breathing: 'Respire continuamente, expirando na extensão.', mistakes: ['Girar o quadril', 'Elevar demais a perna', 'Prender a respiração'], stopSigns: 'Interrompa se houver dor lombar ou perda persistente de equilíbrio.', easier: 'Estenda apenas o braço ou apenas a perna.', harder: 'Faça uma pausa de 3 segundos na extensão.', equipment: 'Tapete opcional', progression: 'Aumente o tempo de pausa mantendo o tronco imóvel.'
  },
  {
    id: 'reverse-lunge', name: 'Afundo reverso assistido', group: 'Pernas e glúteos', objective: 'Força unilateral e equilíbrio', difficulty: 'intermediário', sets: 3, reps: '8 por lado', rest: 60,
    steps: ['Fique ereto ao lado de uma parede se precisar de apoio.', 'Dê um passo para trás e flexione os dois joelhos.', 'Empurre o chão com o pé da frente para voltar.'], breathing: 'Inspire ao descer; expire ao voltar.', mistakes: ['Passo curto demais', 'Joelho da frente caindo para dentro'], stopSigns: 'Pare se houver dor aguda nos joelhos ou perda de equilíbrio.', easier: 'Reduza a amplitude e use apoio na parede.', harder: 'Elimine o apoio e aumente a amplitude.', equipment: 'Parede opcional', progression: 'Aumente primeiro a amplitude, depois as repetições.'
  },
  {
    id: 'plank', name: 'Prancha de antebraço', group: 'Core', objective: 'Resistência e estabilidade do tronco', difficulty: 'iniciante', sets: 3, reps: '20–30 s', rest: 45,
    steps: ['Apoie antebraços e joelhos ou pés.', 'Alinhe ombros, quadril e pernas.', 'Contraia abdômen e glúteos sem prender a respiração.'], breathing: 'Respire curto e constante.', mistakes: ['Quadril muito alto ou baixo', 'Prender a respiração'], stopSigns: 'Pare com dor aguda na lombar, ombro ou falta de ar incomum.', easier: 'Apoie os joelhos.', harder: 'Aumente até 45 segundos com boa forma.', equipment: 'Tapete opcional', progression: 'Some 5 segundos quando mantiver técnica e esforço até 7/10.'
  }
]

export const mealPlan = [
  { id: 'breakfast', time: '07:00', title: 'Café da manhã', foods: 'Aveia (40 g), banana (1 un.) e 2 ovos', calories: 430, protein: 22, alternatives: 'Troque aveia e banana por pão integral e mamão.', prep: 'Prepare a aveia com água ou leite; sirva com banana. Ovos mexidos ao lado.' },
  { id: 'lunch', time: '12:30', title: 'Almoço', foods: 'Arroz (120 g), feijão (100 g), frango (120 g) e salada', calories: 610, protein: 43, alternatives: 'Troque frango por ovos, peixe ou proteína vegetal.', prep: 'Grelhe o frango e monte metade do prato com legumes e salada.' },
  { id: 'snack', time: '16:30', title: 'Lanche', foods: 'Iogurte natural e fruta', calories: 210, protein: 10, alternatives: 'Leite com aveia ou pão com ovo.', prep: 'Sem preparo; mantenha refrigerado.' },
  { id: 'dinner', time: '20:00', title: 'Jantar', foods: 'Batata (200 g), omelete de 3 ovos e legumes', calories: 520, protein: 27, alternatives: 'Repita o almoço em porção ajustada.', prep: 'Asse ou cozinhe a batata. Prepare a omelete com os legumes.' }
]

export function dateKey(date = new Date()) {
  const year = date.getFullYear(), month = String(date.getMonth() + 1).padStart(2, '0'), day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function generateRoutine(profile: Profile, date = new Date()): RoutineTask[] {
  const day = date.getDay()
  const workoutDay = profile.workoutDays.includes(day)
  const runDay = workoutDay && (day === 2 || day === 6)
  const exerciseTitle = runDay ? 'Caminhada + corrida leve' : workoutDay ? 'Força — corpo inteiro' : 'Mobilidade e recuperação'
  const exerciseType: RoutineTask['type'] = runDay ? 'run' : workoutDay ? 'workout' : 'recovery'
  const workoutTime = profile.workEnd < '18:00' ? '18:30' : profile.wakeTime < '06:30' ? '06:30' : '19:30'
  const tasks: RoutineTask[] = [
    { id: 'wake', time: profile.wakeTime, title: 'Começar o dia', subtitle: 'Check-in rápido e um copo de água', type: 'water', done: false },
    { id: 'breakfast', time: addMinutes(profile.wakeTime, 30), title: 'Café da manhã', subtitle: 'Energia para a manhã', type: 'meal', done: false },
    { id: 'lunch', time: profile.lunchTime, title: 'Almoço', subtitle: 'Refeição principal planejada', type: 'meal', done: false },
    { id: 'snack', time: '16:30', title: 'Lanche', subtitle: 'Opção prática', type: 'meal', done: false, optional: true },
    { id: 'training', time: workoutTime, title: exerciseTitle, subtitle: `${workoutDay ? profile.maxWorkoutMinutes : 15} min • intensidade ajustável`, type: exerciseType, done: false },
    { id: 'dinner', time: '20:30', title: 'Jantar', subtitle: 'Refeição simples e equilibrada', type: 'meal', done: false },
    { id: 'sleep', time: addMinutes(profile.sleepTime, -30), title: 'Desacelerar', subtitle: 'Preparação para dormir', type: 'sleep', done: false }
  ]
  return tasks.sort((a, b) => a.time.localeCompare(b.time))
}

function addMinutes(time: string, amount: number) {
  const [h, m] = time.split(':').map(Number)
  const total = (h * 60 + m + amount + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function waterTarget(profile: Profile) {
  if (profile.fluidRestriction) return 0
  return Math.round(Math.min(4000, Math.max(1800, (profile.weight ?? 70) * 32)) / 100) * 100
}

export function nutritionEstimate(profile: Profile) {
  if (!profile.age || profile.age < 18 || !profile.height || !profile.weight || !profile.biologicalSex || profile.biologicalSex === 'prefiro-nao-informar') return null
  const base = profile.biologicalSex === 'masculino'
    ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
  const maintenance = Math.round(base * (profile.level === 'iniciante' ? 1.35 : profile.level === 'intermediário' ? 1.5 : 1.65))
  const goalAdjustment = profile.primaryGoal === 'Reduzir gordura' ? -250 : profile.primaryGoal === 'Ganhar massa' ? 200 : 0
  const calories = maintenance + goalAdjustment
  return { calories, protein: Math.round(profile.weight * 1.6), carbs: Math.round(calories * .45 / 4), fats: Math.round(calories * .3 / 9), fiber: Math.round(calories / 1000 * 14) }
}
