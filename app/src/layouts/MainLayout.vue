<template>
  <q-layout view="lHh lpr lFf">
    
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-icon name="sports_soccer" size="md" class="q-mr-sm" />
        
        <q-toolbar-title class="text-weight-bold text-ellipsis" style="font-size: 1.2rem;">
          {{ clubStore.currentClub ? clubStore.currentClub.name : 'Gestor de Futebol' }}
        </q-toolbar-title>
        
        <q-btn 
          v-if="clubStore.currentClub && route.path !== '/selector'" 
          flat round dense icon="swap_horiz" 
          class="q-mr-sm" 
          to="/selector" 
          @click="clearCurrentClub"
        >
          <q-tooltip>Mudar de Clube</q-tooltip>
        </q-btn>

        <q-btn flat round dense icon="logout" @click="handleLogout">
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="clubStore.currentClub && route.path !== '/selector'" elevated class="bg-white text-grey-8 shadow-up-2">
      <q-tabs
        v-model="tab"
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-6"
        align="justify"
      >
      <q-route-tab name="games" icon="calendar_month" label="Jogos" :to="clubLink" exact />
      <q-route-tab name="players" icon="badge" label="Plantel" :to="playersLink" exact />
      <q-route-tab name="stats" icon="leaderboard" label="Ranking" :to="statsLink" exact />
      </q-tabs>
    </q-footer>
    
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/useAuthStore'
import { useClubStore } from 'stores/useClubStore'

const router = useRouter()
const route = useRoute() // Permite saber em que rota estamos no momento
const authStore = useAuthStore()
const clubStore = useClubStore()

const tab = ref('games')

const clubLink = computed(() => {
  return clubStore.currentClub ? `/club/${clubStore.currentClub.id}` : '/selector'
})

const playersLink = computed(() => {
  return clubStore.currentClub ? `/club/${clubStore.currentClub.id}/players` : '/selector'
})

const statsLink = computed(() => {
  return clubStore.currentClub ? `/club/${clubStore.currentClub.id}/stats` : '/selector'
})

function clearCurrentClub() {
  // Limpa o clube ativo quando clicamos em "Mudar de Clube" 
  // para garantir que a barra inferior desaparece suavemente
  clubStore.setClub(null)
}

async function handleLogout() {
  await authStore.logout()
  clubStore.setClub(null)
  router.push('/login')
}
</script>