<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md" style="flex-direction: column;">
    
    <q-card class="shadow-2 q-mb-lg" style="width: 100%; max-width: 500px; border-radius: 12px;">
      <q-card-section class="bg-primary text-white text-center">
        <q-icon name="shield" size="3em" />
        <div class="text-h5 q-mt-sm">Os Meus Clubes</div>
      </q-card-section>

      <q-card-section>
        <div v-if="clubStore.loading" class="text-center q-pa-md">
          <q-spinner color="primary" size="30px" />
        </div>

        <q-list v-else-if="clubStore.userClubs.length > 0" separator bordered class="rounded-borders">
          <q-item 
            v-for="club in clubStore.userClubs" 
            :key="club.id" 
            clickable 
            v-ripple
            @click="selectClub(club)"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="sports_soccer" />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ club.name }}</q-item-label>
              <q-item-label caption>{{ club.role === 'admin' ? 'Administrador' : 'Membro' }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="text-center q-pa-md text-grey-7">
          Ainda não pertences a nenhum clube.
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-md">
        <q-btn color="secondary" icon="add" label="Criar Novo Clube" @click="showCreateModal = true" />
      </q-card-actions>
    </q-card>

    <q-card class="shadow-2" style="width: 100%; max-width: 500px; border-radius: 12px; border-top: 4px solid var(--q-primary);">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bolder text-dark row items-center q-mb-sm">
          <q-icon name="vpn_key" color="primary" class="q-mr-sm" size="sm" />
          Entrar num Clube Privado
        </div>
        <p class="text-caption text-grey-7 q-mb-md">Recebeste um código de convite? Introduz-o abaixo para te juntares ao plantel.</p>
        
        <div class="row q-gutter-sm items-center">
          <q-input 
            v-model="inviteCode" 
            dense 
            outlined 
            label="Código do Clube" 
            placeholder="Ex: FC-1234"
            class="col"
            bg-color="grey-1"
            input-style="text-transform: uppercase;"
            @keyup.enter="joinClubByCode"
          />
          <q-btn 
            color="primary" 
            label="Aderir" 
            unelevated 
            class="text-weight-bold" 
            :loading="joining" 
            @click="joinClubByCode" 
            style="padding: 8px 20px; border-radius: 8px;"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showCreateModal">
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6">Novo Clube</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input filled v-model="newClubName" label="Nome do Clube" autofocus @keyup.enter="createClub" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Criar" @click="createClub" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClubStore } from 'stores/useClubStore'
import { useAuthStore } from 'stores/useAuthStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const router = useRouter()
const clubStore = useClubStore()
const authStore = useAuthStore()
const $q = useQuasar()

const showCreateModal = ref(false)
const newClubName = ref('')
const saving = ref(false)

// Variáveis para o Código de Convite
const inviteCode = ref('')
const joining = ref(false)

onMounted(() => {
  clubStore.fetchUserClubs()
})

function selectClub(club) {
  clubStore.setClub(club)
  router.push(`/club/${club.id}`) // Navega para o dashboard do clube
}

function generateComplexCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function createClub() {
  if (!newClubName.value) return
  saving.value = true

  const { data: clubData, error: clubError } = await supabase
    .from('clubs')
    .insert([{ 
      name: newClubName.value,
      invite_code: generateComplexCode() // <-- GERA E GUARDA O CÓDIGO
    }])
    .select()
    .single()

  if (clubError) {
    $q.notify({ type: 'negative', message: 'Erro ao criar clube: ' + clubError.message})
    saving.value = false
    return
  }

  // 2. Adiciona o utilizador que criou como 'admin' na tabela 'club_members'
  const { error: memberError } = await supabase
    .from('club_members')
    .insert([{ 
      club_id: clubData.id, 
      profile_id: authStore.user.id, 
      role: 'admin' 
    }])

  if (!memberError) {
    $q.notify({ type: 'positive', message: 'Clube criado com sucesso!' })
    showCreateModal.value = false
    newClubName.value = ''
    await clubStore.fetchUserClubs()
  }
  saving.value = false
}

// Nova função para processar a adesão via código
async function joinClubByCode() {
  const code = inviteCode.value.trim().toUpperCase()
  if (!code) {
    $q.notify({ type: 'warning', message: 'Por favor, introduz um código.' })
    return
  }

  joining.value = true

  // 1. Procurar se existe algum clube com este código
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('id, name')
    .eq('invite_code', code)
    .maybeSingle()

  if (clubError || !club) {
    $q.notify({ type: 'negative', message: 'Código inválido! Confirma com o administrador do clube.' })
    joining.value = false
    return
  }

  // 2. Tentar inserir o utilizador no clube
  const { error: joinError } = await supabase
    .from('club_members')
    .insert([{
      club_id: club.id,
      profile_id: authStore.user.id,
      role: 'member', 
      is_owner: false
    }])

  if (joinError) {
    // Código de erro Postgres para chave duplicada (já é membro)
    if (joinError.code === '23505') {
      $q.notify({ type: 'info', message: `Já fazes parte do clube ${club.name}!` })
      clubStore.setClub(club)
      router.push(`/club/${club.id}`)
    } else {
      $q.notify({ type: 'negative', message: 'Erro ao entrar no clube: ' + joinError.message })
    }
  } else {
    $q.notify({ 
      type: 'positive', 
      icon: 'sports_soccer', 
      message: `Bem-vindo ao ${club.name}! Teu contrato foi assinado.` 
    })
    inviteCode.value = ''
    clubStore.setClub(club)
    router.push(`/club/${club.id}`)
  }

  joining.value = false
}
</script>