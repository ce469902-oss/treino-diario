import { beforeEach, describe, expect, it } from 'vitest'
import { defaultData, loadData } from './store'

describe('persistência local',()=>{
  beforeEach(()=>localStorage.clear())
  it('começa com dados seguros quando não há histórico',()=>expect(loadData()).toEqual(defaultData))
  it('recupera os registros após recarregar',()=>{
    localStorage.setItem('evolve:data:v1',JSON.stringify({...defaultData,onboardingComplete:true,water:[{id:'1',date:'2026-10-17',amount:250}]}))
    expect(loadData().onboardingComplete).toBe(true)
    expect(loadData().water[0].amount).toBe(250)
  })
  it('se recupera de backup local inválido',()=>{localStorage.setItem('evolve:data:v1','{invalid');expect(loadData()).toEqual(defaultData)})
})
