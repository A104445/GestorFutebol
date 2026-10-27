<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <!-- Fundo Menta Premium para o Login -->
      <q-page class="flex flex-center page-bg relative-position q-pa-md">
        
        <!-- ======================================================= -->
        <!-- ECRÃ DE ONBOARDING (Explicação Inicial)                 -->
        <!-- ======================================================= -->
        <transition name="fade">
          <div v-if="showOnboarding" class="fixed-full column flex-center z-max text-white onboarding-bg">
            
            <q-carousel
              v-model="slide"
              transition-prev="slide-right"
              transition-next="slide-left"
              swipeable
              animated
              control-color="primary"
              navigation
              arrows
              padding
              height="400px"
              class="bg-transparent full-width"
              style="max-width: 500px;"
            >
              <!-- Slide 1: A App -->
              <q-carousel-slide name="1" class="column no-wrap flex-center text-center">
                <q-icon name="sports_soccer" size="6em" color="primary" class="q-mb-md animate-bounce" />
                <div class="text-h4 text-weight-bolder font-fut">Gestor de Futebol</div>
                <div class="text-body1 text-grey-4 q-mt-md px-md">
                  A tua app de balneário. Organiza peladas, convoca amigos e domina o campo.
                </div>
              </q-carousel-slide>

              <!-- Slide 2: Gestão -->
              <q-carousel-slide name="2" class="column no-wrap flex-center text-center">
                <q-icon name="groups" size="6em" color="amber-8" class="q-mb-md" />
                <div class="text-h4 text-weight-bolder font-fut">O Teu Plantel</div>
                <div class="text-body1 text-grey-4 q-mt-md px-md">
                  Equilibra as equipas automaticamente e gere as presenças num piscar de olhos.
                </div>
              </q-carousel-slide>

              <!-- Slide 3: MVP -->
              <q-carousel-slide name="3" class="column no-wrap flex-center text-center">
                <q-icon name="workspace_premium" size="6em" color="blue-8" class="q-mb-md" />
                <div class="text-h4 text-weight-bolder font-fut">Eleição do MVP</div>
                <div class="text-body1 text-grey-4 q-mt-md px-md">
                  No fim do jogo, avalia os teus colegas anonimamente e descobre quem leva a Bola de Ouro!
                </div>
              </q-carousel-slide>
            </q-carousel>

            <div class="q-mt-xl full-width q-px-xl" style="max-width: 400px;">
              <q-btn 
                color="primary" 
                class="full-width text-weight-bolder shadow-3" 
                size="lg" 
                style="border-radius: 12px; font-size: 1.1rem;" 
                label="Começar a Jogar" 
                @click="finishOnboarding" 
              />
            </div>
          </div>
        </transition>

        <!-- ======================================================= -->
        <!-- CARTÃO DE LOGIN / REGISTO                               -->
        <!-- ======================================================= -->
        <transition name="slide-up">
          <q-card v-show="!showOnboarding" class="q-pa-md shadow-10 login-card" style="width: 100%; max-width: 400px; border-radius: 24px; z-index: 1;">
            
            <q-card-section class="text-center q-pb-none">
              <div class="bg-grey-2 flex flex-center q-mx-auto shadow-1" style="width: 64px; height: 64px; border-radius: 16px; margin-bottom: 12px;">
                <q-icon name="sports_soccer" size="40px" color="primary" />
              </div>
              <div class="text-h5 text-weight-bolder font-fut q-mt-sm">
                {{ isRegisterMode ? 'Criar Conta' : 'Iniciar Sessão' }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs q-mb-md">
                {{ isRegisterMode ? 'Preenche os teus dados para entrar no plantel' : 'Bem-vindo de volta ao balneário' }}
              </div>
            </q-card-section>

            <q-card-section>
              <q-form @submit.prevent="handleSubmit" class="q-gutter-y-md">
                
                <!-- NOME (Apenas no Registo) -->
                <q-input
                  v-if="isRegisterMode"
                  outlined
                  bg-color="grey-1"
                  color="primary"
                  v-model="name"
                  type="text"
                  label="O teu Nome (ex: Rui Costa)"
                  :rules="[val => !!val || 'O nome é obrigatório']"
                  lazy-rules
                >
                  <template v-slot:prepend><q-icon name="person" /></template>
                </q-input>

                <!-- EMAIL (Com validação de Regex) -->
                <q-input 
                  outlined 
                  bg-color="grey-1"
                  color="primary"
                  v-model="email" 
                  type="email" 
                  label="Email" 
                  :rules="[
                    val => !!val || 'O email é obrigatório',
                    val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Introduz um email válido (ex: jogador@mail.com)'
                  ]"
                  lazy-rules
                >
                  <template v-slot:prepend><q-icon name="email" /></template>
                </q-input>

                <!-- PASSWORD (Com Olhinho) -->
                <q-input 
                  outlined 
                  bg-color="grey-1"
                  color="primary"
                  v-model="password" 
                  :type="isPwd ? 'password' : 'text'" 
                  label="Password" 
                  :rules="[
                    val => !!val || 'A password é obrigatória',
                    val => val.length >= 6 || 'A password tem de ter no mínimo 6 caracteres'
                  ]"
                  lazy-rules
                >
                  <template v-slot:prepend><q-icon name="lock" /></template>
                  <template v-slot:append>
                    <q-icon 
                      :name="isPwd ? 'visibility_off' : 'visibility'" 
                      class="cursor-pointer" 
                      @click="isPwd = !isPwd" 
                    />
                  </template>
                </q-input>

                <div v-if="authStore.error" class="text-negative text-center text-weight-bold q-mt-sm bg-red-1 q-pa-sm" style="border-radius: 8px;">
                  <q-icon name="warning" class="q-mr-xs" /> {{ authStore.error }}
                </div>

                <!-- BOTÃO PRINCIPAL -->
                <div class="q-mt-lg">
                  <q-btn 
                    class="full-width text-weight-bolder shadow-2" 
                    color="primary" 
                    :label="isRegisterMode ? 'Registar e Entrar' : 'Entrar no Balneário'" 
                    type="submit" 
                    size="lg"
                    style="border-radius: 12px;"
                    :loading="authStore.loading" 
                  />
                </div>

                <!-- TROCAR ENTRE LOGIN E REGISTO -->
                <div class="text-center q-mt-sm">
                  <q-btn 
                    flat 
                    no-caps 
                    color="grey-8" 
                    class="text-weight-bold"
                    :label="isRegisterMode ? 'Já tenho conta? Iniciar Sessão' : 'Ainda não tens conta? Criar Conta'" 
                    @click="toggleMode" 
                  />
                </div>

                <!-- ESQUECI-ME DA PASSWORD (Apenas no Login) -->
                <div v-if="!isRegisterMode" class="text-center q-mt-sm">
                  <q-btn flat no-caps color="grey-6" size="sm" class="text-weight-bold" label="Esqueceste-te da password?" @click="showResetModal = true" />
                </div>

                <q-separator class="q-my-md" />

                <!-- LOGIN COM GOOGLE -->
                <q-btn 
                  class="full-width text-weight-bold shadow-1 bg-white text-dark" 
                  icon="img:https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  label="Continuar com o Google" 
                  style="border-radius: 12px; border: 1px solid #e2e8f0;"
                  @click="handleGoogleLogin" 
                />
              </q-form>
            </q-card-section>

          </q-card>
        </transition>

        <!-- MODAL RECUPERAÇÃO DE PASSWORD -->
        <q-dialog v-model="showResetModal">
          <q-card style="min-width: 320px; border-radius: 16px;">
            <q-card-section class="bg-dark text-white row items-center q-py-md">
              <div class="text-subtitle1 text-weight-bold">Recuperar Password</div>
              <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
            </q-card-section>
            <q-card-section class="q-pa-md">
              <div class="text-caption text-grey-8 q-mb-md">Introduz o teu email. Vais receber um link seguro para redefinir a tua password.</div>
              <q-input outlined dense v-model="resetEmail" type="email" label="O teu Email" color="primary" bg-color="grey-1" />
            </q-card-section>
            <q-card-actions align="right" class="bg-grey-1 q-pa-md">
              <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
              <q-btn label="Enviar Link" color="primary" unelevated style="border-radius: 8px;" @click="sendResetEmail" :loading="resetting" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/useAuthStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const name = ref('')
