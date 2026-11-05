<template>
  <q-page class="page-light-premium q-pa-md">
         
    <!-- CABEÇALHO DO PLANTEL -->
    <div class="row items-center justify-between q-mb-lg q-pa-md club-header-block text-white">
      <div class="row items-center q-gutter-x-md">
        <!-- Ícone -->
        <div class="bg-white flex flex-center shadow-2" style="width: 44px; height: 44px; border-radius: 12px;">
          <q-icon name="groups" size="26px" color="green-9" />
        </div>
        <!-- Texto -->
        <div>
          <h5 class="q-my-none text-weight-bolder text-white font-fut" style="font-size: 1.4rem; letter-spacing: -0.5px;">
            {{ t('players.header.title') }}
          </h5>
        </div>
      </div>
             
      <!-- Ações -->
      <div class="row q-gutter-sm items-center">
        <q-btn v-if="clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner" color="amber-8" text-color="dark" icon="person_add" :label="t('players.header.btnCreateVirtual')" class="text-weight-bolder shadow-1" unelevated style="border-radius: 8px;" @click="showCreateVirtualModal = true" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-grid color="green-9" size="50px" />
    </div>
         
    <div v-else>
      <div v-for="section in tm('positions')" :key="section">
                 
        <div v-if="groupedMembers[section]?.length > 0" class="q-mb-xl">
          <!-- Título das Secções -->
          <h6 class="text-dark font-fut q-my-none q-mb-lg row items-center" style="border-bottom: 2px solid #bbf7d0; padding-bottom: 8px;">
            <q-icon :name="getSectionIcon(section)" class="q-mr-sm text-green-9" size="md" />
            {{ section.toUpperCase() }}
            <q-badge color="green-1" text-color="green-9" class="q-ml-sm q-px-sm shadow-1" style="font-family: Arial, sans-serif;">{{ groupedMembers[section].length }}</q-badge>
          </h6>
                     
          <div class="row q-col-gutter-xl">
            <div v-for="member in groupedMembers[section]" :key="member.id" class="col-6 col-sm-4 col-md-3 col-lg-2 flex flex-center">
                             
              <div class="fut-card shadow-10" :class="[ isIcon(member) ? 'card-icon' : (member.is_in_form ? 'card-inform' : (shouldHideStats ? 'card-hidden' : getCardTier(member.overall))), (clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner || clubStore.currentClub?.role === 'admin') ? 'cursor-pointer hover-lift' : '' ]" @click="openEditModal(member)">
                <div class="fut-card-shine"></div>
                <div class="fut-card-inner">
                
                <!-- TOPO: Oculta o OVR mas mantém a posição -->
                <div class="fut-top-info">
                  <div v-if="!shouldHideStats" class="fut-rating">{{ member.overall }}</div>
                  <div class="fut-position" :class="{'q-mt-sm': shouldHideStats}">
                      {{ member.specific_position || getShortPosition(member.position) }}
                  </div>
                </div>
                <q-icon v-if="member.is_virtual" name="construction" :color="isIcon(member) ? 'dark' : 'amber-9'" size="xs" class="absolute-top-right q-ma-sm" style="opacity: 0.8;">
                  <q-tooltip>{{ t('players.card.tooltipVirtual') }}</q-tooltip>
                </q-icon>

                <!-- FOTO -->
                <div class="fut-portrait" :style="shouldHideStats ? 'margin-top: 35px;' : 'margin-top: 15px;'">
                  <q-avatar v-if="member.avatar_url && member.avatar_url !== ''" size="65px" class="shadow-4" style="border: 2px solid rgba(255,255,255,0.3);">
                    <img :src="member.avatar_url" style="object-fit: cover;" />
                  </q-avatar>
                  <q-icon v-else name="person" size="5rem" class="silhouette" />
                </div>
                
                <div class="fut-name text-ellipsis row items-center justify-center" :class="{'q-mt-md': shouldHideStats}">
                  <q-icon v-if="isIcon(member)" name="workspace_premium" size="xs" class="q-mr-xs" />
                  {{ member.name?.split(' ')[0] || 'Jogador' }}
                </div>
                
                <!-- ESTATÍSTICAS -->
                <template v-if="!shouldHideStats">
                  <div class="fut-divider"></div>
                                     
                  <div class="row full-width justify-center q-mt-sm" style="font-size: 11px; margin-bottom: 2px;">
                    <!-- JOGADOR DE CAMPO -->
                    <template v-if="member.position !== tm('positions')[0]"> <!-- Verifica se não é Guarda-Redes (o 1º no array) -->
                      <div class="col-5 column items-end q-pr-sm" style="border-right: 1px solid rgba(0,0,0,0.15);">
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.pace || 70) }}</span><span class="stat-label">PAC</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.shooting || 70) }}</span><span class="stat-label">SHO</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.passing || 70) }}</span><span class="stat-label">PAS</span></div>
                      </div>
                      <div class="col-5 column items-start q-pl-sm">
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.dribbling || 70) }}</span><span class="stat-label">DRI</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.defending || 70) }}</span><span class="stat-label">DEF</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.physical || 70) }}</span><span class="stat-label">PHY</span></div>
                      </div>
                    </template>
                    <!-- GUARDA-REDES -->
                    <template v-else>
                      <div class="col-5 column items-end q-pr-sm" style="border-right: 1px solid rgba(0,0,0,0.15);">
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.diving || 70) }}</span><span class="stat-label">DIV</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.handling || 70) }}</span><span class="stat-label">HAN</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.kicking || 70) }}</span><span class="stat-label">KIC</span></div>
                      </div>
                      <div class="col-5 column items-start q-pl-sm">
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.reflexes || 70) }}</span><span class="stat-label">REF</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.speed || 70) }}</span><span class="stat-label">SPD</span></div>
                        <div class="stat-row"><span class="stat-val">{{ getStatLabel(member.positioning || 70) }}</span><span class="stat-label">POS</span></div>
                      </div>
                    </template>
                  </div>
                </template>
                <div class="fut-bottom-bar text-uppercase">
                  <q-icon name="sports_soccer" size="10px" class="q-mr-xs" />
                   {{ isIcon(member) ? 'ICON' : (member.is_in_form ? 'IN-FORM' : (member.is_virtual ? 'VIRTUAL' : 'PRO')) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- MODAL: CRIAR JOGADOR VIRTUAL -->
    <q-dialog v-model="showCreateVirtualModal">
      <q-card style="min-width: 320px; border-radius: 16px; background: #ffffff;">
        <q-card-section class="row items-center club-header-block text-white">
          <div class="text-subtitle1 text-weight-bold">{{ t('players.modals.createVirtualTitle') }}</div>
          <q-space /><q-btn icon="close" flat round dense color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md q-pt-lg">
          <q-input outlined dense color="green-9" v-model="newVirtualPlayer.name" :label="t('players.modals.createVirtualName')" />
          <q-select outlined dense color="green-9" v-model="newVirtualPlayer.position" :options="tm('positions')" :label="t('players.modals.createVirtualGenPos')" @update:model-value="newVirtualPlayer.specific_position = ''" />
          <q-select outlined dense color="green-9" v-model="newVirtualPlayer.specific_position" :options="specificPositionsMap[newVirtualPlayer.position]" emit-value map-options :label="t('players.modals.createVirtualSpecPos')" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat :label="t('players.modals.createVirtualBtnCancel')" color="grey-7" v-close-popup />
          <q-btn color="amber-8" text-color="dark" :label="t('players.modals.createVirtualBtnSave')" class="text-weight-bolder shadow-1" style="border-radius: 6px;" @click="createVirtualPlayer" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL: EDITAR ATRIBUTOS -->
    <q-dialog v-model="showEditModal" persistent>
      <q-card style="min-width: 320px; max-width: 500px; width: 100%; border-radius: 16px;">
                 
        <!-- 1. CABEÇALHO FIXO -->
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">{{ t('players.modals.editTitle') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- 2. CORPO COM SCROLL -->
        <q-card-section class="scroll" style="max-height: 65vh;">
          <div class="text-h5 text-center text-weight-bolder text-dark q-mb-lg text-uppercase font-fut">{{ selectedPlayer?.name }}</div>
            <div class="row q-col-gutter-md items-center q-mb-md">
              <div class="col-12 col-sm-4">
                <q-select outlined dense color="green-9" v-model="editForm.position" :options="tm('positions')" :label="t('dashboard.modals.genPosition')" @update:model-value="editForm.specific_position = ''" />
              </div>
              <div class="col-12 col-sm-4">
                <q-select outlined dense color="green-9" v-model="editForm.specific_position" :options="specificPositionsMap[editForm.position]" emit-value map-options :label="t('dashboard.modals.specPosition')" />
              </div>
              <div class="col-12 col-sm-4 flex flex-center">
                <div class="text-center bg-grey-2 q-px-xl q-py-sm shadow-2" style="border-radius: 8px; border: 1px solid #e2e8f0;">
                  <div class="text-caption text-grey-7 text-weight-bold">{{ t('players.modals.editOverall') }}</div>
                  <div class="text-h3 text-weight-bolder text-green-9" style="line-height: 1;">{{ computedOverall }}</div>
                </div>
              </div>
            </div>
          <q-separator class="q-my-md bg-grey-3" />
                     
          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
            <template v-if="editForm.position === tm('positions')[0]"> <!-- Guarda-Redes -->
              <div v-for="stat in ['diving', 'handling', 'kicking', 'reflexes', 'speed', 'positioning']" :key="stat" class="col-12 col-sm-6">
                <div class="row justify-between text-caption text-weight-bold text-dark q-mb-xs">
                  <span class="text-capitalize">{{ t(`players.modals.${stat}`) }}</span>
                  <span v-if="clubSettings.attribute_mode === 'numeric'" class="text-green-9 text-weight-bolder">{{ editForm[stat] }}</span>
                </div>
                <q-slider v-if="clubSettings.attribute_mode === 'numeric'" v-model="editForm[stat]" :min="1" :max="99" color="green-9" dense />
                <q-select 
                   v-else 
                   :model-value="editForm[stat]"
                  @update:model-value="val => editForm[stat] = Number(val)"
                  :options="tm('players.categories')" 
                   emit-value 
                   map-options 
                   dense 
                   outlined 
                   bg-color="grey-1" 
                   color="green-9" 
                 />
              </div>
            </template>
            <!-- JOGADORES DE CAMPO -->
            <template v-else>
              <!-- MODO SIMPLES -->
              <template v-if="!clubSettings.detailed_attributes">
                <div v-for="stat in ['pace', 'dribbling', 'shooting', 'defending', 'passing', 'physical']" :key="stat" class="col-12 col-sm-6">
                  <div class="row justify-between text-caption text-weight-bold text-dark q-mb-xs">
                    <span class="text-capitalize">{{ t(`players.modals.${stat}`) }}</span>
                    <span v-if="clubSettings.attribute_mode === 'numeric'" class="text-green-9 text-weight-bolder">{{ editForm[stat] }}</span>
                  </div>
                  <q-slider v-if="clubSettings.attribute_mode === 'numeric'" v-model="editForm[stat]" :min="1" :max="99" color="green-9" dense />
                  <q-select 
                     v-else 
                     :model-value="editForm[stat]"
                    @update:model-value="val => editForm[stat] = Number(val)"
                    :options="tm('players.categories')" 
                     emit-value 
                     map-options 
                     dense 
                     outlined 
                     bg-color="grey-1" 
                     color="green-9" 
                   />
                </div>
              </template>
              
              <!-- MODO PRO -->
              <template v-else>
                  <div class="col-12">
                    <div class="text-caption text-grey-8 q-mb-sm text-center">{{ t('players.modals.editModeProDesc') }}</div>
                    <q-list bordered class="rounded-borders bg-white shadow-1">
                                             
                      <!-- RITMO -->
                      <q-expansion-item expand-separator icon="speed" :label="t('players.modals.catPace')" :caption="String(Math.round((Number(editForm.att_acceleration) + Number(editForm.att_sprint_speed))/2))" header-class="bg-grey-2 text-weight-bold text-dark">
                        <q-card><q-card-section class="q-pt-sm bg-grey-1">
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.accel') }} <span>{{ editForm.att_acceleration }}</span></div><q-slider v-model="editForm.att_acceleration" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.sprint') }} <span>{{ editForm.att_sprint_speed }}</span></div><q-slider v-model="editForm.att_sprint_speed" :min="1" :max="99" color="green-9" dense /></div>
                        </q-card-section></q-card>
                      </q-expansion-item>

                      <!-- REMATE -->
                      <q-expansion-item expand-separator icon="sports_soccer" :label="t('players.modals.catShooting')" :caption="String(Math.round((Number(editForm.att_positioning) + Number(editForm.att_finishing) + Number(editForm.att_shot_power) + Number(editForm.att_long_shots) + Number(editForm.att_volleys) + Number(editForm.att_penalties))/6))" header-class="bg-grey-2 text-weight-bold text-dark">
                        <q-card><q-card-section class="q-pt-sm bg-grey-1">
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.pos') }} <span>{{ editForm.att_positioning }}</span></div><q-slider v-model="editForm.att_positioning" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.finish') }} <span>{{ editForm.att_finishing }}</span></div><q-slider v-model="editForm.att_finishing" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.shotPower') }} <span>{{ editForm.att_shot_power }}</span></div><q-slider v-model="editForm.att_shot_power" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.longShots') }} <span>{{ editForm.att_long_shots }}</span></div><q-slider v-model="editForm.att_long_shots" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.volleys') }} <span>{{ editForm.att_volleys }}</span></div><q-slider v-model="editForm.att_volleys" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.penalties') }} <span>{{ editForm.att_penalties }}</span></div><q-slider v-model="editForm.att_penalties" :min="1" :max="99" color="green-9" dense /></div>
                        </q-card-section></q-card>
                      </q-expansion-item>

                      <!-- PASSE -->
                      <q-expansion-item expand-separator icon="alt_route" :label="t('players.modals.catPassing')" :caption="String(Math.round((Number(editForm.att_vision) + Number(editForm.att_crossing) + Number(editForm.att_free_kick) + Number(editForm.att_short_pass) + Number(editForm.att_long_pass) + Number(editForm.att_curve))/6))" header-class="bg-grey-2 text-weight-bold text-dark">
                        <q-card><q-card-section class="q-pt-sm bg-grey-1">
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.vision') }} <span>{{ editForm.att_vision }}</span></div><q-slider v-model="editForm.att_vision" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.crossing') }} <span>{{ editForm.att_crossing }}</span></div><q-slider v-model="editForm.att_crossing" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.freeKick') }} <span>{{ editForm.att_free_kick }}</span></div><q-slider v-model="editForm.att_free_kick" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.shortPass') }} <span>{{ editForm.att_short_pass }}</span></div><q-slider v-model="editForm.att_short_pass" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.longPass') }} <span>{{ editForm.att_long_pass }}</span></div><q-slider v-model="editForm.att_long_pass" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.curve') }} <span>{{ editForm.att_curve }}</span></div><q-slider v-model="editForm.att_curve" :min="1" :max="99" color="green-9" dense /></div>
                        </q-card-section></q-card>
                      </q-expansion-item>

                      <!-- DRIBLE -->
                      <q-expansion-item expand-separator icon="moving" :label="t('players.modals.catDribbling')" :caption="String(Math.round((Number(editForm.att_agility) + Number(editForm.att_balance) + Number(editForm.att_reactions) + Number(editForm.att_ball_control) + Number(editForm.att_dribbling) + Number(editForm.att_composure))/6))" header-class="bg-grey-2 text-weight-bold text-dark">
                        <q-card><q-card-section class="q-pt-sm bg-grey-1">
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.agility') }} <span>{{ editForm.att_agility }}</span></div><q-slider v-model="editForm.att_agility" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.balance') }} <span>{{ editForm.att_balance }}</span></div><q-slider v-model="editForm.att_balance" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.reactions') }} <span>{{ editForm.att_reactions }}</span></div><q-slider v-model="editForm.att_reactions" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.ballControl') }} <span>{{ editForm.att_ball_control }}</span></div><q-slider v-model="editForm.att_ball_control" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.dribble') }} <span>{{ editForm.att_dribbling }}</span></div><q-slider v-model="editForm.att_dribbling" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.composure') }} <span>{{ editForm.att_composure }}</span></div><q-slider v-model="editForm.att_composure" :min="1" :max="99" color="green-9" dense /></div>
                        </q-card-section></q-card>
                      </q-expansion-item>

                      <!-- DEFESA -->
                      <q-expansion-item expand-separator icon="security" :label="t('players.modals.catDefending')" :caption="String(Math.round((Number(editForm.att_interceptions) + Number(editForm.att_heading) + Number(editForm.att_def_awareness) + Number(editForm.att_stand_tackle) + Number(editForm.att_slide_tackle))/5))" header-class="bg-grey-2 text-weight-bold text-dark">
                        <q-card><q-card-section class="q-pt-sm bg-grey-1">
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.interceptions') }} <span>{{ editForm.att_interceptions }}</span></div><q-slider v-model="editForm.att_interceptions" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.heading') }} <span>{{ editForm.att_heading }}</span></div><q-slider v-model="editForm.att_heading" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.defAware') }} <span>{{ editForm.att_def_awareness }}</span></div><q-slider v-model="editForm.att_def_awareness" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.standTackle') }} <span>{{ editForm.att_stand_tackle }}</span></div><q-slider v-model="editForm.att_stand_tackle" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.slideTackle') }} <span>{{ editForm.att_slide_tackle }}</span></div><q-slider v-model="editForm.att_slide_tackle" :min="1" :max="99" color="green-9" dense /></div>
                        </q-card-section></q-card>
                      </q-expansion-item>

                      <!-- FÍSICO -->
                      <q-expansion-item expand-separator icon="fitness_center" :label="t('players.modals.catPhysical')" :caption="String(Math.round((Number(editForm.att_jumping) + Number(editForm.att_stamina) + Number(editForm.att_strength) + Number(editForm.att_aggression))/4))" header-class="bg-grey-2 text-weight-bold text-dark">
                        <q-card><q-card-section class="q-pt-sm bg-grey-1">
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.jumping') }} <span>{{ editForm.att_jumping }}</span></div><q-slider v-model="editForm.att_jumping" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.stamina') }} <span>{{ editForm.att_stamina }}</span></div><q-slider v-model="editForm.att_stamina" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.strength') }} <span>{{ editForm.att_strength }}</span></div><q-slider v-model="editForm.att_strength" :min="1" :max="99" color="green-9" dense /></div>
                          <div class="q-mb-sm"><div class="row justify-between text-caption text-weight-bold">{{ t('players.modals.aggression') }} <span>{{ editForm.att_aggression }}</span></div><q-slider v-model="editForm.att_aggression" :min="1" :max="99" color="green-9" dense /></div>
                        </q-card-section></q-card>
                      </q-expansion-item>

                    </q-list>
                  </div>
                </template>
              </template>
            </div>
        </q-card-section>
                 
        <!-- 3. RODAPÉ FIXO -->
        <q-card-actions align="between" class="bg-grey-1 q-px-md q-py-sm" style="border-top: 1px solid #e2e8f0;">
          <q-btn :label="t('players.modals.btnRemove')" color="negative" icon="delete" flat dense @click="removePlayer" />
                     
          <div>
            <q-btn :label="t('players.modals.btnCancel')" color="grey-7" flat v-close-popup class="q-mr-sm" />
            <q-btn :label="t('players.modals.btnSave')" color="green-9" unelevated style="border-radius: 8px;" @click="savePlayerStats" :loading="saving" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClubStore } from 'stores/useClubStore'
