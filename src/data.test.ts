import { describe, expect, it } from 'vitest'
import { generateRoutine, nutritionEstimate, waterTarget } from './data'
import type { Profile } from './types'

const profile: Profile = {
  name:'Ana', age:30, height:165, weight:65, biologicalSex:'feminino', goals:['Condicionamento'], primaryGoal:'Condicionamento', level:'iniciante', runLevel:'caminha-corre',
  wakeTime:'06:00',sleepTime:'22:30',workStart:'08:00',workEnd:'17:00',lunchTime:'12:00',maxWorkoutMinutes:35,workoutDays:[1,2,3,5,6],injuries:'',equipment:['Nenhum'],foodPreferences:'',foodRestrictions:'',mealsPerDay:4,fluidRestriction:false
}

describe('regras personalizadas',()=>{
  it('gera rotina ordenada e usa os horários informados',()=>{
    const tasks=generateRoutine(profile,new Date('2026-10-19T12:00:00'))
    expect(tasks[0].time).toBe('06:00')
    expect(tasks.find(t=>t.id==='lunch')?.time).toBe('12:00')
    expect([...tasks].sort((a,b)=>a.time.localeCompare(b.time))).toEqual(tasks)
    expect(tasks.find(t=>t.id==='training')?.type).toBe('workout')
  })
  it('programa corrida nos dias definidos de corrida',()=>{
    const tasks=generateRoutine(profile,new Date('2026-10-20T12:00:00'))
    expect(tasks.find(t=>t.id==='training')).toMatchObject({type:'run',title:'Caminhada + corrida leve'})
  })
  it('calcula meta hídrica contextual e respeita restrição',()=>{
    expect(waterTarget(profile)).toBe(2100)
    expect(waterTarget({...profile,fluidRestriction:true})).toBe(0)
  })
  it('só calcula nutrição com dados suficientes e ajusta objetivo',()=>{
    expect(nutritionEstimate({...profile,age:undefined})).toBeNull()
    expect(nutritionEstimate({...profile,age:17})).toBeNull()
    const maintenance=nutritionEstimate(profile)!
    const deficit=nutritionEstimate({...profile,primaryGoal:'Reduzir gordura'})!
    expect(maintenance.protein).toBe(104)
    expect(deficit.calories).toBe(maintenance.calories-250)
  })
})
