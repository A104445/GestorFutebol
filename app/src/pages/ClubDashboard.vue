<template>
  <q-page class="bg-grey-2">
    
    <q-pull-to-refresh @refresh="refreshPage" color="primary">
      <div class="q-pa-md q-pb-xl">
        
        <div class="row items-center justify-between q-mb-xl q-pa-sm bg-white shadow-1" style="border-radius: 16px; border-left: 5px solid var(--q-primary);">
          <div class="q-pl-sm">
            <h5 class="q-my-none text-weight-bolder text-dark" style="letter-spacing: -0.5px;">
              {{ clubStore.currentClub?.name || 'Carregando...' }}
            </h5>
            
            <div v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" class="text-caption text-grey-7 q-mb-none row items-center q-mt-xs">
              <q-icon name="vpn_key" color="primary" class="q-mr-xs" size="xs" />
              Código Convite: 
              <q-chip dense color="grey-2" class="text-weight-bold text-dark q-ml-xs" style="font-family: monospace; letter-spacing: 0.5px;">
                {{ clubStore.currentClub?.invite_code || 'N/A' }}
              </q-chip>
            </div>
            
            <div v-else class="text-caption text-grey-7 q-mb-none row items-center q-mt-xs">
              <q-icon name="group" color="primary" class="q-mr-xs" size="xs" />
              Membro do Plantel
            </div>

          </div>
          <div class="row q-gutter-xs">
            <q-btn 
              v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" 
              flat round icon="content_copy" color="primary" @click="copyInviteCode"
            >
              <q-tooltip>Copiar Código do Clube</q-tooltip>
            </q-btn>
            <q-btn flat round icon="arrow_back" color="grey-7" to="/selector" />
          </div>
        </div>
    
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-fluent color="primary" size="50px" />
          <div class="text-caption text-grey-6 q-mt-md">A aquecer os motores...</div>
        </div>
    
        <div v-else-if="matches.length === 0" class="text-center q-pa-xl bg-white shadow-1" style="border-radius: 20px; margin-top: 2rem;">
          <q-icon name="sports_soccer" size="5em" class="text-grey-4 q-mb-md" />
          <div class="text-h6 text-weight-bold text-grey-8">Sem jogos agendados</div>
          <p class="text-body2 text-grey-6 q-px-md">Ainda não há nenhuma convocatória aberta neste clube.</p>
          <q-btn 
            v-if="clubStore.currentClub?.can_manage_matches" 
            color="primary" 
            unelevated 
            label="Agendar Primeiro Jogo" 
            icon="add" 
            class="q-mt-sm" 
            style="border-radius: 8px;"
            @click="showCreateModal = true" 
          />
        </div>
        
        <div v-else class="row q-col-gutter-lg">
          <div v-for="match in matches" :key="match.id" class="col-12 col-md-6 col-lg-4">
            
            <q-card class="match-card shadow-4" :class="match.status === 'fechado' ? 'match-closed' : 'match-open'">
              
              <div class="row items-center justify-between q-pa-md bg-white border-bottom">
                <div class="row items-center text-dark text-weight-bold text-subtitle2">
                  <q-icon name="calendar_month" size="sm" color="primary" class="q-mr-sm" />
                  {{ formatDate(match.date) }}
                </div>
                <div class="row items-center q-gutter-xs">
                  <q-badge color="accent" text-color="dark" class="text-weight-bolder q-px-sm shadow-1" style="border-radius: 6px; padding-top: 4px; padding-bottom: 4px;">
                    {{ match.price_per_player }} €
                  </q-badge>
                  <q-badge :color="match.status === 'fechado' ? 'grey-7' : 'positive'" class="text-weight-bold shadow-1" style="border-radius: 6px; padding-top: 4px; padding-bottom: 4px;">
                    {{ match.status === 'fechado' ? 'Encerrado' : 'Aberto' }}
                  </q-badge>
                </div>
              </div>

              <q-card-section class="bg-grey-1 q-pa-none">
                
                <div v-if="match.status === 'fechado'" class="q-py-lg flex flex-center">
                  <div class="row items-center justify-center full-width text-center">
                    <div class="col-4 column items-center">
                      <q-avatar color="blue-1" text-color="blue-9" icon="shield" size="lg" />
                      <div class="text-weight-bolder text-dark q-mt-sm" style="font-size: 11px; letter-spacing: 0.5px;">EQUIPA A</div>
                    </div>
                    <div class="col-4 flex flex-center">
                      <div class="bg-dark text-white q-px-md q-py-xs shadow-5" style="border-radius: 12px; font-size: 24px; font-weight: 900; letter-spacing: 1px; font-family: monospace;">
                        {{ match.team_a_goals }} <span class="text-grey-6 q-mx-xs">:</span> {{ match.team_b_goals }}
                      </div>
                    </div>
                    <div class="col-4 column items-center">
                      <q-avatar color="orange-1" text-color="orange-9" icon="shield" size="lg" />
                      <div class="text-weight-bolder text-dark q-mt-sm" style="font-size: 11px; letter-spacing: 0.5px;">EQUIPA B</div>
                    </div>
                  </div>
                </div>

                <div v-else class="q-pa-md">
                  <div class="row items-center q-mb-md bg-white q-pa-sm shadow-1" style="border-radius: 10px;">
                    <q-icon name="place" color="primary" size="sm" class="q-mr-sm" />
                    <div>
                      <div class="text-caption text-grey-6 text-weight-medium" style="line-height: 1;">Local / Campo</div>
                      <div class="text-body2 text-weight-bold text-dark">{{ match.location }}</div>
                    </div>
                  </div>
                  <div class="row items-center justify-between q-px-sm">
                    <div class="row items-center">
                      <q-icon name="groups" color="grey-6" size="sm" class="q-mr-xs" />
                      <div>
                        <div class="text-caption text-grey-6 text-weight-medium" style="line-height: 1;">Lotação Max.</div>
                        <div class="text-body2 text-weight-bold text-dark">{{ match.max_players }} Jogadores</div>
                      </div>
                    </div>
                  </div>
                </div>

              </q-card-section>

              <q-separator />

              <q-card-actions class="q-pa-md bg-white row items-center justify-between">
                <q-btn flat color="grey-8" icon="groups" label="Convocados" class="text-weight-bold" @click="openPresencesModal(match)" />
                
                <div class="row q-gutter-sm items-center">
                  <q-btn 
                    v-if="(!match.status || match.status === 'aberto') && clubStore.currentClub?.can_manage_matches" 
                    color="negative" 
                    flat 
                    dense
                    icon="sports" 
                    @click="openCloseModal(match)" 
                  >
                    <q-tooltip>Fechar Jogo</q-tooltip>
                  </q-btn>
                  
                  <q-btn 
                    v-if="!match.status || match.status === 'aberto'" 
                    color="primary" 
                    unelevated 
                    label="Vou Jogar" 
                    icon="check_circle" 
                    class="text-weight-bold shadow-2" 
                    style="border-radius: 8px;" 
                    @click="joinMatch(match)" 
                  />
                </div>
              </q-card-actions>
            </q-card>

          </div>
        </div>
  
      </div>
    </q-pull-to-refresh>
  
    <q-page-sticky v-if="clubStore.currentClub?.can_manage_matches" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="accent" text-color="dark" class="shadow-5 animate-pop" @click="showCreateModal = true">
        <q-tooltip>Agendar Pelada</q-tooltip>
      </q-btn>
    </q-page-sticky>
  
    <q-dialog v-model="showCreateModal" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 350px; border-radius: 20px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <div class="text-h6 text-weight-bold row items-center"><q-icon name="event_available" class="q-mr-sm" />Nova Convocatória</div>
          <q-space /><q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-lg q-px-md">
          <q-form @submit="createMatch" class="q-gutter-md">
            <q-input rounded outlined dense v-model="newMatch.date" type="datetime-local" label="Data e Hora" stack-label :rules="[val => !!val || 'Obrigatório']" />
            <q-input rounded outlined dense v-model="newMatch.location" label="Local / Campo" :rules="[val => !!val || 'Obrigatório']" />
            <div class="row q-col-gutter-sm">
              <div class="col-6"><q-input rounded outlined dense v-model.number="newMatch.max_players" type="number" label="Máx Jogadores" /></div>
              <div class="col-6"><q-input rounded outlined dense v-model.number="newMatch.price_per_player" type="number" step="0.5" label="Preço (€)" /></div>
            </div>
            <div class="row justify-end q-mt-lg q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-6" v-close-popup style="border-radius: 8px;" />
              <q-btn label="Publicar Jogo" type="submit" color="primary" unelevated class="q-px-md" style="border-radius: 8px;" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  
    <q-dialog v-model="showPresencesModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="min-width: 340px; max-width: 480px; width: 100%; border-radius: 24px; overflow: hidden;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div>
            <div class="text-subtitle1 text-weight-bolder row items-center"><q-icon name="groups" color="primary" class="q-mr-sm" />Convocatória & Equipas</div>
            <div class="text-caption text-grey-5">{{ selectedMatch ? formatDate(selectedMatch.date) : '' }}</div>
          </div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
  
        <q-card-section v-if="clubStore.currentClub?.can_manage_teams && presences.length > 0 && selectedMatch?.status !== 'fechado'" class="bg-grey-3 q-py-sm text-center">
          <q-btn color="primary" unelevated icon="auto_awesome" label="Equilibrar Equipas (FUT Auto)" class="text-weight-bold full-width" style="border-radius: 10px;" @click="autoBalanceTeams" />
        </q-card-section>

        <q-card-section v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)" class="q-pa-md bg-grey-3 border-bottom">
          <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Painel Administrativo: Inscrever Jogador do Plantel</div>
          <div class="row q-gutter-sm items-center">
            <q-select 
              v-model="selectedSquadPlayer" 
              :options="squadOptions" 
              dense 
              outlined 
              label="Selecionar Jogador do Plantel" 
              class="col" 
              bg-color="white" 
              use-input
              hide-selected
              fill-input
              @filter="filterSquadPlayers"
            />
            <q-btn color="dark" icon="assignment_turned_in" label="Inscrever" @click="addSquadPlayerToMatch" unelevated class="text-weight-bold" />
          </div>
        </q-card-section>
  
        <q-card-section class="q-pa-none bg-grey-1" style="max-height: 55vh; overflow-y: auto;">
          <div v-if="loadingPresences" class="text-center q-pa-xl"><q-spinner-soccer color="primary" size="40px" /></div>
          
          <q-list v-else-if="presences.length > 0" class="q-pa-md q-gutter-y-sm">
            <q-item v-for="presence in presences" :key="presence.id" class="bg-white shadow-1 border-radius-12 q-py-sm">
              <q-item-section avatar class="items-center">
                <div class="column items-center bg-grey-9 text-white q-px-xs q-py-xs shadow-2 text-center" style="border-radius: 8px; min-width: 42px;">
                  <span class="text-weight-bolder text-subtitle2" :class="(presence.profiles?.overall || presence.virtual_players?.overall || 70) >= 80 ? 'text-amber' : 'text-white'">
                    {{ presence.profiles?.overall || presence.virtual_players?.overall || 70 }}
                  </span>
                  <span class="text-grey-4 text-weight-bold" style="font-size: 9px; text-transform: uppercase;">
                    {{ (presence.profiles?.position || presence.virtual_players?.position || 'MÉD').substring(0,3) }}
                  </span>
                </div>
              </q-item-section>
              
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark row items-center">
                  {{ presence.profiles?.name || presence.virtual_players?.name || presence.guest_name }}
                  <q-badge v-if="presence.team" :color="presence.team === 'A' ? 'blue' : 'orange'" class="q-ml-sm text-weight-bold">Equipa {{ presence.team }}</q-badge>
                </q-item-label>
                <q-item-label caption>
                  <span :class="presence.status === 'confirmed' ? 'text-primary text-weight-medium' : 'text-warning'">
                    {{ presence.status === 'confirmed' ? 'Confirmado' : 'Lista de Espera' }}
                  </span>
                </q-item-label>
              </q-item-section>
  
              <q-item-section side>
                <div v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.can_manage_finances)" class="row items-center">
                  <template v-if="clubStore.currentClub?.can_manage_teams">
                    <q-btn flat round dense icon="looks_one" size="sm" :color="presence.team === 'A' ? 'blue' : 'grey-4'" @click="assignTeam(presence, 'A')" />
                    <q-btn flat round dense icon="looks_two" size="sm" :color="presence.team === 'B' ? 'orange' : 'grey-4'" @click="assignTeam(presence, 'B')" />
                  </template>
                  <q-btn v-if="clubStore.currentClub?.can_manage_finances" flat round dense :icon="presence.paid ? 'price_check' : 'currency_exchange'" size="sm" :color="presence.paid ? 'positive' : 'grey-4'" @click="togglePayment(presence)" />
                  <q-btn v-if="clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.can_manage_matches" flat round dense icon="person_remove" size="sm" color="negative" class="q-ml-xs" @click="removePresence(presence)" />
                </div>
                <div v-else class="row items-center">
                  <q-icon v-if="presence.paid" name="payments" color="positive" size="sm" />
                  <q-icon v-else name="pending" color="grey-4" size="sm" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
  
          <div v-else class="text-center q-pa-xl text-grey-6"><q-icon name="people_outline" size="3em" class="text-grey-4 q-mb-xs" /><div>Nenhum jogador inscrito.</div></div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCloseModal" persistent>
      <q-card style="min-width: 340px; max-width: 600px; width: 100%; border-radius: 16px; background: #1a1a1a; color: white;">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-weight-bold text-amber">Estatísticas do Jogo</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-sm" style="max-height: 65vh; overflow-y: auto;">
          <div v-if="loadingPresences" class="text-center q-pa-md"><q-spinner color="amber" size="30px" /></div>
          
          <div v-else>
            <div class="row items-center justify-center text-center q-mb-md bg-dark q-pa-sm rounded-borders" style="border: 1px solid #333;">
              <div class="col-4">
                <div class="text-caption text-blue text-weight-bold">EQUIPA A</div>
                <div class="text-h3 text-blue text-weight-bolder">{{ computedScoreA }}</div>
              </div>
              <div class="col-2 text-h5 text-grey-6">-</div>
              <div class="col-4">
                <div class="text-caption text-orange text-weight-bold">EQUIPA B</div>
                <div class="text-h3 text-orange text-weight-bolder">{{ computedScoreB }}</div>
              </div>
            </div>

            <div class="text-blue text-weight-bold q-mb-sm q-ml-sm row items-center"><q-icon name="looks_one" class="q-mr-xs"/> Plantel A</div>
            <div v-for="player in matchPlayersStats.teamA" :key="player.id" class="row items-center q-mb-sm bg-dark q-pa-sm rounded-borders border-left-blue">
              <div class="col-6 text-body2 text-ellipsis text-weight-medium">{{ player.name }}</div>
              <div class="col-3 q-px-xs">
                <q-input dark dense filled v-model.number="player.goals" type="number" label="Golos ⚽" min="0" input-class="text-center text-weight-bold text-white" />
              </div>
              <div class="col-3 q-px-xs">
                <q-input dark dense filled v-model.number="player.assists" type="number" label="Assis. 👟" min="0" input-class="text-center text-weight-bold text-white" />
              </div>
            </div>

            <div class="text-orange text-weight-bold q-mt-lg q-mb-sm q-ml-sm row items-center"><q-icon name="looks_two" class="q-mr-xs"/> Plantel B</div>
            <div v-for="player in matchPlayersStats.teamB" :key="player.id" class="row items-center q-mb-sm bg-dark q-pa-sm rounded-borders border-left-orange">
              <div class="col-6 text-body2 text-ellipsis text-weight-medium">{{ player.name }}</div>
              <div class="col-3 q-px-xs">
                <q-input dark dense filled v-model.number="player.goals" type="number" label="Golos ⚽" min="0" input-class="text-center text-weight-bold text-white" />
              </div>
              <div class="col-3 q-px-xs">
                <q-input dark dense filled v-model.number="player.assists" type="number" label="Assis. 👟" min="0" input-class="text-center text-weight-bold text-white" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pa-md" style="background: #111;">
          <q-btn label="Trancar Resultado e Estatísticas" color="amber" text-color="dark" class="full-width text-weight-bold" unelevated size="lg" :loading="saving" @click="closeMatch" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  
  </q-page>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from 'stores/useAuthStore'
