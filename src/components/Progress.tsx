import { useMemo, useRef, useState } from 'react'
import { Activity, CalendarCheck, Camera, ChevronRight, Droplets, Footprints, Plus, Scale, Timer, TrendingUp } from 'lucide-react'
import { dateKey } from '../data'
import type { AppData } from '../types'

interface Props { data: AppData; update:(fn:(d:AppData)=>AppData)=>void; notify:(m:string)=>void }

export default function Progress({ data, update, notify }: Props) {
  const [weight,setWeight]=useState(data.profile?.weight ?? 70), [showWeight,setShowWeight]=useState(false)
  const photoInput=useRef<HTMLInputElement>(null)
  const last7 = useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const key=dateKey(d);return { key,label:new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(d).slice(0,3), workouts:data.workouts.filter(w=>w.date===key).length,water:data.water.filter(w=>w.date===key).reduce((s,w)=>s+w.amount,0)}}),[data])
  const monthWorkouts=data.workouts.filter(w=>Date.now()-new Date(w.date+'T12:00').getTime()<30*86400000)
  const totalMinutes=monthWorkouts.reduce((s,w)=>s+w.duration,0), totalKm=monthWorkouts.reduce((s,w)=>s+(w.distance??0),0)
  const consistency=Math.min(100,Math.round(monthWorkouts.length/12*100))
  const addWeight=()=>{update(d=>({...d,weights:[...d.weights,{date:dateKey(),value:weight}]}));setShowWeight(false);notify('Peso registrado')}
  const addPhoto=(file?:File)=>{if(!file)return;const image=new Image();image.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d')?.drawImage(image,0,0,canvas.width,canvas.height);const dataUrl=canvas.toDataURL('image/jpeg',.78);update(d=>({...d,photos:[...(d.photos??[]),{id:crypto.randomUUID(),date:dateKey(),dataUrl}]}));notify('Foto salva somente neste aparelho');URL.revokeObjectURL(image.src)};image.src=URL.createObjectURL(file)}
  return <div className="page progress-page"><header className="page-header"><div><p className="eyebrow">MINHA EVOLUÇÃO</p><h1>Progresso real, no seu ritmo.</h1></div><div className="header-icon"><TrendingUp/></div></header>
    <section className="consistency-card"><div><span>CONSISTÊNCIA • 30 DIAS</span><strong>{consistency}%</strong><p>{monthWorkouts.length} atividades concluídas de uma referência de 12</p></div><div className="big-ring" style={{'--value':`${consistency*3.6}deg`} as React.CSSProperties}><CalendarCheck/></div></section>
    <div className="stat-grid"><article><Activity/><strong>{monthWorkouts.length}</strong><span>atividades</span></article><article><Timer/><strong>{totalMinutes}</strong><span>minutos</span></article><article><Footprints/><strong>{totalKm.toFixed(1)}</strong><span>quilômetros</span></article><article><Droplets/><strong>{Math.round(data.water.reduce((s,w)=>s+w.amount,0)/1000)}L</strong><span>registrados</span></article></div>
    <section className="chart-card card"><div className="section-heading"><div><p className="eyebrow">ÚLTIMOS 7 DIAS</p><h2>Atividade</h2></div><span>medido pelos registros</span></div><div className="bar-chart">{last7.map(d=><div key={d.key}><span style={{height:`${Math.max(6,d.workouts*45)}px`}} className={d.workouts?'filled':''}/><small>{d.label}</small></div>)}</div><div className="chart-legend"><i/> Treino registrado</div></section>
    <section className="metric-list"><div className="section-heading"><h2>Medidas e registros</h2></div><button onClick={()=>setShowWeight(true)}><span className="list-icon"><Scale/></span><div><strong>Peso</strong><p>{data.weights.length?`${data.weights.at(-1)?.value} kg • informado por você`:'Nenhum registro ainda'}</p></div><Plus/></button><button onClick={()=>photoInput.current?.click()}><span className="list-icon"><Camera/></span><div><strong>Fotos de evolução</strong><p>{data.photos?.length?`${data.photos.length} foto(s) privada(s)`:'Adicionar somente se você quiser'}</p></div><ChevronRight/></button><input ref={photoInput} className="visually-hidden" type="file" accept="image/*" onChange={e=>addPhoto(e.target.files?.[0])}/></section>
    {!!data.photos?.length&&<div className="photo-grid">{data.photos.slice(-3).map(photo=><figure key={photo.id}><img src={photo.dataUrl} alt={`Evolução registrada em ${new Intl.DateTimeFormat('pt-BR').format(new Date(photo.date+'T12:00'))}`}/><figcaption>{new Intl.DateTimeFormat('pt-BR').format(new Date(photo.date+'T12:00'))}</figcaption></figure>)}</div>}
    <p className="method-note">Os resultados exibem apenas dados registrados por você ou medidos pelo app. Nenhuma mudança física é presumida.</p>
    {showWeight&&<div className="modal-backdrop" onClick={()=>setShowWeight(false)}><div className="bottom-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><Scale/><h3>Registrar peso</h3><label>Peso atual (kg)<input type="number" min="30" max="350" step=".1" value={weight} onChange={e=>setWeight(+e.target.value)}/></label><button className="primary-button" onClick={addWeight}>Salvar registro</button></div></div>}
  </div>
}
