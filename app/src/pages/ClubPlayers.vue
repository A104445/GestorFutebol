<template>
  <q-page class="bg-grey-10 q-pa-md">
    
    <div class="row items-center justify-between q-mb-xl bg-dark q-pa-md shadow-10" style="border-radius: 16px; border: 1px solid #333; background: linear-gradient(145deg, #111 0%, #1a1a1a 100%);">
      <div class="q-pl-sm row items-center">
        <q-icon name="sports_esports" size="lg" color="amber" class="q-mr-md" />
        <div>
          <h5 class="q-my-none text-weight-bolder text-white font-fut" style="font-style: italic;">ULTIMATE TEAM</h5>
          <div class="text-caption text-amber text-weight-bold">Plantel Oficial do Clube</div>
        </div>
      </div>
      <div class="row q-gutter-sm items-center">
        <q-btn v-if="clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner" color="amber" text-color="dark" icon="person_add" label="Criar Virtual" class="text-weight-bold" unelevated @click="showCreateVirtualModal = true" />
        <q-btn flat round icon="close" color="grey-5" :to="`/club/${props.id}`" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-grid color="amber" size="50px" />
    </div>

    <div v-else>
      <div v-for="section in ['Guarda-Redes', 'Defesas', 'Médios', 'Avançados']" :key="section">
        
        <div v-if="groupedMembers[section].length > 0" class="q-mb-xl">
          <h6 class="text-white font-fut q-my-none q-mb-lg row items-center" style="border-bottom: 2px solid #333; padding-bottom: 8px;">
            <q-icon :name="getSectionIcon(section)" class="q-mr-sm text-amber" size="md" />
            {{ section.toUpperCase() }}
            <q-badge color="dark" text-color="grey-5" class="q-ml-sm q-px-sm shadow-2">{{ groupedMembers[section].length }}</q-badge>
          </h6>

          <div class="row q-col-gutter-xl">
            <div v-for="member in groupedMembers[section]" :key="member.id" class="col-6 col-sm-4 col-md-3 col-lg-2 flex flex-center">
              
              <div 
                class="fut-card shadow-15" 
                :class="[getCardTier(member.overall), (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner) ? 'cursor-pointer hover-lift' : '']"
                @click="openEditModal(member)"
              >
                <div class="fut-card-shine"></div>
                <div class="fut-card-inner">
                  <div class="fut-top-info">
                    <div class="fut-rating">{{ member.overall }}</div>
                    <div class="fut-position">{{ getShortPosition(member.position) }}</div>
                    <div class="fut-flag">🇵🇹</div>
                  </div>

                  <q-icon v-if="member.is_virtual" name="construction" color="amber" size="xs" class="absolute-top-right q-ma-sm" style="opacity: 0.8;">
                    <q-tooltip>Jogador Virtual Manual</q-tooltip>
                  </q-icon>

                  <div class="fut-portrait">
                    <q-icon name="person" size="5rem" class="silhouette" />
                  </div>

                  <div class="fut-name text-ellipsis">
                    {{ member.name?.split(' ')[0] || 'Jogador' }}
                  </div>

                  <div class="fut-divider"></div>

                  <div class="row fut-stats justify-center">
                    <div class="col-5 column items-end q-pr-sm" style="border-right: 1px solid rgba(255,255,255,0.2);">
                      <div><span class="stat-val">{{ member.pace }}</span> <span class="stat-label">PAC</span></div>
                      <div><span class="stat-val">{{ member.shooting }}</span> <span class="stat-label">SHO</span></div>
                      <div><span class="stat-val">{{ member.passing }}</span> <span class="stat-label">PAS</span></div>
                    </div>
                    <div class="col-5 column items-start q-pl-sm">
                      <div><span class="stat-val">{{ member.dribbling }}</span> <span class="stat-label">DRI</span></div>
                      <div><span class="stat-val">{{ member.defending }}</span> <span class="stat-label">DEF</span></div>
                      <div><span class="stat-val">{{ member.physical }}</span> <span class="stat-label">PHY</span></div>
                    </div>
                  </div>
                  
                  <div class="fut-bottom-bar">
                    <q-icon name="sports_soccer" size="10px" class="q-mr-xs" /> {{ member.is_virtual ? 'VIRTUAL' : 'PRO' }}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

    <q-dialog v-model="showCreateVirtualModal">
      <q-card style="min-width: 320px; border-radius: 16px; background: #1a1a1a; color: white;">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-weight-bold text-amber">Adicionar Jogador ao Plantel</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input dark outlined dense color="amber" v-model="newVirtualPlayer.name" label="Nome do Jogador" />
          <q-select dark outlined dense color="amber" v-model="newVirtualPlayer.position" :options="['Guarda-Redes', 'Defesa', 'Médio', 'Avançado']" label="Posição Inicial" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md bg-dark">
          <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
          <q-btn color="amber" text-color="dark" label="Contratar" class="text-weight-bold" @click="createVirtualPlayer" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditModal">
      <q-card style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px; background: #1a1a1a; color: white;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-bolder text-amber">Painel de Atributos FUT</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="text-h5 text-center text-weight-bolder text-white q-mb-lg text-uppercase font-fut">{{ selectedPlayer?.name }}</div>
          <div class="row q-col-gutter-md items-center q-mb-md">
            <div class="col-12 col-sm-6">
              <q-select dark outlined dense color="amber" v-model="editForm.position" :options="['Guarda-Redes', 'Defesa', 'Médio', 'Avançado']" label="Posição" />
            </div>
            <div class="col-12 col-sm-6 flex flex-center">
              <div class="text-center bg-dark q-px-xl q-py-sm shadow-5" style="border-radius: 8px; border: 1px solid #444;">
                <div class="text-caption text-grey-5 text-weight-bold">OVERALL</div>
                <div class="text-h3 text-weight-bolder text-amber" style="line-height: 1;">{{ computedOverall }}</div>
              </div>
            </div>
          </div>
          
          <q-separator dark class="q-my-md" />

          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
            <div v-for="stat in ['pace', 'dribbling', 'shooting', 'defending', 'passing', 'physical']" :key="stat" class="col-12 col-sm-6">
              <div class="row justify-between text-caption text-weight-bold">
                <span class="text-capitalize">{{ stat }}</span><span class="text-amber">{{ editForm[stat] }}</span>
              </div>
              <q-slider v-model="editForm[stat]" :min="1" :max="99" color="amber" dense />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-pa-md column q-gutter-y-sm" style="background: #111;">
          <q-btn label="Gravar Alterações" color="amber" text-color="dark" class="full-width text-weight-bolder" unelevated size="lg" :loading="saving" @click="savePlayerStats" />
          
          <q-btn 
            label="Despedir Jogador (Remover)" 
            color="negative" 
            flat 
            class="full-width text-weight-bold" 
            :loading="saving" 
            @click="removePlayer" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClubStore } from 'stores/useClubStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const props = defineProps(['id'])