import { useClubStore } from 'stores/useClubStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const props = defineProps(['id'])
const authStore = useAuthStore()
const clubStore = useClubStore()
const $q = useQuasar()

const matches = ref([])
const loading = ref(true)
const saving = ref(false)
const showCreateModal = ref(false)
let realtimeChannel 

const newMatch = ref({ date: '', location: '', max_players: 14, price_per_player: 5.00 })

onMounted(async () => {
  // ANTÍDOTO ANTI-F5: Recuperar sessão do Supabase caso a store tenha esvaziado
  if (!authStore.user) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      authStore.user = user
      await authStore.fetchProfile(user.id)
    }
  }

  // Carregar as chaves de permissões granulares do utilizador para este clube
  if (authStore.user && (!clubStore.currentClub || clubStore.currentClub.id !== props.id)) {
    const { data } = await supabase
      .from('club_members')
      .select('role, is_owner, can_manage_finances, can_manage_teams, can_manage_matches, clubs(id, name)')
      .eq('club_id', props.id)
      .eq('profile_id', authStore.user.id)
      .single()
      
    if (data) {
      clubStore.setClub({
        id: data.clubs.id,
        name: data.clubs.name,
        role: data.role,
        is_owner: data.is_owner,
        can_manage_finances: data.can_manage_finances,
        can_manage_teams: data.can_manage_teams,
        can_manage_matches: data.can_manage_matches
      })
    }
  }
  
  await fetchMatches()

  realtimeChannel = supabase
    .channel('presences-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'match_presences' },
      (payload) => {
        if (selectedMatch.value) {
          const isCurrentMatch = payload.new?.match_id === selectedMatch.value.id || 
                                 payload.old?.match_id === selectedMatch.value.id
          if (isCurrentMatch) {
            openPresencesModal(selectedMatch.value)
          }
        }
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})

