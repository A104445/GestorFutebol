import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

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
      error.value = err.message
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
      error.value = err.message
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

  // A LINHA QUE FALTAVA PARA RESOLVER O ERRO DO ESLINT:
  return { user, profile, loading, error, login, register, logout, fetchProfile }
})