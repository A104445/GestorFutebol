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
      <div class="row q-col-gutter-lg">
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
                  :color="match.status === 'fechado' ? 'grey-3' : 'amber-8'" 
                  :text-color="match.status === 'fechado' ? 'grey-8' : 'dark'" 
                  class="text-weight-bolder shadow-1"
                  style="border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);"
                >
                  <!-- <q-icon v-if="match.status === 'fechado'" name="sports_score" size="14px" class="q-mr-xs" /> -->
                  {{ match.status === 'fechado' ? 'TERMINADO' : 'ABERTO' }}
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
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">Vagas</div>
                  <div class="text-body2 text-weight-bold text-dark">{{ match.max_players }}</div>
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
                
                <!-- Botão VOU JOGAR (Laranja Suave / Âmbar) -->
                <q-btn
                  v-if="!match.status || match.status === 'aberto'"
                  color="amber-8" text-color="dark" unelevated label="Vou Jogar" class="text-weight-bolder q-px-md shadow-2" style="border-radius: 8px;"
                  @click="joinMatch(match)"
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
              </div>
            </q-card-actions>
          </q-card>
        </div>
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
        <q-card-section class="row items-center q-py-md border-bottom">
          <div class="text-h6 text-weight-bold text-dark row items-center">
            <q-icon name="event_available" class="q-mr-sm text-dark" />
            Nova Convocatória
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-6" v-close-popup />
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
            <div class="row justify-between q-mt-lg items-center">
              
              <!-- Mostrar o "Gerar Mês" APENAS se for um jogo NOVO (sem ID) -->
              <q-btn 
                v-if="!newMatch.id"
                label="Gerar Mês Inteiro" 
                icon="auto_mode" 
                color="dark" 
                unelevated 
                outline 
                class="q-px-sm text-weight-bold" 
                style="border-radius: 8px;" 
                @click="generateMonthlyMatchesBulk" 
                :loading="saving" 
              >
                <q-tooltip>Cria jogos até ao fim do mês</q-tooltip>
              </q-btn>
              
              <!-- Espaçador para empurrar os botões para a direita se estiver a editar -->
              <q-space v-else />

              <!-- Lado Direito: Cancelar e Guardar/Publicar -->
              <div class="row q-gutter-sm">
                <q-btn label="Cancelar" flat color="grey-6" v-close-popup style="border-radius: 8px;" />
                
                <!-- O texto muda consoante estamos a editar ou a criar -->
                <q-btn 
                  :label="newMatch.id ? 'Guardar Alterações' : 'Publicar (Só 1)'" 
                  type="submit" 
                  color="primary" 
                  unelevated 
                  class="q-px-md" 
                  style="border-radius: 8px;" 
                  :loading="saving" 
                />
              </div>
              
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
                <div v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.can_manage_finances)" class="row items-center">
                  <template v-if="clubStore.currentClub?.can_manage_teams">
                    <q-btn flat round dense icon="looks_one" size="sm" :color="presence.team === 'A' ? (clubSettings?.default_team_a_color || 'blue') : 'grey-4'" @click="assignTeam(presence, 'A')" />
                    <q-btn flat round dense icon="looks_two" size="sm" :color="presence.team === 'B' ? (clubSettings?.default_team_b_color || 'orange') : 'grey-4'" @click="assignTeam(presence, 'B')" />
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
            <div v-for="player in matchPlayersStats.teamA" :key="player.id" class="row items-center q-mb-sm bg-white q-pa-sm shadow-1" :style="`border-radius: 8px; border: 1px solid #f1f5f9; border-left: 4px solid var(--q-${clubSettings?.default_team_a_color || 'blue'});`">
              <div class="col-6 text-body2 text-ellipsis text-weight-bold text-dark">{{ player.name }}</div>
              <div class="col-3 q-px-xs">
                <q-input dense outlined bg-color="grey-1" v-model.number="player.goals" type="number" label="Golos ⚽" min="0" input-class="text-center text-weight-bold text-dark" />
              </div>
              <div class="col-3 q-px-xs">
                <q-input dense outlined bg-color="grey-1" v-model.number="player.assists" type="number" label="Assis. 👟" min="0" input-class="text-center text-weight-bold text-dark" />
              </div>
            </div>

            <!-- LISTA DA EQUIPA B -->
            <div :class="`text-${matchSettingsColor(matchToClose, 'B')} text-weight-bold q-mt-lg q-mb-sm q-ml-sm row items-center text-uppercase`">
              <q-icon name="shield" class="q-mr-xs"/> {{ matchToClose?.team_b_name || clubSettings?.default_team_b_name || 'Equipa B' }}
            </div>
            <div v-for="player in matchPlayersStats.teamB" :key="player.id" class="row items-center q-mb-sm bg-white q-pa-sm shadow-1" :style="`border-radius: 8px; border: 1px solid #f1f5f9; border-left: 4px solid var(--q-${clubSettings?.default_team_b_color || 'orange'});`">
              <div class="col-6 text-body2 text-ellipsis text-weight-bold text-dark">{{ player.name }}</div>
              <div class="col-3 q-px-xs">
                <q-input dense outlined bg-color="grey-1" v-model.number="player.goals" type="number" label="Golos ⚽" min="0" input-class="text-center text-weight-bold text-dark" />
              </div>
              <div class="col-3 q-px-xs">
                <q-input dense outlined bg-color="grey-1" v-model.number="player.assists" type="number" label="Assis. 👟" min="0" input-class="text-center text-weight-bold text-dark" />
              </div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-actions align="center" class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
          <q-btn label="Trancar Resultado e Estatísticas" color="amber-8" text-color="dark" class="full-width text-weight-bolder shadow-1" style="border-radius: 8px;" unelevated size="lg" :loading="saving" @click="closeMatch" />
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

    <q-dialog v-model="showSettingsModal">
      <q-card class="column" style="min-width: 360px; max-height: 85vh;border-radius: 16px;">
        <q-card-section class="row items-center border-bottom q-gutter-md q-pt-md col">
          <div class="text-subtitle1 text-weight-bold text-dark row items-center">
            <q-icon name="settings" class="q-mr-sm text-dark" />
            Definições do Clube
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-6" v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-input outlined dense type="number" step="0.5" v-model.number="clubSettings.default_price" label="Preço Padrão por Jogo (€)" />
          <q-input outlined dense type="number" step="1" v-model.number="clubSettings.monthly_fee" label="Mensalidade Padrão (€)" />
          <q-input outlined dense v-model="clubSettings.default_location" label="Campo / Local Fixo" icon="place" />
          <q-input outlined dense type="number" v-model.number="clubSettings.default_max_players" label="Nº Lotação Máxima" />

          <!-- BLOCO DE EQUIPAS -->
          <div class="row no-wrap" style="gap: 16px;">
            <q-input class="col" outlined dense v-model="clubSettings.default_team_a_name" label="Nome Equipa A" placeholder="Ex: Coletes" />
            <q-input class="col" outlined dense v-model="clubSettings.default_team_b_name" label="Nome Equipa B" placeholder="Ex: Sem Coletes" />
          </div>

          <!-- BLOCO DE CORES -->
          <div class="row no-wrap q-mt-md q-mb-sm" style="gap: 16px;">
            
            <q-select 
              class="col" outlined dense emit-value map-options
              v-model="clubSettings.default_team_a_color" 
              :options="[
                {label: 'Bordeaux', value: 'red-10'},
                {label: 'Vermelho', value: 'red-8'},
                {label: 'Laranja', value: 'orange-8'},
                {label: 'Amarelo', value: 'yellow-7'},
                {label: 'Verde', value: 'positive'},
                {label: 'Verde Tropa', value: 'green-10'},
                {label: 'Ciano', value: 'cyan-7'},
                {label: 'Azul', value: 'blue'},
                {label: 'Azul Marinho', value: 'blue-10'},
                {label: 'Roxo', value: 'purple'},
                {label: 'Rosa', value: 'pink-6'},
                {label: 'Castanho', value: 'brown-6'},
                {label: 'Cinzento', value: 'grey-7'},
                {label: 'Preto', value: 'dark'}
              ]" 
              label="Cor Equipa A" 
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar><q-avatar :color="scope.opt.value" size="sm" /></q-item-section>
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                </q-item>
              </template>
            </q-select>
            
            <q-select 
              class="col" outlined dense emit-value map-options
              v-model="clubSettings.default_team_b_color" 
              :options="[
                {label: 'Bordeaux', value: 'red-10'},
                {label: 'Vermelho', value: 'negative'},
                {label: 'Laranja', value: 'orange'},
                {label: 'Amarelo', value: 'yellow-8'},
                {label: 'Verde', value: 'positive'},
                {label: 'Verde Tropa', value: 'green-10'},
                {label: 'Ciano', value: 'cyan-7'},
                {label: 'Azul', value: 'blue'},
                {label: 'Azul Marinho', value: 'blue-10'},
                {label: 'Roxo', value: 'purple'},
                {label: 'Rosa', value: 'pink-6'},
                {label: 'Castanho', value: 'brown-6'},
                {label: 'Cinzento', value: 'grey-7'},
                {label: 'Preto', value: 'dark'}
              ]" 
              label="Cor Equipa B" 
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar><q-avatar :color="scope.opt.value" size="sm" /></q-item-section>
                  <q-item-section>{{ scope.opt.label }}</q-item-section>
                </q-item>
              </template>
            </q-select>
            
          </div>

          <!-- BLOCO DE AGENDAMENTO RECORRENTE (Com Proporção 7 / 5) -->
          <div class="row no-wrap" style="gap: 16px;">
            <q-select 
              style="flex: 7;"
              outlined 
              dense 
              emit-value 
              map-options 
              v-model="clubSettings.recurring_day_of_week"
              :options="[{label:'Segunda',value:1},{label:'Terça',value:2},{label:'Quarta',value:3},{label:'Quinta',value:4},{label:'Sexta',value:5},{label:'Sábado',value:6},{label:'Domingo',value:7}]"
              label="Dia de Jogo Fixo" 
            />
            <q-input 
              style="flex: 5;"
              outlined 
              dense 
              type="time" 
              v-model="clubSettings.recurring_time" 
              label="Hora Fixa" 
            />
          </div>

          <!-- MODO DE ATRIBUTOS -->
          <q-select 
            outlined dense emit-value map-options
            v-model="clubSettings.attribute_mode" 
            :options="[{label: 'Valores Numéricos (1-99)', value: 'numeric'}, {label: 'Categorias de Palavras', value: 'categorical'}]" 
            label="Modo de Visualização dos Atributos" 
            class="q-mb-sm"
          />

          <!-- NOVO: OCULTAR ATRIBUTOS -->
          <q-toggle 
            v-model="clubSettings.hide_attributes_from_members" 
            color="negative" 
            label="Ocultar Ratings e OVR aos membros normais" 
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1 col-auto">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar Configurações" @click="saveClubSettings" :loading="savingSettings" unelevated />
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
const showCreateModal = ref(false)
let realtimeChannel 

