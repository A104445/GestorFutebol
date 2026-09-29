<template>
  <q-page class="page-light-premium q-pa-md">
    
    <!-- CABEÇALHO DO PLANTEL -->
    <div class="row items-center justify-between q-mb-lg q-pa-md club-header-block text-white">
      <div class="row items-center q-gutter-x-md">
        <!-- Ícone -->
        <div class="bg-white flex flex-center shadow-2" style="width: 44px; height: 44px; border-radius: 12px;">
          <q-icon name="groups" size="26px" color="green-9" />
        </div>
        <!-- Texto (Limpo e Direto) -->
        <div>
          <h5 class="q-my-none text-weight-bolder text-white font-fut" style="font-size: 1.4rem; letter-spacing: -0.5px;">
            Plantel
          </h5>
        </div>
      </div>
      
      <!-- Ações -->
      <div class="row q-gutter-sm items-center">
        <q-btn v-if="clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner" color="amber-8" text-color="dark" icon="person_add" label="Criar Virtual" class="text-weight-bolder shadow-1" unelevated style="border-radius: 8px;" @click="showCreateVirtualModal = true" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-grid color="green-9" size="50px" />
    </div>
    
    <div v-else>
      <div v-for="section in ['Guarda-Redes', 'Defesas', 'Médios', 'Avançados']" :key="section">
        
        <div v-if="groupedMembers[section].length > 0" class="q-mb-xl">
          <!-- Título das Secções (Adaptado para Fundo Claro) -->
          <h6 class="text-dark font-fut q-my-none q-mb-lg row items-center" style="border-bottom: 2px solid #bbf7d0; padding-bottom: 8px;">
            <q-icon :name="getSectionIcon(section)" class="q-mr-sm text-green-9" size="md" />
            {{ section.toUpperCase() }}
            <q-badge color="green-1" text-color="green-9" class="q-ml-sm q-px-sm shadow-1" style="font-family: Arial, sans-serif;">{{ groupedMembers[section].length }}</q-badge>
          </h6>
          
          <div class="row q-col-gutter-xl">
            <div v-for="member in groupedMembers[section]" :key="member.id" class="col-6 col-sm-4 col-md-3 col-lg-2 flex flex-center">
              
              <div 
                class="fut-card shadow-10" 
                :class="[isIcon(member) ? 'card-icon' : getCardTier(member.overall), (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner) ? 'cursor-pointer hover-lift' : '']"
                @click="openEditModal(member)"
              >
                <div class="fut-card-shine"></div>
                <div class="fut-card-inner">
                  <div class="fut-top-info">
                    <div class="fut-rating">{{ member.overall }}</div>
                    <div class="fut-position">{{ getShortPosition(member.position) }}</div>
                  </div>
                  <q-icon v-if="member.is_virtual" name="construction" :color="isIcon(member) ? 'dark' : 'amber-9'" size="xs" class="absolute-top-right q-ma-sm" style="opacity: 0.8;">
                    <q-tooltip>Jogador Virtual Manual</q-tooltip>
                  </q-icon>
                  <div class="fut-portrait">
                    <q-icon name="person" size="5rem" class="silhouette" />
                  </div>
                  <div class="fut-name text-ellipsis row items-center justify-center">
                    <q-icon v-if="isIcon(member)" name="workspace_premium" size="xs" class="q-mr-xs" />
                    {{ member.name?.split(' ')[0] || 'Jogador' }}
                  </div>
                  <div class="fut-divider"></div>
                  <div class="row fut-stats justify-center">
                  <!-- ESTATÍSTICAS (O texto preto da carta faz com que a borda também precise de ser preta transparente) -->
                  <template v-if="member.position === 'Guarda-Redes'">
                    <div class="col-5 column items-end q-pr-sm" style="border-right: 1px solid rgba(0,0,0,0.15);">
                      <div class="stat-row"><span class="stat-val">{{ member.diving || 70 }}</span><span class="stat-label">DIV</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.handling || 70 }}</span><span class="stat-label">HAN</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.kicking || 70 }}</span><span class="stat-label">KIC</span></div>
                    </div>
                    <div class="col-5 column items-start q-pl-sm">
                      <div class="stat-row"><span class="stat-val">{{ member.reflexes || 70 }}</span><span class="stat-label">REF</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.speed || 70 }}</span><span class="stat-label">SPD</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.positioning || 70 }}</span><span class="stat-label">POS</span></div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="col-5 column items-end q-pr-sm" style="border-right: 1px solid rgba(0,0,0,0.15);">
                      <div class="stat-row"><span class="stat-val">{{ member.pace || 70 }}</span><span class="stat-label">PAC</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.shooting || 70 }}</span><span class="stat-label">SHO</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.passing || 70 }}</span><span class="stat-label">PAS</span></div>
                    </div>
                    <div class="col-5 column items-start q-pl-sm">
                      <div class="stat-row"><span class="stat-val">{{ member.dribbling || 70 }}</span><span class="stat-label">DRI</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.defending || 70 }}</span><span class="stat-label">DEF</span></div>
                      <div class="stat-row"><span class="stat-val">{{ member.physical || 70 }}</span><span class="stat-label">PHY</span></div>
                    </div>
                  </template>
                </div>
                </div>                   
                <div class="fut-bottom-bar text-uppercase">
                  <q-icon name="sports_soccer" size="10px" class="q-mr-xs" /> 
                  {{ isIcon(member) ? 'ICON' : (member.is_virtual ? 'VIRTUAL' : 'PRO') }}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: CRIAR JOGADOR VIRTUAL (Agora versão Light Premium) -->
    <q-dialog v-model="showCreateVirtualModal">
      <q-card style="min-width: 320px; border-radius: 16px; background: #ffffff;">
        <q-card-section class="row items-center club-header-block text-white">
          <div class="text-subtitle1 text-weight-bold">Adicionar Jogador Virtual</div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md q-pt-lg">
          <q-input outlined dense color="green-9" v-model="newVirtualPlayer.name" label="Nome do Jogador" />
          <q-select outlined dense color="green-9" v-model="newVirtualPlayer.position" :options="['Guarda-Redes', 'Defesa', 'Médio', 'Avançado']" label="Posição Inicial" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn color="amber-8" text-color="dark" label="Contratar" class="text-weight-bolder shadow-1" style="border-radius: 6px;" @click="createVirtualPlayer" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL: EDITAR ATRIBUTOS (Agora versão Light Premium) -->
    <q-dialog v-model="showEditModal">
      <q-card style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px; background: #ffffff;">
        <q-card-section class="row items-center club-header-block text-white">
          <div class="text-subtitle1 text-weight-bolder">Painel de Atributos</div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-md">
          <div class="text-h5 text-center text-weight-bolder text-dark q-mb-lg text-uppercase font-fut">{{ selectedPlayer?.name }}</div>
          <div class="row q-col-gutter-md items-center q-mb-md">
            <div class="col-12 col-sm-6">
              <q-select outlined dense color="green-9" v-model="editForm.position" :options="['Guarda-Redes', 'Defesa', 'Médio', 'Avançado']" label="Posição" />
            </div>
            <div class="col-12 col-sm-6 flex flex-center">
              <div class="text-center bg-grey-2 q-px-xl q-py-sm shadow-2" style="border-radius: 8px; border: 1px solid #e2e8f0;">
                <div class="text-caption text-grey-7 text-weight-bold">OVERALL</div>
                <div class="text-h3 text-weight-bolder text-green-9" style="line-height: 1;">{{ computedOverall }}</div>
              </div>
            </div>
          </div>
          
          <q-separator class="q-my-md bg-grey-3" />
          
          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
          <template v-if="editForm.position === 'Guarda-Redes'">
            <div v-for="stat in ['diving', 'handling', 'kicking', 'reflexes', 'speed', 'positioning']" :key="stat" class="col-12 col-sm-6">
              <div class="row justify-between text-caption text-weight-bold text-dark">
                <span class="text-capitalize">{{ stat }}</span><span class="text-green-9 text-weight-bolder">{{ editForm[stat] }}</span>
              </div>
              <q-slider v-model="editForm[stat]" :min="1" :max="99" color="green-9" dense />
            </div>
          </template>
          <template v-else>
            <div v-for="stat in ['pace', 'dribbling', 'shooting', 'defending', 'passing', 'physical']" :key="stat" class="col-12 col-sm-6">
              <div class="row justify-between text-caption text-weight-bold text-dark">
                <span class="text-capitalize">{{ stat }}</span><span class="text-green-9 text-weight-bolder">{{ editForm[stat] }}</span>
              </div>
              <q-slider v-model="editForm[stat]" :min="1" :max="99" color="green-9" dense />
            </div>
          </template>
        </div>
        </q-card-section>
        
        <q-card-actions class="q-pa-md column q-gutter-y-sm bg-grey-1">
          <q-btn label="Gravar Alterações" color="amber-8" text-color="dark" class="full-width text-weight-bolder shadow-1" style="border-radius: 8px;" unelevated size="lg" :loading="saving" @click="savePlayerStats" />
          <q-btn label="Despedir Jogador" color="negative" flat class="full-width text-weight-bold" style="border-radius: 8px;" :loading="saving" @click="removePlayer" />
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
const editForm = ref({ 
  position: 'M dio', 
  pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70,
  diving: 70, handling: 70, kicking: 70, reflexes: 70, speed: 70, positioning: 70 
})

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
    case 'Guarda-Redes': 
      overall = (f.reflexes * 0.30) + (f.diving * 0.30) + (f.positioning * 0.20) + (f.handling * 0.10) + (f.kicking * 0.05) + (f.speed * 0.05); 
      break
    case 'Defesa': 
      overall = (f.defending * 0.40) + (f.physical * 0.30) + (f.pace * 0.15) + (f.passing * 0.10) + (f.dribbling * 0.05); 
      break
    case 'M dio': 
      overall = (f.passing * 0.30) + (f.dribbling * 0.25) + (f.pace * 0.15) + (f.shooting * 0.10) + (f.defending * 0.10) + (f.physical * 0.10); 
      break
    case 'Avan ado': 
      overall = (f.shooting * 0.35) + (f.pace * 0.25) + (f.dribbling * 0.20) + (f.physical * 0.10) + (f.passing * 0.05) + (f.defending * 0.05); 
      break
  }
  return Math.round(overall)
})