import { useAuthStore } from 'stores/useAuthStore'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const props = defineProps(['id'])
const clubStore = useClubStore()
const authStore = useAuthStore()
const $q = useQuasar()
const { t, tm } = useI18n()

const members = ref([])
const loading = ref(true)
const saving = ref(false)
const showEditModal = ref(false)
const showCreateVirtualModal = ref(false)
const selectedPlayer = ref(null)

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

const newVirtualPlayer = ref({ name: '', position: 'Médio', specific_position: '' }) 

const editForm = ref({ 
  position: 'Médio', specific_position: '', 
  pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70,
  diving: 70, handling: 70, kicking: 70, reflexes: 70, speed: 70, positioning: 70,
  att_acceleration: 70, att_sprint_speed: 70,
  att_positioning: 70, att_finishing: 70, att_shot_power: 70, att_long_shots: 70, att_volleys: 70, att_penalties: 70,
  att_vision: 70, att_crossing: 70, att_free_kick: 70, att_short_pass: 70, att_long_pass: 70, att_curve: 70,
  att_agility: 70, att_balance: 70, att_reactions: 70, att_ball_control: 70, att_dribbling: 70, att_composure: 70,
  att_interceptions: 70, att_heading: 70, att_def_awareness: 70, att_stand_tackle: 70, att_slide_tackle: 70,
  att_jumping: 70, att_stamina: 70, att_strength: 70, att_aggression: 70
})