const clubStore = useClubStore()
const $q = useQuasar()

const members = ref([])
const loading = ref(true)
const saving = ref(false)
const showEditModal = ref(false)
const showCreateVirtualModal = ref(false)
const selectedPlayer = ref(null)

const newVirtualPlayer = ref({ name: '', position: 'Médio' })
const editForm = ref({ position: 'Médio', pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70 })

const groupedMembers = computed(() => {
  const groups = { 'Guarda-Redes': [], 'Defesas': [], 'Médios': [], 'Avançados': [] }
  members.value.forEach(m => {
    const pos = m.position || 'Médio'
    if (pos === 'Guarda-Redes') groups['Guarda-Redes'].push(m)
    else if (pos === 'Defesa') groups['Defesas'].push(m)
    else if (pos === 'Médio') groups['Médios'].push(m)
    else if (pos === 'Avançado') groups['Avançados'].push(m)
  })
  Object.keys(groups).forEach(key => groups[key].sort((a, b) => b.overall - a.overall))
  return groups
})

const computedOverall = computed(() => {
  const f = editForm.value
  let overall = 70
  switch (f.position) {
    case 'Guarda-Redes': overall = (f.defending * 0.45) + (f.physical * 0.25) + (f.passing * 0.20) + (f.pace * 0.10); break
    case 'Defesa': overall = (f.defending * 0.40) + (f.physical * 0.30) + (f.pace * 0.15) + (f.passing * 0.10) + (f.dribbling * 0.05); break
    case 'Médio': overall = (f.passing * 0.30) + (f.dribbling * 0.25) + (f.pace * 0.15) + (f.shooting * 0.10) + (f.defending * 0.10) + (f.physical * 0.10); break
    case 'Avançado': overall = (f.shooting * 0.35) + (f.pace * 0.25) + (f.dribbling * 0.20) + (f.physical * 0.10) + (f.passing * 0.05) + (f.defending * 0.05); break
  }
  return Math.round(overall)
})