async function fetchMatches() {
  if (!clubStore.currentClub) return
  
  loading.value = true
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('club_id', clubStore.currentClub.id)
    .order('date', { ascending: true })
  
  if (!error) matches.value = data
  loading.value = false
}

async function createMatch() {
  saving.value = true
  const matchToInsert = { ...newMatch.value, club_id: clubStore.currentClub.id, status: 'aberto' }
  const { error } = await supabase.from('matches').insert([matchToInsert])

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

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}

function copyInviteCode() {
  const code = clubStore.currentClub?.invite_code
  if (code) {
    navigator.clipboard.writeText(code)
    $q.notify({ type: 'positive', icon: 'content_copy', message: `Código ${code} copiado! Podes colar no WhatsApp.` })
  } else {
    $q.notify({ type: 'warning', message: 'Este clube ainda não tem código de convite.' })
  }
}

// --- ESTADO DAS PRESENÇAS ---
const showPresencesModal = ref(false)
const selectedMatch = ref(null)
const presences = ref([])
const loadingPresences = ref(false)

async function joinMatch(match) {
  if (!authStore.user) {
    $q.notify({ type: 'negative', message: 'Erro: Inicia sessão para te inscreveres.' })
    return
  }

  // 1. Contagem segura com '*' para evitar erros de sintaxe no Supabase
  const { count, error: countError } = await supabase
    .from('match_presences')
    .select('*', { count: 'exact', head: true }) 
    .eq('match_id', match.id)
    .eq('status', 'confirmed')

  if (countError) {
    $q.notify({ type: 'negative', message: 'Erro ao verificar lotação: ' + countError.message })
    return
  }

  // 2. Avaliar barreira de lotação
  const isFull = count >= match.max_players
  const insertStatus = isFull ? 'suplente' : 'confirmed'

  // 3. Submeter inscrição
  const { error } = await supabase
    .from('match_presences')
    .insert([{ match_id: match.id, profile_id: authStore.user.id, status: insertStatus }])

  if (error) {
    if (error.code === '23505') {
      $q.notify({ type: 'warning', message: 'Já estás inscrito nesta pelada!' })
    } else {
      $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
    }
  } else {
    if (isFull) {
      $q.notify({ type: 'warning', icon: 'hourglass_empty', message: 'Lotação esgotada! Ficaste em Lista de Espera.' })
    } else {
      $q.notify({ type: 'positive', icon: 'check_circle', message: 'Inscrição confirmada!' })
    }
    await fetchMatches()
  }
}

