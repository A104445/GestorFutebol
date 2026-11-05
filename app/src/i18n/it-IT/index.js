export default {
    login: {
      appTitle: 'MatchDay',
      appSubtitle: 'La tua app per lo spogliatoio. Organizza partitelle, invita amici e domina il campo.',
      slideSquadTitle: 'La Tua Rosa',
      slideSquadSubtitle: 'Equilibra le squadre automaticamente e gestisci le presenze in un batter d\'occhio.',
      slideMvpTitle: 'Elezione del MVP',
      slideMvpSubtitle: 'A fine partita, valuta i tuoi compagni in modo anonimo e scopri chi vince il Pallone d\'Oro!',
      btnStart: 'Inizia a Giocare',
      
      titleSignIn: 'Accedi',
      titleSignUp: 'Crea Account',
      subtitleSignIn: 'Bentornato nello spogliatoio',
      subtitleSignUp: 'Inserisci i tuoi dati per unirti alla squadra',
      
      labelName: 'Il tuo Nome (es: Baggio)',
      labelEmail: 'Email',
      labelPassword: 'Password',
      
      errNameRequired: 'Il nome è obbligatorio',
      errEmailRequired: 'L\'email è obbligatoria',
      errEmailInvalid: 'Inserisci un\'email valida (es: giocatore@mail.com)',
      errPasswordRequired: 'La password è obbligatoria',
      errPasswordLength: 'La password deve avere almeno 6 caratteri',
      
      btnSubmitSignIn: 'Entra nello Spogliatoio',
      btnSubmitSignUp: 'Registrati ed Entra',
      
      toggleToSignIn: 'Hai già un account? Accedi',
      toggleToSignUp: 'Non hai un account? Crea Account',
      forgotPassword: 'Password dimenticata?',
      
      btnGoogle: 'Continua con Google',
      
      resetTitle: 'Recupera Password',
      resetSubtitle: 'Inserisci la tua email. Riceverai un link sicuro per reimpostare la tua password.',
      resetEmailLabel: 'La tua Email',
      resetBtnCancel: 'Annulla',
      resetBtnSend: 'Invia Link',
      
      msgConfirmEmailTitle: 'Conferma la tua Email',
      msgConfirmEmailText: 'Account creato con successo! Abbiamo inviato un link di conferma alla tua casella di posta. Per favore, convalida l\'email prima di entrare nello spogliatoio.',
      msgConfirmEmailOk: 'Capito',
      msgLoginSuccess: 'Accesso effettuato con successo!',
      msgResetSent: 'Email di recupero inviata! Controlla la tua casella di posta.',
    },
    selector: {
      myClubsTitle: 'I Miei Club',
      myClubsSubtitle: 'Seleziona il tuo spogliatoio',
      roleAdmin: 'Amministratore',
      roleMember: 'Membro',
      noClubs: "Non appartieni ancora a nessun club.",
      btnCreateClub: 'Crea Nuovo Club',
      
      joinWithCodeTitle: 'Entra con Codice',
      joinWithCodeSubtitle: 'Hai ricevuto un invito? Inserisci il codice per unirti alla squadra.',
      inputCodeLabel: 'Codice del Club',
      inputCodePlaceholder: 'Es: FC-1234',
      btnJoin: 'Unisciti',
      
      modalCreateTitle: 'Nuovo Club',
      inputClubName: 'Nome del Club',
      btnCancel: 'Annulla',
      btnCreate: 'Crea',
      
      errCreateClub: 'Errore durante la creazione del club: ',
      msgClubCreated: 'Club creato con successo!',
      warnEnterCode: 'Per favore, inserisci un codice.',
      errInvalidCode: 'Codice non valido! Conferma con l\'amministratore del club.',
      infoAlreadyMember: 'Fai già parte o hai una richiesta in sospeso per il club {clubName}!',
      errJoinClub: 'Errore durante l\'adesione al club: ',
      msgJoinSuccess: 'Richiesta di adesione inviata a {clubName}! Attendi l\'approvazione dello staff.',
    },
    dashboard: {
      header: {
        loading: 'Scaldando i motori...',
        code: 'Codice:',
        copyCodeTooltip: 'Copia Codice',
        shareTooltip: 'Invia Invito',
        menuProfile: 'Il Mio Profilo',
        menuSwitchClub: 'Cambia Club',
        menuLogout: 'Esci',
        menuHelp: 'Chiedi Aiuto',
        menuFeedback: 'Invia Feedback',
        menuFaqs: 'FAQ'
      },
      empty: {
        noMatchesTitle: 'Nessuna partita in programma',
        noMatchesDesc: 'Non ci sono ancora convocazioni aperte in questo club.',
        btnFirstMatch: 'Programma Prima Partita',
        noFilterTitle: 'Nessuna partita in questa vista',
        noFilterDesc: 'Non abbiamo trovato partite per questa ricerca. Cambia scheda per accedere alle partite passate o programmane una nuova.'
      },
      filters: {
        calendar: 'Calendario',
        next: 'Prossima',
        voting: 'Votazione',
        pending: 'In Sospeso',
        month: 'Mese',
        all: 'Tutte',
        closed: 'Concluse'
      },
      match: {
        statusClosed: 'TERMINATA',
        statusVoting: 'IN VOTAZIONE',
        statusOpen: 'APERTA',
        location: 'Luogo',
        capacity: 'Posti',
        price: 'Prezzo',
        btnSquad: 'Rosa',
        btnAskConfirm: 'Chiedi Conferma',
        btnEdit: 'Modifica',
        btnDelete: 'Elimina',
        btnCloseMatch: 'Chiudi Partita',
        btnInscribed: 'Iscritto',
        btnPlay: 'Gioco',
        btnFull: 'Completo',
        btnReopen: 'Modifica / Riapri Partita',
        btnRate: 'Valuta Partita',
        btnVoted: 'Voto Registrato',
        btnClosePolls: 'Chiudi Urne e MVP',
        btnResults: 'Risultati'
      },
      notify: {
        codeCopied: 'Codice {code} copiato! Puoi incollarlo su WhatsApp.',
        noCode: 'Questo club non ha ancora un codice di invito.',
        inviteCopied: 'Testo di invito copiato! Incollalo dove vuoi.',
        inviteTitle: 'Invito a MatchDay',
        inviteMsg: 'Unisciti alla mia squadra "{clubName}" su MatchDay! ⚽\n\nClicca sul link per entrare automaticamente:\n{link}\n\n(Se l\'app te lo chiede, il codice è: {code})',
        matchDeleted: 'Partita eliminata dal calendario.',
        deleteMatchTitle: 'Elimina Partita',
        deleteMatchMsg: 'Sei sicuro? La partita e tutte le iscrizioni saranno eliminate permanentemente.',
        btnYesDelete: 'Sì, Elimina',
        btnCancel: 'Annulla',
        alertSent: 'Avvisi inviati ai titolari!',
        askConfirmTitle: 'Chiedi Conferma',
        askConfirmMsg: 'Stai per notificare i {count} giocatori attualmente iscritti per confermare la loro presenza. Procedere?',
        btnSendAlerts: 'Invia Avvisi',
        pushTitleConfirm: '🗓️ Conferma Presenza',
        pushMsgConfirm: 'La partita si avvicina! Conferma se sei disponibile o se dobbiamo cercare un sostituto.',
        pwdMismatch: 'Le password non corrispondono.',
        profileUpdated: 'Profilo giocatore aggiornato!',
        errSaveProfile: 'Errore durante il salvataggio del profilo: ',
        removePhotoTitle: 'Rimuovi Foto',
        removePhotoMsg: 'Sei sicuro di voler eliminare la tua foto profilo?',
        btnYesRemovePhoto: 'Sì, Elimina',
        reopenMatchTitle: 'Riapri Partita',
        reopenMatchMsg: 'Sei sicuro di voler riaprire questa partita per modificarla? I gol attuali saranno mantenuti per permetterti di regolarli.',
        matchReopened: 'Partita riaperta con successo!',
        clearTeamsTitle: 'Svuota Squadre',
        clearTeamsMsg: 'Sei sicuro di voler cancellare tutte le scelte e lasciare tutti i giocatori senza squadra?',
        btnYesClear: 'Sì, Svuota',
        teamsCleared: 'Tutte le scelte sono state cancellate!',
        capacityFull: 'Calma Mister! La partita ha solo {count} posti disponibili.',
        playersConvoked: '{count} giocatore/i convocato/i con successo!',
        paymentConfirmed: 'Pagamento confermato!',
        paymentReverted: 'Pagamento annullato.',
        playerRemoved: 'Giocatore rimosso dalla partita.',
        playerAccepted: 'Giocatore accettato nella squadra!',
        requestRejected: 'Richiesta respinta.',
        dayOccupiedTitle: 'Avviso: Giorno Occupato',
        dayOccupiedMsg: 'Hai già una partitella in programma per questo giorno. Vuoi davvero programmarne un\'altra e sovrapporre le partite?',
        btnYesSchedule: 'Sì, Programma comunque',
        matchUpdatedFuture: 'Partita aggiornata e regole applicate al calendario futuro!',
        matchUpdated: 'Partita aggiornata con successo!',
        matchCreated: 'Partitella programmata con successo!',
        blockedSecurity: 'Bloccato per sicurezza! Hai eseguito lo script nell\'SQL Editor?',
        statsSavedLive: 'Statistiche salvate in tempo reale!',
        errSaveData: 'Errore durante il salvataggio dei dati.',
        errVoteMvp: 'Devi eleggere il tuo Uomo Partita (MVP)!',
        errAlreadyVoted: 'Hai già votato in questa partita!',
        votesRegistered: 'Voti registrati con successo!',
        closePollsTitle: 'Calcola Risultati',
        closePollsMsg: 'Questa azione chiude le urne, calcola le medie, assegna il premio MVP e conclude la partita in modo permanente. Confermi?',
        btnClosePollsAction: 'Chiudi Votazione',
        pollsClosed: 'Urne chiuse! MVP calcolato con successo.',
        pushTitleResults: '🏆 Risultati Finali',
        pushMsgResults: 'Le urne sono chiuse! Scopri chi è l\'MVP e i voti della partita.',
        teamsSorted: 'Sorteggio delle squadre completato!',
        errGenerateTeams: 'Errore durante la generazione delle squadre.',
        memberPromoted: 'Membro promosso ad Amministratore!',
        demoteMemberTitle: 'Declassa Membro',
        demoteMemberMsg: 'Sei sicuro? Questo membro perderà l\'accesso al pannello di gestione del club.',
        memberDemoted: 'Membro rimosso dallo Staff Tecnico.',
        errRls: 'ERRORE RLS: Non hai i permessi nel DB per modificare questo.',
        permsUpdated: 'Permessi aggiornati!',
        settingsSaved: 'Impostazioni del club salvate!',
        squadLimitWarn: 'I posti sono stati ridotti a {limit}. I giocatori in eccesso dalla lista dei Titolari sono stati rimossi.',
        warnConfigRoutine: 'Configura prima il giorno e l\'ora fissi nelle Impostazioni del club.',
        infoNoMoreDays: 'Non ci sono altri giorni corrispondenti in questo mese.',
        overlapTitle: 'Avviso di Sovrapposizione',
        overlapMsg: 'Hai già partite in programma nei giorni: {dates}. Vuoi generare queste partite comunque e creare duplicati nel calendario?',
        btnGenerateAnyway: 'Genera comunque',
        bulkGenerated: 'Generate {count} partitelle con Titolari confermati!',
        noConvokedAlerts: 'Non ci sono ancora giocatori convocati da avvisare.'
      },
      modals: {
        createMatchTitle: 'Nuova Convocazione',
        editMatchTitle: 'Modifica Partita',
        toggleDefaults: 'Blocca con le impostazioni del club',
        dateLabel: 'Data e Ora',
        locationLabel: 'Luogo / Campo',
        capacityLabel: 'Posti',
        startersLabel: 'Titolari',
        priceLabel: 'Prezzo (€)',
        teamAName: 'Nome Squadra A',
        teamBName: 'Squadra B',
        singleTeamName: 'Nome della Squadra',
        applyFuture: 'Applica prezzo, posti e luogo alle prossime partite aperte',
        btnSaveEdit: 'Salva Modifiche',
        btnPublish: 'Pubblica (Solo 1)',
        btnGenerateBulk: 'Genera Mese Intero',
        btnCancel: 'Annulla',
        
        presencesTitle: 'Convocazione & Squadre',
        adminPanelTitle: 'Pannello Admin: Iscrivi Giocatore della Rosa',
        btnSelectPlayers: 'Seleziona Giocatori della Rosa',
        noPlayersInscribed: 'Nessun giocatore ancora iscritto.',
        btnAutoBalance: 'Auto',
        btnClearTeams: 'Svuota',
        btnViewTactics: 'Vedi Tattica',
        btnViewSummary: 'Riepilogo',
        statusConfirmed: 'Confermato',
        statusWaitlist: 'Lista d\'Attesa',
        
        closeMatchTitle: 'Statistiche Partita',
        goalsLabel: 'GOL',
        assistsLabel: 'ASSIST',
        btnSaveLive: 'Salva (In Diretta)',
        btnCloseMatch: 'Chiudi Partita',
        
        staffTitle: 'Staff Tecnico & Permessi',
        addStaffTitle: 'Aggiungi Membro allo Staff',
        searchPlayerPlaceholder: 'Cerca giocatore nella rosa...',
        btnPromote: 'Promuovi',
        roleOwner: 'Proprietario del Club',
        roleAdmin: 'Amministratore',
        permManageMatches: 'Gestisci Partite',
        permManageTeams: 'Gestisci Rosa',
        permManageFinances: 'Tesoriere',
        tooltipRemoveStaff: 'Rimuovi dallo Staff Tecnico',
        
        requestsTitle: 'Richieste di Adesione',
        reqSubtitle: 'Vuole unirsi alla rosa',
        tooltipReject: 'Rifiuta',
        tooltipApprove: 'Approva',
        noRequests: 'Nessuna richiesta in sospeso.',
        
        settingsTitle: 'Impostazioni del Club',
        tabFinances: 'Finanze',
        defaultPrice: 'Prezzo Predefinito per Partita (€)',
        monthlyPrice: 'Prezzo per Partita (Mensili) (€)',
        tabLogistics: 'Logistica',
        defaultLocation: 'Campo Predefinito',
        maxCapacity: 'Posti Max',
        startersPerTeam: 'Titolari (Es: 11, 7)',
        tabTeams: 'Squadre',
        tabColors: 'Colori Predefiniti',
        colorTeamA: 'Colore Squadra A',
        colorTeamB: 'Colore Squadra B',
        colorSingleTeam: 'Colore della Squadra',
        tabRoutine: 'Routine Settimanale',
        matchDay: 'Giorno Partita Fisso',
        matchTime: 'Ora Fissa',
        tabFut: 'Attributi FUT',
        viewMode: 'Modalità di Visualizzazione',
        toggleHideRatings: 'Nascondi Valutazioni/OVR ai membri',
        toggleVoting: 'Attiva Votazione MVP post-partita',
        toggleSingleTeam: 'Modalità Squadra Singola',
        toggleProAttributes: 'Attiva Attributi Dettagliati',
        tabFixedStarters: 'Titolari Fissi',
        manageFixedStarters: 'Gestisci Titolari Fissi',
        btnSaveSettings: 'Salva Impostazioni',
        
        votingTitle: 'Votazione & MVP',
        votingDesc: 'Dai un voto da 1 a 10 ai tuoi compagni di squadra e scegli chi merita di portarsi a casa il pallone (MVP).',
        votingAnonInfo: 'Il tuo voto è anonimo al 100%.',
        labelMVP: 'MVP',
        btnSubmitVotes: 'Invia Voti',
        
        resultsTitle: 'Riepilogo della Partita',
        resultsGoals: 'Gol',
        resultsAssists: 'Assist',
        resultsRating: 'VOTO',
        
        summaryTitle: 'Riepilogo delle Squadre',
        tabList: 'Vedi Lista',
        tabPitch: 'Vedi Tattica',
        teamTitulares: 'In Campo (Titolari)',
        teamBanco: 'Panchina',
        avgOvr: 'Media OVR:',
        unassignedPlayer: 'Nessun giocatore assegnato',
        btnBothTeams: 'Entrambe',
        
        profileTitle: 'Il Mio Profilo',
        personalData: 'Dati Personali',
        playerName: 'Nome del Giocatore',
        fieldPrefs: 'Preferenze in Campo',
        genPosition: 'Posizione Generale',
        specPosition: 'Posizione Specifica',
        prefFoot: 'Piede Preferito',
        security: 'Sicurezza',
        newPassword: 'Nuova Password',
        newPasswordPlaceholder: 'Lascia vuoto per mantenere quella attuale',
        confirmPassword: 'Conferma Nuova Password',
        btnSaveProfile: 'Salva',
        
        convokTitle: 'Convoca Giocatori per la Partita',
        convokSearch: 'Cerca nella rosa...',
        btnInviteSelected: 'Invita Selezionati',
        
        squadModalTitle: 'Seleziona Titolari Fissi',
        squadSearch: 'Cerca giocatore...',
        btnDone: 'Fatto',
        
        faqTitle: 'Domande Frequenti (FAQ)',
        btnUnderstood: 'Capito'
      },
      faqs: [
        {
          icon: 'phone_android',
          q: 'Come installare l\'applicazione sul cellulare (PWA)?',
          a: 'Puoi aggiungere l\'applicazione direttamente alla schermata home del tuo telefono per un\'esperienza rapida e immersiva. Su Android, apri il menu del browser e clicca su "Installa app" o "Aggiungi a schermata home". Su iPhone (iOS), clicca sul pulsante di condivisione di Safari e seleziona "Aggiungi a Schermata Home".'
        },
        {
          icon: 'vpn_key',
          q: 'Come creare o unirsi a un club di calcio?',
          a: 'Nella schermata di selezione dei club, puoi creare un nuovo club definendo il suo nome o unirti a un club privato esistente inserendo il codice di invito a 8 caratteri fornito da un amministratore.'
        },
        {
          icon: 'verified_user',
          q: 'Cosa succede dopo aver inviato la richiesta di adesione a un club?',
          a: 'La tua richiesta sarà in attesa di approvazione. Il proprietario del club o gli amministratori riceveranno un avviso e potranno approvare o rifiutare il tuo ingresso nello spogliatoio prima che tu possa partecipare alle partite.'
        },
        {
          icon: 'manage_accounts',
          q: 'Come funzionano lo Staff Tecnico e i Permessi?',
          a: 'Il proprietario del club e gli amministratori possono gestire permessi granulari per altri membri. È possibile assegnare accessi specifici per gestire le partite, gestire la rosa o assumere il ruolo di tesoriere del club.'
        },
        {
          icon: 'account_circle',
          q: 'Come posso personalizzare il mio profilo giocatore?',
          a: 'Nel menu laterale, clicca su "Il Mio Profilo". Puoi cambiare il tuo nome da giocatore, caricare una foto personalizzata per il tuo avatar, impostare la tua posizione generale e specifica, il piede preferito e aggiornare la tua password di accesso.'
        },
        {
          icon: 'calendar_today',
          q: 'Come programmare una nuova partitella?',
          a: 'Gli amministratori possono cliccare sul pulsante fluttuante "+" nel calendario per creare una nuova convocazione. Puoi definire la data, l\'ora, il luogo, i posti massimi, i titolari per squadra, il prezzo per giocatore e i nomi delle squadre.'
        },
        {
          icon: 'auto_mode',
          q: 'Come funziona la generazione di partite per l\'intero mese?',
          a: 'Configurando un giorno della settimana e un orario fissi nelle impostazioni del club, il sistema può generare automaticamente un lotto con tutte le partite del mese, pre-iscrivendo immediatamente i titolari fissi definiti.'
        },
        {
          icon: 'how_to_reg',
          q: 'Come mi iscrivo o annullo la mia iscrizione a una partita?',
          a: 'Nelle schede delle partite aperte, puoi cliccare su "Gioco" per assicurarti il posto nel limite dei posti disponibili. Gli amministratori possono anche iscrivere direttamente qualsiasi membro della rosa tramite la modale di convocazione.'
        },
        {
          icon: 'sports_soccer',
          q: 'Come funziona il Sorteggio Automatico delle Squadre?',
          a: 'Nella modale di convocazione e squadre, gli amministratori possono cliccare sul pulsante "Auto". L\'algoritmo raggruppa i giocatori per reparto (difensori, centrocampisti, attaccanti) ed equilibra le squadre in modo equo basandosi sulla Valutazione Globale (OVR) di ogni atleta.'
        },
        {
          icon: 'sports',
          q: 'Cos\'è la Modalità Squadra Singola?',
          a: 'Ideale per allenamenti liberi o quando il gruppo non si divide in Squadre A e B. Attivando questa opzione nelle impostazioni, i convocati vengono gestiti tra "In Campo (Titolari)" con supporto per gli schemi tattici e la "Panchina".'
        },
        {
          icon: 'groups_2',
          q: 'Cosa sono i Giocatori Virtuali?',
          a: 'Sono atleti creati manualmente dagli amministratori per riempire i posti nell\'applicazione quando un amico occasionale non ha ancora un account registrato. Hanno posizioni e attributi propri per essere considerati nell\'equilibrio delle squadre.'
        },
        {
          icon: 'stars',
          q: 'A cosa servono i Titolari Fissi?',
          a: 'Nelle impostazioni del club, puoi selezionare un nucleo fisso di giocatori che compongono abitualmente la rosa. Questi giocatori possono essere iscritti e conteggiati automaticamente in modo semplice quando si creano nuovi eventi.'
        },
        {
          icon: 'sports_esports',
          q: 'Come funzionano le Carte FUT e gli Attributi dei Giocatori?',
          a: 'Ogni giocatore della rosa possiede una carta interattiva in stile Ultimate Team (FUT). Gli amministratori possono modificare gli attributi del giocatore, e il sistema calcola automaticamente la Media (OVR) ponderata in base alla posizione e ai pesi specifici di ogni reparto.'
        },
        {
          icon: 'tune',
          q: 'Qual è la differenza tra la Modalità Semplice e la Modalità Pro (Dettagliata)?',
          a: 'La Modalità Semplice gestisce i 6 attributi principali (Velocità, Tiro, Passaggio, Dribbling, Difesa, Fisico). La Modalità Pro si espande a 29 sotto-attributi dettagliati (come accelerazione, finalizzazione, agilità). L\'applicazione utilizza doppie colonne, permettendo di alternare le modalità senza perdere dati.'
        },
        {
          icon: 'visibility_off',
          q: 'Posso nascondere gli attributi e le Valutazioni ai membri?',
          a: 'Sì. Nelle impostazioni del club c\'è un pulsante per "Nascondere Valutazioni/OVR". Quando attivato, i giocatori normali non vedranno più i valori numerici sulle carte e nelle partite, mantenendo la privacy, mentre gli amministratori continuano ad avere accesso completo.'
        },
        {
          icon: 'style',
          q: 'Cosa significano i design speciali delle carte (Oro, Argento, Bronzo, In-Form, Icon)?',
          a: 'I colori della carta si adattano al livello dell\'OVR (Oro per 80+, Argento per 70+, Bronzo al di sotto). Inoltre, i tre migliori giocatori del mese precedente ricevono lo status "In-Form", ed esistono edizioni "Icon" che si attivano tramite il nome.'
        },
        {
          icon: 'sports_score',
          q: 'Come chiudere una partita e registrare gol e assist?',
          a: 'Quando termina una partitella, un amministratore può cliccare su "Chiudi Partita". Si apre un pannello interattivo dove è possibile regolare in tempo reale i gol e gli assist di ogni atleta, calcolando automaticamente il risultato finale.'
        },
        {
          icon: 'how_to_vote',
          q: 'Come funziona la Votazione del MVP e la Valutazione Post-Partita?',
          a: 'Dopo la chiusura iniziale della partita da parte di un admin, si apre la fase di votazione. Ogni giocatore può dare un voto ai propri compagni ed eleggere anonimamente l\'Uomo Partita (MVP). Alla fine, l\'admin chiude le urne per nominare i vincitori.'
        },
        {
          icon: 'leaderboard',
          q: 'Come vengono calcolati il Ranking e le Statistiche della Stagione?',
          a: 'La schermata delle statistiche compila il rendimento di tutte le partite chiuse. Ogni vittoria assegna 3 punti, il pareggio 1 punto e la sconfitta 0 punti. Puoi ordinare per punti, gol, assist o voti medi, e filtrare mese per mese.'
        },
        {
          icon: 'account_balance_wallet',
          q: 'Come funziona il modulo di Tesoreria e Pagamenti?',
          a: 'La tesoreria gestisce due modelli: il pagamento a partita per i giocatori occasionali e la gestione delle quote mensili per i titolari fissi. Il sistema calcola le entrate previste in base al numero di partite del mese e permette di saldare i pagamenti effettuati.'
        },
        {
          icon: 'notifications_active',
          q: 'Come funzionano i Promemoria di Pagamento e Disponibilità?',
          a: 'Attraverso le notifiche Push integrate, gli admin e i tesorieri possono inviare avvisi automatici e segmentati al cellulare dei giocatori che hanno debiti in tesoreria o promemoria per confermare la loro presenza.'
        },
        {
          icon: 'sync',
          q: 'L\'app funziona offline o si aggiorna in tempo reale?',
          a: 'L\'applicazione utilizza WebSockets e le iscrizioni in tempo reale di Supabase. Ogni volta che qualcuno si iscrive a una partita o registra un pagamento, lo schermo di tutti gli utenti connessi si aggiorna all\'istante.'
        },
        {
          icon: 'support_agent',
          q: 'Come posso contattare il supporto o inviare suggerimenti?',
          a: 'Nel menu laterale del club, hai pulsanti diretti dedicati per "Chiedi Aiuto" e "Invia Feedback", che aprono automaticamente il tuo client di posta preconfigurato con l\'indirizzo di supporto dell\'app.'
        },
        {
          icon: 'lock_reset',
          q: 'Cosa fare se perdo l\'accesso al mio account?',
          a: 'Nella schermata di accesso, puoi utilizzare l\'opzione di recupero password inserendo la tua email per ricevere istruzioni sicure di ripristino, oppure optare per l\'accesso rapido tramite il tuo account Google.'
        },
        {
          icon: 'security',
          q: 'I miei dati e i miei voti sono al sicuro?',
          a: 'Sì. L\'intera applicazione è protetta da rigorose politiche di sicurezza a livello di database (Row Level Security), garantendo che solo i membri autorizzati di ogni club possano visualizzare e modificare le informazioni del proprio spogliatoio.'
        }
      ]
    },
    layout: {
      tabs: {
        games: 'Partite',
        players: 'Rosa',
        stats: 'Statistiche',
        finances: 'Tesoreria'
      },
      pwa: {
        installTitle: 'Installa l\'App',
        installDescIOS: 'Tocca Condividi e "Aggiungi a Schermata Home"',
        installDescAndroid: 'Aggiungila alla schermata home per un\'esperienza rapida!',
        btnInstall: 'Installa'
      },
      push: {
        title: 'Attiva Avvisi',
        desc: 'Ricevi notifiche per le convocazioni e i pagamenti.',
        btnEnable: 'Attiva',
        errNotSupported: 'Il tuo browser non supporta le Notifiche Web.',
        errDenied: 'Permesso negato. Attiva le notifiche nelle impostazioni del browser.',
        errNoWorker: 'Il Service Worker non è attivo.',
        successEnabled: 'Avvisi attivati con successo!',
        errGeneric: 'Impossibile attivare le notifiche.'
      }
    },
    players: {
      header: {
        title: 'Rosa',
        btnCreateVirtual: 'Crea Virtuale'
      },
      card: {
        tooltipVirtual: 'Giocatore Virtuale Manuale'
      },
      modals: {
        createVirtualTitle: 'Aggiungi Giocatore Virtuale',
        createVirtualName: 'Nome del Giocatore',
        createVirtualGenPos: 'Posizione Generale',
        createVirtualSpecPos: 'Posizione Specifica',
        createVirtualBtnCancel: 'Annulla',
        createVirtualBtnSave: 'Ingaggia',
  
        editTitle: 'Modifica Giocatore',
        editOverall: 'GENERALE',
        editModeProDesc: 'Modalità Pro: Modifica Dettagliata',
        
        pace: 'VEL',
        shooting: 'TIR',
        passing: 'PAS',
        dribbling: 'DRI',
        defending: 'DIF',
        physical: 'FIS',
        
        diving: 'TUF',
        handling: 'PRE',
        kicking: 'RIN',
        reflexes: 'RIF',
        speed: 'VEL',
        positioning: 'PIA',
  
        catPace: 'Velocità (VEL)',
        accel: 'Accelerazione',
        sprint: 'Velocità Scatto',
        
        catShooting: 'Tiro (TIR)',
        pos: 'Posizionamento',
        finish: 'Finalizzazione',
        shotPower: 'Potenza Tiro',
        longShots: 'Tiri dalla Distanza',
        volleys: 'Tiri al Volo',
        penalties: 'Rigori',
        
        catPassing: 'Passaggio (PAS)',
        vision: 'Visione',
        crossing: 'Cross',
        freeKick: 'Prec. Punizioni',
        shortPass: 'Passaggio Corto',
        longPass: 'Passaggio Lungo',
        curve: 'Effetto',
        
        catDribbling: 'Dribbling (DRI)',
        agility: 'Agilità',
        balance: 'Equilibrio',
        reactions: 'Reattività',
        ballControl: 'Controllo Palla',
        dribble: 'Dribbling',
        composure: 'Freddezza',
        
        catDefending: 'Difesa (DIF)',
        interceptions: 'Intercettazioni',
        heading: 'Prec. Colpo di Testa',
        defAware: 'Lettura Difensiva',
        standTackle: 'Contrasto in Piedi',
        slideTackle: 'Scivolata',
        
        catPhysical: 'Fisico (FIS)',
        jumping: 'Elevazione',
        stamina: 'Resistenza',
        strength: 'Forza',
        aggression: 'Aggressività',
  
        btnRemove: 'Rimuovi',
        btnCancel: 'Annulla',
        btnSave: 'Salva'
      },
      notify: {
        onlyStaffEdit: 'Solo lo staff tecnico può modificare i giocatori.',
        virtualHired: 'Giocatore Virtuale ingaggiato!',
        statsUpdated: 'Attributi FUT aggiornati nel Club!',
        errSave: 'Errore durante il salvataggio: ',
        errOwnerRemove: 'Impossibile rimuovere il Proprietario del club.',
        confirmRemoveTitle: 'Rimuovi Giocatore',
        confirmRemoveMsg: 'Sei sicuro di voler espellere {name} dalla squadra? Questa azione può essere annullata se chiede di rientrare.',
        btnYesRemove: 'Sì, Rimuovi',
        btnCancel: 'Annulla',
        playerRemoved: 'Giocatore rimosso dalla squadra!'
      },
      categories: [
        { label: 'Eccellente', value: 96 },
        { label: 'Molto Buono', value: 90 },
        { label: 'Buono', value: 82 },
        { label: 'Normale', value: 70 },
        { label: 'Scarso', value: 55 },
        { label: 'Pessimo', value: 40 }
      ]
    },
    finances: {
      headerTitle: 'Tesoreria',
      tabs: {
        resumo: 'Partite',
        mensalidades: 'Quote Mensili'
      },
      loading: 'Caricamento finanze...',
      matches: {
        pendingPayments: 'Pagamenti in Sospeso',
        allSettledTitle: 'Tutto Saldato!',
        allSettledDesc: 'I giocatori mensili sono stati filtrati. Nessun giocatore occasionale ha debiti per le partite.',
        missing: 'Mancano {count}',
        value: 'Valore: ',
        btnPaid: 'Pagato'
      },
      monthly: {
        btnStarters: 'Titolari',
        gamesInMonth: 'Partite nel Mese:',
        monthlyFee: 'Quota Mensile:',
        missingPayTitle: 'Da Pagare',
        btnReminders: 'Promemoria di Pagamento',
        allPaidUp: 'Tutti i mensili sono in regola!',
        alreadyPaidTitle: 'Già Pagato',
        noPaymentsThisMonth: 'Nessun pagamento registrato questo mese.'
      },
      configModal: {
        title: 'Modalità di Pagamento (Titolari)',
        noStartersDef: 'Non hai ancora definito i Titolari Fissi nelle Impostazioni del Club.',
        optMonthly: 'Mensile',
        optPerMatch: 'Paga a Partita'
      },
      notify: {
        errRestricted: 'Accesso limitato alla tesoreria.',
        infoSearchingDebtors: 'Ricerca di giocatori con pagamenti in sospeso...',
        warnNoDebtorsApp: 'Non ci sono giocatori con un account sull\'app che hanno debiti da avvisare.',
        warnNoPushEnabled: 'I debitori non hanno attivato le notifiche sul proprio cellulare.',
        pushTitleMatchDay: 'MatchDay',
        pushMsgMonthly: 'Hai un pagamento in sospeso relativo a {month}.',
        pushMsgMatch: 'Hai un pagamento in sospeso per la partita del {date} in {location}.',
        alertsSent: 'Avvisi inviati con successo a {count} debitori!',
        errCriticalPush: 'Errore critico durante l\'invio delle notifiche.',
        errSupabase: 'Errore Supabase: ',
        configSavedMonth: 'Configurazione salvata per questo mese!',
        paymentRegistered: 'Pagamento registrato!',
        matchLiquidated: 'Partita completamente saldata!'
      }
    },
    stats: {
      headerTitle: 'Statistiche della Stagione',
      noStatsTitle: 'Nessun Dato Statistico',
      noStatsDesc: 'Non ci sono ancora partite chiuse con risultati per calcolare la classifica.',
      timeFilterFullSeason: 'Stagione Completa',
      columns: {
        player: 'Giocatore',
        matches: 'P',
        matchesTooltip: 'Partite Giocate',
        goals: 'G',
        goalsTooltip: 'Gol Segnati',
        assists: 'A',
        assistsTooltip: 'Assist',
        rating: '★',
        ratingTooltip: 'Voto Medio (da 1 a 10)',
        mvp: 'MVP',
        mvpTooltip: 'Volte Uomo Partita',
        wins: 'V',
        winsTooltip: 'Vittorie',
        draws: 'P',
        drawsTooltip: 'Pareggi',
        losses: 'S',
        lossesTooltip: 'Sconfitte',
        points: 'PTI'
      },
      unknownPlayer: 'Sconosciuto'
    },
    join: {
      processing: 'Elaborazione dell\'invito...',
      entering: 'Ingresso nel tuo nuovo club di calcio.',
      errLogin: 'Accedi o crea un account per entrare nel club!',
      errSend: 'Errore durante l\'invio della richiesta: ',
      infoPending: 'Hai già una richiesta in sospeso o sei già in questo club.',
      success: 'Richiesta di adesione inviata con successo! Attendi l\'approvazione.'
    },
    error404: {
      title: 'Ops. Non c\'è niente qui...',
      btnHome: 'Torna alla Home'
    },
    common: {
      language: 'Lingua',
      system: 'Predefinito (Sistema)'
    },
    days: [
      { label: 'Lunedì', value: 1 }, { label: 'Martedì', value: 2 }, { label: 'Mercoledì', value: 3 },
      { label: 'Giovedì', value: 4 }, { label: 'Venerdì', value: 5 }, { label: 'Sabato', value: 6 }, { label: 'Domenica', value: 7 }
    ],
    positions: ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'],
    feet: ['Destro', 'Sinistro', 'Entrambi'],
    specPositions: {
      gr: 'Portiere (POR)',
      dc: 'Difensore Centrale (DC)',
      ld: 'Terzino Destro (TD)',
      le: 'Terzino Sinistro (TS)',
      ad: 'Esterno Destro (ADA)',
      ae: 'Esterno Sinistro (ASA)',
      mdc: 'Centrocampista Difensivo (CDC)',
      mc: 'Centrocampista Centrale (CC)',
      mco: 'Trequartista (COC)',
      md: 'Esterno Destro di Centrocampo (ED)',
      me: 'Esterno Sinistro di Centrocampo (ES)',
      pl: 'Attaccante (ATT)',
      sa: 'Seconda Punta (AT)',
      ed: 'Ala Destra (AD)',
      ee: 'Ala Sinistra (AS)'
    }
  }