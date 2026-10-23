<template>
  <q-layout view="lHh lpr lFf">
    <!-- O cabeçalho pesado foi removido para uma experiência totalmente imersiva -->
    
    <q-page-container>
      <router-view />
    </q-page-container>

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
        <q-route-tab name="games" icon="calendar_today" label="Jogos" :to="clubLink" exact class="custom-tab" :class="tabClass" />
        <q-route-tab name="players" icon="groups" label="Plantel" :to="playersLink" exact class="custom-tab" :class="tabClass" />
        <q-route-tab name="stats" icon="leaderboard" label="Estatísticas" :to="statsLink" exact class="custom-tab" :class="tabClass" />
        <q-route-tab v-if="isTreasurer" name="finances" icon="account_balance_wallet" label="Caixa" :to="financesLink" exact class="custom-tab col-3" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useClubStore } from 'stores/useClubStore'

const route = useRoute()
const clubStore = useClubStore()
const tab = ref('games')

const clubLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}` : '/selector')
const playersLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}/players` : '/selector')
const statsLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}/stats` : '/selector')


// NOVAS VARIÁVEIS DE TESOURARIA:
const isTreasurer = computed(() => clubStore.currentClub?.can_manage_finances || clubStore.currentClub?.is_owner)
const financesLink = computed(() => clubStore.currentClub ? `/club/${clubStore.currentClub.id}/finances` : '/selector')
const tabClass = computed(() => isTreasurer.value ? 'col-3' : 'col-4')
</script>

<style scoped>

.q-page {
  padding-bottom: 70px !important; 
}

</style>

