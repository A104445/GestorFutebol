<template>
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page class="flex flex-center bg-grey-2">
          
          <q-card class="q-pa-md shadow-2" style="width: 100%; max-width: 400px; border-radius: 12px;">
            <q-card-section class="text-center">
              <q-icon name="sports_soccer" size="3em" color="primary" />
              <div class="text-h5 q-mt-sm q-mb-xs">Gestor de Futebol</div>
              <div class="text-caption text-grey">Entra para organizar a tua equipa</div>
            </q-card-section>
  
            <q-card-section>
              <q-form @submit.prevent="handleLogin" class="q-gutter-md">
                <q-input 
                  filled 
                  v-model="email" 
                  type="email" 
                  label="Email" 
                  lazy-rules
                  :rules="[val => !!val || 'Por favor insere o teu email']"
                />
  
                <q-input 
                  filled 
                  v-model="password" 
                  type="password" 
                  label="Password"
                  lazy-rules
                  :rules="[val => !!val || 'Por favor insere a tua password']"
                />
  
                <div v-if="authStore.error" class="text-negative text-center q-mt-sm">
                  {{ authStore.error }}
                </div>
  
                <div class="q-mt-lg row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-btn 
                      class="full-width" 
                      color="primary" 
                      label="Entrar" 
                      type="submit" 
                      :loading="authStore.loading" 
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-btn 
                      class="full-width" 
                      color="secondary" 
                      outline
                      label="Registar" 
                      @click="handleRegister"
                      :loading="authStore.loading" 
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
  
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from 'stores/useAuthStore'
  import { useQuasar } from 'quasar'
  
  const email = ref('')
  const password = ref('')
  const authStore = useAuthStore()
  const router = useRouter()
  const $q = useQuasar()
  
  async function handleLogin() {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      $q.notify({ type: 'positive', message: 'Sessão iniciada com sucesso!' })
      router.push('/') // Mais tarde mudamos para o dashboard real
    }
  }
  
  async function handleRegister() {
    // Uma validação simples antes de tentar registar
    if (!email.value || !password.value) {
      $q.notify({ type: 'warning', message: 'Preenche o email e a password primeiro.' })
      return
    }
    
    const success = await authStore.register(email.value, password.value)
    if (success) {
      $q.notify({ type: 'positive', message: 'Conta criada! Confirma o teu email (se ativaste isso no Supabase) ou entra diretamente.' })
      router.push('/')
    }
  }
  </script>