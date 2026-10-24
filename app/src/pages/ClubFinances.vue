<template>
    <q-page class="page-light-premium q-pa-md">
      
      <div class="row items-center justify-between q-mb-md q-pa-md club-header-block text-white">
        <div class="row items-center q-gutter-x-md">
          <div class="bg-white flex flex-center shadow-2" style="width: 44px; height: 44px; border-radius: 12px;">
            <q-icon name="account_balance_wallet" size="26px" color="green-9" />
          </div>
          <div>
            <h5 class="q-my-none text-weight-bolder text-white font-fut" style="font-size: 1.4rem; letter-spacing: -0.5px;">Tesouraria</h5>
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
        <q-tab name="resumo" icon="receipt_long" label="Jogos" class="text-weight-bold" />
        <q-tab name="mensalidades" icon="calendar_month" label="Mensalidades" class="text-weight-bold" />
      </q-tabs>
  
      <div v-if="loading" class="text-center q-pa-xl"><q-spinner-bars color="green-9" size="40px" /></div>
  
      <q-tab-panels v-else v-model="tab" animated class="bg-transparent">
        
        <!-- ABA 1: DÍVIDAS POR JOGO -->
        <q-tab-panel name="resumo" class="q-pa-none">
          <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center">
            <q-icon name="sports_soccer" class="q-mr-sm" size="sm" /> Pagamentos Pendentes
          </div>
  
          <div v-if="groupedDebts.length === 0" class="text-center q-pa-xl match-card-light shadow-1">
            <q-icon name="task_alt" size="4em" class="text-green-5 q-mb-md" />
            <div class="text-h6 text-weight-bold text-dark">Tudo Liquidado!</div>
            <p class="text-caption text-grey-6">Os mensalistas foram filtrados. Nenhum jogador ocasional deve jogos.</p>
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
                  <q-badge color="negative" class="text-weight-bold q-pa-sm">Faltam {{ match.unpaid_players.length }}</q-badge>
                </q-item-section>
              </template>
  
              <q-card>
                <q-card-section class="bg-grey-1 q-pa-none">
                  <q-list separator>
                    <q-item v-for="player in match.unpaid_players" :key="player.id" class="q-py-md q-px-lg">
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-dark row items-center">
                          {{ player.profiles?.name || player.virtual_players?.name || player.guest_name || 'Desconhecido' }}
                          <q-icon v-if="player.virtual_player_id" name="construction" color="amber-9" size="xs" class="q-ml-xs"><q-tooltip>Virtual</q-tooltip></q-icon>
                        </q-item-label>
                        <q-item-label caption>Valor: <span class="text-negative text-weight-bold">{{ match.price_per_player }}€</span></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn color="positive" icon="check" label="Pago" unelevated size="sm" class="text-weight-bold" style="border-radius: 6px;" @click="markPlayerPaid(match, player.id)" />
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
            
            <!-- Botão dos Titulares com a mesma altura exata (36px) -->
            <q-btn 
                color="green-9" 
                icon="settings" 
                label="Titulares" 
                unelevated 
                class="text-weight-bold shadow-1" 
                style="border-radius: 8px; height: 36px; padding: 0 14px; font-size: 0.85rem;" 
                @click="showConfigModal = true" 
            />
            </div>

            <!-- Dashboard Compacto: Cálculo Automático (Jogos x Preço) -->
            <q-card flat class="match-card-light q-mb-md q-pa-md shadow-1">
            <div class="row items-center justify-between">
                <div class="text-caption text-weight-bold text-grey-8">Jogos no Mês: <span class="text-dark">{{ gamesInMonth }}</span></div>
                <div class="row items-center">
                <span class="text-caption text-weight-bold text-grey-7 q-mr-sm">Mensalidade:</span>
                <span class="text-weight-bolder text-green-9 text-subtitle1">{{ currentMonthFee }}€</span>
                </div>
            </div>
            </q-card>

            <!-- CAIXA 1: FALTA PAGAR (Laranja) -->
            <div class="q-mb-md">
            <div class="row justify-between items-center q-mb-md">
                <div class="text-subtitle2 text-weight-bold text-orange-9 row items-center">
                <q-icon name="warning" size="sm" class="q-mr-sm" /> Falta Pagar ({{ pendentes.length }})
                </div>
                <q-btn
                    v-if="pendentes.length > 0"
                    unelevated
                    color="green-9"
                    text-color="white"
                    icon="notifications_active"
                    label="Enviar Lembrete Pagamento"
                    class="text-weight-bold shadow-2"
                    style="border-radius: 10px; padding: 6px 8px;"
                    @click="sendPushReminder"
                    :loading="saving"
                />
            </div>
            <q-card flat class="bg-orange-1 shadow-1" style="border-radius: 12px; border: 1px solid #ffcc80;">
                <q-list separator>
                <q-item v-for="m in pendentes" :key="m.id" clickable @click="toggleMonthPayment(m.id)" class="q-py-md transition-hover">
                    <q-item-section><q-item-label class="text-weight-bold text-dark">{{ m.name }}</q-item-label></q-item-section>
                    <q-item-section side><q-btn round dense unelevated icon="chevron_right" color="orange-4" text-color="dark" /></q-item-section>
                </q-item>
                <div v-if="pendentes.length === 0" class="q-pa-md text-center text-orange-8 text-weight-bold">Todos os mensalistas têm as quotas em dia!</div>
                </q-list>
            </q-card>
            </div>

            <!-- CAIXA 2: JÁ PAGOU (Verde) -->
            <div>
            <div class="text-subtitle2 text-weight-bold text-green-9 q-mb-sm row items-center">
                <q-icon name="check_circle" size="sm" class="q-mr-sm" /> Já Pagou ({{ pagos.length }})
            </div>
            <q-card flat class="bg-green-1 shadow-1" style="border-radius: 12px; border: 1px solid #a5d6a7;">
                <q-list separator>
                <q-item v-for="m in pagos" :key="m.id" clickable @click="toggleMonthPayment(m.id)" class="q-py-md transition-hover">
                    <q-item-section><q-item-label class="text-weight-bold text-dark">{{ m.name }}</q-item-label></q-item-section>
                    <q-item-section side><q-icon name="undo" color="green-7" size="sm" /></q-item-section>
                </q-item>
                <div v-if="pagos.length === 0" class="q-pa-md text-center text-green-8 text-weight-bold">Nenhum pagamento registado este mês.</div>
                </q-list>
            </q-card>
            </div>
        </q-tab-panel>
      </q-tab-panels>
  
      <!-- MODAL: CONFIGURAR TITULARES -->
      <q-dialog v-model="showConfigModal">
        <q-card style="min-width: 320px; border-radius: 16px;">
          <q-card-section class="bg-dark text-white row items-center q-py-md">
            <div class="text-weight-bold">Modo de Pagamento (Titulares)</div>
            <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
          </q-card-section>
          
          <q-card-section class="q-pa-none bg-grey-1" style="max-height: 60vh; overflow-y: auto;">
            <q-list separator>
              <q-item v-for="t in titularesAtivos" :key="t.id" class="q-py-md bg-white">
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ t.name }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-select 
                    :model-value="t.billing_mode" 
                    :options="[{label:'Mensalista', value:'monthly'}, {label:'Paga ao Jogo', value:'per_match'}]" 
                    emit-value map-options dense outlined color="green-9" style="width: 120px; font-size: 11px;" 
                    @update:model-value="(val) => updateBillingMode(t, val)" 
                    />
                </q-item-section>
              </q-item>
              <div v-if="titularesAtivos.length === 0" class="q-pa-md text-center text-grey-6">
                Ainda não definiste quem são os Titulares Fixos nas Definições do Clube.
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
  
  const props = defineProps(['id'])
  const authStore = useAuthStore()
  const clubStore = useClubStore()
  const $q = useQuasar()
  
  const loading = ref(true)
  const tab = ref('resumo')
  
  const today = new Date()
  const selectedMonthStr = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)
  
  const currentMonthLabel = computed(() => {
    if (!selectedMonthStr.value) return ''
    const [year, month] = selectedMonthStr.value.split('-')
    const d = new Date(year, month - 1)
    const label = d.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })
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
  
