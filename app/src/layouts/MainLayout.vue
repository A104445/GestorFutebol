<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- POP-UP SUAVE DE INSTALAÇÃO PWA -->
    <transition name="slide-up">
      <div v-if="showInstallPrompt" class="fixed-bottom q-pa-md z-max" style="padding-bottom: 75px;">
        <q-card class="bg-dark text-white shadow-10 q-pa-sm" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.15);">
          <q-card-section class="row items-center q-pa-sm">
            <div class="bg-primary flex flex-center shadow-1 q-mr-md" style="width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;">
              <q-icon name="get_app" size="24px" color="white" />
            </div>
            <div class="col" style="min-width: 0;">
              <div class="text-weight-bold text-subtitle2">{{ t('layout.pwa.installTitle') }}</div>
              <div class="text-caption text-grey-4 text-ellipsis">
                {{ isIOS ? t('layout.pwa.installDescIOS') : t('layout.pwa.installDescAndroid') }}
              </div>
            </div>
            <div class="row q-gutter-x-xs items-center" style="flex-shrink: 0;">
              <q-btn v-if="!isIOS" unelevated color="primary" :label="t('layout.pwa.btnInstall')" size="sm" class="text-weight-bold" style="border-radius: 8px;" @click="installPwa" />
              <q-btn flat round dense icon="close" color="grey-4" size="sm" @click="dismissInstall" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </transition>

    <!-- POP-UP DE NOTIFICAÇÕES -->
    <transition name="slide-up">
      <div v-if="showNotificationPrompt" class="fixed-bottom q-pa-md z-max" style="padding-bottom: 75px;">
        <q-card class="bg-blue-9 text-white shadow-10 q-pa-sm" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.15);">
          <q-card-section class="row items-center q-pa-sm">
            <div class="bg-blue-10 flex flex-center shadow-1 q-mr-md" style="width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;">
              <q-icon name="notifications_active" size="24px" color="white" />
            </div>
            <div class="col" style="min-width: 0;">
              <div class="text-weight-bold text-subtitle2">{{ t('layout.push.title') }}</div>
              <div class="text-caption text-blue-2 text-ellipsis">
                {{ t('layout.push.desc') }}
              </div>
            </div>
            <div class="row q-gutter-x-xs items-center" style="flex-shrink: 0;">
              <q-btn unelevated color="white" text-color="blue-9" :label="t('layout.push.btnEnable')" size="sm" class="text-weight-bold" style="border-radius: 8px;" @click="subscribeToPush" :loading="pushLoading" />
              <q-btn flat round dense icon="close" color="blue-2" size="sm" @click="dismissNotificationPrompt" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </transition>

    <!-- Barra de Navegação Inferior Discreta -->
    <q-footer v-if="clubStore.currentClub && route.path !== '/selector'" elevated class="bg-white fixed-bottom" style="z-index: 9999; position: fixed !important; bottom: 0; left: 0; width: 100%;">
      <q-tabs
        v-model="tab"
        active-color="amber-8"
        indicator-color="transparent"
        class="text-grey-4"
        align="justify"
        dense
        style="height: 65px; background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%);"
      >
        <q-route-tab name="games" icon="calendar_today" :label="t('layout.tabs.games')" :to="clubLink" exact class="custom-tab" :class="tabClass" />
        <q-route-tab name="players" icon="groups" :label="t('layout.tabs.players')" :to="playersLink" exact class="custom-tab" :class="tabClass" />
        <q-route-tab name="stats" icon="leaderboard" :label="t('layout.tabs.stats')" :to="statsLink" exact class="custom-tab" :class="tabClass" />
        <q-route-tab v-if="isTreasurer" name="finances" icon="account_balance_wallet" :label="t('layout.tabs.finances')" :to="financesLink" exact class="custom-tab col-3" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClubStore } from 'stores/useClubStore'
import { useAuthStore } from 'stores/useAuthStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const clubStore = useClubStore()
const authStore = useAuthStore()
const $q = useQuasar()
const { t } = useI18n()

const tab = ref('games')
const clubLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}` : '/selector')
const playersLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}/players` : '/selector')
const statsLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}/stats` : '/selector')

const isTreasurer = computed(() => clubStore.currentClub?.can_manage_finances || clubStore.currentClub?.is_owner)
const financesLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}/finances` : '/selector')
const tabClass = computed(() => isTreasurer.value ? 'col-3' : 'col-4')

const showInstallPrompt = ref(false)
let deferredPrompt = null
const isIOS = ref(false)

const showNotificationPrompt = ref(false)
const pushLoading = ref(false)

const publicVapidKey = 'BAIWjICJdFp3yAQbUikAgqlj5AMRA-4leNY4dUZ7YnHoNOYEJZnzEQ-NKCf6ntQRdMJ4Uni4oXA3Evt2ejUCloQ';

onMounted(async () => {
  const ua = window.navigator.userAgent
  isIOS.value = /iphone|ipad|ipod/.test(ua.toLowerCase())

  if (isIOS.value && !localStorage.getItem('pwa_dismissed')) {
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone)
    if (!isInStandaloneMode) {
      showInstallPrompt.value = true
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    if (!localStorage.getItem('pwa_dismissed')) {
      showInstallPrompt.value = true
    }
  })

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const permission = Notification.permission
    if (permission === 'default' && !localStorage.getItem('push_dismissed')) {
      setTimeout(() => {
        if (!showInstallPrompt.value) showNotificationPrompt.value = true
      }, 4000)
    }
  }
})

async function installPwa() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('Utilizador aceitou instalar a PWA')
    }
    deferredPrompt = null
    showInstallPrompt.value = false
  }
}

function dismissInstall() {
  showInstallPrompt.value = false
  localStorage.setItem('pwa_dismissed', 'true')
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeToPush() {
  try {
    pushLoading.value = true
    
    if (!('Notification' in window)) {
      $q.notify({ type: 'negative', message: t('layout.push.errNotSupported') })
      dismissNotificationPrompt()
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      $q.notify({ type: 'warning', message: t('layout.push.errDenied') })
      dismissNotificationPrompt()
      return
    }

    if (!('serviceWorker' in navigator)) {
      $q.notify({ type: 'negative', message: t('layout.push.errNoWorker') })
      return
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })

    const subData = subscription.toJSON ? subscription.toJSON() : subscription

    if (authStore.user) {
      const { error } = await supabase.from('push_subscriptions').insert([{
        profile_id: authStore.user.id,
        subscription: subData
      }])
      
      if (error && error.code !== '23505') { 
        console.error("Erro Supabase:", error)
        throw error
      }
    }
    
    $q.notify({ type: 'positive', icon: 'notifications_active', message: t('layout.push.successEnabled') })
    showNotificationPrompt.value = false
    
  } catch (err) {
    console.error('Erro no Push:', err)
    $q.notify({ type: 'negative', message: t('layout.push.errGeneric') + ' ' + (err.message || '') })
  } finally {
    pushLoading.value = false
  }
}

function dismissNotificationPrompt() {
  showNotificationPrompt.value = false
  localStorage.setItem('push_dismissed', 'true')
}
</script>

<style scoped>
.q-page {
  padding-bottom: 70px !important;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>