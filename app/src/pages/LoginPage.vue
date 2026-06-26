<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        
        <q-card class="q-pa-md shadow-2" style="width: 100%; max-width: 400px; border-radius: 12px;">
          <q-card-section class="text-center">
            <q-icon name="sports_soccer" size="3em" color="primary" />
            <div class="text-h5 q-mt-sm q-mb-xs">Gestor de Futebol</div>
            <div class="text-caption text-grey">
              {{ isRegisterMode ? 'Cria a tua conta e entra em campo' : 'Entra para organizar a tua equipa' }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
              
              <q-input 
                v-if="isRegisterMode" 
                filled 
                v-model="name" 
                type="text" 
                label="O teu Nome (ex: Rui Costa)" 
              />

              <q-input filled v-model="email" type="email" label="Email" />
              <q-input filled v-model="password" type="password" label="Password" />

              <div v-if="authStore.error" class="text-negative text-center q-mt-sm">
                {{ authStore.error }}
              </div>

              <div class="q-mt-md">
                <q-btn 
                  class="full-width text-weight-bold" 
                  color="primary" 
                  :label="isRegisterMode ? 'Criar Conta' : 'Entrar'" 
                  type="submit" 
                  :loading="authStore.loading" 
                />
              </div>

              <div class="text-center q-mt-sm">
                <q-btn 
                  flat 
                  no-caps 
                  color="grey-8" 
                  :label="isRegisterMode ? 'Já tenho conta? Iniciar Sessão' : 'Ainda não tens conta? Registar-me'" 
                  @click="toggleMode" 
                />
              </div>

              <q-separator class="q-my-md" />

              <q-btn 
                class="full-width text-weight-bold shadow-1" 
                color="white" 
                text-color="dark" 
                icon="img:https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                label="Entrar com Google" 
                @click="handleGoogleLogin" 
              />
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
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

// Variáveis do formulário
const name = ref('')
const email = ref('')
const password = ref('')
const isRegisterMode = ref(false) // Controla se estamos a registar ou a fazer login

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

// Função que troca a interface entre Login e Registo
function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value
  authStore.error = null // Limpa erros antigos ao trocar
}

async function handleSubmit() {
  // Validações Básicas
  if (!email.value || !password.value) {
    $q.notify({ type: 'warning', message: 'Preenche os campos obrigatórios.' })
    return
  }

  // Se estivermos em Modo Registo
  if (isRegisterMode.value) {
    if (!name.value) {
      $q.notify({ type: 'warning', message: 'Por favor, introduz o teu nome.' })
      return
    }
    const success = await authStore.register(email.value, password.value, name.value)
    if (success) {
      $q.notify({ type: 'positive', message: 'Conta criada com sucesso!' })
      redirectUser()
    }
  } 
  // Se estivermos em Modo Login Normal
  else {
    const success = await authStore.login(email.value, password.value)
    if (success) redirectUser()
  }
}

async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) $q.notify({ type: 'negative', message: error.message })
}

function redirectUser() {
  $q.notify({ type: 'positive', message: 'Sessão iniciada com sucesso!' })
  const pendingClubId = localStorage.getItem('pending_club_join')
  if (pendingClubId) {
    localStorage.removeItem('pending_club_join')
    router.push(`/join/${pendingClubId}`)
  } else {
    router.push('/')
  }
}
</script>