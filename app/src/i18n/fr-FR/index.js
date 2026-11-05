export default {
    login: {
      appTitle: 'MatchDay',
      appSubtitle: 'Ton application de vestiaire. Organise des matchs, invite tes amis et domine le terrain.',
      slideSquadTitle: 'Ton Équipe',
      slideSquadSubtitle: 'Équilibre les équipes automatiquement et gère les présences en un clin d\'œil.',
      slideMvpTitle: 'Élection du MVP',
      slideMvpSubtitle: 'À la fin du match, évalue tes coéquipiers anonymement et découvre qui remporte le Ballon d\'Or !',
      btnStart: 'Commencer à Jouer',
      
      titleSignIn: 'Se Connecter',
      titleSignUp: 'Créer un Compte',
      subtitleSignIn: 'Bon retour dans le vestiaire',
      subtitleSignUp: 'Remplis tes coordonnées pour rejoindre l\'équipe',
      
      labelName: 'Ton Nom (ex: Zidane)',
      labelEmail: 'Email',
      labelPassword: 'Mot de passe',
      
      errNameRequired: 'Le nom est obligatoire',
      errEmailRequired: 'L\'email est obligatoire',
      errEmailInvalid: 'Entre un email valide (ex: joueur@mail.com)',
      errPasswordRequired: 'Le mot de passe est obligatoire',
      errPasswordLength: 'Le mot de passe doit contenir au moins 6 caractères',
      
      btnSubmitSignIn: 'Entrer dans le Vestiaire',
      btnSubmitSignUp: 'S\'inscrire et Entrer',
      
      toggleToSignIn: 'Tu as déjà un compte ? Se Connecter',
      toggleToSignUp: 'Pas encore de compte ? Créer un Compte',
      forgotPassword: 'Mot de passe oublié ?',
      
      btnGoogle: 'Continuer avec Google',
      
      resetTitle: 'Récupérer le Mot de Passe',
      resetSubtitle: 'Entre ton email. Tu recevras un lien sécurisé pour réinitialiser ton mot de passe.',
      resetEmailLabel: 'Ton Email',
      resetBtnCancel: 'Annuler',
      resetBtnSend: 'Envoyer le Lien',
      
      msgConfirmEmailTitle: 'Confirme ton Email',
      msgConfirmEmailText: 'Compte créé avec succès ! Nous avons envoyé un lien de confirmation dans ta boîte de réception. Merci de valider ton email avant d\'entrer dans le vestiaire.',
      msgConfirmEmailOk: 'Compris',
      msgLoginSuccess: 'Connexion réussie !',
      msgResetSent: 'Email de récupération envoyé ! Vérifie ta boîte de réception.',
    },
    selector: {
      myClubsTitle: 'Mes Clubs',
      myClubsSubtitle: 'Sélectionne ton vestiaire',
      roleAdmin: 'Administrateur',
      roleMember: 'Membre',
      noClubs: "Tu n'appartiens encore à aucun club.",
      btnCreateClub: 'Créer un Nouveau Club',
      
      joinWithCodeTitle: 'Rejoindre avec un Code',
      joinWithCodeSubtitle: 'Tu as reçu une invitation ? Entre le code pour rejoindre l\'équipe.',
      inputCodeLabel: 'Code du Club',
      inputCodePlaceholder: 'Ex: FC-1234',
      btnJoin: 'Rejoindre',
      
      modalCreateTitle: 'Nouveau Club',
      inputClubName: 'Nom du Club',
      btnCancel: 'Annuler',
      btnCreate: 'Créer',
      
      errCreateClub: 'Erreur lors de la création du club : ',
      msgClubCreated: 'Club créé avec succès !',
      warnEnterCode: 'Veuillez entrer un code.',
      errInvalidCode: 'Code invalide ! Confirme avec l\'administrateur du club.',
      infoAlreadyMember: 'Tu fais déjà partie ou as une demande en attente pour le club {clubName} !',
      errJoinClub: 'Erreur pour rejoindre le club : ',
      msgJoinSuccess: 'Demande envoyée à {clubName} ! Attends l\'approbation du staff.',
    },
    dashboard: {
      header: {
        loading: 'Chauffe des moteurs...',
        code: 'Code :',
        copyCodeTooltip: 'Copier le Code',
        shareTooltip: 'Envoyer l\'Invitation',
        menuProfile: 'Mon Profil',
        menuSwitchClub: 'Changer de Club',
        menuLogout: 'Se Déconnecter',
        menuHelp: 'Demander de l\'Aide',
        menuFeedback: 'Envoyer des Commentaires',
        menuFaqs: 'FAQ'
      },
      empty: {
        noMatchesTitle: 'Aucun match programmé',
        noMatchesDesc: 'Il n\'y a pas encore de convocation ouverte dans ce club.',
        btnFirstMatch: 'Programmer le Premier Match',
        noFilterTitle: 'Aucun match dans cette vue',
        noFilterDesc: 'Nous n\'avons pas trouvé de match pour cette recherche. Change d\'onglet pour voir les matchs passés ou en programmer un nouveau.'
      },
      filters: {
        calendar: 'Calendrier',
        next: 'Prochain',
        voting: 'En Vote',
        pending: 'En Attente',
        month: 'Mois',
        all: 'Tous',
        closed: 'Terminés'
      },
      match: {
        statusClosed: 'TERMINÉ',
        statusVoting: 'VOTE',
        statusOpen: 'OUVERT',
        location: 'Lieu',
        capacity: 'Capacité',
        price: 'Prix',
        btnSquad: 'Effectif',
        btnAskConfirm: 'Demander Confirmation',
        btnEdit: 'Modifier',
        btnDelete: 'Supprimer',
        btnCloseMatch: 'Clôturer le Match',
        btnInscribed: 'Inscrit',
        btnPlay: 'Je Joue',
        btnFull: 'Complet',
        btnReopen: 'Modifier / Réouvrir le Match',
        btnRate: 'Évaluer le Match',
        btnVoted: 'Vote Enregistré',
        btnClosePolls: 'Fermer les Urnes et MVP',
        btnResults: 'Résultats'
      },
      notify: {
        codeCopied: 'Code {code} copié ! Tu peux le coller sur WhatsApp.',
        noCode: 'Ce club n\'a pas encore de code d\'invitation.',
        inviteCopied: 'Texte d\'invitation copié ! Colle-le où tu veux.',
        inviteTitle: 'Invitation MatchDay',
        inviteMsg: 'Rejoins mon équipe "{clubName}" sur MatchDay ! ⚽\n\nClique sur le lien pour entrer automatiquement :\n{link}\n\n(Si l\'application te le demande, le code est : {code})',
        matchDeleted: 'Match supprimé du calendrier.',
        deleteMatchTitle: 'Supprimer le Match',
        deleteMatchMsg: 'Es-tu sûr(e) ? Le match et toutes les inscriptions seront définitivement supprimés.',
        btnYesDelete: 'Oui, Supprimer',
        btnCancel: 'Annuler',
        alertSent: 'Alertes envoyées aux titulaires !',
        askConfirmTitle: 'Demander Confirmation',
        askConfirmMsg: 'Tu vas notifier les {count} joueurs inscrits pour qu\'ils confirment leur présence. Continuer ?',
        btnSendAlerts: 'Envoyer les Alertes',
        pushTitleConfirm: '🗓️ Confirmation de Présence',
        pushMsgConfirm: 'Le match approche ! Confirme si tu es disponible ou si nous devons chercher un remplaçant.',
        pwdMismatch: 'Les mots de passe ne correspondent pas.',
        profileUpdated: 'Profil du joueur mis à jour !',
        errSaveProfile: 'Erreur lors de l\'enregistrement du profil : ',
        removePhotoTitle: 'Supprimer la Photo',
        removePhotoMsg: 'Es-tu sûr(e) de vouloir supprimer ta photo de profil ?',
        btnYesRemovePhoto: 'Oui, Supprimer',
        reopenMatchTitle: 'Réouvrir le Match',
        reopenMatchMsg: 'Es-tu sûr(e) de vouloir réouvrir ce match pour le modifier ? Les buts actuels seront conservés pour que tu puisses les ajuster.',
        matchReopened: 'Match réouvert avec succès !',
        clearTeamsTitle: 'Réinitialiser les Équipes',
        clearTeamsMsg: 'Es-tu sûr(e) de vouloir effacer tous les choix et désassigner tous les joueurs ?',
        btnYesClear: 'Oui, Effacer',
        teamsCleared: 'Tous les choix ont été effacés !',
        capacityFull: 'Doucement Coach ! Le match n\'a plus que {count} places disponibles.',
        playersConvoked: '{count} joueur(s) convoqué(s) avec succès !',
        paymentConfirmed: 'Paiement confirmé !',
        paymentReverted: 'Paiement annulé.',
        playerRemoved: 'Joueur retiré du match.',
        playerAccepted: 'Joueur accepté dans l\'équipe !',
        requestRejected: 'Demande rejetée.',
        dayOccupiedTitle: 'Attention : Journée Occupée',
        dayOccupiedMsg: 'Tu as déjà un match programmé pour ce jour. Veux-tu vraiment en programmer un autre et superposer les matchs ?',
        btnYesSchedule: 'Oui, Programmer quand même',
        matchUpdatedFuture: 'Match mis à jour et règles appliquées aux futurs matchs !',
        matchUpdated: 'Match mis à jour avec succès !',
        matchCreated: 'Match programmé avec succès !',
        blockedSecurity: 'Bloqué par sécurité ! As-tu exécuté le script dans l\'éditeur SQL ?',
        statsSavedLive: 'Statistiques sauvegardées en temps réel !',
        errSaveData: 'Erreur lors de la sauvegarde des données.',
        errVoteMvp: 'Tu dois élire ton Homme du Match (MVP) !',
        errAlreadyVoted: 'Tu as déjà voté pour ce match !',
        votesRegistered: 'Votes enregistrés avec succès !',
        closePollsTitle: 'Calculer les Résultats',
        closePollsMsg: 'Cette action ferme les urnes, calcule les moyennes, décerne le MVP et termine définitivement le match. Confirmer ?',
        btnClosePollsAction: 'Fermer le Vote',
        pollsClosed: 'Urnes fermées ! MVP calculé avec succès.',
        pushTitleResults: '🏆 Résultats Finaux',
        pushMsgResults: 'Les urnes sont fermées ! Découvre qui est le MVP et les notes du match.',
        teamsSorted: 'Tirage au sort des équipes terminé !',
        errGenerateTeams: 'Erreur lors de la génération des équipes.',
        memberPromoted: 'Membre promu Administrateur !',
        demoteMemberTitle: 'Rétrograder le Membre',
        demoteMemberMsg: 'Es-tu sûr(e) ? Ce membre perdra l\'accès au panneau de gestion du club.',
        memberDemoted: 'Membre retiré du Staff Technique.',
        errRls: 'ERREUR RLS : Tu n\'as pas les permissions dans la BD pour modifier cela.',
        permsUpdated: 'Permissions mises à jour !',
        settingsSaved: 'Paramètres du club sauvegardés !',
        squadLimitWarn: 'La capacité a été réduite à {limit}. Les joueurs en surplus de la liste des Titulaires ont été retirés.',
        warnConfigRoutine: 'Configure d\'abord le jour et l\'heure fixes dans les Paramètres du club.',
        infoNoMoreDays: 'Il n\'y a plus de jours correspondants ce mois-ci.',
        overlapTitle: 'Attention aux Chevauchements',
        overlapMsg: 'Tu as déjà des matchs le : {dates}. Veux-tu générer ces matchs quand même et créer des doublons ?',
        btnGenerateAnyway: 'Générer quand même',
        bulkGenerated: '{count} matchs générés avec les Titulaires confirmés !',
        noConvokedAlerts: 'Il n\'y a pas encore de joueurs convoqués à alerter.'
      },
      modals: {
        createMatchTitle: 'Nouvelle Convocation',
        editMatchTitle: 'Modifier le Match',
        toggleDefaults: 'Verrouiller avec les paramètres du club',
        dateLabel: 'Date et Heure',
        locationLabel: 'Lieu / Terrain',
        capacityLabel: 'Capacité',
        startersLabel: 'Titulaires',
        priceLabel: 'Prix (€)',
        teamAName: 'Nom Équipe A',
        teamBName: 'Équipe B',
        singleTeamName: 'Nom de l\'Équipe',
        applyFuture: 'Appliquer le prix, la capacité et le lieu aux prochains matchs ouverts',
        btnSaveEdit: 'Enregistrer les Modifications',
        btnPublish: 'Publier (Seulement 1)',
        btnGenerateBulk: 'Générer un Mois Entier',
        btnCancel: 'Annuler',
        
        presencesTitle: 'Convocation et Équipes',
        adminPanelTitle: 'Panneau d\'Admin : Inscrire un Joueur',
        btnSelectPlayers: 'Sélectionner des Joueurs de l\'Équipe',
        noPlayersInscribed: 'Aucun joueur inscrit pour le moment.',
        btnAutoBalance: 'Auto',
        btnClearTeams: 'Effacer',
        btnViewTactics: 'Voir la Tactique',
        btnViewSummary: 'Résumé',
        statusConfirmed: 'Confirmé',
        statusWaitlist: 'Liste d\'Attente',
        
        closeMatchTitle: 'Statistiques du Match',
        goalsLabel: 'BUTS',
        assistsLabel: 'PASSES',
        btnSaveLive: 'Enregistrer (Direct)',
        btnCloseMatch: 'Clôturer le Match',
        
        staffTitle: 'Staff Technique & Permissions',
        addStaffTitle: 'Ajouter un Membre au Staff',
        searchPlayerPlaceholder: 'Chercher un joueur dans l\'équipe...',
        btnPromote: 'Promouvoir',
        roleOwner: 'Propriétaire du Club',
        roleAdmin: 'Administrateur',
        permManageMatches: 'Gérer les Matchs',
        permManageTeams: 'Gérer l\'Équipe',
        permManageFinances: 'Trésorier',
        tooltipRemoveStaff: 'Retirer du Staff',
        
        requestsTitle: 'Demandes d\'Adhésion',
        reqSubtitle: 'Souhaite rejoindre l\'équipe',
        tooltipReject: 'Rejeter',
        tooltipApprove: 'Approuver',
        noRequests: 'Aucune demande en attente.',
        
        settingsTitle: 'Paramètres du Club',
        tabFinances: 'Finances',
        defaultPrice: 'Prix par Défaut par Match (€)',
        monthlyPrice: 'Prix par Match (Mensuels) (€)',
        tabLogistics: 'Logistique',
        defaultLocation: 'Terrain par Défaut',
        maxCapacity: 'Capacité Max',
        startersPerTeam: 'Titulaires (Ex: 11, 7)',
        tabTeams: 'Équipes',
        tabColors: 'Couleurs par Défaut',
        colorTeamA: 'Couleur Équipe A',
        colorTeamB: 'Couleur Équipe B',
        colorSingleTeam: 'Couleur de l\'Équipe',
        tabRoutine: 'Routine Hebdomadaire',
        matchDay: 'Jour de Match Fixe',
        matchTime: 'Heure Fixe',
        tabFut: 'Attributs FUT',
        viewMode: 'Mode d\'Affichage',
        toggleHideRatings: 'Cacher les Notes/OVR aux membres',
        toggleVoting: 'Activer le Vote MVP post-match',
        toggleSingleTeam: 'Mode Équipe Unique',
        toggleProAttributes: 'Activer les Attributs Détaillés',
        tabFixedStarters: 'Titulaires Fixes',
        manageFixedStarters: 'Gérer les Titulaires Fixes',
        btnSaveSettings: 'Enregistrer les Paramètres',
        
        votingTitle: 'Vote et MVP',
        votingDesc: 'Donne une note de 1 à 10 à tes coéquipiers et choisis qui mérite de remporter le ballon (MVP).',
        votingAnonInfo: 'Ton vote est 100% anonyme.',
        labelMVP: 'MVP',
        btnSubmitVotes: 'Soumettre les Votes',
        
        resultsTitle: 'Résumé du Match',
        resultsGoals: 'Buts',
        resultsAssists: 'Passes',
        resultsRating: 'NOTE',
        
        summaryTitle: 'Résumé des Équipes',
        tabList: 'Voir la Liste',
        tabPitch: 'Voir la Tactique',
        teamTitulares: 'Sur le Terrain (Titulaires)',
        teamBanco: 'Banc de Touche',
        avgOvr: 'Moyenne OVR :',
        unassignedPlayer: 'Aucun joueur assigné',
        btnBothTeams: 'Les Deux',
        
        profileTitle: 'Mon Profil',
        personalData: 'Données Personnelles',
        playerName: 'Nom du Joueur',
        fieldPrefs: 'Préférences de Terrain',
        genPosition: 'Position Générale',
        specPosition: 'Position Spécifique',
        prefFoot: 'Pied Préféré',
        security: 'Sécurité',
        newPassword: 'Nouveau Mot de Passe',
        newPasswordPlaceholder: 'Laisser vide pour conserver l\'actuel',
        confirmPassword: 'Confirmer le Mot de Passe',
        btnSaveProfile: 'Enregistrer',
        
        convokTitle: 'Convoquer des Joueurs',
        convokSearch: 'Chercher dans l\'équipe...',
        btnInviteSelected: 'Inviter la Sélection',
        
        squadModalTitle: 'Sélectionner les Titulaires',
        squadSearch: 'Chercher un joueur...',
        btnDone: 'Terminé',
        
        faqTitle: 'Foire Aux Questions (FAQ)',
        btnUnderstood: 'Compris'
      },
      faqs: [
        {
          icon: 'phone_android',
          q: 'Comment installer l\'application sur mobile (PWA) ?',
          a: 'Tu peux ajouter l\'application directement sur l\'écran d\'accueil de ton téléphone pour une expérience rapide et immersive. Sur Android, ouvre le menu du navigateur et clique sur "Installer l\'application" ou "Ajouter à l\'écran d\'accueil". Sur iPhone (iOS), clique sur le bouton de partage de Safari et sélectionne "Sur l\'écran d\'accueil".'
        },
        {
          icon: 'vpn_key',
          q: 'Comment créer ou rejoindre un club de football ?',
          a: 'Sur l\'écran de sélection des clubs, tu peux créer un nouveau club en définissant son nom, ou rejoindre un club privé existant en entrant le code d\'invitation à 8 caractères fourni par l\'administrateur.'
        },
        {
          icon: 'verified_user',
          q: 'Que se passe-t-il après avoir envoyé une demande d\'adhésion à un club ?',
          a: 'Ta demande sera en attente d\'approbation. Le propriétaire du club ou les administrateurs recevront une alerte et pourront approuver ou refuser ton entrée dans le vestiaire avant que tu puisses participer aux matchs.'
        },
        {
          icon: 'manage_accounts',
          q: 'Comment fonctionnent le Staff Technique et les Permissions ?',
          a: 'Le propriétaire du club et les administrateurs peuvent gérer des permissions détaillées pour les autres membres. Il est possible d\'attribuer des accès spécifiques pour gérer les matchs, gérer l\'équipe ou assumer le rôle de trésorier du club.'
        },
        {
          icon: 'account_circle',
          q: 'Comment personnaliser mon profil de joueur ?',
          a: 'Dans le menu latéral, clique sur "Mon Profil". Tu peux changer ton nom de joueur, télécharger une photo personnalisée pour ton avatar, définir ta position générale et spécifique, ton pied préféré et mettre à jour ton mot de passe.'
        },
        {
          icon: 'calendar_today',
          q: 'Comment programmer un nouveau match ?',
          a: 'Les administrateurs peuvent cliquer sur le bouton flottant "+" dans le calendrier pour créer une nouvelle convocation. Tu peux définir la date, l\'heure, le lieu, la capacité maximale, le nombre de titulaires par équipe, le prix par joueur et les noms des équipes.'
        },
        {
          icon: 'auto_mode',
          q: 'Comment fonctionne la génération de matchs pour tout le mois ?',
          a: 'En configurant un jour de la semaine et une heure fixes dans les paramètres du club, le système peut générer automatiquement un lot avec tous les matchs correspondants au mois, en pré-inscrivant immédiatement les titulaires fixes définis.'
        },
        {
          icon: 'how_to_reg',
          q: 'Comment m\'inscrire ou me désinscrire d\'un match ?',
          a: 'Sur les cartes des matchs ouverts, tu peux cliquer sur "Je Joue" pour garantir ta place dans la limite des places disponibles. Les administrateurs peuvent également inscrire directement n\'importe quel membre de l\'équipe via la modale de convocation.'
        },
        {
          icon: 'sports_soccer',
          q: 'Comment fonctionne le Tirage au Sort Automatique des Équipes ?',
          a: 'Dans la modale de convocation et d\'équipes, les administrateurs peuvent cliquer sur le bouton "Auto". L\'algorithme regroupe les joueurs par lignes (défenseurs, milieux, attaquants) et équilibre les équipes de manière équitable en se basant sur la Note Générale (OVR) de chaque athlète.'
        },
        {
          icon: 'sports',
          q: 'Qu\'est-ce que le Mode Équipe Unique ?',
          a: 'Idéal pour les entraînements libres ou lorsque le groupe ne se divise pas en Équipes A et B. En activant cette option dans les paramètres, les convoqués sont gérés entre "Sur le Terrain (Titulaires)" avec prise en charge des schémas tactiques et le "Banc de Touche".'
        },
        {
          icon: 'groups_2',
          q: 'Que sont les Joueurs Virtuels ?',
          a: 'Ce sont des athlètes créés manuellement par les administrateurs pour combler des places dans l\'application lorsqu\'un ami occasionnel n\'a pas encore de compte enregistré. Ils possèdent leurs propres positions et attributs pour le calcul des équipes.'
        },
        {
          icon: 'stars',
          q: 'À quoi servent les Titulaires Fixes ?',
          a: 'Dans les paramètres du club, tu peux sélectionner un noyau fixe de joueurs qui composent habituellement l\'équipe. Ces joueurs peuvent être inscrits et comptabilisés automatiquement de manière simple lors de la création de nouveaux événements.'
        },
        {
          icon: 'sports_esports',
          q: 'Comment fonctionnent les Cartes FUT et les Attributs des Joueurs ?',
          a: 'Chaque joueur de l\'équipe possède une carte interactive de style Ultimate Team (FUT). Les administrateurs peuvent modifier les attributs du joueur, et le système calcule automatiquement la Moyenne (OVR) pondérée en fonction de la position et des poids spécifiques de chaque secteur.'
        },
        {
          icon: 'tune',
          q: 'Quelle est la différence entre le Mode Simple et le Mode Pro (Détaillé) ?',
          a: 'Le Mode Simple gère les 6 attributs principaux (Vitesse, Tirs, Passes, Dribbles, Défense, Physique). Le Mode Pro s\'étend à 29 sous-attributs détaillés (comme l\'accélération, la finition, l\'agilité). L\'application utilise des colonnes doubles, permettant de basculer de mode sans perdre de données.'
        },
        {
          icon: 'visibility_off',
          q: 'Puis-je cacher les attributs et les Notes aux membres ?',
          a: 'Oui. Dans les paramètres du club, il y a un bouton pour "Cacher les Notes/OVR". Lorsqu\'il est activé, les joueurs normaux ne verront plus les valeurs numériques sur les cartes et les matchs, préservant ainsi la confidentialité, tandis que les administrateurs conservent un accès total.'
        },
        {
          icon: 'style',
          q: 'Que signifient les visuels spéciaux des cartes (Or, Argent, Bronze, En-Forme, Icône) ?',
          a: 'Les couleurs de la carte s\'adaptent au niveau de l\'OVR (Or pour 80+, Argent pour 70+, Bronze en dessous). De plus, les trois meilleurs joueurs du mois précédent reçoivent le statut "En-Forme", et il existe des éditions "Icône" qui s\'activent par nom.'
        },
        {
          icon: 'sports_score',
          q: 'Comment clôturer un match et enregistrer les buts et les passes décisives ?',
          a: 'Lorsqu\'un match est terminé, un administrateur peut cliquer sur "Clôturer le Match". Un panneau interactif s\'ouvre où il est possible d\'ajuster en temps réel les buts et les passes décisives de chaque athlète, en calculant automatiquement le résultat final.'
        },
        {
          icon: 'how_to_vote',
          q: 'Comment fonctionne le Vote du MVP et l\'Évaluation Post-Match ?',
          a: 'Après la clôture initiale du match par un admin, la phase de vote s\'ouvre. Chaque joueur peut donner des notes à ses coéquipiers et élire anonymement l\'Homme du Match (MVP). À la fin, l\'admin ferme les urnes pour désigner les gagnants.'
        },
        {
          icon: 'leaderboard',
          q: 'Comment sont calculés le Classement et les Statistiques de la Saison ?',
          a: 'L\'écran des statistiques compile les performances de tous les matchs clôturés. Chaque victoire rapporte 3 points, un match nul 1 point et une défaite 0 point. Tu peux trier par points, buts, passes décisives ou notes moyennes, et filtrer par mois.'
        },
        {
          icon: 'account_balance_wallet',
          q: 'Comment fonctionne le module de Trésorerie et de Paiements ?',
          a: 'La trésorerie gère deux modèles : le paiement au match pour les joueurs occasionnels et la gestion des cotisations mensuelles pour les titulaires fixes. Le système calcule les revenus attendus en fonction du nombre de matchs dans le mois et permet de liquider les paiements effectués.'
        },
        {
          icon: 'notifications_active',
          q: 'Comment fonctionnent les Rappels de Paiement et de Disponibilité ?',
          a: 'Grâce aux notifications Push intégrées, les admins et les trésoriers peuvent envoyer des alertes automatiques et ciblées sur le téléphone des joueurs ayant des dettes en trésorerie ou des rappels pour confirmer leur présence.'
        },
        {
          icon: 'sync',
          q: 'L\'application fonctionne-t-elle hors ligne ou se met-elle à jour en temps réel ?',
          a: 'L\'application utilise des WebSockets et les abonnements en temps réel de Supabase. Chaque fois que quelqu\'un s\'inscrit à un match ou enregistre un paiement, l\'écran de tous les utilisateurs connectés se met à jour instantanément.'
        },
        {
          icon: 'support_agent',
          q: 'Comment puis-je contacter le support ou envoyer des suggestions ?',
          a: 'Dans le menu latéral du club, tu as des boutons directs dédiés pour "Demander de l\'Aide" et "Envoyer des Commentaires", qui ouvrent automatiquement ton client de messagerie préconfiguré avec l\'adresse de support de l\'application.'
        },
        {
          icon: 'lock_reset',
          q: 'Que faire si je perds l\'accès à mon compte ?',
          a: 'Sur l\'écran de connexion, tu peux utiliser l\'option de récupération de mot de passe en entrant ton email pour recevoir des instructions de réinitialisation sécurisées, ou opter pour la connexion rapide via ton compte Google.'
        },
        {
          icon: 'security',
          q: 'Mes données et mes votes sont-ils sécurisés ?',
          a: 'Oui. Toute l\'application est protégée par des politiques de sécurité strictes au niveau de la base de données (Row Level Security), garantissant que seuls les membres autorisés de chaque club peuvent voir et modifier les informations de leur vestiaire.'
        }
      ]
    },
    layout: {
      tabs: {
        games: 'Matchs',
        players: 'Équipe',
        stats: 'Stats',
        finances: 'Trésorerie'
      },
      pwa: {
        installTitle: 'Installer l\'App',
        installDescIOS: 'Touche Partager et "Sur l\'écran d\'accueil"',
        installDescAndroid: 'Ajoute-la à l\'écran d\'accueil pour une expérience rapide !',
        btnInstall: 'Installer'
      },
      push: {
        title: 'Activer les Alertes',
        desc: 'Reçois des notifications pour les convocations et les paiements.',
        btnEnable: 'Activer',
        errNotSupported: 'Ton navigateur ne supporte pas les Notifications Web.',
        errDenied: 'Permission refusée. Active les notifications dans les paramètres du navigateur.',
        errNoWorker: 'Le Service Worker n\'est pas actif.',
        successEnabled: 'Alertes activées avec succès !',
        errGeneric: 'Échec de l\'activation des notifications.'
      }
    },
    players: {
      header: {
        title: 'Effectif',
        btnCreateVirtual: 'Créer un Virtuel'
      },
      card: {
        tooltipVirtual: 'Joueur Virtuel Manuel'
      },
      modals: {
        createVirtualTitle: 'Ajouter un Joueur Virtuel',
        createVirtualName: 'Nom du Joueur',
        createVirtualGenPos: 'Position Générale',
        createVirtualSpecPos: 'Position Spécifique',
        createVirtualBtnCancel: 'Annuler',
        createVirtualBtnSave: 'Recruter',
  
        editTitle: 'Modifier le Joueur',
        editOverall: 'GÉNÉRAL',
        editModeProDesc: 'Mode Pro : Édition Détaillée',
        
        pace: 'VIT',
        shooting: 'TIR',
        passing: 'PAS',
        dribbling: 'DRI',
        defending: 'DÉF',
        physical: 'PHY',
        
        diving: 'PLO',
        handling: 'JEU',
        kicking: 'DÉG',
        reflexes: 'RÉF',
        speed: 'VIT',
        positioning: 'POS',
  
        catPace: 'Vitesse (VIT)',
        accel: 'Accélération',
        sprint: 'Vitesse',
        
        catShooting: 'Tirs (TIR)',
        pos: 'Placement',
        finish: 'Finition',
        shotPower: 'Puissance Tir',
        longShots: 'Tirs Lointains',
        volleys: 'Volées',
        penalties: 'Penaltys',
        
        catPassing: 'Passes (PAS)',
        vision: 'Vista',
        crossing: 'Centres',
        freeKick: 'Précision CF',
        shortPass: 'Passes Courtes',
        longPass: 'Passes Longues',
        curve: 'Effet',
        
        catDribbling: 'Dribbles (DRI)',
        agility: 'Agilité',
        balance: 'Équilibre',
        reactions: 'Réactivité',
        ballControl: 'Contrôle Balle',
        dribble: 'Dribbles',
        composure: 'Calme',
        
        catDefending: 'Défense (DÉF)',
        interceptions: 'Interceptions',
        heading: 'Précision Tête',
        defAware: 'Lucidité Défensive',
        standTackle: 'Tacle Debout',
        slideTackle: 'Tacle Glissé',
        
        catPhysical: 'Physique (PHY)',
        jumping: 'Détente',
        stamina: 'Endurance',
        strength: 'Force',
        aggression: 'Agressivité',
  
        btnRemove: 'Retirer',
        btnCancel: 'Annuler',
        btnSave: 'Enregistrer'
      },
      notify: {
        onlyStaffEdit: 'Seul le staff technique peut modifier les joueurs.',
        virtualHired: 'Joueur Virtuel recruté !',
        statsUpdated: 'Attributs FUT mis à jour dans le Club !',
        errSave: 'Erreur d\'enregistrement : ',
        errOwnerRemove: 'Impossible de retirer le Propriétaire du club.',
        confirmRemoveTitle: 'Retirer le Joueur',
        confirmRemoveMsg: 'Es-tu sûr(e) de vouloir exclure {name} de l\'équipe ? Cette action peut être annulée s\'il demande à revenir.',
        btnYesRemove: 'Oui, Retirer',
        btnCancel: 'Annuler',
        playerRemoved: 'Joueur retiré de l\'équipe !'
      },
      categories: [
        { label: 'Excellent', value: 96 },
        { label: 'Très Bon', value: 90 },
        { label: 'Bon', value: 82 },
        { label: 'Moyen', value: 70 },
        { label: 'Mauvais', value: 55 },
        { label: 'Très Mauvais', value: 40 }
      ]
    },
    finances: {
      headerTitle: 'Trésorerie',
      tabs: {
        resumo: 'Matchs',
        mensalidades: 'Cotisations'
      },
      loading: 'Chargement des finances...',
      matches: {
        pendingPayments: 'Paiements en Attente',
        allSettledTitle: 'Tout est Réglé !',
        allSettledDesc: 'Les joueurs mensuels ont été filtrés. Aucun joueur occasionnel ne doit de matchs.',
        missing: 'Il manque {count}',
        value: 'Valeur : ',
        btnPaid: 'Payé'
      },
      monthly: {
        btnStarters: 'Titulaires',
        gamesInMonth: 'Matchs dans le Mois :',
        monthlyFee: 'Cotisation :',
        missingPayTitle: 'Reste à Payer',
        btnReminders: 'Rappels de Paiement',
        allPaidUp: 'Tous les membres mensuels sont à jour !',
        alreadyPaidTitle: 'Déjà Payé',
        noPaymentsThisMonth: 'Aucun paiement enregistré ce mois-ci.'
      },
      configModal: {
        title: 'Mode de Paiement (Titulaires)',
        noStartersDef: 'Tu n\'as pas encore défini les Titulaires Fixes dans les Paramètres du Club.',
        optMonthly: 'Mensuel',
        optPerMatch: 'Paiement au Match'
      },
      notify: {
        errRestricted: 'Accès restreint à la trésorerie.',
        infoSearchingDebtors: 'Recherche des joueurs avec des paiements en attente...',
        warnNoDebtorsApp: 'Il n\'y a pas de joueurs avec un compte sur l\'app ayant des dettes à signaler.',
        warnNoPushEnabled: 'Les débiteurs n\'ont pas activé les notifications sur leur mobile.',
        pushTitleMatchDay: 'MatchDay',
        pushMsgMonthly: 'Tu as un paiement en attente concernant {month}.',
        pushMsgMatch: 'Tu as un paiement en attente pour le match du {date} à {location}.',
        alertsSent: 'Alertes envoyées avec succès à {count} débiteurs !',
        errCriticalPush: 'Erreur critique lors de l\'envoi des notifications.',
        errSupabase: 'Erreur Supabase : ',
        configSavedMonth: 'Configuration sauvegardée pour ce mois !',
        paymentRegistered: 'Paiement enregistré !',
        matchLiquidated: 'Match entièrement liquidé !'
      }
    },
    stats: {
      headerTitle: 'Statistiques de la Saison',
      noStatsTitle: 'Aucune Donnée Statistique',
      noStatsDesc: 'Il n\'y a pas encore de matchs clôturés avec des résultats pour calculer le classement.',
      timeFilterFullSeason: 'Saison Complète',
      columns: {
        player: 'Joueur',
        matches: 'M',
        matchesTooltip: 'Matchs Joués',
        goals: 'B',
        goalsTooltip: 'Buts Marqués',
        assists: 'P',
        assistsTooltip: 'Passes Décisives',
        rating: '★',
        ratingTooltip: 'Note Moyenne (1 à 10)',
        mvp: 'MVP',
        mvpTooltip: 'Fois Homme du Match',
        wins: 'V',
        winsTooltip: 'Victoires',
        draws: 'N',
        drawsTooltip: 'Nuls',
        losses: 'D',
        lossesTooltip: 'Défaites',
        points: 'PTS'
      },
      unknownPlayer: 'Inconnu'
    },
    join: {
      processing: 'Traitement de l\'invitation...',
      entering: 'Entrée dans ton nouveau club de football.',
      errLogin: 'Connecte-toi ou crée un compte pour rejoindre le club !',
      errSend: 'Erreur lors de l\'envoi de la demande : ',
      infoPending: 'Tu as déjà une demande en attente ou tu es déjà dans ce club.',
      success: 'Demande d\'adhésion envoyée avec succès ! Attends l\'approbation.'
    },
    error404: {
      title: 'Oups. Il n\'y a rien ici...',
      btnHome: 'Retour à l\'Accueil'
    },
    common: {
      language: 'Langue',
      system: 'Par Défaut (Système)'
    },
    days: [
      { label: 'Lundi', value: 1 }, { label: 'Mardi', value: 2 }, { label: 'Mercredi', value: 3 },
      { label: 'Jeudi', value: 4 }, { label: 'Vendredi', value: 5 }, { label: 'Samedi', value: 6 }, { label: 'Dimanche', value: 7 }
    ],
    positions: ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'],
    feet: ['Droit', 'Gauche', 'Les Deux'],
    specPositions: {
      gr: 'Gardien de but (G)',
      dc: 'Défenseur Central (DC)',
      ld: 'Défenseur Droit (DD)',
      le: 'Défenseur Gauche (DG)',
      ad: 'Piston Droit (ALD)',
      ae: 'Piston Gauche (ALG)',
      mdc: 'Milieu Défensif (MDC)',
      mc: 'Milieu Central (MC)',
      mco: 'Milieu Offensif (MOC)',
      md: 'Milieu Droit (MD)',
      me: 'Milieu Gauche (MG)',
      pl: 'Buteur (BU)',
      sa: 'Attaquant Soutien (AT)',
      ed: 'Ailier Droit (AD)',
      ee: 'Ailier Gauche (AG)'
    }
  }