onMounted(async () => { await fetchAllMembers() })

async function fetchAllMembers() {
  loading.value = true
  const list = []

  // 1. Carregar utilizadores reais com conta
  const { data: realUsers } = await supabase.from('club_members')
    .select('role, is_owner, profile_id, profiles(name, overall, position, pace, shooting, passing, dribbling, defending, physical)')
    .eq('club_id', props.id)

  if (realUsers) {
    realUsers.forEach(u => {
      if (u.profiles) {
        list.push({
          id: u.profile_id, id_type: 'real', name: u.profiles.name, position: u.profiles.position, overall: u.profiles.overall || 70,
          pace: u.profiles.pace || 70, shooting: u.profiles.shooting || 70, passing: u.profiles.passing || 70,
          dribbling: u.profiles.dribbling || 70, defending: u.profiles.defending || 70, physical: u.profiles.physical || 70,
          is_virtual: false, is_owner: u.is_owner, role: u.role
        })
      }
    })
  }

  // 2. Carregar utilizadores virtuais
  const { data: virtualUsers } = await supabase.from('virtual_players').select('*').eq('club_id', props.id)
  if (virtualUsers) {
    virtualUsers.forEach(v => {
      list.push({ ...v, id_type: 'virtual', is_virtual: true })
    })
  }

  members.value = list
  loading.value = false
}

async function createVirtualPlayer() {
  if (!newVirtualPlayer.value.name.trim()) return
  saving.value = true
  const { error } = await supabase.from('virtual_players').insert([{ club_id: props.id, name: newVirtualPlayer.value.name.trim(), position: newVirtualPlayer.value.position }])
  if (!error) {
    $q.notify({ type: 'positive', message: 'Jogador Virtual contratado!' })
    showCreateVirtualModal.value = false
    newVirtualPlayer.value = { name: '', position: 'Médio' }
    await fetchAllMembers()
  }
  saving.value = false
}

function openEditModal(member) {
  if (!clubStore.currentClub?.can_manage_teams && !clubStore.currentClub?.is_owner) return
  selectedPlayer.value = member
  editForm.value = { ...member }
  showEditModal.value = true
}

async function savePlayerStats() {
  saving.value = true
  const table = selectedPlayer.value.is_virtual ? 'virtual_players' : 'profiles'
  const matchField = selectedPlayer.value.is_virtual ? 'id' : 'id'

  const { error } = await supabase.from(table).update({
    overall: computedOverall.value, position: editForm.value.position, pace: editForm.value.pace,
    shooting: editForm.value.shooting, passing: editForm.value.passing, dribbling: editForm.value.dribbling,
    defending: editForm.value.defending, physical: editForm.value.physical
  }).eq(matchField, selectedPlayer.value.id)

  if (!error) {
    $q.notify({ type: 'positive', message: 'Atributos FUT atualizados com sucesso!' })
    showEditModal.value = false
    await fetchAllMembers()
  }
  saving.value = false
}

