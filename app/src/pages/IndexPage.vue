<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h5 class="q-my-none text-weight-bold text-primary">Próximas Peladas</h5>
        <p class="text-caption text-grey-7 q-mb-none">Garante o teu lugar em campo</p>
      </div>
      <q-btn flat round icon="logout" color="negative" @click="handleLogout" />
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="matches.length === 0" class="text-center q-pa-xl text-grey-6">
      <q-icon name="sports_soccer" size="4em" class="q-mb-md text-grey-4" />
      <div class="text-h6">Nenhum jogo agendado</div>
      <p v-if="authStore.profile?.role === 'admin'">Cria uma nova partida no botão abaixo!</p>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="match in matches" :key="match.id" class="col-12 col-md-6">
        <q-card flat bordered class="my-card shadow-1">
          <q-card-section class="bg-primary text-white row items-center justify-between">
            <div class="text-subtitle1 text-weight-medium">
              <q-icon name="event" class="q-mr-xs" />
              {{ formatDate(match.date) }}
            </div>
            <q-chip dense square color="white" text-color="primary" class="text-weight-bold">
              {{ match.status.toUpperCase() }}
            </q-chip>
          </q-card-section>

          <q-card-section class="q-py-sm">
            <div class="row items-center q-mb-xs">
              <q-icon name="place" color="grey-7" size="sm" class="q-mr-sm" />
              <span class="text-body1 text-weight-medium">{{ match.location }}</span>
            </div>
            <div class="row items-center justify-between text-grey-7 text-caption">
              <div>
                <q-icon name="groups" class="q-mr-xs" /> Max: {{ match.max_players }} jogadores
              </div>
              <div class="text-weight-bold text-dark text-body2">
                {{ match.price_per_player }} € / pessoa
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Ver Convocados" icon="list" @click="openPresencesModal(match)" />
            <q-btn color="primary" label="Vou Jogar" icon="check_circle" @click="joinMatch(match.id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky v-if="authStore.profile?.role === 'admin'" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showCreateModal = true">
        <q-tooltip>Agendar Jogo</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 350px; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Agendar Pelada</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="createMatch" class="q-gutter-md">
            <q-input filled v-model="newMatch.date" type="datetime-local" label="Data e Hora" stack-label :rules="[val => !!val || 'Obrigatório']" />
            <q-input filled v-model="newMatch.location" label="Local / Campo" :rules="[val => !!val || 'Obrigatório']" />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input filled v-model.number="newMatch.max_players" type="number" label="Nº Máx Jogadores" />
              </div>
              <div class="col-6">
                <q-input filled v-model.number="newMatch.price_per_player" type="number" step="0.5" label="Preço Individual (€)" />
              </div>
            </div>
            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancelar" flat color="grey" v-close-popup />
              <q-btn label="Criar Partida" type="submit" color="primary" class="q-ml-sm" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPresencesModal">
      <q-card style="min-width: 320px; max-width: 450px; width: 100%; border-radius: 12px;">
        <q-card-section class="row items-center bg-grey-2">
          <div>
            <div class="text-h6 text-weight-bold">Convocatória</div>
            <div class="text-caption text-grey-7">{{ selectedMatch ? formatDate(selectedMatch.date) : '' }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div v-if="loadingPresences" class="text-center q-pa-md">
            <q-spinner color="primary" size="30px" />
          </div>
          
          <q-list v-else-if="presences.length > 0" separator>
            <q-item v-for="presence in presences" :key="presence.id">
              <q-item-section avatar>
                <q-avatar :color="presence.paid ? 'positive' : 'primary'" text-color="white" size="md">
                  {{ presence.profiles?.name?.charAt(0).toUpperCase() }}
                  <q-badge v-if="presence.paid" color="green" floating rounded px-1>
                    <q-icon name="euro" size="8px" />
                  </q-badge>
                </q-avatar>
              </q-item-section>
              
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ presence.profiles?.name }}
                </q-item-label>
                <q-item-label caption>
                  Inscrito em: {{ new Date(presence.created_at).toLocaleDateString() }}
                </q-item-label>
              </q-item-section>

              <q-item-section side class="row items-center no-wrap">
                <div class="row items-center q-gutter-xs">
                  <q-chip 
                    dense 
                    :color="presence.status === 'confirmed' ? 'blue-8' : 'warning'" 
                    text-color="white"
                  >
                    {{ presence.status === 'confirmed' ? 'Confirmado' : 'Suplente' }}
                  </q-chip>

                  <template v-if="authStore.profile?.role === 'admin'">
                    <q-btn 
                      flat round dense
                      :icon="presence.paid ? 'price_check' : 'currency_exchange'" 
                      :color="presence.paid ? 'positive' : 'grey-6'"
                      @click="togglePayment(presence)"
                    >
                      <q-tooltip>{{ presence.paid ? 'Marcar como Não Pago' : 'Marcar como Pago' }}</q-tooltip>
                    </q-btn>

                    <q-btn 
                      flat round dense
                      icon="person_remove" 
                      color="negative"
                      @click="removePresence(presence)"
                    >
                      <q-tooltip>Remover da lista</q-tooltip>
                    </q-btn>
                  </template>

                  <template v-else>
                    <q-icon v-if="presence.paid" name="check_circle" color="positive" size="sm" class="q-ml-xs">
                      <q-tooltip>Pagamento confirmado</q-tooltip>
                    </q-icon>
                  </template>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="text-center q-pa-xl text-grey-6">
            Ninguém inscrito nesta partida ainda.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/useAuthStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const matches = ref([])
