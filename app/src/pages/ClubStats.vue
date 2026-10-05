<template>
  <q-page class="page-light-premium q-pa-md">
    
    <!-- CABEÇALHO DO RANKING -->
    <div class="row items-center justify-between q-mb-lg q-pa-md club-header-block text-white">
      <div class="row items-center q-gutter-x-md">
        <!-- Ícone -->
        <div class="bg-white flex flex-center shadow-2" style="width: 44px; height: 44px; border-radius: 12px;">
          <!-- Passa para leaderboard -->
          <q-icon name="leaderboard" size="26px" color="green-9" />
        </div>
        <!-- Texto -->
        <div>
          <!-- Nome principal alterado -->
          <h5 class="q-my-none text-weight-bolder text-white" style="font-size: 1.3rem; letter-spacing: -0.5px;">
            Estatísticas da Época
          </h5>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-bars color="green-9" size="40px" />
    </div>

    <div v-else-if="leaderboard.length === 0" class="text-center q-pa-xl match-card-light" style="margin-top: 2rem;">
      <q-icon name="query_stats" size="4em" class="text-grey-4 q-mb-md" />
      <div class="text-h6 text-grey-8 text-weight-bold">Sem Dados Estatísticos</div>
      <p class="text-caption text-grey-6">Ainda não há jogos fechados com resultados para calcular o ranking.</p>
    </div>

    <div v-else>
      <q-table
        :rows="leaderboard"
        :columns="columns"
        row-key="id"
        class="match-card-light my-sticky-table"
        flat
        bordered
        hide-pagination
        v-model:pagination="pagination"
        color="green-9"
      >
        <!-- CABEÇALHO PERSONALIZADO (Com as setas de ordenação e Tooltips) -->
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-white text-weight-bold"
              :class="col.headerClasses"
            >
              <q-tooltip v-if="col.tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{ col.tooltip }}
              </q-tooltip>
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- LINHAS DA TABELA (Sem a medalha e com a ordem dinâmica) -->
        <template v-slot:body="props">
          <q-tr :props="props" :class="props.rowIndex < 3 ? 'bg-orange-1' : 'bg-white'">
            
            <q-td key="rank" :props="props" class="text-left text-weight-bold" :class="getMedalColor(props.rowIndex)">
              {{ props.rowIndex + 1 }}
            </q-td>
            
            <q-td key="jogador" :props="props" class="text-left">
              <div class="text-weight-bold text-dark text-ellipsis" style="max-width: 130px;">{{ props.row.name }}</div>
              <div class="text-caption text-grey-6" style="line-height: 1;">OVR: {{ props.row.overall }}</div>
            </q-td>

            <q-td key="matches" :props="props" class="text-center text-grey-8">{{ props.row.matches }}</q-td>
            <q-td key="goals" :props="props" class="text-center text-green-9 text-weight-bolder" style="font-size: 1.1em;">{{ props.row.goals }}</q-td>
            <q-td key="assists" :props="props" class="text-center text-grey-7 text-weight-bold">{{ props.row.assists }}</q-td>
            <q-td key="wins" :props="props" class="text-center text-grey-8 text-weight-medium">{{ props.row.wins }}</q-td>
            <q-td key="draws" :props="props" class="text-center text-grey-8 text-weight-medium">{{ props.row.draws }}</q-td>
            <q-td key="losses" :props="props" class="text-center text-grey-8 text-weight-medium">{{ props.row.losses }}</q-td>
            
            <q-td key="points" :props="props" class="text-center text-weight-bolder text-dark bg-green-1" style="font-size: 1.1em;">
              {{ props.row.points }}
            </q-td>

          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/useAuthStore' // <- Importar Auth
import { useClubStore } from 'stores/useClubStore' // <- Importar Club

const authStore = useAuthStore() // <- Iniciar Auth
const clubStore = useClubStore() // <- Iniciar Club

const props = defineProps(['id'])
const loading = ref(true)
const leaderboard = ref([])
  // Configuração inicial (Ordena por Pontos descrescente e não divide em páginas)
const pagination = ref({
  sortBy: 'points',
  descending: true,
  rowsPerPage: 0 
})

// Definição das colunas para permitir clicar e ordenar!
const columns = [
  { name: 'rank', label: '#', align: 'left', headerClasses: 'text-left' },
  { name: 'jogador', label: 'Jogador', field: row => row.name, align: 'left', sortable: true },
  { name: 'matches', label: 'J', field: 'matches', align: 'center', sortable: true, tooltip: 'Jogos Realizados' },
  { name: 'goals', label: 'G', field: 'goals', align: 'center', sortable: true, headerClasses: 'text-amber-3', tooltip: 'Golos Marcados' },
  { name: 'assists', label: 'A', field: 'assists', align: 'center', sortable: true, headerClasses: 'text-green-2', tooltip: 'Assistências' },
  { name: 'wins', label: 'V', field: 'wins', align: 'center', sortable: true, tooltip: 'Vitórias' },
  { name: 'draws', label: 'E', field: 'draws', align: 'center', sortable: true, tooltip: 'Empates' },
  { name: 'losses', label: 'D', field: 'losses', align: 'center', sortable: true, tooltip: 'Derrotas' },
  { name: 'points', label: 'PTS', field: 'points', align: 'center', sortable: true, headerClasses: 'bg-amber-8 text-dark' }
]
  