//   const mensalistasCount = computed(() => mensalistas.value.length)
//   const expectedMonthlyIncome = computed(() => mensalistasCount.value * (currentMonthFee.value || 0))
//   const collectedMonthlyIncome = computed(() => pagos.value.length * (currentMonthFee.value || 0))
  
  function isMonthPaid(member) {
    const p = paymentsList.value.find(pay => member.is_virtual ? pay.virtual_player_id === member.id : pay.profile_id === member.id)
    return p ? p.paid : false
  }
  
  function formatDate(isoStr) {
    return new Date(isoStr).toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
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
  
//   // Função geradora do texto para o WhatsApp
//   function copyReminder() {
//   if (pendentes.value.length === 0) return
//   const text = `⚽ *Aviso da Tesouraria - ${currentMonthLabel.value}*\n\nAinda existem quotas por liquidar.\n\nPor favor, regularizem o vosso pagamento assim que possível para mantermos as contas do clube em ordem. Obrigado! 🤝`
  
//   navigator.clipboard.writeText(text)
//   $q.notify({ type: 'positive', icon: 'whatsapp', message: 'Mensagem gerada e copiada para o WhatsApp!' })
// }

async function sendPushReminder() {
  if (pendentes.value.length === 0) return

  $q.notify({ type: 'info', message: 'A contactar servidor...' })

  try {
    // 1. Extrair os IDs dos jogadores reais que estão em dívida
    const devedoresIds = pendentes.value
      .filter(p => !p.is_virtual)
      .map(p => p.id)

    if (devedoresIds.length === 0) return

    // 2. Ir à base de dados buscar os tokens Push destas pessoas
    const { data: subs, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .in('profile_id', devedoresIds)

    if (subsError) throw subsError

    if (!subs || subs.length === 0) {
      $q.notify({ type: 'warning', message: 'Nenhum devedor tem as notificações da app ativadas.' })
      return
    }

    // 3. Disparar a Edge Function para cada token encontrado
    let sentCount = 0
    for (const row of subs) {
      await supabase.functions.invoke('send-push', {
        body: {
          subscription: row.subscription,
          title: 'Tesouraria - MatchDay',
          message: `Falta liquidar a tua quota de ${currentMonthLabel.value}.`,
          url: `/club/${props.id}/finances`
        }
      })
      sentCount++
    }

    $q.notify({ type: 'positive', icon: 'notifications_active', message: `Alerta automático enviado para ${sentCount} telemóveis!` })

  } catch (error) {
    console.error('Erro ao enviar push:', error)
    $q.notify({ type: 'negative', message: 'Falha ao enviar notificações Push.' })
  }
}

// Função de atualização do modo de pagamento mês a mês com reatividade corrigida
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
    $q.notify({ type: 'negative', message: 'Erro Supabase: ' + err.message })
  } else {
    $q.notify({ type: 'info', message: 'Configuração guardada para este mês!' })
    await fetchFinances()
  }
}
  
  async function toggleMonthPayment(memberId) {
    const member = titularesAtivos.value.find(m => m.id === memberId)
    if (!member) return
  
    const [year, month] = selectedMonthStr.value.split('-')
    const existingPayment = paymentsList.value.find(p => member.is_virtual ? p.virtual_player_id === member.id : p.profile_id === member.id)
    
    if (existingPayment) {
      const newStatus = !existingPayment.paid
      const { error } = await supabase.from('club_monthly_payments').update({ paid: newStatus }).eq('id', existingPayment.id)
      if (!error) existingPayment.paid = newStatus
    } else {
      const payload = { club_id: props.id, year: Number(year), month: Number(month), paid: true, billing_mode: 'monthly' }
      if (member.is_virtual) payload.virtual_player_id = member.id; else payload.profile_id = member.id
      const { data, error } = await supabase.from('club_monthly_payments').insert([payload]).select().single()
      if (!error && data) paymentsList.value.push(data)
    }
  }
  
  async function markPlayerPaid(match, presenceId) {
    const { error } = await supabase.from('match_presences').update({ paid: true }).eq('id', presenceId)
    if (!error) {
      match.unpaid_players = match.unpaid_players.filter(p => p.id !== presenceId)
      $q.notify({ type: 'positive', message: 'Pagamento registado!' })
  
      if (match.unpaid_players.length === 0) {
        await supabase.from('matches').update({ paid: true }).eq('id', match.id)
        groupedDebts.value = groupedDebts.value.filter(m => m.id !== match.id)
        $q.notify({ type: 'positive', icon: 'celebration', message: 'Jogo totalmente liquidado!' })
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