async function removePlayer() {
  // Proteção máxima: Não se pode despedir o dono do clube!
  if (selectedPlayer.value.is_owner) {
    $q.notify({ type: 'warning', icon: 'security', message: 'Impossível remover o Dono do clube.' })
    return
  }

  $q.dialog({
    title: 'Remover Jogador',
    message: `Tens a certeza que queres expulsar o ${selectedPlayer.value.name} do plantel? Esta ação não pode ser desfeita.`,
    persistent: true,
    color: 'negative',
    ok: { label: 'Sim, Remover', color: 'negative', unelevated: true },
    cancel: { label: 'Cancelar', flat: true }
  }).onOk(async () => {
    saving.value = true
    let deleteError = null

    // Verifica se é um jogador virtual ou uma conta real
    if (selectedPlayer.value.is_virtual) {
      const { error } = await supabase
        .from('virtual_players')
        .delete()
        .eq('id', selectedPlayer.value.id)
      deleteError = error
    } else {
      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', props.id)
        .eq('profile_id', selectedPlayer.value.id)
      deleteError = error
    }

    // Lida com a resposta do Supabase
    if (deleteError) {
      $q.notify({ type: 'negative', message: 'Erro de permissões ao remover: ' + deleteError.message })
    } else {
      $q.notify({ type: 'positive', icon: 'person_remove', message: 'Jogador removido do plantel!' })
      showEditModal.value = false
      await fetchAllMembers() // Atualiza as cartas FUT no ecrã
    }
    saving.value = false
  })
}

function getSectionIcon(s) { return s==='Guarda-Redes'?'pan_tool':s==='Defesas'?'security':s==='Médios'?'explore':'sports_score' }
function getCardTier(o) { return o>=80?'card-gold':o>=70?'card-silver':'card-bronze' }
function getShortPosition(p) { return p==='Guarda-Redes'?'GR':p==='Defesa'?'DEF':p==='Médio'?'MED':'AV' }
</script>

<style scoped>
.font-fut { font-family: 'Impact', 'Arial Black', sans-serif; letter-spacing: -1px; }
.fut-card { width: 155px; height: 225px; position: relative; border-radius: 6px 6px 35px 35px; padding: 8px; display: flex; flex-direction: column; transition: transform 0.3s ease; overflow: hidden; }
.fut-card-inner { border: 1.5px solid rgba(255,255,255,0.4); border-radius: 4px 4px 30px 30px; height: 100%; display: flex; flex-direction: column; position: relative; z-index: 2; }
.hover-lift:hover { transform: translateY(-12px) scale(1.08); z-index: 10; }
.fut-card-shine { position: absolute; top: 0; left: -150%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0)); transform: skewX(-25deg); animation: shine 4s infinite; z-index: 1; }
@keyframes shine { 0% { left: -150%; } 30% { left: 200%; } 100% { left: 200%; } }
.card-gold { background: linear-gradient(135deg, #e6c875, #ffd700, #b8860b); color: #1a1a1a; }
.card-silver { background: linear-gradient(135deg, #e0e0e0, #f5f5f5, #a9a9a9); color: #1a1a1a; }
.card-bronze { background: linear-gradient(135deg, #d4a373, #e6be8a, #a66a38); color: #1a1a1a; }
.fut-top-info { position: absolute; top: 10px; left: 12px; text-align: center; }
.fut-rating { font-family: 'Arial Black', sans-serif; font-size: 24px; line-height: 1; }
.fut-position { font-weight: 900; font-size: 11px; }
.fut-portrait { text-align: center; margin-top: 15px; height: 65px; }
.silhouette { opacity: 0.8; }
.fut-name { font-family: 'Arial Black', sans-serif; text-align: center; font-size: 14px; text-transform: uppercase; margin-top: auto; }
.fut-divider { height: 1px; background: currentColor; opacity: 0.2; margin: 4px 10px; }
.fut-stats { font-size: 11px; line-height: 1.2; padding-bottom: 4px; }
.stat-val { font-weight: 900; }
.fut-bottom-bar { text-align: center; font-weight: 900; font-size: 10px; opacity: 0.7; margin-top: auto; padding-bottom: 4px; }
</style>