// VARIÁVEIS PARA O NOVO SISTEMA DE ESTATÍSTICAS
const showCloseModal = ref(false)
const matchToClose = ref(null)
const matchPlayersStats = ref({ teamA: [], teamB: [] })

const computedScoreA = computed(() => matchPlayersStats.value.teamA.reduce((sum, p) => sum + (p.goals || 0), 0))
const computedScoreB = computed(() => matchPlayersStats.value.teamB.reduce((sum, p) => sum + (p.goals || 0), 0))

async function openCloseModal(match) {
  matchToClose.value = match
  showCloseModal.value = true
  loadingPresences.value = true

  // Vai buscar apenas os jogadores que estão confirmados e que já têm equipa definida (A ou B)
  const { data, error } = await supabase
    .from('match_presences')
    .select('id, team, guest_name, profiles(name), virtual_players(name)')
    .eq('match_id', match.id)
    .eq('status', 'confirmed')
    .not('team', 'is', null)

  if (!error && data) {
    const teamA = []
    const teamB = []
    data.forEach(p => {
      const name = p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Desconhecido'
      const playerObj = { id: p.id, name, goals: 0, assists: 0, team: p.team }
      
      if (p.team === 'A') teamA.push(playerObj)
      else if (p.team === 'B') teamB.push(playerObj)
    })
    matchPlayersStats.value = { teamA, teamB }
  }
  loadingPresences.value = false
}

