import { createClient, type User } from '@supabase/supabase-js'
import type { AppData } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const cloudConfigured = Boolean(supabaseUrl && supabaseKey)

const client = cloudConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null

function requireClient() {
  if (!client) throw new Error('A sincronização em nuvem ainda não foi configurada.')
  return client
}

export async function currentCloudUser(): Promise<User | null> {
  if (!client) return null
  const { data, error } = await client.auth.getUser()
  if (error) return null
  return data.user
}

export function onCloudAuthChange(callback: (user: User | null) => void) {
  if (!client) return () => undefined
  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null))
  return () => data.subscription.unsubscribe()
}

export async function sendMagicLink(email: string) {
  const { error } = await requireClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.href.split('#')[0].split('?')[0] }
  })
  if (error) throw error
}

export async function signOutCloud() {
  const { error } = await requireClient().auth.signOut()
  if (error) throw error
}

export async function saveCloudData(data: AppData) {
  const active = requireClient()
  const { data: auth } = await active.auth.getUser()
  if (!auth.user) throw new Error('Entre na sua conta para sincronizar.')
  const payload: AppData = { ...data, photos: [] }
  const { error } = await active.from('user_data').upsert({
    user_id: auth.user.id,
    payload,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function loadCloudData(): Promise<AppData | null> {
  const active = requireClient()
  const { data: auth } = await active.auth.getUser()
  if (!auth.user) throw new Error('Entre na sua conta para restaurar os dados.')
  const { data, error } = await active.from('user_data').select('payload').eq('user_id', auth.user.id).maybeSingle()
  if (error) throw error
  return (data?.payload as AppData | undefined) ?? null
}