onMounted(async () => { await fetchAllMembers() })

async function fetchAllMembers() {
  loading.value = true
  const list = []

  // 1. Carregar utilizadores reais com conta
  const { data: realUsers } = await supabase.from('club_members')
  .select('role, is_owner, profile_id, profiles(name, overall, position, pace, shooting, passing, dribbling, defending, physical, diving, handling, kicking, reflexes, speed, positioning)')
  .eq('club_id', props.id)

  if (realUsers) {
    realUsers.forEach(u => {
      if (u.profiles) {
        list.push({
          id: u.profile_id, id_type: 'real', name: u.profiles.name, position: u.profiles.position, overall: u.profiles.overall || 70,
          pace: u.profiles.pace || 70, shooting: u.profiles.shooting || 70, passing: u.profiles.passing || 70,
          dribbling: u.profiles.dribbling || 70, defending: u.profiles.defending || 70, physical: u.profiles.physical || 70,
          diving: u.profiles.diving || 70, handling: u.profiles.handling || 70, kicking: u.profiles.kicking || 70,
          reflexes: u.profiles.reflexes || 70, speed: u.profiles.speed || 70, positioning: u.profiles.positioning || 70,
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
    defending: editForm.value.defending, physical: editForm.value.physical,
    diving: editForm.value.diving, handling: editForm.value.handling, kicking: editForm.value.kicking,
    reflexes: editForm.value.reflexes, speed: editForm.value.speed, positioning: editForm.value.positioning
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
function isIcon(member) {
  return member.name && member.name.toLowerCase().includes('tiago');
}
function getSectionIcon(s) { return s==='Guarda-Redes'?'pan_tool':s==='Defesas'?'security':s==='Médios'?'explore':'sports_score' }
function getCardTier(o) { return o>=80?'card-gold':o>=70?'card-silver':'card-bronze' }
function getShortPosition(p) { return p==='Guarda-Redes'?'GR':p==='Defesa'?'DEF':p==='Médio'?'MED':'AV' }
</script>

<style scoped>
.font-fut { font-family: 'Impact', 'Arial Black', sans-serif; letter-spacing: -1px; }
/* A camada de FORA (Onde a borda escura tem de estar) */
.fut-card {
  width: 155px;
  height: 225px;
  position: relative;
  border-radius: 6px 6px 35px 35px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  /* A barreira escura passou para aqui! */
  border: 1px solid rgba(0, 0, 0, 0.4); 
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); 
}

/* A camada de DENTRO (Devolvemos o brilho branco original) */
.fut-card-inner {
  border: 1.5px solid rgba(255, 255, 255, 0.4); 
  border-radius: 4px 4px 30px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.4);
}

.hover-lift:hover {
  transform: translateY(-12px) scale(1.08);
  /* Sombra agressiva ao passar o rato para a carta saltar */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10;
}
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

/* Fundo da Página Menta */
.page-light-premium {
  background-color: #f0fdf4;
  min-height: 100vh;
}

/* Cabeçalhos Verde Premium */
.club-header-block {
  background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(10, 46, 12, 0.2);
}

/* Cartas FUT - Sombra ajustada para o fundo claro */
.shadow-10 {
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.hover-lift:hover {
  transform: translateY(-12px) scale(1.08);
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
  z-index: 10;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 4px; /* O espaço exato entre o número e a letra */
}

.stat-val {
  font-weight: 900;
  width: 18px; /* Congela a largura dos números */
  text-align: right;
}

.stat-label {
  width: 22px; /* Congela a largura das letras (o "I" passa a ocupar o mesmo que o "D") */
  text-align: left;
}
.fut-bottom-bar { text-align: center; font-weight: 900; font-size: 10px; opacity: 0.7; margin-top: auto; padding-bottom: 4px; }
/* =========================================
   👑 LUMINARY ICON (TIAGO EDITION - CLARA) 👑
   ========================================= */

/* 1. O Fundo Claro e a Levitação da Carta */
.card-icon {
  background: #ffffff !important;
  /* Sombra base muito mais densa + brilho dourado */
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2), 
    0 0 15px rgba(212, 175, 55, 0.5) !important;
  animation: levitate-light 4s ease-in-out infinite;
  overflow: hidden;
  position: relative;
}

/* 2. A Aura Giratória (Borda de Plasma Branco e Ouro) */
.card-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    rgba(212, 175, 55, 0.1) 20%,
    #d4af37 40%,
    #ffffff 50%,
    #d4af37 60%,
    rgba(212, 175, 55, 0.1) 80%,
    transparent 100%
  );
  animation: spin-plasma 4s linear infinite;
  z-index: 0;
}

/* 3. O Fundo Interior (Textura Marfim Imaculado) */
.card-icon .fut-card-inner {
  background: radial-gradient(circle at 50% 0%, #ffffff 0%, #fdfcf9 50%, #eee6d1 100%) !important;
  /* Borda dourada sólida! Isto impede que o branco da carta se misture com o fundo */
  border: 1px solid rgba(212, 175, 55, 0.8) !important;
  z-index: 2;
  box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.9);
}

/* 4. O Brilho de Diamante Cortante (Reflexo Divino) */
.card-icon::after {
  content: '';
  position: absolute;
  top: -150%;
  left: -150%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0) 45%,
    rgba(255, 255, 255, 0.9) 48%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.9) 52%,
    rgba(255, 255, 255, 0) 55%
  );
  transform: rotate(45deg);
  animation: diamond-slash 5s infinite cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 10;
  pointer-events: none;
}

