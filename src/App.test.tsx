import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('fluxo essencial',()=>{
  beforeEach(()=>localStorage.clear())
  it('conclui a avaliação inicial e abre a rotina personalizada',async()=>{
    const user=userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button',{name:/Criar meu plano/i}))
    await user.type(screen.getByLabelText(/Como quer ser chamado/i),'Lia')
    await user.type(screen.getByLabelText('Idade'),'28')
    await user.type(screen.getByLabelText(/Altura/),'168')
    await user.type(screen.getByLabelText(/Peso \(kg\)/),'68')
    await user.click(screen.getByRole('button',{name:/Continuar/i}))
    await user.click(screen.getByRole('button',{name:/Continuar/i}))
    await user.click(screen.getByRole('button',{name:/Continuar/i}))
    await user.click(screen.getByRole('button',{name:/Continuar/i}))
    await user.click(screen.getByRole('button',{name:/Criar minha rotina/i}))
    expect(await screen.findByText('Olá, Lia.')).toBeInTheDocument()
    expect(screen.getAllByText(/Força — corpo inteiro|Mobilidade e recuperação|Caminhada \+ corrida leve/).length).toBeGreaterThan(0)
  })
})