async function closeMatch() {
  if (!matchToClose.value) return
  saving.value = true

  try {
    const teamAPlayers = matchPlayersStats.value.teamA || []
    const teamBPlayers = matchPlayersStats.value.teamB || []
    const allPlayers = [...teamAPlayers, ...teamBPlayers]

    // 1. Gravar as estatísticas individuais purificadas como números inteiros seguros
    for (const p of allPlayers) {
      // Força a conversão para número inteiro. Se estiver vazio (""), assume 0.
      const goalsVal = parseInt(p.goals) || 0
      const assistsVal = parseInt(p.assists) || 0

      const { error: pError } = await supabase
        .from('match_presences')
        .update({ 
          goals: goalsVal, 
          assists: assistsVal 
        })
        .eq('id', p.id)

      // Se houver erro de validação ou RLS num jogador, interrompe e avisa
      if (pError) {
        console.error('Erro ao guardar estatísticas do jogador:', pError)
        $q.notify({ 
          type: 'negative', 
          message: `Erro ao guardar dados do jogador ${p.name}: ${pError.message}` 
        })
        saving.value = false
        return 
      }
    }

    // 2. Calcular o resultado final real com base nos golos inseridos e purificados
    const finalScoreA = teamAPlayers.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)
    const finalScoreB = teamBPlayers.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)

    // 3. Atualizar a tabela de jogos para encerrar a partida oficialmente
    const { error: matchError } = await supabase
      .from('matches')
      .update({ 
        status: 'fechado', 
        team_a_goals: finalScoreA, 
        team_b_goals: finalScoreB 
      })
      .eq('id', matchToClose.value.id)

    if (matchError) {
      $q.notify({ type: 'negative', message: 'Erro ao fechar a partida: ' + matchError.message })
    } else {
      $q.notify({ 
        type: 'positive', 
        icon: 'sports_score', 
        message: 'Partida encerrada com sucesso! Pontos e golos computados.' 
      })
      showCloseModal.value = false
      await fetchMatches() // Atualiza a listagem no ecrã principal
    }
  } catch (err) {
    console.error('Erro inesperado:', err)
    $q.notify({ type: 'negative', message: 'Ocorreu um erro inesperado ao submeter os dados.' })
  } finally {
    saving.value = false
  }
}
  