const presences = ref([])
const loading = ref(true)
const saving = ref(false)
const loadingPresences = ref(false)
const showCreateModal = ref(false)
const showPresencesModal = ref(false)
const selectedMatch = ref(null)

let realtimeChannel // Variável para guardar a ligação WebSocket

const newMatch = ref({
  date: '',
  location: '',
  max_players: 14,
  price_per_player: 5.00
})

async function fetchMatches() {
  loading.value = true
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: true })
  
  if (!error) matches.value = data
  loading.value = false
}

async function joinMatch(matchId) {
  if (!authStore.user) return

  const { error } = await supabase
    .from('match_presences')
    .insert([{ match_id: matchId, profile_id: authStore.user.id, status: 'confirmed' }])

  if (error) {
    if (error.code === '23505') {
      $q.notify({ type: 'warning', message: 'Já estás inscrito nesta pelada!' })
    } else {
      $q.notify({ type: 'negative', message: 'Erro ao entrar no jogo: ' + error.message })
    }
  } else {
    $q.notify({ type: 'positive', message: 'Inscrição confirmada! Veste a camisola.' })
  }
}

async function openPresencesModal(match) {
  selectedMatch.value = match
  showPresencesModal.value = true
  loadingPresences.value = true
  
  const { data, error } = await supabase
    .from('match_presences')
    .select('id, status, paid, created_at, profiles(name)')
    .eq('match_id', match.id)

  if (!error) presences.value = data
  loadingPresences.value = false
}

async function togglePayment(presence) {
  const nextPaidStatus = !presence.paid
  const { error } = await supabase
    .from('match_presences')
    .update({ paid: nextPaidStatus })
    .eq('id', presence.id)

  if (error) {
    $q.notify({ type: 'negative', message: 'Erro ao atualizar pagamento: ' + error.message })
  } else {
    // Não precisamos de atualizar o estado local aqui, o WebSocket vai fazer isso!
    $q.notify({ 
      type: 'positive', 
      message: nextPaidStatus ? 'Pagamento confirmado!' : 'Pagamento revertido.' 
    })
  }
}

async function removePresence(presence) {
  $q.dialog({
    title: 'Remover Jogador',
    message: `Tens a certeza que queres tirar o ${presence.profiles?.name} desta pelada?`,
    cancel: { flat: true, color: 'grey' },
    ok: { flat: false, color: 'negative', label: 'Remover' },
    persistent: true
  }).onOk(async () => {
    const { error } = await supabase
      .from('match_presences')
      .delete()
      .eq('id', presence.id)

    if (error) {
      $q.notify({ type: 'negative', message: 'Erro ao remover jogador: ' + error.message })
    } else {
      $q.notify({ type: 'positive', message: 'Jogador removido com sucesso.' })
    }
  })
}

async function createMatch() {
  saving.value = true
  const { error } = await supabase.from('matches').insert([newMatch.value])

  if (error) {
    $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Pelada agendada com sucesso!' })
    showCreateModal.value = false
    newMatch.value = { date: '', location: '', max_players: 14, price_per_player: 5.00 }
    await fetchMatches()
  }
  saving.value = false
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}

// Inicializar e configurar os eventos no arranque
onMounted(() => {
  fetchMatches()

  // Subscrever às mudanças na tabela match_presences
  realtimeChannel = supabase
    .channel('presences-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'match_presences' },
      (payload) => {
        // Se houver uma alteração e tivermos o modal de um jogo aberto
        if (selectedMatch.value) {
          // Verifica se a mudança afeta o jogo que estamos a ver
          const isCurrentMatch = payload.new?.match_id === selectedMatch.value.id || 
                                 payload.old?.match_id === selectedMatch.value.id
          
          if (isCurrentMatch) {
            // Se for do nosso jogo, volta a carregar a lista (atualiza silenciosamente)
            openPresencesModal(selectedMatch.value)
          }
        }
      }
    )
    .subscribe()
})

// Limpar a ligação WebSocket quando o componente for destruído
onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>