const groupedMembers = computed(() => {
  const groups = {}
  tm('positions').forEach(p => groups[p] = [])
  
  members.value.forEach(rawMember => {
    const m = { ...rawMember }
    
    // Se o modo Pro estiver ativo, a carta lê as colunas "pro_" e ignora as normais!
    if (clubSettings.value.detailed_attributes && m.position !== tm('positions')[0]) {
      m.overall = m.pro_overall || 70
      m.pace = m.pro_pace || 70
      m.shooting = m.pro_shooting || 70
      m.passing = m.pro_passing || 70
      m.dribbling = m.pro_dribbling || 70
      m.defending = m.pro_defending || 70
      m.physical = m.pro_physical || 70
    }

    // Traduções compatíveis com a Base de Dados
    let pos = m.position || 'Médio'
    if (pos === 'Guarda-Redes') pos = tm('positions')[0]
    else if (pos === 'Defesa') pos = tm('positions')[1]
    else if (pos === 'Médio') pos = tm('positions')[2]
    else if (pos === 'Avançado') pos = tm('positions')[3]

    if (groups[pos]) groups[pos].push(m)
  })

  Object.keys(groups).forEach(key => groups[key].sort((a, b) => b.overall - a.overall))
  return groups
})

function calculateWeightedOVR(p) {
  if (!p) return 70;
  
  // Normaliza o texto que vem do select para a lógica em pt que foi guardada
  const isGR = p.position === 'Guarda-Redes' || p.position === tm('positions')[0]
  const isDEF = p.position === 'Defesa' || p.position === tm('positions')[1]
  const isMED = p.position === 'Médio' || p.position === tm('positions')[2]

  if (isGR) {
    return Math.round((Number(p.reflexes || 70) * 0.25) + (Number(p.diving || 70) * 0.25) + (Number(p.positioning || 70) * 0.20) + (Number(p.handling || 70) * 0.20) + (Number(p.kicking || 70) * 0.05) + (Number(p.speed || 70) * 0.05))
  } else if (isDEF) {
    return Math.round((Number(p.defending || 70) * 0.35) + (Number(p.physical || 70) * 0.25) + (Number(p.pace || 70) * 0.15) + (Number(p.passing || 70) * 0.15) + (Number(p.dribbling || 70) * 0.05) + (Number(p.shooting || 70) * 0.05))
  } else if (isMED) {
    return Math.round((Number(p.passing || 70) * 0.30) + (Number(p.dribbling || 70) * 0.25) + (Number(p.shooting || 70) * 0.15) + (Number(p.physical || 70) * 0.10) + (Number(p.defending || 70) * 0.10) + (Number(p.pace || 70) * 0.10))
  } else {
    return Math.round((Number(p.shooting || 70) * 0.35) + (Number(p.pace || 70) * 0.25) + (Number(p.dribbling || 70) * 0.20) + (Number(p.physical || 70) * 0.10) + (Number(p.passing || 70) * 0.10))
  }
}

