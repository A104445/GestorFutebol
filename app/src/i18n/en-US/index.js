export default {
    login: {
      appTitle: 'MatchDay',
      appSubtitle: 'Your locker room app. Organize matches, invite friends, and rule the pitch.',
      slideSquadTitle: 'Your Squad',
      slideSquadSubtitle: 'Balance teams automatically and manage presences in a blink of an eye.',
      slideMvpTitle: 'MVP Election',
      slideMvpSubtitle: 'At the end of the match, rate your teammates anonymously and find out who takes the Golden Ball!',
      btnStart: 'Start Playing',
      
      titleSignIn: 'Sign In',
      titleSignUp: 'Create Account',
      subtitleSignIn: 'Welcome back to the locker room',
      subtitleSignUp: 'Fill in your details to join the squad',
      
      labelName: 'Your Name (e.g. Rui Costa)',
      labelEmail: 'Email',
      labelPassword: 'Password',
      
      errNameRequired: 'Name is required',
      errEmailRequired: 'Email is required',
      errEmailInvalid: 'Enter a valid email (e.g. player@mail.com)',
      errPasswordRequired: 'Password is required',
      errPasswordLength: 'Password must have at least 6 characters',
      
      btnSubmitSignIn: 'Enter Locker Room',
      btnSubmitSignUp: 'Register and Enter',
      
      toggleToSignIn: 'Already have an account? Sign In',
      toggleToSignUp: 'Don\'t have an account? Create Account',
      forgotPassword: 'Forgot password?',
      
      btnGoogle: 'Continue with Google',
      
      resetTitle: 'Recover Password',
      resetSubtitle: 'Enter your email. You will receive a secure link to reset your password.',
      resetEmailLabel: 'Your Email',
      resetBtnCancel: 'Cancel',
      resetBtnSend: 'Send Link',
      
      msgConfirmEmailTitle: 'Confirm your Email',
      msgConfirmEmailText: 'Account created successfully! We sent a confirmation link to your inbox. Please validate your email before entering the locker room.',
      msgConfirmEmailOk: 'Understood',
      msgLoginSuccess: 'Successfully logged in!',
      msgResetSent: 'Recovery email sent! Check your inbox.',
    },
    selector: {
        myClubsTitle: 'My Clubs',
        myClubsSubtitle: 'Select your locker room',
        roleAdmin: 'Administrator',
        roleMember: 'Member',
        noClubs: "You don't belong to any club yet.",
        btnCreateClub: 'Create New Club',
        
        joinWithCodeTitle: 'Join with Code',
        joinWithCodeSubtitle: 'Received an invite? Enter the code to join the squad.',
        inputCodeLabel: 'Club Code',
        inputCodePlaceholder: 'E.g. FC-1234',
        btnJoin: 'Join',
        
        modalCreateTitle: 'New Club',
        inputClubName: 'Club Name',
        btnCancel: 'Cancel',
        btnCreate: 'Create',
        
        errCreateClub: 'Error creating club: ',
        msgClubCreated: 'Club created successfully!',
        warnEnterCode: 'Please enter a code.',
        errInvalidCode: 'Invalid code! Confirm with the club administrator.',
        infoAlreadyMember: 'You are already a member or have a pending request for {clubName}!',
        errJoinClub: 'Error joining club: ',
        msgJoinSuccess: 'Join request sent to {clubName}! Please wait for the staff approval.',
      },
      dashboard: {
        header: {
          loading: 'Warming up the engines...',
          code: 'Code:',
          copyCodeTooltip: 'Copy Code',
          shareTooltip: 'Send Invite',
          menuProfile: 'My Profile',
          menuSwitchClub: 'Switch Club',
          menuLogout: 'Logout',
          menuHelp: 'Ask for Help',
          menuFeedback: 'Send Feedback',
          menuFaqs: 'FAQs'
        },
        empty: {
          noMatchesTitle: 'No scheduled matches',
          noMatchesDesc: 'There are no open call-ups for this club yet.',
          btnFirstMatch: 'Schedule First Match',
          noFilterTitle: 'No matches in this view',
          noFilterDesc: 'We couldn\'t find matches for this search. Switch tabs to access past games or schedule a new one.'
        },
        filters: {
          calendar: 'Calendar',
          next: 'Next',
          voting: 'Voting',
          pending: 'Pending',
          month: 'Month',
          all: 'All',
          closed: 'Closed'
        },
        match: {
          statusClosed: 'FINISHED',
          statusVoting: 'VOTING',
          statusOpen: 'OPEN',
          location: 'Location',
          capacity: 'Capacity',
          price: 'Price',
          btnSquad: 'Squad',
          btnAskConfirm: 'Ask Confirmation',
          btnEdit: 'Edit',
          btnDelete: 'Delete',
          btnCloseMatch: 'Close Match',
          btnInscribed: 'Inscribed',
          btnPlay: 'I Will Play',
          btnFull: 'Full',
          btnReopen: 'Edit / Reopen Match',
          btnRate: 'Rate Match',
          btnVoted: 'Vote Registered',
          btnClosePolls: 'Close Polls and MVP',
          btnResults: 'Results'
        },
        notify: {
          codeCopied: 'Code {code} copied! You can paste it on WhatsApp.',
          noCode: 'This club doesn\'t have an invite code yet.',
          inviteCopied: 'Invite text copied! Paste it anywhere.',
          inviteTitle: 'Invite to MatchDay',
          inviteMsg: 'Join my squad "{clubName}" on MatchDay! ⚽\n\nClick the link to join automatically:\n{link}\n\n(If the app asks, the code is: {code})',
          matchDeleted: 'Match deleted from calendar.',
          deleteMatchTitle: 'Delete Match',
          deleteMatchMsg: 'Are you sure? The match and all inscriptions will be permanently deleted.',
          btnYesDelete: 'Yes, Delete',
          btnCancel: 'Cancel',
          alertSent: 'Alerts sent to the starters!',
          askConfirmTitle: 'Ask Confirmation',
          askConfirmMsg: 'You are going to notify {count} players currently inscribed to confirm their presence. Proceed?',
          btnSendAlerts: 'Send Alerts',
          pushTitleConfirm: '🗓️ Presence Confirmation',
          pushMsgConfirm: 'The match is approaching! Confirm if you are available or if we need to find a substitute.',
          pwdMismatch: 'Passwords do not match.',
          profileUpdated: 'Player profile updated!',
          errSaveProfile: 'Error saving profile: ',
          removePhotoTitle: 'Remove Photo',
          removePhotoMsg: 'Are you sure you want to delete your profile photo?',
          btnYesRemovePhoto: 'Yes, Delete',
          reopenMatchTitle: 'Reopen Match',
          reopenMatchMsg: 'Are you sure you want to reopen this match for editing? Current goals will be kept so you can adjust them.',
          matchReopened: 'Match reopened successfully!',
          clearTeamsTitle: 'Clear Teams',
          clearTeamsMsg: 'Are you sure you want to clear all choices and unassign all players?',
          btnYesClear: 'Yes, Clear',
          teamsCleared: 'All choices cleared!',
          capacityFull: 'Take it easy Mister! The match only has {count} spots available.',
          playersConvoked: '{count} player(s) successfully convoked!',
          paymentConfirmed: 'Payment confirmed!',
          paymentReverted: 'Payment reverted.',
          playerRemoved: 'Player removed from the match.',
          playerAccepted: 'Player accepted to the squad!',
          requestRejected: 'Request rejected.',
          dayOccupiedTitle: 'Warning: Busy Day',
          dayOccupiedMsg: 'You already have a match scheduled for this day. Do you really want to schedule another one and overlap matches?',
          btnYesSchedule: 'Yes, Schedule Anyway',
          matchUpdatedFuture: 'Match updated and rules applied to future calendar!',
          matchUpdated: 'Match updated successfully!',
          matchCreated: 'Match scheduled successfully!',
          blockedSecurity: 'Blocked for security! Did you run the SQL Editor script?',
          statsSavedLive: 'Statistics saved in real time!',
          errSaveData: 'Error saving data.',
          errVoteMvp: 'You must elect your Man of the Match (MVP)!',
          errAlreadyVoted: 'You have already voted in this match!',
          votesRegistered: 'Votes registered successfully!',
          closePollsTitle: 'Tally Results',
          closePollsMsg: 'This action closes the polls, calculates averages, awards the MVP, and permanently finishes the match. Confirm?',
          btnClosePollsAction: 'Close Polls',
          pollsClosed: 'Polls closed! MVP tallied successfully.',
          pushTitleResults: '🏆 Final Results',
          pushMsgResults: 'The polls are closed! Find out who the MVP is and the match ratings.',
          teamsSorted: 'Team sorting completed!',
          errGenerateTeams: 'Error generating teams.',
          memberPromoted: 'Member promoted to Administrator!',
          demoteMemberTitle: 'Demote Member',
          demoteMemberMsg: 'Are you sure? This member will lose access to the club management panel.',
          memberDemoted: 'Member removed from Technical Staff.',
          errRls: 'RLS ERROR: You do not have permissions in the DB to change this.',
          permsUpdated: 'Permissions updated!',
          settingsSaved: 'Club settings saved!',
          squadLimitWarn: 'Capacity decreased to {limit}. Surplus players from the Starters list were removed.',
          warnConfigRoutine: 'Please configure the fixed day and time in the Club Settings first.',
          infoNoMoreDays: 'No more matching days in this month.',
          overlapTitle: 'Overlap Warning',
          overlapMsg: 'You already have matches on: {dates}. Do you want to generate these matches anyway and create duplicates?',
          btnGenerateAnyway: 'Generate Anyway',
          bulkGenerated: 'Generated {count} matches with confirmed Starters!',
          noConvokedAlerts: 'There are no convoked players to alert yet.'
        },
        modals: {
            createMatchTitle: 'New Call-up',
            editMatchTitle: 'Edit Match',
            toggleDefaults: 'Lock with club settings',
            dateLabel: 'Date and Time',
            locationLabel: 'Location / Field',
            capacityLabel: 'Capacity',
            startersLabel: 'Starters',
            priceLabel: 'Price (€)',
            teamAName: 'Team A Name',
            teamBName: 'Team B',
            singleTeamName: 'Team Name',
            applyFuture: 'Apply price, capacity, and location to all future open matches',
            btnSaveEdit: 'Save Changes',
            btnPublish: 'Publish (Only 1)',
            btnGenerateBulk: 'Generate Full Month',
            btnCancel: 'Cancel',
            
            presencesTitle: 'Call-up & Teams',
            adminPanelTitle: 'Admin Panel: Inscribe Squad Player',
            btnSelectPlayers: 'Select Squad Players',
            noPlayersInscribed: 'No players inscribed yet.',
            btnAutoBalance: 'Auto',
            btnClearTeams: 'Clear',
            btnViewTactics: 'View Tactics',
            btnViewSummary: 'Summary',
            statusConfirmed: 'Confirmed',
            statusWaitlist: 'Waitlist',
            
            closeMatchTitle: 'Match Statistics',
            goalsLabel: 'GOALS',
            assistsLabel: 'AST',
            btnSaveLive: 'Save (Live)',
            btnCloseMatch: 'Close Match',
            
            staffTitle: 'Technical Staff & Permissions',
            addStaffTitle: 'Add Member to Staff',
            searchPlayerPlaceholder: 'Search player in squad...',
            btnPromote: 'Promote',
            roleOwner: 'Club Owner',
            roleAdmin: 'Administrator',
            permManageMatches: 'Manage Matches',
            permManageTeams: 'Manage Squad',
            permManageFinances: 'Treasurer',
            tooltipRemoveStaff: 'Remove from Technical Staff',
            
            requestsTitle: 'Join Requests',
            reqSubtitle: 'Wants to join the squad',
            tooltipReject: 'Reject',
            tooltipApprove: 'Approve',
            noRequests: 'No pending requests.',
            
            settingsTitle: 'Club Settings',
            tabFinances: 'Finances',
            defaultPrice: 'Default Price per Match (€)',
            monthlyPrice: 'Price per Match for Monthly Payers (€)',
            tabLogistics: 'Logistics',
            defaultLocation: 'Default Field / Location',
            maxCapacity: 'Max Capacity',
            startersPerTeam: 'Starters (e.g. 11, 7)',
            tabTeams: 'Teams',
            tabColors: 'Default Colors',
            colorTeamA: 'Team A Color',
            colorTeamB: 'Team B Color',
            colorSingleTeam: 'Team Color',
            tabRoutine: 'Weekly Routine',
            matchDay: 'Fixed Match Day',
            matchTime: 'Fixed Time',
            tabFut: 'FUT Attributes',
            viewMode: 'View Mode',
            toggleHideRatings: 'Hide Ratings/OVR from members',
            toggleVoting: 'Enable post-match MVP Voting',
            toggleSingleTeam: 'Single Team Mode',
            toggleProAttributes: 'Enable Detailed Attributes',
            tabFixedStarters: 'Fixed Starters',
            manageFixedStarters: 'Manage Fixed Starters',
            btnSaveSettings: 'Save Settings',
            
            votingTitle: 'Voting & MVP',
            votingDesc: 'Give a rating from 1 to 10 to your teammates and choose who deserves to take the ball home (MVP).',
            votingAnonInfo: 'Your vote is 100% anonymous.',
            labelMVP: 'MVP',
            btnSubmitVotes: 'Submit Votes',
            
            resultsTitle: 'Match Summary',
            resultsGoals: 'Goals',
            resultsAssists: 'Ast',
            resultsRating: 'RATING',
            
            summaryTitle: 'Teams Summary',
            tabList: 'View List',
            tabPitch: 'View Tactics',
            teamTitulares: 'On Pitch (Starters)',
            teamBanco: 'Bench',
            avgOvr: 'Avg OVR:',
            unassignedPlayer: 'No player assigned',
            btnBothTeams: 'Both',
            
            profileTitle: 'My Profile',
            personalData: 'Personal Data',
            playerName: 'Player Name',
            fieldPrefs: 'Field Preferences',
            genPosition: 'General Position',
            specPosition: 'Specific Position',
            prefFoot: 'Preferred Foot',
            security: 'Security',
            newPassword: 'New Password',
            newPasswordPlaceholder: 'Leave empty to keep current',
            confirmPassword: 'Confirm New Password',
            btnSaveProfile: 'Save',
            
            convokTitle: 'Call-up Players for Match',
            convokSearch: 'Search in squad...',
            btnInviteSelected: 'Invite Selected',
            
            squadModalTitle: 'Select Fixed Starters',
            squadSearch: 'Search player...',
            btnDone: 'Done',
            
            faqTitle: 'Frequently Asked Questions (FAQs)',
            btnUnderstood: 'Understood'
          },
        faqs: [
            {
              icon: 'phone_android',
              q: 'How to install the app on mobile (PWA)?',
              a: 'You can add the app directly to your home screen for a fast, immersive experience. On Android, open the browser menu and click "Install app" or "Add to home screen". On iPhone (iOS), click the Safari share button and select "Add to Home Screen".'
            },
            {
              icon: 'vpn_key',
              q: 'How to create or join a football club?',
              a: 'On the club selection screen, you can create a new club by setting its name, or join an existing private club by entering the 8-character invite code provided by an administrator.'
            },
            {
              icon: 'verified_user',
              q: 'What happens after I send a join request to a club?',
              a: 'Your request will be pending approval. The club owner or administrators will receive an alert and can approve or reject your entry into the locker room before you can participate in matches.'
            },
            {
              icon: 'manage_accounts',
              q: 'How do the Technical Staff and Permissions work?',
              a: 'The club owner and administrators can manage granular permissions for other members. It is possible to assign specific access to manage matches, manage the squad, or act as the club treasurer.'
            },
            {
              icon: 'account_circle',
              q: 'How can I customize my player profile?',
              a: 'In the side menu, click on "My Profile". You can change your player name, upload a custom profile picture, set your general and specific position, preferred foot, and update your password.'
            },
            {
              icon: 'calendar_today',
              q: 'How to schedule a new match?',
              a: 'Administrators can click the floating "+" button on the calendar to create a new call-up. You can define the date, time, location, max capacity, starters per team, price per player, and team names.'
            },
            {
              icon: 'auto_mode',
              q: 'How does full-month match generation work?',
              a: 'By configuring a fixed weekly day and time in the club settings, the system can automatically generate a batch of matches for the entire month, instantly pre-inscribing your fixed starters.'
            },
            {
              icon: 'how_to_reg',
              q: 'How do I inscribe or cancel my inscription for a match?',
              a: 'On open match cards, you can click "I Will Play" to secure your spot within the available capacity. Administrators can also directly inscribe any squad member via the call-up modal.'
            },
            {
              icon: 'sports_soccer',
              q: 'How does the Automatic Team Sorting work?',
              a: 'In the call-up and teams modal, admins can click the "Auto" button. The algorithm groups players by sectors (defenders, midfielders, forwards) and balances the teams fairly based on the Overall (OVR) of each athlete.'
            },
            {
              icon: 'sports',
              q: 'What is the Single Team Mode?',
              a: 'Ideal for open practice sessions or when the group doesn\'t split into Teams A and B. By enabling this in the settings, inscribed players are managed between "On Pitch (Starters)" (with tactical formations support) and the "Bench".'
            },
            {
              icon: 'groups_2',
              q: 'What are Virtual Players?',
              a: 'They are athletes manually created by administrators to fill spots in the app when a casual friend doesn\'t have an account yet. They have their own positions and attributes for team balancing and stats.'
            },
            {
              icon: 'stars',
              q: 'What are Fixed Starters for?',
              a: 'In the club settings, you can select a fixed base of players who regularly make up the squad. These players can be automatically inscribed and accounted for easily when creating new events.'
            },
            {
              icon: 'sports_esports',
              q: 'How do FUT Cards and Player Attributes work?',
              a: 'Each squad player has an interactive Ultimate Team (FUT) style card. Administrators can edit player attributes, and the system automatically calculates a weighted Overall (OVR) based on the specific position and sector weights.'
            },
            {
              icon: 'tune',
              q: 'What is the difference between Simple Mode and Pro Mode?',
              a: 'Simple Mode manages 6 main attributes (Pace, Shooting, Passing, Dribbling, Defending, Physical). Pro Mode expands to 29 detailed in-game sub-attributes (like acceleration, finishing, agility). The app uses dual columns, allowing you to freely switch between modes without losing data.'
            },
            {
              icon: 'visibility_off',
              q: 'Can I hide attributes and Ratings from members?',
              a: 'Yes. In the club settings, there is a toggle to "Hide Ratings/OVR". When active, regular players won\'t see the numerical values on the squad cards or matches, maintaining privacy, while admins retain full access.'
            },
            {
              icon: 'style',
              q: 'What do the special card visuals mean (Gold, Silver, Bronze, In-Form, Icon)?',
              a: 'Card colors adapt to the OVR tier (Gold for 80+, Silver for 70+, Bronze below). Additionally, the top three players of the previous month receive a special "In-Form" status, and special "Icon" editions exist triggered by names.'
            },
            {
              icon: 'sports_score',
              q: 'How to close a match and register goals and assists?',
              a: 'When a match ends, an admin can click "Close Match". An interactive panel opens where you can adjust goals and assists for each athlete in real-time, automatically calculating the final score.'
            },
            {
              icon: 'how_to_vote',
              q: 'How does the MVP Voting and Post-Match Rating work?',
              a: 'After the initial match closure by an admin, the voting phase opens. Each participating player can give a 1-10 rating to teammates and anonymously elect the Man of the Match (MVP). Finally, the admin closes the polls to update statistics.'
            },
            {
              icon: 'leaderboard',
              q: 'How are the Season Ranking and Statistics calculated?',
              a: 'The statistics screen compiles the performance of all closed matches. Each win grants 3 points, a draw 1 point, and a loss 0 points. You can sort by points, goals, assists, average ratings, or MVPs, and filter data month by month.'
            },
            {
              icon: 'account_balance_wallet',
              q: 'How does the Treasury and Billing module work?',
              a: 'The treasury manages two models: pay-per-match for casual players and monthly payments for fixed starters. The system automatically calculates expected revenue based on the month\'s matches and allows you to clear pending payments.'
            },
            {
              icon: 'notifications_active',
              q: 'How do Payment and Availability Reminders work?',
              a: 'Through integrated Push notifications, admins and treasurers can send automatic, segmented alerts directly to the phones of players who have pending debts in the treasury or reminders to confirm their presence.'
            },
            {
              icon: 'sync',
              q: 'Does the app work offline or update in real-time?',
              a: 'The app uses WebSockets and Supabase real-time subscriptions. Whenever someone inscribes for a match, changes a team, or registers a payment, everyone\'s screen updates instantly without needing to refresh.'
            },
            {
              icon: 'support_agent',
              q: 'How can I contact support or send suggestions?',
              a: 'In the club\'s side menu, you have direct buttons for "Ask for Help" and "Send Feedback", which automatically open your email client pre-filled with the app\'s support address.'
            },
            {
              icon: 'lock_reset',
              q: 'What to do if I lose access to my account?',
              a: 'On the login screen, use the password recovery option by entering your email to receive secure reset instructions, or opt for a quick sign-in using your Google account.'
            },
            {
              icon: 'security',
              q: 'Are my data and votes secure?',
              a: 'Yes. The entire application is protected by strict Row Level Security (RLS) policies at the database level, ensuring that only authorized members of each club can view and edit their locker room information.'
            }
          ]
      },
      layout: {
        tabs: {
          games: 'Matches',
          players: 'Squad',
          stats: 'Stats',
          finances: 'Treasury'
        },
        pwa: {
          installTitle: 'Install App',
          installDescIOS: 'Tap Share and "Add to Home Screen"',
          installDescAndroid: 'Add to home screen for a fast experience!',
          btnInstall: 'Install'
        },
        push: {
          title: 'Enable Alerts',
          desc: 'Get notified about call-ups and payments.',
          btnEnable: 'Enable',
          errNotSupported: 'Your current browser does not support Web Notifications.',
          errDenied: 'Permission denied. Enable notifications in your browser settings.',
          errNoWorker: 'Service Worker is not active.',
          successEnabled: 'Alerts successfully enabled!',
          errGeneric: 'Failed to enable notifications.'
        }
      },
      // ...
    players: {
        header: {
          title: 'Squad',
          btnCreateVirtual: 'Create Virtual'
        },
        card: {
          tooltipVirtual: 'Manual Virtual Player'
        },
        modals: {
          createVirtualTitle: 'Add Virtual Player',
          createVirtualName: 'Player Name',
          createVirtualGenPos: 'General Position',
          createVirtualSpecPos: 'Specific Position',
          createVirtualBtnCancel: 'Cancel',
          createVirtualBtnSave: 'Sign Player',
  
          editTitle: 'Edit Player',
          editOverall: 'OVERALL',
          editModeProDesc: 'Pro Mode: Detailed Editing',
          
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
          catPace: 'Pace (PAC)',
          accel: 'Acceleration',
          sprint: 'Sprint Speed',
          
          catShooting: 'Shooting (SHO)',
          pos: 'Positioning',
          finish: 'Finishing',
          shotPower: 'Shot Power',
          longShots: 'Long Shots',
          volleys: 'Volleys',
          penalties: 'Penalties',
          
          catPassing: 'Passing (PAS)',
          vision: 'Vision',
          crossing: 'Crossing',
          freeKick: 'Free Kick Acc.',
          shortPass: 'Short Pass',
          longPass: 'Long Pass',
          curve: 'Curve',
          
          catDribbling: 'Dribbling (DRI)',
          agility: 'Agility',
          balance: 'Balance',
          reactions: 'Reactions',
          ballControl: 'Ball Control',
          dribble: 'Dribbling',
          composure: 'Composure',
          
          catDefending: 'Defending (DEF)',
          interceptions: 'Interceptions',
          heading: 'Heading Acc.',
          defAware: 'Def. Awareness',
          standTackle: 'Standing Tackle',
          slideTackle: 'Sliding Tackle',
          
          catPhysical: 'Physical (PHY)',
          jumping: 'Jumping',
          stamina: 'Stamina',
          strength: 'Strength',
          aggression: 'Aggression',
  
          btnRemove: 'Remove',
          btnCancel: 'Cancel',
          btnSave: 'Save'
        },
        notify: {
          onlyStaffEdit: 'Only the technical staff can edit players.',
          virtualHired: 'Virtual Player signed!',
          statsUpdated: 'FUT attributes updated in the Club!',
          errSave: 'Error saving: ',
          errOwnerRemove: 'Impossible to remove the Club Owner.',
          confirmRemoveTitle: 'Remove Player',
          confirmRemoveMsg: 'Are you sure you want to kick {name} from the squad? This action can be reversed if they request to join again.',
          btnYesRemove: 'Yes, Remove',
          btnCancel: 'Cancel',
          playerRemoved: 'Player removed from the squad!'
        },
        categories: [
          { label: 'Excellent', value: 96 },
          { label: 'Very Good', value: 90 },
          { label: 'Good', value: 82 },
          { label: 'Average', value: 70 },
          { label: 'Bad', value: 55 },
          { label: 'Terrible', value: 40 }
        ]
      },
      // ... add after the 'players' block:
    finances: {
        headerTitle: 'Treasury',
        tabs: {
          resumo: 'Matches',
          mensalidades: 'Monthly Fees'
        },
        loading: 'Loading finances...',
        matches: {
          pendingPayments: 'Pending Payments',
          allSettledTitle: 'All Settled!',
          allSettledDesc: 'Monthly payers filtered out. No casual players owe for matches.',
          missing: 'Missing {count}',
          value: 'Value: ',
          btnPaid: 'Paid'
        },
        monthly: {
          btnStarters: 'Starters',
          gamesInMonth: 'Games in Month:',
          monthlyFee: 'Monthly Fee:',
          missingPayTitle: 'Missing Payment',
          btnReminders: 'Payment Reminders',
          allPaidUp: 'All monthly payers are up to date!',
          alreadyPaidTitle: 'Already Paid',
          noPaymentsThisMonth: 'No payments registered this month.'
        },
        configModal: {
          title: 'Payment Mode (Starters)',
          noStartersDef: 'You have not defined the Fixed Starters in the Club Settings yet.',
          optMonthly: 'Monthly Payer',
          optPerMatch: 'Pay per Match'
        },
        notify: {
          errRestricted: 'Restricted access to the treasury.',
          infoSearchingDebtors: 'Looking for players with pending payments...',
          warnNoDebtorsApp: 'No players with an app account have debts to alert.',
          warnNoPushEnabled: 'Debtors do not have mobile notifications enabled.',
          pushTitleMatchDay: 'MatchDay',
          pushMsgMonthly: 'You have a pending payment for {month}.',
          pushMsgMatch: 'You have a pending payment for the match on {date} at {location}.',
          alertsSent: 'Alerts successfully sent to {count} debtors!',
          errCriticalPush: 'Critical error sending notifications.',
          errSupabase: 'Supabase Error: ',
          configSavedMonth: 'Configuration saved for this month!',
          paymentRegistered: 'Payment registered!',
          matchLiquidated: 'Match fully liquidated!'
        }
      },
      stats: {
        headerTitle: 'Season Statistics',
        noStatsTitle: 'No Statistical Data',
        noStatsDesc: 'No closed matches with results to calculate the ranking yet.',
        timeFilterFullSeason: 'Full Season',
        columns: {
          player: 'Player',
          matches: 'M',
          matchesTooltip: 'Matches Played',
          goals: 'G',
          goalsTooltip: 'Goals Scored',
          assists: 'A',
          assistsTooltip: 'Assists',
          rating: '★',
          ratingTooltip: 'Average Rating (1 to 10)',
          mvp: 'MVP',
          mvpTooltip: 'Man of the Match Awards',
          wins: 'W',
          winsTooltip: 'Wins',
          draws: 'D',
          drawsTooltip: 'Draws',
          losses: 'L',
          lossesTooltip: 'Losses',
          points: 'PTS'
        },
        unknownPlayer: 'Unknown'
      },
      days: [
        { label: 'Monday', value: 1 }, { label: 'Tuesday', value: 2 }, { label: 'Wednesday', value: 3 },
        { label: 'Thursday', value: 4 }, { label: 'Friday', value: 5 }, { label: 'Saturday', value: 6 }, { label: 'Sunday', value: 7 }
      ],
      positions: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
      feet: ['Right', 'Left', 'Both'],
      specPositions: {
        gr: 'Goalkeeper (GK)',
        dc: 'Center Back (CB)',
        ld: 'Right Back (RB)',
        le: 'Left Back (LB)',
        ad: 'Right Wing-Back (RWB)',
        ae: 'Left Wing-Back (LWB)',
        mdc: 'Defensive Midfielder (CDM)',
        mc: 'Center Midfielder (CM)',
        mco: 'Attacking Midfielder (CAM)',
        md: 'Right Midfielder (RM)',
        me: 'Left Midfielder (LM)',
        pl: 'Striker (ST)',
        sa: 'Center Forward (CF)',
        ed: 'Right Winger (RW)',
        ee: 'Left Winger (LW)'
      },
      // ...
    join: {
        processing: 'Processing invite...',
        entering: 'Entering your new football club.',
        errLogin: 'Sign in or create an account to join the club!',
        errSend: 'Error sending request: ',
        infoPending: 'You already have a pending request or are already in this club.',
        success: 'Join request sent successfully! Await approval.'
      },
      error404: {
        title: 'Oops. Nothing here...',
        btnHome: 'Go Home'
      },
      common: {
        language: 'Language',
        system: 'System Default'
      }
}