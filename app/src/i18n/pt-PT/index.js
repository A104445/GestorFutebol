export default {
    login: {
      appTitle: 'MatchDay',
      appSubtitle: 'A tua app de balneário. Organiza peladas, convoca amigos e domina o campo.',
      slideSquadTitle: 'O Teu Plantel',
      slideSquadSubtitle: 'Equilibra as equipas automaticamente e gere as presenças num piscar de olhos.',
      slideMvpTitle: 'Eleição do MVP',
      slideMvpSubtitle: 'No fim do jogo, avalia os teus colegas anonimamente e descobre quem leva a Bola de Ouro!',
      btnStart: 'Começar a Jogar',
      
      titleSignIn: 'Iniciar Sessão',
      titleSignUp: 'Criar Conta',
      subtitleSignIn: 'Bem-vindo de volta ao balneário',
      subtitleSignUp: 'Preenche os teus dados para entrar no plantel',
      
      labelName: 'O teu Nome (ex: Rui Costa)',
      labelEmail: 'Email',
      labelPassword: 'Password',
      
      errNameRequired: 'O nome é obrigatório',
      errEmailRequired: 'O email é obrigatório',
      errEmailInvalid: 'Introduz um email válido (ex: jogador@mail.com)',
      errPasswordRequired: 'A password é obrigatória',
      errPasswordLength: 'A password tem de ter no mínimo 6 caracteres',
      
      btnSubmitSignIn: 'Entrar no Balneário',
      btnSubmitSignUp: 'Registar e Entrar',
      
      toggleToSignIn: 'Já tenho conta? Iniciar Sessão',
      toggleToSignUp: 'Ainda não tens conta? Criar Conta',
      forgotPassword: 'Esqueceste-te da password?',
      
      btnGoogle: 'Continuar com o Google',
      
      resetTitle: 'Recuperar Password',
      resetSubtitle: 'Introduz o teu email. Vais receber um link seguro para redefinir a tua password.',
      resetEmailLabel: 'O teu Email',
      resetBtnCancel: 'Cancelar',
      resetBtnSend: 'Enviar Link',
      
      msgConfirmEmailTitle: 'Confirma o teu Email',
      msgConfirmEmailText: 'Conta criada com sucesso! Enviámos um link de confirmação para a tua caixa de correio. Por favor, valida o email antes de entrares no balneário.',
      msgConfirmEmailOk: 'Entendido',
      msgLoginSuccess: 'Sessão iniciada com sucesso!',
      msgResetSent: 'Email de recuperação enviado! Verifica a tua caixa de correio.',
    },
    selector: {
        myClubsTitle: 'Os Meus Clubes',
        myClubsSubtitle: 'Seleciona o teu balneário',
        roleAdmin: 'Administrador',
        roleMember: 'Membro',
        noClubs: 'Ainda não pertences a nenhum clube.',
        btnCreateClub: 'Criar Novo Clube',
        
        joinWithCodeTitle: 'Entrar com Código',
        joinWithCodeSubtitle: 'Recebeste um convite? Introduz o código para te juntares ao plantel.',
        inputCodeLabel: 'Código do Clube',
        inputCodePlaceholder: 'Ex: FC-1234',
        btnJoin: 'Aderir',
        
        modalCreateTitle: 'Novo Clube',
        inputClubName: 'Nome do Clube',
        btnCancel: 'Cancelar',
        btnCreate: 'Criar',
        
        errCreateClub: 'Erro ao criar clube: ',
        msgClubCreated: 'Clube criado com sucesso!',
        warnEnterCode: 'Por favor, introduz um código.',
        errInvalidCode: 'Código inválido! Confirma com o administrador do clube.',
        infoAlreadyMember: 'Já fazes parte ou já tens um pedido pendente no clube {clubName}!',
        errJoinClub: 'Erro ao entrar no clube: ',
        msgJoinSuccess: 'Pedido de adesão enviado para o {clubName}! Aguarda aprovação da equipa técnica.',
      },
      dashboard: {
        header: {
          loading: 'A aquecer os motores...',
          code: 'Código:',
          copyCodeTooltip: 'Copiar Código',
          shareTooltip: 'Enviar Convite',
          menuProfile: 'O Meu Perfil',
          menuSwitchClub: 'Mudar de Clube',
          menuLogout: 'Terminar Sessão',
          menuHelp: 'Pedir Ajuda',
          menuFeedback: 'Enviar Feedback',
          menuFaqs: 'FAQs'
        },
        empty: {
          noMatchesTitle: 'Sem jogos agendados',
          noMatchesDesc: 'Ainda não há nenhuma convocatória aberta neste clube.',
          btnFirstMatch: 'Agendar Primeiro Jogo',
          noFilterTitle: 'Nenhum jogo nesta vista',
          noFilterDesc: 'Não encontrámos partidas para esta pesquisa. Muda de aba para acederes aos jogos passados ou marca um novo desafio.'
        },
        filters: {
          calendar: 'Calendário',
          next: 'Próximo',
          voting: 'Votação',
          pending: 'Pendentes',
          month: 'Mês',
          all: 'Todos',
          closed: 'Finalizados'
        },
        match: {
          statusClosed: 'TERMINADO',
          statusVoting: 'EM VOTAÇÃO',
          statusOpen: 'ABERTO',
          location: 'Local',
          capacity: 'Lotação',
          price: 'Preço',
          btnSquad: 'Plantel',
          btnAskConfirm: 'Pedir Confirmação',
          btnEdit: 'Editar',
          btnDelete: 'Apagar',
          btnCloseMatch: 'Fechar Jogo',
          btnInscribed: 'Inscrito',
          btnPlay: 'Vou Jogar',
          btnFull: 'Completo',
          btnReopen: 'Editar / Reabrir Jogo',
          btnRate: 'Avaliar Jogo',
          btnVoted: 'Voto Registado',
          btnClosePolls: 'Encerrar Urnas e Apurar MVP',
          btnResults: 'Resultados'
        },
        notify: {
          codeCopied: 'Código {code} copiado! Podes colar no WhatsApp.',
          noCode: 'Este clube ainda não tem código de convite.',
          inviteCopied: 'Texto de convite copiado! Cola onde quiseres.',
          inviteTitle: 'Convite para a MatchDay',
          inviteMsg: 'Junta-te ao meu plantel "{clubName}" na MatchDay! ⚽\n\nClica no link para entrares automaticamente:\n{link}\n\n(Se a app pedir, o código é: {code})',
          matchDeleted: 'Jogo apagado do calendário.',
          deleteMatchTitle: 'Apagar Jogo',
          deleteMatchMsg: 'Tens a certeza? O jogo e todas as inscrições serão eliminados permanentemente.',
          btnYesDelete: 'Sim, Apagar',
          btnCancel: 'Cancelar',
          alertSent: 'Alertas enviados aos titulares!',
          askConfirmTitle: 'Pedir Confirmação',
          askConfirmMsg: 'Vais notificar os {count} jogadores atualmente inscritos para confirmarem presença. Avançar?',
          btnSendAlerts: 'Enviar Alertas',
          pushTitleConfirm: '🗓️ Confirmação de Presença',
          pushMsgConfirm: 'O jogo aproxima-se! Confirma se estás disponível ou se é necessário procurar um substituto.',
          // ... continuação de dashboard.notify:
          pwdMismatch: 'As passwords não coincidem.',
          profileUpdated: 'Ficha de jogador atualizada!',
          errSaveProfile: 'Erro ao guardar perfil: ',
          removePhotoTitle: 'Remover Foto',
          removePhotoMsg: 'Tens a certeza que queres apagar a tua foto de perfil?',
          btnYesRemovePhoto: 'Sim, Apagar',
          reopenMatchTitle: 'Reabrir Partida',
          reopenMatchMsg: 'Tens a certeza que queres reabrir este jogo para edição? Os golos atuais serão mantidos para poderes ajustá-los.',
          matchReopened: 'Jogo reaberto com sucesso!',
          clearTeamsTitle: 'Limpar Equipas',
          clearTeamsMsg: 'Tens a certeza que queres limpar as escolhas e colocar todos os jogadores sem equipa?',
          btnYesClear: 'Sim, Limpar',
          teamsCleared: 'Todas as escolhas foram limpas!',
          capacityFull: 'Calma Mister! O jogo só tem {count} vagas disponíveis.',
          playersConvoked: '{count} jogador(es) convocado(s) com sucesso!',
          paymentConfirmed: 'Pagamento confirmado!',
          paymentReverted: 'Pagamento revertido.',
          playerRemoved: 'Jogador removido do jogo.',
          playerAccepted: 'Jogador aceite no plantel!',
          requestRejected: 'Pedido rejeitado.',
          dayOccupiedTitle: 'Aviso: Dia Ocupado',
          dayOccupiedMsg: 'Já tens uma pelada agendada para este dia. Queres mesmo marcar outra e sobrepor jogos?',
          btnYesSchedule: 'Sim, Marcar na mesma',
          matchUpdatedFuture: 'Jogo atualizado e regras aplicadas ao calendário futuro!',
          matchUpdated: 'Jogo atualizado com sucesso!',
          matchCreated: 'Pelada agendada com sucesso!',
          blockedSecurity: 'Bloqueado por segurança! Correste o script no SQL Editor?',
          statsSavedLive: 'Estatísticas guardadas em tempo real!',
          errSaveData: 'Erro ao guardar dados.',
          errVoteMvp: 'Tens de eleger o teu Homem do Jogo (MVP)!',
          errAlreadyVoted: 'Já votaste neste jogo!',
          votesRegistered: 'Votos registados com sucesso!',
          closePollsTitle: 'Apurar Resultados',
          closePollsMsg: 'Esta ação encerra as urnas, calcula as médias, entrega o prémio de MVP e finaliza o jogo permanentemente. Confirmar?',
          btnClosePollsAction: 'Encerrar Votação',
          pollsClosed: 'Urnas fechadas! MVP apurado com sucesso.',
          pushTitleResults: '🏆 Resultados Finais',
          pushMsgResults: 'As urnas fecharam! Descobre quem foi o MVP e as notas da partida.',
          teamsSorted: 'Sorteio das equipas concluído!',
          errGenerateTeams: 'Erro ao gerar equipas.',
          memberPromoted: 'Membro promovido a Administrador!',
          demoteMemberTitle: 'Despromover Membro',
          demoteMemberMsg: 'Tens a certeza? Este membro vai perder acesso ao painel de gestão do clube.',
          memberDemoted: 'Membro removido da Equipa Técnica.',
          errRls: 'ERRO RLS: Não tens permissões na BD para alterar isto.',
          permsUpdated: 'Permissões atualizadas!',
          settingsSaved: 'Definições do clube guardadas!',
          squadLimitWarn: 'A lotação desceu para {limit}. Os excedentes da lista de Titulares foram removidos.',
          warnConfigRoutine: 'Configura primeiro o dia e hora fixos nas Definições do clube.',
          infoNoMoreDays: 'Não há mais dias correspondentes neste mês.',
          overlapTitle: 'Aviso de Sobreposição',
          overlapMsg: 'Já tens jogos marcados nos dias: {dates}. Queres gerar estes jogos na mesma e criar duplicados no calendário?',
          btnGenerateAnyway: 'Gerar na mesma',
          bulkGenerated: 'Geradas {count} peladas com Titulares confirmados!',
          noConvokedAlerts: 'Ainda não há jogadores convocados para alertar.'
        },
        modals: {
            createMatchTitle: 'Nova Convocatória',
            editMatchTitle: 'Editar Jogo',
            toggleDefaults: 'Bloquear com as definições do clube',
            dateLabel: 'Data e Hora',
            locationLabel: 'Local / Campo',
            capacityLabel: 'Lotação',
            startersLabel: 'Titulares',
            priceLabel: 'Preço (€)',
            teamAName: 'Nome Equipa A',
            teamBName: 'Equipa B',
            singleTeamName: 'Nome da Equipa',
            applyFuture: 'Aplicar preço, lotação e local a todos os jogos abertos seguintes',
            btnSaveEdit: 'Guardar Alterações',
            btnPublish: 'Publicar (Só 1)',
            btnGenerateBulk: 'Gerar Mês Inteiro',
            btnCancel: 'Cancelar',
            
            presencesTitle: 'Convocatória & Equipas',
            adminPanelTitle: 'Painel Administrativo: Inscrever Jogador do Plantel',
            btnSelectPlayers: 'Selecionar Jogadores do Plantel',
            noPlayersInscribed: 'Nenhum jogador inscrito ainda.',
            btnAutoBalance: 'Auto',
            btnClearTeams: 'Limpar',
            btnViewTactics: 'Ver Tática',
            btnViewSummary: 'Resumo',
            statusConfirmed: 'Confirmado',
            statusWaitlist: 'Lista de Espera',
            
            closeMatchTitle: 'Estatísticas do Jogo',
            goalsLabel: 'GOLOS',
            assistsLabel: 'ASSIS',
            btnSaveLive: 'Guardar (Ao Vivo)',
            btnCloseMatch: 'Encerrar Partida',
            
            staffTitle: 'Equipa Técnica & Permissões',
            addStaffTitle: 'Adicionar Membro à Equipa Técnica',
            searchPlayerPlaceholder: 'Procurar jogador no plantel...',
            btnPromote: 'Promover',
            roleOwner: 'Dono do Clube',
            roleAdmin: 'Administrador',
            permManageMatches: 'Gerir Jogos',
            permManageTeams: 'Gerir Plantel',
            permManageFinances: 'Tesoureiro',
            tooltipRemoveStaff: 'Remover da Equipa Técnica',
            
            requestsTitle: 'Pedidos de Entrada',
            reqSubtitle: 'Quer juntar-se ao plantel',
            tooltipReject: 'Rejeitar',
            tooltipApprove: 'Aprovar',
            noRequests: 'Não há pedidos pendentes.',
            
            settingsTitle: 'Definições do Clube',
            tabFinances: 'Financeiro',
            defaultPrice: 'Preço Padrão por Jogo (€)',
            monthlyPrice: 'Preço p/ Jogo p/ Mensalistas (€)',
            tabLogistics: 'Logística',
            defaultLocation: 'Campo / Local Fixo',
            maxCapacity: 'Lotação Máx',
            startersPerTeam: 'Titulares (Ex: 11, 7)',
            tabTeams: 'Equipas',
            tabColors: 'Cores Padrão',
            colorTeamA: 'Cor Equipa A',
            colorTeamB: 'Cor Equipa B',
            colorSingleTeam: 'Cor da Equipa',
            tabRoutine: 'Rotina Semanal',
            matchDay: 'Dia de Jogo Fixo',
            matchTime: 'Hora Fixa',
            tabFut: 'FUT Atributos',
            viewMode: 'Modo de Visualização',
            toggleHideRatings: 'Ocultar Ratings/OVR dos membros',
            toggleVoting: 'Ativar Votação de MVP pós-jogo',
            toggleSingleTeam: 'Modo de Equipa Única',
            toggleProAttributes: 'Ativar Atributos Detalhados',
            tabFixedStarters: 'Titulares Fixos',
            manageFixedStarters: 'Gerir Titulares Fixos',
            btnSaveSettings: 'Guardar Definições',
            
            votingTitle: 'Votação & MVP',
            votingDesc: 'Dá uma nota de 1 a 10 aos teus colegas de equipa e escolhe quem merece levar a bola para casa (MVP).',
            votingAnonInfo: 'A tua votação é 100% anónima.',
            labelMVP: 'MVP',
            btnSubmitVotes: 'Submeter Votos',
            
            resultsTitle: 'Resumo da Partida',
            resultsGoals: 'Golos',
            resultsAssists: 'Assis',
            resultsRating: 'NOTA',
            
            summaryTitle: 'Resumo das Equipas',
            tabList: 'Ver Lista',
            tabPitch: 'Ver Tática',
            teamTitulares: 'Em Campo (Titulares)',
            teamBanco: 'Banco de Suplentes',
            avgOvr: 'Média OVR:',
            unassignedPlayer: 'Nenhum jogador atribuído',
            btnBothTeams: 'Ambas',
            
            profileTitle: 'O Meu Perfil',
            personalData: 'Dados Pessoais',
            playerName: 'Nome de Jogador',
            fieldPrefs: 'Preferências de Campo',
            genPosition: 'Posição Geral',
            specPosition: 'Posição Específica',
            prefFoot: 'Pé Preferido',
            security: 'Segurança',
            newPassword: 'Nova Password',
            newPasswordPlaceholder: 'Deixa em branco para manter',
            confirmPassword: 'Confirmar Nova Password',
            btnSaveProfile: 'Guardar',
            
            convokTitle: 'Convocar Jogadores para o Jogo',
            convokSearch: 'Pesquisar no plantel...',
            btnInviteSelected: 'Convidar Selecionados',
            
            squadModalTitle: 'Selecionar Titulares Fixos',
            squadSearch: 'Pesquisar jogador...',
            btnDone: 'Concluir',
            
            faqTitle: 'Perguntas Frequentes (FAQs)',
            btnUnderstood: 'Entendido'
          },
        faqs: [
            {
              icon: 'phone_android',
              q: 'Como instalar a aplicação no telemóvel (PWA)?',
              a: 'Podes adicionar a aplicação diretamente ao ecrã principal do teu telemóvel para uma experiência rápida e imersiva. No Android, abre o menu do browser e clica em "Instalar aplicação" ou "Adicionar ao ecrã principal". No iPhone (iOS), clica no botão de partilha do Safari e seleciona "Adicionar ao Ecrã Principal".'
            },
            {
              icon: 'vpn_key',
              q: 'Como criar ou entrar num clube de futebol?',
              a: 'No ecrã de seleção de clubes, podes criar um novo clube definindo o seu nome ou entrar num clube privado existente introduzindo o código de convite de 8 carateres fornecido pelo administrador.'
            },
            {
              icon: 'verified_user',
              q: 'O que acontece após enviar o pedido de adesão a um clube?',
              a: 'O teu pedido fica pendente de aprovação. Os administradores ou o dono do clube receberão um alerta e poderão aprovar ou rejeitar a tua entrada no balneário antes de poderes participar nas peladas.'
            },
            {
              icon: 'manage_accounts',
              q: 'Como funciona a Equipa Técnica e as Permissões?',
              a: 'O dono do clube e os administradores podem gerir permissões granulares para outros membros. É possível atribuir acessos específicos para gerir jogos, gerir o plantel ou assumir o papel de tesoureiro do clube.'
            },
            {
              icon: 'account_circle',
              q: 'Como posso personalizar o meu perfil de jogador?',
              a: 'No menu lateral, clica em "O Meu Perfil". Podes alterar o teu nome de jogador, carregar uma fotografia personalizada para o teu avatar, definir a tua posição geral e específica, o pé preferido e atualizar a tua password de acesso.'
            },
            {
              icon: 'calendar_today',
              q: 'Como agendar uma nova pelada ou jogo?',
              a: 'Os administradores podem clicar no botão flutuante "+" no calendário para criar uma nova convocatória. Podes definir a data, hora, local, lotação máxima, número de titulares por equipa, preço por jogador e os nomes das equipas.'
            },
            {
              icon: 'auto_mode',
              q: 'Como funciona a geração de jogos para o mês inteiro?',
              a: 'Configurando um dia da semana e hora fixos nas definições do clube, o sistema consegue gerar automaticamente um lote com todas as peladas correspondentes ao mês, pré-inscrevendo de imediato os titulares fixos definidos.'
            },
            {
              icon: 'how_to_reg',
              q: 'Como me inscrevo ou desinscrevo de uma pelada?',
              a: 'Nos cartões dos jogos abertos, podes clicar em "Vou Jogar" para garantir o teu lugar no limite das vagas disponíveis. Os administradores também podem inscrever diretamente qualquer elemento do plantel através do modal de convocatória.'
            },
            {
              icon: 'sports_soccer',
              q: 'Como funciona o Sorteio Automático de Equipas?',
              a: 'No modal de convocatória e equipas, os administradores podem clicar no botão "Auto". O algoritmo agrupa os jogadores por setores (defesas, médios, avançados) e equilibra as equipas de forma justa com base no Overall (OVR) de cada atleta.'
            },
            {
              icon: 'sports',
              q: 'O que é o Modo de Equipa Única?',
              a: 'Ideal para treinos livres ou quando o grupo não se divide em Equipas A e B. Ao ativar esta opção nas definições, os convocados são geridos entre "Em Campo (Titulares)" com suporte a esquemas táticos (ex: 4-3-3, 4-4-2) e o "Banco de Suplentes".'
            },
            {
              icon: 'groups_2',
              q: 'O que são os Jogadores Virtuais?',
              a: 'São atletas criados manualmente pelos administradores para preencher vagas na aplicação quando um colega ocasional ainda não tem conta registada na app. Possuem posições e atributos próprios para entrarem nas contas e simulações.'
            },
            {
              icon: 'stars',
              q: 'Para que servem os Titulares Fixos?',
              a: 'Nas definições do clube, podes selecionar uma base fixa de jogadores que compõem habitualmente o plantel. Estes jogadores podem ser automaticamente inscritos e contabilizados de forma facilitada ao criar novos eventos.'
            },
            {
              icon: 'sports_esports',
              q: 'Como funcionam as Cartas FUT e os Atributos dos Jogadores?',
              a: 'Cada jogador do plantel possui uma carta interativa ao estilo Ultimate Team (FUT). Os administradores podem editar os atributos do jogador, e o sistema calcula automaticamente o Overall (OVR) ponderado com base na posição e nos pesos específicos de cada setor.'
            },
            {
              icon: 'tune',
              q: 'Qual é a diferença entre o Modo Simples e o Modo Pro (Detalhado)?',
              a: 'O Modo Simples gere os 6 atributos principais (Ritmo, Remate, Passe, Drible, Defesa, Físico). O Modo Pro expande para 29 sub-atributos detalhados in-game (como aceleração, finalização, agilidade). A aplicação utiliza colunas duplas na BD, permitindo alternar modos sem perdas.'
            },
            {
              icon: 'visibility_off',
              q: 'Posso ocultar os atributos e Ratings dos membros?',
              a: 'Sim. Nas definições do clube existe um botão para "Ocultar Ratings/OVR". Quando ativado, os jogadores comuns deixam de ver os valores numéricos nas cartas do plantel e nos jogos, mantendo a privacidade, enquanto os administradores continuam a ter acesso total.'
            },
            {
              icon: 'style',
              q: 'O que significam os visuais especiais das cartas (Gold, Silver, Bronze, In-Form, Icon)?',
              a: 'As cores da carta adaptam-se ao tier do Overall (Ouro para OVR 80+, Prata para 70+, Bronze abaixo). Além disso, os três melhores jogadores do mês anterior recebem o estatuto "In-Form", e existem edições "Icon" detetadas pelo nome.'
            },
            {
              icon: 'sports_score',
              q: 'Como fechar uma partida e registar golos e assistências?',
              a: 'Quando uma pelada termina, um administrador pode clicar em "Fechar Jogo". Abre-se um painel interativo onde é possível ajustar em tempo real os golos e assistências de cada atleta, calculando automaticamente o resultado final da partida.'
            },
            {
              icon: 'how_to_vote',
              q: 'Como funciona a Votação de MVP e Avaliação Pós-Jogo?',
              a: 'Após o fecho inicial do jogo por um admin, abre-se a fase de votação. Cada jogador pode atribuir notas aos colegas e eleger anonimamente o Homem do Jogo (MVP). No final, o admin encerra as urnas para apurar os vencedores.'
            },
            {
              icon: 'leaderboard',
              q: 'Como é calculado o Ranking e as Estatísticas da Época?',
              a: 'O ecrã de estatísticas compila o desempenho de todos os jogos fechados. Cada vitória atribui 3 pontos, empate 1 ponto e derrota 0 pontos. Podes ordenar por pontos, golos, assistências ou notas médias, e filtrar por mês.'
            },
            {
              icon: 'account_balance_wallet',
              q: 'Como funciona o módulo de Tesouraria e Faturação?',
              a: 'A tesouraria gere dois modelos: o pagamento por jogo e a gestão de mensalidades para os titulares fixos. O sistema calcula o valor esperado com base no número de jogos do mês e permite dar baixa aos pagamentos efetuados.'
            },
            {
              icon: 'notifications_active',
              q: 'Como funcionam os Lembretes de Pagamento e Disponibilidade?',
              a: 'Através das notificações Push integradas, os admins e tesoureiros podem enviar avisos automáticos e segmentados para o telemóvel dos jogadores que tenham dívidas na tesouraria ou lembretes para confirmar a presença.'
            },
            {
              icon: 'sync',
              q: 'A aplicação funciona offline ou atualiza em tempo real?',
              a: 'A aplicação utiliza WebSockets e subscrições em tempo real do Supabase. Sempre que alguém se inscreve num jogo ou regista um pagamento, o ecrã de todos os utilizadores conectados atualiza instantaneamente.'
            },
            {
              icon: 'support_agent',
              q: 'Como posso contactar o suporte ou enviar sugestões?',
              a: 'No menu lateral do clube, tens botões diretos dedicados para "Pedir Ajuda" e "Enviar Feedback", abrindo automaticamente o teu cliente de email pré-configurado com o endereço de suporte da aplicação.'
            },
            {
              icon: 'lock_reset',
              q: 'O que fazer se perder o acesso à minha conta?',
              a: 'No ecrã de login, podes utilizar a opção de recuperação de password introduzindo o teu email para receberes instruções de redefinição, ou optar pelo início de sessão rápido através da tua conta Google.'
            },
            {
              icon: 'security',
              q: 'Os meus dados e as votações estão seguros?',
              a: 'Sim. Toda a aplicação está protegida por políticas rigorosas de segurança ao nível de base de dados (Row Level Security), garantindo que apenas os membros autorizados de cada clube conseguem visualizar e editar as informações.'
            }
          ]
      },
      layout: {
        tabs: {
          games: 'Jogos',
          players: 'Plantel',
          stats: 'Estatísticas',
          finances: 'Tesouraria'
        },
        pwa: {
          installTitle: 'Instalar Aplicação',
          installDescIOS: 'Clica em Partilha e "Adicionar ao Ecrã Principal"',
          installDescAndroid: 'Adiciona ao ecrã para uma experiência rápida!',
          btnInstall: 'Instalar'
        },
        push: {
          title: 'Ativar Alertas',
          desc: 'Recebe avisos de convocatórias e quotas.',
          btnEnable: 'Ativar',
          errNotSupported: 'O teu browser atual não suporta Notificações Web.',
          errDenied: 'Permissão negada. Ativa as notificações nas definições do browser.',
          errNoWorker: 'O Service Worker não está ativo.',
          successEnabled: 'Alertas ativados com sucesso!',
          errGeneric: 'Falha ao ativar notificações.'
        }
      },
      // ...
    players: {
        header: {
          title: 'Plantel',
          btnCreateVirtual: 'Criar Virtual'
        },
        card: {
          tooltipVirtual: 'Jogador Virtual Manual'
        },
        modals: {
          createVirtualTitle: 'Adicionar Jogador Virtual',
          createVirtualName: 'Nome do Jogador',
          createVirtualGenPos: 'Posição Geral',
          createVirtualSpecPos: 'Posição Específica',
          createVirtualBtnCancel: 'Cancelar',
          createVirtualBtnSave: 'Contratar',
  
          editTitle: 'Editar Jogador',
          editOverall: 'OVERALL',
          editModeProDesc: 'Modo Pro: Edição Detalhada',
          
          // Atributos base
          pace: 'PAC',
          shooting: 'SHO',
          passing: 'PAS',
          dribbling: 'DRI',
          defending: 'DEF',
          physical: 'PHY',
          
          // Atributos GR
          diving: 'DIV',
          handling: 'HAN',
          kicking: 'KIC',
          reflexes: 'REF',
          speed: 'SPD',
          positioning: 'POS',
  
          // Categorias expandidas (Pro Mode)
          catPace: 'Ritmo (PAC)',
          accel: 'Aceleração',
          sprint: 'Velocidade Sprint',
          
          catShooting: 'Remate (SHO)',
          pos: 'Posicionamento',
          finish: 'Finalização',
          shotPower: 'Força Remate',
          longShots: 'Remates Longe',
          volleys: 'Voleios',
          penalties: 'Penaltis',
          
          catPassing: 'Passe (PAS)',
          vision: 'Visão de Jogo',
          crossing: 'Cruzamento',
          freeKick: 'Livre Direto',
          shortPass: 'Passe Curto',
          longPass: 'Passe Longo',
          curve: 'Efeito',
          
          catDribbling: 'Drible (DRI)',
          agility: 'Agilidade',
          balance: 'Equilíbrio',
          reactions: 'Reações',
          ballControl: 'Controlo de Bola',
          dribble: 'Drible',
          composure: 'Compostura',
          
          catDefending: 'Defesa (DEF)',
          interceptions: 'Interceções',
          heading: 'Precisão Cabeceamento',
          defAware: 'Noção Defensiva',
          standTackle: 'Corte em Pé',
          slideTackle: 'Corte Carrinho',
          
          catPhysical: 'Físico (PHY)',
          jumping: 'Impulsão',
          stamina: 'Resistência',
          strength: 'Força',
          aggression: 'Agressividade',
  
          btnRemove: 'Remover',
          btnCancel: 'Cancelar',
          btnSave: 'Guardar'
        },
        notify: {
          onlyStaffEdit: 'Apenas a equipa técnica pode editar jogadores.',
          virtualHired: 'Jogador Virtual contratado!',
          statsUpdated: 'Atributos FUT atualizados no Clube!',
          errSave: 'Erro ao guardar: ',
          errOwnerRemove: 'Impossível remover o Dono do clube.',
          confirmRemoveTitle: 'Remover Jogador',
          confirmRemoveMsg: 'Tens a certeza que queres expulsar o {name} do plantel? Esta ação pode ser desfeita se ele voltar a pedir adesão.',
          btnYesRemove: 'Sim, Remover',
          btnCancel: 'Cancelar',
          playerRemoved: 'Jogador removido do plantel!'
        },
        categories: [
          { label: 'Excelente', value: 96 },
          { label: 'Muito Bom', value: 90 },
          { label: 'Bom', value: 82 },
          { label: 'Médio', value: 70 },
          { label: 'Mau', value: 55 },
          { label: 'Péssimo', value: 40 }
        ]
      },
      // ... add after the 'players' block:
    finances: {
        headerTitle: 'Tesouraria',
        tabs: {
          resumo: 'Jogos',
          mensalidades: 'Mensalidades'
        },
        loading: 'A carregar finanças...',
        matches: {
          pendingPayments: 'Pagamentos Pendentes',
          allSettledTitle: 'Tudo Liquidado!',
          allSettledDesc: 'Os mensalistas foram filtrados. Nenhum jogador ocasional deve jogos.',
          missing: 'Faltam {count}',
          value: 'Valor: ',
          btnPaid: 'Pago'
        },
        monthly: {
          btnStarters: 'Titulares',
          gamesInMonth: 'Jogos no Mês:',
          monthlyFee: 'Mensalidade:',
          missingPayTitle: 'Falta Pagar',
          btnReminders: 'Lembretes de Pagamento',
          allPaidUp: 'Todos os mensalistas têm as quotas em dia!',
          alreadyPaidTitle: 'Já Pagou',
          noPaymentsThisMonth: 'Nenhum pagamento registado este mês.'
        },
        configModal: {
          title: 'Modo de Pagamento (Titulares)',
          noStartersDef: 'Ainda não definiste quem são os Titulares Fixos nas Definições do Clube.',
          optMonthly: 'Mensalista',
          optPerMatch: 'Paga ao Jogo'
        },
        notify: {
          errRestricted: 'Acesso restrito à tesouraria.',
          infoSearchingDebtors: 'A procurar jogadores com pagamentos pendentes...',
          warnNoDebtorsApp: 'Não há jogadores com conta na app a dever para alertar.',
          warnNoPushEnabled: 'Os devedores não têm as notificações ativadas no telemóvel.',
          pushTitleMatchDay: 'MatchDay',
          pushMsgMonthly: 'Tens um pagamento pendente referente a {month}.',
          pushMsgMatch: 'Tens um pagamento pendente referente ao jogo de {date} em {location}.',
          alertsSent: 'Alertas enviados com sucesso para {count} devedores!',
          errCriticalPush: 'Erro crítico ao enviar notificações.',
          errSupabase: 'Erro Supabase: ',
          configSavedMonth: 'Configuração guardada para este mês!',
          paymentRegistered: 'Pagamento registado!',
          matchLiquidated: 'Jogo totalmente liquidado!'
        }
      },
      stats: {
        headerTitle: 'Estatísticas da Época',
        noStatsTitle: 'Sem Dados Estatísticos',
        noStatsDesc: 'Ainda não há jogos fechados com resultados para calcular o ranking.',
        timeFilterFullSeason: 'Época Inteira',
        columns: {
          player: 'Jogador',
          matches: 'J',
          matchesTooltip: 'Jogos Realizados',
          goals: 'G',
          goalsTooltip: 'Golos Marcados',
          assists: 'A',
          assistsTooltip: 'Assistências',
          rating: '★',
          ratingTooltip: 'Média de Notas (1 a 10)',
          mvp: 'MVP',
          mvpTooltip: 'Vezes Homem do Jogo',
          wins: 'V',
          winsTooltip: 'Vitórias',
          draws: 'E',
          drawsTooltip: 'Empates',
          losses: 'D',
          lossesTooltip: 'Derrotas',
          points: 'PTS'
        },
        unknownPlayer: 'Desconhecido'
      },
      days: [
        { label: 'Segunda', value: 1 }, { label: 'Terça', value: 2 }, { label: 'Quarta', value: 3 },
        { label: 'Quinta', value: 4 }, { label: 'Sexta', value: 5 }, { label: 'Sábado', value: 6 }, { label: 'Domingo', value: 7 }
      ],
      positions: ['Guarda-Redes', 'Defesa', 'Médio', 'Avançado'],
      feet: ['Direito', 'Esquerdo', 'Ambos'],
      specPositions: {
        gr: 'Guarda-Redes (GR)',
        dc: 'Defesa Central (DC)',
        ld: 'Lateral Direito (LD)',
        le: 'Lateral Esquerdo (LE)',
        ad: 'Ala Direito (AD)',
        ae: 'Ala Esquerdo (AE)',
        mdc: 'Trinco / Defensivo (MDC)',
        mc: 'Médio Centro (MC)',
        mco: 'Médio Ofensivo (MCO)',
        md: 'Médio Direito (MD)',
        me: 'Médio Esquerdo (ME)',
        pl: 'Ponta de Lança (PL)',
        sa: 'Segundo Avançado (SA)',
        ed: 'Extremo Direito (ED)',
        ee: 'Extremo Esquerdo (EE)'
      },
      // ...
    join: {
        processing: 'A processar convite...',
        entering: 'A entrar no teu novo clube de futebol.',
        errLogin: 'Inicia sessão ou cria conta para entrar no clube!',
        errSend: 'Erro ao enviar pedido: ',
        infoPending: 'Já tens um pedido pendente ou já estás neste clube.',
        success: 'Pedido de adesão enviado com sucesso! Aguarda aprovação.'
      },
      error404: {
        title: 'Oops. Não há nada aqui...',
        btnHome: 'Voltar ao Início'
      },
      common: {
        language: 'Idioma',
        system: 'Padrão do Sistema',
      }

  }