const computedOverall = computed(() => {
  const tempForm = { ...editForm.value }
  
  const isGR = tempForm.position === 'Guarda-Redes' || tempForm.position === tm('positions')[0]
  if (clubSettings.value.detailed_attributes && !isGR) {
    tempForm.pace = Math.round((Number(tempForm.att_acceleration) + Number(tempForm.att_sprint_speed)) / 2)
    tempForm.shooting = Math.round((Number(tempForm.att_positioning) + Number(tempForm.att_finishing) + Number(tempForm.att_shot_power) + Number(tempForm.att_long_shots) + Number(tempForm.att_volleys) + Number(tempForm.att_penalties)) / 6)
    tempForm.passing = Math.round((Number(tempForm.att_vision) + Number(tempForm.att_crossing) + Number(tempForm.att_free_kick) + Number(tempForm.att_short_pass) + Number(tempForm.att_long_pass) + Number(tempForm.att_curve)) / 6)
    tempForm.dribbling = Math.round((Number(tempForm.att_agility) + Number(tempForm.att_balance) + Number(tempForm.att_reactions) + Number(tempForm.att_ball_control) + Number(tempForm.att_dribbling) + Number(tempForm.att_composure)) / 6)
    tempForm.defending = Math.round((Number(tempForm.att_interceptions) + Number(tempForm.att_heading) + Number(tempForm.att_def_awareness) + Number(tempForm.att_stand_tackle) + Number(tempForm.att_slide_tackle)) / 5)
    tempForm.physical = Math.round((Number(tempForm.att_jumping) + Number(tempForm.att_stamina) + Number(tempForm.att_strength) + Number(tempForm.att_aggression)) / 4)
  }
  return calculateWeightedOVR(tempForm)
})

