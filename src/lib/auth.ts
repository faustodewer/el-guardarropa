import { supabase } from './supabase'

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 12) errors.push('Mínimo 12 caracteres')
  if (!/[A-Z]/.test(password)) errors.push('Requiere mayúscula')
  if (!/[a-z]/.test(password)) errors.push('Requiere minúscula')
  if (!/\d/.test(password)) errors.push('Requiere número')
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Requiere símbolo especial (!@#$%^&* etc)')
  }

  return { valid: errors.length === 0, errors }
}

export async function signUp(email: string, password: string) {
  const validation = validatePassword(password)
  if (!validation.valid) {
    throw new Error(validation.errors.join('. '))
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  }).data?.subscription
}