async function autoBalanceTeams() {
  const confirmedPlayers = presences.value.filter(p => p.status === 'confirmed')
  
  if (confirmedPlayers.length < 2) {
    $q.notify({ type: 'warning', message: 'Precisas de pelo menos 2 jogadores para equilibrar as equipas!' })
    return
  }
  
  const teamA = { score: 0, counts: { 'Guarda-Redes': 0, 'Defesa': 0, 'Médio': 0, 'Avançado': 0 } }
  const teamB = { score: 0, counts: { 'Guarda-Redes': 0, 'Defesa': 0, 'Médio': 0, 'Avançado': 0 } }
  const positionsOrder = ['Guarda-Redes', 'Defesa', 'Médio', 'Avançado']
  const grouped = { 'Guarda-Redes': [], 'Defesa': [], 'Médio': [], 'Avançado': [] }
  
  confirmedPlayers.forEach(p => {
    const pos = p.profiles?.position || 'Médio'
    if (grouped[pos]) {
      grouped[pos].push(p)
    } else {
      grouped['Médio'].push(p) 
    }
  })
  
  positionsOrder.forEach(pos => {
    grouped[pos].sort((a, b) => (b.profiles?.overall || 70) - (a.profiles?.overall || 70))
  })
  
  const updates = []
  
  positionsOrder.forEach(pos => {
    grouped[pos].forEach(presence => {
      const overall = presence.profiles?.overall || 70
      let assignedTeam = 'A'
  
      if (teamA.counts[pos] > teamB.counts[pos]) {
        assignedTeam = 'B'
      } else if (teamA.counts[pos] < teamB.counts[pos]) {
        assignedTeam = 'A'
      } else {
        if (teamA.score > teamB.score) {
          assignedTeam = 'B'
        } else {
          assignedTeam = 'A'
        }
      }
  
      if (assignedTeam === 'A') {
        teamA.counts[pos]++
        teamA.score += overall
      } else {
        teamB.counts[pos]++
        teamB.score += overall
      }
  
      presence.team = assignedTeam
      updates.push(
        supabase.from('match_presences').update({ team: assignedTeam }).eq('id', presence.id)
      )
    })
  })
  
  await Promise.all(updates)
  
  const aTotalPlayers = Object.values(teamA.counts).reduce((a, b) => a + b, 0)
  const bTotalPlayers = Object.values(teamB.counts).reduce((a, b) => a + b, 0)
  const avgA = Math.round(teamA.score / (aTotalPlayers || 1))
  const avgB = Math.round(teamB.score / (bTotalPlayers || 1))
  
  $q.notify({ 
    type: 'positive', 
    message: `Equipas Táticas Geradas! Média A: ${avgA} | Média B: ${avgB}` 
  })
}
  
