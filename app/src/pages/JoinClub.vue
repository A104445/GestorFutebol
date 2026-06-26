<template>
    <q-page class="flex flex-center bg-grey-2">
      <q-card class="q-pa-md text-center" style="max-width: 400px; width: 100%; border-radius: 12px;">
        <q-card-section>
          <q-spinner-soccer color="primary" size="3em" />
          <div class="text-h6 q-mt-md">A processar convite...</div>
          <div class="text-caption text-grey">A entrar no teu novo clube de futebol.</div>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from 'stores/useAuthStore'
  import { supabase } from 'boot/supabase'
  import { useQuasar } from 'quasar'
  
  const props = defineProps(['id'])
  const router = useRouter()
  const authStore = useAuthStore()
  const $q = useQuasar()
  
  onMounted(async () => {
    // 1. Se o utilizador não está logado, guardamos o clube pendente e mandamos para o login
    if (!authStore.user) {
      localStorage.setItem('pending_club_join', props.id)
      $q.notify({ type: 'user', message: 'Inicia sessão ou cria conta para entrar no clube!' })
      router.push('/login')
      return
    }
  
    // 2. Se já está logado, adiciona-o ao clube
    await joinClubLogic(props.id, authStore.user.id)
  })
  
  async function joinClubLogic(clubId, userId) {
    const { error } = await supabase
      .from('club_members')
      .insert([{ club_id: clubId, profile_id: userId, role: 'member' }])
  
    if (error && error.code !== '23505') { // Descartar erro caso ele já seja membro (duplicado)
      $q.notify({ type: 'negative', message: 'Erro ao entrar no clube: ' + error.message })
      router.push('/selector')
    } else {
      $q.notify({ type: 'positive', message: 'Bem-vindo ao clube!' })
      router.push(`/club/${clubId}`)
    }
  }
  </script>