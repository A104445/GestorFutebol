<template>
  <q-page class="page-light-premium q-pa-md">
           
    <div class="row items-center justify-between q-mb-md q-pa-md club-header-block text-white">
      <div class="row items-center q-gutter-x-md">
        <div class="bg-white flex flex-center shadow-2" style="width: 44px; height: 44px; border-radius: 12px;">
          <q-icon name="account_balance_wallet" size="26px" color="green-9" />
        </div>
        <div>
          <h5 class="q-my-none text-weight-bolder text-white font-fut" style="font-size: 1.4rem; letter-spacing: -0.5px;">{{ t('finances.headerTitle') }}</h5>
        </div>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey-7 bg-white shadow-1 q-mb-md"
      active-color="green-9"
      indicator-color="green-9"
      align="justify"
      style="border-radius: 12px;"
    >
      <q-tab name="resumo" icon="receipt_long" :label="t('finances.tabs.resumo')" class="text-weight-bold" />
      <q-tab name="mensalidades" icon="calendar_month" :label="t('finances.tabs.mensalidades')" class="text-weight-bold" />
    </q-tabs>

    <div v-if="loading" class="text-center q-pa-xl"><q-spinner-bars color="green-9" size="40px" /></div>

    <q-tab-panels v-else v-model="tab" animated class="bg-transparent">
               
      <!-- ABA 1: DÍVIDAS POR JOGO -->
      <q-tab-panel name="resumo" class="q-pa-none">
        <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center">
          <q-icon name="sports_soccer" class="q-mr-sm" size="sm" /> {{ t('finances.matches.pendingPayments') }}
        </div>

        <div v-if="groupedDebts.length === 0" class="text-center q-pa-xl match-card-light shadow-1">
          <q-icon name="task_alt" size="4em" class="text-green-5 q-mb-md" />
          <div class="text-h6 text-weight-bold text-dark">{{ t('finances.matches.allSettledTitle') }}</div>
          <p class="text-caption text-grey-6">{{ t('finances.matches.allSettledDesc') }}</p>
        </div>

        <q-list v-else class="q-gutter-y-sm">
          <q-expansion-item
            v-for="match in groupedDebts" 
            :key="match.id"
            class="match-card-light shadow-1 overflow-hidden"
            header-class="bg-white q-pa-md"
            expand-icon-class="text-grey-8"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar color="red-1" text-color="negative" icon="warning" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ match.location }}</q-item-label>
                <q-item-label caption class="text-grey-7">{{ formatDate(match.date) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="negative" class="text-weight-bold q-pa-sm">{{ t('finances.matches.missing', { count: match.unpaid_players.length }) }}</q-badge>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="bg-grey-1 q-pa-none">
                <q-list separator>
                  <q-item v-for="player in match.unpaid_players" :key="player.id" class="q-py-md q-px-lg">
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-dark row items-center">
                        {{ player.profiles?.name || player.virtual_players?.name || player.guest_name || t('stats.unknownPlayer') }}
                        <q-icon v-if="player.virtual_player_id" name="construction" color="amber-9" size="xs" class="q-ml-xs"><q-tooltip>Virtual</q-tooltip></q-icon>
                      </q-item-label>
                      <q-item-label caption>{{ t('finances.matches.value') }}<span class="text-negative text-weight-bold">{{ match.price_per_player }}€</span></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn color="positive" icon="check" :label="t('finances.matches.btnPaid')" unelevated size="sm" class="text-weight-bold" style="border-radius: 6px;" @click="markPlayerPaid(match, player.id)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-tab-panel>

      <!-- ABA 2: MENSALIDADES -->
      <q-tab-panel name="mensalidades" class="q-pa-none">
                       
        <div class="row justify-between items-center q-mb-md">
          <div class="row items-center justify-between bg-white shadow-1 q-px-xs q-py-xs no-wrap" style="border-radius: 8px; border: 1px solid #e2e8f0; min-width: 220px; height: 36px;">
              <q-btn flat round dense icon="chevron_left" color="green-9" @click="changeMonth(-1)" />
              <div class="text-weight-bold text-dark text-center q-px-sm" style="font-size: 0.95rem; line-height: 1; flex-grow: 1;">
              {{ currentMonthLabel }}
              </div>
              <q-btn flat round dense icon="chevron_right" color="green-9" @click="changeMonth(1)" />
          </div>
                       
          <q-btn 
              color="green-9"
              icon="settings"
              :label="t('finances.monthly.btnStarters')"
              unelevated
              class="text-weight-bold shadow-1"
              style="border-radius: 8px; height: 36px; padding: 0 14px; font-size: 0.85rem;"
              @click="showConfigModal = true"
           />
        </div>

        <q-card flat class="match-card-light q-mb-md q-pa-md shadow-1">
          <div class="row items-center justify-between">
              <div class="text-caption text-weight-bold text-grey-8">{{ t('finances.monthly.gamesInMonth') }} <span class="text-dark">{{ gamesInMonth }}</span></div>
              <div class="row items-center">
              <span class="text-caption text-weight-bold text-grey-7 q-mr-sm">{{ t('finances.monthly.monthlyFee') }}</span>
              <span class="text-weight-bolder text-green-9 text-subtitle1">{{ currentMonthFee }}€</span>
              </div>
          </div>
        </q-card>

        <!-- CAIXA 1: FALTA PAGAR (Laranja) -->
        <div class="q-mb-md">
          <div class="row justify-between items-center q-mb-md">
              <div class="text-subtitle2 text-weight-bold text-orange-9 row items-center">
              <q-icon name="warning" size="sm" class="q-mr-sm" /> {{ t('finances.monthly.missingPayTitle') }} ({{ pendentes.length }})
              </div>
              <q-btn
                  v-if="pendentes.length > 0"
                  unelevated
                  color="green-9"
                  text-color="white"
                  icon="notifications_active"
                  :label="t('finances.monthly.btnReminders')"
                  class="text-weight-bold shadow-2 q-ml-sm"
                  style="border-radius: 10px; padding: 6px 12px;"
                  @click="sendPushReminder"
              />
          </div>
          <q-card flat class="bg-orange-1 shadow-1" style="border-radius: 12px; border: 1px solid #ffcc80;">
              <q-list separator>
              <q-item v-for="m in pendentes" :key="m.id" clickable @click="toggleMonthPayment(m.id)" class="q-py-md transition-hover">
                  <q-item-section><q-item-label class="text-weight-bold text-dark">{{ m.name }}</q-item-label></q-item-section>
                  <q-item-section side><q-btn round dense unelevated icon="chevron_right" color="orange-4" text-color="dark" /></q-item-section>
              </q-item>
              <div v-if="pendentes.length === 0" class="q-pa-md text-center text-orange-8 text-weight-bold">{{ t('finances.monthly.allPaidUp') }}</div>
              </q-list>
          </q-card>
        </div>

        <!-- CAIXA 2: JÁ PAGOU (Verde) -->
        <div>
          <div class="text-subtitle2 text-weight-bold text-green-9 q-mb-sm row items-center">
              <q-icon name="check_circle" size="sm" class="q-mr-sm" /> {{ t('finances.monthly.alreadyPaidTitle') }} ({{ pagos.length }})
          </div>
          <q-card flat class="bg-green-1 shadow-1" style="border-radius: 12px; border: 1px solid #a5d6a7;">
              <q-list separator>
              <q-item v-for="m in pagos" :key="m.id" clickable @click="toggleMonthPayment(m.id)" class="q-py-md transition-hover">
                  <q-item-section><q-item-label class="text-weight-bold text-dark">{{ m.name }}</q-item-label></q-item-section>
                  <q-item-section side><q-icon name="undo" color="green-7" size="sm" /></q-item-section>
              </q-item>
              <div v-if="pagos.length === 0" class="q-pa-md text-center text-green-8 text-weight-bold">{{ t('finances.monthly.noPaymentsThisMonth') }}</div>
              </q-list>
          </q-card>
        </div>

      </q-tab-panel>
    </q-tab-panels>

    <!-- MODAL: CONFIGURAR TITULARES -->
    <q-dialog v-model="showConfigModal">
      <q-card style="min-width: 320px; border-radius: 16px;">
        <q-card-section class="bg-dark text-white row items-center q-py-md">
          <div class="text-weight-bold">{{ t('finances.configModal.title') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
                   
        <q-card-section class="q-pa-none bg-grey-1" style="max-height: 60vh; overflow-y: auto;">
          <q-list separator>
            <!-- Mudamos de "t" para "titular" -->
            <q-item v-for="titular in titularesAtivos" :key="titular.id" class="q-py-md bg-white">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ titular.name }}</q-item-label>
              </q-item-section>
              
              <q-item-section side>
                  <q-select
                  :model-value="titular.billing_mode"
                  :options="[{label: t('finances.configModal.optMonthly'), value:'monthly'}, {label: t('finances.configModal.optPerMatch'), value:'per_match'}]"
                  emit-value map-options dense outlined color="green-9" style="width: 120px; font-size: 11px;"
                  @update:model-value="(val) => updateBillingMode(titular, val)"
                  />
              </q-item-section>
            </q-item>
            
            <div v-if="titularesAtivos.length === 0" class="q-pa-md text-center text-grey-6">
              {{ t('finances.configModal.noStartersDef') }}
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/useAuthStore'
import { useClubStore } from 'stores/useClubStore'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const props = defineProps(['id'])
const authStore = useAuthStore()
const clubStore = useClubStore()
const $q = useQuasar()
const { t, locale } = useI18n()

const loading = ref(true)
const tab = ref('resumo')

const today = new Date()
const selectedMonthStr = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)

const currentMonthLabel = computed(() => {
  if (!selectedMonthStr.value) return ''
  const [year, month] = selectedMonthStr.value.split('-')
  const d = new Date(year, month - 1)
  
  // Uses navigator.language for dynamic locale, falling back to pt-PT
  const label = d.toLocaleString(locale.value, { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
})

function changeMonth(offset) {
  let [year, month] = selectedMonthStr.value.split('-').map(Number)
  month += offset
  if (month < 1) { month = 12; year -= 1 } 
  else if (month > 12) { month = 1; year += 1 }
  selectedMonthStr.value = `${year}-${String(month).padStart(2, '0')}`
  fetchFinances()
}

const membersList = ref([])
const paymentsList = ref([])
const groupedDebts = ref([])

const monthlyPricePerGame = ref(4)
const gamesInMonth = ref(0)
const currentMonthFee = ref(0)
const showConfigModal = ref(false)

const titularIds = ref([])

const titularesAtivos = computed(() => {
  return titularIds.value.map(id => {
    const member = membersList.value.find(m => m.id === id)
    if (!member) return null
    const payment = paymentsList.value.find(p => member.is_virtual ? p.virtual_player_id === id : p.profile_id === id)
    return { ...member, billing_mode: payment?.billing_mode || 'monthly' }
  }).filter(t => t)
})

const mensalistas = computed(() => titularesAtivos.value.filter(m => m.billing_mode === 'monthly'))
const pendentes = computed(() => mensalistas.value.filter(m => !isMonthPaid(m)))
const pagos = computed(() => mensalistas.value.filter(m => isMonthPaid(m)))

function isMonthPaid(member) {
  const p = paymentsList.value.find(pay => member.is_virtual ? pay.virtual_player_id === member.id : pay.profile_id === member.id)
  return p ? p.paid : false
}

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString(locale.value, { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

async function fetchFinances() {
  loading.value = true
  const [year, month] = selectedMonthStr.value.split('-')
  
  const { data: clubData } = await supabase.from('clubs').select('monthly_price_per_game, default_squad').eq('id', props.id).single()
  if (clubData) {
    monthlyPricePerGame.value = clubData.monthly_price_per_game || 4
    const squad = clubData.default_squad || []
    titularIds.value = squad.map(p => (typeof p === 'string' ? p : p.value || p.id || p.profile_id || p.player_id)).filter(id => id)
  }

  const { data: allMatches } = await supabase.from('matches').select('id, date').eq('club_id', props.id)
  if (allMatches) {
    gamesInMonth.value = allMatches.filter(m => m.date && m.date.startsWith(selectedMonthStr.value)).length
  } else {
    gamesInMonth.value = 0
  }
  
  currentMonthFee.value = gamesInMonth.value * monthlyPricePerGame.value

  const { data: realMembers } = await supabase.from('club_members').select('profile_id, profiles(name)').eq('club_id', props.id).eq('status', 'approved')
  const { data: virtualPlayers } = await supabase.from('virtual_players').select('id, name').eq('club_id', props.id)
       
  let unifiedList = []
  if (realMembers) unifiedList.push(...realMembers.map(m => ({ id: m.profile_id, name: m.profiles?.name, is_virtual: false })))
  if (virtualPlayers) unifiedList.push(...virtualPlayers.map(v => ({ id: v.id, name: v.name + ' (Virtual)', is_virtual: true })))
  membersList.value = unifiedList

  const { data: payments } = await supabase.from('club_monthly_payments').select('*').eq('club_id', props.id).eq('year', year).eq('month', month)
  if (payments) paymentsList.value = payments

  const { data: matchesData } = await supabase
    .from('matches')
    .select('id, date, location, price_per_player, paid, match_presences(id, paid, status, profile_id, virtual_player_id, guest_name, profiles(name), virtual_players(name))')
    .eq('club_id', props.id)
    .eq('paid', false)
    .order('date', { ascending: false })
    .limit(20)

  const debts = []
  if (matchesData) {
    for (const m of matchesData) {
      const matchMonthStr = m.date.substring(0, 7)
      const { data: historicalPayments } = await supabase.from('club_monthly_payments').select('profile_id, virtual_player_id, billing_mode').eq('club_id', props.id).eq('year', matchMonthStr.split('-')[0]).eq('month', matchMonthStr.split('-')[1])
      
      const unpaid = m.match_presences.filter(p => {
        if (p.status !== 'confirmed' || p.paid) return false
        const memberId = p.profile_id || p.virtual_player_id
        if (titularIds.value.includes(memberId)) {
          const histPay = historicalPayments?.find(hp => p.virtual_player_id ? hp.virtual_player_id === memberId : hp.profile_id === memberId)
          const modeAtTheTime = histPay ? histPay.billing_mode : 'monthly'
          if (modeAtTheTime === 'monthly') return false
        }
        return true
      })
      if (unpaid.length > 0) debts.push({ ...m, unpaid_players: unpaid })
      else if (m.match_presences.length > 0) await supabase.from('matches').update({ paid: true }).eq('id', m.id)
    }
  }
  
  groupedDebts.value = debts
  loading.value = false
}

async function sendPushReminder() {
  $q.notify({ type: 'info', message: t('finances.notify.infoSearchingDebtors') })
       
  try {
    const devedoresMensalidade = pendentes.value.filter(m => !m.is_virtual).map(m => m.id)
    const devedoresJogos = []
    
    groupedDebts.value.forEach(match => {
      match.unpaid_players.forEach(p => {
        if (p.profile_id && !devedoresJogos.find(d => d.profile_id === p.profile_id)) {
          devedoresJogos.push({ profile_id: p.profile_id, location: match.location, date: match.date })
        }
      })
    })

    const todosDevedoresIds = [...new Set([...devedoresMensalidade, ...devedoresJogos.map(d => d.profile_id)])]
    
    if (todosDevedoresIds.length === 0) {
      $q.notify({ type: 'warning', message: t('finances.notify.warnNoDebtorsApp') })
      return
    }

    const { data: subs, error: subError } = await supabase.from('push_subscriptions').select('profile_id, subscription').in('profile_id', todosDevedoresIds)
    
    if (subError || !subs || subs.length === 0) {
      $q.notify({ type: 'warning', message: t('finances.notify.warnNoPushEnabled') })
      return
    }

    let sentCount = 0
    const mesFormatado = currentMonthLabel.value 

    for (const row of subs) {
      if (!row.subscription) continue
               
      let textoNotificacao = ''
               
      if (devedoresMensalidade.includes(row.profile_id)) {
        textoNotificacao = t('finances.notify.pushMsgMonthly', { month: mesFormatado })
      } else {
        const jogo = devedoresJogos.find(d => d.profile_id === row.profile_id)
        textoNotificacao = t('finances.notify.pushMsgMatch', { date: formatDate(jogo.date), location: jogo.location })
      }

      const { error: fnError } = await supabase.functions.invoke('send-push', {
        body: {
          subscription: row.subscription,
          title: t('finances.notify.pushTitleMatchDay'),
          message: textoNotificacao,
          url: `/club/${props.id}/finances`
        }
      })

      if (!fnError) {
        sentCount++
      } else {
        console.error("Erro ao enviar para o perfil:", row.profile_id, fnError)
      }
    }

    if (sentCount > 0) {
      $q.notify({ type: 'positive', icon: 'notifications_active', message: t('finances.notify.alertsSent', { count: sentCount }) })
    }

  } catch (error) {
    console.error('Erro ao enviar push:', error)
    $q.notify({ type: 'negative', message: t('finances.notify.errCriticalPush') })
  }
}

async function updateBillingMode(member, newMode) {
  const [year, month] = selectedMonthStr.value.split('-')
  const existingPayment = paymentsList.value.find(p => member.is_virtual ? p.virtual_player_id === member.id : p.profile_id === member.id)
  
  let err = null
  if (existingPayment) {
    const { error } = await supabase.from('club_monthly_payments').update({ billing_mode: newMode }).eq('id', existingPayment.id)
    err = error
  } else {
    const payload = { club_id: props.id, year: Number(year), month: Number(month), paid: false, billing_mode: newMode }
    if (member.is_virtual) payload.virtual_player_id = member.id; else payload.profile_id = member.id
    const { error } = await supabase.from('club_monthly_payments').insert([payload])
    err = error
  }

  if (err) {
    $q.notify({ type: 'negative', message: t('finances.notify.errSupabase') + err.message })
  } else {
    $q.notify({ type: 'info', message: t('finances.notify.configSavedMonth') })
    await fetchFinances()
  }
}

async function toggleMonthPayment(memberId) {
  const member = titularesAtivos.value.find(m => m.id === memberId)
  if (!member) return
  const [year, month] = selectedMonthStr.value.split('-')
  const existingPayment = paymentsList.value.find(p => member.is_virtual ? p.virtual_player_id === member.id : p.profile_id === member.id)
  
  let newPaidStatus = true

  // 1. Atualizar o estado da Mensalidade
  if (existingPayment) {
    newPaidStatus = !existingPayment.paid
    const { error } = await supabase.from('club_monthly_payments').update({ paid: newPaidStatus }).eq('id', existingPayment.id)
    if (!error) existingPayment.paid = newPaidStatus
  } else {
    const payload = { club_id: props.id, year: Number(year), month: Number(month), paid: true, billing_mode: 'monthly' }
    if (member.is_virtual) payload.virtual_player_id = member.id; else payload.profile_id = member.id
    const { data, error } = await supabase.from('club_monthly_payments').insert([payload]).select().single()
    if (!error && data) paymentsList.value.push(data)
  }

  // --- NOVO: Sincronizar com os jogos individuais deste mês ---
  // Descobre o primeiro e o último dia do mês selecionado
  const startDate = `${year}-${month}-01T00:00:00.000Z`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${month}-${lastDay}T23:59:59.999Z`

  // Vai buscar os IDs de todos os jogos do clube para este mês
  const { data: monthMatches } = await supabase
    .from('matches')
    .select('id')
    .eq('club_id', props.id)
    .gte('date', startDate)
    .lte('date', endDate)

  if (monthMatches && monthMatches.length > 0) {
    const matchIds = monthMatches.map(m => m.id)
    const column = member.is_virtual ? 'virtual_player_id' : 'profile_id'

    // Atualiza a presença (match_presences) desse jogador especificamente em todos esses jogos
    await supabase
      .from('match_presences')
      .update({ paid: newPaidStatus })
      .in('match_id', matchIds)
      .eq(column, member.id)
  }

  // Recarrega as finanças para garantir que a aba "Partidas" também se atualiza visualmente
  await fetchFinances()
}

async function markPlayerPaid(match, presenceId) {
  const { error } = await supabase.from('match_presences').update({ paid: true }).eq('id', presenceId)
  if (!error) {
    match.unpaid_players = match.unpaid_players.filter(p => p.id !== presenceId)
    $q.notify({ type: 'positive', message: t('finances.notify.paymentRegistered') })
    
    if (match.unpaid_players.length === 0) {
      await supabase.from('matches').update({ paid: true }).eq('id', match.id)
      groupedDebts.value = groupedDebts.value.filter(m => m.id !== match.id)
      $q.notify({ type: 'positive', icon: 'celebration', message: t('finances.notify.matchLiquidated') })
    }
  }
}

onMounted(async () => {
  if (!authStore.user) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) { authStore.user = user; await authStore.fetchProfile(user.id) }
  }
  
  if (authStore.user && (!clubStore.currentClub || clubStore.currentClub.id !== props.id)) {
    const { data } = await supabase.from('club_members').select('*, clubs(*)').eq('club_id', props.id).eq('profile_id', authStore.user.id).single()
    if (data) clubStore.setClub(data.clubs)
  }

  const isTreasurer = clubStore.currentClub?.can_manage_finances || clubStore.currentClub?.is_owner
  if (!isTreasurer) {
    $q.notify({ type: 'negative', icon: 'security', message: t('finances.notify.errRestricted') })
    router.push(`/club/${props.id}`)
    return
  }

  await fetchFinances()
})
</script>

<style scoped>
.page-light-premium { background-color: #f0fdf4; min-height: 100vh; }
.club-header-block { background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%); border-radius: 16px; box-shadow: 0 10px 25px rgba(10, 46, 12, 0.2); }
.match-card-light { background-color: #ffffff; border-radius: 16px; border: 1px solid #bbf7d0; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); }
.font-fut { font-family: 'Impact', 'Arial Black', sans-serif; }
.transition-hover { transition: all 0.2s ease; cursor: pointer; }
.transition-hover:hover { background-color: rgba(255, 255, 255, 0.5); transform: translateX(4px); }
</style>