const selectedSquadPlayer = ref(null)
const allSquadOptions = ref([])
const squadOptions = ref([])

async function openPresencesModal(match) {
  selectedMatch.value = match
  showPresencesModal.value = true
  loadingPresences.value = true
  
  // 1. Puxar presenças incluindo a nova relação de virtual_players
  const { data, error } = await supabase
    .from('match_presences')
    .select('id, status, paid, team, created_at, guest_name, virtual_player_id, profile_id, profiles(name, overall, position), virtual_players(name, overall, position)')
    .eq('match_id', match.id)
  
  if (!error) presences.value = data
  
  // 2. Carregar jogadores disponíveis do plantel para inscrição forçada
  await loadAvailableSquad()
  loadingPresences.value = false
}

async function loadAvailableSquad() {
  const currentInscribedProfileIds = presences.value.map(p => p.profile_id).filter(Boolean)
  const currentInscribedVirtualIds = presences.value.map(p => p.virtual_player_id).filter(Boolean)

  const options = []

  // Carrega membros com conta
  const { data: reals } = await supabase.from('club_members').select('profile_id, profiles(name, position)').eq('club_id', props.id)
  if (reals) {
    reals.forEach(r => {
      if (r.profiles && !currentInscribedProfileIds.includes(r.profile_id)) {
        options.push({ label: `${r.profiles.name} (${r.profiles.position || 'MED'})`, value: r.profile_id, type: 'real' })
      }
    })
  }

  // Carrega membros virtuais
  const { data: virtuals } = await supabase.from('virtual_players').select('id, name, position').eq('club_id', props.id)
  if (virtuals) {
    virtuals.forEach(v => {
      if (!currentInscribedVirtualIds.includes(v.id)) {
        options.push({ label: `${v.name} (${v.position || 'MED'}) [VIRTUAL]`, value: v.id, type: 'virtual' })
      }
    })
  }

  allSquadOptions.value = options
  squadOptions.value = options
}

