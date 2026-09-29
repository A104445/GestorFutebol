<template>
  <q-page class="flex flex-center page-light-premium q-pa-md" style="flex-direction: column;">
    
    <!-- CARTÃO: OS MEUS CLUBES -->
    <q-card class="shadow-1 q-mb-lg match-card-light" style="width: 100%; max-width: 500px;">
      <q-card-section class="club-header-block text-white text-center q-pa-lg">
        <div class="bg-white flex flex-center q-mx-auto shadow-2" style="width: 64px; height: 64px; border-radius: 16px; margin-bottom: 12px;">
          <q-icon name="sports_soccer" size="40px" color="green-9" />
        </div>
        <div class="text-h5 text-weight-bolder" style="letter-spacing: -0.5px;">Os Meus Clubes</div>
        <div class="text-caption text-green-2">Seleciona o teu balneário</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div v-if="clubStore.loading" class="text-center q-pa-md">
          <q-spinner color="green-9" size="30px" />
        </div>
        
        <q-list v-else-if="clubStore.userClubs.length > 0" separator class="rounded-borders">
          <q-item 
            v-for="club in clubStore.userClubs" 
            :key="club.id" 
            clickable 
            v-ripple
            @click="selectClub(club)"
            class="q-py-md inner-info-box q-mb-sm transition-hover"
          >
            <q-item-section avatar>
              <q-avatar color="grey-2" text-color="green-9" icon="shield" />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold text-dark">{{ club.name }}</q-item-label>
              <q-item-label caption class="text-grey-6">{{ club.role === 'admin' ? 'Administrador' : 'Membro' }}</q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-5" />
            </q-item-section>
          </q-item>
        </q-list>
        
        <div v-else class="text-center q-pa-md text-grey-6">
          Ainda não pertences a nenhum clube.
        </div>
      </q-card-section>
      
      <q-card-actions align="center" class="q-px-md q-pb-md q-pt-none">
        <q-btn color="amber-8" text-color="dark" icon="add" label="Criar Novo Clube" class="full-width text-weight-bolder shadow-1" style="border-radius: 8px;" unelevated @click="showCreateModal = true" />
      </q-card-actions>
    </q-card>

    <!-- CARTÃO: ENTRAR NUM CLUBE PRIVADO -->
    <q-card class="shadow-1 match-card-light" style="width: 100%; max-width: 500px; border-top: 4px solid #2E7D32;">
      <q-card-section class="q-pa-md">
        <div class="text-subtitle1 text-weight-bolder text-dark row items-center q-mb-sm">
          <q-icon name="vpn_key" color="green-9" class="q-mr-sm" size="sm" />
          Entrar com Código
        </div>
        <p class="text-caption text-grey-6 q-mb-md">Recebeste um convite? Introduz o código para te juntares ao plantel.</p>
        
        <div class="row q-gutter-sm items-center">
          <q-input 
            v-model="inviteCode" 
            dense 
            outlined 
            label="Código do Clube" 
            placeholder="Ex: FC-1234"
            class="col" 
            bg-color="grey-1" 
            color="green-9"
            input-style="text-transform: uppercase; font-weight: bold;"
            @keyup.enter="joinClubByCode"
          />
          <q-btn 
            color="green-9" 
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

  // 2. Tentar inserir o utilizador no clube (COM STATUS PENDING)
  const { error: joinError } = await supabase
    .from('club_members')
    .insert([{
      club_id: club.id,
      profile_id: authStore.user.id,
      role: 'member', 
      is_owner: false,
      status: 'pending' // <-- OBRIGA A FICAR PENDENTE
    }])

  if (joinError) {
    // Código de erro Postgres para chave duplicada (já é membro ou já pediu para entrar)
    if (joinError.code === '23505') {
      $q.notify({ type: 'info', message: `Já fazes parte ou já tens um pedido pendente no clube ${club.name}!` })
      // Tenta atualizar a lista de clubes para ver se já está aprovado
      await clubStore.fetchUserClubs() 
    } else {
      $q.notify({ type: 'negative', message: 'Erro ao entrar no clube: ' + joinError.message })
    }
  } else {
    // SEGUNDA ALTERAÇÃO: Não redirecionamos para o clube, mostramos apenas a mensagem!
    $q.notify({ 
      type: 'positive', 
      icon: 'hourglass_empty', 
      message: `Pedido de adesão enviado para o ${club.name}! Aguarda aprovação da equipa técnica.` 
    })
    inviteCode.value = ''
  }

  joining.value = false
}
</script>

<style scoped>
.page-light-premium {
  background-color: #f0fdf4;
  min-height: 100vh;
}
.club-header-block {
  background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%);
  border-radius: 16px 16px 0 0; /* Arredonda só o topo no seletor */
}
.match-card-light {
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}
.inner-info-box {
  background-color: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.transition-hover {
  transition: all 0.2s ease;
}
.transition-hover:hover {
  background-color: #f1f5f9;
  transform: translateX(4px);
}
</style>