const matchViewMode = ref('next')
const selectedMonth = ref(null)

// 1. Conta quantos jogos passados ainda estão abertos
const pendingMatchesCount = computed(() => {
  const now = new Date()
  return matches.value.filter(m => m.status !== 'fechado' && new Date(m.date) < now).length
})

// 2. Gera os botões do filtro dinamicamente (Mostra "Pendentes" se for Admin)
const filterButtons = computed(() => {
  const opts = [
    { label: 'Próximo', value: 'next' },
    { label: 'Mês', value: 'month' },
    { label: 'Todos', value: 'all' },
    { label: 'Finalizados', value: 'closed' }
  ]
  
  const isManager = clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner
  if (isManager && pendingMatchesCount.value > 0) {
    // Insere o botão vermelho de Pendentes logo a seguir ao "Próximo"
    opts.splice(1, 0, { label: `Pendentes (${pendingMatchesCount.value})`, value: 'pending' })
  }
  
  return opts
})

// Descobre qual é o nome (label) do filtro que está selecionado agora
const currentFilterLabel = computed(() => {
  const current = filterButtons.value.find(f => f.value === matchViewMode.value)
  return current ? current.label : 'Filtro'
})

function matchSettingsColor(match, teamType) {
  if (teamType === 'A') {
    return clubSettings.value?.default_team_a_color || 'blue'
  } else {
    return clubSettings.value?.default_team_b_color || 'orange'
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

// 3. O filtro real com a nova regra do "Próximo" e dos "Pendentes"
const filteredMatches = computed(() => {
  if (matchViewMode.value === 'all') return matches.value
  
  const now = new Date()
  
  if (matchViewMode.value === 'next') {
    // Procura o primeiro jogo cuja data seja maior ou igual a AGORA
    const nextMatch = matches.value.find(m => new Date(m.date) >= now)
    return nextMatch ? [nextMatch] : []
  }
  
  if (matchViewMode.value === 'pending') {
    // Mostra jogos não fechados e que já passaram no tempo
    return matches.value.filter(m => m.status !== 'fechado' && new Date(m.date) < now)
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
      $q.notify({ type: 'negative', message: 'Erro ao reabrir jogo: ' + error.message, position: 'top' })
    } else {
      $q.notify({ type: 'positive', message: 'Jogo reaberto com sucesso!', position: 'top' })
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
  await fetchPendingRequests()

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
      team_a_name: newMatch.value.team_a_name, // <- NOVO
      team_b_name: newMatch.value.team_b_name, // <- NOVO
      club_id: clubStore.currentClub.id, 
      status: 'aberto' 
    }
    
    const { error } = await supabase.from('matches').insert([matchToInsert])
    if (!error) $q.notify({ type: 'positive', message: 'Pelada agendada com sucesso!' })
    else $q.notify({ type: 'negative', message: 'Erro ao criar: ' + error.message })
    
    showCreateModal.value = false
  }

  await fetchMatches()
  saving.value = false
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

async function fetchMatches() {
  if (!clubStore.currentClub) return
  loading.value = true
  
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('club_id', clubStore.currentClub.id)
    .order('date', { ascending: true })
    
  if (!error) {
    matches.value = data
    
    // AUTO-SELECT: Se ainda não houver um mês selecionado, escolhe o mais recente
    if (data.length > 0 && !selectedMonth.value) {
      const months = [...new Set(data.map(m => m.date.substring(0, 7)))]
      months.sort((a, b) => b.localeCompare(a))
      selectedMonth.value = months[0] // Ex: "2026-09"
    }
    
  }
  loading.value = false
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

  // 3. Contagem de vagas (Lógica existente)
  const { count } = await supabase
    .from('match_presences')
    .select('*', { count: 'exact', head: true }) 
    .eq('match_id', match.id)
    .eq('status', 'confirmed')

  const isFull = count >= match.max_players
  const insertStatus = isFull ? 'suplente' : 'confirmed'

  // 4. Efetuar a inscrição aplicando a nossa flag inteligente de pagamento
  const { error } = await supabase
    .from('match_presences')
    .insert([{ 
      match_id: match.id, 
      profile_id: authStore.user.id, 
      status: insertStatus,
      paid: shouldDefaultToPaid // <-- AUTOMATIZADO! true se for mensalista regularizado
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
    $q.notify({ type: 'positive', message: 'Membro promovido a Administrador!', position: 'top' })
    selectedNewAdmin.value = null
    await openStaffManager() // Atualiza as duas listas automaticamente
  } else {
    $q.notify({ type: 'negative', message: 'Erro ao promover: ' + error.message, position: 'top' })
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
      $q.notify({ type: 'info', message: 'Membro removido da Equipa Técnica.', position: 'top' })
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
    $q.notify({ type: 'negative', message: 'ERRO: ' + error.message, timeout: 6000, position: 'top' })
    await openStaffManager()
  } else if (!data || data.length === 0) {
    $q.notify({ type: 'negative', message: 'ERRO RLS: Não tens permissões na BD para alterar isto.', timeout: 6000, position: 'top' })
    await openStaffManager()
  } else {
    $q.notify({ type: 'positive', message: 'Permissões atualizadas!', position: 'top' })
  }
}

const showSettingsModal = ref(false)
const savingSettings = ref(false)
const clubSettings = ref({ 
  default_max_players: 14, default_price: 5, monthly_fee: 20, default_location: '', 
  recurring_day_of_week: 2, recurring_time: '21:00',
  attribute_mode: 'numeric', hide_attributes_from_members: false,
  default_team_a_name: 'Equipa A', default_team_b_name: 'Equipa B' // <- NOVO
})

const newMatch = ref({ 
  id: null, date: '', location: '', max_players: 14, price_per_player: 5.00,
  team_a_name: 'Equipa A', team_b_name: 'Equipa B' // <- NOVO
})

async function openClubSettings() {
  showSettingsModal.value = true
  const { data } = await supabase.from('clubs').select('*').eq('id', props.id).single()
  if (data) {
    // Força um nome padrão caso a base de dados devolva vazio (null)
    data.default_team_a_name = data.default_team_a_name || 'Equipa A'
    data.default_team_b_name = data.default_team_b_name || 'Equipa B'
    clubSettings.value = { ...data }
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
    default_team_a_name: clubSettings.value.default_team_a_name, 
    default_team_b_name: clubSettings.value.default_team_b_name,
    default_team_a_color: clubSettings.value.default_team_a_color,
    default_team_b_color: clubSettings.value.default_team_b_color  
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
  const { error } = await supabase.from('matches').insert(batchInserts)
  if (error) {
    $q.notify({ type: 'negative', message: 'Erro ao gerar lote: ' + error.message })
  } else {
    $q.notify({ type: 'positive', icon: 'auto_mode', message: `Geradas ${batchInserts.length} peladas no calendário!` })
    await fetchMatches()
    showCreateModal.value = false
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