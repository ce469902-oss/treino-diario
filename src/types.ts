export type Goal = 'Ganhar massa' | 'Reduzir gordura' | 'Condicionamento' | 'Correr 5 km' | 'Saúde e disposição' | 'Disciplina'
export type FitnessLevel = 'iniciante' | 'intermediário' | 'avançado'
export type RunLevel = 'nao-corro' | 'caminha-corre' | 'alguns-minutos' | '3k' | '5k' | 'mais-5k'

export interface Profile {
  name: string
  age?: number
  height?: number
  weight?: number
  targetWeight?: number
  biologicalSex?: 'feminino' | 'masculino' | 'prefiro-nao-informar'
  goals: Goal[]
  primaryGoal: Goal
  level: FitnessLevel
  runLevel: RunLevel
  wakeTime: string
  sleepTime: string
  workStart: string
  workEnd: string
  lunchTime: string
  maxWorkoutMinutes: number
  workoutDays: number[]
  injuries: string
  equipment: string[]
  foodPreferences: string
  foodRestrictions: string
  mealsPerDay: number
  weeklyBudget?: number
  fluidRestriction: boolean
}

export type TaskType = 'water' | 'meal' | 'workout' | 'run' | 'recovery' | 'sleep'
export interface RoutineTask {
  id: string
  time: string
  title: string
  subtitle: string
  type: TaskType
  done: boolean
  optional?: boolean
}

export interface Exercise {
  id: string
  name: string
  group: string
  objective: string
  difficulty: FitnessLevel
  sets: number
  reps: string
  rest: number
  steps: string[]
  breathing: string
  mistakes: string[]
  stopSigns: string
  easier: string
  harder: string
  equipment: string
  progression: string
}

export interface WorkoutLog {
  id: string
  date: string
  type: 'força' | 'corrida' | 'mobilidade' | 'caminhada'
  title: string
  duration: number
  effort: number
  completedExercises?: number
  distance?: number
  pace?: number
  notes?: string
}

export interface MealLog { id: string; date: string; mealId: string; title: string; calories: number; protein: number }
export interface WaterLog { id: string; date: string; amount: number }
export interface RecoveryLog { date: string; sleep: number; sleepQuality: number; fatigue: number; soreness: number; energy: number; stress: number }
export interface WeightLog { date: string; value: number }
export interface PhotoLog { id: string; date: string; dataUrl: string }

export interface AppData {
  profile: Profile | null
  onboardingComplete: boolean
  tasksByDate: Record<string, RoutineTask[]>
  workouts: WorkoutLog[]
  meals: MealLog[]
  water: WaterLog[]
  recovery: RecoveryLog[]
  weights: WeightLog[]
  photos: PhotoLog[]
  favorites: string[]
  settings: { theme: 'dark' | 'light'; reducedMotion: boolean; largeText: boolean; reminders: boolean }
}
