import { useEffect, useState } from 'react'
import { Apple, Dumbbell, Home, TrendingUp, UserRound } from 'lucide-react'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Workout from './components/Workout'
import Run from './components/Run'
import Nutrition from './components/Nutrition'
import Recovery from './components/Recovery'
import Progress from './components/Progress'
import Profile from './components/Profile'
import ActivityHub from './components/ActivityHub'
import { dateKey, generateRoutine } from './data'
import { useAppStore } from './store'
import type { Profile as ProfileType } from './types'

const tabs = [
  {id:'home',label:'Hoje',icon:Home}, {id:'activity',label:'Mover',icon:Dumbbell}, {id:'nutrition',label:'Alimentar',icon:Apple}, {id:'progress',label:'Evolução',icon:TrendingUp}, {id:'profile',label:'Perfil',icon:UserRound}
]

export default function App(){
  const {data,update,reset}=useAppStore()
  const [page,setPage]=useState('home'), [editing,setEditing]=useState(false), [toast,setToast]=useState('')
  useEffect(()=>{document.documentElement.dataset.theme=data.settings.theme;document.documentElement.classList.toggle('large-text',data.settings.largeText);document.documentElement.classList.toggle('reduced-motion',data.settings.reducedMotion)},[data.settings])
  useEffect(()=>{if(!toast)return;const timer=window.setTimeout(()=>setToast(''),2400);return()=>clearTimeout(timer)},[toast])
  const saveProfile=(profile:ProfileType)=>{update(d=>({...d,profile,onboardingComplete:true,tasksByDate:{...d.tasksByDate,[dateKey()]:generateRoutine(profile)}}));setEditing(false);setPage('home');setToast(editing?'Perfil atualizado':'Seu plano está pronto')}
  if(!data.onboardingComplete||!data.profile||editing)return <Onboarding onComplete={saveProfile} existing={editing?data.profile:undefined}/>
  const navigate=(next:string)=>{setPage(next);window.scrollTo({top:0,behavior:data.settings.reducedMotion?'auto':'smooth'})}
  const content=()=>{
    if(page==='workout')return <Workout data={data} update={update} onBack={()=>navigate('home')} notify={setToast}/>
    if(page==='run')return <Run data={data} update={update} onBack={()=>navigate('activity')} notify={setToast}/>
    if(page==='recovery')return <Recovery data={data} update={update} notify={setToast} onDone={()=>navigate('home')}/>
    if(page==='activity')return <ActivityHub data={data} onNavigate={navigate}/>
    if(page==='nutrition')return <Nutrition data={data} update={update} notify={setToast}/>
    if(page==='progress')return <Progress data={data} update={update} notify={setToast}/>
    if(page==='profile')return <Profile data={data} update={update} onEdit={()=>setEditing(true)} onReset={()=>{reset();setPage('home')}} notify={setToast}/>
    return <Dashboard data={data} update={update} onNavigate={navigate} notify={setToast}/>
  }
  const immersive=['workout','run','recovery'].includes(page)
  return <div className="app-shell"><div className="brand-rail"><div className="brand"><span><img src={`${import.meta.env.BASE_URL}icons/evolve-192.png`} alt="" /></span><strong>EVOLVE</strong></div><p>Sua evolução começa hoje.</p></div><div className="app-content">{content()}</div>{!immersive&&<nav className="bottom-nav" aria-label="Navegação principal">{tabs.map(tab=>{const Icon=tab.icon;return <button key={tab.id} className={page===tab.id?'active':''} onClick={()=>navigate(tab.id)}><Icon/><span>{tab.label}</span></button>})}</nav>}{toast&&<div className="toast" role="status">{toast}</div>}</div>
}
