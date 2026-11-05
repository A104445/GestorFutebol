export default {
    login: {
      appTitle: 'MatchDay',
      appSubtitle: 'Deine Kabinen-App. Organisiere Spiele, lade Freunde ein und dominiere den Platz.',
      slideSquadTitle: 'Dein Kader',
      slideSquadSubtitle: 'Gleiche Teams automatisch aus und verwalte die Anwesenheit im Handumdrehen.',
      slideMvpTitle: 'MVP-Wahl',
      slideMvpSubtitle: 'Bewerte deine Mitspieler am Ende des Spiels anonym und finde heraus, wer den goldenen Ball gewinnt!',
      btnStart: 'Jetzt Spielen',
      
      titleSignIn: 'Anmelden',
      titleSignUp: 'Konto Erstellen',
      subtitleSignIn: 'Willkommen zurück in der Kabine',
      subtitleSignUp: 'Gib deine Daten ein, um dem Kader beizutreten',
      
      labelName: 'Dein Name (z.B. Müller)',
      labelEmail: 'E-Mail',
      labelPassword: 'Passwort',
      
      errNameRequired: 'Name ist erforderlich',
      errEmailRequired: 'E-Mail ist erforderlich',
      errEmailInvalid: 'Gib eine gültige E-Mail ein (z.B. spieler@mail.com)',
      errPasswordRequired: 'Passwort ist erforderlich',
      errPasswordLength: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      
      btnSubmitSignIn: 'Kabine Betreten',
      btnSubmitSignUp: 'Registrieren und Betreten',
      
      toggleToSignIn: 'Du hast bereits ein Konto? Anmelden',
      toggleToSignUp: 'Noch kein Konto? Konto erstellen',
      forgotPassword: 'Passwort vergessen?',
      
      btnGoogle: 'Mit Google fortfahren',
      
      resetTitle: 'Passwort Wiederherstellen',
      resetSubtitle: 'Gib deine E-Mail ein. Du erhältst einen sicheren Link, um dein Passwort zurückzusetzen.',
      resetEmailLabel: 'Deine E-Mail',
      resetBtnCancel: 'Abbrechen',
      resetBtnSend: 'Link Senden',
      
      msgConfirmEmailTitle: 'Bestätige deine E-Mail',
      msgConfirmEmailText: 'Konto erfolgreich erstellt! Wir haben einen Bestätigungslink in deinen Posteingang gesendet. Bitte bestätige deine E-Mail, bevor du die Kabine betrittst.',
      msgConfirmEmailOk: 'Verstanden',
      msgLoginSuccess: 'Erfolgreich angemeldet!',
      msgResetSent: 'Wiederherstellungs-E-Mail gesendet! Überprüfe deinen Posteingang.',
    },
    selector: {
      myClubsTitle: 'Meine Clubs',
      myClubsSubtitle: 'Wähle deine Kabine aus',
      roleAdmin: 'Administrator',
      roleMember: 'Mitglied',
      noClubs: "Du gehörst noch keinem Club an.",
      btnCreateClub: 'Neuen Club Erstellen',
      
      joinWithCodeTitle: 'Mit Code Beitreten',
      joinWithCodeSubtitle: 'Einladung erhalten? Gib den Code ein, um dem Kader beizutreten.',
      inputCodeLabel: 'Club-Code',
      inputCodePlaceholder: 'Z.B. FC-1234',
      btnJoin: 'Beitreten',
      
      modalCreateTitle: 'Neuer Club',
      inputClubName: 'Clubname',
      btnCancel: 'Abbrechen',
      btnCreate: 'Erstellen',
      
      errCreateClub: 'Fehler beim Erstellen des Clubs: ',
      msgClubCreated: 'Club erfolgreich erstellt!',
      warnEnterCode: 'Bitte gib einen Code ein.',
      errInvalidCode: 'Ungültiger Code! Bestätige dies mit dem Club-Administrator.',
      infoAlreadyMember: 'Du bist bereits Mitglied oder hast eine ausstehende Anfrage für {clubName}!',
      errJoinClub: 'Fehler beim Beitreten des Clubs: ',
      msgJoinSuccess: 'Anfrage an {clubName} gesendet! Bitte warte auf die Genehmigung.',
    },
    dashboard: {
      header: {
        loading: 'Motoren aufwärmen...',
        code: 'Code:',
        copyCodeTooltip: 'Code Kopieren',
        shareTooltip: 'Einladung Senden',
        menuProfile: 'Mein Profil',
        menuSwitchClub: 'Club Wechseln',
        menuLogout: 'Abmelden',
        menuHelp: 'Hilfe Anfordern',
        menuFeedback: 'Feedback Senden',
        menuFaqs: 'FAQs'
      },
      empty: {
        noMatchesTitle: 'Keine geplanten Spiele',
        noMatchesDesc: 'In diesem Club gibt es noch keine offenen Aufgebote.',
        btnFirstMatch: 'Erstes Spiel Planen',
        noFilterTitle: 'Keine Spiele in dieser Ansicht',
        noFilterDesc: 'Wir konnten keine Spiele für diese Suche finden. Wechsle die Registerkarte, um vergangene Spiele zu sehen oder ein neues zu planen.'
      },
      filters: {
        calendar: 'Kalender',
        next: 'Nächstes',
        voting: 'Abstimmung',
        pending: 'Ausstehend',
        month: 'Monat',
        all: 'Alle',
        closed: 'Abgeschlossen'
      },
      match: {
        statusClosed: 'BEENDET',
        statusVoting: 'ABSTIMMUNG',
        statusOpen: 'OFFEN',
        location: 'Ort',
        capacity: 'Plätze',
        price: 'Preis',
        btnSquad: 'Kader',
        btnAskConfirm: 'Bestätigung Anfordern',
        btnEdit: 'Bearbeiten',
        btnDelete: 'Löschen',
        btnCloseMatch: 'Spiel Schließen',
        btnInscribed: 'Eingeschrieben',
        btnPlay: 'Ich Spiele',
        btnFull: 'Voll',
        btnReopen: 'Spiel Bearbeiten / Wiederöffnen',
        btnRate: 'Spiel Bewerten',
        btnVoted: 'Stimme Registriert',
        btnClosePolls: 'Abstimmung Schließen und MVP',
        btnResults: 'Ergebnisse'
      },
      notify: {
        codeCopied: 'Code {code} kopiert! Du kannst ihn auf WhatsApp einfügen.',
        noCode: 'Dieser Club hat noch keinen Einladungscode.',
        inviteCopied: 'Einladungstext kopiert! Füge ihn überall ein.',
        inviteTitle: 'Einladung zu MatchDay',
        inviteMsg: 'Werde Teil meines Kaders "{clubName}" bei MatchDay! ⚽\n\nKlicke auf den Link, um automatisch beizutreten:\n{link}\n\n(Wenn die App danach fragt, lautet der Code: {code})',
        matchDeleted: 'Spiel aus dem Kalender gelöscht.',
        deleteMatchTitle: 'Spiel Löschen',
        deleteMatchMsg: 'Bist du sicher? Das Spiel und alle Einschreibungen werden dauerhaft gelöscht.',
        btnYesDelete: 'Ja, Löschen',
        btnCancel: 'Abbrechen',
        alertSent: 'Warnungen an die Startelf gesendet!',
        askConfirmTitle: 'Bestätigung Anfordern',
        askConfirmMsg: 'Du bist dabei, {count} derzeit eingeschriebene Spieler zu benachrichtigen, um ihre Anwesenheit zu bestätigen. Fortfahren?',
        btnSendAlerts: 'Warnungen Senden',
        pushTitleConfirm: '🗓️ Anwesenheitsbestätigung',
        pushMsgConfirm: 'Das Spiel rückt näher! Bestätige, ob du verfügbar bist oder ob wir einen Ersatz suchen müssen.',
        pwdMismatch: 'Passwörter stimmen nicht überein.',
        profileUpdated: 'Spielerprofil aktualisiert!',
        errSaveProfile: 'Fehler beim Speichern des Profils: ',
        removePhotoTitle: 'Foto Entfernen',
        removePhotoMsg: 'Bist du sicher, dass du dein Profilfoto löschen möchtest?',
        btnYesRemovePhoto: 'Ja, Löschen',
        reopenMatchTitle: 'Spiel Wiederöffnen',
        reopenMatchMsg: 'Bist du sicher, dass du dieses Spiel zur Bearbeitung wieder öffnen möchtest? Die aktuellen Tore bleiben erhalten, damit du sie anpassen kannst.',
        matchReopened: 'Spiel erfolgreich wieder geöffnet!',
        clearTeamsTitle: 'Teams Leeren',
        clearTeamsMsg: 'Bist du sicher, dass du alle Entscheidungen löschen und alle Spieler ohne Zuweisung lassen möchtest?',
        btnYesClear: 'Ja, Leeren',
        teamsCleared: 'Alle Entscheidungen wurden gelöscht!',
        capacityFull: 'Immer mit der Ruhe Trainer! Das Spiel hat nur noch {count} freie Plätze.',
        playersConvoked: '{count} Spieler erfolgreich nominiert!',
        paymentConfirmed: 'Zahlung bestätigt!',
        paymentReverted: 'Zahlung rückgängig gemacht.',
        playerRemoved: 'Spieler aus dem Spiel entfernt.',
        playerAccepted: 'Spieler in den Kader aufgenommen!',
        requestRejected: 'Anfrage abgelehnt.',
        dayOccupiedTitle: 'Achtung: Belegter Tag',
        dayOccupiedMsg: 'Du hast für diesen Tag bereits ein Spiel geplant. Möchtest du wirklich ein weiteres planen und Spiele überschneiden lassen?',
        btnYesSchedule: 'Ja, Trotzdem planen',
        matchUpdatedFuture: 'Spiel aktualisiert und Regeln auf den zukünftigen Kalender angewendet!',
        matchUpdated: 'Spiel erfolgreich aktualisiert!',
        matchCreated: 'Spiel erfolgreich geplant!',
        blockedSecurity: 'Aus Sicherheitsgründen blockiert! Hast du das Skript im SQL Editor ausgeführt?',
        statsSavedLive: 'Statistiken in Echtzeit gespeichert!',
        errSaveData: 'Fehler beim Speichern der Daten.',
        errVoteMvp: 'Du musst deinen Spieler des Spiels (MVP) wählen!',
        errAlreadyVoted: 'Du hast bei diesem Spiel bereits abgestimmt!',
        votesRegistered: 'Stimmen erfolgreich registriert!',
        closePollsTitle: 'Ergebnisse Auswerten',
        closePollsMsg: 'Diese Aktion schließt die Abstimmung, berechnet die Durchschnitte, verleiht die MVP-Auszeichnung und beendet das Spiel dauerhaft. Bestätigen?',
        btnClosePollsAction: 'Abstimmung Schließen',
        pollsClosed: 'Abstimmung geschlossen! MVP erfolgreich berechnet.',
        pushTitleResults: '🏆 Endergebnisse',
        pushMsgResults: 'Die Abstimmung ist beendet! Finde heraus, wer der MVP ist und wie die Spielernoten lauten.',
        teamsSorted: 'Teamauslosung abgeschlossen!',
        errGenerateTeams: 'Fehler beim Erstellen der Teams.',
        memberPromoted: 'Mitglied zum Administrator befördert!',
        demoteMemberTitle: 'Mitglied Herabstufen',
        demoteMemberMsg: 'Bist du sicher? Dieses Mitglied verliert den Zugriff auf das Club-Verwaltungspanel.',
        memberDemoted: 'Mitglied aus dem Trainerstab entfernt.',
        errRls: 'RLS FEHLER: Du hast keine Berechtigungen in der Datenbank, um dies zu ändern.',
        permsUpdated: 'Berechtigungen aktualisiert!',
        settingsSaved: 'Club-Einstellungen gespeichert!',
        squadLimitWarn: 'Die Kapazität wurde auf {limit} reduziert. Überschüssige Spieler aus der Startelf-Liste wurden entfernt.',
        warnConfigRoutine: 'Bitte konfiguriere zuerst den festen Tag und die Uhrzeit in den Club-Einstellungen.',
        infoNoMoreDays: 'In diesem Monat gibt es keine passenden Tage mehr.',
        overlapTitle: 'Überschneidungswarnung',
        overlapMsg: 'Du hast bereits Spiele an diesen Tagen: {dates}. Möchtest du diese Spiele trotzdem generieren und Duplikate im Kalender erstellen?',
        btnGenerateAnyway: 'Trotzdem generieren',
        bulkGenerated: '{count} Spiele mit bestätigter Startelf generiert!',
        noConvokedAlerts: 'Es gibt noch keine nominierten Spieler, die benachrichtigt werden können.'
      },
      modals: {
        createMatchTitle: 'Neues Aufgebot',
        editMatchTitle: 'Spiel Bearbeiten',
        toggleDefaults: 'Mit Club-Einstellungen sperren',
        dateLabel: 'Datum und Uhrzeit',
        locationLabel: 'Ort / Feld',
        capacityLabel: 'Kapazität',
        startersLabel: 'Startelf',
        priceLabel: 'Preis (€)',
        teamAName: 'Name Team A',
        teamBName: 'Team B',
        singleTeamName: 'Teamname',
        applyFuture: 'Preis, Kapazität und Ort auf zukünftige offene Spiele anwenden',
        btnSaveEdit: 'Änderungen Speichern',
        btnPublish: 'Veröffentlichen (Nur 1)',
        btnGenerateBulk: 'Ganzen Monat Generieren',
        btnCancel: 'Abbrechen',
        
        presencesTitle: 'Aufgebot & Teams',
        adminPanelTitle: 'Admin-Panel: Kaderspieler Einschreiben',
        btnSelectPlayers: 'Kaderspieler Auswählen',
        noPlayersInscribed: 'Noch keine Spieler eingeschrieben.',
        btnAutoBalance: 'Auto',
        btnClearTeams: 'Leeren',
        btnViewTactics: 'Taktik Ansehen',
        btnViewSummary: 'Zusammenfassung',
        statusConfirmed: 'Bestätigt',
        statusWaitlist: 'Warteliste',
        
        closeMatchTitle: 'Spielstatistiken',
        goalsLabel: 'TORE',
        assistsLabel: 'VORL',
        btnSaveLive: 'Speichern (Live)',
        btnCloseMatch: 'Spiel Schließen',
        
        staffTitle: 'Trainerstab & Berechtigungen',
        addStaffTitle: 'Mitglied zum Stab Hinzufügen',
        searchPlayerPlaceholder: 'Spieler im Kader suchen...',
        btnPromote: 'Befördern',
        roleOwner: 'Club-Besitzer',
        roleAdmin: 'Administrator',
        permManageMatches: 'Spiele Verwalten',
        permManageTeams: 'Kader Verwalten',
        permManageFinances: 'Schatzmeister',
        tooltipRemoveStaff: 'Aus Trainerstab Entfernen',
        
        requestsTitle: 'Beitrittsanfragen',
        reqSubtitle: 'Möchte dem Kader beitreten',
        tooltipReject: 'Ablehnen',
        tooltipApprove: 'Genehmigen',
        noRequests: 'Keine ausstehenden Anfragen.',
        
        settingsTitle: 'Club-Einstellungen',
        tabFinances: 'Finanzen',
        defaultPrice: 'Standardpreis pro Spiel (€)',
        monthlyPrice: 'Preis pro Spiel (Monatlich) (€)',
        tabLogistics: 'Logistik',
        defaultLocation: 'Standard-Feld',
        maxCapacity: 'Maximale Kapazität',
        startersPerTeam: 'Startelf (Z.B. 11, 7)',
        tabTeams: 'Teams',
        tabColors: 'Standardfarben',
        colorTeamA: 'Farbe Team A',
        colorTeamB: 'Farbe Team B',
        colorSingleTeam: 'Teamfarbe',
        tabRoutine: 'Wöchentliche Routine',
        matchDay: 'Fester Spieltag',
        matchTime: 'Feste Uhrzeit',
        tabFut: 'FUT Attribute',
        viewMode: 'Anzeigemodus',
        toggleHideRatings: 'Bewertungen/OVR für Mitglieder ausblenden',
        toggleVoting: 'Post-Match MVP-Abstimmung aktivieren',
        toggleSingleTeam: 'Einzelteam-Modus',
        toggleProAttributes: 'Detaillierte Attribute Aktivieren',
        tabFixedStarters: 'Feste Startelf',
        manageFixedStarters: 'Feste Startelf Verwalten',
        btnSaveSettings: 'Einstellungen Speichern',
        
        votingTitle: 'Abstimmung & MVP',
        votingDesc: 'Gib deinen Mitspielern eine Note von 1 bis 10 und wähle, wer es verdient, den Ball mit nach Hause zu nehmen (MVP).',
        votingAnonInfo: 'Deine Abstimmung ist zu 100% anonym.',
        labelMVP: 'MVP',
        btnSubmitVotes: 'Stimmen Abgeben',
        
        resultsTitle: 'Spielzusammenfassung',
        resultsGoals: 'Tore',
        resultsAssists: 'Vorl',
        resultsRating: 'NOTE',
        
        summaryTitle: 'Team-Zusammenfassung',
        tabList: 'Liste Ansehen',
        tabPitch: 'Taktik Ansehen',
        teamTitulares: 'Auf dem Platz (Startelf)',
        teamBanco: 'Auswechselbank',
        avgOvr: 'Ø OVR:',
        unassignedPlayer: 'Kein Spieler zugewiesen',
        btnBothTeams: 'Beide',
        
        profileTitle: 'Mein Profil',
        personalData: 'Persönliche Daten',
        playerName: 'Spielername',
        fieldPrefs: 'Feld-Präferenzen',
        genPosition: 'Allgemeine Position',
        specPosition: 'Spezifische Position',
        prefFoot: 'Starker Fuß',
        security: 'Sicherheit',
        newPassword: 'Neues Passwort',
        newPasswordPlaceholder: 'Leer lassen, um aktuelles zu behalten',
        confirmPassword: 'Neues Passwort Bestätigen',
        btnSaveProfile: 'Speichern',
        
        convokTitle: 'Spieler für das Spiel Nominieren',
        convokSearch: 'Im Kader suchen...',
        btnInviteSelected: 'Ausgewählte Einladen',
        
        squadModalTitle: 'Feste Startelf Auswählen',
        squadSearch: 'Spieler suchen...',
        btnDone: 'Fertig',
        
        faqTitle: 'Häufig Gestellte Fragen (FAQs)',
        btnUnderstood: 'Verstanden'
      },
      faqs: [
        {
          icon: 'phone_android',
          q: 'Wie installiere ich die App auf dem Handy (PWA)?',
          a: 'Du kannst die App für ein schnelles, immersives Erlebnis direkt zu deinem Startbildschirm hinzufügen. Öffne unter Android das Browsermenü und klicke auf "App installieren" oder "Zum Startbildschirm hinzufügen". Klicke auf dem iPhone (iOS) auf die Safari-Teilen-Schaltfläche und wähle "Zum Home-Bildschirm".'
        },
        {
          icon: 'vpn_key',
          q: 'Wie gründe ich einen Fußballclub oder trete einem bei?',
          a: 'Auf dem Clubauswahl-Bildschirm kannst du einen neuen Club gründen, indem du seinen Namen festlegst, oder einem bestehenden privaten Club beitreten, indem du den 8-stelligen Einladungscode eingibst, den dir ein Administrator gegeben hat.'
        },
        {
          icon: 'verified_user',
          q: 'Was passiert, nachdem ich eine Beitrittsanfrage an einen Club gesendet habe?',
          a: 'Deine Anfrage muss erst noch genehmigt werden. Der Club-Besitzer oder die Administratoren erhalten eine Benachrichtigung und können deinen Eintritt in die Kabine genehmigen oder ablehnen, bevor du an Spielen teilnehmen kannst.'
        },
        {
          icon: 'manage_accounts',
          q: 'Wie funktionieren der Trainerstab und die Berechtigungen?',
          a: 'Der Club-Besitzer und die Administratoren können detaillierte Berechtigungen für andere Mitglieder verwalten. Es ist möglich, bestimmten Personen den Zugriff zur Verwaltung von Spielen, des Kaders oder die Rolle des Schatzmeisters zuzuweisen.'
        },
        {
          icon: 'account_circle',
          q: 'Wie kann ich mein Spielerprofil anpassen?',
          a: 'Klicke im Seitenmenü auf "Mein Profil". Du kannst deinen Spielernamen ändern, ein personalisiertes Foto für deinen Avatar hochladen, deine allgemeine und spezifische Position sowie deinen starken Fuß festlegen und dein Passwort aktualisieren.'
        },
        {
          icon: 'calendar_today',
          q: 'Wie plane ich ein neues Spiel?',
          a: 'Administratoren können auf die schwebende "+"-Schaltfläche im Kalender klicken, um ein neues Aufgebot zu erstellen. Du kannst Datum, Uhrzeit, Ort, maximale Kapazität, Startelfspieler pro Team, Preis pro Spieler und Teamnamen festlegen.'
        },
        {
          icon: 'auto_mode',
          q: 'Wie funktioniert die Generierung von Spielen für den ganzen Monat?',
          a: 'Indem du in den Club-Einstellungen einen festen Wochentag und eine feste Uhrzeit konfigurierst, kann das System automatisch alle entsprechenden Spiele des Monats generieren und die festgelegten Stammspieler sofort eintragen.'
        },
        {
          icon: 'how_to_reg',
          q: 'Wie melde ich mich für ein Spiel an oder ab?',
          a: 'Auf den Karten für offene Spiele kannst du auf "Ich Spiele" klicken, um dir deinen Platz im Rahmen der verfügbaren Kapazität zu sichern. Administratoren können auch jeden Kaderspieler direkt über das Aufgebots-Fenster einschreiben.'
        },
        {
          icon: 'sports_soccer',
          q: 'Wie funktioniert die automatische Teamauslosung?',
          a: 'Im Aufgebots- und Team-Fenster können Admins auf die "Auto"-Schaltfläche klicken. Der Algorithmus gruppiert die Spieler nach Reihen (Verteidiger, Mittelfeldspieler, Stürmer) und gleicht die Teams fair auf Basis der Gesamtwertung (OVR) jedes Athleten aus.'
        },
        {
          icon: 'sports',
          q: 'Was ist der Einzelteam-Modus?',
          a: 'Ideal für freies Training oder wenn sich die Gruppe nicht in Team A und B aufteilt. Wenn diese Option in den Einstellungen aktiviert ist, werden die nominierten Spieler zwischen "Auf dem Platz (Startelf)" (mit taktischer Formationsunterstützung) und der "Auswechselbank" verwaltet.'
        },
        {
          icon: 'groups_2',
          q: 'Was sind virtuelle Spieler?',
          a: 'Das sind Athleten, die von Administratoren manuell erstellt wurden, um Plätze in der App zu füllen, wenn ein gelegentlicher Freund noch kein Konto hat. Sie haben ihre eigenen Positionen und Attribute für die Teambalance.'
        },
        {
          icon: 'stars',
          q: 'Wofür sind Feste Startspieler?',
          a: 'In den Club-Einstellungen kannst du eine feste Basis von Spielern auswählen, die normalerweise den Kader bilden. Diese Spieler können bei der Erstellung neuer Events automatisch und unkompliziert eingeschrieben und berücksichtigt werden.'
        },
        {
          icon: 'sports_esports',
          q: 'Wie funktionieren die FUT-Karten und die Spielerattribute?',
          a: 'Jeder Kaderspieler besitzt eine interaktive Karte im Ultimate Team (FUT)-Stil. Administratoren können die Attribute des Spielers bearbeiten, und das System berechnet automatisch das gewichtete Gesamtrating (OVR) basierend auf der Position und den spezifischen Gewichtungen jedes Sektors.'
        },
        {
          icon: 'tune',
          q: 'Was ist der Unterschied zwischen dem Einfachen Modus und dem Pro-Modus (Detailliert)?',
          a: 'Der Einfache Modus verwaltet die 6 Hauptattribute (Tempo, Schießen, Passen, Dribbling, Defensive, Physis). Der Pro-Modus erweitert diese auf 29 detaillierte In-Game-Unterattribute (wie Antritt, Abschluss, Beweglichkeit). Die App verwendet duale Spalten, sodass du ohne Datenverlust zwischen den Modi wechseln kannst.'
        },
        {
          icon: 'visibility_off',
          q: 'Kann ich Attribute und Bewertungen für Mitglieder ausblenden?',
          a: 'Ja. In den Club-Einstellungen gibt es eine Schaltfläche "Bewertungen/OVR Ausblenden". Wenn diese aktiviert ist, sehen normale Spieler die Zahlenwerte auf den Kaderkarten und in den Spielen nicht mehr, was die Privatsphäre wahrt, während Administratoren weiterhin vollen Zugriff haben.'
        },
        {
          icon: 'style',
          q: 'Was bedeuten die speziellen Kartendesigns (Gold, Silber, Bronze, In-Form, Icon)?',
          a: 'Die Kartenfarben passen sich dem OVR-Level an (Gold für 80+, Silber für 70+, Bronze darunter). Zusätzlich erhalten die drei besten Spieler des Vormonats den "In-Form"-Status, und es gibt spezielle "Icon"-Editionen, die durch den Namen ausgelöst werden.'
        },
        {
          icon: 'sports_score',
          q: 'Wie schließe ich ein Spiel ab und trage Tore und Vorlagen ein?',
          a: 'Wenn ein Spiel endet, kann ein Administrator auf "Spiel Schließen" klicken. Ein interaktives Panel öffnet sich, in dem Tore und Vorlagen für jeden Athleten in Echtzeit angepasst werden können, wobei das Endergebnis automatisch berechnet wird.'
        },
        {
          icon: 'how_to_vote',
          q: 'Wie funktioniert die MVP-Wahl und die Post-Match-Bewertung?',
          a: 'Nach der anfänglichen Schließung des Spiels durch einen Admin beginnt die Abstimmungsphase. Jeder Spieler kann seinen Teamkollegen eine Note von 1-10 geben und anonym den Spieler des Spiels (MVP) wählen. Schließlich schließt der Admin die Umfrage, um die Gewinner zu ermitteln.'
        },
        {
          icon: 'leaderboard',
          q: 'Wie werden das Saison-Ranking und die Statistiken berechnet?',
          a: 'Der Statistik-Bildschirm stellt die Leistungen aller abgeschlossenen Spiele zusammen. Jeder Sieg gibt 3 Punkte, ein Unentschieden 1 Punkt und eine Niederlage 0 Punkte. Du kannst nach Punkten, Toren, Vorlagen oder Durchschnittsnoten sortieren und Monat für Monat filtern.'
        },
        {
          icon: 'account_balance_wallet',
          q: 'Wie funktioniert das Kassen- und Abrechnungsmodul?',
          a: 'Die Kasse verwaltet zwei Modelle: Bezahlung pro Spiel für Gelegenheitsspieler und die Verwaltung der Monatsbeiträge für feste Startspieler. Das System berechnet automatisch die erwarteten Einnahmen basierend auf der Anzahl der Spiele im Monat und ermöglicht es dir, geleistete Zahlungen abzuwickeln.'
        },
        {
          icon: 'notifications_active',
          q: 'Wie funktionieren Zahlungs- und Verfügbarkeitserinnerungen?',
          a: 'Durch integrierte Push-Benachrichtigungen können Admins und Schatzmeister automatische, gezielte Benachrichtigungen direkt auf die Handys der Spieler senden, die Zahlungsrückstände haben, oder Erinnerungen zur Bestätigung ihrer Anwesenheit verschicken.'
        },
        {
          icon: 'sync',
          q: 'Funktioniert die App offline oder wird sie in Echtzeit aktualisiert?',
          a: 'Die App verwendet WebSockets und Echtzeit-Abonnements von Supabase. Wann immer sich jemand für ein Spiel anmeldet oder eine Zahlung registriert, wird der Bildschirm aller verbundenen Benutzer sofort aktualisiert, ohne dass ein Aktualisieren erforderlich ist.'
        },
        {
          icon: 'support_agent',
          q: 'Wie kann ich den Support kontaktieren oder Vorschläge senden?',
          a: 'Im Seitenmenü des Clubs hast du direkte Schaltflächen für "Hilfe Anfordern" und "Feedback Senden", die automatisch deinen vorkonfigurierten E-Mail-Client mit der Support-Adresse der App öffnen.'
        },
        {
          icon: 'lock_reset',
          q: 'Was tun, wenn ich den Zugriff auf mein Konto verliere?',
          a: 'Nutze auf dem Anmeldebildschirm die Option zur Passwortwiederherstellung, indem du deine E-Mail eingibst, um sichere Anweisungen zum Zurücksetzen zu erhalten, oder entscheide dich für eine schnelle Anmeldung über dein Google-Konto.'
        },
        {
          icon: 'security',
          q: 'Sind meine Daten und Abstimmungen sicher?',
          a: 'Ja. Die gesamte Anwendung wird durch strenge Row Level Security (RLS)-Richtlinien auf Datenbankebene geschützt, die gewährleisten, dass nur autorisierte Mitglieder jedes Clubs ihre Kabinen-Informationen einsehen und bearbeiten können.'
        }
      ]
    },
    layout: {
      tabs: {
        games: 'Spiele',
        players: 'Kader',
        stats: 'Statistiken',
        finances: 'Kasse'
      },
      pwa: {
        installTitle: 'App Installieren',
        installDescIOS: 'Tippe auf Teilen und "Zum Home-Bildschirm"',
        installDescAndroid: 'Füge sie für ein schnelles Erlebnis zum Startbildschirm hinzu!',
        btnInstall: 'Installieren'
      },
      push: {
        title: 'Warnungen Aktivieren',
        desc: 'Erhalte Benachrichtigungen über Aufgebote und Zahlungen.',
        btnEnable: 'Aktivieren',
        errNotSupported: 'Dein aktueller Browser unterstützt keine Web-Benachrichtigungen.',
        errDenied: 'Erlaubnis verweigert. Aktiviere Benachrichtigungen in den Browsereinstellungen.',
        errNoWorker: 'Der Service Worker ist nicht aktiv.',
        successEnabled: 'Warnungen erfolgreich aktiviert!',
        errGeneric: 'Fehler beim Aktivieren der Benachrichtigungen.'
      }
    },
    players: {
      header: {
        title: 'Kader',
        btnCreateVirtual: 'Virtuellen Erstellen'
      },
      card: {
        tooltipVirtual: 'Manueller Virtueller Spieler'
      },
      modals: {
        createVirtualTitle: 'Virtuellen Spieler Hinzufügen',
        createVirtualName: 'Spielername',
        createVirtualGenPos: 'Allgemeine Position',
        createVirtualSpecPos: 'Spezifische Position',
        createVirtualBtnCancel: 'Abbrechen',
        createVirtualBtnSave: 'Verpflichten',
  
        editTitle: 'Spieler Bearbeiten',
        editOverall: 'GESAMT',
        editModeProDesc: 'Pro-Modus: Detaillierte Bearbeitung',
        
        pace: 'TEM',
        shooting: 'SCH',
        passing: 'PAS',
        dribbling: 'DRI',
        defending: 'DEF',
        physical: 'PHY',
        
        diving: 'HEC',
        handling: 'BAL',
        kicking: 'ABS',
        reflexes: 'REF',
        speed: 'TEM',
        positioning: 'STE',
  
        catPace: 'Tempo (TEM)',
        accel: 'Antritt',
        sprint: 'Sprintgeschwindigkeit',
        
        catShooting: 'Schießen (SCH)',
        pos: 'Stellungsspiel',
        finish: 'Abschluss',
        shotPower: 'Schusskraft',
        longShots: 'Fernschüsse',
        volleys: 'Volleys',
        penalties: 'Elfmeter',
        
        catPassing: 'Passen (PAS)',
        vision: 'Übersicht',
        crossing: 'Flanken',
        freeKick: 'Freistoß-Präzision',
        shortPass: 'Kurzer Pass',
        longPass: 'Langer Pass',
        curve: 'Effet',
        
        catDribbling: 'Dribbling (DRI)',
        agility: 'Beweglichkeit',
        balance: 'Balance',
        reactions: 'Reaktionen',
        ballControl: 'Ballkontrolle',
        dribble: 'Dribbling',
        composure: 'Ruhe',
        
        catDefending: 'Defensive (DEF)',
        interceptions: 'Abfangen',
        heading: 'Kopfball-Präzision',
        defAware: 'Defensives Bewusstsein',
        standTackle: 'Faire Zweikämpfe',
        slideTackle: 'Grätschen',
        
        catPhysical: 'Physis (PHY)',
        jumping: 'Sprungkraft',
        stamina: 'Ausdauer',
        strength: 'Stärke',
        aggression: 'Aggressivität',
  
        btnRemove: 'Entfernen',
        btnCancel: 'Abbrechen',
        btnSave: 'Speichern'
      },
      notify: {
        onlyStaffEdit: 'Nur der Trainerstab kann Spieler bearbeiten.',
        virtualHired: 'Virtueller Spieler verpflichtet!',
        statsUpdated: 'FUT Attribute im Club aktualisiert!',
        errSave: 'Fehler beim Speichern: ',
        errOwnerRemove: 'Der Club-Besitzer kann nicht entfernt werden.',
        confirmRemoveTitle: 'Spieler Entfernen',
        confirmRemoveMsg: 'Bist du sicher, dass du {name} aus dem Kader werfen willst? Diese Aktion kann rückgängig gemacht werden, wenn er erneut anfragt.',
        btnYesRemove: 'Ja, Entfernen',
        btnCancel: 'Abbrechen',
        playerRemoved: 'Spieler aus dem Kader entfernt!'
      },
      categories: [
        { label: 'Exzellent', value: 96 },
        { label: 'Sehr Gut', value: 90 },
        { label: 'Gut', value: 82 },
        { label: 'Durchschnitt', value: 70 },
        { label: 'Schlecht', value: 55 },
        { label: 'Schrecklich', value: 40 }
      ]
    },
    finances: {
      headerTitle: 'Kasse',
      tabs: {
        resumo: 'Spiele',
        mensalidades: 'Monatliche Gebühren'
      },
      loading: 'Lade Finanzen...',
      matches: {
        pendingPayments: 'Ausstehende Zahlungen',
        allSettledTitle: 'Alles Beglichen!',
        allSettledDesc: 'Monatliche Zahler wurden herausgefiltert. Kein Gelegenheitsspieler schuldet noch etwas für Spiele.',
        missing: 'Es fehlen {count}',
        value: 'Wert: ',
        btnPaid: 'Bezahlt'
      },
      monthly: {
        btnStarters: 'Startelf',
        gamesInMonth: 'Spiele im Monat:',
        monthlyFee: 'Monatliche Gebühr:',
        missingPayTitle: 'Ausstehende Zahlung',
        btnReminders: 'Zahlungserinnerungen',
        allPaidUp: 'Alle monatlichen Zahler sind auf dem neuesten Stand!',
        alreadyPaidTitle: 'Bereits Bezahlt',
        noPaymentsThisMonth: 'Keine Zahlungen in diesem Monat registriert.'
      },
      configModal: {
        title: 'Zahlungsmodus (Startelf)',
        noStartersDef: 'Du hast die feste Startelf in den Club-Einstellungen noch nicht definiert.',
        optMonthly: 'Monatlicher Zahler',
        optPerMatch: 'Zahlung pro Spiel'
      },
      notify: {
        errRestricted: 'Eingeschränkter Zugang zur Kasse.',
        infoSearchingDebtors: 'Suche nach Spielern mit ausstehenden Zahlungen...',
        warnNoDebtorsApp: 'Es gibt keine Spieler mit einem App-Konto, die gewarnt werden müssten.',
        warnNoPushEnabled: 'Schuldner haben keine mobilen Benachrichtigungen aktiviert.',
        pushTitleMatchDay: 'MatchDay',
        pushMsgMonthly: 'Du hast eine ausstehende Zahlung für {month}.',
        pushMsgMatch: 'Du hast eine ausstehende Zahlung für das Spiel am {date} bei {location}.',
        alertsSent: 'Warnungen erfolgreich an {count} Schuldner gesendet!',
        errCriticalPush: 'Kritischer Fehler beim Senden der Benachrichtigungen.',
        errSupabase: 'Supabase Fehler: ',
        configSavedMonth: 'Konfiguration für diesen Monat gespeichert!',
        paymentRegistered: 'Zahlung registriert!',
        matchLiquidated: 'Spiel vollständig abgerechnet!'
      }
    },
    stats: {
      headerTitle: 'Saisonstatistiken',
      noStatsTitle: 'Keine Statistischen Daten',
      noStatsDesc: 'Es gibt noch keine abgeschlossenen Spiele mit Ergebnissen zur Berechnung des Rankings.',
      timeFilterFullSeason: 'Ganze Saison',
      columns: {
        player: 'Spieler',
        matches: 'S',
        matchesTooltip: 'Gespielte Spiele',
        goals: 'T',
        goalsTooltip: 'Geschossene Tore',
        assists: 'V',
        assistsTooltip: 'Vorlagen',
        rating: '★',
        ratingTooltip: 'Durchschnittsnote (1 bis 10)',
        mvp: 'MVP',
        mvpTooltip: 'Spieler des Spiels (Auszeichnungen)',
        wins: 'S',
        winsTooltip: 'Siege',
        draws: 'U',
        drawsTooltip: 'Unentschieden',
        losses: 'N',
        lossesTooltip: 'Niederlagen',
        points: 'PKT'
      },
      unknownPlayer: 'Unbekannt'
    },
    join: {
      processing: 'Einladung wird verarbeitet...',
      entering: 'Du trittst deinem neuen Fußballclub bei.',
      errLogin: 'Melde dich an oder erstelle ein Konto, um dem Club beizutreten!',
      errSend: 'Fehler beim Senden der Anfrage: ',
      infoPending: 'Du hast bereits eine ausstehende Anfrage oder bist bereits in diesem Club.',
      success: 'Beitrittsanfrage erfolgreich gesendet! Bitte warte auf Genehmigung.'
    },
    error404: {
      title: 'Hoppla. Nichts hier...',
      btnHome: 'Startseite'
    },
    common: {
      language: 'Sprache',
      system: 'Systemstandard'
    },
    days: [
      { label: 'Montag', value: 1 }, { label: 'Dienstag', value: 2 }, { label: 'Mittwoch', value: 3 },
      { label: 'Donnerstag', value: 4 }, { label: 'Freitag', value: 5 }, { label: 'Samstag', value: 6 }, { label: 'Sonntag', value: 7 }
    ],
    positions: ['Torwart', 'Verteidiger', 'Mittelfeldspieler', 'Stürmer'],
    feet: ['Rechts', 'Links', 'Beide'],
    specPositions: {
      gr: 'Torwart (TW)',
      dc: 'Innenverteidiger (IV)',
      ld: 'Rechter Verteidiger (RV)',
      le: 'Linker Verteidiger (LV)',
      ad: 'Rechter Außenverteidiger (RAV)',
      ae: 'Linker Außenverteidiger (LAV)',
      mdc: 'Zentrales Defensives Mittelfeld (ZDM)',
      mc: 'Zentrales Mittelfeld (ZM)',
      mco: 'Zentrales Offensives Mittelfeld (ZOM)',
      md: 'Rechtes Mittelfeld (RM)',
      me: 'Linkes Mittelfeld (LM)',
      pl: 'Stürmer (ST)',
      sa: 'Mittelstürmer (MS)',
      ed: 'Rechter Flügel (RF)',
      ee: 'Linker Flügel (LF)'
    }
  }