onMounted(async () => {
  // 1. O ANTÍDOTO ANTI-F5 (Reidrata a memória do utilizador e do clube)
  if (!authStore.user) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      authStore.user = user
      await authStore.fetchProfile(user.id)
    }
  }
  if (authStore.user && (!clubStore.currentClub || clubStore.currentClub.id !== props.id)) {
    const { data } = await supabase
      .from('club_members')
      .select('role, is_owner, can_manage_finances, can_manage_teams, can_manage_matches, clubs(id, name)')
      .eq('club_id', props.id)
      .eq('profile_id', authStore.user.id)
      .single()
    if (data) {
      clubStore.setClub({
        id: data.clubs.id, name: data.clubs.name, role: data.role, is_owner: data.is_owner,
        can_manage_finances: data.can_manage_finances, can_manage_teams: data.can_manage_teams, can_manage_matches: data.can_manage_matches
      })
    }
  }

  // 2. Continua com o cálculo das estatísticas
  await calculateStats()
})
  
  function getMedalColor(index) {
    if (index === 0) return 'text-amber-9' // Ouro
    if (index === 1) return 'text-grey-7'  // Prata
    if (index === 2) return 'text-brown-6' // Bronze
    return 'text-grey-9'
  }
  
  async function calculateStats() {
    loading.value = true
  
    // 1. Ir buscar todos os jogos FECHADOS deste clube
    const { data: matches } = await supabase
      .from('matches')
      .select('id, team_a_goals, team_b_goals')
      .eq('club_id', props.id)
      .eq('status', 'fechado')
  
    if (!matches || matches.length === 0) {
      loading.value = false
      return
    }
  
    // 2. Ir buscar as presenças confirmadas desses jogos
  // 2. Ir buscar as presenças com golos e assistências
  const matchIds = matches.map(m => m.id)
  const { data: presences } = await supabase
    .from('match_presences')
    .select('match_id, profile_id, guest_name, virtual_player_id, team, goals, assists, profiles(name, overall), virtual_players(name, overall)')
    .in('match_id', matchIds)
    .eq('status', 'confirmed')

  // 3. Processar os pontos
  const statsMap = {}

  matches.forEach(match => {
    let winner = null
    if (match.team_a_goals > match.team_b_goals) winner = 'A'
    else if (match.team_b_goals > match.team_a_goals) winner = 'B'
    else winner = 'DRAW'

    const playersInMatch = presences.filter(p => p.match_id === match.id)
    
    playersInMatch.forEach(p => {
      if (!p.team) return 

      const playerKey = p.profile_id || (p.virtual_player_id ? `virt_${p.virtual_player_id}` : `guest_${p.guest_name}`)
      const playerName = p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Desconhecido'
      const playerOverall = p.profiles?.overall || p.virtual_players?.overall || 70

      if (!statsMap[playerKey]) {
        statsMap[playerKey] = {
          id: playerKey, name: playerName, overall: playerOverall,
          matches: 0, wins: 0, draws: 0, losses: 0, points: 0,
          goals: 0, assists: 0 // Iniciar a zero
        }
      }

      const playerStat = statsMap[playerKey]
      playerStat.matches++
      playerStat.goals += (p.goals || 0)     // Somar golos
      playerStat.assists += (p.assists || 0) // Somar assistências

      if (winner === 'DRAW') {
        playerStat.draws++
        playerStat.points += 1
      } else if (p.team === winner) {
        playerStat.wins++
        playerStat.points += 3
      } else {
        playerStat.losses++
      }
    })
  })

  // 4. Converter objeto num Array e ordenar (1º Pontos, 2º Golos, 3º Vitórias)
  const finalLeaderboard = Object.values(statsMap)
  finalLeaderboard.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goals !== a.goals) return b.goals - a.goals // Desempate por golos!
    if (b.wins !== a.wins) return b.wins - a.wins
    return a.matches - b.matches
  })
  
    leaderboard.value = finalLeaderboard
    loading.value = false
  }
  </script>

<style scoped>
.page-light-premium {
  background-color: #f0fdf4;
  min-height: 100vh;
}
.club-header-block {
  background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(10, 46, 12, 0.2);
}
.match-card-light {
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

/* --- A MAGIA DA TABELA FIXA (SCROLL CRUZADO) --- */
.my-sticky-table {
  /* Limita a altura para ativar o scroll vertical dentro do ecrã */
  max-height: calc(100vh - 180px); 
}

/* O Cabeçalho Verde Escuro sempre no topo */
.my-sticky-table thead tr th {
  position: sticky;
  z-index: 2;
  background: #064e3b; /* Cor fixa para garantir que não fica transparente ao fazer scroll */
}

.my-sticky-table thead tr {
  background-color: #064e3b !important;
}

.my-sticky-table thead tr:first-child th {
  top: 0;
}

/* Coluna 1: A hashtag (#) super estreita e colada à esquerda */
.my-sticky-table tr th:first-child,
.my-sticky-table tr td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 35px;
  max-width: 35px;
  padding: 4px 8px; /* Tira o excesso de padding para poupar espaço */
}

/* Coluna 2: O Nome do Jogador também colado (logo a seguir à Coluna 1) */
.my-sticky-table tr th:nth-child(2),
.my-sticky-table tr td:nth-child(2) {
  position: sticky;
  left: 35px; /* Tem de ser igual à largura da primeira coluna */
  z-index: 1;
}

/* O cruzamento entre o Cabeçalho e as Colunas da Esquerda tem de estar acima de tudo (Z-index: 3) */
.my-sticky-table thead tr th:first-child,
.my-sticky-table thead tr th:nth-child(2) {
  z-index: 3;
}

/* Garantir que as células fixas mantêm a cor das linhas (Laranja nas top 3, Branco nas restantes) */
.my-sticky-table tbody tr.bg-white td {
  background: #ffffff;
}
.my-sticky-table tbody tr.bg-orange-1 td {
  background: #fff3e0;
}


</style>