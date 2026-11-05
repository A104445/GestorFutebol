<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md text-center" style="max-width: 400px; width: 100%; border-radius: 12px;">
      <q-card-section>
        <q-spinner-soccer color="primary" size="3em" />
        <div class="text-h6 q-mt-md">{{ t('join.processing') }}</div>
        <div class="text-caption text-grey">{{ t('join.entering') }}</div>
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
import { useI18n } from 'vue-i18n'

const props = defineProps(['id'])
const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()
const { t } = useI18n()

onMounted(async () => {
  if (!authStore.user) {
    localStorage.setItem('pending_club_join', props.id)
    $q.notify({ type: 'user', message: t('join.errLogin') })
    router.push('/login')
    return
  }
  await joinClubLogic(props.id, authStore.user.id)
})

async function joinClubLogic(clubId, userId) {
  const { error } = await supabase
    .from('club_members')
    .insert([{ club_id: clubId, profile_id: userId, role: 'member', status: 'pending' }])

  if (error && error.code !== '23505') { 
    $q.notify({ type: 'negative', message: t('join.errSend') + error.message })
  } else if (error && error.code === '23505') {
    $q.notify({ type: 'info', message: t('join.infoPending') })
  } else {
    $q.notify({ type: 'positive', icon: 'hourglass_empty', message: t('join.success') })
  }
  
  router.push('/selector')
}
</script>