function filterSquadPlayers(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    squadOptions.value = allSquadOptions.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

async function addSquadPlayerToMatch() {
  if (!selectedSquadPlayer.value || !selectedMatch.value) return

  const p = selectedSquadPlayer.value
  const payload = { match_id: selectedMatch.value.id, status: 'confirmed' }

  if (p.type === 'real') payload.profile_id = p.value
  else payload.virtual_player_id = p.value

  const { error } = await supabase.from('match_presences').insert([payload])
  if (!error) {
    $q.notify({ type: 'positive', message: 'Jogador inscrito na partida!' })
    selectedSquadPlayer.value = null
    await openPresencesModal(selectedMatch.value)
  }
}
  
async function togglePayment(presence) {
  const nextStatus = !presence.paid
  const { error } = await supabase.from('match_presences').update({ paid: nextStatus }).eq('id', presence.id)
  if (!error) presence.paid = nextStatus
}
  
async function assignTeam(presence, teamName) {
  const newTeam = presence.team === teamName ? null : teamName
  const { error } = await supabase.from('match_presences').update({ team: newTeam }).eq('id', presence.id)
  if (!error) presence.team = newTeam
}
  
async function removePresence(presence) {
  const { error } = await supabase.from('match_presences').delete().eq('id', presence.id)
  if (!error) {
    presences.value = presences.value.filter(p => p.id !== presence.id)
    $q.notify({ type: 'info', message: 'Jogador removido do jogo.' })
  }
}
  
async function refreshPage(done) {
  await fetchMatches()
  done()
}
</script>
  
<style scoped>
.match-premium-card {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: white;
}

.match-premium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.1) !important;
}

/* Identificadores laterais baseados no estado do jogo */
.match-card-open {
  border-left: 5px solid #2196f3;
}

.match-card-closed {
  border-left: 5px solid #616161;
  background: linear-gradient(to bottom right, #ffffff, #fcfcfc);
}

.match-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid rgba(0,0,0,0.05);
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}

.match-open {
  border-left: 6px solid #2196f3; /* Azul quando está aberto a inscrições */
}

.match-closed {
  border-left: 6px solid #616161; /* Cinza escuro quando fechado */
  opacity: 0.95;
}

.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bg-gradient-green {
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
}
.border-radius-12 {
  border-radius: 12px;
}
.opacity-8 {
  opacity: 0.8;
}
.animate-pop {
  transition: transform 0.2s ease-in-out;
}
.animate-pop:hover {
  transform: scale(1.08);
}
.border-left-blue { border-left: 3px solid #2196f3; } 
.border-left-orange { border-left: 3px solid #ff9800; }
</style>