const clubSettings = ref({ attribute_mode: 'numeric', hide_attributes_from_members: false, detailed_attributes: false })

const shouldHideStats = computed(() => {
  const isManager = clubStore.currentClub?.role === 'admin' || clubStore.currentClub?.is_owner
  return clubSettings.value.hide_attributes_from_members && !isManager
})

onMounted(async () => {
  if (!authStore.user) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) { authStore.user = user; await authStore.fetchProfile(user.id) }
  }
  if (authStore.user && (!clubStore.currentClub || clubStore.currentClub.id !== props.id)) {
    const { data } = await supabase.from('club_members').select('role, is_owner, can_manage_finances, can_manage_teams, can_manage_matches, clubs(id, name)').eq('club_id', props.id).eq('profile_id', authStore.user.id).single()
    if (data) {
      clubStore.setClub({
        id: data.clubs.id, name: data.clubs.name, role: data.role, is_owner: data.is_owner,
        can_manage_finances: data.can_manage_finances, can_manage_teams: data.can_manage_teams, can_manage_matches: data.can_manage_matches
      })
    }
  }
  
  const { data: settingsData } = await supabase.from('clubs').select('attribute_mode, hide_attributes_from_members, detailed_attributes').eq('id', props.id).single()
  if (settingsData) {
    clubSettings.value.attribute_mode = settingsData.attribute_mode || 'numeric'
    clubSettings.value.hide_attributes_from_members = settingsData.hide_attributes_from_members || false
    clubSettings.value.detailed_attributes = settingsData.detailed_attributes || false
  }

  // Preenche valores por defeito dos selects logo ao arrancar com base no idioma atual
  newVirtualPlayer.value.position = tm('positions')[2]
  editForm.value.position = tm('positions')[2]

  await fetchAllMembers()
})

function getStatLabel(val) {
  if (clubSettings.value.attribute_mode === 'numeric') return val;
  if (val >= 93) return 'EXC'
  if (val >= 86) return 'MBO'
  if (val >= 77) return 'BOM'
  if (val >= 65) return 'MED'
  if (val >= 50) return 'MAU'
  return 'PES'
}

function snapToCategory(val) {
  if (val >= 93) return 96
  if (val >= 86) return 90
  if (val >= 77) return 82
  if (val >= 65) return 70
  if (val >= 50) return 55
  return 40
}

function openEditModal(memberFromCard) {
  const pureMember = members.value.find(m => m.id === memberFromCard.id) || memberFromCard;
  
  const canEdit = clubStore.currentClub?.can_manage_teams || clubStore.currentClub?.is_owner || clubStore.currentClub?.role === 'admin'
  if (!canEdit) {
    $q.notify({ type: 'warning', icon: 'security', message: t('players.notify.onlyStaffEdit') })
    return
  }
  
  selectedPlayer.value = pureMember
  const f = { ...pureMember }

  const allStats = [
    'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical', 
    'diving', 'handling', 'kicking', 'reflexes', 'speed', 'positioning',
    'att_acceleration', 'att_sprint_speed',
    'att_positioning', 'att_finishing', 'att_shot_power', 'att_long_shots', 'att_volleys', 'att_penalties',
    'att_vision', 'att_crossing', 'att_free_kick', 'att_short_pass', 'att_long_pass', 'att_curve',
    'att_agility', 'att_balance', 'att_reactions', 'att_ball_control', 'att_dribbling', 'att_composure',
    'att_interceptions', 'att_heading', 'att_def_awareness', 'att_stand_tackle', 'att_slide_tackle',
    'att_jumping', 'att_stamina', 'att_strength', 'att_aggression'
  ]

  allStats.forEach(s => {
    let statValue = f[s] || 70 
    if (clubSettings.value.attribute_mode === 'categorical') {
      f[s] = snapToCategory(statValue)
    } else {
      f[s] = statValue
    }
  })

  // Converte a BD para o Dropdown I18n
  if (f.position === 'Guarda-Redes') f.position = tm('positions')[0]
  else if (f.position === 'Defesa') f.position = tm('positions')[1]
  else if (f.position === 'Avançado') f.position = tm('positions')[3]
  else f.position = tm('positions')[2]

  f.specific_position = pureMember.specific_position || ''
  editForm.value = f
  showEditModal.value = true
}