const email = ref('')
const password = ref('')
const isRegisterMode = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

// Variáveis do Onboarding
const showOnboarding = ref(false)
const slide = ref('1')
const isPwd = ref(true)

onMounted(() => {
  // Verifica se é a primeira vez que a pessoa abre a app
  const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding')
  if (!hasSeenOnboarding) {
    showOnboarding.value = true
  }
})

const showResetModal = ref(false)
const resetEmail = ref('')
const resetting = ref(false)

async function sendResetEmail() {
  if (!resetEmail.value) return
  resetting.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, {
    redirectTo: window.location.origin + '/login'
  })
  if (error) {
    $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Email de recuperação enviado! Verifica a tua caixa de correio.' })
    showResetModal.value = false
    resetEmail.value = ''
  }
  resetting.value = false
}

function finishOnboarding() {
  showOnboarding.value = false
  localStorage.setItem('has_seen_onboarding', 'true')
}

function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value
  authStore.error = null 
}

async function handleSubmit() {
  if (isRegisterMode.value) {
    const success = await authStore.register(email.value, password.value, name.value)
    if (success) {
      $q.dialog({
        title: 'Confirma o teu Email',
        message: 'Conta criada com sucesso! Enviámos um link de confirmação para a tua caixa de correio. Por favor, valida o email antes de entrares no balneário.',
        ok: { label: 'Entendido', color: 'primary', unelevated: true }
      })
      isRegisterMode.value = false // Passa para o modo de login
    }
  } else {
    const success = await authStore.login(email.value, password.value)
    if (success) redirectUser()
  }
}

async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
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

<style scoped>
.font-fut {
  font-family: 'Impact', 'Arial Black', sans-serif;
  letter-spacing: -0.5px;
}

.page-bg {
  background-color: #f0fdf4;
}

.onboarding-bg {
  background: linear-gradient(135deg, #111928 0%, #1a3a24 100%);
}

.login-card {
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.05);
}

/* Animações suaves para as transições */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>