import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // FUNÇÃO TRADUTORA DE ERROS DO SUPABASE
  function translateError(err) {
    if (!err) return null
    const msg = err.message || ''
    
    if (msg.includes('Invalid login credentials')) return 'Email ou password incorretos.'
    if (msg.includes('User already registered')) return 'Este email já está associado a uma conta.'
    if (msg.includes('Password should be at least')) return 'A password tem de ter pelo menos 6 caracteres.'
    if (msg.includes('Email rate limit exceeded')) return 'Muitas tentativas. Tenta novamente mais tarde.'
    if (msg.includes('To protect your account')) return 'Conta bloqueada temporariamente. Tenta mais tarde.'
    if (msg.includes('Email not confirmed')) return 'Por favor, confirma o teu email antes de entrar.'
    
    return 'Ocorreu um erro. Verifica os teus dados e tenta novamente.'
  }

  async function fetchProfile(userId) {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!err) profile.value = data
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    
    if (err) {
      error.value = translateError(err) // Aplica a tradução aqui
    } else {
      user.value = data.user
      await fetchProfile(data.user.id) 
    }
    loading.value = false
    return !err
  }

  async function register(email, password, name) {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: name } }
    })
    
    if (err) {
      error.value = translateError(err) // Aplica a tradução aqui
    } else {
      user.value = data.user
      // Aguarda 1 segundo para dar tempo ao Trigger do Postgres criar o perfil base
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualiza explicitamente o nome na tabela profiles
      if (name) {
        await supabase.from('profiles').update({ name: name }).eq('id', data.user.id)
      }
      
      await fetchProfile(data.user.id)
    }
    loading.value = false
    return !err
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  return { user, profile, loading, error, login, register, logout, fetchProfile }
})