async function fetchAllMembers() {
  loading.value = true
  const list = []

  const { data: realUsers } = await supabase.from('club_members')
  .select(`
    role, is_owner, profile_id, position, specific_position, overall, pro_overall,
    pace, shooting, passing, dribbling, defending, physical, 
    pro_pace, pro_shooting, pro_passing, pro_dribbling, pro_defending, pro_physical,
    diving, handling, kicking, reflexes, speed, positioning, 
    att_acceleration, att_sprint_speed, 
    att_positioning, att_finishing, att_shot_power, att_long_shots, att_volleys, att_penalties, 
    att_vision, att_crossing, att_free_kick, att_short_pass, att_long_pass, att_curve, 
    att_agility, att_balance, att_reactions, att_ball_control, att_dribbling, att_composure, 
    att_interceptions, att_heading, att_def_awareness, att_stand_tackle, att_slide_tackle, 
    att_jumping, att_stamina, att_strength, att_aggression, 
    profiles(name, avatar_url)
  `)
  .eq('club_id', props.id)

  if (realUsers) {
    realUsers.forEach(u => {
      if (u.profiles) {
        list.push({
          id: u.profile_id, id_type: 'real', name: u.profiles.name, avatar_url: u.profiles.avatar_url, 
          position: u.position || 'Médio', specific_position: u.specific_position || '', 
          overall: u.overall || 70, pro_overall: u.pro_overall || 70,
          pace: u.pace || 70, shooting: u.shooting || 70, passing: u.passing || 70,
          dribbling: u.dribbling || 70, defending: u.defending || 70, physical: u.physical || 70,
          pro_pace: u.pro_pace || 70, pro_shooting: u.pro_shooting || 70, pro_passing: u.pro_passing || 70,
          pro_dribbling: u.pro_dribbling || 70, pro_defending: u.pro_defending || 70, pro_physical: u.pro_physical || 70,
          diving: u.diving || 70, handling: u.handling || 70, kicking: u.kicking || 70,
          reflexes: u.reflexes || 70, speed: u.speed || 70, positioning: u.positioning || 70,
          att_acceleration: u.att_acceleration || 70, att_sprint_speed: u.att_sprint_speed || 70,
          att_positioning: u.att_positioning || 70, att_finishing: u.att_finishing || 70, att_shot_power: u.att_shot_power || 70, att_long_shots: u.att_long_shots || 70, att_volleys: u.att_volleys || 70, att_penalties: u.att_penalties || 70,
          att_vision: u.att_vision || 70, att_crossing: u.att_crossing || 70, att_free_kick: u.att_free_kick || 70, att_short_pass: u.att_short_pass || 70, att_long_pass: u.att_long_pass || 70, att_curve: u.att_curve || 70,
          att_agility: u.att_agility || 70, att_balance: u.att_balance || 70, att_reactions: u.att_reactions || 70, att_ball_control: u.att_ball_control || 70, att_dribbling: u.att_dribbling || 70, att_composure: u.att_composure || 70,
          att_interceptions: u.att_interceptions || 70, att_heading: u.att_heading || 70, att_def_awareness: u.att_def_awareness || 70, att_stand_tackle: u.att_stand_tackle || 70, att_slide_tackle: u.att_slide_tackle || 70,
          att_jumping: u.att_jumping || 70, att_stamina: u.att_stamina || 70, att_strength: u.att_strength || 70, att_aggression: u.att_aggression || 70,
          is_virtual: false, is_owner: u.is_owner, role: u.role
        })
      }
    })
  }

  const { data: virtualUsers } = await supabase.from('virtual_players').select('*').eq('club_id', props.id)

  if (virtualUsers) {
    virtualUsers.forEach(v => {
      list.push({ ...v, id_type: 'virtual', is_virtual: true })
    })
  }

  await calculateInForms()
  members.value = list.map(m => ({ ...m, is_in_form: inFormPlayersIds.value.includes(m.id) }))
  loading.value = false
}

async function createVirtualPlayer() {
  if (!newVirtualPlayer.value.name.trim()) return
  saving.value = true

  // Traduz o Dropdown de volta para a Base de Dados
  let bdPos = 'Médio'
  if (newVirtualPlayer.value.position === tm('positions')[0]) bdPos = 'Guarda-Redes'
  else if (newVirtualPlayer.value.position === tm('positions')[1]) bdPos = 'Defesa'
  else if (newVirtualPlayer.value.position === tm('positions')[3]) bdPos = 'Avançado'

  const { error } = await supabase.from('virtual_players').insert([{ club_id: props.id, name: newVirtualPlayer.value.name.trim(), position: bdPos, specific_position: newVirtualPlayer.value.specific_position }])
  if (!error) {
    $q.notify({ type: 'positive', message: t('players.notify.virtualHired') })
    showCreateVirtualModal.value = false
    newVirtualPlayer.value = { name: '', position: tm('positions')[2] }
    await fetchAllMembers()
  }
  saving.value = false
}

const inFormPlayersIds = ref([])

