import { useMemo, useState } from 'react'
import { ArrowLeftRight, Check, ChevronDown, ChevronRight, Info, ListChecks, Plus, Salad, ShoppingBasket, Utensils } from 'lucide-react'
import { dateKey, mealPlan, nutritionEstimate } from '../data'
import type { AppData } from '../types'

interface Props { data: AppData; update: (fn: (d: AppData) => AppData) => void; notify: (m: string) => void }

export default function Nutrition({ data, update, notify }: Props) {
  const [tab, setTab] = useState<'today'|'week'|'shopping'>('today')
  const [openMeal, setOpenMeal] = useState<string | null>(null)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const estimate = nutritionEstimate(data.profile!)
  const restrictions=(data.profile?.foodRestrictions??'').toLowerCase()
  const displayedMeals=useMemo(()=>mealPlan.map(meal=>{
    let foods=meal.foods,alternatives=meal.alternatives
    if(/lactose|leite|lácteo/.test(restrictions)&&meal.id==='snack'){foods='Fruta, aveia e castanhas';alternatives='Pão com ovo ou bebida vegetal sem açúcar.'}
    if(/vegetar|não como carne|nao como carne/.test(restrictions)&&meal.id==='lunch'){foods='Arroz (120 g), feijão (150 g), 2 ovos e salada';alternatives='Tofu grelhado ou proteína vegetal disponível.'}
    return {...meal,foods,alternatives}
  }),[restrictions])
  const todayMeals = data.meals.filter(m => m.date === dateKey())
  const consumed = todayMeals.reduce((sum, m) => sum + m.calories, 0), protein = todayMeals.reduce((sum,m) => sum+m.protein,0)
  const logged = (id: string) => todayMeals.some(m => m.mealId === id)
  const toggleMeal = (meal: typeof mealPlan[number]) => {
    update(d => ({ ...d, meals: logged(meal.id) ? d.meals.filter(m => !(m.date === dateKey() && m.mealId === meal.id)) : [...d.meals, { id: crypto.randomUUID(), date: dateKey(), mealId: meal.id, title: meal.title, calories: meal.calories, protein: meal.protein }] }))
    notify(logged(meal.id) ? 'Registro removido' : 'Refeição registrada')
  }
  const groceries = useMemo(() => ['Arroz — 1 kg', 'Feijão — 500 g', 'Ovos — 18 unidades', 'Peito de frango — 1 kg', 'Aveia — 500 g', 'Banana — 10 unidades', 'Batata — 1 kg', 'Iogurte natural — 4 unidades', 'Legumes variados — 1,5 kg', 'Folhas e tomate'], [])
  return <div className="page nutrition-page">
    <header className="page-header"><div><p className="eyebrow">ALIMENTAÇÃO</p><h1>Comer bem, sem complicar.</h1></div><div className="header-icon"><Salad/></div></header>
    <nav className="segmented"><button className={tab==='today'?'active':''} onClick={() => setTab('today')}>Hoje</button><button className={tab==='week'?'active':''} onClick={() => setTab('week')}>Semana</button><button className={tab==='shopping'?'active':''} onClick={() => setTab('shopping')}>Compras</button></nav>
    {tab === 'today' && <>
      {estimate ? <section className="nutrition-summary card"><div className="calorie-ring"><strong>{consumed}</strong><span>de {estimate.calories} kcal</span></div><div className="macro-bars"><div><span>Proteína <b>{protein}/{estimate.protein}g</b></span><i><em style={{width:`${Math.min(100,protein/estimate.protein*100)}%`}}/></i></div><div><span>Carboidratos <b>meta {estimate.carbs}g</b></span><i><em style={{width:'0%'}}/></i></div><div><span>Gorduras <b>meta {estimate.fats}g</b></span><i><em style={{width:'0%'}}/></i></div></div><Info className="info-button" aria-label="Estimativa nutricional"/></section> : <section className="estimate-missing card"><Info/><div><strong>Estimativa geral</strong><p>Informe idade, altura, peso e sexo biológico no perfil para uma estimativa energética pela equação de Mifflin-St Jeor. O cardápio abaixo continua sendo apenas um exemplo ajustável.</p></div></section>}
      <p className="method-note">Estimativas são referências, não prescrições clínicas. Necessidades reais variam com rotina, composição corporal e resposta individual.</p>
      <section><div className="section-heading"><div><p className="eyebrow">PLANO DE HOJE</p><h2>Refeições</h2></div><span>{todayMeals.length}/{mealPlan.length}</span></div>
        {restrictions&&<div className="adaptation-banner"><Info/><div><strong>Restrições consideradas</strong><p>Aplicamos substituições simples com base no que você informou. Confira rótulos e risco de contaminação quando houver alergia.</p></div></div>}
        <div className="meal-list">{displayedMeals.map(meal => <div className={`meal-card ${logged(meal.id)?'logged':''}`} key={meal.id}><button className="meal-main" onClick={() => setOpenMeal(openMeal===meal.id?null:meal.id)}><span className="meal-time">{meal.time}</span><div><strong>{meal.title}</strong><p>{meal.foods}</p><small>~{meal.calories} kcal • {meal.protein} g proteína</small></div><ChevronDown/></button>{openMeal === meal.id && <div className="meal-details"><p><b>Preparo:</b> {meal.prep}</p><div className="swap"><ArrowLeftRight/><p><b>Troca equivalente</b><br/>{meal.alternatives}</p></div></div>}<button className="meal-check" onClick={() => toggleMeal(meal)}>{logged(meal.id)?<><Check/> Consumida</>:<><Plus/> Registrar</>}</button></div>)}</div>
      </section>
    </>}
    {tab === 'week' && <WeeklyPlan/>}
    {tab === 'shopping' && <section className="shopping-list"><div className="shopping-hero"><ShoppingBasket/><div><p className="eyebrow">LISTA AUTOMÁTICA</p><h2>Compras da semana</h2><p>Baseada no cardápio sugerido para 7 dias.</p></div></div><div className="card">{groceries.map(item => <label className={checkedItems.includes(item)?'checked':''} key={item}><input type="checkbox" checked={checkedItems.includes(item)} onChange={() => setCheckedItems(xs => xs.includes(item)?xs.filter(x=>x!==item):[...xs,item])}/><span>{item}</span></label>)}</div><div className="prep-card"><Utensils/><div><strong>Marmitas em 60 minutos</strong><p>Cozinhe arroz, feijão e frango em lotes. Porcione após esfriar e congele o que não consumir em até 3 dias.</p></div></div></section>}
  </div>
}

function WeeklyPlan() {
  const days = ['Hoje','Terça','Quarta','Quinta','Sexta','Sábado','Domingo']
  const [selected,setSelected]=useState(0)
  return <section className="weekly-plan"><div className="week-strip">{days.map((day,i)=><button className={i===selected?'active':''} onClick={()=>setSelected(i)} key={day}><span>{day.slice(0,3)}</span><strong>{new Date(Date.now()+i*86400000).getDate()}</strong></button>)}</div><div className="weekly-info card"><ListChecks/><div><strong>Estrutura flexível • {days[selected]}</strong><p>O plano alterna fontes de proteína e vegetais. Use as substituições quando faltar algum ingrediente.</p></div></div>{mealPlan.map((meal,i)=><div className="week-meal" key={meal.id}><span>{meal.time}</span><div><strong>{meal.title}</strong><p>{(i+selected)%2 ? meal.foods : meal.alternatives}</p></div><ChevronRight/></div>)}</section>
}
