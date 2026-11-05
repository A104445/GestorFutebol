<template>
  <q-page class="q-pa-md page-light-premium">
    <q-pull-to-refresh @refresh="refreshPage" color="primary" class="full-height">
      
      <!-- CABEÇALHO DO CLUBE (Bloco Escuro de Contraste) -->
      <div class="row items-center justify-between q-mb-lg q-pa-md club-header-block text-white no-wrap">
        
        <!-- Lado Esquerdo (Nome e Código com Ellipsis) -->
        <div class="row items-center q-gutter-x-sm col" style="min-width: 0;">
          <div class="bg-white flex flex-center shadow-2" style="width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;">
            <q-icon name="sports_soccer" size="24px" color="green-9" />
          </div>
          
          <div class="col" style="min-width: 0;">
            <h5 class="q-my-none text-weight-bolder text-white text-ellipsis" style="letter-spacing: -0.3px; font-size: 1.2rem;">
              {{ clubStore.currentClub?.name || '...' }}
            </h5>
            <div v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" class="text-caption text-grey-4 q-mt-xs text-weight-medium row items-center no-wrap">
              <span>{{ t('dashboard.header.code') }} <span class="text-green-4 text-weight-bolder q-mr-xs">{{ clubStore.currentClub?.invite_code || 'N/A' }}</span></span>
              
              <!-- Botão Copiar apenas o Código -->
              <q-btn flat round dense icon="content_copy" size="10px" color="white" class="q-ml-xs" @click="copyInviteCode">
                <q-tooltip>{{ t('dashboard.header.copyCodeTooltip') }}</q-tooltip>
              </q-btn>
              
              <!-- Botão Partilhar Link Automático -->
              <q-btn flat round dense icon="share" size="10px" color="white" class="q-ml-xs" @click="shareInviteLink">
                <q-tooltip>{{ t('dashboard.header.shareTooltip') }}</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Menu Discreto (Lado Direito fixo e impedido de quebrar) -->
        <div class="row q-gutter-xs items-center no-wrap" style="flex-shrink: 0;">
          <q-btn v-if="clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner" flat round dense icon="person_add" color="grey-3" @click="showRequestsModal = true">
            <q-badge v-if="pendingRequests.length > 0" color="primary" floating rounded>{{ pendingRequests.length }}</q-badge>
          </q-btn>
          <q-btn v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" flat round dense icon="manage_accounts" color="grey-3" @click="openStaffManager" />
          <q-btn v-if="clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner" flat round dense icon="settings" color="grey-3" @click="openClubSettings" />
          
          <q-separator vertical class="q-mx-xs bg-grey-6" style="opacity: 0.5;" />
          
          <q-btn flat round dense icon="more_vert" color="white">
            <q-menu auto-close style="border-radius: 12px;">
              <q-list style="min-width: 160px;">
                <q-item clickable @click="openProfileModal">
                  <q-item-section avatar><q-icon name="badge" size="sm" color="primary" /></q-item-section>
                  <q-item-section class="text-weight-bold">{{ t('dashboard.header.menuProfile') }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable to="/selector" @click="clearCurrentClub">
                  <q-item-section avatar><q-icon name="swap_horiz" size="sm" color="grey-8" /></q-item-section>
                  <q-item-section class="text-weight-medium">{{ t('dashboard.header.menuSwitchClub') }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="handleLogout">
                  <q-item-section avatar><q-icon name="logout" size="sm" color="negative" /></q-item-section>
                  <q-item-section class="text-negative text-weight-bold">{{ t('dashboard.header.menuLogout') }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable tag="a" href="mailto:picoteappssuport@gmail.com?subject=MatchDay%20-%20Pedido%20de%20Ajuda">
                  <q-item-section avatar><q-icon name="support_agent" size="sm" color="blue-8" /></q-item-section>
                  <q-item-section class="text-weight-bold">{{ t('dashboard.header.menuHelp') }}</q-item-section>
                </q-item>
                <q-item clickable tag="a" href="mailto:picoteappssuport@gmail.com?subject=MatchDay%20-%20Feedback">
                  <q-item-section avatar><q-icon name="feedback" size="sm" color="orange-8" /></q-item-section>
                  <q-item-section class="text-weight-bold">{{ t('dashboard.header.menuFeedback') }}</q-item-section>
                </q-item>
                <q-item clickable @click="showFaqModal = true">
                  <q-item-section avatar><q-icon name="help_outline" size="sm" color="green-8" /></q-item-section>
                  <q-item-section class="text-weight-bold">{{ t('dashboard.header.menuFaqs') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <!-- ESTADOS DE CARREGAMENTO / VAZIO -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-fluent color="green-9" size="50px" />
        <div class="text-caption text-grey-6 q-mt-md">{{ t('dashboard.header.loading') }}</div>
      </div>

      <div v-else-if="matches.length === 0" class="text-center q-pa-xl match-card-light" style="margin-top: 2rem;">
        <q-icon name="sports_soccer" size="5em" class="text-grey-4 q-mb-md" />
        <div class="text-h6 text-weight-bold text-dark">{{ t('dashboard.empty.noMatchesTitle') }}</div>
        <p class="text-body2 text-grey-6 q-px-md">{{ t('dashboard.empty.noMatchesDesc') }}</p>
        <q-btn v-if="clubStore.currentClub?.can_manage_matches" color="amber-8" text-color="dark" unelevated :label="t('dashboard.empty.btnFirstMatch')" icon="add" class="q-mt-md text-weight-bolder shadow-1" style="border-radius: 8px;" @click="openCreateMatch()" />
      </div>

      <!-- O SEGREDO: O v-else que esconde o filtro quando não há jogos -->
      <div v-else>
        <!-- FILTRO DINÂMICO (Estilo Carrossel c/ Expansão) -->
        <div class="q-mb-md q-px-xs">
          
          <!-- Linha Principal (Fixa) -->
          <div class="row justify-between items-center">
            <div class="text-subtitle1 text-weight-bold text-dark row items-center">
              <q-icon name="calendar_today" class="q-mr-sm text-green-9" size="sm" />
              {{ t('dashboard.filters.calendar') }}
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

          <!-- Linha Secundária: Seletor de Mês -->
          <div v-if="matchViewMode === 'month'" class="row justify-end q-mt-sm">
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

        <!-- CARTÕES DE JOGO -->
        <div v-if="filteredMatches.length > 0" class="row q-col-gutter-lg">
          <div v-for="match in filteredMatches" :key="match.id" class="col-12 col-md-6 col-lg-4">
            <q-card flat class="match-card-light">
              
              <!-- Topo do Cartão -->
              <div class="row items-center justify-between q-pa-md" style="border-bottom: 1px solid #f1f5f9;">
                <div class="text-subtitle2 text-weight-bold text-dark row items-center">
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
                    {{ match.status === 'fechado' ? t('dashboard.match.statusClosed') : (match.status === 'votacao' ? t('dashboard.match.statusVoting') : t('dashboard.match.statusOpen')) }}
                  </q-chip>

                  <!-- Menu de Gestão -->
                  <q-btn v-if="clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner" flat round dense icon="more_vert" color="grey-6">
                    <q-menu auto-close style="border-radius: 12px; min-width: 140px;">
                      <q-list>
                        <q-item clickable @click="sendAvailabilityReminder(match)">
                          <q-item-section avatar><q-icon name="notifications_active" size="sm" color="blue-8" /></q-item-section>
                          <q-item-section class="text-weight-bold text-blue-9">{{ t('dashboard.match.btnAskConfirm') }}</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable @click="openEditMatch(match)">
                          <q-item-section avatar><q-icon name="edit" size="sm" color="grey-7" /></q-item-section>
                          <q-item-section class="text-weight-bold">{{ t('dashboard.match.btnEdit') }}</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable @click="deleteMatch(match)">
                          <q-item-section avatar><q-icon name="delete" size="sm" color="negative" /></q-item-section>
                          <q-item-section class="text-negative text-weight-bold">{{ t('dashboard.match.btnDelete') }}</q-item-section>
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
                    <div class="col-4 column items-center">
                      <q-avatar size="44px" :color="matchSettingsColor(match, 'A')" text-color="white" icon="shield" class="shadow-2" />
                      <div class="text-weight-bold text-grey-3 q-mt-sm text-uppercase text-ellipsis full-width" style="font-size: 11px;">
                        {{ match.team_a_name || clubSettings?.default_team_a_name || t('dashboard.modals.teamAName') }}
                      </div>
                    </div>
                                      
                    <div class="col-4 row items-center justify-center no-wrap q-gutter-x-sm">
                      <div class="text-weight-bolder text-white" style="font-size: 2.2rem; line-height: 1;">{{ match.team_a_goals ?? '-' }}</div>
                      <div class="text-blue-grey-3 text-h6 text-weight-bold">-</div>
                      <div class="text-weight-bolder text-white" style="font-size: 2.2rem; line-height: 1;">{{ match.team_b_goals ?? '-' }}</div>
                    </div>                      

                    <div class="col-4 column items-center">
                      <q-avatar size="44px" :color="matchSettingsColor(match, 'B')" text-color="white" icon="shield" class="shadow-2" />
                      <div class="text-weight-bold text-grey-3 q-mt-sm text-uppercase text-ellipsis full-width" style="font-size: 11px;">
                        {{ match.team_b_name || clubSettings?.default_team_b_name || t('dashboard.modals.teamBName') }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- JOGO ABERTO -->
                <div v-else class="row items-center justify-between inner-info-box q-pa-sm">
                  <div class="col-5 q-pl-sm">
                    <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">{{ t('dashboard.match.location') }}</div>
                    <div class="text-body2 text-weight-bold text-dark text-ellipsis">{{ match.location }}</div>
                  </div>
                  <q-separator vertical class="bg-grey-3" />
                  <div class="col-3 text-center">
                    <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">{{ t('dashboard.match.capacity') }}</div>
                    <div class="text-body2 text-weight-bold" :class="match.confirmedCount >= match.max_players ? 'text-negative' : 'text-dark'">
                      {{ match.confirmedCount || 0 }} / {{ match.max_players }}
                    </div>
                  </div>
                  <q-separator vertical class="bg-grey-3" />
                  <div class="col-3 text-right q-pr-sm">
                    <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 10px;">{{ t('dashboard.match.price') }}</div>
                    <div class="text-body2 text-weight-bolder text-green-9">{{ match.price_per_player }}€</div>
                  </div>
                </div>
              </q-card-section>

              <!-- Rodapé do Cartão -->
              <q-card-actions class="q-px-md q-pb-md q-pt-none row items-center justify-between">
                <q-btn flat color="grey-8" icon="groups" :label="t('dashboard.match.btnSquad')" class="text-weight-bold bg-grey-3" style="border-radius: 8px;" @click="openPresencesModal(match)" />

                <div class="row q-gutter-sm items-center">
                  <q-btn
                    v-if="(!match.status || match.status === 'aberto') && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)"
                    color="negative" flat round dense icon="sports" @click="openCloseModal(match)"
                  >
                    <q-tooltip>{{ t('dashboard.match.btnCloseMatch') }}</q-tooltip>
                  </q-btn>
                  
                  <q-btn
                    v-if="(!match.status || match.status === 'aberto') && match.isUserInscribed"
                    color="green-9" text-color="white" unelevated disable :label="t('dashboard.match.btnInscribed')" icon="check_circle" class="text-weight-bold q-px-md shadow-1" style="border-radius: 8px;"
                  />

                  <q-btn
                    v-else-if="(!match.status || match.status === 'aberto') && (match.confirmedCount < match.max_players)"
                    color="amber-8" text-color="dark" unelevated :label="t('dashboard.match.btnPlay')" class="text-weight-bolder q-px-md shadow-2" style="border-radius: 8px;"
                    @click="joinMatch(match)"
                  />

                  <q-btn
                    v-else-if="(!match.status || match.status === 'aberto') && (match.confirmedCount >= match.max_players)"
                    color="negative" text-color="white" unelevated disable :label="t('dashboard.match.btnFull')" class="text-weight-bolder q-px-md shadow-1" style="border-radius: 8px;"
                  />

                  <q-btn 
                    v-if="match.status === 'fechado' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)"
                    flat dense round 
                    color="amber-8" 
                    icon="edit" 
                    @click="reopenMatch(match)"
                  >
                    <q-tooltip>{{ t('dashboard.match.btnReopen') }}</q-tooltip>
                  </q-btn>

                  <q-btn 
                    v-if="match.status === 'votacao' && !votedMatches.includes(match.id)" 
                    color="blue-8" 
                    text-color="white" 
                    unelevated 
                    :label="t('dashboard.match.btnRate')" 
                    icon="how_to_vote" 
                    class="text-weight-bolder q-px-md shadow-2" 
                    style="border-radius: 8px;"
                    @click="openVotingModal(match)" 
                  />

                  <q-btn 
                    v-if="match.status === 'votacao' && votedMatches.includes(match.id)" 
                    color="grey-4" 
                    text-color="grey-7" 
                    unelevated 
                    disable
                    :label="t('dashboard.match.btnVoted')" 
                    icon="check_circle" 
                    class="text-weight-bold q-px-md shadow-1" 
                    style="border-radius: 8px;"
                  />

                  <q-btn 
                    v-if="match.status === 'votacao' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)"
                    color="negative" 
                    flat round dense 
                    icon="gavel" 
                    @click="closeVoting(match)"
                  >
                    <q-tooltip>{{ t('dashboard.match.btnClosePolls') }}</q-tooltip>
                  </q-btn>

                  <q-btn 
                    v-if="match.status === 'fechado'" 
                    flat dense 
                    color="amber-9" 
                    icon="emoji_events" 
                    :label="t('dashboard.match.btnResults')" 
                    class="text-weight-bold"
                    @click="openResultsModal(match)"
                  />
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        
        <!-- MENSAGEM DE FILTRO VAZIO -->
        <div v-else class="text-center q-pa-xl match-card-light q-mt-md">
          <q-icon name="event_busy" size="4em" class="text-grey-4 q-mb-sm" />
          <div class="text-subtitle1 text-weight-bold text-dark">{{ t('dashboard.empty.noFilterTitle') }}</div>
          <p class="text-caption text-grey-6 q-px-md q-mt-xs">
            {{ t('dashboard.empty.noFilterDesc') }}
          </p>
        </div>
      </div>
    </q-pull-to-refresh>

    <!-- Botão Flutuante (+ Criar Partida) -->
    <q-page-sticky v-if="clubStore.currentClub?.can_manage_matches" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="amber-8" text-color="dark" class="shadow-5" @click="openCreateMatch()">
        <q-tooltip>{{ t('dashboard.empty.btnFirstMatch') }}</q-tooltip>
      </q-btn>
    </q-page-sticky>

    <q-dialog v-model="showCreateModal" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 350px; border-radius: 20px;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bolder row items-center">
            <q-icon name="event_available" color="primary" size="sm" class="q-mr-sm" />
            {{ newMatch.id ? t('dashboard.modals.editMatchTitle') : t('dashboard.modals.createMatchTitle') }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-lg q-px-md">
          <q-form @submit="saveMatch" class="q-gutter-md">
            <div class="row items-center q-mb-md bg-grey-2 q-pa-sm" style="border-radius: 8px;">
              <q-toggle v-model="useDefaultSettings" color="primary" :label="t('dashboard.modals.toggleDefaults')" @update:model-value="applyDefaults" />
            </div>
            <q-input rounded outlined dense v-model="newMatch.date" type="datetime-local" :label="t('dashboard.modals.dateLabel')" stack-label :disable="useDefaultSettings" :rules="[val => !!val || 'Obrigatório']" />
            <q-input rounded outlined dense v-model="newMatch.location" :label="t('dashboard.modals.locationLabel')" :disable="useDefaultSettings" :rules="[val => !!val || 'Obrigatório']" />
            <div class="row no-wrap" style="gap: 16px;">
              <q-input class="col" rounded outlined dense v-model.number="newMatch.max_players" type="number" :label="t('dashboard.modals.capacityLabel')" :disable="useDefaultSettings" />
              <q-input class="col" rounded outlined dense v-model.number="newMatch.starters_per_team" type="number" :label="t('dashboard.modals.startersLabel')" :disable="useDefaultSettings" />
              <q-input class="col" rounded outlined dense v-model.number="newMatch.price_per_player" type="number" step="0.5" :label="t('dashboard.modals.priceLabel')" :disable="useDefaultSettings" />
            </div>
            <div class="row no-wrap" style="gap: 16px;">
              <q-input :class="clubSettings.single_team_mode ? 'col-12' : 'col'" rounded outlined dense v-model="newMatch.team_a_name" :label="clubSettings.single_team_mode ? t('dashboard.modals.singleTeamName') : t('dashboard.modals.teamAName')" :disable="useDefaultSettings" />
              <q-input v-if="!clubSettings.single_team_mode" class="col" rounded outlined dense v-model="newMatch.team_b_name" :label="t('dashboard.modals.teamBName')" :disable="useDefaultSettings" />
            </div>
            <div v-if="newMatch.id" class="row items-center q-mb-md bg-amber-1 q-pa-sm" style="border-radius: 8px; border: 1px solid #ffe082;">
              <q-checkbox v-model="applyToFuture" color="amber-10" :label="t('dashboard.modals.applyFuture')" />
            </div>
            <div class="column q-gutter-y-sm q-mt-lg">
              <q-btn :label="newMatch.id ? t('dashboard.modals.btnSaveEdit') : t('dashboard.modals.btnPublish')" type="submit" color="primary" unelevated class="full-width text-weight-bold" style="border-radius: 8px; padding: 10px 0;" :loading="saving" />
              <q-btn v-if="!newMatch.id" :label="t('dashboard.modals.btnGenerateBulk')" icon="auto_mode" color="dark" unelevated outline class="full-width text-weight-bold" style="border-radius: 8px; padding: 10px 0;" @click="generateMonthlyMatchesBulk" :loading="saving" />
              <q-btn :label="t('dashboard.modals.btnCancel')" flat color="grey-6" v-close-popup class="full-width text-weight-bold" style="border-radius: 8px; padding: 10px 0;" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPresencesModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="modal-safe-footer" style="min-width: 340px; max-width: 480px; width: 100%; border-radius: 24px; overflow: hidden;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div>
            <div class="text-subtitle1 text-weight-bolder row items-center"><q-icon name="groups" color="primary" class="q-mr-sm" />{{ t('dashboard.modals.presencesTitle') }}</div>
            <div class="text-caption text-grey-5">{{ selectedMatch ? formatDate(selectedMatch.date) : '' }}</div>
          </div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
        <q-card-section v-if="presences.length > 0" class="bg-grey-3 q-py-sm column q-gutter-y-sm" style="border-bottom: 1px solid #e2e8f0;">
          <div v-if="clubSettings?.single_team_mode" class="row items-center q-px-sm q-mt-xs">
            <q-select v-model="selectedFormation" :options="availableFormations" dense outlined color="green-9" bg-color="white" emit-value map-options label="Esquema Tático" class="full-width shadow-1" style="border-radius: 8px;">
              <template v-slot:prepend><q-icon name="sports_esports" color="green-9" /></template>
            </q-select>
          </div>
          <div class="row q-gutter-sm justify-center q-px-sm q-py-xs">
            <q-btn v-if="selectedMatch?.status !== 'fechado' && clubStore.currentClub?.can_manage_teams && !clubSettings?.single_team_mode" dense color="primary" unelevated icon="auto_awesome" :label="t('dashboard.modals.btnAutoBalance')" class="col text-weight-bold shadow-1" style="border-radius: 8px; height: 36px;" @click="autoBalanceTeams" />
            <q-btn v-if="selectedMatch?.status !== 'fechado' && clubStore.currentClub?.can_manage_teams" dense outline color="negative" icon="layers_clear" :label="t('dashboard.modals.btnClearTeams')" class="col text-weight-bold shadow-1 bg-white" style="border-radius: 8px; height: 36px;" @click="clearAllTeams" />
            <q-btn dense color="dark" unelevated icon="visibility" :label="clubSettings?.single_team_mode ? t('dashboard.modals.btnViewTactics') : t('dashboard.modals.btnViewSummary')" class="col text-weight-bold shadow-2" style="border-radius: 8px; height: 36px;" @click="showTeamsSummaryModal = true" />
          </div>
        </q-card-section>
        <q-card-section v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner)" class="q-pa-md bg-grey-3 border-bottom">
          <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.adminPanelTitle') }}</div>
          <q-btn icon="person_add" color="dark" :label="t('dashboard.modals.btnSelectPlayers')" class="full-width text-weight-bold shadow-1" style="border-radius: 8px; height: 42px;" @click="showConvokModal = true" />
        </q-card-section>
        <q-card-section class="q-pa-none bg-grey-1" style="max-height: 50vh; overflow-y: auto;">
          <div v-if="loadingPresences" class="text-center q-pa-xl"><q-spinner-soccer color="primary" size="40px" /></div>
          <q-list v-else-if="presences.length > 0" class="q-pa-md q-gutter-y-sm">
            <q-item v-for="presence in presences" :key="presence.id" class="bg-white shadow-1 border-radius-12 q-py-sm">
              <q-item-section avatar class="items-center">
                <div class="column items-center bg-grey-9 text-white q-px-xs q-py-xs shadow-2 text-center" style="border-radius: 8px; min-width: 42px;">
                  <span v-if="canSeeStats" class="text-weight-bolder text-subtitle2" :class="(presence.profiles?.overall || presence.virtual_players?.overall || 70) >= 80 ? 'text-amber' : 'text-white'">
                    {{ presence.profiles?.overall || presence.virtual_players?.overall || 70 }}
                  </span>
                  <span v-else class="text-weight-bolder text-subtitle2 text-grey-5 q-mb-xs"><q-icon name="sports_soccer" size="xs" /></span>
                  <span class="text-grey-4 text-weight-bold" style="font-size: 9px; text-transform: uppercase;">{{ (presence.profiles?.position || presence.virtual_players?.position || 'MED').substring(0,3) }}</span>
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark row items-center">
                  {{ presence.profiles?.name || presence.virtual_players?.name || presence.guest_name }}
                  <q-badge v-if="presence.team" :color="presence.team === 'A' ? (clubSettings?.single_team_mode ? 'green-9' : (clubSettings?.default_team_a_color || 'blue')) : (clubSettings?.single_team_mode ? 'amber-9' : (clubSettings?.default_team_b_color || 'orange'))" class="q-ml-sm text-weight-bold">
                    {{ clubSettings?.single_team_mode ? (presence.team === 'A' ? t('dashboard.modals.teamTitulares') : t('dashboard.modals.teamBanco')) : presence.team }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption>
                  <span :class="presence.status === 'confirmed' ? 'text-primary text-weight-medium' : 'text-warning'">
                    {{ presence.status === 'confirmed' ? t('dashboard.modals.statusConfirmed') : t('dashboard.modals.statusWaitlist') }}
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row items-center no-wrap">
                  <template v-if="selectedMatch?.status !== 'fechado' && clubStore.currentClub?.can_manage_teams">
                    <template v-if="!clubSettings?.single_team_mode">
                      <q-btn dense unelevated label="A" class="text-weight-bolder q-mr-xs" :color="presence.team === 'A' ? (clubSettings?.default_team_a_color || 'blue') : 'grey-3'" :text-color="presence.team === 'A' ? 'white' : 'grey-8'" style="border-radius: 4px; width: 18px; height: 18px; padding: 0; font-size: 10px;" @click="assignTeam(presence, 'A')" />
                      <q-btn dense unelevated label="B" class="text-weight-bolder q-mr-sm" :color="presence.team === 'B' ? (clubSettings?.default_team_b_color || 'orange') : 'grey-3'" :text-color="presence.team === 'B' ? 'white' : 'grey-8'" style="border-radius: 4px; width: 18px; height: 18px; padding: 0; font-size: 10px;" @click="assignTeam(presence, 'B')" />
                    </template>
                    <template v-else>
                      <q-btn dense unelevated icon="sports_soccer" class="text-weight-bolder q-mr-xs" :color="presence.team === 'A' ? 'green-9' : 'grey-3'" :text-color="presence.team === 'A' ? 'white' : 'grey-8'" style="border-radius: 4px; width: 24px; height: 24px; padding: 0; font-size: 13px;" @click="assignTeam(presence, 'A')" />
                      <q-btn dense unelevated icon="event_seat" class="text-weight-bolder q-mr-sm" :color="presence.team === 'B' ? 'amber-9' : 'grey-3'" :text-color="presence.team === 'B' ? 'white' : 'grey-8'" style="border-radius: 4px; width: 24px; height: 24px; padding: 0; font-size: 13px;" @click="assignTeam(presence, 'B')" />
                    </template>
                  </template>
                  <template v-if="clubStore.currentClub?.can_manage_finances || clubStore.currentClub?.is_owner">
                    <q-btn flat round dense :icon="presence.paid ? 'price_check' : 'currency_exchange'" size="sm" :color="presence.paid ? 'positive' : 'grey-4'" @click="togglePayment(presence)" />
                  </template>
                  <q-btn v-if="selectedMatch?.status !== 'fechado' && (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.can_manage_matches)" flat round dense icon="person_remove" size="sm" color="negative" class="q-ml-xs" @click="removePresence(presence)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-xl text-grey-6"><q-icon name="people_outline" size="3em" class="text-grey-4 q-mb-xs" /><div>{{ t('dashboard.modals.noPlayersInscribed') }}</div></div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCloseModal" persistent>
      <q-card class="modal-safe-footer" style="min-width: 340px; max-width: 600px; width: 100%; border-radius: 16px; background: #ffffff;">
        <q-card-section class="row items-center club-header-block text-white">
          <div class="text-subtitle1 text-weight-bold"><q-icon name="sports" size="sm" class="q-mr-sm"/> {{ t('dashboard.modals.closeMatchTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-md" style="max-height: 65vh; overflow-y: auto;">
          <div v-if="loadingPresences" class="text-center q-pa-md"><q-spinner color="green-9" size="30px" /></div>
          <div v-else>
            <div class="row items-center justify-center text-center q-mb-lg bg-grey-1 q-pa-sm shadow-1" style="border-radius: 12px; border: 1px solid #e2e8f0;">
              <div class="col-4">
                <div :class="`text-caption text-weight-bold text-uppercase text-${clubSettings?.default_team_a_color || 'blue'}`">{{ matchToClose?.team_a_name }}</div>
                <div :class="`text-h2 text-weight-bolder text-${clubSettings?.default_team_a_color || 'blue'}`" style="line-height: 1;">{{ computedScoreA }}</div>
              </div>
              <div v-if="!clubSettings?.single_team_mode" class="col-2 text-h4 text-grey-4 text-weight-bold">-</div>
              <div v-if="!clubSettings?.single_team_mode" class="col-4">
                <div :class="`text-caption text-weight-bold text-uppercase text-${clubSettings?.default_team_b_color || 'orange'}`">{{ matchToClose?.team_b_name }}</div>
                <div :class="`text-h2 text-weight-bolder text-${clubSettings?.default_team_b_color || 'orange'}`" style="line-height: 1;">{{ computedScoreB }}</div>
              </div>
            </div>

            <div :class="`text-${matchSettingsColor(matchToClose, 'A')} text-weight-bold q-mb-sm q-ml-sm row items-center text-uppercase`">
              <q-icon name="shield" class="q-mr-xs"/> {{ matchToClose?.team_a_name || clubSettings?.default_team_a_name }}
            </div>
            <div v-for="player in matchPlayersStats.teamA" :key="player.id" class="row no-wrap items-center justify-between q-mb-sm bg-white q-pa-sm shadow-1" :style="`border-radius: 12px; border: 1px solid #f1f5f9; border-left: 4px solid var(--q-${clubSettings?.default_team_a_color || 'blue'});`">
              <div class="text-body2 text-ellipsis text-weight-bold text-dark" style="flex: 1; min-width: 0; padding-right: 8px;">{{ player.name }}</div>
              <div class="row no-wrap q-gutter-x-md" style="width: auto;">
                <div class="column items-center">
                  <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">{{ t('dashboard.modals.goalsLabel') }}</div>
                  <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                    <q-btn round dense flat icon="remove" size="10px" :color="player.goals > 0 ? 'dark' : 'grey-4'" :disable="player.goals <= 0" @click="player.goals--" />
                    <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.goals }}</div>
                    <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.goals++" />
                  </div>
                </div>
                <div class="column items-center">
                  <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">{{ t('dashboard.modals.assistsLabel') }}</div>
                  <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                    <q-btn round dense flat icon="remove" size="10px" :color="player.assists > 0 ? 'dark' : 'grey-4'" :disable="player.assists <= 0" @click="player.assists--" />
                    <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.assists }}</div>
                    <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.assists++" />
                  </div>
                </div>
              </div>
            </div>

            <template v-if="!clubSettings?.single_team_mode">
              <div :class="`text-${matchSettingsColor(matchToClose, 'B')} text-weight-bold q-mt-lg q-mb-sm q-ml-sm row items-center text-uppercase`">
                <q-icon name="shield" class="q-mr-xs"/> {{ matchToClose?.team_b_name || clubSettings?.default_team_b_name }}
              </div>
              <div v-for="player in matchPlayersStats.teamB" :key="player.id" class="row no-wrap items-center justify-between q-mb-sm bg-white q-pa-sm shadow-1" :style="`border-radius: 12px; border: 1px solid #f1f5f9; border-left: 4px solid var(--q-${clubSettings?.default_team_b_color || 'orange'});`">
                <div class="text-body2 text-ellipsis text-weight-bold text-dark" style="flex: 1; min-width: 0; padding-right: 8px;">{{ player.name }}</div>
                <div class="row no-wrap q-gutter-x-md" style="width: auto;">
                  <div class="column items-center">
                    <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">{{ t('dashboard.modals.goalsLabel') }}</div>
                    <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                      <q-btn round dense flat icon="remove" size="10px" :color="player.goals > 0 ? 'dark' : 'grey-4'" :disable="player.goals <= 0" @click="player.goals--" />
                      <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.goals }}</div>
                      <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.goals++" />
                    </div>
                  </div>
                  <div class="column items-center">
                    <div class="text-grey-6 text-weight-bold q-mb-xs" style="font-size: 9px; letter-spacing: 0.5px;">{{ t('dashboard.modals.assistsLabel') }}</div>
                    <div class="row items-center no-wrap bg-grey-2" style="border-radius: 20px; padding: 2px;">
                      <q-btn round dense flat icon="remove" size="10px" :color="player.assists > 0 ? 'dark' : 'grey-4'" :disable="player.assists <= 0" @click="player.assists--" />
                      <div class="text-weight-bolder text-dark text-center" style="width: 22px; font-size: 14px;">{{ player.assists }}</div>
                      <q-btn round dense flat icon="add" size="10px" color="dark" @click="player.assists++" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </q-card-section>
        <q-card-actions align="between" class="q-pa-md bg-grey-1" style="border-top: 1px solid #e2e8f0;">
          <q-btn v-if="clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner" :label="t('dashboard.modals.btnSaveLive')" color="blue-8" icon="save" unelevated style="border-radius: 8px;" :loading="saving" @click="saveLiveStats" />
          <q-btn v-if="clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner" :label="t('dashboard.modals.btnCloseMatch')" color="amber-8" text-color="dark" class="text-weight-bolder shadow-1" style="border-radius: 8px;" unelevated :loading="saving" @click="closeMatch" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showStaffModal">
      <q-card class="modal-safe-footer" style="min-width: 350px; max-width: 550px; width: 100%; border-radius: 12px;">
        <q-card-section class="row items-center bg-dark text-white">
          <div class="text-subtitle1 text-weight-bold">{{ t('dashboard.modals.staffTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="bg-grey-2" style="border-bottom: 1px solid #e2e8f0;">
          <div class="text-caption text-weight-bold text-dark q-mb-xs">{{ t('dashboard.modals.addStaffTitle') }}</div>
          <div class="row q-gutter-sm items-center">
            <q-select v-model="selectedNewAdmin" :options="eligibleMembersOptions" dense outlined bg-color="white" class="col" :label="t('dashboard.modals.searchPlayerPlaceholder')" use-input hide-selected fill-input @filter="filterEligibleMembers" />
            <q-btn color="primary" icon="add_moderator" :label="t('dashboard.modals.btnPromote')" unelevated class="text-weight-bold" @click="addAdmin" />
          </div>
        </q-card-section>
        <q-card-section class="q-pa-none" style="max-height: 50vh; overflow-y: auto;">
          <div v-if="loadingStaff" class="text-center q-pa-lg"><q-spinner color="primary" size="30px" /></div>
          <q-list v-else separator>
            <q-item v-for="member in staffList" :key="member.profile_id" class="q-py-md">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ member.profiles?.name || '...' }}</q-item-label>
                <q-item-label caption v-if="member.is_owner" class="text-amber-9 text-weight-bold">{{ t('dashboard.modals.roleOwner') }}</q-item-label>
                <q-item-label caption v-else class="text-primary text-weight-bold">{{ t('dashboard.modals.roleAdmin') }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <div class="column q-gutter-y-xs">
                  <q-toggle dense size="sm" v-model="member.can_manage_matches" color="primary" :label="t('dashboard.modals.permManageMatches')" @update:model-value="val => updatePermission(member.profile_id, 'can_manage_matches', val)" />
                  <q-toggle dense size="sm" v-model="member.can_manage_teams" color="primary" :label="t('dashboard.modals.permManageTeams')" @update:model-value="val => updatePermission(member.profile_id, 'can_manage_teams', val)" />
                  <q-toggle dense size="sm" v-model="member.can_manage_finances" color="primary" :label="t('dashboard.modals.permManageFinances')" @update:model-value="val => updatePermission(member.profile_id, 'can_manage_finances', val)" />
                </div>
              </q-item-section>
              <q-item-section side>
                <q-btn v-if="!member.is_owner" flat round dense color="negative" icon="remove_moderator" @click="removeAdmin(member.profile_id)">
                  <q-tooltip>{{ t('dashboard.modals.tooltipRemoveStaff') }}</q-tooltip>
                </q-btn>
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
            {{ t('dashboard.modals.requestsTitle') }}
          </div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-none bg-grey-1" style="max-height: 50vh; overflow-y: auto;">
          <q-list v-if="pendingRequests.length > 0" separator>
            <q-item v-for="req in pendingRequests" :key="req.profile_id" class="q-py-md bg-white shadow-1 q-mb-xs">
              <q-item-section avatar><q-avatar color="grey-3" text-color="dark" icon="person" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ req.profiles?.name || '...' }}</q-item-label>
                <q-item-label caption>{{ t('dashboard.modals.reqSubtitle') }}</q-item-label>
              </q-item-section>
              <q-item-section side class="row q-gutter-sm">
                <div>
                  <q-btn round dense color="negative" icon="close" flat @click="handleRequest(req.profile_id, 'rejected')"><q-tooltip>{{ t('dashboard.modals.tooltipReject') }}</q-tooltip></q-btn>
                  <q-btn round dense color="positive" icon="check" unelevated class="q-ml-sm" @click="handleRequest(req.profile_id, 'approved')"><q-tooltip>{{ t('dashboard.modals.tooltipApprove') }}</q-tooltip></q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center q-pa-xl text-grey-6">
            <q-icon name="check_circle_outline" size="3em" class="q-mb-md text-grey-4" />
            <div>{{ t('dashboard.modals.noRequests') }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSettingsModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card style="width: 100%; max-width: 500px; max-height: 100%; border-radius: 24px; background: #ffffff; display: flex; flex-direction: column; overflow: hidden;">
        <q-card-section class="bg-dark text-white q-py-md" style="flex-shrink: 0;">
          <div class="row items-center justify-between">
            <div class="text-subtitle1 text-weight-bolder row items-center"><q-icon name="settings" color="primary" size="sm" class="q-mr-sm" /> {{ t('dashboard.modals.settingsTitle') }}</div>
            <q-btn icon="close" flat round dense color="grey-4" v-close-popup />
          </div>
        </q-card-section>
        <q-card-section class="q-pa-md scroll" style="flex-grow: 1; overflow-y: auto; overflow-x: hidden;">
          <div class="column q-gutter-y-md">
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.tabFinances') }}</div>
              <q-input outlined dense type="number" step="0.5" v-model.number="clubSettings.default_price" :label="t('dashboard.modals.defaultPrice')" class="q-mb-sm" bg-color="white" />
              <q-input outlined dense type="number" step="0.5" v-model.number="clubSettings.monthly_price_per_game" :label="t('dashboard.modals.monthlyPrice')" bg-color="white">
                <template v-slot:append><q-icon name="info" size="xs" color="grey-5"></q-icon></template>
              </q-input>
            </div>
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.tabLogistics') }}</div>
              <q-input outlined dense v-model="clubSettings.default_location" :label="t('dashboard.modals.defaultLocation')" class="q-mb-sm" bg-color="white" />
              <div class="row q-col-gutter-sm">
                <div class="col-6"><q-input outlined dense type="number" :min="2" v-model.number="clubSettings.default_max_players" :label="t('dashboard.modals.maxCapacity')" bg-color="white" @update:model-value="enforceSquadLimit" /></div>
                <div class="col-6"><q-input outlined dense type="number" :min="1" v-model.number="clubSettings.default_starters_per_team" :label="t('dashboard.modals.startersPerTeam')" bg-color="white" /></div>
              </div>
            </div>
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.tabTeams') }}</div>
              <q-input outlined dense v-model="clubSettings.default_team_a_name" :label="clubSettings.single_team_mode ? t('dashboard.modals.singleTeamName') : t('dashboard.modals.teamAName')" class="q-mb-sm" bg-color="white" />
              <q-input v-if="!clubSettings.single_team_mode" outlined dense v-model="clubSettings.default_team_b_name" :label="t('dashboard.modals.teamBName')" bg-color="white" />
            </div>
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.tabColors') }}</div>
              <q-select outlined dense emit-value map-options v-model="clubSettings.default_team_a_color" :options="[{label: 'Bordeaux', value: 'red-10'}, {label: 'Vermelho', value: 'red-8'}, {label: 'Laranja', value: 'orange-8'}, {label: 'Amarelo', value: 'yellow-7'}, {label: 'Verde', value: 'positive'}, {label: 'Verde Tropa', value: 'green-10'}, {label: 'Ciano', value: 'cyan-7'}, {label: 'Azul', value: 'blue'}, {label: 'Azul Marinho', value: 'blue-10'}, {label: 'Roxo', value: 'purple'}, {label: 'Rosa', value: 'pink-6'}, {label: 'Castanho', value: 'brown-6'}, {label: 'Cinzento', value: 'grey-7'}, {label: 'Preto', value: 'dark'}]" :label="clubSettings.single_team_mode ? t('dashboard.modals.colorSingleTeam') : t('dashboard.modals.colorTeamA')" class="q-mb-sm" bg-color="white">
                <template v-slot:option="scope"><q-item v-bind="scope.itemProps" class="q-py-xs"><q-item-section avatar><q-avatar :color="scope.opt.value" size="xs" /></q-item-section><q-item-section>{{ scope.opt.label }}</q-item-section></q-item></template>
              </q-select>
              <q-select v-if="!clubSettings.single_team_mode" outlined dense emit-value map-options v-model="clubSettings.default_team_b_color" :options="[{label: 'Bordeaux', value: 'red-10'}, {label: 'Vermelho', value: 'negative'}, {label: 'Laranja', value: 'orange'}, {label: 'Amarelo', value: 'yellow-8'}, {label: 'Verde', value: 'positive'}, {label: 'Verde Tropa', value: 'green-10'}, {label: 'Ciano', value: 'cyan-7'}, {label: 'Azul', value: 'blue'}, {label: 'Azul Marinho', value: 'blue-10'}, {label: 'Roxo', value: 'purple'}, {label: 'Rosa', value: 'pink-6'}, {label: 'Castanho', value: 'brown-6'}, {label: 'Cinzento', value: 'grey-7'}, {label: 'Preto', value: 'dark'}]" :label="t('dashboard.modals.colorTeamB')" bg-color="white">
                <template v-slot:option="scope"><q-item v-bind="scope.itemProps" class="q-py-xs"><q-item-section avatar><q-avatar :color="scope.opt.value" size="xs" /></q-item-section><q-item-section>{{ scope.opt.label }}</q-item-section></q-item></template>
              </q-select>
            </div>
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.tabRoutine') }}</div>
              <q-select outlined dense emit-value map-options v-model="clubSettings.recurring_day_of_week" :options="t('days')" :label="t('dashboard.modals.matchDay')" class="q-mb-sm" bg-color="white" />
              <q-input outlined dense type="time" v-model="clubSettings.recurring_time" :label="t('dashboard.modals.matchTime')" bg-color="white" />
            </div>
            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">{{ t('dashboard.modals.tabFut') }}</div>
              <q-select outlined dense emit-value map-options v-model="clubSettings.attribute_mode" :options="[{label: '1-99', value: 'numeric'}, {label: 'ABC', value: 'categorical'}]" :label="t('dashboard.modals.viewMode')" class="q-mb-md" bg-color="white" />
              <div class="column q-gutter-y-sm bg-grey-2 q-pa-sm" style="border-radius: 8px;">
                <q-toggle v-model="clubSettings.hide_attributes_from_members" color="negative" :label="t('dashboard.modals.toggleHideRatings')" class="text-caption" dense />
                <q-toggle v-model="clubSettings.enable_voting" color="blue" :label="t('dashboard.modals.toggleVoting')" class="text-caption" dense />
                <q-toggle v-model="clubSettings.single_team_mode" color="yellow-9" :label="t('dashboard.modals.toggleSingleTeam')" class="text-caption" dense />
                <q-toggle v-model="clubSettings.detailed_attributes" color="purple-9" :label="t('dashboard.modals.toggleProAttributes')" class="text-caption" dense />
              </div>
            </div>
            <div class="q-mt-sm bg-white q-pa-sm shadow-1" style="border-radius: 12px; border: 1px solid #e2e8f0; width: 100%;">
              <div class="row justify-between items-center q-mb-sm q-px-xs">
                <span class="text-weight-bold text-dark row items-center text-caption"><q-icon name="stars" color="amber-8" class="q-mr-xs" size="xs" /> {{ t('dashboard.modals.tabFixedStarters') }}</span>
                <q-badge color="grey-3" text-color="dark" class="text-weight-bolder" style="font-size: 10px;">{{ clubSettings.default_squad?.length || 0 }} / {{ clubSettings.default_max_players }}</q-badge>
              </div>
              <q-btn outline color="green-9" icon="groups" :label="t('dashboard.modals.manageFixedStarters')" class="full-width text-weight-bold" style="border-radius: 8px;" @click="showSquadModal = true" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-1 q-pa-md" style="flex-shrink: 0; border-top: 1px solid #e2e8f0;">
          <q-btn flat :label="t('dashboard.modals.btnCancel')" color="grey-7" v-close-popup class="q-mr-sm" />
          <q-btn color="primary" :label="t('dashboard.modals.btnSaveSettings')" @click="saveClubSettings" :loading="savingSettings" unelevated style="border-radius: 8px;" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showVotingModal" persistent>
      <q-card class="modal-safe-footer column no-wrap" style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px; max-height: 85vh;">
        <q-card-section class="row items-center col-auto text-white bg-blue-9 q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="how_to_vote" class="q-mr-sm" size="sm" /> {{ t('dashboard.modals.votingTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="col q-pa-md" style="overflow-y: auto; overflow-x: hidden;">
          <div class="text-caption text-grey-8 q-mb-md text-weight-medium">
            {{ t('dashboard.modals.votingDesc') }} <span class="text-blue-8 text-weight-bold">{{ t('dashboard.modals.votingAnonInfo') }}</span>
          </div>
          <div v-if="loadingVotes" class="text-center q-pa-lg"><q-spinner color="blue" size="40px" /></div>
          <div v-else>
            <div v-for="p in votingPlayers" :key="p.id" class="q-mb-md bg-grey-1 q-pa-sm shadow-1" style="border-radius: 8px; border: 1px solid #f1f5f9;">
              <div class="row justify-between items-center q-mb-sm">
                <div class="text-weight-bold text-dark text-ellipsis" style="max-width: 65%;"><q-icon name="person" color="grey-6" class="q-mr-xs" /> {{ p.name }}</div>
                <q-radio v-model="selectedMVP" :val="p.id" color="amber-8" :label="t('dashboard.modals.labelMVP')" class="text-weight-bolder text-amber-9" dense />
              </div>
              <div class="row items-center q-gutter-x-md q-px-sm">
                <div class="col"><q-slider v-model="p.rating" :min="1" :max="10" :step="1" color="blue-6" markers dense /></div>
                <div class="text-weight-bolder text-blue-9 text-center bg-blue-1" style="width: 30px; border-radius: 4px; padding: 2px;">{{ p.rating }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="between" class="bg-grey-2 col-auto q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn flat :label="t('dashboard.modals.btnCancel')" color="grey-7" v-close-popup />
          <q-btn color="blue-9" :label="t('dashboard.modals.btnSubmitVotes')" unelevated class="text-weight-bold" style="border-radius: 8px;" @click="submitVotes" :loading="savingVotes" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showResultsModal">
      <q-card class="modal-safe-footer" style="min-width: 340px; max-width: 500px; width: 100%; border-radius: 16px;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="emoji_events" class="text-amber-5 q-mr-sm" size="sm" /> {{ t('dashboard.modals.resultsTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-md bg-grey-1" style="max-height: 70vh; overflow-y: auto;">
          <div v-if="loadingResults" class="text-center q-pa-md"><q-spinner color="amber-8" size="30px" /></div>
          <div v-else>
            <q-list separator>
              <q-item v-for="(p, index) in matchResultsData" :key="p.id" class="bg-white shadow-1 q-mb-sm" style="border-radius: 8px;">
                <q-item-section avatar><q-avatar :color="p.isMvp ? 'amber-8' : 'grey-3'" :text-color="p.isMvp ? 'dark' : 'grey-8'" class="text-weight-bolder">{{ index + 1 }}</q-avatar></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark row items-center">{{ p.name }} <q-icon v-if="p.isMvp" name="workspace_premium" color="amber-8" size="sm" class="q-ml-xs"><q-tooltip>MVP</q-tooltip></q-icon></q-item-label>
                  <q-item-label caption class="text-grey-7">{{ t('dashboard.modals.resultsGoals') }}: <span class="text-green-9 text-weight-bold">{{ p.goals }}</span> | {{ t('dashboard.modals.resultsAssists') }}: <span class="text-blue-9 text-weight-bold">{{ p.assists }}</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-center">
                    <div class="text-caption text-weight-bold text-grey-6" style="font-size: 9px;">{{ t('dashboard.modals.resultsRating') }}</div>
                    <div class="text-h6 text-weight-bolder" :class="p.rating >= 7 ? 'text-green-9' : (p.rating >= 5 ? 'text-amber-9' : 'text-negative')">{{ p.rating > 0 ? p.rating : '-' }}</div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showTeamsSummaryModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="modal-safe-footer" style="min-width: 340px; max-width: 680px; width: 100%; border-radius: 16px;">
        <q-card-section class="row items-center club-header-block text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="assignment" size="sm" class="q-mr-sm" /> {{ t('dashboard.modals.summaryTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        <q-tabs v-model="summaryTab" dense class="text-grey-7 bg-white full-width" active-color="primary">
          <q-tab name="lista" icon="format_list_bulleted" :label="t('dashboard.modals.tabList')" class="text-weight-bold col" />
          <q-tab name="campo" icon="sports_soccer" :label="t('dashboard.modals.tabPitch')" class="text-weight-bold col" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="summaryTab" animated class="bg-grey-1">
          <q-tab-panel name="lista" class="q-pa-md">
            <div class="q-mb-lg">
              <div class="row justify-between items-center q-mb-sm q-px-sm">
                <div class="text-weight-bolder text-uppercase text-subtitle1" :class="clubSettings?.single_team_mode ? 'text-green-9' : `text-${clubSettings?.default_team_a_color || 'blue'}`">
                  <q-icon :name="clubSettings?.single_team_mode ? 'sports_soccer' : 'shield'" /> 
                  {{ clubSettings?.single_team_mode ? t('dashboard.modals.teamTitulares') : (selectedMatch?.team_a_name || clubSettings?.default_team_a_name) }}
                </div>
                <q-chip v-if="canSeeStats" dense :color="clubSettings?.single_team_mode ? 'green-9' : (clubSettings?.default_team_a_color || 'blue')" text-color="white" class="text-weight-bold shadow-1">
                  {{ t('dashboard.modals.avgOvr') }} {{ teamASummary.avgOVR }}
                </q-chip>
              </div>
              <div class="bg-white shadow-1 overflow-hidden" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                <div v-if="teamASummary.players.length === 0" class="text-grey-6 text-center q-pa-md">{{ t('dashboard.modals.unassignedPlayer') }}</div>
                <div v-for="(p, index) in getTeamSectors(teamASummary.players).flatMap(s => s.players)" :key="p.id" :class="['row justify-between items-center q-py-sm q-px-md', index % 2 === 0 ? 'bg-grey-4' : 'bg-grey-2']" :style="index !== teamASummary.players.length - 1 ? 'border-bottom: 1px solid rgba(0,0,0,0.08);' : ''">
                  <div class="text-dark text-weight-bold text-ellipsis" style="max-width: 65%;">{{ p.profiles?.name || p.virtual_players?.name || p.guest_name }}</div>
                  <div class="text-caption text-weight-bold text-grey-8 bg-white q-px-sm shadow-1" style="border-radius: 6px; border: 1px solid #e2e8f0;">
                    {{ p.profiles?.specific_position || p.virtual_players?.specific_position || (p.profiles?.position || p.virtual_players?.position || 'MED').substring(0,3) }}
                    <span v-if="canSeeStats"> | {{ p.profiles?.overall || p.virtual_players?.overall || 70 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!clubSettings?.single_team_mode || teamBSummary.players.length > 0">
              <div class="row justify-between items-center q-mb-sm q-px-sm">
                <div class="text-weight-bolder text-uppercase text-subtitle1" :class="clubSettings?.single_team_mode ? 'text-amber-9' : `text-${clubSettings?.default_team_b_color || 'orange'}`">
                  <q-icon :name="clubSettings?.single_team_mode ? 'event_seat' : 'shield'" /> 
                  {{ clubSettings?.single_team_mode ? t('dashboard.modals.teamBanco') : (selectedMatch?.team_b_name || clubSettings?.default_team_b_name) }}
                </div>
                <q-chip v-if="canSeeStats" dense :color="clubSettings?.single_team_mode ? 'amber-9' : (clubSettings?.default_team_b_color || 'orange')" text-color="white" class="text-weight-bold shadow-1">
                  {{ t('dashboard.modals.avgOvr') }} {{ teamBSummary.avgOVR }}
                </q-chip>
              </div>
              <div class="bg-white shadow-1 overflow-hidden" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                <div v-if="teamBSummary.players.length === 0" class="text-grey-6 text-center q-pa-md">{{ t('dashboard.modals.unassignedPlayer') }}</div>
                <div v-for="(p, index) in getTeamSectors(teamBSummary.players).flatMap(s => s.players)" :key="p.id" :class="['row justify-between items-center q-py-sm q-px-md', index % 2 === 0 ? 'bg-grey-4' : 'bg-grey-2']" :style="index !== teamBSummary.players.length - 1 ? 'border-bottom: 1px solid rgba(0,0,0,0.08);' : ''">
                  <div class="text-dark text-weight-bold text-ellipsis" style="max-width: 65%;">{{ p.profiles?.name || p.virtual_players?.name || p.guest_name }}</div>
                  <div class="text-caption text-weight-bold text-grey-8 bg-white q-px-sm shadow-1" style="border-radius: 6px; border: 1px solid #e2e8f0;">
                    {{ p.profiles?.specific_position || p.virtual_players?.specific_position || (p.profiles?.position || p.virtual_players?.position || 'MED').substring(0,3) }}
                    <span v-if="canSeeStats"> | {{ p.profiles?.overall || p.virtual_players?.overall || 70 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="campo" class="q-pa-md bg-white">
            <div v-if="!clubSettings?.single_team_mode" class="row justify-center q-mb-md q-px-md">
              <q-btn-group rounded outline class="shadow-1 full-width" style="max-width: 450px;">
                <q-btn :outline="viewTeam !== 'A'" :color="clubSettings?.default_team_a_color || 'blue'" :label="selectedMatch?.team_a_name || clubSettings?.default_team_a_name" @click="viewTeam = 'A'" size="md" class="col text-weight-bold" />
                <q-btn :outline="viewTeam !== 'BOTH'" color="dark" :label="t('dashboard.modals.btnBothTeams')" @click="viewTeam = 'BOTH'" size="md" class="col text-weight-bold" />
                <q-btn :outline="viewTeam !== 'B'" :color="clubSettings?.default_team_b_color || 'orange'" :label="selectedMatch?.team_b_name || clubSettings?.default_team_b_name" @click="viewTeam = 'B'" size="md" class="col text-weight-bold" />
              </q-btn-group>
            </div>
            <!-- (O resto dos relvados mantêm-se iguais em termos de CSS, não precisam de textos estáticos) -->
            <div v-if="clubSettings?.single_team_mode || viewTeam !== 'BOTH'" class="tactics-pitch-large shadow-3">
              <div class="pitch-line-center"></div><div class="pitch-circle"></div><div class="pitch-area-top"></div><div class="pitch-area-bottom"></div>
              <div class="pitch-formation">
                <div v-for="(line, index) in getFormation(clubSettings?.single_team_mode || viewTeam === 'A' ? teamASummary.players : teamBSummary.players, selectedFormation)" :key="index" class="formation-line">
                  <div v-for="p in line" :key="p.id" class="player-dot-large">
                    <q-avatar size="42px" :color="(clubSettings?.single_team_mode || viewTeam === 'A') ? (clubSettings?.default_team_a_color || 'blue') : (clubSettings?.default_team_b_color || 'orange')" text-color="white" class="shadow-3 text-weight-bolder" style="border: 2px solid white;">
                      <div v-if="canSeeStats" class="flex flex-center full-width full-height" style="font-size: 20px; font-weight: 900;">{{ p.profiles?.overall || p.virtual_players?.overall || 70 }}</div>
                    </q-avatar>
                    <div class="player-name-tactics text-ellipsis">{{ p.profiles?.name?.split(' ')[0] || p.virtual_players?.name?.split(' ')[0] || p.guest_name }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="tactics-pitch-large shadow-3 relative-position" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div class="pitch-line-center"></div><div class="pitch-circle"></div><div class="pitch-area-top"></div><div class="pitch-area-bottom"></div>
              <div class="column justify-around full-width" style="height: 48%; z-index: 10; padding: 5px 0;">
                <div class="text-center text-weight-bolder text-white absolute q-px-sm" style="top: 5px; left: 50%; transform: translateX(-50%); font-size: 10px; background: rgba(0,0,0,0.6); border-radius: 4px;">{{ selectedMatch?.team_b_name || clubSettings?.default_team_b_name }}</div>
                <div v-for="(line, index) in getFormationReversed(teamBSummary.players)" :key="'b-'+index" class="formation-line">
                  <div v-for="p in line" :key="p.id" class="player-dot-large"><div :class="['player-badge-name', `bg-${clubSettings?.default_team_b_color || 'orange'}`]">{{ p.profiles?.name?.split(' ')[0] || p.virtual_players?.name?.split(' ')[0] || p.guest_name }}</div></div>
                </div>
              </div>
              <div class="column justify-around full-width" style="height: 48%; z-index: 10; padding: 5px 0;">
                <div class="text-center text-weight-bolder text-white absolute q-px-sm" style="bottom: 5px; left: 50%; transform: translateX(-50%); font-size: 10px; background: rgba(0,0,0,0.6); border-radius: 4px;">{{ selectedMatch?.team_a_name || clubSettings?.default_team_a_name }}</div>
                <div v-for="(line, index) in getFormation(teamASummary.players)" :key="'a-'+index" class="formation-line">
                  <div v-for="p in line" :key="p.id" class="player-dot-large"><div :class="['player-badge-name', `bg-${clubSettings?.default_team_a_color || 'blue'}`]">{{ p.profiles?.name?.split(' ')[0] || p.virtual_players?.name?.split(' ')[0] || p.guest_name }}</div></div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showProfileModal" persistent>
      <q-card class="modal-safe-footer" style="min-width: 340px; max-width: 450px; width: 100%; border-radius: 16px;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="badge" class="q-mr-sm text-primary" size="sm" /> {{ t('dashboard.modals.profileTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-md scroll" style="max-height: 70vh;">
          <div class="column q-gutter-y-md">
            <div class="column items-center q-mb-sm">
              <q-avatar size="90px" class="shadow-3 bg-grey-3 relative-position">
                <img v-if="computedAvatar" :src="computedAvatar" />
                <q-icon v-else name="person" size="60px" color="grey-5" />
                <q-badge v-if="computedAvatar" color="negative" rounded class="absolute shadow-2 cursor-pointer" style="padding: 6px; left: -4px; top: -4px; z-index: 2;" @click="clearAvatar"><q-icon name="delete" size="sm" /></q-badge>
                <q-badge color="primary" rounded class="absolute shadow-2 cursor-pointer" style="padding: 6px; right: -4px; top: -4px; z-index: 2;" @click="$refs.filePicker.pickFiles()"><q-icon :name="computedAvatar ? 'edit' : 'add_a_photo'" size="sm" /></q-badge>
              </q-avatar>
              <q-file v-show="false" ref="filePicker" v-model="profileForm.avatarFile" accept="image/*" @update:model-value="onAvatarSelected" />
            </div>
            <div class="text-caption text-weight-bold text-grey-8">{{ t('dashboard.modals.personalData') }}</div>
            <q-input outlined dense v-model="profileForm.name" :label="t('dashboard.modals.playerName')" color="primary" bg-color="grey-1">
              <template v-slot:prepend><q-icon name="person" color="grey-7" /></template>
            </q-input>
            <q-separator class="q-my-sm" />
            <!-- NOVO SELETOR MULTILINGUE -->
            <div class="text-caption text-weight-bold text-grey-8">{{ t('common.language') }}</div>
            <q-select 
              outlined dense 
              v-model="appLangPref" 
              :options="[
                {label: t('common.system'), value: 'system'}, 
                {label: 'English', value: 'en-US'},
                {label: 'Português', value: 'pt-PT'}, 
                {label: 'Español', value: 'es-ES'},
                {label: 'Français', value: 'fr-FR'},
                {label: 'Italiano', value: 'it-IT'},
                {label: 'Deutsch', value: 'de-DE'}
              ]" 
              emit-value map-options 
              color="primary" bg-color="grey-1"
            >
              <template v-slot:prepend><q-icon name="language" color="grey-7" /></template>
            </q-select>

            <q-separator class="q-my-sm" />
            <div class="text-caption text-weight-bold text-grey-8">{{ t('dashboard.modals.fieldPrefs') }}</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-select outlined dense v-model="profileForm.position" :options="t('positions')" :label="t('dashboard.modals.genPosition')" color="primary" bg-color="grey-1" @update:model-value="profileForm.specific_position = ''">
                  <template v-slot:prepend><q-icon name="sports_soccer" color="grey-7" size="xs" /></template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6">
                <q-select outlined dense v-model="profileForm.specific_position" :options="specificPositionsMap[profileForm.position]" emit-value map-options :label="t('dashboard.modals.specPosition')" color="primary" bg-color="grey-1">
                  <template v-slot:prepend><q-icon name="explore" color="grey-7" size="xs" /></template>
                </q-select>
              </div>
              <div class="col-12">
                <q-select outlined dense v-model="profileForm.preferred_foot" :options="t('feet')" :label="t('dashboard.modals.prefFoot')" color="primary" bg-color="grey-1">
                  <template v-slot:prepend><q-icon name="do_not_step" color="grey-7" size="xs" /></template>
                </q-select>
              </div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="text-caption text-weight-bold text-grey-8">{{ t('dashboard.modals.security') }}</div>
            <q-input outlined dense v-model="profileForm.newPassword" :type="isPwdProfile1 ? 'password' : 'text'" :label="t('dashboard.modals.newPassword')" :placeholder="t('dashboard.modals.newPasswordPlaceholder')" color="primary" bg-color="grey-1">
              <template v-slot:prepend><q-icon name="lock" color="grey-7" /></template>
              <template v-slot:append><q-icon :name="isPwdProfile1 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdProfile1 = !isPwdProfile1" /></template>
            </q-input>
            <q-input v-if="profileForm.newPassword" outlined dense v-model="profileForm.confirmPassword" :type="isPwdProfile2 ? 'password' : 'text'" :label="t('dashboard.modals.confirmPassword')" color="primary" bg-color="grey-1" :rules="[val => val === profileForm.newPassword || 'As passwords não coincidem']">
              <template v-slot:prepend><q-icon name="lock_reset" color="grey-7" /></template>
              <template v-slot:append><q-icon :name="isPwdProfile2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdProfile2 = !isPwdProfile2" /></template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-1 q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn flat :label="t('dashboard.modals.btnCancel')" color="grey-7" v-close-popup />
          <q-btn color="primary" :label="t('dashboard.modals.btnSaveProfile')" unelevated style="border-radius: 8px;" @click="saveProfile" :loading="savingProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConvokModal" persistent>
      <q-card style="min-width: 350px; max-width: 480px; width: 100%; border-radius: 20px; overflow: hidden;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="person_add" color="primary" class="q-mr-sm" size="sm" /> {{ t('dashboard.modals.convokTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
        <q-card-section class="bg-grey-2 q-py-sm">
          <q-input v-model="convokSearchQuery" dense outlined :placeholder="t('dashboard.modals.convokSearch')" bg-color="white" color="green-9" clearable>
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-pa-none bg-white" style="max-height: 50vh; overflow-y: auto;">
          <q-list separator>
            <q-item v-for="player in filteredConvokOptions" :key="player.value" clickable v-ripple @click="toggleConvokPlayer(player)" class="q-py-md transition-hover" :class="isConvokSelected(player) ? 'bg-green-1 text-green-9 text-weight-bold' : ''">
              <q-item-section avatar><q-avatar size="32px" :color="isConvokSelected(player) ? 'green-9' : 'grey-3'" :text-color="isConvokSelected(player) ? 'white' : 'dark'"><q-icon :name="isConvokSelected(player) ? 'check' : 'person'" size="18px" /></q-avatar></q-item-section>
              <q-item-section><q-item-label :class="isConvokSelected(player) ? 'text-green-9 text-weight-bolder' : 'text-dark text-weight-bold'">{{ player.label }}</q-item-label></q-item-section>
              <q-item-section side><q-badge :color="isConvokSelected(player) ? 'green-9' : 'grey-3'" :text-color="isConvokSelected(player) ? 'white' : 'dark'" class="text-weight-bold">{{ player.position || 'MED' }}</q-badge></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="between" class="bg-grey-1 q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn flat :label="t('dashboard.modals.btnCancel')" color="grey-7" v-close-popup />
          <q-btn color="primary" :label="t('dashboard.modals.btnInviteSelected')" unelevated style="border-radius: 8px;" @click="confirmConvokPlayers" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSquadModal" persistent>
      <q-card style="min-width: 350px; max-width: 480px; width: 100%; border-radius: 20px; overflow: hidden;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="stars" color="amber-8" class="q-mr-sm" size="sm" /> {{ t('dashboard.modals.squadModalTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
        <q-card-section class="bg-grey-2 q-py-sm">
          <q-input v-model="squadSearchQuery" dense outlined :placeholder="t('dashboard.modals.squadSearch')" bg-color="white" color="green-9" clearable>
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-pa-none bg-white" style="max-height: 50vh; overflow-y: auto;">
          <q-list separator>
            <q-item v-for="player in filteredSquadOptions" :key="player.value" clickable v-ripple @click="toggleSquadPlayer(player)" class="q-py-md transition-hover" :class="isSquadSelected(player) ? 'bg-green-1 text-green-9 text-weight-bold' : ''">
              <q-item-section avatar><q-avatar size="32px" :color="isSquadSelected(player) ? 'green-9' : 'grey-3'" :text-color="isSquadSelected(player) ? 'white' : 'dark'"><q-icon :name="isSquadSelected(player) ? 'check' : 'person'" size="18px" /></q-avatar></q-item-section>
              <q-item-section><q-item-label :class="isSquadSelected(player) ? 'text-green-9 text-weight-bolder' : 'text-dark text-weight-bold'">{{ player.label }}</q-item-label></q-item-section>
              <q-item-section side><q-badge :color="isSquadSelected(player) ? 'green-9' : 'grey-3'" :text-color="isSquadSelected(player) ? 'white' : 'dark'" class="text-weight-bold">{{ player.position || 'MED' }}</q-badge></q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-1 q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn color="primary" :label="t('dashboard.modals.btnDone')" unelevated style="border-radius: 8px;" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showFaqModal">
      <q-card style="min-width: 340px; max-width: 550px; width: 100%; border-radius: 20px; overflow: hidden;">
        <q-card-section class="row items-center bg-dark text-white q-py-md">
          <div class="text-subtitle1 text-weight-bold row items-center"><q-icon name="help_outline" color="green-5" class="q-mr-sm" size="sm" /> {{ t('dashboard.modals.faqTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="grey-4" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-md bg-grey-1 scroll" style="max-height: 65vh;">
          <q-list class="q-gutter-y-sm">
            <q-expansion-item
              v-for="(faq, i) in tm('dashboard.faqs')"
              :key="i"
              group="faqs"
              :icon="faq.icon"
              :label="faq.q"
              header-class="bg-white text-weight-bold text-dark shadow-1 rounded-borders"
            >
              <q-card class="bg-white q-mt-xs">
                <q-card-section class="text-body2 text-grey-8">{{ faq.a }}</q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right" class="bg-grey-2 q-pa-md" style="border-top: 1px solid #e2e8f0;">
          <q-btn color="primary" :label="t('dashboard.modals.btnUnderstood')" unelevated style="border-radius: 8px;" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  
  </q-page>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from 'stores/useAuthStore'
import { useClubStore } from 'stores/useClubStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps(['id'])
const authStore = useAuthStore()
const clubStore = useClubStore()
const $q = useQuasar()
const { t, tm, locale } = useI18n()

const matches = ref([])
const loading = ref(true)
const saving = ref(false)
const balancing = ref(false)
const showCreateModal = ref(false)
let realtimeChannel 

const matchViewMode = ref('next')
const selectedMonth = ref(null)
const showFaqModal = ref(false)

// Lê a preferência guardada na memória para inicializar o dropdown corretamente
const appLangPref = ref(localStorage.getItem('app_lang_pref') || 'system')

// Observa quando o utilizador muda o dropdown do idioma
// Observa quando o utilizador muda o dropdown do idioma
watch(appLangPref, (newPref) => {
  localStorage.setItem('app_lang_pref', newPref)
  
  if (newPref === 'system') {
    const browserLang = (navigator.language || 'en-US').toLowerCase()
    if (browserLang.startsWith('pt')) locale.value = 'pt-PT'
    else if (browserLang.startsWith('es')) locale.value = 'es-ES'
    else if (browserLang.startsWith('fr')) locale.value = 'fr-FR'
    else if (browserLang.startsWith('it')) locale.value = 'it-IT'
    else if (browserLang.startsWith('de')) locale.value = 'de-DE'
    else locale.value = 'en-US'
  } else {
    locale.value = newPref
  }
})

// Dicionário de posições dinâmico
const specificPositionsMap = computed(() => {
  return {
    [tm('positions')[0]]: [{ label: t('specPositions.gr'), value: 'GR' }],
    [tm('positions')[1]]: [
      { label: t('specPositions.dc'), value: 'DC' },
      { label: t('specPositions.ld'), value: 'LD' },
      { label: t('specPositions.le'), value: 'LE' },
      { label: t('specPositions.ad'), value: 'AD' },
      { label: t('specPositions.ae'), value: 'AE' }
    ],
    [tm('positions')[2]]: [
      { label: t('specPositions.mdc'), value: 'MDC' },
      { label: t('specPositions.mc'), value: 'MC' },
      { label: t('specPositions.mco'), value: 'MCO' },
      { label: t('specPositions.md'), value: 'MD' },
      { label: t('specPositions.me'), value: 'ME' }
    ],
    [tm('positions')[3]]: [
      { label: t('specPositions.pl'), value: 'PL' },
      { label: t('specPositions.sa'), value: 'SA' },
      { label: t('specPositions.ed'), value: 'ED' },
      { label: t('specPositions.ee'), value: 'EE' }
    ]
  }
})

// 1. Atualizar o Profile Form
const profileForm = ref({ 
  name: '', position: 'Médio', specific_position: '', preferred_foot: 'Direito',
  newPassword: '', confirmPassword: '', avatarFile: null, previewUrl: null, removeAvatar: false
})

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

function onAvatarSelected(file) {
  if (file) {
    profileForm.value.previewUrl = URL.createObjectURL(file)
  }
}

function openProfileModal() {
  profileForm.value.name = authStore.profile?.name || ''
  
  // Traduzir a posição que vem da BD
  let dbPos = myClubMemberData.value?.position || 'Médio'
  if (dbPos === 'Guarda-Redes') dbPos = tm('positions')[0]
  else if (dbPos === 'Defesa') dbPos = tm('positions')[1]
  else if (dbPos === 'Médio') dbPos = tm('positions')[2]
  else if (dbPos === 'Avançado') dbPos = tm('positions')[3]
  
  profileForm.value.position = dbPos
  profileForm.value.specific_position = myClubMemberData.value?.specific_position || '' 
  profileForm.value.preferred_foot = authStore.profile?.preferred_foot || tm('feet')[0]
  profileForm.value.newPassword = ''
  profileForm.value.confirmPassword = ''
  profileForm.value.avatarFile = null
  profileForm.value.previewUrl = null
  profileForm.value.removeAvatar = false
  isPwdProfile1.value = true
  isPwdProfile2.value = true
  showProfileModal.value = true
}

async function saveProfile() {
  if (profileForm.value.newPassword && profileForm.value.newPassword !== profileForm.value.confirmPassword) {
    $q.notify({ type: 'warning', message: t('dashboard.notify.pwdMismatch') })
    return
  }
  savingProfile.value = true
  try {
    let finalAvatarUrl = authStore.profile?.avatar_url
    if (profileForm.value.removeAvatar) {
      if (authStore.profile?.avatar_url && authStore.profile.avatar_url !== '') {
        const oldFileName = authStore.profile.avatar_url.split('/').pop()
        await supabase.storage.from('avatars').remove([oldFileName])
      }
      finalAvatarUrl = ''
    } else if (profileForm.value.avatarFile) {
      const file = profileForm.value.avatarFile
      const fileExt = file.name.split('.').pop()
      const fileName = `${authStore.user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      finalAvatarUrl = data.publicUrl
    } else if (!finalAvatarUrl && authStore.user?.user_metadata?.avatar_url) {
      finalAvatarUrl = authStore.user.user_metadata.avatar_url
    }

    // Reverter posição ao idioma de base da BD para não causar conflitos
    let internalPos = 'Médio'
    if (profileForm.value.position === tm('positions')[0]) internalPos = 'Guarda-Redes'
    else if (profileForm.value.position === tm('positions')[1]) internalPos = 'Defesa'
    else if (profileForm.value.position === tm('positions')[3]) internalPos = 'Avançado'

    const profileUpdates = { name: profileForm.value.name.trim(), preferred_foot: profileForm.value.preferred_foot, avatar_url: finalAvatarUrl }
    const clubUpdates = { position: internalPos, specific_position: profileForm.value.specific_position }

    const { error: profileError } = await supabase.from('profiles').update(profileUpdates).eq('id', authStore.user.id)
    if (profileError) throw profileError

    const { error: clubError } = await supabase.from('club_members').update(clubUpdates).eq('club_id', props.id).eq('profile_id', authStore.user.id)
    if (clubError) throw clubError
    
    if (authStore.profile) {
      authStore.profile.name = profileUpdates.name
      authStore.profile.preferred_foot = profileUpdates.preferred_foot
      authStore.profile.avatar_url = profileUpdates.avatar_url
    }
    if (myClubMemberData.value) {
      myClubMemberData.value.position = clubUpdates.position
      myClubMemberData.value.specific_position = clubUpdates.specific_position
    } else {
      myClubMemberData.value = {
        position: clubUpdates.position,
        specific_position: clubUpdates.specific_position
      }
    }
    
    if (profileForm.value.newPassword) {
      const { error: passError } = await supabase.auth.updateUser({ password: profileForm.value.newPassword })
      if (passError) throw passError
    }
    localStorage.setItem('profile_completed', 'true')
    $q.notify({ type: 'positive', icon: 'check_circle', message: t('dashboard.notify.profileUpdated') })
    showProfileModal.value = false
  } catch (err) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveProfile') + err.message })
  } finally {
    savingProfile.value = false
  }
}

function clearAvatar() {
  $q.dialog({
    title: t('dashboard.notify.removePhotoTitle'),
    message: t('dashboard.notify.removePhotoMsg'),
    cancel: { label: t('dashboard.modals.btnCancel'), flat: true, color: 'grey-7' },
    ok: { label: t('dashboard.notify.btnYesRemovePhoto'), color: 'negative', unelevated: true },
    persistent: true
  }).onOk(() => {
    profileForm.value.avatarFile = null
    profileForm.value.previewUrl = null
    profileForm.value.removeAvatar = true
  })
}

const computedAvatar = computed(() => {
  if (profileForm.value.removeAvatar) return null;
  if (profileForm.value.previewUrl) return profileForm.value.previewUrl;
  if (authStore.profile?.avatar_url === '') return null; 
  if (authStore.profile?.avatar_url) return authStore.profile.avatar_url;
  if (authStore.user?.user_metadata?.avatar_url) return authStore.user.user_metadata.avatar_url;
  return null;
})

function nextFilter() {
  const currentIndex = filterButtons.value.findIndex(f => f.value === matchViewMode.value)
  const nextIndex = (currentIndex + 1) % filterButtons.value.length
  matchViewMode.value = filterButtons.value[nextIndex].value
}

function prevFilter() {
  const currentIndex = filterButtons.value.findIndex(f => f.value === matchViewMode.value)
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
    
    // Devolve o nome do mês na linguagem nativa do utilizador para melhor UX
    let monthName = date.toLocaleString(locale.value, { month: 'short' }).replace('.', '')
    const cleanMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
    return { label: `${cleanMonth} ${year}`, value: m }
  })
})

const pendingMatchesCount = computed(() => {
  const now = new Date()
  return matches.value.filter(m => (!m.status || m.status === 'aberto') && new Date(m.date) < now).length
})

const votingMatchesCount = computed(() => {
  return matches.value.filter(m => m.status === 'votacao').length
})

const filterButtons = computed(() => {
  const opts = [{ label: t('dashboard.filters.next'), value: 'next' }]
  if (votingMatchesCount.value > 0) {
    opts.push({ label: `${t('dashboard.filters.voting')} (${votingMatchesCount.value})`, value: 'voting' })
  }
  const isManager = clubStore.currentClub?.can_manage_matches || clubStore.currentClub?.is_owner
  if (isManager && pendingMatchesCount.value > 0) {
    opts.push({ label: `${t('dashboard.filters.pending')} (${pendingMatchesCount.value})`, value: 'pending' })
  }
  opts.push({ label: t('dashboard.filters.month'), value: 'month' })
  opts.push({ label: t('dashboard.filters.all'), value: 'all' })
  opts.push({ label: t('dashboard.filters.closed'), value: 'closed' })
  return opts
})

const currentFilterLabel = computed(() => {
  const current = filterButtons.value.find(f => f.value === matchViewMode.value)
  return current ? current.label : 'Filtro'
})

const filteredMatches = computed(() => {
  if (matchViewMode.value === 'all') return matches.value
  const now = new Date()

  if (matchViewMode.value === 'next') {
    let nextMatch = matches.value.find(m => (!m.status || m.status === 'aberto') && new Date(m.date) >= now)
    return nextMatch ? [nextMatch] : []
  }
  
  if (matchViewMode.value === 'voting') return matches.value.filter(m => m.status === 'votacao')
  if (matchViewMode.value === 'pending') return matches.value.filter(m => (!m.status || m.status === 'aberto') && new Date(m.date) < now)
  if (matchViewMode.value === 'month') {
    if (!selectedMonth.value) return []
    return matches.value.filter(m => m.date.startsWith(selectedMonth.value))
  }
  if (matchViewMode.value === 'closed') return matches.value.filter(m => m.status === 'fechado')

  return []
})

const votedMatches = ref([])

async function fetchUserVotes() {
  if (!authStore.user) return
  const { data } = await supabase.from('match_votes').select('match_id').eq('voter_id', authStore.user.id)
  if (data) {
    votedMatches.value = data.map(v => v.match_id)
  }
}

const useDefaultSettings = ref(true)

async function reopenMatch(match) {
  $q.dialog({
    title: t('dashboard.notify.reopenMatchTitle'),
    message: t('dashboard.notify.reopenMatchMsg'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const { error } = await supabase.from('matches').update({ status: 'aberto' }).eq('id', match.id)
    if (error) {
      $q.notify({ type: 'negative', message: t('dashboard.notify.errReopen') + error.message })
    } else {
      $q.notify({ type: 'positive', message: t('dashboard.notify.matchReopened') })
      await fetchMatches() 
    }
  })
}

async function clearAllTeams() {
  $q.dialog({
    title: t('dashboard.notify.clearTeamsTitle'),
    message: t('dashboard.notify.clearTeamsMsg'),
    cancel: { flat: true, color: 'grey-7', label: t('dashboard.modals.btnCancel') },
    persistent: true,
    ok: { label: t('dashboard.notify.btnYesClear'), color: 'negative', unelevated: true }
  }).onOk(async () => {
    balancing.value = true
    const { error } = await supabase.from('match_presences').update({ team: null }).eq('match_id', selectedMatch.value.id)
    if (!error) {
      presences.value.forEach(p => p.team = null)
      $q.notify({ type: 'positive', icon: 'layers_clear', message: t('dashboard.notify.teamsCleared') })
    } else {
      $q.notify({ type: 'negative', message: t('dashboard.notify.errClear') + error.message })
    }
    balancing.value = false
  })
}

// --- LÓGICA DO MODAL DE CONVOCATÓRIA ---
const showConvokModal = ref(false)
const convokSearchQuery = ref('')

const filteredConvokOptions = computed(() => {
  if (!convokSearchQuery.value) return squadOptions.value
  const needle = convokSearchQuery.value.toLowerCase()
  return squadOptions.value.filter(p => (p.label || '').toLowerCase().includes(needle))
})

function isConvokSelected(player) {
  return selectedSquadPlayers.value.some(p => p.value === player.value)
}

function toggleConvokPlayer(player) {
  if (!selectedSquadPlayers.value) selectedSquadPlayers.value = []
  const index = selectedSquadPlayers.value.findIndex(p => p.value === player.value)
  if (index > -1) selectedSquadPlayers.value.splice(index, 1)
  else selectedSquadPlayers.value.push(player)
}

async function confirmConvokPlayers() {
  await addSquadPlayerToMatch()
  showConvokModal.value = false
}

// --- LÓGICA DO MODAL DE TITULARES FIXOS ---
const showSquadModal = ref(false)
const squadSearchQuery = ref('')

const filteredSquadOptions = computed(() => {
  const baseList = allClubPlayersOptions.value.length > 0 ? allClubPlayersOptions.value : squadOptions.value
  if (!squadSearchQuery.value) return baseList
  const needle = squadSearchQuery.value.toLowerCase()
  return baseList.filter(p => (p.label || '').toLowerCase().includes(needle))
})

function isSquadSelected(player) {
  if (!clubSettings.value.default_squad) return false
  return clubSettings.value.default_squad.some(p => (typeof p === 'object' ? p.value === player.value : p === player.value))
}

function toggleSquadPlayer(player) {
  if (!clubSettings.value.default_squad) clubSettings.value.default_squad = []
  
  const index = clubSettings.value.default_squad.findIndex(p => (typeof p === 'object' ? p.value === player.value : p === player))
  
  if (index > -1) {
    clubSettings.value.default_squad.splice(index, 1)
  } else {
    if (clubSettings.value.default_squad.length >= clubSettings.value.default_max_players) {
      $q.notify({ type: 'warning', message: t('dashboard.notify.squadLimitWarn', { limit: clubSettings.value.default_max_players }) })
      return
    }
    clubSettings.value.default_squad.push(player)
  }
}

const myClubMemberData = ref(null)

onMounted(async () => {
  if (!authStore.user) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      authStore.user = user
      await authStore.fetchProfile(user.id)
    }
  }
  if (authStore.user && !authStore.profile) {
    await authStore.fetchProfile(authStore.user.id)
  }

  if (authStore.user) {
    const { data } = await supabase.from('club_members').select('role, is_owner, can_manage_finances, can_manage_teams, can_manage_matches, position, specific_position, clubs(id, name, invite_code)').eq('club_id', props.id).eq('profile_id', authStore.user.id).single()
      
    if (data) {
      myClubMemberData.value = data 
      clubStore.setClub({
        id: data.clubs.id,
        name: data.clubs.name,
        invite_code: data.clubs.invite_code, 
        role: data.role,
        is_owner: data.is_owner,
        can_manage_finances: data.can_manage_finances,
        can_manage_teams: data.can_manage_teams,
        can_manage_matches: data.can_manage_matches
      })
    } else {
      clubStore.setClub(null) 
      router.push('/selector')
      return 
    }
  }
  
  await fetchClubSettings()
  await fetchMatches()
  await fetchUserVotes()
  await fetchPendingRequests()

  const isNewAccount = authStore.user && (new Date() - new Date(authStore.user.created_at) < 120000)
  const isMissingData = !authStore.profile?.name || !myClubMemberData.value?.position || !authStore.profile?.preferred_foot
  const hasCompletedProfile = localStorage.getItem('profile_completed') === 'true'

  if ((isNewAccount && !hasCompletedProfile) || isMissingData) {
    openProfileModal()
    if (!profileForm.value.name && authStore.user?.user_metadata?.full_name) {
      profileForm.value.name = authStore.user.user_metadata.full_name
    }
  }

  realtimeChannel = supabase
    .channel('presences-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'match_presences' }, async (payload) => {
        await fetchMatches(true)
        if (showPresencesModal.value && selectedMatch.value) {
          const isCurrentMatch = payload.new?.match_id === selectedMatch.value.id || payload.old?.match_id === selectedMatch.value.id
          if (isCurrentMatch) openPresencesModal(selectedMatch.value)
        }
    }).subscribe()
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
  const { data, error } = await supabase.from('club_members').select('profile_id, profiles(name)').eq('club_id', props.id).eq('status', 'pending')
       
  if (error) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errLoadRequests') + error.message })
  } else if (data && data.length > 0) {
    pendingRequests.value = data
    showRequestsModal.value = true
  } else {
    pendingRequests.value = []
  }
}

async function handleRequest(profileId, action) {
  if (action === 'approved') {
    const { error } = await supabase.from('club_members').update({ status: 'approved' }).eq('club_id', props.id).eq('profile_id', profileId)
    if (!error) $q.notify({ type: 'positive', message: t('dashboard.notify.playerAccepted') })
  } else {
    const { error } = await supabase.from('club_members').delete().eq('club_id', props.id).eq('profile_id', profileId)
    if (!error) $q.notify({ type: 'info', message: t('dashboard.notify.requestRejected') })
  }
  await fetchPendingRequests()
}

function applyDefaults(isToggled) {
  if (isToggled) {
    newMatch.value.location = clubSettings.value?.default_location || ''
    newMatch.value.max_players = clubSettings.value?.default_max_players || 14
    newMatch.value.starters_per_team = clubSettings.value?.default_starters_per_team || 11
    newMatch.value.price_per_player = clubSettings.value?.default_price || 5.00
    newMatch.value.team_a_name = clubSettings.value?.default_team_a_name || 'Equipa A' 
    newMatch.value.team_b_name = clubSettings.value?.default_team_b_name || 'Equipa B' 
    
    if (!newMatch.value.id) {
      newMatch.value.date = getNextRecurringDate(clubSettings.value?.recurring_day_of_week, clubSettings.value?.recurring_time)
    }
  }
}

function openCreateMatch() {
  useDefaultSettings.value = true
  applyToFuture.value = false 
  newMatch.value = { 
     id: null,
     date: getNextRecurringDate(clubSettings.value?.recurring_day_of_week, clubSettings.value?.recurring_time),
     location: clubSettings.value?.default_location || '',
     max_players: clubSettings.value?.default_max_players || 14,
     price_per_player: clubSettings.value?.default_price || 5.00,
     team_a_name: clubSettings.value?.default_team_a_name || 'Equipa A', 
     team_b_name: clubSettings.value?.default_team_b_name || 'Equipa B'  
   }
   showCreateModal.value = true
}

function openEditMatch(match) {
  useDefaultSettings.value = false
  applyToFuture.value = false 
  
  let localIso = ''
  if (match.date) {
    const d = new Date(match.date)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    localIso = d.toISOString().slice(0, 16)
  }
  
  newMatch.value = { ...match, date: localIso }
  showCreateModal.value = true
}

function sendAvailabilityReminder(match) {
  if (match.confirmedCount === 0) {
    $q.notify({ type: 'warning', message: t('dashboard.notify.noConvokedAlerts') })
    return
  }

  $q.dialog({
    title: t('dashboard.notify.askConfirmTitle'),
    message: t('dashboard.notify.askConfirmMsg', { count: match.confirmedCount }),
    cancel: { flat: true, color: 'grey-7', label: t('dashboard.modals.btnCancel') },
    persistent: true,
    ok: { label: t('dashboard.notify.btnSendAlerts'), color: 'blue-8', unelevated: true }
  }).onOk(() => {
    notifyMatchPlayers(match.id, t('dashboard.notify.pushTitleConfirm'), t('dashboard.notify.pushMsgConfirm'))
    $q.notify({ type: 'positive', icon: 'notifications_active', message: t('dashboard.notify.alertSent') })
  })
}

async function saveMatch() {
  saving.value = true
  const targetDateStr = new Date(newMatch.value.date).toLocaleDateString('pt-PT')
  
  const conflict = matches.value.some(m => m.id !== newMatch.value.id && new Date(m.date).toLocaleDateString('pt-PT') === targetDateStr)
  
  if (conflict) {
    $q.dialog({
      title: t('dashboard.notify.dayOccupiedTitle'),
      message: t('dashboard.notify.dayOccupiedMsg'),
      cancel: { label: t('dashboard.modals.btnCancel'), flat: true, color: 'grey' },
      ok: { label: t('dashboard.notify.btnYesSchedule'), color: 'negative', unelevated: true },
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
  const dateToSave = new Date(newMatch.value.date).toISOString()
  
  if (newMatch.value.id) {
    if (applyToFuture.value) {
      const { error } = await supabase.from('matches').update({
        date: dateToSave, location: newMatch.value.location, max_players: newMatch.value.max_players, 
        starters_per_team: newMatch.value.starters_per_team, price_per_player: newMatch.value.price_per_player
      }).eq('id', newMatch.value.id)
      
      await supabase.from('matches').update({
        location: newMatch.value.location, max_players: newMatch.value.max_players, price_per_player: newMatch.value.price_per_player
      }).eq('club_id', clubStore.currentClub.id).eq('status', 'aberto').gt('date', dateToSave)
      
      if (!error) {
        $q.notify({ type: 'positive', message: t('dashboard.notify.matchUpdatedFuture') })
        await fetchMatches(true) 
      } else {
        $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
      }
    } else {
      const { error } = await supabase.from('matches').update({
        date: dateToSave, location: newMatch.value.location, max_players: newMatch.value.max_players, price_per_player: newMatch.value.price_per_player
      }).eq('id', newMatch.value.id)
      
      if (!error) {
        $q.notify({ type: 'positive', message: t('dashboard.notify.matchUpdated') })
        await fetchMatches(true)
      } else {
        $q.notify({ type: 'negative', message: 'Erro: ' + error.message })
      }
    }
    showCreateModal.value = false
  } else {
    const matchToInsert = { 
      date: dateToSave, location: newMatch.value.location, max_players: newMatch.value.max_players, 
      starters_per_team: newMatch.value.starters_per_team, price_per_player: newMatch.value.price_per_player,
      team_a_name: newMatch.value.team_a_name, team_b_name: newMatch.value.team_b_name, club_id: clubStore.currentClub.id, status: 'aberto' 
    }
    
    const { data: newMatchData, error } = await supabase.from('matches').insert([matchToInsert]).select().single()

    if (!error) {
      if (useDefaultSettings.value && clubSettings.value.default_squad?.length > 0) {
        const autoPresences = clubSettings.value.default_squad.map(p => ({
          match_id: newMatchData.id, status: 'confirmed', profile_id: p.type === 'real' ? p.value : null, virtual_player_id: p.type === 'virtual' ? p.value : null
        }))
        await supabase.from('match_presences').insert(autoPresences)
      }
      $q.notify({ type: 'positive', message: t('dashboard.notify.matchCreated') })
      showCreateModal.value = false
      await fetchMatches(true)
    } else {
      $q.notify({ type: 'negative', message: t('dashboard.notify.errCreate') + error.message })
    }
  }
  saving.value = false
}

async function deleteMatch(match) {
  $q.dialog({
    title: t('dashboard.notify.deleteMatchTitle'),
    message: t('dashboard.notify.deleteMatchMsg'),
    cancel: { flat: true, color: 'grey', label: t('dashboard.modals.btnCancel') },
    persistent: true,
    color: 'negative',
    ok: { label: t('dashboard.notify.btnYesDelete'), color: 'negative', unelevated: true }
  }).onOk(async () => {
    saving.value = true;
    await supabase.from('match_presences').delete().eq('match_id', match.id);
    const { data, error } = await supabase.from('matches').delete().eq('id', match.id).select();
    if (error) {
      $q.notify({ type: 'negative', message: 'Erro ao apagar: ' + error.message });
    } else if (data && data.length === 0) {
      $q.notify({ type: 'warning', icon: 'security', message: t('dashboard.notify.blockedSecurity') });
    } else {
      $q.notify({ type: 'positive', icon: 'delete', message: t('dashboard.notify.matchDeleted') });
      await fetchMatches(true); 
    }
    saving.value = false;
  })
}

async function fetchMatches(silent = false) {
  if (!clubStore.currentClub) return
  if (!silent) loading.value = true
  const { data, error } = await supabase.from('matches').select('*, match_presences(id, status, profile_id)').eq('club_id', clubStore.currentClub.id).order('date', { ascending: true })

  if (!error) {
    matches.value = data.map(m => {
      const confirmed = m.match_presences ? m.match_presences.filter(p => p.status === 'confirmed').length : 0
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
    data.default_team_a_name = data.default_team_a_name || 'Equipa A'
    data.default_team_b_name = data.default_team_b_name || 'Equipa B'
    clubSettings.value = { ...clubSettings.value, ...data }
  }
}

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString(locale.value, { dateStyle: 'short', timeStyle: 'short' })
}

function clearCurrentClub() {
  clubStore.setClub(null)
}

const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  clubStore.setClub(null)
  router.push('/login')
}

// VARIÁVEIS DO QUADRO TÁTICO
const summaryTab = ref('lista')
const viewTeam = ref('A')
const selectedFormation = ref('4-3-3')

// Agrupa e ordena os jogadores por setores
function getTeamSectors(players) {
  const sectors = {
    [tm('positions')[0]]: [],
    [tm('positions')[1]]: [],
    [tm('positions')[2]]: [],
    [tm('positions')[3]]: []
  }

  players.forEach(p => {
    let rawPos = p.profiles?.position || p.virtual_players?.position || 'Médio'
    if (rawPos === 'Guarda-Redes') rawPos = tm('positions')[0]
    else if (rawPos === 'Defesa') rawPos = tm('positions')[1]
    else if (rawPos === 'Médio') rawPos = tm('positions')[2]
    else if (rawPos === 'Avançado') rawPos = tm('positions')[3]
    
    if (sectors[rawPos]) sectors[rawPos].push(p)
  })

  Object.keys(sectors).forEach(key => {
    sectors[key].sort((a, b) => {
      const ovrA = a.profiles?.overall || a.virtual_players?.overall || 70
      const ovrB = b.profiles?.overall || b.virtual_players?.overall || 70
      return ovrB - ovrA
    })
  })

  return Object.entries(sectors).filter(entry => entry[1].length > 0).map(entry => ({ name: entry[0], players: entry[1] }))
}

const showPresencesModal = ref(false)
const selectedMatch = ref(null)
const presences = ref([])
const loadingPresences = ref(false)
const showTeamsSummaryModal = ref(false)

const clubSettings = ref({ 
  default_max_players: 14, default_price: 5, monthly_price_per_game: 4, default_location: '', 
  recurring_day_of_week: 2, recurring_time: '21:00',
  attribute_mode: 'numeric', hide_attributes_from_members: false,
  enable_voting: true, single_team_mode: false, detailed_attributes: false,
  default_starters_per_team: 11, default_team_a_name: 'Equipa A', default_team_b_name: 'Equipa B', default_squad: []
})

const newMatch = ref({ 
  id: null, date: '', location: '', max_players: 14, price_per_player: 5.00,
  starters_per_team: 11, team_a_name: 'Equipa A', team_b_name: 'Equipa B' 
})

const matchStarters = computed(() => selectedMatch.value?.starters_per_team || clubSettings.value?.default_starters_per_team || 11)

function getSummaryStats(players) {
  const totalOVR = players.reduce((sum, p) => sum + Number(p.profiles?.overall || p.virtual_players?.overall || 70), 0)
  const avgOVR = players.length > 0 ? Math.round(totalOVR / players.length) : 0
  return { players, avgOVR, count: players.length }
}

const singleTeamDistribution = computed(() => {
  let pool = presences.value.filter(p => p.status === 'confirmed' && p.team !== 'B');
  let bench = presences.value.filter(p => p.status === 'confirmed' && p.team === 'B');
  pool.sort((a, b) => {
     const ovrA = a.profiles?.overall || a.virtual_players?.overall || 70;
     const ovrB = b.profiles?.overall || b.virtual_players?.overall || 70;
     return ovrB - ovrA;
  });
  const maxStarters = matchStarters.value;
  let starters = [];
  if (!selectedFormation.value) {
     starters = pool.splice(0, maxStarters);
     bench.push(...pool);
     return { starters, bench };
  }
  const parts = selectedFormation.value.split('-').map(Number);
  let d_req = parts[0];
  let a_req = parts[parts.length - 1];
  let m_req = parts.slice(1, parts.length - 1).reduce((sum, val) => sum + val, 0);

  function getPlayerGenPos(p) { return p.profiles?.position || p.virtual_players?.position || 'Médio'; }

  const extractPlayers = (count, prefGen, altGen = []) => {
    let selected = [];
    for (let i = 0; i < pool.length && selected.length < count; i++) {
      if (pool[i].team === 'A' && getPlayerGenPos(pool[i]) === prefGen) { selected.push(pool.splice(i, 1)[0]); i--; }
    }
    for (let i = 0; i < pool.length && selected.length < count; i++) {
      if (getPlayerGenPos(pool[i]) === prefGen) { selected.push(pool.splice(i, 1)[0]); i--; }
    }
    for (let alt of altGen) {
      for (let i = 0; i < pool.length && selected.length < count; i++) {
        if (getPlayerGenPos(pool[i]) === alt) { selected.push(pool.splice(i, 1)[0]); i--; }
      }
    }
    for (let i = 0; i < pool.length && selected.length < count; i++) {
      if (pool[i].team === 'A') { selected.push(pool.splice(i, 1)[0]); i--; }
    }
    while (selected.length < count && pool.length > 0) { selected.push(pool.shift()); }
    return selected;
  };

  let grLine = extractPlayers(1, 'Guarda-Redes', ['Defesa']);
  let defLine = extractPlayers(d_req, 'Defesa', ['Médio']);
  let attLine = extractPlayers(a_req, 'Avançado', ['Médio']);
  let midLine = extractPlayers(m_req, 'Médio', ['Defesa', 'Avançado']);
  starters = [...grLine, ...defLine, ...midLine, ...attLine];

  while (starters.length < maxStarters && pool.length > 0) { starters.push(pool.shift()); }
  bench.push(...pool); 
  return { starters, bench };
});

const teamASummary = computed(() => {
  if (clubSettings.value?.single_team_mode) return getSummaryStats(singleTeamDistribution.value.starters);
  return getSummaryStats(presences.value.filter(p => p.status === 'confirmed' && p.team === 'A'));
});
const teamBSummary = computed(() => {
  if (clubSettings.value?.single_team_mode) return getSummaryStats(singleTeamDistribution.value.bench);
  return getSummaryStats(presences.value.filter(p => p.status === 'confirmed' && p.team === 'B'));
});

const tacticalMap = {
  horizontal: {
    'LE': 1, 'AE': 1, 'ME': 1, 'EE': 1,
    'DC': 2, 'MDC': 2, 'MC': 2, 'MCO': 2, 'SA': 2, 'PL': 2, 'GR': 2,
    'LD': 3, 'AD': 3, 'MD': 3, 'ED': 3
  },
  vertical: {
    'PL': 1, 'SA': 1, 'EE': 2, 'MCO': 2, 'ED': 2,
    'ME': 3, 'MC': 3, 'MD': 3, 'AE': 3, 'AD': 3,
    'MDC': 4, 'LE': 5, 'DC': 5, 'LD': 5, 'GR': 6
  }
}

const availableFormations = computed(() => {
  const outfield = matchStarters.value - 1; 
  let allForms = [];
  const minD = Math.max(1, Math.floor(outfield * 0.2)); const maxD = Math.min(outfield - 2, 5);              
  const minM = Math.max(1, Math.floor(outfield * 0.2)); const maxM = Math.min(outfield - 1, 5); 
  const minA = 0; const maxA = Math.min(outfield - 2, 4); 

  for (let d = minD; d <= maxD; d++) {
    for (let m = minM; m <= maxM; m++) {
      let a = outfield - d - m;
      if (a >= minA && a <= maxA) allForms.push({ label: `${d}-${m}-${a}`, value: `${d}-${m}-${a}` });
    }
  }
  if (outfield === 10) {
    allForms.push({ label: '4-2-3-1', value: '4-2-3-1' });
    allForms.push({ label: '4-1-2-1-2', value: '4-1-2-1-2' });
  }
  return allForms.sort((a,b) => b.value.localeCompare(a.value));
});

watch(availableFormations, (newForms) => {
  if (!newForms.find(f => f.value === selectedFormation.value) && newForms.length > 0) {
    selectedFormation.value = newForms[0].value;
  }
});

function getPlayerSpecificPos(p) { return p.profiles?.specific_position || p.virtual_players?.specific_position || null; }
function getPlayerGenPos(p) { return p.profiles?.position || p.virtual_players?.position || 'Médio'; }

function getFormation(players, formationStr = null) {
  if (!players || players.length === 0) return [];
  if (clubSettings.value?.single_team_mode && formationStr) {
    let pool = [...players].sort((a, b) => {
       const ovrA = a.profiles?.overall || a.virtual_players?.overall || 70;
       const ovrB = b.profiles?.overall || b.virtual_players?.overall || 70;
       return ovrB - ovrA; 
    });
    
    const extractPlayers = (count, prefGen, altGen = []) => {
      let selected = [];
      for (let i = 0; i < pool.length && selected.length < count; i++) {
        if (getPlayerGenPos(pool[i]) === prefGen) { selected.push(pool.splice(i, 1)[0]); i--; }
      }
      for (let alt of altGen) {
        for (let i = 0; i < pool.length && selected.length < count; i++) {
          if (getPlayerGenPos(pool[i]) === alt) { selected.push(pool.splice(i, 1)[0]); i--; }
        }
      }
      while (selected.length < count && pool.length > 0) { selected.push(pool.shift()); }
      return selected;
    };

    const parts = formationStr.split('-').map(Number);
    let grLine = extractPlayers(1, 'Guarda-Redes', ['Defesa']);
    let defLine = extractPlayers(parts[0], 'Defesa', ['Médio']);
    let attLine = extractPlayers(parts[parts.length - 1], 'Avançado', ['Médio']);
    
    let layoutLines = { 1: attLine, 5: defLine, 6: grLine };
    
    if (parts.length === 3) {
      layoutLines[3] = extractPlayers(parts[1], 'Médio', ['Defesa', 'Avançado']);
    } else if (parts.length === 4) {
      layoutLines[4] = extractPlayers(parts[1], 'Médio', ['Defesa']);
      layoutLines[2] = extractPlayers(parts[2], 'Médio', ['Avançado', 'Defesa']);
    } else if (parts.length === 5) {
      layoutLines[4] = extractPlayers(parts[1], 'Médio', ['Defesa']);
      layoutLines[3] = extractPlayers(parts[2], 'Médio', ['Defesa', 'Avançado']);
      layoutLines[2] = extractPlayers(parts[3], 'Médio', ['Avançado']);
    }

    let finalLayout = [];
    for (let i = 1; i <= 6; i++) {
       if (layoutLines[i] && layoutLines[i].length > 0) {
          layoutLines[i].forEach(p => { p.sortX = tacticalMap.horizontal[getPlayerSpecificPos(p)] || 2; });
          layoutLines[i].sort((a, b) => a.sortX - b.sortX);
          finalLayout.push(layoutLines[i]);
       }
    }
    return finalLayout;
  }
  
  const lines = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  players.forEach(p => {
    const spec = getPlayerSpecificPos(p); const gen = getPlayerGenPos(p);
    const fallback = gen === 'Avançado' ? 'PL' : (gen === 'Defesa' ? 'DC' : (gen === 'Guarda-Redes' ? 'GR' : 'MC')); 
    const y = tacticalMap.vertical[spec || fallback] || 3;
    lines[y].push({ ...p, sortX: tacticalMap.horizontal[spec || fallback] || 2 });
  })
  Object.keys(lines).forEach(k => lines[k].sort((a, b) => a.sortX - b.sortX))
  return [lines[1], lines[2], lines[3], lines[4], lines[5], lines[6]].filter(line => line.length > 0)
}

function getFormationReversed(players) {
  if (!players || players.length === 0) return []
  const getSector = (p) => {
    const rawPos = p.profiles?.position || p.virtual_players?.position || 'M'
    const letter = rawPos.trim().toUpperCase().charAt(0)
    if (letter === 'G') return 'GR'
    if (letter === 'D') return 'DEF'
    if (letter === 'A') return 'AV'
    return 'MED'
  }
  const gr = players.filter(p => getSector(p) === 'GR')
  const def = players.filter(p => getSector(p) === 'DEF')
  const med = players.filter(p => getSector(p) === 'MED')
  const av = players.filter(p => getSector(p) === 'AV')
  return [gr, def, med, av].filter(line => line.length > 0)
}

async function joinMatch(match) {
  if (!authStore.user) return
  const matchDate = new Date(match.date)
  const matchMonth = matchDate.getMonth() + 1 
  const matchYear = matchDate.getFullYear()

  const { data: memberStatus } = await supabase.from('club_members').select('billing_mode').eq('club_id', props.id).eq('profile_id', authStore.user.id).single()

  let shouldDefaultToPaid = false
  if (memberStatus?.billing_mode === 'monthly') {
    const { data: monthCheck } = await supabase.from('club_monthly_payments').select('paid').eq('club_id', props.id).eq('profile_id', authStore.user.id).eq('month', matchMonth).eq('year', matchYear).maybeSingle()
    if (monthCheck?.paid === true) shouldDefaultToPaid = true 
  }

  const { count } = await supabase.from('match_presences').select('*', { count: 'exact', head: true }).eq('match_id', match.id).eq('status', 'confirmed')

  if (count >= match.max_players) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.capacityFull', { count: match.max_players }) })
    return 
  }

  const { error } = await supabase.from('match_presences').insert([{ match_id: match.id, profile_id: authStore.user.id, status: 'confirmed', paid: shouldDefaultToPaid }])
  if (!error) {
    $q.notify({ type: 'positive', message: shouldDefaultToPaid ? t('dashboard.notify.paymentConfirmed') : t('dashboard.notify.playersConvoked', { count: 1 }) })
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
  
  const { data, error } = await supabase.from('match_presences').select('id, team, guest_name, goals, assists, profiles(name), virtual_players(name)').eq('match_id', match.id).eq('status', 'confirmed').not('team', 'is', null)
    
  if (!error && data) {
    const teamA = []
    const teamB = []
    data.forEach(p => {
      const name = p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Desconhecido'
      const playerObj = { id: p.id, name, goals: p.goals || 0, assists: p.assists || 0, team: p.team }
      if (p.team === 'A' || clubSettings.value?.single_team_mode) teamA.push(playerObj)
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

    for (const p of allPlayers) {
      const goalsVal = parseInt(p.goals) || 0
      const assistsVal = parseInt(p.assists) || 0
      const { error: pError } = await supabase.from('match_presences').update({ goals: goalsVal, assists: assistsVal }).eq('id', p.id)
      if (pError) {
        $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + ` ${p.name}: ${pError.message}` })
        saving.value = false
        return 
      }
    }

    const finalScoreA = teamAPlayers.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)
    const finalScoreB = teamBPlayers.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)

  const nextStatus = clubSettings.value?.enable_voting === true ? 'votacao' : 'fechado'

  if (nextStatus === 'votacao') {
    notifyMatchPlayers(matchToClose.value.id, t('dashboard.notify.pushTitleResults'), t('dashboard.notify.pushMsgResults'));
  }
    const { error: matchError } = await supabase.from('matches').update({ status: nextStatus, team_a_goals: finalScoreA, team_b_goals: finalScoreB }).eq('id', matchToClose.value.id)

    if (matchError) {
      $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + matchError.message })
    } else {
      $q.notify({ 
         type: 'positive', 
         icon: nextStatus === 'votacao' ? 'how_to_vote' : 'sports_score', 
         message: nextStatus === 'votacao' ? t('dashboard.notify.pollsClosed') : t('dashboard.notify.matchUpdated') 
       })
      showCloseModal.value = false
      await fetchMatches(true) 
    }
  } catch {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') })
  } finally {
    saving.value = false
  }
}

async function saveLiveStats() {
  if (!matchToClose.value) return
  saving.value = true
  
  try {
    const allPlayers = [...(matchPlayersStats.value.teamA || []), ...(matchPlayersStats.value.teamB || [])]
    for (const p of allPlayers) {
      const goalsVal = parseInt(p.goals) || 0
      const assistsVal = parseInt(p.assists) || 0
      await supabase.from('match_presences').update({ goals: goalsVal, assists: assistsVal }).eq('id', p.id)
    }
    const finalScoreA = matchPlayersStats.value.teamA.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)
    const finalScoreB = matchPlayersStats.value.teamB.reduce((sum, p) => sum + (parseInt(p.goals) || 0), 0)
    await supabase.from('matches').update({ team_a_goals: finalScoreA, team_b_goals: finalScoreB }).eq('id', matchToClose.value.id)
    $q.notify({ type: 'positive', icon: 'sync', message: t('dashboard.notify.statsSavedLive') })
  } catch {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') })
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
  
  const { data, error } = await supabase.from('match_presences').select('id, profile_id, virtual_player_id, guest_name, profiles(name), virtual_players(name)').eq('match_id', match.id).eq('status', 'confirmed')
  
  if (data && !error) {
    votingPlayers.value = data.map(p => ({
      id: p.id, 
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
    $q.notify({ type: 'warning', message: t('dashboard.notify.errVoteMvp') })
    return
  }
  
  savingVotes.value = true
  try {
    const mvpPlayer = votingPlayers.value.find(p => p.id === selectedMVP.value)
    const { error: mvpError } = await supabase.from('match_votes').insert([{
      match_id: votingMatch.value.id, voter_id: authStore.user.id, mvp_profile_id: mvpPlayer.profile_id || null, mvp_virtual_id: mvpPlayer.virtual_player_id || null
    }])

    if (mvpError) {
      if (mvpError.code === '23505') {
        $q.notify({ type: 'warning', message: t('dashboard.notify.errAlreadyVoted') })
        showVotingModal.value = false
        return
      }
      throw mvpError
    }

    const ratingsPayload = votingPlayers.value.filter(p => p.profile_id || p.virtual_player_id).map(p => ({
        match_id: votingMatch.value.id, voter_id: authStore.user.id, target_profile_id: p.profile_id || null, target_virtual_id: p.virtual_player_id || null, rating: p.rating
    }))
    
    const { error: ratingsError } = await supabase.from('match_player_ratings').insert(ratingsPayload)
    if (ratingsError) throw ratingsError

    votedMatches.value.push(votingMatch.value.id)
    $q.notify({ type: 'positive', icon: 'how_to_vote', message: t('dashboard.notify.votesRegistered') })
    showVotingModal.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + error.message, timeout: 5000 })
  } finally {
    savingVotes.value = false
  }
}

async function closeVoting(match) {
  $q.dialog({
    title: t('dashboard.notify.closePollsTitle'),
    message: t('dashboard.notify.closePollsMsg'),
    cancel: { flat: true, color: 'grey', label: t('dashboard.modals.btnCancel') },
    persistent: true,
    ok: { label: t('dashboard.notify.btnClosePollsAction'), color: 'negative', unelevated: true }
  }).onOk(async () => {
    saving.value = true
    const { data: mvpVotes } = await supabase.from('match_votes').select('*').eq('match_id', match.id)
    const { data: ratings } = await supabase.from('match_player_ratings').select('*').eq('match_id', match.id)
    const { data: presences } = await supabase.from('match_presences').select('id, profile_id, virtual_player_id').eq('match_id', match.id)
    
    let mvpCounts = {}
    if (mvpVotes) {
      mvpVotes.forEach(v => {
        const target = v.mvp_profile_id ? `p_${v.mvp_profile_id}` : (v.mvp_virtual_id ? `v_${v.mvp_virtual_id}` : null)
        if (target) mvpCounts[target] = (mvpCounts[target] || 0) + 1
      })
    }
    
    let topMvpTarget = null; let maxVotes = 0;
    for (const [key, val] of Object.entries(mvpCounts)) {
      if (val > maxVotes) { maxVotes = val; topMvpTarget = key; }
    }

    let ratingSums = {}; let ratingCounts = {};
    if (ratings) {
      ratings.forEach(r => {
        const target = r.target_profile_id ? `p_${r.target_profile_id}` : (r.target_virtual_id ? `v_${r.target_virtual_id}` : null)
        if (target) { ratingSums[target] = (ratingSums[target] || 0) + r.rating; ratingCounts[target] = (ratingCounts[target] || 0) + 1; }
      })
    }

    for (const p of presences) {
      const targetKey = p.profile_id ? `p_${p.profile_id}` : (p.virtual_player_id ? `v_${p.virtual_player_id}` : null)
      const is_mvp = targetKey === topMvpTarget && topMvpTarget !== null
      const avg = ratingCounts[targetKey] ? (ratingSums[targetKey] / ratingCounts[targetKey]).toFixed(2) : 0
      await supabase.from('match_presences').update({ is_mvp: is_mvp, rating_average: avg }).eq('id', p.id)
    }

    await supabase.from('matches').update({ status: 'fechado' }).eq('id', match.id)
    
    $q.notify({ type: 'positive', icon: 'workspace_premium', message: t('dashboard.notify.pollsClosed') })
    await fetchMatches(true)
    
    notifyMatchPlayers(match.id, t('dashboard.notify.pushTitleResults'), t('dashboard.notify.pushMsgResults'));
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

  const { data, error } = await supabase.from('match_presences').select('id, goals, assists, rating_average, is_mvp, team, profiles(name), virtual_players(name), guest_name').eq('match_id', match.id).eq('status', 'confirmed')

  if (data && !error) {
    matchResultsData.value = data.map(p => ({
      id: p.id, name: p.profiles?.name || p.virtual_players?.name || p.guest_name || 'Desconhecido',
      team: p.team, goals: p.goals || 0, assists: p.assists || 0, rating: Number(p.rating_average) || 0, isMvp: p.is_mvp
    }))
    
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
    let players = presences.value.filter(p => p.status === 'confirmed').map(p => {
      const ovr = p.profiles?.overall || p.virtual_players?.overall || 70
      const pos = p.profiles?.position || p.virtual_players?.position || 'Médio'
      return { ...p, ovr: Number(ovr), position: pos }
    })

    const sectors = {}
    players.forEach(p => {
      if (!sectors[p.position]) sectors[p.position] = []
      sectors[p.position].push(p)
    })

    let teamA = []; let teamB = []; let sumA = 0; let sumB = 0; let leftovers = [];

    for (const pos in sectors) {
      let sectorPlayers = sectors[pos].sort((a, b) => b.ovr - a.ovr)
      while (sectorPlayers.length >= 2) {
        const p1 = sectorPlayers.shift(); const p2 = sectorPlayers.shift();
        if (Math.random() > 0.5) { teamA.push(p1); sumA += p1.ovr; teamB.push(p2); sumB += p2.ovr; } 
        else { teamA.push(p2); sumA += p2.ovr; teamB.push(p1); sumB += p1.ovr; }
      }
      if (sectorPlayers.length === 1) leftovers.push(sectorPlayers[0])
    }

    leftovers.sort((a, b) => b.ovr - a.ovr)
    const maxTeamSize = Math.ceil((teamA.length + teamB.length + leftovers.length) / 2) 

    for (const player of leftovers) {
      if (teamA.length >= maxTeamSize) { teamB.push(player); sumB += player.ovr } 
      else if (teamB.length >= maxTeamSize) { teamA.push(player); sumA += player.ovr } 
      else {
        if (sumA <= sumB) { teamA.push(player); sumA += player.ovr } 
        else { teamB.push(player); sumB += player.ovr }
      }
    }

    for (const p of teamA) await supabase.from('match_presences').update({ team: 'A' }).eq('id', p.id)
    for (const p of teamB) await supabase.from('match_presences').update({ team: 'B' }).eq('id', p.id)

    $q.notify({ type: 'positive', icon: 'shuffle', message: t('dashboard.notify.teamsSorted') })
    await openPresencesModal(selectedMatch.value)
  } catch {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errGenerateTeams') })
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
  
  const { data: presData, error } = await supabase.from('match_presences').select('id, status, paid, team, created_at, guest_name, virtual_player_id, profile_id, profiles(name), virtual_players(name, overall, position, specific_position)').eq('match_id', match.id)
  const { data: membersData } = await supabase.from('club_members').select('profile_id, position, specific_position, overall, pro_overall').eq('club_id', props.id)

  if (!error && presData) {
    presences.value = presData.map(p => {
       if (p.profile_id) {
           const cm = membersData?.find(m => m.profile_id === p.profile_id)
           p.profiles = p.profiles || {} 
           const isPro = clubSettings.value?.detailed_attributes && cm?.position !== 'Guarda-Redes'
           p.profiles.overall = isPro ? (cm?.pro_overall || 70) : (cm?.overall || 70)
           p.profiles.position = cm?.position || 'Médio'
           p.profiles.specific_position = cm?.specific_position || ''
       }
       return p
    })
  }
  
  await loadAvailableSquad()
  loadingPresences.value = false
}

async function loadAvailableSquad() {
  const currentInscribedProfileIds = presences.value.map(p => p.profile_id).filter(Boolean)
  const currentInscribedVirtualIds = presences.value.map(p => p.virtual_player_id).filter(Boolean)
  const options = []

  const { data: reals } = await supabase.from('club_members').select('profile_id, position, specific_position').eq('club_id', props.id).eq('status', 'approved')

  if (reals) {
    for (const r of reals) {
      if (!currentInscribedProfileIds.includes(r.profile_id)) {
        const { data: prof } = await supabase.from('profiles').select('name').eq('id', r.profile_id).single()
        if (prof) {
          options.push({ 
            label: prof.name, value: r.profile_id, type: 'real', position: r.specific_position || r.position || 'MED'
          })
        }
      }
    }
  }

  const { data: virtuals } = await supabase.from('virtual_players').select('id, name, position, specific_position').eq('club_id', props.id)

  if (virtuals) {
    virtuals.forEach(v => {
      if (!currentInscribedVirtualIds.includes(v.id)) {
        options.push({ 
          label: v.name, value: v.id, type: 'virtual', position: v.specific_position || v.position || 'MED'
        })
      }
    })
  }

  allSquadOptions.value = options
  squadOptions.value = options
}

async function addSquadPlayerToMatch() {
  if (!selectedSquadPlayers.value || selectedSquadPlayers.value.length === 0 || !selectedMatch.value) return

  const currentlyConfirmed = presences.value.filter(p => p.status === 'confirmed').length
  const tryingToAdd = selectedSquadPlayers.value.length

  if (currentlyConfirmed + tryingToAdd > selectedMatch.value.max_players) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.capacityFull', { count: (selectedMatch.value.max_players - currentlyConfirmed) }) })
    return
  }

  const payloads = selectedSquadPlayers.value.map(p => {
    const payload = { match_id: selectedMatch.value.id, status: 'confirmed' }
    if (p.type === 'real') payload.profile_id = p.value
    else payload.virtual_player_id = p.value
    return payload
  })

  const { error } = await supabase.from('match_presences').insert(payloads)

  if (!error) {
    $q.notify({ type: 'positive', message: t('dashboard.notify.playersConvoked', { count: tryingToAdd }) })
    selectedSquadPlayers.value = [] 
    await openPresencesModal(selectedMatch.value)
  } else {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + error.message })
  }
}
  
async function togglePayment(presence) {
  const nextPaidStatus = !presence.paid
  const { error } = await supabase.from('match_presences').update({ paid: nextPaidStatus }).eq('id', presence.id)
  
  if (!error) {
    presence.paid = nextPaidStatus
    if (nextPaidStatus === false) {
      await supabase.from('matches').update({ paid: false }).eq('id', presence.match_id)
    }
  }
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
    $q.notify({ type: 'info', message: t('dashboard.notify.playerRemoved') })
  }
}

// --- SISTEMA DE EQUIPA TÉCNICA (ADMINS) ---
const showStaffModal = ref(false)
const staffList = ref([])
const loadingStaff = ref(false)

const selectedNewAdmin = ref(null)
const allEligibleMembers = ref([])
const eligibleMembersOptions = ref([])

async function openStaffManager() {
  showStaffModal.value = true
  loadingStaff.value = true

  const { data, error } = await supabase.from('club_members').select('profile_id, role, is_owner, can_manage_matches, can_manage_teams, can_manage_finances, profiles(name)').eq('club_id', props.id).eq('status', 'approved').order('is_owner', { ascending: false })

  if (error) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + error.message, timeout: 5000 })
  } else if (data) {
    staffList.value = data.filter(m => m.role === 'admin' || m.is_owner)
    const eligible = data.filter(m => m.role !== 'admin' && !m.is_owner)
    allEligibleMembers.value = eligible.map(m => ({ label: m.profiles?.name || 'Sem Nome', value: m.profile_id }))
    eligibleMembersOptions.value = allEligibleMembers.value
  }
  loadingStaff.value = false
}

function filterEligibleMembers(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    eligibleMembersOptions.value = allEligibleMembers.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

async function addAdmin() {
  if (!selectedNewAdmin.value) return
  const profileId = selectedNewAdmin.value.value
  const { error } = await supabase.from('club_members').update({ role: 'admin' }).eq('club_id', props.id).eq('profile_id', profileId)

  if (!error) {
    $q.notify({ type: 'positive', message: t('dashboard.notify.memberPromoted') })
    if (profileId === authStore.user.id && clubStore.currentClub) clubStore.currentClub.role = 'admin'
    selectedNewAdmin.value = null
    await openStaffManager() 
  } else {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + error.message })
  }
}

async function removeAdmin(profileId) {
  $q.dialog({
    title: t('dashboard.notify.demoteMemberTitle'),
    message: t('dashboard.notify.demoteMemberMsg'),
    cancel: { label: t('dashboard.modals.btnCancel'), flat: true, color: 'grey' },
    persistent: true
  }).onOk(async () => {
    const { error } = await supabase.from('club_members').update({ role: 'member', can_manage_matches: false, can_manage_teams: false, can_manage_finances: false }).eq('club_id', props.id).eq('profile_id', profileId)

    if (!error) {
      $q.notify({ type: 'info', message: t('dashboard.notify.memberDemoted') })
      if (profileId === authStore.user.id && clubStore.currentClub) {
        clubStore.currentClub.role = 'member'
        clubStore.currentClub.can_manage_matches = false
        clubStore.currentClub.can_manage_teams = false
        clubStore.currentClub.can_manage_finances = false
      }
      await openStaffManager()
    }
  })
}

async function updatePermission(profileId, field, value) {
  const updateData = {}
  updateData[field] = value
  
  const { data, error } = await supabase.from('club_members').update(updateData).eq('club_id', props.id).eq('profile_id', profileId).select() 
    
  if (error) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + error.message, timeout: 6000 })
    await openStaffManager()
  } else if (!data || data.length === 0) {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errRls'), timeout: 6000 })
    await openStaffManager()
  } else {
    $q.notify({ type: 'positive', message: t('dashboard.notify.permsUpdated') })
    if (profileId === authStore.user.id && clubStore.currentClub) {
      clubStore.currentClub[field] = value
    }
  }
}

const allClubPlayersOptions = ref([])
const showSettingsModal = ref(false)
const savingSettings = ref(false)

async function openClubSettings() {
  showSettingsModal.value = true
  await loadAllClubPlayers() 
  const { data } = await supabase.from('clubs').select('*').eq('id', props.id).single()
  if (data) {
    data.default_team_a_name = data.default_team_a_name || 'Equipa A'
    data.default_team_b_name = data.default_team_b_name || 'Equipa B'
    data.default_squad = data.default_squad || [] 
    clubSettings.value = { ...clubSettings.value, ...data }
  }
}

async function saveClubSettings() {
  savingSettings.value = true
  const { error } = await supabase.from('clubs').update({
    default_max_players: clubSettings.value.default_max_players, default_price: clubSettings.value.default_price, monthly_price_per_game: clubSettings.value.monthly_price_per_game,
    default_location: clubSettings.value.default_location, recurring_day_of_week: clubSettings.value.recurring_day_of_week, recurring_time: clubSettings.value.recurring_time,
    attribute_mode: clubSettings.value.attribute_mode, hide_attributes_from_members: clubSettings.value.hide_attributes_from_members, enable_voting: clubSettings.value.enable_voting, 
    single_team_mode: clubSettings.value.single_team_mode, detailed_attributes: clubSettings.value.detailed_attributes, default_starters_per_team: clubSettings.value.default_starters_per_team,
    default_team_a_name: clubSettings.value.default_team_a_name, default_team_b_name: clubSettings.value.default_team_b_name, default_team_a_color: clubSettings.value.default_team_a_color,
    default_team_b_color: clubSettings.value.default_team_b_color, default_squad: clubSettings.value.default_squad
  }).eq('id', props.id)

  if (!error) {
    $q.notify({ type: 'positive', message: t('dashboard.notify.settingsSaved') })
    showSettingsModal.value = false
    if (clubStore.currentClub) clubStore.currentClub.default_price = clubSettings.value.default_price
  }
  savingSettings.value = false
}

async function loadAllClubPlayers() {
  const options = []
  const { data: reals, error: realErr } = await supabase.from('club_members').select('profile_id, position, specific_position').eq('club_id', props.id).eq('status', 'approved')

  if (reals && !realErr) {
    for (const r of reals) {
      const { data: prof } = await supabase.from('profiles').select('name').eq('id', r.profile_id).single()
      if (prof) options.push({ label: prof.name, value: r.profile_id, type: 'real', position: r.specific_position || r.position || 'MED' })
    }
  }
  
  const { data: virtuals } = await supabase.from('virtual_players').select('id, name, position, specific_position').eq('club_id', props.id)
  if (virtuals) {
    virtuals.forEach(v => options.push({ label: v.name, value: v.id, type: 'virtual', position: v.specific_position || v.position || 'MED' }))
  }
  allClubPlayersOptions.value = options
}

function enforceSquadLimit(newLimit) {
  if (newLimit < 2 || !newLimit) { clubSettings.value.default_max_players = 2; newLimit = 2; }
  if (!clubSettings.value.default_squad) return

  if (clubSettings.value.default_squad.length > newLimit) {
    clubSettings.value.default_squad = clubSettings.value.default_squad.slice(0, newLimit)
    $q.notify({ type: 'warning', icon: 'content_cut', message: t('dashboard.notify.squadLimitWarn', { limit: newLimit }) })
  }
}

async function generateMonthlyMatchesBulk() {
  saving.value = true
  const { data: club } = await supabase.from('clubs').select('*').eq('id', props.id).single()
  
  if (!club || !club.recurring_day_of_week) {
    $q.notify({ type: 'warning', message: t('dashboard.notify.warnConfigRoutine') })
    saving.value = false; return
  }
  
  const batchInserts = []; const conflictingDates = []; const today = new Date(); let checkDate = new Date(today.getTime()); let targetMonth = null;
  
  for (let i = 0; i < 35; i++) {
    checkDate.setDate(checkDate.getDate() + 1)
    let jsDay = checkDate.getDay(); let normalizedDay = jsDay === 0 ? 7 : jsDay;
    if (normalizedDay === club.recurring_day_of_week) {
      if (targetMonth === null) targetMonth = checkDate.getMonth()
      if (checkDate.getMonth() !== targetMonth) break
      
      const dateString = checkDate.toISOString().split('T')[0]
      const finalDateTime = `${dateString}T${club.recurring_time || '21:00:00'}`
      const dateToSave = new Date(finalDateTime).toISOString()
      const targetDateStr = new Date(finalDateTime).toLocaleDateString('pt-PT')
      
      const conflict = matches.value.some(m => new Date(m.date).toLocaleDateString('pt-PT') === targetDateStr)
      if (conflict) conflictingDates.push(targetDateStr)
      
      batchInserts.push({
        club_id: props.id, date: dateToSave, location: club.default_location || 'Campo Padrão', max_players: club.default_max_players || 14,
        price_per_player: club.default_price || 5.00, team_a_name: newMatch.value.team_a_name, team_b_name: newMatch.value.team_b_name, status: 'aberto'
      })
    }
  }
  
  if (batchInserts.length === 0) {
    $q.notify({ type: 'info', message: t('dashboard.notify.infoNoMoreDays') })
    saving.value = false; return
  }
  
  if (conflictingDates.length > 0) {
    $q.dialog({
      title: t('dashboard.notify.overlapTitle'),
      message: t('dashboard.notify.overlapMsg', { dates: conflictingDates.join(', ') }),
      cancel: { label: t('dashboard.modals.btnCancel'), flat: true, color: 'grey' },
      ok: { label: t('dashboard.notify.btnGenerateAnyway'), color: 'amber-9', unelevated: true },
      persistent: true
    }).onOk(async () => { await executeBulkInsert(batchInserts) }).onCancel(() => { saving.value = false })
  } else {
    await executeBulkInsert(batchInserts)
  }
}

async function executeBulkInsert(batchInserts) {
  const { data: insertedMatches, error } = await supabase.from('matches').insert(batchInserts).select()
  if (!error) {
    if (clubSettings.value.default_squad?.length > 0) {
      const allPresences = []
      for (const m of insertedMatches) {
        clubSettings.value.default_squad.forEach(p => {
          allPresences.push({ match_id: m.id, status: 'confirmed', profile_id: p.type === 'real' ? p.value : null, virtual_player_id: p.type === 'virtual' ? p.value : null })
        })
      }
      if (allPresences.length > 0) await supabase.from('match_presences').insert(allPresences)
    }
    $q.notify({ type: 'positive', icon: 'auto_mode', message: t('dashboard.notify.bulkGenerated', { count: batchInserts.length }) })
    await fetchMatches()
    showCreateModal.value = false
  } else {
    $q.notify({ type: 'negative', message: t('dashboard.notify.errSaveData') + error.message })
  }
  saving.value = false
}

const applyToFuture = ref(false) 

function getNextRecurringDate(dayOfWeek, timeStr) {
  if (!dayOfWeek || !timeStr) return ''
  const today = new Date()
  const currentDay = today.getDay() === 0 ? 7 : today.getDay()
  let daysUntilNext = dayOfWeek - currentDay
  if (daysUntilNext < 0) daysUntilNext += 7
  const parts = timeStr.split(':')
  const hours = parseInt(parts[0]) || 21
  const minutes = parseInt(parts[1]) || 0
  if (daysUntilNext === 0) {
    const matchTime = new Date(today)
    matchTime.setHours(hours, minutes, 0, 0)
    if (today > matchTime) daysUntilNext += 7
  }
  const nextDate = new Date(today)
  nextDate.setDate(today.getDate() + daysUntilNext)
  nextDate.setHours(hours, minutes, 0, 0)
  return new Date(nextDate.getTime() - (nextDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
}

const canSeeStats = computed(() => {
  const isManager = clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner
  return !clubSettings.value?.hide_attributes_from_members || isManager
})

function copyInviteCode() {
  const code = clubStore.currentClub?.invite_code
  if (code) {
    navigator.clipboard.writeText(code)
    $q.notify({ type: 'positive', icon: 'content_copy', message: t('dashboard.notify.codeCopied', { code }) })
  } else {
    $q.notify({ type: 'warning', message: t('dashboard.notify.noCode') })
  }
}

async function shareInviteLink() {
  const club = clubStore.currentClub
  if (!club) return
  const routeData = router.resolve({ name: 'join-club', params: { id: club.id } })
  const fullLink = window.location.origin + routeData.href
  const msg = t('dashboard.notify.inviteMsg', { clubName: club.name, link: fullLink, code: club.invite_code })
  if (navigator.share) {
    try { await navigator.share({ title: t('dashboard.notify.inviteTitle'), text: msg }) } catch { console.log('Partilha cancelada') }
  } else {
    navigator.clipboard.writeText(msg)
    $q.notify({ type: 'positive', icon: 'share', message: t('dashboard.notify.inviteCopied') })
  }
}

async function notifyMatchPlayers(matchId, title, message) {
  try {
    const { data: presences } = await supabase.from('match_presences').select('profile_id').eq('match_id', matchId).eq('status', 'confirmed').not('profile_id', 'is', null)
    if (!presences || presences.length === 0) return
    const profileIds = presences.map(p => p.profile_id)
    const { data: subs } = await supabase.from('push_subscriptions').select('subscription').in('profile_id', profileIds)
    if (!subs || subs.length === 0) return
    for (const row of subs) {
      supabase.functions.invoke('send-push', { body: { subscription: row.subscription, title: title, message: message, url: `/club/${props.id}` } })
    }
  } catch (err) { console.error('Erro ao notificar:', err) }
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

/* =========================================
   O RELVADO TÁTICO (CSS PURO)
========================================= */
.tactics-pitch {
  position: relative;
  background-color: #2E7D32; /* Verde Relvado Base */
  /* Efeito de cortes na relva (riscas claras e escuras) */
  background-image: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px);
  border: 3px solid white;
  border-radius: 8px;
  height: 480px;
  width: 100%;
  overflow: hidden;
}

/* Linhas do Campo */
.pitch-line-center { position: absolute; top: 50%; left: 0; right: 0; height: 3px; background: white; transform: translateY(-50%); }
.pitch-circle { position: absolute; top: 50%; left: 50%; width: 80px; height: 80px; border: 3px solid white; border-radius: 50%; transform: translate(-50%, -50%); }
.pitch-area-top, .pitch-area-bottom { position: absolute; left: 50%; width: 140px; height: 70px; border: 3px solid white; transform: translateX(-50%); }
.pitch-area-top { top: 0; border-top: none; }
.pitch-area-bottom { bottom: 0; border-bottom: none; }

/* Nome do jogador em destaque */
.player-name {
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 4px;
  margin-top: 6px;
  max-width: 100%;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Relvado mais alto e espaçoso */
.tactics-pitch-large {
  position: relative;
  background-color: #2E7D32;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 45px, rgba(255,255,255,0.05) 45px, rgba(255,255,255,0.05) 90px);
  border: 3px solid white;
  border-radius: 8px;
  height: 560px; /* Aumentado para dar espaço total */
  width: 100%;
  overflow: hidden;
}

.player-badge-name {
  color: white;
  font-size: 11px;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 16px; /* Formato pílula/bola moderna */
  border: 2px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

/* Pílula maior para o modo de equipa única (mais espaço e destaque) */
.player-badge-single {
  color: white;
  font-size: 13px;
  font-weight: 900;
  padding: 8px 14px;
  border-radius: 20px;
  border: 2.5px solid white;
  box-shadow: 0 6px 14px rgba(0,0,0,0.35);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

/* =========================================
   AJUSTES TÁTICOS (TAMANHOS E ALINHAMENTO)
========================================= */

/* 2. Pílulas do modo partilhado "Ambas" (Maiores e com alinhamento perfeito ao centro) */
.player-name-mini {
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 10px; /* Aumentado de 8px para 10px */
  font-weight: 800;
  padding: 3px 6px;
  border-radius: 4px;
  margin-top: 4px;
  max-width: 75px; /* Alargado para caber melhor os nomes */
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* =========================================
   ALINHAMENTO GEOMÉTRICO PERFEITO (CENTRO)
========================================= */

/* Relvado com largura total e mais margem horizontal */
.tactics-pitch-large {
  position: relative;
  background-color: #2E7D32;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 45px, rgba(255,255,255,0.05) 45px, rgba(255,255,255,0.05) 90px);
  border: 3px solid white;
  border-radius: 8px;
  height: 580px;
  width: 100%;
  max-width: 620px; /* Alargado para afastar os jogadores nas pontas */
  margin: 0 auto;
  overflow: hidden;
}

/* =========================================
   ALINHAMENTO GEOMÉTRICO PERFEITO (FLEXBOX FLUIDO)
========================================= */

.pitch-formation, .pitch-formation-mini {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 15px 5px; /* Menos padding lateral para dar mais espaço */
  z-index: 10;
}

/* Linha fluida: Esquece o "gap" forçado, a net calcula a distância! */
.formation-line {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly; /* O Segredo! Distribui os jogadores matematicamente */
  align-items: center;
  width: 100%;
}

/* Cada jogador adapta-se ao ecrã */
.player-dot, .player-dot-large, .player-dot-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 18%; /* Garante que cabem 5 jogadores numa linha (5 * 18 = 90%) */
  max-width: 75px; 
  min-width: 50px; /* Pequeno o suficiente para não cortar em telemóveis */
}

/* 1. Nome do jogador por baixo da bola (Reduzido para não empurrar os vizinhos) */
.player-name-tactics {
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 10px; /* Reduzido para encaixar sempre */
  font-weight: 800;
  padding: 3px 4px;
  border-radius: 6px;
  margin-top: 6px;
  width: 100%;
  max-width: 80px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>