async function calculateInForms() {
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() 
  
  if (month === 0) {
    month = 12
    year -= 1
  }
  const prevMonthStr = `${year}-${String(month).padStart(2, '0')}`

  const { data: allMatches } = await supabase.from('matches').select('id, date').eq('club_id', props.id).eq('status', 'fechado')
  if (!allMatches || allMatches.length === 0) return

  const prevMonthMatches = allMatches.filter(m => m.date.startsWith(prevMonthStr))
  if (prevMonthMatches.length === 0) return

  const matchIds = prevMonthMatches.map(m => m.id)

  const { data: presences } = await supabase.from('match_presences').select('profile_id, virtual_player_id, rating_average').in('match_id', matchIds).gt('rating_average', 0)
  
  if (!presences || presences.length === 0) return

  const stats = {}
  presences.forEach(p => {
    const key = p.profile_id || p.virtual_player_id
    if (!key) return
    if (!stats[key]) stats[key] = { id: key, sum: 0, count: 0 }
    stats[key].sum += Number(p.rating_average)
    stats[key].count++
  })

  const ranked = Object.values(stats).map(s => ({ id: s.id, avg: s.sum / s.count, count: s.count }))
    .sort((a, b) => {
      if (b.avg !== a.avg) return b.avg - a.avg
      return b.count - a.count 
     })

  inFormPlayersIds.value = ranked.slice(0, 3).map(r => r.id)
}

async function savePlayerStats() {
  saving.value = true
  try {
    const isGR = editForm.value.position === 'Guarda-Redes' || editForm.value.position === tm('positions')[0]
    const isPro = clubSettings.value.detailed_attributes && !isGR;
    
    let finalOverall = editForm.value.overall || 70;
    let proOverall = editForm.value.pro_overall || 70;
    
    let proPace = editForm.value.pro_pace || 70;
    let proShooting = editForm.value.pro_shooting || 70;
    let proPassing = editForm.value.pro_passing || 70;
    let proDribbling = editForm.value.pro_dribbling || 70;
    let proDefending = editForm.value.pro_defending || 70;
    let proPhysical = editForm.value.pro_physical || 70;

    if (isPro) {
      proPace = Math.round((Number(editForm.value.att_acceleration) + Number(editForm.value.att_sprint_speed)) / 2) || 70;
      proShooting = Math.round((Number(editForm.value.att_positioning) + Number(editForm.value.att_finishing) + Number(editForm.value.att_shot_power) + Number(editForm.value.att_long_shots) + Number(editForm.value.att_volleys) + Number(editForm.value.att_penalties)) / 6) || 70;
      proPassing = Math.round((Number(editForm.value.att_vision) + Number(editForm.value.att_crossing) + Number(editForm.value.att_free_kick) + Number(editForm.value.att_short_pass) + Number(editForm.value.att_long_pass) + Number(editForm.value.att_curve)) / 6) || 70;
      proDribbling = Math.round((Number(editForm.value.att_agility) + Number(editForm.value.att_balance) + Number(editForm.value.att_reactions) + Number(editForm.value.att_ball_control) + Number(editForm.value.att_dribbling) + Number(editForm.value.att_composure)) / 6) || 70;
      proDefending = Math.round((Number(editForm.value.att_interceptions) + Number(editForm.value.att_heading) + Number(editForm.value.att_def_awareness) + Number(editForm.value.att_stand_tackle) + Number(editForm.value.att_slide_tackle)) / 5) || 70;
      proPhysical = Math.round((Number(editForm.value.att_jumping) + Number(editForm.value.att_stamina) + Number(editForm.value.att_strength) + Number(editForm.value.att_aggression)) / 4) || 70;
      
      proOverall = calculateWeightedOVR({ ...editForm.value, pace: proPace, shooting: proShooting, passing: proPassing, dribbling: proDribbling, defending: proDefending, physical: proPhysical });
    } else {
      finalOverall = calculateWeightedOVR(editForm.value);
    }

    // Converter para Português a gravação na BD
    let bdPos = 'Médio'
    if (editForm.value.position === tm('positions')[0]) bdPos = 'Guarda-Redes'
    else if (editForm.value.position === tm('positions')[1]) bdPos = 'Defesa'
    else if (editForm.value.position === tm('positions')[3]) bdPos = 'Avançado'

    const payload = {
      position: bdPos, specific_position: editForm.value.specific_position,
      
      overall: finalOverall,
      pace: Number(editForm.value.pace || 70), shooting: Number(editForm.value.shooting || 70), passing: Number(editForm.value.passing || 70),
      dribbling: Number(editForm.value.dribbling || 70), defending: Number(editForm.value.defending || 70), physical: Number(editForm.value.physical || 70),
      diving: Number(editForm.value.diving || 70), handling: Number(editForm.value.handling || 70), kicking: Number(editForm.value.kicking || 70),
      reflexes: Number(editForm.value.reflexes || 70), speed: Number(editForm.value.speed || 70), positioning: Number(editForm.value.positioning || 70),
      
      pro_overall: proOverall,
      pro_pace: proPace, pro_shooting: proShooting, pro_passing: proPassing,
      pro_dribbling: proDribbling, pro_defending: proDefending, pro_physical: proPhysical,
      
      att_acceleration: Number(editForm.value.att_acceleration || 70), att_sprint_speed: Number(editForm.value.att_sprint_speed || 70),
      att_positioning: Number(editForm.value.att_positioning || 70), att_finishing: Number(editForm.value.att_finishing || 70), att_shot_power: Number(editForm.value.att_shot_power || 70), att_long_shots: Number(editForm.value.att_long_shots || 70), att_volleys: Number(editForm.value.att_volleys || 70), att_penalties: Number(editForm.value.att_penalties || 70),
      att_vision: Number(editForm.value.att_vision || 70), att_crossing: Number(editForm.value.att_crossing || 70), att_free_kick: Number(editForm.value.att_free_kick || 70), att_short_pass: Number(editForm.value.att_short_pass || 70), att_long_pass: Number(editForm.value.att_long_pass || 70), att_curve: Number(editForm.value.att_curve || 70),
      att_agility: Number(editForm.value.att_agility || 70), att_balance: Number(editForm.value.att_balance || 70), att_reactions: Number(editForm.value.att_reactions || 70), att_ball_control: Number(editForm.value.att_ball_control || 70), att_dribbling: Number(editForm.value.att_dribbling || 70), att_composure: Number(editForm.value.att_composure || 70),
      att_interceptions: Number(editForm.value.att_interceptions || 70), att_heading: Number(editForm.value.att_heading || 70), att_def_awareness: Number(editForm.value.att_def_awareness || 70), att_stand_tackle: Number(editForm.value.att_stand_tackle || 70), att_slide_tackle: Number(editForm.value.att_slide_tackle || 70),
      att_jumping: Number(editForm.value.att_jumping || 70), att_stamina: Number(editForm.value.att_stamina || 70), att_strength: Number(editForm.value.att_strength || 70), att_aggression: Number(editForm.value.att_aggression || 70)
    }

    let data, error;
    if (selectedPlayer.value.is_virtual) {
      const res = await supabase.from('virtual_players').update(payload).eq('id', selectedPlayer.value.id).select()
      data = res.data; error = res.error;
    } else {
      const res = await supabase.from('club_members').update(payload).eq('club_id', props.id).eq('profile_id', selectedPlayer.value.id).select()
      data = res.data; error = res.error;
    }
    
    if (error) throw error
    if (!data || data.length === 0) throw new Error("Bloqueado por RLS ou ID não encontrado.")
    
    $q.notify({ type: 'positive', message: t('players.notify.statsUpdated') })
    showEditModal.value = false
    await fetchAllMembers()
  } catch (err) {
    console.error("Erro ao guardar:", err)
    $q.notify({ type: 'negative', message: t('players.notify.errSave') + err.message, timeout: 5000 })
  } finally {
    saving.value = false
  }
}