/* 5. Textos em Ouro Metálico (Substitui o escuro por ouro brilhante) */
.card-icon .fut-rating, .card-icon .fut-name {
  background: linear-gradient(to bottom, #e2c058 0%, #d4af37 40%, #aa801b 80%, #8c6a00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
  font-weight: 900;
}

/* 6. Cores dos Atributos (Para ler bem no fundo branco) */
.card-icon .stat-val { color: #2b2517; text-shadow: 0 1px 1px rgba(255,255,255,0.8); }
.card-icon .stat-label { color: #aa801b; font-weight: 900; }
.card-icon .fut-divider { background: linear-gradient(to right, transparent, #d4af37, transparent); border: none; height: 1.5px; opacity: 0.5; }
.card-icon .fut-bottom-bar { color: #aa801b; font-weight: 900; letter-spacing: 2px; }

/* 7. Avatar (Sombra de ouro a pulsar) */
.card-icon .silhouette {
  color: #d4af37 !important;
  filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.3));
  animation: pulse-avatar-light 2s infinite alternate ease-in-out;
}

/* Esconder o brilho normal para as lendas */
.card-icon .fut-card-shine { display: none; }

/* --- OS MOTORES DE ANIMAÇÃO 3D --- */
@keyframes spin-plasma {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes diamond-slash {
  0% { transform: translate(-50%, -50%) rotate(45deg); }
  20% { transform: translate(50%, 50%) rotate(45deg); }
  100% { transform: translate(50%, 50%) rotate(45deg); }
}

/* Redefinir a animação de levitação para ter sombras mais fortes */
@keyframes levitate-light {
  0% { transform: translateY(0px); box-shadow: 0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(212,175,55,0.4); }
  50% { transform: translateY(-6px); box-shadow: 0 15px 30px rgba(0,0,0,0.25), 0 0 25px rgba(212,175,55,0.6); }
  100% { transform: translateY(0px); box-shadow: 0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(212,175,55,0.4); }
}

@keyframes pulse-avatar-light {
  0% { filter: drop-shadow(0 0 3px rgba(212, 175, 55, 0.2)); transform: scale(1); }
  100% { filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.6)); transform: scale(1.03); }
}
</style>