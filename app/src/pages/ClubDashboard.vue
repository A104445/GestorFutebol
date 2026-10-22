<template>
  <q-page class="q-pa-md page-light-premium">
    <q-pull-to-refresh @refresh="refreshPage" color="primary" class="full-height">
      
      <!-- CABEÇALHO DO CLUBE (Bloco Escuro de Contraste) -->
      <div class="row items-center justify-between q-mb-lg q-pa-md club-header-block text-white">
        <div class="row items-center q-gutter-x-md">
          <!-- Ícone do Clube (Caixa Branca para saltar à vista no fundo escuro) -->
          <div class="bg-white flex flex-center shadow-2" style="width: 44px; height: 44px; border-radius: 12px;">
            <q-icon name="sports_soccer" size="26px" color="green-9" />
          </div>
          <div>
            <h5 class="q-my-none text-weight-bolder text-white" style="letter-spacing: -0.3px; font-size: 1.4rem;">
              {{ clubStore.currentClub?.name || 'Carregando...' }}
            </h5>
            <div v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" class="text-caption text-grey-4 q-mt-xs text-weight-medium">
              Código: <span class="text-green-4 text-weight-bolder">{{ clubStore.currentClub?.invite_code || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Menu Discreto -->
        <div class="row q-gutter-xs items-center">
          <q-btn v-if="clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner" flat round icon="person_add" color="grey-3" @click="showRequestsModal = true">
            <q-badge v-if="pendingRequests.length > 0" color="primary" floating rounded>{{ pendingRequests.length }}</q-badge>
          </q-btn>
          <q-btn v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" flat round icon="manage_accounts" color="grey-3" @click="openStaffManager" />
          <q-btn v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" flat round icon="settings" color="grey-3" @click="openClubSettings" />
          
          <q-separator vertical class="q-mx-sm bg-grey-6" style="opacity: 0.5;" />
          
          <q-btn flat round icon="more_vert" color="white">
            <q-menu auto-close style="border-radius: 12px;">
              <q-list style="min-width: 160px;">
                <q-item clickable @click="openProfileModal">
                  <q-item-section avatar><q-icon name="manage_accounts" size="sm" color="primary" /></q-item-section>
                  <q-item-section class="text-weight-bold">O Meu Perfil</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable to="/selector" @click="clearCurrentClub">
                  <q-item-section avatar><q-icon name="swap_horiz" size="sm" color="grey-8" /></q-item-section>
                  <q-item-section class="text-weight-medium">Mudar de Clube</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="handleLogout">
                  <q-item-section avatar><q-icon name="logout" size="sm" color="negative" /></q-item-section>
                  <q-item-section class="text-negative text-weight-bold">Terminar Sessão</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <!-- ESTADOS DE CARREGAMENTO / VAZIO -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-fluent color="green-9" size="50px" />
        <div class="text-caption text-grey-6 q-mt-md">A aquecer os motores...</div>
      </div>

      <div v-else-if="matches.length === 0" class="text-center q-pa-xl match-card-light" style="margin-top: 2rem;">
        <q-icon name="sports_soccer" size="5em" class="text-grey-4 q-mb-md" />
        <div class="text-h6 text-weight-bold text-dark">Sem jogos agendados</div>
        <p class="text-body2 text-grey-6 q-px-md">Ainda não há nenhuma convocatória aberta neste clube.</p>
        <!-- Botão também já atualizado para as novas cores (Âmbar) -->
        <q-btn v-if="clubStore.currentClub?.can_manage_matches" color="amber-8" text-color="dark" unelevated label="Agendar Primeiro Jogo" icon="add" class="q-mt-md text-weight-bolder shadow-1" style="border-radius: 8px;" @click="openCreateMatch()" />
      </div>

      <!-- O SEGREDO: O v-else que esconde o filtro quando não há jogos -->
      <div v-else>
        <!-- FILTRO DINÂMICO (Estilo Carrossel c/ Expansão) -->
        <div class="q-mb-md q-px-xs">
          
          <!-- Linha Principal (Fixa) -->
          <div class="row justify-between items-center">
            <div class="text-subtitle1 text-weight-bold text-dark row items-center">
              <q-icon name="calendar_today" class="q-mr-sm text-green-9" size="sm" />
              Calendário
            </div>
            
            <!-- CÁPSULA DO FILTRO -->
            <div class="row items-center justify-between shadow-1 bg-white" style="border-radius: 24px; border: 1px solid #e2e8f0; width: 160px; height: 36px;">
              <q-btn flat round dense icon="chevron_left" color="grey-6" size="sm" @click="prevFilter" />
              <div class="text-weight-bold text-dark text-center text-uppercase" style="flex-grow: 1; font-size: 11px;">
                {{ currentFilterLabel }}
              </div>
              <q-btn flat round dense icon="chevron_right" color="grey-6" size="sm" @click="nextFilter" />
            </div>
          </div>

          <!-- Linha Secundária: Seletor de Mês (Aparece apenas quando "Mês" é selecionado) -->
          <div v-if="matchViewMode === 'month'" class="row justify-end q-mt-sm">
            
            <!-- Largura reposta para 160px para alinhar perfeitamente com a cápsula de cima -->
            <div class="bg-white shadow-1" style="border-radius: 24px; border: 1px solid #e2e8f0; width: 160px;">
              <q-select 
                v-model="selectedMonth" 
                :options="availableMonths" 
                dense 
                borderless 
                emit-value 
                map-options 
                color="green-9"
                class="compact-select"
              >
                <!-- Juntamos o ícone e o texto no mesmo slot para os centrarmos juntos -->
                <template v-slot:selected-item="scope">
                  <div class="row items-center justify-center full-width" style="padding-left: 4px;">
                    <q-icon name="event_note" size="xs" color="green-9" class="q-mr-xs" />
                    <div class="text-weight-bold text-dark" style="font-size: 12px; white-space: nowrap;">
                      {{ scope.opt.label }}
                    </div>
                  </div>
                </template>
              </q-select>
            </div>
          </div>
        </div>
      </div>

      <!-- CARTÕES DE JOGO -->
      <div v-if="filteredMatches.length > 0" class="row q-col-gutter-lg">
        <div v-for="match in filteredMatches" :key="match.id" class="col-12 col-md-6 col-lg-4">
          <q-card flat class="match-card-light">
            
            <!-- Topo do Cartão -->
            <div class="row items-center justify-between q-pa-md" style="border-bottom: 1px solid #f1f5f9;">
              <div class="text-subtitle2 text-weight-bold text-dark row items-center">
                <!-- Ícone da Data em Cinza Claro Neutro -->
                <div class="bg-grey-3 text-grey-8 flex flex-center q-mr-sm" style="width: 28px; height: 28px; border-radius: 6px;">
                  <q-icon name="calendar_today" size="14px" />
                </div>
                {{ formatDate(match.date) }}
              </div>
              
              <div class="row items-center q-gutter-x-sm">
                <q-chip 
                  dense 
                  :color="match.status === 'fechado' ? 'grey-3' : (match.status === 'votacao' ? 'blue-2' : 'amber-8')" 
                  :text-color="match.status === 'fechado' ? 'grey-8' : (match.status === 'votacao' ? 'blue-9' : 'dark')" 
                  class="text-weight-bolder shadow-1"
                  style="border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);"
                >
                  {{ match.status === 'fechado' ? 'TERMINADO' : (match.status === 'votacao' ? 'EM VOTAÇÃO' : 'ABERTO') }}
                </q-chip>

                <!-- Menu de Gestão em Cinza Neutro -->
                <q-btn v-if="clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner" flat round dense icon="more_vert" color="grey-6">
                  <q-menu auto-close style="border-radius: 12px; min-width: 140px;">
                    <q-list>
                      <q-item clickable @click="openEditMatch(match)">
                        <q-item-section avatar><q-icon name="edit" size="sm" color="grey-7" /></q-item-section>
                        <q-item-section class="text-weight-bold">Editar</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable @click="deleteMatch(match)">
                        <q-item-section avatar><q-icon name="delete" size="sm" color="negative" /></q-item-section>
                        <q-item-section class="text-negative text-weight-bold">Apagar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>

            <q-card-section class="q-pa-md">
              <!-- JOGO FECHADO -->
              <div v-if="match.status === 'fechado'" class="q-py-sm">
                <div class="row items-center justify-center no-wrap full-width text-center scoreboard-box q-pa-md">
                  
                  <!-- Equipa A -->
                  <div class="col-4 column items-center">
                    <q-avatar size="44px" :color="matchSettingsColor(match, 'A')" text-color="white" icon="shield" class="shadow-2" />
                    <div class="text-weight-bold text-grey-3 q-mt-sm text-uppercase text-ellipsis full-width" style="font-size: 11px;">
                      {{ match.team_a_name || clubSettings?.default_team_a_name || 'Equipa A' }}
                    </div>
                  </div>
                                    
                  <!-- Placar -->
                  <div class="col-4 row items-center justify-center no-wrap q-gutter-x-sm">
                    <div class="text-weight-bolder text-white" style="font-size: 2.2rem; line-height: 1;">{{ match.team_a_goals ?? '-' }}</div>
                    <div class="text-blue-grey-3 text-h6 text-weight-bold">-</div>
                    <div class="text-weight-bolder text-white" style="font-size: 2.2rem; line-height: 1;">{{ match.team_b_goals ?? '-' }}</div>
                  </div>                      

                  <!-- Equipa B -->
                  <div class="col-4 column items-center">
                    <q-avatar size="44px" :color="matchSettingsColor(match, 'B')" text-color="white" icon="shield" class="shadow-2" />
                    <div class="text-weight-bold text-grey-3 q-mt-sm text-uppercase text-ellipsis full-width" style="font-size: 11px;">
                      {{ match.team_b_name || clubSettings?.default_team_b_name || 'Equipa B' }}
                    </div>
                  </div>

                </div>
              </div>

              <!-- JOGO ABERTO -->
              <div v-else class="row items-center justify-between inner-info-box q-pa-sm">
                <div class="col-5 q-pl-sm">
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">Local</div>
                  <div class="text-body2 text-weight-bold text-dark text-ellipsis">{{ match.location }}</div>
                </div>
                
                <q-separator vertical class="bg-grey-3" />
                
                <div class="col-3 text-center">
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">Lotação</div>
                  <!-- A cor muda para vermelho se estiver cheio -->
                  <div class="text-body2 text-weight-bold" :class="match.confirmedCount >= match.max_players ? 'text-negative' : 'text-dark'">
                    {{ match.confirmedCount || 0 }} / {{ match.max_players }}
                  </div>
                </div>
                
                <q-separator vertical class="bg-grey-3" />
                
                <div class="col-3 text-right q-pr-sm">
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">Preço</div>
                  <!-- Preço a Verde Escuro em vez de Azul -->
                  <div class="text-body2 text-weight-bolder text-green-9">{{ match.price_per_player }}€</div>
                </div>
              </div>
            </q-card-section>

            <!-- Rodapé do Cartão -->
            <q-card-actions class="q-px-md q-pb-md q-pt-none row items-center justify-between">
              <q-btn flat color="grey-8" icon="groups" label="Plantel" class="text-weight-bold bg-grey-3" style="border-radius: 8px;" @click="openPresencesModal(match)" />

              <div class="row q-gutter-sm items-center">
                <q-btn
                  v-if="(!match.status || match.status === 'aberto') && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)"
                  color="negative" flat round dense icon="sports" @click="openCloseModal(match)"
                >
                  <q-tooltip>Fechar Jogo</q-tooltip>
                </q-btn>
                
                <!-- Botão JÁ INSCRITO (Aparece se o utilizador já faz parte do plantel deste jogo) -->
                <q-btn
                  v-if="(!match.status || match.status === 'aberto') && match.isUserInscribed"
                  color="green-9" text-color="white" unelevated disable label="Inscrito" icon="check_circle" class="text-weight-bold q-px-md shadow-1" style="border-radius: 8px;"
                />

                <!-- Botão VOU JOGAR (Aparece se houver vagas E o utilizador ainda não estiver inscrito) -->
                <q-btn
                  v-else-if="(!match.status || match.status === 'aberto') && (match.confirmedCount < match.max_players)"
                  color="amber-8" text-color="dark" unelevated label="Vou Jogar" class="text-weight-bolder q-px-md shadow-2" style="border-radius: 8px;"
                  @click="joinMatch(match)"
                />

                <!-- Botão ESGOTADO (Aparece se já estiver no limite E o utilizador não estiver inscrito) -->
                <q-btn
                  v-else-if="(!match.status || match.status === 'aberto') && (match.confirmedCount >= match.max_players)"
                  color="negative" text-color="white" unelevated disable label="Completo" class="text-weight-bolder q-px-md shadow-1" style="border-radius: 8px;"
                />

                <!-- BOTÃO PARA REABRIR JOGO FECHADO (Admin/Dono) -->
                <q-btn 
                  v-if="match.status === 'fechado' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)"
                  flat dense round 
                  color="amber-8" 
                  icon="edit" 
                  @click="reopenMatch(match)"
                >
                  <q-tooltip>Editar / Reabrir Jogo</q-tooltip>
                </q-btn>

                <!-- Botão AVALIAR JOGO (Apenas se ainda não votou) -->
                <q-btn 
                  v-if="match.status === 'votacao' && !votedMatches.includes(match.id)" 
                  color="blue-8" 
                  text-color="white" 
                  unelevated 
                  label="Avaliar Jogo" 
                  icon="how_to_vote" 
                  class="text-weight-bolder q-px-md shadow-2" 
                  style="border-radius: 8px;"
                  @click="openVotingModal(match)" 
                />

                <!-- Botão JÁ VOTASTE (Bloqueado) -->
                <q-btn 
                  v-if="match.status === 'votacao' && votedMatches.includes(match.id)" 
                  color="grey-4" 
                  text-color="grey-7" 
                  unelevated 
                  disable
                  label="Voto Registado" 
                  icon="check_circle" 
                  class="text-weight-bold q-px-md shadow-1" 
                  style="border-radius: 8px;"
                />

                <!-- Botão ENCERRAR VOTAÇÕES e APURAR (Para os Admins) -->
                <q-btn 
                  v-if="match.status === 'votacao' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)"
                  color="negative" 
                  flat round dense 
                  icon="gavel" 
                  @click="closeVoting(match)"
                >
                  <q-tooltip>Encerrar Urnas e Apurar MVP</q-tooltip>
                </q-btn>

                <!-- BOTÃO PARA VER RESULTADOS DO JOGO FECHADO -->
                <q-btn 
                  v-if="match.status === 'fechado'" 
                  flat dense 
                  color="amber-9" 
                  icon="emoji_events" 
                  label="Resultados" 
                  class="text-weight-bold"
                  @click="openResultsModal(match)"
                />
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
      
      <!-- NOVO: MENSAGEM DE FILTRO VAZIO -->
      <div v-else class="text-center q-pa-xl match-card-light q-mt-md">
        <q-icon name="event_busy" size="4em" class="text-grey-4 q-mb-sm" />
        <div class="text-subtitle1 text-weight-bold text-dark">Nenhum jogo nesta vista</div>
        <p class="text-caption text-grey-6 q-px-md q-mt-xs">
          Não encontrámos partidas para esta pesquisa. Muda de aba para acederes aos jogos passados ou marca um novo desafio.
        </p>
      </div>
    </q-pull-to-refresh>

    <!-- Botão Flutuante (+ Criar Partida) -->
    <q-page-sticky v-if="clubStore.currentClub?.can_manage_matches" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="amber-8" text-color="dark" class="shadow-5" @click="openCreateMatch()">
        <q-tooltip>Agendar Pelada</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <q-dialog v-model="showCreateModal" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 350px; border-radius: 20px;">
        <!-- CABEÇALHO PRETO PREMIUM -->
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bolder row items-center">
            <q-icon name="event_available" color="primary" size="sm" class="q-mr-sm" />
            Nova Convocatória
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-lg q-px-md">
          <q-form @submit="saveMatch" class="q-gutter-md">
            <!-- NOVO: Toggle de Definições -->
            <div class="row items-center q-mb-md bg-grey-2 q-pa-sm" style="border-radius: 8px;">
              <q-toggle 
                v-model="useDefaultSettings" 
                color="primary" 
                label="Bloquear com as definições do clube" 
                @update:model-value="applyDefaults"
              />
            </div>

            <q-input 
              rounded 
              outlined 
              dense 
              v-model="newMatch.date" 
              type="datetime-local" 
              label="Data e Hora" 
              stack-label 
              :disable="useDefaultSettings" 
              :rules="[val => !!val || 'Obrigatório']" 
            />

            <q-input rounded outlined dense v-model="newMatch.location" label="Local / Campo" :disable="useDefaultSettings" :rules="[val => !!val || 'Obrigatório']" />

            <!-- BLOCO 1: Lotação e Preço -->
            <div class="row no-wrap" style="gap: 16px;">
              <q-input class="col" rounded outlined dense v-model.number="newMatch.max_players" type="number" label="Máx Jogadores" :disable="useDefaultSettings" />
              <q-input class="col" rounded outlined dense v-model.number="newMatch.price_per_player" type="number" step="0.5" label="Preço (€)" :disable="useDefaultSettings" />
            </div>

            <!-- BLOCO 2: Nomes das Equipas -->
            <div class="row no-wrap" style="gap: 16px;">
              <q-input class="col" rounded outlined dense v-model="newMatch.team_a_name" label="Equipa A" :disable="useDefaultSettings" />
              <q-input class="col" rounded outlined dense v-model="newMatch.team_b_name" label="Equipa B" :disable="useDefaultSettings" />
            </div>

            <!-- Checkbox para aplicar a todos os jogos futuros (Só aparece ao Editar) -->
            <div v-if="newMatch.id" class="row items-center q-mb-md bg-amber-1 q-pa-sm" style="border-radius: 8px; border: 1px solid #ffe082;">
              <q-checkbox v-model="applyToFuture" color="amber-10" label="Aplicar preço, lotação e local a todos os jogos abertos seguintes" />
            </div>

            <!-- ZONA DOS BOTÕES -->
            <div class="column q-gutter-y-sm q-mt-lg">
              
              <!-- 1. Botão Principal (Publicar / Guardar) -->
              <q-btn
                :label="newMatch.id ? 'Guardar Alterações' : 'Publicar (Só 1)'"
                type="submit"
                color="primary"
                unelevated
                class="full-width text-weight-bold"
                style="border-radius: 8px; padding: 10px 0;"
                :loading="saving"
              />
              
              <!-- 2. Botão Secundário (Gerar Lote) -->
              <q-btn
                v-if="!newMatch.id"
                label="Gerar Mês Inteiro"
                icon="auto_mode"
                color="dark"
                unelevated
                outline
                class="full-width text-weight-bold"
                style="border-radius: 8px; padding: 10px 0;"
                @click="generateMonthlyMatchesBulk"
                :loading="saving"
              />

              <!-- 3. Cancelar -->
              <q-btn 
                label="Cancelar" 
                flat 
                color="grey-6" 
                v-close-popup 
                class="full-width text-weight-bold"
                style="border-radius: 8px; padding: 10px 0;" 
              />

            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  
    <q-dialog v-model="showPresencesModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="min-width: 340px; max-width: 480px; width: 100%; border-radius: 24px; overflow: hidden; margin-bottom: 75px;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div>
            <div class="text-subtitle1 text-weight-bolder row items-center"><q-icon name="groups" color="primary" class="q-mr-sm" />Convocatória & Equipas</div>
            <div class="text-caption text-grey-5">{{ selectedMatch ? formatDate(selectedMatch.date) : '' }}</div>
          </div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
  
        <q-card-section v-if="presences.length > 0 && selectedMatch?.status !== 'fechado'" class="bg-grey-3 q-py-sm row q-gutter-sm justify-center" style="border-bottom: 1px solid #e2e8f0;">
          <!-- Botão de Sorteio (Apenas para Admins) -->
          <q-btn v-if="clubStore.currentClub?.can_manage_teams" color="primary" unelevated icon="auto_awesome" label="Auto FUT" class="col text-weight-bold" style="border-radius: 10px;" @click="autoBalanceTeams" />
          
          <!-- NOVO: Botão do Popup de Leitura (Para todos verem) -->
          <q-btn color="dark" unelevated icon="visibility" label="Ver Equipas" class="col text-weight-bold" style="border-radius: 10px;" @click="showTeamsSummaryModal = true" />
        </q-card-section>

        <q-card-section v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)" class="q-pa-md bg-grey-3 border-bottom">
          <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Painel Administrativo: Inscrever Jogador do Plantel</div>
            <div class="column q-gutter-y-sm">
              <q-select
                v-model="selectedSquadPlayers"
                :options="squadOptions"
                dense
                outlined
                multiple
                use-chips
                label="Procurar jogadores (Podes escolher vários)"
                bg-color="white"
                color="green-9"
                use-input
                @filter="filterSquadPlayers"
                behavior="menu"
                menu-style="max-height: 280px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 10000 !important;"
                style="max-height: 120px; overflow-y: auto;" 
              >
                <!-- DESIGN DA LISTA SUSPENSA (Fina e Compacta) -->
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" class="q-py-xs" style="border-bottom: 1px solid #f1f5f9; min-height: 36px;">
                    
                    <q-item-section avatar style="min-width: 32px; padding-right: 8px;">
                      <!-- Caixa Escura Encolhida para 26px -->
                      <div class="column items-center justify-center bg-dark text-white shadow-1" style="border-radius: 6px; width: 26px; height: 26px;">
                        <span class="text-weight-bolder" style="font-size: 8px; text-transform: uppercase;">
                          {{ scope.opt.position.substring(0,3) }}
                        </span>
                      </div>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-bold text-dark row items-center" style="font-size: 13px;">
                        {{ scope.opt.label }}
                        <q-icon v-if="scope.opt.type === 'virtual'" name="construction" color="amber-9" size="xs" class="q-ml-xs" />
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side v-if="scope.selected">
                      <q-icon name="check_circle" color="green-9" size="sm" />
                    </q-item-section>

                  </q-item>
                </template>

                <!-- DESIGN DOS NOMES SELECIONADOS NA CAIXA (Chips Miniatura) -->
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    size="sm"
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="grey-2"
                    text-color="dark"
                    class="text-weight-bold q-ma-none q-mr-xs q-mt-xs"
                    style="border-radius: 4px; border: 1px solid #e2e8f0;"
                  >
                    {{ scope.opt.label.split(' ')[0] }}
                  </q-chip>
                </template>
              </q-select>

              <!-- Botão de Inscrição a ocupar a largura toda -->
              <q-btn 
                color="dark" 
                icon="assignment_turned_in" 
                label="Convocar Selecionados" 
                @click="addSquadPlayerToMatch" 
                unelevated 
                class="text-weight-bold shadow-1 full-width q-mt-xs" 
                style="border-radius: 8px; height: 44px;" 
              />
            </div>
        </q-card-section>
  
        <!-- LISTA ÚNICA DE JOGADORES (Sem separadores) -->
        <q-card-section class="q-pa-none bg-grey-1" style="max-height: 50vh; overflow-y: auto;">
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
                  <q-badge v-if="presence.team" :color="presence.team === 'A' ? (clubSettings?.default_team_a_color || 'blue') : (clubSettings?.default_team_b_color || 'orange')" class="q-ml-sm text-weight-bold">
                    {{ presence.team }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption>
                  <span :class="presence.status === 'confirmed' ? 'text-primary text-weight-medium' : 'text-warning'">
                    {{ presence.status === 'confirmed' ? 'Confirmado' : 'Lista de Espera' }}
                  </span>
                </q-item-label>
              </q-item-section>
              
              <q-item-section side>
                <div v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.can_manage_finances)" class="row items-center no-wrap">
                  <template v-if="clubStore.currentClub?.can_manage_teams">
                    
                    <!-- BOTÃO QUADRADO DA EQUIPA A -->
                    <q-btn 
                      dense unelevated label="A" class="text-weight-bolder q-mr-xs" 
                      :color="presence.team === 'A' ? (clubSettings?.default_team_a_color || 'blue') : 'grey-3'" 
                      :text-color="presence.team === 'A' ? 'white' : 'grey-8'"
                      style="border-radius: 4px; width: 18px; height: 18px; min-height: 18px; min-width: 18px; padding: 0; font-size: 10px;"
                      @click="assignTeam(presence, 'A')" 
                    />

                    <!-- BOTÃO QUADRADO DA EQUIPA B -->
                    <q-btn 
                      dense unelevated label="B" class="text-weight-bolder q-mr-sm" 
                      :color="presence.team === 'B' ? (clubSettings?.default_team_b_color || 'orange') : 'grey-3'" 
                      :text-color="presence.team === 'B' ? 'white' : 'grey-8'"
                      style="border-radius: 4px; width: 18px; height: 18px; min-height: 18px; min-width: 18px; padding: 0; font-size: 10px;"
                      @click="assignTeam(presence, 'B')" 
                    />
                    
                  </template>
                  
                  <q-btn v-if="clubStore.currentClub?.can_manage_finances || clubStore.currentClub?.is_owner" flat round dense :icon="presence.paid ? 'price_check' : 'currency_exchange'" size="sm" :color="presence.paid ? 'positive' : 'grey-4'" @click="togglePayment(presence)" />
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
      <q-card style="min-width: 340px; max-width: 600px; width: 100%; border-radius: 16px; background: #ffffff;">
        
        <!-- Cabeçalho com o tema principal do clube -->
        <q-card-section class="row items-center club-header-block text-white">
          <div class="text-subtitle1 text-weight-bold">
            <q-icon name="sports" size="sm" class="q-mr-sm"/> Estatísticas do Jogo
          </div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        
        <q-card-section class="q-pa-md" style="max-height: 65vh; overflow-y: auto;">
          <div v-if="loadingPresences" class="text-center q-pa-md"><q-spinner color="green-9" size="30px" /></div>
          
          <div v-else>
            <!-- PLACAR PRINCIPAL -->
            <div class="row items-center justify-center text-center q-mb-lg bg-grey-1 q-pa-sm shadow-1" style="border-radius: 12px; border: 1px solid #e2e8f0;">
              <div class="col-4">
                <div :class="`text-caption text-weight-bold text-uppercase text-${clubSettings?.default_team_a_color || 'blue'}`">{{ matchToClose?.team_a_name || 'EQUIPA A' }}</div>
                <div :class="`text-h2 text-weight-bolder text-${clubSettings?.default_team_a_color || 'blue'}`" style="line-height: 1;">{{ computedScoreA }}</div>
              </div>
              <div class="col-2 text-h4 text-grey-4 text-weight-bold">-</div>
              <div class="col-4">
                <div :class="`text-caption text-weight-bold text-uppercase text-${clubSettings?.default_team_b_color || 'orange'}`">{{ matchToClose?.team_b_name || 'EQUIPA B' }}</div>
                <div :class="`text-h2 text-weight-bolder text-${clubSettings?.default_team_b_color || 'orange'}`" style="line-height: 1;">{{ computedScoreB }}</div>
              </div>
            </div>

            <!-- LISTA DA EQUIPA A -->
            <div :class="`text-${matchSettingsColor(matchToClose, 'A')} text-weight-bold q-mb-sm q-ml-sm row items-center text-uppercase`">
              <q-icon name="shield" class="q-mr-xs"/> {{ matchToClose?.team_a_name || clubSettings?.default_team_a_name || 'Equipa A' }}
            </div>

            <div v-for="player in matchPlayersStats.teamA" :key="player.id" class="row no-wrap items-center justify-between q-mb-sm bg-white q-pa-sm shadow-1" :style="`border-radius: 12px; border: 1px solid #f1f5f9; border-left: 4px solid var(--q-${clubSettings?.default_team_a_color || 'blue'});`">
              
              <!-- Nome do Jogador -->
              <div class="text-body2 text-ellipsis text-weight-bold text-dark" style="flex: 1; min-width: 0; padding-right: 8px;">
                {{ player.name }}
              </div>
              
              <!-- Controlos Customizados (+ / -) Clean Design -->
              <div class="row no-wrap q-gutter-x-md" style="width: auto;">
                
                <!-- Golos -->
                <div class="column items-center">
                  <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">GOLOS</div>
                  <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                    <q-btn round dense flat icon="remove" size="10px" :color="player.goals > 0 ? 'dark' : 'grey-4'" :disable="player.goals <= 0" @click="player.goals--" />
                    <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.goals }}</div>
                    <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.goals++" />
                  </div>
                </div>
                
                <!-- Assistências -->
                <div class="column items-center">
                  <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">ASSIS</div>
                  <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                    <q-btn round dense flat icon="remove" size="10px" :color="player.assists > 0 ? 'dark' : 'grey-4'" :disable="player.assists <= 0" @click="player.assists--" />
                    <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.assists }}</div>
                    <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.assists++" />
                  </div>
                </div>

              </div>
            </div>


            <!-- LISTA DA EQUIPA B -->
            <div :class="`text-${matchSettingsColor(matchToClose, 'B')} text-weight-bold q-mt-lg q-mb-sm q-ml-sm row items-center text-uppercase`">
              <q-icon name="shield" class="q-mr-xs"/> {{ matchToClose?.team_b_name || clubSettings?.default_team_b_name || 'Equipa B' }}
            </div>

            <div v-for="player in matchPlayersStats.teamB" :key="player.id" class="row no-wrap items-center justify-between q-mb-sm bg-white q-pa-sm shadow-1" :style="`border-radius: 12px; border: 1px solid #f1f5f9; border-left: 4px solid var(--q-${clubSettings?.default_team_b_color || 'orange'});`">
              
              <!-- Nome do Jogador -->
              <div class="text-body2 text-ellipsis text-weight-bold text-dark" style="flex: 1; min-width: 0; padding-right: 8px;">
                {{ player.name }}
              </div>
              
              <!-- Controlos Customizados (+ / -) Clean Design -->
              <div class="row no-wrap q-gutter-x-md" style="width: auto;">
                
                <!-- Golos -->
                <div class="column items-center">
                  <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">GOLOS</div>
                  <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                    <q-btn round dense flat icon="remove" size="10px" :color="player.goals > 0 ? 'dark' : 'grey-4'" :disable="player.goals <= 0" @click="player.goals--" />
                    <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.goals }}</div>
                    <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.goals++" />
                  </div>
                </div>
                
                <!-- Assistências -->
                <div class="column items-center">
                  <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">ASSIS</div>
                  <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                    <q-btn round dense flat icon="remove" size="10px" :color="player.assists > 0 ? 'dark' : 'grey-4'" :disable="player.assists <= 0" @click="player.assists--" />
                    <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.assists }}</div>
                    <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.assists++" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-actions align="between" class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
          <!-- NOVO: Botão de guardar o progresso e manter o jogo aberto -->
          <q-btn 
            label="Guardar (Ao Vivo)" 
            color="blue-8" 
            icon="save" 
            unelevated 
            style="border-radius: 8px;" 
            :loading="saving" 
            @click="saveLiveStats" 
          />
          
          <!-- O teu botão antigo de Trancar, renomeado para ser mais claro -->
          <q-btn 
            label="Encerrar Partida" 
            color="amber-8" 
            text-color="dark" 
            class="text-weight-bolder shadow-1" 
            style="border-radius: 8px;" 
            unelevated 
            :loading="saving" 
            @click="closeMatch" 
          />
        </q-card-actions>
        
      </q-card>
    </q-dialog>

    <!-- MODAL DA EQUIPA TÉCNICA -->
    <q-dialog v-model="showStaffModal">
      <q-card style="min-width: 350px; max-width: 550px; width: 100%; border-radius: 12px;">
        
        <q-card-section class="row items-center bg-dark text-white">
          <div class="text-subtitle1 text-weight-bold">Equipa Técnica & Permissões</div>
          <q-space /><q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- ZONA PARA ADICIONAR NOVO ADMIN -->
        <q-card-section class="bg-grey-2" style="border-bottom: 1px solid #e2e8f0;">
          <div class="text-caption text-weight-bold text-dark q-mb-xs">Adicionar Membro à Equipa Técnica</div>
          <div class="row q-gutter-sm items-center">
            <q-select 
              v-model="selectedNewAdmin" 
              :options="eligibleMembersOptions" 
              dense outlined bg-color="white" class="col"
              label="Procurar jogador no plantel..."
              use-input hide-selected fill-input
              @filter="filterEligibleMembers"
            />
            <q-btn color="primary" icon="add_moderator" label="Promover" unelevated class="text-weight-bold" @click="addAdmin" />
          </div>
        </q-card-section>

        <!-- LISTA DE ADMINS COM PERMISSÕES -->
        <q-card-section class="q-pa-none" style="max-height: 50vh; overflow-y: auto;">
          <div v-if="loadingStaff" class="text-center q-pa-lg"><q-spinner color="primary" size="30px" /></div>
          
          <q-list v-else separator>
            <q-item v-for="member in staffList" :key="member.profile_id" class="q-py-md">
              
              <!-- 1. Nome e Cargo -->
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ member.profiles?.name || 'Sem Nome' }}</q-item-label>
                <q-item-label caption v-if="member.is_owner" class="text-amber-9 text-weight-bold">Dono do Clube</q-item-label>
                <q-item-label caption v-else class="text-primary text-weight-bold">Administrador</q-item-label>
              </q-item-section>
              
              <!-- 2. Permissões (Agora todas uniformizadas na cor 'primary') -->
              <q-item-section>
                <div class="column q-gutter-y-xs">
                  <q-toggle dense size="sm" v-model="member.can_manage_matches" color="primary" label="Gerir Jogos" @update:model-value="val => updatePermission(member.profile_id, 'can_manage_matches', val)" />
                  <q-toggle dense size="sm" v-model="member.can_manage_teams" color="primary" label="Gerir Plantel" @update:model-value="val => updatePermission(member.profile_id, 'can_manage_teams', val)" />
                  <q-toggle dense size="sm" v-model="member.can_manage_finances" color="primary" label="Tesoureiro" @update:model-value="val => updatePermission(member.profile_id, 'can_manage_finances', val)" />
                </div>
              </q-item-section>
              
              <!-- 3. Botão de Remover (A secção está SEMPRE presente para forçar o alinhamento) -->
              <q-item-section side>
                <q-btn v-if="!member.is_owner" flat round dense color="negative" icon="remove_moderator" @click="removeAdmin(member.profile_id)">
                  <q-tooltip>Remover da Equipa Técnica</q-tooltip>
                </q-btn>
                
                <!-- O botão "Fantasma" que garante o alinhamento milimétrico para o Dono -->
                <q-btn v-else flat round dense icon="remove_moderator" style="visibility: hidden;" />
              </q-item-section>

            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showRequestsModal">
      <q-card style="min-width: 350px; border-radius: 16px;">
        <q-card-section class="row items-center bg-dark text-white">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="person_add" size="sm" class="q-mr-sm text-primary" /> 
            Pedidos de Entrada
          </div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-none bg-grey-1" style="max-height: 50vh; overflow-y: auto;">
          <q-list v-if="pendingRequests.length > 0" separator>
            <q-item v-for="req in pendingRequests" :key="req.profile_id" class="q-py-md bg-white shadow-1 q-mb-xs">
              <q-item-section avatar>
                <q-avatar color="grey-3" text-color="dark" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ req.profiles?.name || 'Sem Nome' }}</q-item-label>
                <q-item-label caption>Quer juntar-se ao plantel</q-item-label>
              </q-item-section>
              <q-item-section side class="row q-gutter-sm">
                <div>
                  <q-btn round dense color="negative" icon="close" flat @click="handleRequest(req.profile_id, 'rejected')">
                    <q-tooltip>Rejeitar</q-tooltip>
                  </q-btn>
                  <q-btn round dense color="positive" icon="check" unelevated class="q-ml-sm" @click="handleRequest(req.profile_id, 'approved')">
                    <q-tooltip>Aprovar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-xl text-grey-6">
            <q-icon name="check_circle_outline" size="3em" class="q-mb-md text-grey-4" />
            <div>Não há pedidos pendentes.</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSettingsModal" transition-show="slide-up" transition-hide="slide-down">
      <!-- Adicionámos 'margin-bottom: 75px;' para o empurrar para cima e descolar do footer -->
      <q-card style="width: 100%; max-width: 500px; max-height: 85vh; border-radius: 24px; background: #ffffff; display: flex; flex-direction: column; overflow: hidden; margin-bottom: 75px;">

        <!-- 1. CABEÇALHO PRETO FIXO -->
        <q-card-section class="bg-dark text-white q-py-md" style="flex-shrink: 0;">
          <div class="row items-center justify-between">
            <div class="text-subtitle1 text-weight-bolder row items-center">
              <q-icon name="settings" color="primary" size="sm" class="q-mr-sm" /> Definições do Clube
            </div>
            <q-btn icon="close" flat round dense color="grey-4" v-close-popup />
          </div>
        </q-card-section>

        <!-- 2. CORPO COM SCROLL VERTICAL (Campos Empilhados de forma limpa) -->
        <q-card-section class="q-pa-md scroll" style="flex-grow: 1; overflow-y: auto; overflow-x: hidden;">
          <div class="column q-gutter-y-md">
            
            <!-- FINANCEIRO -->
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Financeiro</div>
              <q-input outlined dense type="number" step="0.5" v-model.number="clubSettings.default_price" label="Preço Padrão por Jogo (€)" class="q-mb-sm" bg-color="white" />
              <q-input outlined dense type="number" step="1" v-model.number="clubSettings.monthly_fee" label="Mensalidade Padrão (€)" bg-color="white" />
            </div>

            <!-- LOGÍSTICA -->
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Logística</div>
              <q-input outlined dense v-model="clubSettings.default_location" label="Campo / Local Fixo" class="q-mb-sm" bg-color="white" />
              <q-input 
                outlined dense type="number" :min="2"
                v-model.number="clubSettings.default_max_players" 
                label="Nº Lotação Máxima" 
                bg-color="white" 
                @update:model-value="enforceSquadLimit"
              />
            </div>
            
            <!-- EQUIPAS -->
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Equipas</div>
              <q-input outlined dense v-model="clubSettings.default_team_a_name" label="Nome Equipa A" class="q-mb-sm" bg-color="white" />
              <q-input outlined dense v-model="clubSettings.default_team_b_name" label="Nome Equipa B" bg-color="white" />
            </div>
            
            <!-- CORES -->
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Cores Padrão</div>
              <q-select outlined dense emit-value map-options v-model="clubSettings.default_team_a_color" :options="[{label: 'Bordeaux', value: 'red-10'}, {label: 'Vermelho', value: 'red-8'}, {label: 'Laranja', value: 'orange-8'}, {label: 'Amarelo', value: 'yellow-7'}, {label: 'Verde', value: 'positive'}, {label: 'Verde Tropa', value: 'green-10'}, {label: 'Ciano', value: 'cyan-7'}, {label: 'Azul', value: 'blue'}, {label: 'Azul Marinho', value: 'blue-10'}, {label: 'Roxo', value: 'purple'}, {label: 'Rosa', value: 'pink-6'}, {label: 'Castanho', value: 'brown-6'}, {label: 'Cinzento', value: 'grey-7'}, {label: 'Preto', value: 'dark'}]" label="Cor Equipa A" class="q-mb-sm" bg-color="white">
                <template v-slot:option="scope"><q-item v-bind="scope.itemProps" class="q-py-xs"><q-item-section avatar><q-avatar :color="scope.opt.value" size="xs" /></q-item-section><q-item-section>{{ scope.opt.label }}</q-item-section></q-item></template>
              </q-select>             
              <q-select outlined dense emit-value map-options v-model="clubSettings.default_team_b_color" :options="[{label: 'Bordeaux', value: 'red-10'}, {label: 'Vermelho', value: 'negative'}, {label: 'Laranja', value: 'orange'}, {label: 'Amarelo', value: 'yellow-8'}, {label: 'Verde', value: 'positive'}, {label: 'Verde Tropa', value: 'green-10'}, {label: 'Ciano', value: 'cyan-7'}, {label: 'Azul', value: 'blue'}, {label: 'Azul Marinho', value: 'blue-10'}, {label: 'Roxo', value: 'purple'}, {label: 'Rosa', value: 'pink-6'}, {label: 'Castanho', value: 'brown-6'}, {label: 'Cinzento', value: 'grey-7'}, {label: 'Preto', value: 'dark'}]" label="Cor Equipa B" bg-color="white">
                <template v-slot:option="scope"><q-item v-bind="scope.itemProps" class="q-py-xs"><q-item-section avatar><q-avatar :color="scope.opt.value" size="xs" /></q-item-section><q-item-section>{{ scope.opt.label }}</q-item-section></q-item></template>
              </q-select>           
            </div>

            <!-- ROTINA -->
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Rotina Semanal</div>
              <q-select outlined dense emit-value map-options v-model="clubSettings.recurring_day_of_week" :options="[{label:'Segunda',value:1},{label:'Terça',value:2},{label:'Quarta',value:3},{label:'Quinta',value:4},{label:'Sexta',value:5},{label:'Sábado',value:6},{label:'Domingo',value:7}]" label="Dia de Jogo Fixo" class="q-mb-sm" bg-color="white" />
              <q-input outlined dense type="time" v-model="clubSettings.recurring_time" label="Hora Fixa" bg-color="white" />
            </div>

            <!-- FUT E TOGGLES -->
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">FUT Atributos</div>
              <q-select outlined dense emit-value map-options v-model="clubSettings.attribute_mode" :options="[{label: 'Valores Numéricos (1-99)', value: 'numeric'}, {label: 'Categorias de Palavras', value: 'categorical'}]" label="Modo de Visualização" class="q-mb-md" bg-color="white" />
              <div class="column q-gutter-y-sm bg-grey-2 q-pa-sm" style="border-radius: 8px;">
                <q-toggle v-model="clubSettings.hide_attributes_from_members" color="negative" label="Ocultar Ratings/OVR dos membros" class="text-caption" dense />
                <q-toggle v-model="clubSettings.enable_voting" color="blue" label="Ativar Votação de MVP pós-jogo" class="text-caption" dense />
              </div>
            </div>

            <!-- TITULARES FIXOS -->
            <div class="q-mt-sm bg-white q-pa-sm shadow-1" style="border-radius: 12px; border: 1px solid #e2e8f0; width: 100%;">
              <div class="row justify-between items-center q-mb-sm q-px-xs">
                <span class="text-weight-bold text-dark row items-center text-caption">
                  <q-icon name="stars" color="amber-8" class="q-mr-xs" size="xs" /> Titulares Fixos
                </span>
                <q-badge color="grey-3" text-color="dark" class="text-weight-bolder px-sm" style="font-size: 10px;">
                  {{ clubSettings.default_squad?.length || 0 }} / {{ clubSettings.default_max_players }}
                </q-badge>
              </div>
              <q-select
                outlined dense multiple use-chips
                v-model="clubSettings.default_squad"
                :options="allClubPlayersOptions"
                :max-values="clubSettings.default_max_players"
                label="Selecione os titulares..."
                color="green-9"
                bg-color="white"
                style="width: 100%;"
                behavior="menu"
              >
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable dense size="xs" color="amber-2" text-color="dark"
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex" class="text-weight-bold q-ma-xs"
                    style="border: 1px solid #fcd34d;"
                  >
                    {{ scope.opt.label.split(' ')[0] }}
                  </q-chip>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <!-- 3. RODAPÉ FIXO -->
        <q-card-actions align="right" class="bg-grey-1 q-pa-md" style="flex-shrink: 0; border-top: 1px solid #e2e8f0;">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup class="q-mr-sm" />
          <q-btn color="primary" label="Guardar Definições" @click="saveClubSettings" :loading="savingSettings" unelevated style="border-radius: 8px;" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- MODAL DE VOTAÇÃO (AVALIAÇÕES E MVP) -->
    <q-dialog v-model="showVotingModal" persistent>
      <q-card class="column no-wrap" style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px; max-height: 85vh;">
        
        <q-card-section class="row items-center col-auto text-white bg-blue-9 q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="how_to_vote" class="q-mr-sm" size="sm" />
            Votação & MVP
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="col q-pa-md" style="overflow-y: auto; overflow-x: hidden;">
          <div class="text-caption text-grey-8 q-mb-md text-weight-medium">
            Dá uma nota de 1 a 10 aos teus colegas de equipa e escolhe quem merece levar a bola para casa (MVP). <span class="text-blue-8 text-weight-bold">A tua votação é 100% anónima.</span>
          </div>

          <div v-if="loadingVotes" class="text-center q-pa-lg">
            <q-spinner color="blue" size="40px" />
          </div>

          <div v-else>
            <div v-for="p in votingPlayers" :key="p.id" class="q-mb-md bg-grey-1 q-pa-sm shadow-1" style="border-radius: 8px; border: 1px solid #f1f5f9;">
              
              <div class="row justify-between items-center q-mb-sm">
                <div class="text-weight-bold text-dark text-ellipsis" style="max-width: 65%;">
                  <q-icon name="person" color="grey-6" class="q-mr-xs" /> {{ p.name }}
                </div>
                <q-radio v-model="selectedMVP" :val="p.id" color="amber-8" label="MVP" class="text-weight-bolder text-amber-9" dense />
              </div>
              
              <div class="row items-center q-gutter-x-md q-px-sm">
                <div class="col">
                  <q-slider v-model="p.rating" :min="1" :max="10" :step="1" color="blue-6" markers dense />
                </div>
                <div class="text-weight-bolder text-blue-9 text-center bg-blue-1" style="width: 30px; border-radius: 4px; padding: 2px;">
                  {{ p.rating }}
                </div>
              </div>

            </div>
          </div>
        </q-card-section>

        <q-card-actions align="between" class="bg-grey-2 col-auto q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn color="blue-9" label="Submeter Votos" unelevated class="text-weight-bold" style="border-radius: 8px;" @click="submitVotes" :loading="savingVotes" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL DOS RESULTADOS FINAIS (MVP E NOTAS) -->
    <q-dialog v-model="showResultsModal">
      <q-card style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px;">
        
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="emoji_events" class="text-amber-5 q-mr-sm" size="sm" />
            Resumo da Partida
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md bg-grey-1" style="max-height: 70vh; overflow-y: auto;">
          <div v-if="loadingResults" class="text-center q-pa-md"><q-spinner color="amber-8" size="30px" /></div>
          
          <div v-else>
            <q-list separator>
              <q-item v-for="(p, index) in matchResultsData" :key="p.id" class="bg-white shadow-1 q-mb-sm" style="border-radius: 8px;">
                
                <q-item-section avatar>
                  <q-avatar :color="p.isMvp ? 'amber-8' : 'grey-3'" :text-color="p.isMvp ? 'dark' : 'grey-8'" class="text-weight-bolder">
                    {{ index + 1 }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark row items-center">
                    {{ p.name }} 
                    <q-icon v-if="p.isMvp" name="workspace_premium" color="amber-8" size="sm" class="q-ml-xs">
                      <q-tooltip>MVP da Partida</q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label caption class="text-grey-7">
                    Golos: <span class="text-green-9 text-weight-bold">{{ p.goals }}</span> | Assis: <span class="text-blue-9 text-weight-bold">{{ p.assists }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="text-center">
                    <div class="text-caption text-weight-bold text-grey-6" style="font-size: 9px;">NOTA</div>
                    <div class="text-h6 text-weight-bolder" :class="p.rating >= 7 ? 'text-green-9' : (p.rating >= 5 ? 'text-amber-9' : 'text-negative')">
                      {{ p.rating > 0 ? p.rating : '-' }}
                    </div>
                  </div>
                </q-item-section>

              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showTeamsSummaryModal">
      <q-card style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px;">
        
        <q-card-section class="row items-center club-header-block text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="compare_arrows" size="sm" class="q-mr-sm" /> Resumo das Equipas
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md bg-grey-1" style="max-height: 70vh; overflow-y: auto;">
          
          <!-- EQUIPA A -->
          <div class="q-mb-md">
            <div class="row justify-between items-center q-mb-sm q-px-sm">
              <div class="text-weight-bolder text-uppercase text-subtitle1" :class="`text-${clubSettings?.default_team_a_color || 'blue'}`">
                <q-icon name="shield" /> {{ selectedMatch?.team_a_name || clubSettings?.default_team_a_name || 'Equipa A' }}
              </div>
              <q-chip dense :color="clubSettings?.default_team_a_color || 'blue'" text-color="white" class="text-weight-bold shadow-1">
                Média OVR: {{ teamASummary.avgOVR }}
              </q-chip>
            </div>
            <div class="bg-white shadow-1 q-pa-sm" style="border-radius: 12px; border: 1px solid #e2e8f0;">
              <div v-if="teamASummary.players.length === 0" class="text-grey-6 text-center q-pa-sm">Nenhum jogador atribuído</div>
              
              <div v-for="p in teamASummary.players" :key="p.id" class="row justify-between items-center q-py-xs" style="border-bottom: 1px solid #f8fafc;">
                <div class="text-dark text-weight-bold text-ellipsis" style="max-width: 65%;">
                  {{ p.profiles?.name || p.virtual_players?.name || p.guest_name }}
                </div>
                <div class="text-caption text-weight-bolder text-grey-8 bg-grey-2 q-px-sm" style="border-radius: 6px; letter-spacing: 0.5px;">
                  {{ (p.profiles?.position || p.virtual_players?.position || 'MÉD').substring(0,3) }} | {{ p.profiles?.overall || p.virtual_players?.overall || 70 }}
                </div>
              </div>
            </div>
          </div>

          <!-- EQUIPA B -->
          <div>
            <div class="row justify-between items-center q-mb-sm q-px-sm">
              <div class="text-weight-bolder text-uppercase text-subtitle1" :class="`text-${clubSettings?.default_team_b_color || 'orange'}`">
                <q-icon name="shield" /> {{ selectedMatch?.team_b_name || clubSettings?.default_team_b_name || 'Equipa B' }}
              </div>
              <q-chip dense :color="clubSettings?.default_team_b_color || 'orange'" text-color="white" class="text-weight-bold shadow-1">
                Média OVR: {{ teamBSummary.avgOVR }}
              </q-chip>
            </div>
            <div class="bg-white shadow-1 q-pa-sm" style="border-radius: 12px; border: 1px solid #e2e8f0;">
              <div v-if="teamBSummary.players.length === 0" class="text-grey-6 text-center q-pa-sm">Nenhum jogador atribuído</div>
              
              <div v-for="p in teamBSummary.players" :key="p.id" class="row justify-between items-center q-py-xs" style="border-bottom: 1px solid #f8fafc;">
                <div class="text-dark text-weight-bold text-ellipsis" style="max-width: 65%;">
                  {{ p.profiles?.name || p.virtual_players?.name || p.guest_name }}
                </div>
                <div class="text-caption text-weight-bolder text-grey-8 bg-grey-2 q-px-sm" style="border-radius: 6px; letter-spacing: 0.5px;">
                  {{ (p.profiles?.position || p.virtual_players?.position || 'MÉD').substring(0,3) }} | {{ p.profiles?.overall || p.virtual_players?.overall || 70 }}
                </div>
              </div>
            </div>
          </div>

        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MODAL DO PERFIL PESSOAL -->
    <q-dialog v-model="showProfileModal">
      <q-card style="min-width: 340px; max-width: 450px; width: 100%; border-radius: 16px;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center">
            <q-icon name="badge" class="q-mr-sm text-primary" size="sm" /> O Meu Perfil
          </div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        
        <q-card-section class="q-pa-md scroll" style="max-height: 70vh;">
          <div class="column q-gutter-y-md">
            
            <div class="text-caption text-weight-bold text-grey-8">Dados Pessoais</div>
            
            <q-input outlined dense v-model="profileForm.name" label="Nome de Jogador" color="primary" bg-color="grey-1">
              <template v-slot:prepend><q-icon name="person" color="grey-7" /></template>
            </q-input>

            <q-separator class="q-my-sm" />
            <div class="text-caption text-weight-bold text-grey-8">Preferências de Campo</div>

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-select outlined dense v-model="profileForm.position" :options="['Guarda-Redes', 'Defesa', 'Médio', 'Avançado']" label="Posição" color="primary" bg-color="grey-1">
                  <template v-slot:prepend><q-icon name="sports_soccer" color="grey-7" size="xs" /></template>
                </q-select>
              </div>
              <div class="col-6">
                <q-select outlined dense v-model="profileForm.preferred_foot" :options="['Direito', 'Esquerdo', 'Ambos']" label="Pé Preferido" color="primary" bg-color="grey-1">
                  <template v-slot:prepend><q-icon name="do_not_step" color="grey-7" size="xs" /></template>
                </q-select>
              </div>
            </div>

            <q-separator class="q-my-sm" />
            <div class="text-caption text-weight-bold text-grey-8">Segurança</div>
            
            <q-input outlined dense v-model="profileForm.newPassword" :type="isPwdProfile1 ? 'password' : 'text'" label="Nova Password" placeholder="Deixa em branco para manter" color="primary" bg-color="grey-1">
              <template v-slot:prepend><q-icon name="lock" color="grey-7" /></template>
              <template v-slot:append>
                <q-icon :name="isPwdProfile1 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdProfile1 = !isPwdProfile1" />
              </template>
            </q-input>

            <!-- Só aparece se o utilizador começar a escrever uma nova password -->
            <q-input v-if="profileForm.newPassword" outlined dense v-model="profileForm.confirmPassword" :type="isPwdProfile2 ? 'password' : 'text'" label="Confirmar Nova Password" color="primary" bg-color="grey-1" :rules="[val => val === profileForm.newPassword || 'As passwords não coincidem']">
              <template v-slot:prepend><q-icon name="lock_reset" color="grey-7" /></template>
              <template v-slot:append>
                <q-icon :name="isPwdProfile2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdProfile2 = !isPwdProfile2" />
              </template>
            </q-input>
            
          </div>
        </q-card-section>
        
        <q-card-actions align="right" class="bg-grey-1 q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn color="primary" label="Guardar" unelevated style="border-radius: 8px;" @click="saveProfile" :loading="savingProfile" />
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
import { useRouter } from 'vue-router'

const props = defineProps(['id'])
const authStore = useAuthStore()
const clubStore = useClubStore()
const $q = useQuasar()

const matches = ref([])
const loading = ref(true)
const saving = ref(false)
const balancing = ref(false)
const showCreateModal = ref(false)
let realtimeChannel 

const matchViewMode = ref('next')
const selectedMonth = ref(null)

function matchSettingsColor(match, teamType) {
  if (teamType === 'A') {
    return clubSettings.value?.default_team_a_color || 'blue'
  } else {
    return clubSettings.value?.default_team_b_color || 'orange'
  }
}

// --- SISTEMA DE PERFIL PESSOAL ---
const showProfileModal = ref(false)
const savingProfile = ref(false)
const isPwdProfile1 = ref(true)
const isPwdProfile2 = ref(true)
const profileForm = ref({ name: '', position: 'Médio', preferred_foot: 'Direito', newPassword: '', confirmPassword: '' })

function openProfileModal() {
  profileForm.value.name = authStore.profile?.name || ''
  profileForm.value.position = authStore.profile?.position || 'Médio'
  profileForm.value.preferred_foot = authStore.profile?.preferred_foot || 'Direito'
  profileForm.value.newPassword = ''
  profileForm.value.confirmPassword = ''
  isPwdProfile1.value = true
  isPwdProfile2.value = true
  showProfileModal.value = true
}

async function saveProfile() {
  // Verifica se as passwords coincidem antes de enviar para o servidor
  if (profileForm.value.newPassword && profileForm.value.newPassword !== profileForm.value.confirmPassword) {
    $q.notify({ type: 'warning', message: 'As passwords não coincidem.' })
    return
  }

  savingProfile.value = true
  try {
    const updates = {
      name: profileForm.value.name.trim(),
      position: profileForm.value.position,
      preferred_foot: profileForm.value.preferred_foot
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authStore.user.id)
    
    if (profileError) throw profileError
    
    if (authStore.profile) {
      authStore.profile.name = updates.name
      authStore.profile.position = updates.position
      authStore.profile.preferred_foot = updates.preferred_foot
    }
    
    if (profileForm.value.newPassword) {
      const { error: passError } = await supabase.auth.updateUser({ 
        password: profileForm.value.newPassword 
      })
      if (passError) throw passError
    }
    
    $q.notify({ type: 'positive', icon: 'check_circle', message: 'Ficha de jogador atualizada!' })
    showProfileModal.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Erro ao guardar perfil: ' + err.message })
  } finally {
    savingProfile.value = false
  }
}

// Função para a seta da Direita
function nextFilter() {
  const currentIndex = filterButtons.value.findIndex(f => f.value === matchViewMode.value)
  // Avança um, e se chegar ao fim, volta ao início (0)
  const nextIndex = (currentIndex + 1) % filterButtons.value.length
  matchViewMode.value = filterButtons.value[nextIndex].value
}

// Função para a seta da Esquerda
function prevFilter() {
  const currentIndex = filterButtons.value.findIndex(f => f.value === matchViewMode.value)
  // Recua um, e se estiver no início, vai para o último
  const prevIndex = (currentIndex - 1 + filterButtons.value.length) % filterButtons.value.length
  matchViewMode.value = filterButtons.value[prevIndex].value
}

const availableMonths = computed(() => {
  if (matches.value.length === 0) return []
  const months = [...new Set(matches.value.map(m => m.date.substring(0, 7)))]
  months.sort((a, b) => b.localeCompare(a))
  
  return months.map(m => {
    const [year, month] = m.split('-')
    const date = new Date(year, month - 1, 1)
    
    // Pede apenas as 3 letras do mês (ex: "out") e remove pontos
    let monthName = date.toLocaleString('pt-PT', { month: 'short' }).replace('.', '')
    const cleanMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
    
    // Resultado: "Out 2026"
    return { label: `${cleanMonth} ${year}`, value: m }
  })
})

// 1. Contadores
const pendingMatchesCount = computed(() => {
  const now = new Date()
  return matches.value.filter(m => (!m.status || m.status === 'aberto') && new Date(m.date) < now).length
})

const votingMatchesCount = computed(() => {
  return matches.value.filter(m => m.status === 'votacao').length
})

// 2. Botões organizados de forma blindada (usando push para garantir a ordem)
const filterButtons = computed(() => {
  const opts = [{ label: 'Próximo', value: 'next' }]

  // Adiciona a aba de Votação se houver jogos nesse estado
  if (votingMatchesCount.value > 0) {
    opts.push({ label: `Votação (${votingMatchesCount.value})`, value: 'voting' })
  }

  // Adiciona a aba de Pendentes (Apenas para Admins)
  const isManager = clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner
  if (isManager && pendingMatchesCount.value > 0) {
    opts.push({ label: `Pendentes (${pendingMatchesCount.value})`, value: 'pending' })
  }

  // Adiciona as abas fixas no fim
  opts.push({ label: 'Mês', value: 'month' })
  opts.push({ label: 'Todos', value: 'all' })
  opts.push({ label: 'Finalizados', value: 'closed' })

  return opts
})

// 3. Label atual
const currentFilterLabel = computed(() => {
  const current = filterButtons.value.find(f => f.value === matchViewMode.value)
  return current ? current.label : 'Filtro'
})

// 4. O Filtro Real
const filteredMatches = computed(() => {
  if (matchViewMode.value === 'all') return matches.value
  const now = new Date()

  if (matchViewMode.value === 'next') {
    // Procura apenas o 1º jogo aberto que seja no FUTURO
    let nextMatch = matches.value.find(m => (!m.status || m.status === 'aberto') && new Date(m.date) >= now)
    
    // Removida a "rede de segurança". Se não houver jogos futuros, devolve vazio para mostrar o ecrã de aviso!
    return nextMatch ? [nextMatch] : []
  }
  
  if (matchViewMode.value === 'voting') {
    return matches.value.filter(m => m.status === 'votacao')
  }

  if (matchViewMode.value === 'pending') {
    return matches.value.filter(m => (!m.status || m.status === 'aberto') && new Date(m.date) < now)
  }

  if (matchViewMode.value === 'month') {
    if (!selectedMonth.value) return []
    return matches.value.filter(m => m.date.startsWith(selectedMonth.value))
  }

  if (matchViewMode.value === 'closed') {
    return matches.value.filter(m => m.status === 'fechado')
  }

  return []
})

// Memória dos jogos onde o utilizador já votou
const votedMatches = ref([])

async function fetchUserVotes() {
  if (!authStore.user) return
  const { data } = await supabase
    .from('match_votes')
    .select('match_id')
    .eq('voter_id', authStore.user.id)
  
  if (data) {
    votedMatches.value = data.map(v => v.match_id)
  }
}

const useDefaultSettings = ref(true)

async function reopenMatch(match) {
  $q.dialog({
    title: 'Reabrir Partida',
    message: 'Tens a certeza que queres reabrir este jogo para edição? Os golos atuais serão mantidos para poderes ajustá-los.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    // Altera o estado do jogo na BD para 'aberto' (ou o termo que uses para jogos a decorrer)
    const { error } = await supabase
      .from('matches') // Substitui pelo nome da tua tabela de jogos se for diferente
      .update({ status: 'aberto' })
      .eq('id', match.id)

    if (error) {
      $q.notify({ type: 'negative', message: 'Erro ao reabrir jogo: ' + error.message })
    } else {
      $q.notify({ type: 'positive', message: 'Jogo reaberto com sucesso!' })
      // Se tiveres uma função que busca os jogos novamente (ex: fetchMatches), chama-a aqui:
      await fetchMatches() 
    }
  })
}

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
  
  await fetchClubSettings()
  await fetchMatches()
  await fetchUserVotes()
  await fetchPendingRequests()

  realtimeChannel = supabase
    .channel('presences-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'match_presences' },
      async (payload) => {
        // A MAGIA ACONTECE AQUI: Atualiza as frações de lotação (ex: 12/14) no ecrã de fundo silenciosamente
        await fetchMatches(true)

        // Se o modal das equipas estiver aberto, atualiza também a lista de jogadores
        if (showPresencesModal.value && selectedMatch.value) {
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

const showRequestsModal = ref(false)
const pendingRequests = ref([])

async function fetchPendingRequests() {
  if (!clubStore.currentClub?.can_manage_teams && !clubStore.currentClub?.is_owner) return
  
  const { data, error } = await supabase
    .from('club_members')
    .select('profile_id, profiles(name)') // Removido o 'id' que não existe
    .eq('club_id', props.id)
    .eq('status', 'pending')
    
  if (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar pedidos: ' + error.message })
  } else if (data) {
    pendingRequests.value = data
  }
}

async function handleRequest(profileId, action) {
  if (action === 'approved') {
    const { error } = await supabase
      .from('club_members')
      .update({ status: 'approved' })
      .eq('club_id', props.id)      // Identifica o Clube
      .eq('profile_id', profileId)  // Identifica o Jogador
      
    if (!error) $q.notify({ type: 'positive', message: 'Jogador aceite no plantel!' })
  } else {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', props.id)      // Identifica o Clube
      .eq('profile_id', profileId)  // Identifica o Jogador
      
    if (!error) $q.notify({ type: 'info', message: 'Pedido rejeitado.' })
  }
  
  await fetchPendingRequests()
}

function applyDefaults(isToggled) {
  if (isToggled) {
    newMatch.value.location = clubSettings.value?.default_location || ''
    newMatch.value.max_players = clubSettings.value?.default_max_players || 14
    newMatch.value.price_per_player = clubSettings.value?.default_price || 5.00
    newMatch.value.team_a_name = clubSettings.value?.default_team_a_name || 'Equipa A' 
    newMatch.value.team_b_name = clubSettings.value?.default_team_b_name || 'Equipa B' 
    
    // Se for um jogo novo (sem ID), preenche também a data
    if (!newMatch.value.id) {
      newMatch.value.date = getNextRecurringDate(clubSettings.value?.recurring_day_of_week, clubSettings.value?.recurring_time)
    }
  }
}

function openCreateMatch() {
  useDefaultSettings.value = true
  applyToFuture.value = false // Garante que a checkbox vem desmarcada
  newMatch.value = { 
     id: null,
     date: getNextRecurringDate(clubSettings.value?.recurring_day_of_week, clubSettings.value?.recurring_time),
     location: clubSettings.value?.default_location || '',
     max_players: clubSettings.value?.default_max_players || 14,
     price_per_player: clubSettings.value?.default_price || 5.00,
     team_a_name: clubSettings.value?.default_team_a_name || 'Equipa A', // <-- ADICIONADO
     team_b_name: clubSettings.value?.default_team_b_name || 'Equipa B'  // <-- ADICIONADO
   }
   showCreateModal.value = true
}

function openEditMatch(match) {
  useDefaultSettings.value = false
  applyToFuture.value = false // Reset da checkbox de edição em lote
  
  let localIso = ''
  if (match.date) {
    const d = new Date(match.date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    localIso = d.toISOString().slice(0, 16)
  }
  
  newMatch.value = { ...match, date: localIso }
  showCreateModal.value = true
}

async function saveMatch() {
  saving.value = true
  
  // Converter a data do input para formato local de Portugal para comparar
  const targetDateStr = new Date(newMatch.value.date).toLocaleDateString('pt-PT')
  
  // Verifica se já existe um jogo nesse dia (comparando as datas já convertidas para a tua hora local)
  const conflict = matches.value.some(m => 
    m.id !== newMatch.value.id && 
    new Date(m.date).toLocaleDateString('pt-PT') === targetDateStr
  )
  
  if (conflict) {
    $q.dialog({
      title: 'Aviso: Dia Ocupado',
      message: 'Já tens uma pelada agendada para este dia. Queres mesmo marcar outra e sobrepor jogos?',
      cancel: { label: 'Cancelar', flat: true, color: 'grey' },
      ok: { label: 'Sim, Marcar na mesma', color: 'negative', unelevated: true },
      persistent: true
    }).onOk(async () => {
      await executeSaveMatch()
    }).onCancel(() => {
      saving.value = false
    })
  } else {
    await executeSaveMatch()
  }
}

async function executeSaveMatch() {
  // A SOLUÇÃO: Converter a data do input para o formato UTC oficial antes de enviar para o Supabase
  const dateToSave = new Date(newMatch.value.date).toISOString()
  
  if (newMatch.value.id) {
    if (applyToFuture.value) {
      await supabase.from('matches').update({
        date: dateToSave, 
        location: newMatch.value.location,
        max_players: newMatch.value.max_players, 
        price_per_player: newMatch.value.price_per_player
      }).eq('id', newMatch.value.id)
      
      const { error } = await supabase.from('matches').update({
        location: newMatch.value.location, 
        max_players: newMatch.value.max_players, 
        price_per_player: newMatch.value.price_per_player
      }).eq('club_id', clubStore.currentClub.id).eq('status', 'aberto').gt('date', dateToSave)
      
      if (!error) $q.notify({ type: 'positive', message: 'Jogo atualizado e regras aplicadas ao calendário futuro!' })
      else $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
    } else {
      const { error } = await supabase.from('matches').update({
        date: dateToSave, 
        location: newMatch.value.location,
        max_players: newMatch.value.max_players, 
        price_per_player: newMatch.value.price_per_player
      }).eq('id', newMatch.value.id)
      
      if (!error) $q.notify({ type: 'positive', message: 'Jogo atualizado com sucesso!' })
      else $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
    }
    showCreateModal.value = false
  } else {
    const matchToInsert = { 
      date: dateToSave, 
      location: newMatch.value.location,
      max_players: newMatch.value.max_players, 
      price_per_player: newMatch.value.price_per_player,
      team_a_name: newMatch.value.team_a_name, 
      team_b_name: newMatch.value.team_b_name, 
      club_id: clubStore.currentClub.id, 
      status: 'aberto' 
    }
    
    // O .select().single() no final é vital para recebermos o ID do jogo acabado de criar!
    const { data: newMatchData, error } = await supabase.from('matches').insert([matchToInsert]).select().single()

    if (!error) {
      // A MAGIA: Se bloqueaste com definições de clube E tens titulares definidos...
      if (useDefaultSettings.value && clubSettings.value.default_squad?.length > 0) {
        
        // Empacota os titulares todos
        const autoPresences = clubSettings.value.default_squad.map(p => ({
          match_id: newMatchData.id,
          status: 'confirmed',
          profile_id: p.type === 'real' ? p.value : null,
          virtual_player_id: p.type === 'virtual' ? p.value : null
        }))
        
        // Inscreve-os numa única viagem à Base de Dados
        await supabase.from('match_presences').insert(autoPresences)
      }

      $q.notify({ type: 'positive', message: 'Pelada agendada com sucesso!' })
      showCreateModal.value = false
    } else {
      $q.notify({ type: 'negative', message: 'Erro ao criar: ' + error.message })
    }
  }
}

async function deleteMatch(match) {
  $q.dialog({
    title: 'Apagar Jogo',
    message: 'Tens a certeza? O jogo e todas as inscrições serão eliminados permanentemente.',
    cancel: { flat: true, color: 'grey' },
    persistent: true,
    color: 'negative',
    ok: { label: 'Sim, Apagar', color: 'negative', unelevated: true }
  }).onOk(async () => {
    
    saving.value = true; // Mostra barra de carregamento

    // 1º Limpar os jogadores primeiro
    await supabase.from('match_presences').delete().eq('match_id', match.id);
    
    // 2º Apagar o jogo E pedir para confirmar o que foi apagado (.select)
    const { data, error } = await supabase.from('matches').delete().eq('id', match.id).select();
    
    if (error) {
      $q.notify({ type: 'negative', message: 'Erro ao apagar: ' + error.message });
    } else if (data && data.length === 0) {
      // O Supabase bloqueou silenciosamente
      $q.notify({ type: 'warning', icon: 'security', message: 'Bloqueado por segurança! Correste o script no SQL Editor?' });
    } else {
      // Correu tudo bem e a linha foi mesmo apagada
      $q.notify({ type: 'positive', icon: 'delete', message: 'Jogo apagado do calendário.' });
      await fetchMatches(); // Atualiza a lista visualmente
    }
    
    saving.value = false;
  })
}

async function fetchMatches(silent = false) {
  if (!clubStore.currentClub) return
  
  if (!silent) loading.value = true

  // A CORREÇÃO ESTÁ AQUI: Adicionámos o 'profile_id' à pesquisa das presenças
  const { data, error } = await supabase
    .from('matches')
    .select('*, match_presences(id, status, profile_id)')
    .eq('club_id', clubStore.currentClub.id)
    .order('date', { ascending: true })

  if (!error) {
    matches.value = data.map(m => {
      const confirmed = m.match_presences ? m.match_presences.filter(p => p.status === 'confirmed').length : 0
      
      // Verifica se o teu ID está no meio das presenças deste jogo
      const isUserInscribed = m.match_presences ? m.match_presences.some(p => p.profile_id === authStore.user?.id) : false

      return { ...m, confirmedCount: confirmed, isUserInscribed }
    })
    
    if (data.length > 0 && !selectedMonth.value) {
      const months = [...new Set(data.map(m => m.date.substring(0, 7)))]
      months.sort((a, b) => b.localeCompare(a))
      selectedMonth.value = months[0]
    }
  }
  
  if (!silent) loading.value = false
}

async function fetchClubSettings() {
  const { data, error } = await supabase.from('clubs').select('*').eq('id', props.id).single()
  if (data && !error) {
    // Força um nome padrão caso a base de dados devolva vazio (null)
    data.default_team_a_name = data.default_team_a_name || 'Equipa A'
    data.default_team_b_name = data.default_team_b_name || 'Equipa B'
    clubSettings.value = { ...clubSettings.value, ...data }
  }
}

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}

// function copyInviteCode() {
//   const code = clubStore.currentClub?.invite_code
//   if (code) {
//     navigator.clipboard.writeText(code)
//     $q.notify({ type: 'positive', icon: 'content_copy', message: `Código ${code} copiado! Podes colar no WhatsApp.` })
//   } else {
//     $q.notify({ type: 'warning', message: 'Este clube ainda não tem código de convite.' })
//   }
// }
function clearCurrentClub() {
  // Limpa o clube ativo quando clicamos em "Mudar de Clube" 
  // para garantir que a barra inferior desaparece suavemente
  clubStore.setClub(null)
}

const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  clubStore.setClub(null)
  router.push('/login')
}
// --- ESTADO DAS PRESENÇAS ---
const showPresencesModal = ref(false)
const selectedMatch = ref(null)
const presences = ref([])
const loadingPresences = ref(false)

const showTeamsSummaryModal = ref(false)

// Agrupa e calcula as estatísticas da Equipa A
const teamASummary = computed(() => {
  const players = presences.value.filter(p => p.team === 'A' && p.status === 'confirmed')
  const totalOVR = players.reduce((sum, p) => sum + Number(p.profiles?.overall || p.virtual_players?.overall || 70), 0)
  const avgOVR = players.length > 0 ? Math.round(totalOVR / players.length) : 0
  return { players, avgOVR, count: players.length }
})

// Agrupa e calcula as estatísticas da Equipa B
const teamBSummary = computed(() => {
  const players = presences.value.filter(p => p.team === 'B' && p.status === 'confirmed')
  const totalOVR = players.reduce((sum, p) => sum + Number(p.profiles?.overall || p.virtual_players?.overall || 70), 0)
  const avgOVR = players.length > 0 ? Math.round(totalOVR / players.length) : 0
  return { players, avgOVR, count: players.length }
})

async function joinMatch(match) {
  if (!authStore.user) return

  // 1. Descobrir o mês e ano do jogo para validar a mensalidade
  const matchDate = new Date(match.date)
  const matchMonth = matchDate.getMonth() + 1 // JS começa em 0
  const matchYear = matchDate.getFullYear()

  // 2. Verificar o modo de faturação do jogador e se tem o mês pago
  const { data: memberStatus } = await supabase
    .from('club_members')
    .select('billing_mode')
    .eq('club_id', props.id)
    .eq('profile_id', authStore.user.id)
    .single()

  let shouldDefaultToPaid = false

  if (memberStatus?.billing_mode === 'monthly') {
    const { data: monthCheck } = await supabase
      .from('club_monthly_payments')
      .select('paid')
      .eq('club_id', props.id)
      .eq('profile_id', authStore.user.id)
      .eq('month', matchMonth)
      .eq('year', matchYear)
      .maybeSingle()
      
    if (monthCheck?.paid === true) {
      shouldDefaultToPaid = true // Tem o mês pago, não deve nada nesta pelada!
    }
  }

  // 3. Contagem de vagas e Bloqueio
  const { count } = await supabase
    .from('match_presences')
    .select('*', { count: 'exact', head: true })
    .eq('match_id', match.id)
    .eq('status', 'confirmed')

  if (count >= match.max_players) {
    $q.notify({ type: 'negative', message: 'A pelada já está esgotada!' })
    return // Corta a função aqui, ninguém entra!
  }

  // 4. Efetuar a inscrição
  const { error } = await supabase
    .from('match_presences')
    .insert([{ 
      match_id: match.id, 
      profile_id: authStore.user.id, 
      status: 'confirmed', 
      paid: shouldDefaultToPaid 
    }])

  if (!error) {
    $q.notify({ 
      type: 'positive', 
      message: shouldDefaultToPaid ? 'Inscrito! (Pago via Mensalidade)' : 'Inscrição efetuada com sucesso!' 
    })
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
  
  // ADICIONADO: Puxar também os 'goals' e 'assists' da base de dados
  const { data, error } = await supabase
    .from('match_presences')
    .select('id, team, guest_name, goals, assists, profiles(name), virtual_players(name)')
    .eq('match_id', match.id)
    .eq('status', 'confirmed')
    .not('team', 'is', null)
    
  if (!error && data) {
    const teamA = []
    const teamB = []
    data.forEach(p => {
      const name = p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Desconhecido'
      // ADICIONADO: Usar os valores da BD, ou 0 se ainda não tiverem nada
      const playerObj = { 
        id: p.id, 
        name, 
        goals: p.goals || 0, 
        assists: p.assists || 0, 
        team: p.team 
      }
      
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

  // 3. Atualizar a tabela de jogos para encerrar a partida ou abrir votacao
  const nextStatus = clubSettings.value?.enable_voting === true ? 'votacao' : 'fechado'

    const { error: matchError } = await supabase
      .from('matches')
      .update({ 
         status: nextStatus, 
         team_a_goals: finalScoreA, 
         team_b_goals: finalScoreB 
       })
      .eq('id', matchToClose.value.id)

    if (matchError) {
      $q.notify({ type: 'negative', message: 'Erro ao fechar a partida: ' + matchError.message })
    } else {
      $q.notify({ 
         type: 'positive', 
         icon: nextStatus === 'votacao' ? 'how_to_vote' : 'sports_score', 
         message: nextStatus === 'votacao' ? 'Golos guardados! Votações abertas.' : 'Partida encerrada com sucesso!' 
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

async function saveLiveStats() {
  if (!matchToClose.value) return
  saving.value = true
  
  try {
    const allPlayers = [...(matchPlayersStats.value.teamA || []), ...(matchPlayersStats.value.teamB || [])]
    
    // Grava as estatísticas de cada jogador sem mudar o estado do jogo
    for (const p of allPlayers) {
      const goalsVal = parseInt(p.goals) || 0
      const assistsVal = parseInt(p.assists) || 0
      await supabase
        .from('match_presences')
        .update({ goals: goalsVal, assists: assistsVal })
        .eq('id', p.id)
    }
    
    // Atualiza também o total de golos da partida
    const finalScoreA = matchPlayersStats.value.teamA.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)
    const finalScoreB = matchPlayersStats.value.teamB.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)
    
    await supabase.from('matches').update({ team_a_goals: finalScoreA, team_b_goals: finalScoreB }).eq('id', matchToClose.value.id)

    $q.notify({ type: 'positive', icon: 'sync', message: 'Estatísticas guardadas em tempo real!' })
  } catch (err) {
    console.error("Erro :", err)
    $q.notify({ type: 'negative', message: 'Erro ao guardar dados.' })
  } finally {
    saving.value = false
  }
}

// --- SISTEMA DE VOTAÇÃO (MVP & NOTAS) ---
const showVotingModal = ref(false)
const loadingVotes = ref(false)
const savingVotes = ref(false)
const votingMatch = ref(null)
const votingPlayers = ref([])
const selectedMVP = ref(null)

async function openVotingModal(match) {
  votingMatch.value = match
  showVotingModal.value = true
  loadingVotes.value = true
  selectedMVP.value = null
  
  // Vamos buscar os jogadores que estiveram presentes neste jogo
  const { data, error } = await supabase
    .from('match_presences')
    .select('id, profile_id, virtual_player_id, guest_name, profiles(name), virtual_players(name)')
    .eq('match_id', match.id)
    .eq('status', 'confirmed')
  
  if (data && !error) {
    // Carrega a lista com uma nota base de "6" para toda a gente
    votingPlayers.value = data.map(p => ({
      id: p.id, // ID da Presença (Vital para cruzar dados)
      profile_id: p.profile_id,
      virtual_player_id: p.virtual_player_id,
      name: p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Convidado',
      rating: 6 
    }))
  }
  loadingVotes.value = false
}

async function submitVotes() {
  if (!selectedMVP.value) {
    $q.notify({ type: 'warning', message: 'Tens de eleger o teu Homem do Jogo (MVP)!' })
    return
  }
  
  savingVotes.value = true
  
  try {
    const mvpPlayer = votingPlayers.value.find(p => p.id === selectedMVP.value)
    
    // 1. Gravar o MVP
    const { error: mvpError } = await supabase.from('match_votes').insert([{
      match_id: votingMatch.value.id,
      voter_id: authStore.user.id,
      mvp_profile_id: mvpPlayer.profile_id || null,
      mvp_virtual_id: mvpPlayer.virtual_player_id || null
    }])

    // Bloqueio de Segurança: Se der erro de duplicação, barra logo aqui.
    if (mvpError) {
      if (mvpError.code === '23505') {
        $q.notify({ type: 'warning', message: 'Já votaste neste jogo!' })
        showVotingModal.value = false
        return
      }
      throw mvpError
    }

    // 2. Gravar as Notas Individuais
    const ratingsPayload = votingPlayers.value
      .filter(p => p.profile_id || p.virtual_player_id)
      .map(p => ({
        match_id: votingMatch.value.id,
        voter_id: authStore.user.id,
        target_profile_id: p.profile_id || null,
        target_virtual_id: p.virtual_player_id || null,
        rating: p.rating
      }))
    
    const { error: ratingsError } = await supabase.from('match_player_ratings').insert(ratingsPayload)
    if (ratingsError) throw ratingsError

    // 3. Sucesso! Adicionar à lista local para o botão ficar bloqueado imediatamente
    votedMatches.value.push(votingMatch.value.id)
    $q.notify({ type: 'positive', icon: 'how_to_vote', message: 'Votos registados com sucesso!' })
    showVotingModal.value = false
    
  } catch (error) {
    console.error("Erro na votação:", error)
    $q.notify({ type: 'negative', message: 'Erro ao guardar: ' + error.message, timeout: 5000 })
  } finally {
    savingVotes.value = false
  }
}

async function closeVoting(match) {
  $q.dialog({
    title: 'Apurar Resultados',
    message: 'Esta ação encerra as urnas, calcula as médias, entrega o prémio de MVP e finaliza o jogo permanentemente. Confirmar?',
    cancel: { flat: true, color: 'grey' },
    persistent: true,
    ok: { label: 'Encerrar Votação', color: 'negative', unelevated: true }
  }).onOk(async () => {
    saving.value = true
    
    // 1. Ir buscar os Votos e as Notas dadas a este jogo
    const { data: mvpVotes } = await supabase.from('match_votes').select('*').eq('match_id', match.id)
    const { data: ratings } = await supabase.from('match_player_ratings').select('*').eq('match_id', match.id)
    const { data: presences } = await supabase.from('match_presences').select('id, profile_id, virtual_player_id').eq('match_id', match.id)
    
    // 2. Agrupar os votos para descobrir quem é o MVP!
    let mvpCounts = {}
    if (mvpVotes) {
      mvpVotes.forEach(v => {
        const target = v.mvp_profile_id ? `p_${v.mvp_profile_id}` : (v.mvp_virtual_id ? `v_${v.mvp_virtual_id}` : null)
        if (target) mvpCounts[target] = (mvpCounts[target] || 0) + 1
      })
    }
    
    let topMvpTarget = null
    let maxVotes = 0
    for (const [key, val] of Object.entries(mvpCounts)) {
      if (val > maxVotes) { maxVotes = val; topMvpTarget = key; }
    }

    // 3. Fazer a média das notas de cada jogador
    let ratingSums = {}
    let ratingCounts = {}
    if (ratings) {
      ratings.forEach(r => {
        const target = r.target_profile_id ? `p_${r.target_profile_id}` : (r.target_virtual_id ? `v_${r.target_virtual_id}` : null)
        if (target) {
          ratingSums[target] = (ratingSums[target] || 0) + r.rating
          ratingCounts[target] = (ratingCounts[target] || 0) + 1
        }
      })
    }

    // 4. Gravar os resultados finais diretamente na tabela das Presenças!
    for (const p of presences) {
      const targetKey = p.profile_id ? `p_${p.profile_id}` : (p.virtual_player_id ? `v_${p.virtual_player_id}` : null)
      const is_mvp = targetKey === topMvpTarget && topMvpTarget !== null
      const avg = ratingCounts[targetKey] ? (ratingSums[targetKey] / ratingCounts[targetKey]).toFixed(2) : 0
      
      await supabase.from('match_presences').update({ is_mvp: is_mvp, rating_average: avg }).eq('id', p.id)
    }

    // 5. Trancar o Jogo
    await supabase.from('matches').update({ status: 'fechado' }).eq('id', match.id)
    
    $q.notify({ type: 'positive', icon: 'workspace_premium', message: 'Urnas fechadas! MVP apurado com sucesso.' })
    await fetchMatches()
    
    // NOVO: Volta para a aba "Próximo" automaticamente para não bugar o ecrã
    matchViewMode.value = 'next'
    
    saving.value = false
  })
}

// --- SISTEMA DE VER RESULTADOS (PÓS-JOGO) ---
const showResultsModal = ref(false)
const loadingResults = ref(false)
const matchResultsData = ref([])

async function openResultsModal(match) {
  showResultsModal.value = true
  loadingResults.value = true
  matchResultsData.value = []

  // Vai buscar os jogadores confirmados e os seus dados (golos, notas, mvp)
  const { data, error } = await supabase
    .from('match_presences')
    .select('id, goals, assists, rating_average, is_mvp, team, profiles(name), virtual_players(name), guest_name')
    .eq('match_id', match.id)
    .eq('status', 'confirmed')

  if (data && !error) {
    matchResultsData.value = data.map(p => ({
      id: p.id,
      name: p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Desconhecido',
      team: p.team,
      goals: p.goals || 0,
      assists: p.assists || 0,
      rating: Number(p.rating_average) || 0, // Garante que é número
      isMvp: p.is_mvp
    }))
    
    // Ordena do melhor para o pior (Primeiro o MVP, depois pela Nota, depois por Golos)
    matchResultsData.value.sort((a, b) => {
      if (a.isMvp && !b.isMvp) return -1;
      if (!a.isMvp && b.isMvp) return 1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.goals - a.goals;
    })
  }
  
  loadingResults.value = false
}
  
async function autoBalanceTeams() {
  balancing.value = true

  try {
    const { data: presences, error } = await supabase
      .from('match_presences')
      .select('id, profile_id, virtual_player_id, profiles(overall, position), virtual_players(overall, position)')
      .eq('match_id', selectedMatch.value.id)
      .eq('status', 'confirmed')

    if (error) throw error

    // 1. Mapear jogadores e posições
    let players = presences.map(p => {
      const ovr = p.profiles?.overall || p.virtual_players?.overall || 70
      const pos = p.profiles?.position || p.virtual_players?.position || 'Sem Posição'
      return { ...p, ovr: Number(ovr), position: pos }
    })

    // 2. Separar por setores (Os "Potes" do sorteio)
    const sectors = {}
    players.forEach(p => {
      if (!sectors[p.position]) sectors[p.position] = []
      sectors[p.position].push(p)
    })

    let teamA = []
    let teamB = []
    let sumA = 0
    let sumB = 0
    let leftovers = [] // O "saco" onde guardamos os ímpares que sobram

    // 3. FASE 1: Distribuir por setores (Random mas equilibrado aos pares)
    for (const pos in sectors) {
      // Ordena os jogadores deste setor do melhor para o pior
      let sectorPlayers = sectors[pos].sort((a, b) => b.ovr - a.ovr)

      // Enquanto houver pelo menos 2 jogadores, agarra num par
      while (sectorPlayers.length >= 2) {
        const p1 = sectorPlayers.shift() // O melhor do par
        const p2 = sectorPlayers.shift() // O segundo melhor

        // Sorteio: Moeda ao ar (50% probabilidade)
        if (Math.random() > 0.5) {
          teamA.push(p1); sumA += p1.ovr;
          teamB.push(p2); sumB += p2.ovr;
        } else {
          teamA.push(p2); sumA += p2.ovr;
          teamB.push(p1); sumB += p1.ovr;
        }
      }

      // Se sobrou 1 jogador neste setor (número ímpar), vai para os restos
      if (sectorPlayers.length === 1) {
        leftovers.push(sectorPlayers[0])
      }
    }

    // 4. FASE 2: Distribuir os que restaram com limite estrito de tamanho
    leftovers.sort((a, b) => b.ovr - a.ovr)

    // Descobre o limite de jogadores por equipa (ex: se forem 13 no total, o limite é 7)
    const totalPlayers = teamA.length + teamB.length + leftovers.length
    const maxTeamSize = Math.ceil(totalPlayers / 2) 

    for (const player of leftovers) {
      // Se a Equipa A já atingiu metade do plantel, este vai obrigatoriamente para a B
      if (teamA.length >= maxTeamSize) {
        teamB.push(player)
        sumB += player.ovr
      } 
      // Se a Equipa B já atingiu metade do plantel, este vai obrigatoriamente para a A
      else if (teamB.length >= maxTeamSize) {
        teamA.push(player)
        sumA += player.ovr
      } 
      // Se ambas ainda têm vagas, o jogador vai para a equipa com MENOS PONTOS (Overall)!
      else {
        if (sumA <= sumB) {
          teamA.push(player)
          sumA += player.ovr
        } else {
          teamB.push(player)
          sumB += player.ovr
        }
      }
    }

    // 5. Gravar as equipas finais
    for (const p of teamA) {
      await supabase.from('match_presences').update({ team: 'A' }).eq('id', p.id)
    }
    for (const p of teamB) {
      await supabase.from('match_presences').update({ team: 'B' }).eq('id', p.id)
    }

    $q.notify({ type: 'positive', icon: 'shuffle', message: 'Sorteio das equipas concluído!' })
    
    // Atualiza a lista visualmente
    await openPresencesModal(selectedMatch.value)

  } catch (err) {
    console.error("Erro no algoritmo:", err)
    $q.notify({ type: 'negative', message: 'Erro ao gerar equipas.' })
  } finally {
    balancing.value = false
  }
}
  
const selectedSquadPlayers = ref([])
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
  const { data: reals } = await supabase.from('club_members').select('profile_id, profiles(name, position, overall)').eq('club_id', props.id)
  if (reals) {
    reals.forEach(r => {
      if (r.profiles && !currentInscribedProfileIds.includes(r.profile_id)) {
        options.push({ 
          label: r.profiles.name, // Nome limpo para a pesquisa
          value: r.profile_id, 
          type: 'real',
          position: r.profiles.position || 'MED',
          overall: r.profiles.overall || 70
        })
      }
    })
  }

  // Carrega membros virtuais
  const { data: virtuals } = await supabase.from('virtual_players').select('id, name, position, overall').eq('club_id', props.id)
  if (virtuals) {
    virtuals.forEach(v => {
      if (!currentInscribedVirtualIds.includes(v.id)) {
        options.push({ 
          label: v.name, 
          value: v.id, 
          type: 'virtual',
          position: v.position || 'MED',
          overall: v.overall || 70
        })
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
  // Se a lista estiver vazia, não faz nada
  if (!selectedSquadPlayers.value || selectedSquadPlayers.value.length === 0 || !selectedMatch.value) return

  const currentlyConfirmed = presences.value.filter(p => p.status === 'confirmed').length
  const tryingToAdd = selectedSquadPlayers.value.length

  // BLOQUEIO DE SEGURANÇA: Conta se a fornada que estás a tentar inserir excede as vagas
  if (currentlyConfirmed + tryingToAdd > selectedMatch.value.max_players) {
    $q.notify({ type: 'negative', message: `Calma Mister! O jogo só tem ${selectedMatch.value.max_players - currentlyConfirmed} vagas disponíveis.` })
    return
  }

  // Prepara o "pacote" com todos os jogadores selecionados
  const payloads = selectedSquadPlayers.value.map(p => {
    const payload = { match_id: selectedMatch.value.id, status: 'confirmed' }
    if (p.type === 'real') payload.profile_id = p.value
    else payload.virtual_player_id = p.value
    return payload
  })

  // O Supabase consegue receber a lista inteira e gravar tudo numa única viagem
  const { error } = await supabase.from('match_presences').insert(payloads)

  if (!error) {
    $q.notify({ type: 'positive', message: `${tryingToAdd} jogador(es) convocado(s) com sucesso!` })
    selectedSquadPlayers.value = [] // Limpa a caixa de seleção para a próxima
    await openPresencesModal(selectedMatch.value)
  } else {
    $q.notify({ type: 'negative', message: 'Erro ao adicionar: ' + error.message })
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

// --- SISTEMA DE EQUIPA TÉCNICA (ADMINS) ---
const showStaffModal = ref(false)
const staffList = ref([])
const loadingStaff = ref(false)

// Variáveis para a barra de pesquisa
const selectedNewAdmin = ref(null)
const allEligibleMembers = ref([])
const eligibleMembersOptions = ref([])

async function openStaffManager() {
  showStaffModal.value = true
  loadingStaff.value = true

  const { data, error } = await supabase
    .from('club_members')
    .select('profile_id, role, is_owner, can_manage_matches, can_manage_teams, can_manage_finances, profiles(name)')
    .eq('club_id', props.id)
    .eq('status', 'approved')
    .order('is_owner', { ascending: false })

  if (error) {
    $q.notify({ type: 'negative', message: 'Erro: ' + error.message, timeout: 5000 })
  } else if (data) {
    // 1. Filtrar APENAS quem já é Admin ou Dono para a lista de Permissões
    staffList.value = data.filter(m => m.role === 'admin' || m.is_owner)
    
    // 2. Criar a lista de jogadores normais para a barra de pesquisa
    const eligible = data.filter(m => m.role !== 'admin' && !m.is_owner)
    allEligibleMembers.value = eligible.map(m => ({
      label: m.profiles?.name || 'Sem Nome',
      value: m.profile_id
    }))
    eligibleMembersOptions.value = allEligibleMembers.value
  }
  loadingStaff.value = false
}

// Filtro da barra de pesquisa
function filterEligibleMembers(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    eligibleMembersOptions.value = allEligibleMembers.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

// PROMOVER JOGADOR A ADMIN
async function addAdmin() {
  if (!selectedNewAdmin.value) return
  
  const profileId = selectedNewAdmin.value.value

  const { error } = await supabase
    .from('club_members')
    .update({ role: 'admin' }) 
    .eq('club_id', props.id)
    .eq('profile_id', profileId)

  if (!error) {
    $q.notify({ type: 'positive', message: 'Membro promovido a Administrador!' })
    selectedNewAdmin.value = null
    await openStaffManager() // Atualiza as duas listas automaticamente
  } else {
    $q.notify({ type: 'negative', message: 'Erro ao promover: ' + error.message })
  }
}

// DESPROMOVER ADMIN A JOGADOR NORMAL
async function removeAdmin(profileId) {
  $q.dialog({
    title: 'Despromover Membro',
    message: 'Tens a certeza? Este membro vai perder acesso ao painel de gestão do clube.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    // Retira o cargo de admin e desativa todos os toggles de permissão por segurança
    const { error } = await supabase
      .from('club_members')
      .update({ 
        role: 'member',
        can_manage_matches: false,
        can_manage_teams: false,
        can_manage_finances: false
      })
      .eq('club_id', props.id)
      .eq('profile_id', profileId)

    if (!error) {
      $q.notify({ type: 'info', message: 'Membro removido da Equipa Técnica.' })
      await openStaffManager() // Atualiza as listas
    }
  })
}

// ATUALIZAR PERMISSÕES GRANULARES (Mantém a que já tinhas, apenas adicionei "position: top")
async function updatePermission(profileId, field, value) {
  const updateData = {}
  updateData[field] = value
  
  const { data, error } = await supabase
    .from('club_members')
    .update(updateData)
    .eq('club_id', props.id)
    .eq('profile_id', profileId)
    .select() 
    
  if (error) {
    $q.notify({ type: 'negative', message: 'ERRO: ' + error.message, timeout: 6000 })
    await openStaffManager()
  } else if (!data || data.length === 0) {
    $q.notify({ type: 'negative', message: 'ERRO RLS: Não tens permissões na BD para alterar isto.', timeout: 6000 })
    await openStaffManager()
  } else {
    $q.notify({ type: 'positive', message: 'Permissões atualizadas!' })
  }
}

const allClubPlayersOptions = ref([])
const showSettingsModal = ref(false)
const savingSettings = ref(false)
const clubSettings = ref({ 
  default_max_players: 14, default_price: 5, monthly_fee: 20, default_location: '', 
  recurring_day_of_week: 2, recurring_time: '21:00',
  attribute_mode: 'numeric', hide_attributes_from_members: false,
  enable_voting: true,
  default_team_a_name: 'Equipa A', default_team_b_name: 'Equipa B',
  default_squad: []
})

const newMatch = ref({ 
  id: null, date: '', location: '', max_players: 14, price_per_player: 5.00,
  team_a_name: 'Equipa A', team_b_name: 'Equipa B' // <- NOVO
})

async function openClubSettings() {
  showSettingsModal.value = true
  await loadAllClubPlayers() // Puxa a lista mal abres as definições
  
  const { data } = await supabase.from('clubs').select('*').eq('id', props.id).single()
  if (data) {
    data.default_team_a_name = data.default_team_a_name || 'Equipa A'
    data.default_team_b_name = data.default_team_b_name || 'Equipa B'
    data.default_squad = data.default_squad || [] // Garante que nunca é null
    clubSettings.value = { ...clubSettings.value, ...data }
  }
}

async function saveClubSettings() {
  savingSettings.value = true
  const { error } = await supabase.from('clubs').update({
    default_max_players: clubSettings.value.default_max_players,
    default_price: clubSettings.value.default_price,
    monthly_fee: clubSettings.value.monthly_fee,
    default_location: clubSettings.value.default_location,
    recurring_day_of_week: clubSettings.value.recurring_day_of_week,
    recurring_time: clubSettings.value.recurring_time,
    attribute_mode: clubSettings.value.attribute_mode,
    hide_attributes_from_members: clubSettings.value.hide_attributes_from_members,
    enable_voting: clubSettings.value.enable_voting, 
    default_team_a_name: clubSettings.value.default_team_a_name, 
    default_team_b_name: clubSettings.value.default_team_b_name,
    default_team_a_color: clubSettings.value.default_team_a_color,
    default_team_b_color: clubSettings.value.default_team_b_color,
    default_squad: clubSettings.value.default_squad
  }).eq('id', props.id)

  if (!error) {
    $q.notify({ type: 'positive', message: 'Definições do clube guardadas!' })
    showSettingsModal.value = false
    // Atualiza o estado da store para refletir os preços novos imediatamente
    if (clubStore.currentClub) {
      clubStore.currentClub.default_price = clubSettings.value.default_price
    }
  }
  savingSettings.value = false
}

// Puxa toda a gente (Reais e Virtuais) para o Dropdown das Definições
async function loadAllClubPlayers() {
  const options = []
  
  const { data: reals } = await supabase.from('club_members').select('profile_id, profiles(name, position)').eq('club_id', props.id)
  if (reals) {
    reals.forEach(r => {
      if (r.profiles) options.push({ label: r.profiles.name, value: r.profile_id, type: 'real' })
    })
  }
  
  const { data: virtuals } = await supabase.from('virtual_players').select('id, name, position').eq('club_id', props.id)
  if (virtuals) {
    virtuals.forEach(v => {
      options.push({ label: v.name, value: v.id, type: 'virtual' })
    })
  }
  
  allClubPlayersOptions.value = options
}

// Monitoriza a lotação máxima e corta a lista de titulares se necessário
function enforceSquadLimit(newLimit) {
  // Bloqueio de Segurança: Lotação nunca pode ser inferior a 2
  if (newLimit < 2 || !newLimit) {
    clubSettings.value.default_max_players = 2
    newLimit = 2
  }

  if (!clubSettings.value.default_squad) return

  // Se a lista atual de titulares for maior que o novo limite, cortamos o excesso
  if (clubSettings.value.default_squad.length > newLimit) {
    clubSettings.value.default_squad = clubSettings.value.default_squad.slice(0, newLimit)
    
    $q.notify({ 
      type: 'warning', 
      icon: 'content_cut',
      message: `A lotação desceu para ${newLimit}. Os excedentes da lista de Titulares foram removidos.`
    })
  }
}

async function generateMonthlyMatchesBulk() {
  saving.value = true
  
  const { data: club } = await supabase.from('clubs').select('*').eq('id', props.id).single()
  
  if (!club || !club.recurring_day_of_week) {
    $q.notify({ type: 'warning', message: 'Configura primeiro o dia e hora fixos nas Definições do clube.' })
    saving.value = false
    return
  }
  
  const batchInserts = []
  const conflictingDates = []
  const today = new Date()
  let checkDate = new Date(today.getTime())
  let targetMonth = null
  
  for (let i = 0; i < 35; i++) {
    checkDate.setDate(checkDate.getDate() + 1)
    
    let jsDay = checkDate.getDay()
    let normalizedDay = jsDay === 0 ? 7 : jsDay
    
    if (normalizedDay === club.recurring_day_of_week) {
      if (targetMonth === null) targetMonth = checkDate.getMonth()
      if (checkDate.getMonth() !== targetMonth) break
      
      const dateString = checkDate.toISOString().split('T')[0]
      const finalDateTime = `${dateString}T${club.recurring_time || '21:00:00'}`
      
      // A SOLUÇÃO: Converter a data gerada em texto para UTC verdadeiro
      const dateToSave = new Date(finalDateTime).toISOString()
      const targetDateStr = new Date(finalDateTime).toLocaleDateString('pt-PT')
      
      // Verifica se a data gerada já tem algum jogo na BD (usando formatação PT para comparar bem)
      const conflict = matches.value.some(m => new Date(m.date).toLocaleDateString('pt-PT') === targetDateStr)
      if (conflict) {
        conflictingDates.push(targetDateStr)
      }
      
      batchInserts.push({
        club_id: props.id,
        date: dateToSave,
        location: club.default_location || 'Campo Padrão',
        max_players: club.default_max_players || 14,
        price_per_player: club.default_price || 5.00,
        team_a_name: newMatch.value.team_a_name, 
        team_b_name: newMatch.value.team_b_name,
        status: 'aberto'
      })
    }
  }
  
  if (batchInserts.length === 0) {
    $q.notify({ type: 'info', message: 'Não há mais dias correspondentes neste mês.' })
    saving.value = false
    return
  }
  
  if (conflictingDates.length > 0) {
    $q.dialog({
      title: 'Aviso de Sobreposição',
      message: `Já tens jogos marcados nos dias: ${conflictingDates.join(', ')}. Queres gerar estes jogos na mesma e criar duplicados no calendário?`,
      cancel: { label: 'Cancelar', flat: true, color: 'grey' },
      ok: { label: 'Gerar na mesma', color: 'amber-9', unelevated: true },
      persistent: true
    }).onOk(async () => {
      await executeBulkInsert(batchInserts)
    }).onCancel(() => {
      saving.value = false
    })
  } else {
    await executeBulkInsert(batchInserts)
  }
}

async function executeBulkInsert(batchInserts) {
  // O select() devolve-nos a lista de todos os jogos do mês acabados de criar
  const { data: insertedMatches, error } = await supabase.from('matches').insert(batchInserts).select()

  if (!error) {
    // Inscreve os titulares em TODOS os jogos do mês
    if (clubSettings.value.default_squad?.length > 0) {
      const allPresences = []
      for (const m of insertedMatches) {
        clubSettings.value.default_squad.forEach(p => {
          allPresences.push({
            match_id: m.id,
            status: 'confirmed',
            profile_id: p.type === 'real' ? p.value : null,
            virtual_player_id: p.type === 'virtual' ? p.value : null
          })
        })
      }
      if (allPresences.length > 0) await supabase.from('match_presences').insert(allPresences)
    }

    $q.notify({ type: 'positive', icon: 'auto_mode', message: `Geradas ${batchInserts.length} peladas com Titulares confirmados!` })
    await fetchMatches()
    showCreateModal.value = false
  } else {
    $q.notify({ type: 'negative', message: 'Erro ao gerar lote: ' + error.message })
  }
  saving.value = false
}

const applyToFuture = ref(false) // Controla a propagação de edição

// Calcula o próximo dia e hora do jogo com base nas definições do clube
function getNextRecurringDate(dayOfWeek, timeStr) {
  if (!dayOfWeek || !timeStr) return ''
  
  const today = new Date()
  const currentDay = today.getDay() === 0 ? 7 : today.getDay()
  let daysUntilNext = dayOfWeek - currentDay
  
  if (daysUntilNext < 0) daysUntilNext += 7
  
  // timeStr vem da base de dados (ex: "21:00:00" ou "21:00")
  const parts = timeStr.split(':')
  const hours = parseInt(parts[0]) || 21
  const minutes = parseInt(parts[1]) || 0
  
  if (daysUntilNext === 0) {
    const matchTime = new Date(today)
    matchTime.setHours(hours, minutes, 0, 0)
    // Se hoje é o dia do jogo mas a hora já passou, atira para a próxima semana
    if (today > matchTime) daysUntilNext += 7
  }

  const nextDate = new Date(today)
  nextDate.setDate(today.getDate() + daysUntilNext)
  nextDate.setHours(hours, minutes, 0, 0)
  
  // Truque para anular o Fuso Horário e forçar o formato YYYY-MM-DDTHH:mm
  const localIso = new Date(nextDate.getTime() - (nextDate.getTimezoneOffset() * 60000))
    .toISOString()
    .slice(0, 16)
    
  return localIso
}
  
async function refreshPage(done) {
  await fetchMatches()
  await fetchPendingRequests()
  done()
}
</script>
  
<style scoped>
/* Fundo Global da Página (Verde Menta Suave) */
.page-light-premium {
  background-color: #f0fdf4; 
  min-height: 100vh;
}

/* Cabeçalho do Clube (Verde Premium Degradé) */
.club-header-block {
  background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(10, 46, 12, 0.2);
}

/* Placar de Jogo Fechado (Usa o mesmo Verde Premium) */
.scoreboard-box {
  background: linear-gradient(135deg, #2E7D32 0%, #0A2E0C 100%);
  border-radius: 12px;
  color: white;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
}

/* Cartão de Jogo (Com sombra e borda reforçadas para descolar do fundo menta) */
.match-card-light {
  background-color: #ffffff;
  border-radius: 16px;
  /* 1. Borda neutra e um pouco mais densa para recortar o cartão */
  border: 1px solid rgba(0, 0, 0, 0.3); 
  /* 2. Sombra reforçada (passou de 0.03 para 0.08) para dar altura */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.match-card-light:hover {
  transform: translateY(-4px);
  /* Sombra de hover mais agressiva para o efeito "pop-up" */
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12); 
}

/* Caixa interior de Informação */
.inner-info-box {
  background-color: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.01);
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Cartão Premium com sombra difusa */
.match-premium-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.03);
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08) !important;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease;
  overflow: hidden;
}

.match-premium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px -10px rgba(0,0,0,0.12) !important;
}

/* Placar de Jogo Estilo Transmissão (Verde Estádio) */
.scoreboard-tv {
  background: linear-gradient(135deg, var(--q-primary) 0%, #0d3b13 100%);
  border-radius: 16px;
  color: white;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
}

.team-avatar-shadow {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

/* Identificadores laterais baseados no estado do jogo (Reduzidos para um toque mais subtil) */
.match-open {
  border-left: 3px solid var(--q-primary); 
}

.match-closed {
  border-left: 3px solid #e0e0e0; 
  opacity: 0.90;
}

/* Tipografia e Utilitários */
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}

.match-card-clean {
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.02); /* Borda quase invisível apenas para recortar o limite */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); /* Sombra difusa e profunda para contrastar com o fundo */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Animação muito mais suave */
}
.border-bottom-light {
  border-bottom: 1px solid #f1f5f9;
}

.match-card-vibrant {
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden; /* Essencial para o cabeçalho escuro respeitar os cantos redondos */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.match-card-vibrant:hover {
  transform: translateY(-4px);
  /* A sombra ganha um ligeiro tom esverdeado ao passar o rato */
  box-shadow: 0 12px 30px rgba(46, 125, 50, 0.15); 
}

/* O Segredo: O Cabeçalho Escuro e Luminoso */
.match-header-bg {
  /* Fundo base escuro (quase preto) com um gradiente verde muito profundo */
  background: linear-gradient(135deg, #111928 0%, #1a3a24 100%);
  position: relative;
  border-bottom: 3px solid var(--q-primary); /* Uma linha de energia verde a separar */
}

/* Efeito "Holofote de Estádio" no canto direito do cabeçalho */
.match-header-bg::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at top right, rgba(76, 175, 80, 0.3) 0%, transparent 60%);
  pointer-events: none;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.animate-pop {
  transition: transform 0.2s ease-in-out;
}

.animate-pop:hover {
  transform: scale(1.08);
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

.border-left-primary { border-left: 3px solid var(--q-primary); }
.border-left-dark { border-left: 3px solid var(--q-dark); }

.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.06);
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

.border-left-blue { border-left: 3px solid #2196f3; } 
.border-left-orange { border-left: 3px solid #ff9800; }

/* Remove paddings internos do q-select para caber em mobile */
.compact-select :deep(.q-field__control) {
  padding-left: 0 !important;
  padding-right: 8px !important;
  min-height: 36px !important;
  height: 36px !important;
}

.compact-select :deep(.q-field__append) {
  padding-left: 0 !important;
}
</style>