async function removePlayer() {
  if (selectedPlayer.value.is_owner) {
    $q.notify({ type: 'warning', icon: 'security', message: t('players.notify.errOwnerRemove') })
    return
  }

  $q.dialog({
    title: t('players.notify.confirmRemoveTitle'),
    message: t('players.notify.confirmRemoveMsg', { name: selectedPlayer.value.name }),
    persistent: true,
    color: 'negative',
    ok: { label: t('players.notify.btnYesRemove'), color: 'negative', unelevated: true },
    cancel: { label: t('players.notify.btnCancel'), flat: true }
  }).onOk(async () => {
    saving.value = true
    let deleteError = null
    if (selectedPlayer.value.is_virtual) {
      const { error } = await supabase.from('virtual_players').delete().eq('id', selectedPlayer.value.id)
      deleteError = error
    } else {
      const { error } = await supabase.from('club_members').delete().eq('club_id', props.id).eq('profile_id', selectedPlayer.value.id)
      deleteError = error
    }
    if (deleteError) {
      $q.notify({ type: 'negative', message: t('players.notify.errSave') + deleteError.message })
    } else {
      $q.notify({ type: 'positive', icon: 'person_remove', message: t('players.notify.playerRemoved') })
      showEditModal.value = false
      await fetchAllMembers()
    }
    saving.value = false
  })
}

function isIcon(member) {
  return member.name && member.name.toLowerCase().includes('tiago');
}

function getSectionIcon(s) { 
  if(s === tm('positions')[0]) return 'pan_tool';
  if(s === tm('positions')[1]) return 'security';
  if(s === tm('positions')[2]) return 'explore';
  return 'sports_score';
}

function getCardTier(o) { return o>=80?'card-gold':o>=70?'card-silver':'card-bronze' }

function getShortPosition(p) { 
  if(p === 'Guarda-Redes' || p === tm('positions')[0]) return 'GR';
  if(p === 'Defesa' || p === tm('positions')[1]) return 'DEF';
  if(p === 'Médio' || p === tm('positions')[2]) return 'MED';
  return 'AV';
}
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

/* --- BLOCO DE ESTATÍSTICAS DA CARTA FUT --- */
.stat-row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 2px;
}

.stat-val {
  font-weight: 900;
  width: 25px; /* Aumentado para caber as 3 letras (ex: MBO) */
  text-align: right;
  font-size: 11px;
}

.stat-label {
  width: 22px;
  text-align: left;
  font-weight: 700;
  color: #373737;
  margin-left: 5px;
}

.fut-bottom-bar { text-align: center; font-weight: 900; font-size: 10px; opacity: 0.7; margin-top: auto; padding-bottom: 4px; }

/* =========================================
 LUMINARY ICON (TIAGO EDITION - CLARA)
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

/* Cartão Mistério (Modo Secreto para Membros) */
.card-hidden {
  background: linear-gradient(135deg, #334155, #0f172a, #000000); /* Tom Dark Slate Premium */
  color: #f8fafc;
}

/* =========================================
   CARTAS IN-FORM (EQUIPA DO MÊS)
========================================= */   
.card-inform {
  background: linear-gradient(135deg, #111111 0%, #2a2a2a 50%, #000000 100%) !important;
  color: #facc15 !important;
  box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 15px rgba(250, 204, 21, 0.4) !important;
  border: 1px solid rgba(250, 204, 21, 0.5) !important;
}

.card-inform .fut-card-inner {
  border: 1px solid rgba(250, 204, 21, 0.3) !important;
  background: radial-gradient(circle at 50% 0%, rgba(42, 42, 42, 0.8) 0%, rgba(17, 17, 17, 0.9) 50%, #000 100%) !important;
  box-shadow: inset 0 0 15px rgba(250, 204, 21, 0.1);
}

.card-inform .stat-val { color: #facc15; text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
.card-inform .stat-label { color: #a1a1aa; }

.card-inform .fut-rating, .card-inform .fut-name {
  background: linear-gradient(to bottom, #fef08a 0%, #eab308 40%, #a16207 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.5));
}

.card-inform .silhouette { color: #eab308; opacity: 0.9; filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.2)); }
.card-inform .fut-bottom-bar { color: #eab308; font-weight: 900; letter-spacing: 2px; }


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