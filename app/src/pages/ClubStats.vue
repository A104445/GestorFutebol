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
      <q-markup-table flat bordered class="match-card-light" style="overflow: hidden;">
        <thead class="text-white" style="background: linear-gradient(135deg, #14532d 0%, #064e3b 100%);">
          <tr>
            <th class="text-left" style="width: 50px;">#</th>
            <th class="text-left">Jogador</th>
            <th class="text-center"><q-tooltip>Jogos Realizados</q-tooltip>J</th>
            <th class="text-center text-amber-3"><q-tooltip>Golos Marcados</q-tooltip>G</th>
            <th class="text-center text-green-2"><q-tooltip>Assistências</q-tooltip>A</th>
            <th class="text-center text-white"><q-tooltip>Vitórias</q-tooltip>V</th>
            <th class="text-center text-white"><q-tooltip>Empates</q-tooltip>E</th>
            <th class="text-center text-white"><q-tooltip>Derrotas</q-tooltip>D</th>
            <th class="text-center text-weight-bolder text-dark bg-amber-8">PTS</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(player, index) in leaderboard" :key="player.id" :class="index < 3 ? 'bg-orange-1' : ''">
            <td class="text-left text-weight-bold" :class="getMedalColor(index)">
              {{ index + 1 }}
              <q-icon v-if="index === 0" name="military_tech" color="amber-8" size="sm" />
            </td>
            <td class="text-left">
              <div class="text-weight-bold text-dark">{{ player.name }}</div>
              <div class="text-caption text-grey-6">OVR: {{ player.overall }}</div>
            </td>
            <td class="text-center text-grey-8">{{ player.matches }}</td>
            <td class="text-center text-green-9 text-weight-bolder" style="font-size: 1.1em;">{{ player.goals }}</td>
            <td class="text-center text-grey-7 text-weight-bold">{{ player.assists }}</td>
            <td class="text-center text-grey-8 text-weight-medium">{{ player.wins }}</td>
            <td class="text-center text-grey-8 text-weight-medium">{{ player.draws }}</td>
            <td class="text-center text-grey-8 text-weight-medium">{{ player.losses }}</td>
            <td class="text-center text-weight-bolder bg-green-1 text-dark" style="font-size: 1.1em;">
              {{ player.points }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from 'boot/supabase'
  
  const props = defineProps(['id'])
  const loading = ref(true)
  const leaderboard = ref([])
  
  onMounted(async () => {
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
</style>