import { useRef } from 'react'
import { Accessibility, Bell, ChevronRight, Download, Moon, RotateCcw, ShieldCheck, Smartphone, Sun, Upload, UserRound } from 'lucide-react'
import { exportData } from '../store'
import type { AppData } from '../types'

interface Props { data:AppData; update:(fn:(d:AppData)=>AppData)=>void; onEdit:()=>void; onReset:()=>void; notify:(m:string)=>void }

export default function Profile({data,update,onEdit,onReset,notify}:Props){
  const settings=data.settings
  const fileInput=useRef<HTMLInputElement>(null)
  const toggle=(key:keyof typeof settings)=>update(d=>({...d,settings:{...d.settings,[key]:!d.settings[key]}}))
  const requestNotifications=async()=>{if(!('Notification'in window)){notify('Este navegador não oferece notificações');return}if(Notification.permission==='granted'){toggle('reminders');return}const permission=await Notification.requestPermission();if(permission==='granted'){update(d=>({...d,settings:{...d.settings,reminders:true}}));notify('Lembretes permitidos')}else notify('Permissão de notificações não concedida')}
  const restore=async(file?:File)=>{if(!file)return;try{const parsed=JSON.parse(await file.text());const restored=parsed.data??parsed;if(!restored.profile||!Array.isArray(restored.workouts)||!restored.settings)throw new Error('invalid');update(()=>({...restored,photos:restored.photos??[]}));notify('Backup restaurado com sucesso')}catch{notify('Arquivo de backup inválido')}}
  return <div className="page profile-page"><header className="profile-hero"><div className="profile-avatar">{data.profile?.name[0]}</div><div><p className="eyebrow">MEU PERFIL</p><h1>{data.profile?.name}</h1><p>{data.profile?.primaryGoal} • nível {data.profile?.level}</p></div></header>
    <section className="settings-group"><h2>Seu plano</h2><button onClick={onEdit}><UserRound/><span><strong>Dados e objetivos</strong><small>Edite rotina, metas e restrições</small></span><ChevronRight/></button><button onClick={()=>exportData(data)}><Download/><span><strong>Exportar meus dados</strong><small>Baixar backup em formato JSON</small></span><ChevronRight/></button><button onClick={()=>fileInput.current?.click()}><Upload/><span><strong>Restaurar backup</strong><small>Importar um arquivo exportado pelo EVOLVE</small></span><ChevronRight/></button><input className="visually-hidden" ref={fileInput} type="file" accept="application/json" onChange={e=>restore(e.target.files?.[0])}/></section>
    <section className="settings-group"><h2>Experiência</h2><button onClick={()=>update(d=>({...d,settings:{...d.settings,theme:d.settings.theme==='dark'?'light':'dark'}}))}>{settings.theme==='dark'?<Moon/>:<Sun/>}<span><strong>Tema</strong><small>{settings.theme==='dark'?'Escuro':'Claro'}</small></span><i className={`switch ${settings.theme==='light'?'on':''}`}/></button><button onClick={()=>toggle('largeText')}><Accessibility/><span><strong>Texto ampliado</strong><small>Melhora a leitura em todas as telas</small></span><i className={`switch ${settings.largeText?'on':''}`}/></button><button onClick={()=>toggle('reducedMotion')}><Smartphone/><span><strong>Reduzir movimento</strong><small>Diminui animações da interface</small></span><i className={`switch ${settings.reducedMotion?'on':''}`}/></button><button onClick={requestNotifications}><Bell/><span><strong>Lembretes opcionais</strong><small>Depende do suporte do navegador</small></span><i className={`switch ${settings.reminders?'on':''}`}/></button></section>
    <section className="privacy-card"><ShieldCheck/><div><strong>Privacidade local</strong><p>Seus dados de saúde e rotina ficam armazenados neste aparelho. Nenhuma conta externa está conectada.</p></div></section>
    <button className="danger-button" onClick={()=>{if(confirm('Apagar todo o histórico e recomeçar? Esta ação não pode ser desfeita.'))onReset()}}><RotateCcw/> Apagar dados e recomeçar</button><p className="app-version">EVOLVE 1.0 • Feito para sua vida real</p>
  </div>
}
