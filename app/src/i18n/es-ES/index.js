export default {
    login: {
      appTitle: 'MatchDay',
      appSubtitle: 'Tu app de vestuario. Organiza pachangas, invita a amigos y domina el campo.',
      slideSquadTitle: 'Tu Plantilla',
      slideSquadSubtitle: 'Equilibra los equipos automáticamente y gestiona las asistencias en un abrir y cerrar de ojos.',
      slideMvpTitle: 'Elección del MVP',
      slideMvpSubtitle: 'Al final del partido, valora a tus compañeros de forma anónima y ¡descubre quién se lleva el Balón de Oro!',
      btnStart: 'Empezar a Jugar',
      
      titleSignIn: 'Iniciar Sesión',
      titleSignUp: 'Crear Cuenta',
      subtitleSignIn: 'Bienvenido de vuelta al vestuario',
      subtitleSignUp: 'Rellena tus datos para entrar en la plantilla',
      
      labelName: 'Tu Nombre (ej: Raúl)',
      labelEmail: 'Email',
      labelPassword: 'Contraseña',
      
      errNameRequired: 'El nombre es obligatorio',
      errEmailRequired: 'El email es obligatorio',
      errEmailInvalid: 'Introduce un email válido (ej: jugador@mail.com)',
      errPasswordRequired: 'La contraseña es obligatoria',
      errPasswordLength: 'La contraseña debe tener al menos 6 caracteres',
      
      btnSubmitSignIn: 'Entrar al Vestuario',
      btnSubmitSignUp: 'Registrarse y Entrar',
      
      toggleToSignIn: '¿Ya tienes cuenta? Iniciar Sesión',
      toggleToSignUp: '¿Aún no tienes cuenta? Crear Cuenta',
      forgotPassword: '¿Olvidaste tu contraseña?',
      
      btnGoogle: 'Continuar con Google',
      
      resetTitle: 'Recuperar Contraseña',
      resetSubtitle: 'Introduce tu email. Recibirás un enlace seguro para restablecer tu contraseña.',
      resetEmailLabel: 'Tu Email',
      resetBtnCancel: 'Cancelar',
      resetBtnSend: 'Enviar Enlace',
      
      msgConfirmEmailTitle: 'Confirma tu Email',
      msgConfirmEmailText: '¡Cuenta creada con éxito! Hemos enviado un enlace de confirmación a tu correo. Por favor, valida el email antes de entrar al vestuario.',
      msgConfirmEmailOk: 'Entendido',
      msgLoginSuccess: '¡Sesión iniciada con éxito!',
      msgResetSent: '¡Email de recuperación enviado! Revisa tu bandeja de entrada.',
    },
    selector: {
      myClubsTitle: 'Mis Clubes',
      myClubsSubtitle: 'Selecciona tu vestuario',
      roleAdmin: 'Administrador',
      roleMember: 'Miembro',
      noClubs: 'Aún no perteneces a ningún club.',
      btnCreateClub: 'Crear Nuevo Club',
      
      joinWithCodeTitle: 'Entrar con Código',
      joinWithCodeSubtitle: '¿Has recibido una invitación? Introduce el código para unirte a la plantilla.',
      inputCodeLabel: 'Código del Club',
      inputCodePlaceholder: 'Ej: FC-1234',
      btnJoin: 'Unirse',
      
      modalCreateTitle: 'Nuevo Club',
      inputClubName: 'Nombre del Club',
      btnCancel: 'Cancelar',
      btnCreate: 'Crear',
      
      errCreateClub: 'Error al crear el club: ',
      msgClubCreated: '¡Club creado con éxito!',
      warnEnterCode: 'Por favor, introduce un código.',
      errInvalidCode: '¡Código inválido! Confírmalo con el administrador del club.',
      infoAlreadyMember: '¡Ya formas parte o tienes una solicitud pendiente en el club {clubName}!',
      errJoinClub: 'Error al unirse al club: ',
      msgJoinSuccess: '¡Solicitud enviada a {clubName}! Espera la aprobación del cuerpo técnico.',
    },
    dashboard: {
      header: {
        loading: 'Calentando motores...',
        code: 'Código:',
        copyCodeTooltip: 'Copiar Código',
        shareTooltip: 'Enviar Invitación',
        menuProfile: 'Mi Perfil',
        menuSwitchClub: 'Cambiar de Club',
        menuLogout: 'Cerrar Sesión',
        menuHelp: 'Pedir Ayuda',
        menuFeedback: 'Enviar Feedback',
        menuFaqs: 'FAQs'
      },
      empty: {
        noMatchesTitle: 'Sin partidos programados',
        noMatchesDesc: 'Aún no hay ninguna convocatoria abierta en este club.',
        btnFirstMatch: 'Programar Primer Partido',
        noFilterTitle: 'Ningún partido en esta vista',
        noFilterDesc: 'No hemos encontrado partidos para esta búsqueda. Cambia de pestaña para ver partidos pasados o programa uno nuevo.'
      },
      filters: {
        calendar: 'Calendario',
        next: 'Próximo',
        voting: 'Votación',
        pending: 'Pendientes',
        month: 'Mes',
        all: 'Todos',
        closed: 'Finalizados'
      },
      match: {
        statusClosed: 'TERMINADO',
        statusVoting: 'EN VOTACIÓN',
        statusOpen: 'ABIERTO',
        location: 'Lugar',
        capacity: 'Aforo',
        price: 'Precio',
        btnSquad: 'Plantilla',
        btnAskConfirm: 'Pedir Confirmación',
        btnEdit: 'Editar',
        btnDelete: 'Borrar',
        btnCloseMatch: 'Cerrar Partido',
        btnInscribed: 'Inscrito',
        btnPlay: 'Voy a Jugar',
        btnFull: 'Completo',
        btnReopen: 'Editar / Reabrir Partido',
        btnRate: 'Valorar Partido',
        btnVoted: 'Voto Registrado',
        btnClosePolls: 'Cerrar Urnas y MVP',
        btnResults: 'Resultados'
      },
      notify: {
        codeCopied: '¡Código {code} copiado! Puedes pegarlo en WhatsApp.',
        noCode: 'Este club aún no tiene código de invitación.',
        inviteCopied: '¡Texto de invitación copiado! Pégalo donde quieras.',
        inviteTitle: 'Invitación a MatchDay',
        inviteMsg: '¡Únete a mi plantilla "{clubName}" en MatchDay! ⚽\n\nHaz clic en el enlace para entrar automáticamente:\n{link}\n\n(Si la app te lo pide, el código es: {code})',
        matchDeleted: 'Partido borrado del calendario.',
        deleteMatchTitle: 'Borrar Partido',
        deleteMatchMsg: '¿Estás seguro? El partido y todas las inscripciones se eliminarán permanentemente.',
        btnYesDelete: 'Sí, Borrar',
        btnCancel: 'Cancelar',
        alertSent: '¡Alertas enviadas a los titulares!',
        askConfirmTitle: 'Pedir Confirmación',
        askConfirmMsg: 'Vas a notificar a los {count} jugadores inscritos actualmente para que confirmen su asistencia. ¿Continuar?',
        btnSendAlerts: 'Enviar Alertas',
        pushTitleConfirm: '🗓️ Confirmación de Asistencia',
        pushMsgConfirm: '¡El partido se acerca! Confirma si estás disponible o si necesitamos buscar un sustituto.',
        pwdMismatch: 'Las contraseñas no coinciden.',
        profileUpdated: '¡Ficha de jugador actualizada!',
        errSaveProfile: 'Error al guardar el perfil: ',
        removePhotoTitle: 'Eliminar Foto',
        removePhotoMsg: '¿Estás seguro de que quieres borrar tu foto de perfil?',
        btnYesRemovePhoto: 'Sí, Borrar',
        reopenMatchTitle: 'Reabrir Partido',
        reopenMatchMsg: '¿Estás seguro de que quieres reabrir este partido para editarlo? Los goles actuales se mantendrán para que puedas ajustarlos.',
        matchReopened: '¡Partido reabierto con éxito!',
        clearTeamsTitle: 'Limpiar Equipos',
        clearTeamsMsg: '¿Estás seguro de que quieres deshacer los equipos y dejar a todos los jugadores sin asignar?',
        btnYesClear: 'Sí, Limpiar',
        teamsCleared: '¡Todos los equipos han sido limpiados!',
        capacityFull: '¡Tranquilo Míster! El partido solo tiene {count} plazas disponibles.',
        playersConvoked: '¡{count} jugador(es) convocado(s) con éxito!',
        paymentConfirmed: '¡Pago confirmado!',
        paymentReverted: 'Pago revertido.',
        playerRemoved: 'Jugador eliminado del partido.',
        playerAccepted: '¡Jugador aceptado en la plantilla!',
        requestRejected: 'Solicitud rechazada.',
        dayOccupiedTitle: 'Aviso: Día Ocupado',
        dayOccupiedMsg: 'Ya tienes una pachanga programada para este día. ¿Seguro que quieres programar otra y solapar partidos?',
        btnYesSchedule: 'Sí, Programar igualmente',
        matchUpdatedFuture: '¡Partido actualizado y reglas aplicadas al calendario futuro!',
        matchUpdated: '¡Partido actualizado con éxito!',
        matchCreated: '¡Pachanga programada con éxito!',
        blockedSecurity: '¡Bloqueado por seguridad! ¿Ejecutaste el script en el SQL Editor?',
        statsSavedLive: '¡Estadísticas guardadas en tiempo real!',
        errSaveData: 'Error al guardar los datos.',
        errVoteMvp: '¡Tienes que elegir a tu Jugador del Partido (MVP)!',
        errAlreadyVoted: '¡Ya has votado en este partido!',
        votesRegistered: '¡Votos registrados con éxito!',
        closePollsTitle: 'Calcular Resultados',
        closePollsMsg: 'Esta acción cierra las urnas, calcula las medias, entrega el premio al MVP y finaliza el partido permanentemente. ¿Confirmar?',
        btnClosePollsAction: 'Cerrar Votación',
        pollsClosed: '¡Urnas cerradas! MVP calculado con éxito.',
        pushTitleResults: '🏆 Resultados Finales',
        pushMsgResults: '¡Las urnas se han cerrado! Descubre quién ha sido el MVP y las notas del partido.',
        teamsSorted: '¡Sorteo de equipos completado!',
        errGenerateTeams: 'Error al generar los equipos.',
        memberPromoted: '¡Miembro ascendido a Administrador!',
        demoteMemberTitle: 'Degradar Miembro',
        demoteMemberMsg: '¿Estás seguro? Este miembro perderá el acceso al panel de gestión del club.',
        memberDemoted: 'Miembro eliminado del Cuerpo Técnico.',
        errRls: 'ERROR RLS: No tienes permisos en la BD para cambiar esto.',
        permsUpdated: '¡Permisos actualizados!',
        settingsSaved: '¡Ajustes del club guardados!',
        squadLimitWarn: 'El aforo se ha reducido a {limit}. Los jugadores sobrantes de la lista de Titulares han sido eliminados.',
        warnConfigRoutine: 'Configura primero el día y la hora fijos en los Ajustes del club.',
        infoNoMoreDays: 'No hay más días coincidentes en este mes.',
        overlapTitle: 'Aviso de Solapamiento',
        overlapMsg: 'Ya tienes partidos programados en los días: {dates}. ¿Quieres generar estos partidos igualmente y crear duplicados en el calendario?',
        btnGenerateAnyway: 'Generar igualmente',
        bulkGenerated: '¡Generadas {count} pachangas con Titulares confirmados!',
        noConvokedAlerts: 'Aún no hay jugadores convocados para avisar.'
      },
      modals: {
        createMatchTitle: 'Nueva Convocatoria',
        editMatchTitle: 'Editar Partido',
        toggleDefaults: 'Bloquear con los ajustes del club',
        dateLabel: 'Fecha y Hora',
        locationLabel: 'Lugar / Campo',
        capacityLabel: 'Aforo',
        startersLabel: 'Titulares',
        priceLabel: 'Precio (€)',
        teamAName: 'Nombre Equipo A',
        teamBName: 'Equipo B',
        singleTeamName: 'Nombre del Equipo',
        applyFuture: 'Aplicar precio, aforo y lugar a los siguientes partidos abiertos',
        btnSaveEdit: 'Guardar Cambios',
        btnPublish: 'Publicar (Solo 1)',
        btnGenerateBulk: 'Generar Mes Entero',
        btnCancel: 'Cancelar',
        
        presencesTitle: 'Convocatoria y Equipos',
        adminPanelTitle: 'Panel de Administración: Inscribir Jugador',
        btnSelectPlayers: 'Seleccionar Jugadores de la Plantilla',
        noPlayersInscribed: 'Aún no hay ningún jugador inscrito.',
        btnAutoBalance: 'Auto',
        btnClearTeams: 'Limpiar',
        btnViewTactics: 'Ver Táctica',
        btnViewSummary: 'Resumen',
        statusConfirmed: 'Confirmado',
        statusWaitlist: 'Lista de Espera',
        
        closeMatchTitle: 'Estadísticas del Partido',
        goalsLabel: 'GOLES',
        assistsLabel: 'ASIST',
        btnSaveLive: 'Guardar (En Vivo)',
        btnCloseMatch: 'Cerrar Partido',
        
        staffTitle: 'Cuerpo Técnico y Permisos',
        addStaffTitle: 'Añadir Miembro al Cuerpo Técnico',
        searchPlayerPlaceholder: 'Buscar jugador en la plantilla...',
        btnPromote: 'Ascender',
        roleOwner: 'Propietario del Club',
        roleAdmin: 'Administrador',
        permManageMatches: 'Gestionar Partidos',
        permManageTeams: 'Gestionar Plantilla',
        permManageFinances: 'Tesorero',
        tooltipRemoveStaff: 'Eliminar del Cuerpo Técnico',
        
        requestsTitle: 'Solicitudes de Ingreso',
        reqSubtitle: 'Quiere unirse a la plantilla',
        tooltipReject: 'Rechazar',
        tooltipApprove: 'Aprobar',
        noRequests: 'No hay solicitudes pendientes.',
        
        settingsTitle: 'Ajustes del Club',
        tabFinances: 'Finanzas',
        defaultPrice: 'Precio por Defecto del Partido (€)',
        monthlyPrice: 'Precio por Partido para Mensuales (€)',
        tabLogistics: 'Logística',
        defaultLocation: 'Campo / Lugar Fijo',
        maxCapacity: 'Aforo Máx',
        startersPerTeam: 'Titulares (Ej: 11, 7)',
        tabTeams: 'Equipos',
        tabColors: 'Colores por Defecto',
        colorTeamA: 'Color Equipo A',
        colorTeamB: 'Color Equipo B',
        colorSingleTeam: 'Color del Equipo',
        tabRoutine: 'Rutina Semanal',
        matchDay: 'Día de Partido Fijo',
        matchTime: 'Hora Fija',
        tabFut: 'Atributos FUT',
        viewMode: 'Modo de Visualización',
        toggleHideRatings: 'Ocultar Valoraciones/OVR a los miembros',
        toggleVoting: 'Activar Votación de MVP post-partido',
        toggleSingleTeam: 'Modo de Equipo Único',
        toggleProAttributes: 'Activar Atributos Detallados',
        tabFixedStarters: 'Titulares Fijos',
        manageFixedStarters: 'Gestionar Titulares Fijos',
        btnSaveSettings: 'Guardar Ajustes',
        
        votingTitle: 'Votación y MVP',
        votingDesc: 'Dale una nota del 1 al 10 a tus compañeros y elige quién merece llevarse el balón a casa (MVP).',
        votingAnonInfo: 'Tu votación es 100% anónima.',
        labelMVP: 'MVP',
        btnSubmitVotes: 'Enviar Votos',
        
        resultsTitle: 'Resumen del Partido',
        resultsGoals: 'Goles',
        resultsAssists: 'Asist',
        resultsRating: 'NOTA',
        
        summaryTitle: 'Resumen de los Equipos',
        tabList: 'Ver Lista',
        tabPitch: 'Ver Táctica',
        teamTitulares: 'En el Campo (Titulares)',
        teamBanco: 'Banquillo',
        avgOvr: 'Media OVR:',
        unassignedPlayer: 'Ningún jugador asignado',
        btnBothTeams: 'Ambos',
        
        profileTitle: 'Mi Perfil',
        personalData: 'Datos Personales',
        playerName: 'Nombre del Jugador',
        fieldPrefs: 'Preferencias de Campo',
        genPosition: 'Posición General',
        specPosition: 'Posición Específica',
        prefFoot: 'Pie Preferido',
        security: 'Seguridad',
        newPassword: 'Nueva Contraseña',
        newPasswordPlaceholder: 'Déjalo en blanco para mantenerla',
        confirmPassword: 'Confirmar Nueva Contraseña',
        btnSaveProfile: 'Guardar',
        
        convokTitle: 'Convocar Jugadores para el Partido',
        convokSearch: 'Buscar en la plantilla...',
        btnInviteSelected: 'Invitar Seleccionados',
        
        squadModalTitle: 'Seleccionar Titulares Fijos',
        squadSearch: 'Buscar jugador...',
        btnDone: 'Hecho',
        
        faqTitle: 'Preguntas Frecuentes (FAQs)',
        btnUnderstood: 'Entendido'
      },
      faqs: [
        {
          icon: 'phone_android',
          q: '¿Cómo instalar la aplicación en el móvil (PWA)?',
          a: 'Puedes añadir la aplicación directamente a la pantalla de inicio de tu teléfono para una experiencia rápida e inmersiva. En Android, abre el menú del navegador y pulsa "Instalar aplicación" o "Añadir a la pantalla de inicio". En iPhone (iOS), pulsa el botón de compartir de Safari y selecciona "Añadir a la Pantalla de Inicio".'
        },
        {
          icon: 'vpn_key',
          q: '¿Cómo crear o unirme a un club de fútbol?',
          a: 'En la pantalla de selección de clubes, puedes crear un nuevo club introduciendo su nombre o unirte a un club privado existente introduciendo el código de invitación de 8 caracteres que te haya proporcionado el administrador.'
        },
        {
          icon: 'verified_user',
          q: '¿Qué sucede después de enviar la solicitud de ingreso a un club?',
          a: 'Tu solicitud quedará pendiente de aprobación. Los administradores o el propietario del club recibirán una alerta y podrán aprobar o rechazar tu entrada al vestuario antes de que puedas participar en las pachangas.'
        },
        {
          icon: 'manage_accounts',
          q: '¿Cómo funciona el Cuerpo Técnico y los Permisos?',
          a: 'El propietario del club y los administradores pueden gestionar permisos detallados para otros miembros. Es posible asignar accesos específicos para gestionar partidos, gestionar la plantilla o asumir el rol de tesorero del club.'
        },
        {
          icon: 'account_circle',
          q: '¿Cómo puedo personalizar mi perfil de jugador?',
          a: 'En el menú lateral, haz clic en "Mi Perfil". Puedes cambiar tu nombre de jugador, subir una foto personalizada para tu avatar, definir tu posición general y específica, tu pie preferido y actualizar tu contraseña de acceso.'
        },
        {
          icon: 'calendar_today',
          q: '¿Cómo programar una nueva pachanga o partido?',
          a: 'Los administradores pueden hacer clic en el botón flotante "+" en el calendario para crear una nueva convocatoria. Puedes definir la fecha, la hora, el lugar, el aforo máximo, el número de titulares por equipo, el precio por jugador y los nombres de los equipos.'
        },
        {
          icon: 'auto_mode',
          q: '¿Cómo funciona la generación de partidos para todo el mes?',
          a: 'Si configuras un día de la semana y una hora fijos en los ajustes del club, el sistema puede generar automáticamente un lote con todos los partidos correspondientes al mes, preinscribiendo de inmediato a los titulares fijos definidos.'
        },
        {
          icon: 'how_to_reg',
          q: '¿Cómo me inscribo o me borro de un partido?',
          a: 'En las tarjetas de los partidos abiertos, puedes hacer clic en "Voy a Jugar" para asegurar tu plaza dentro del límite de aforo disponible. Los administradores también pueden inscribir directamente a cualquier miembro de la plantilla desde el modal de convocatoria.'
        },
        {
          icon: 'sports_soccer',
          q: '¿Cómo funciona el Sorteo Automático de Equipos?',
          a: 'En el modal de convocatoria y equipos, los administradores pueden hacer clic en el botón "Auto". El algoritmo agrupa a los jugadores por líneas (defensas, centrocampistas, delanteros) y equilibra los equipos de forma justa basándose en la valoración global (OVR) de cada atleta.'
        },
        {
          icon: 'sports',
          q: '¿Qué es el Modo de Equipo Único?',
          a: 'Ideal para entrenamientos libres o cuando el grupo no se divide en Equipos A y B. Al activar esta opción en los ajustes, los convocados se gestionan entre "En el Campo (Titulares)" con soporte para esquemas tácticos y el "Banquillo".'
        },
        {
          icon: 'groups_2',
          q: '¿Qué son los Jugadores Virtuales?',
          a: 'Son atletas creados manualmente por los administradores para llenar huecos en la aplicación cuando un amigo ocasional aún no tiene cuenta registrada. Tienen sus propias posiciones y atributos para contar en el equilibrio de los equipos.'
        },
        {
          icon: 'stars',
          q: '¿Para qué sirven los Titulares Fijos?',
          a: 'En los ajustes del club, puedes seleccionar un núcleo fijo de jugadores que componen habitualmente la plantilla. Estos jugadores se pueden inscribir y contabilizar automáticamente de forma sencilla al crear nuevos eventos.'
        },
        {
          icon: 'sports_esports',
          q: '¿Cómo funcionan las Cartas FUT y los Atributos de los Jugadores?',
          a: 'Cada jugador de la plantilla tiene una carta interactiva al estilo Ultimate Team (FUT). Los administradores pueden editar los atributos del jugador y el sistema calcula automáticamente la Media (OVR) ponderada basándose en la posición y en los pesos específicos de cada línea.'
        },
        {
          icon: 'tune',
          q: '¿Cuál es la diferencia entre el Modo Simple y el Modo Pro (Detallado)?',
          a: 'El Modo Simple gestiona los 6 atributos principales (Ritmo, Tiro, Pase, Regate, Defensa, Físico). El Modo Pro se amplía a 29 subatributos detallados (como aceleración, definición, agilidad). La aplicación usa columnas duales, permitiendo alternar modos sin perder datos.'
        },
        {
          icon: 'visibility_off',
          q: '¿Puedo ocultar los atributos y Valoraciones a los miembros?',
          a: 'Sí. En los ajustes del club hay un botón para "Ocultar Valoraciones/OVR". Al activarlo, los jugadores normales dejarán de ver los valores numéricos en las cartas y partidos, manteniendo la privacidad, mientras que los administradores conservan el acceso total.'
        },
        {
          icon: 'style',
          q: '¿Qué significan los diseños especiales de las cartas (Oro, Plata, Bronce, In-Form, Icon)?',
          a: 'Los colores de la carta se adaptan al nivel del OVR (Oro para 80+, Plata para 70+, Bronce por debajo). Además, los tres mejores jugadores del mes anterior reciben el estatus "In-Form", y existen ediciones "Icon" que se activan por nombre.'
        },
        {
          icon: 'sports_score',
          q: '¿Cómo cerrar un partido y registrar goles y asistencias?',
          a: 'Cuando termina una pachanga, un administrador puede hacer clic en "Cerrar Partido". Se abre un panel interactivo donde es posible ajustar en tiempo real los goles y asistencias de cada atleta, calculando automáticamente el resultado final.'
        },
        {
          icon: 'how_to_vote',
          q: '¿Cómo funciona la Votación del MVP y la Valoración Post-Partido?',
          a: 'Tras el cierre inicial del partido por parte de un admin, se abre la fase de votación. Cada jugador puede poner notas a sus compañeros y elegir anónimamente al Jugador del Partido (MVP). Al final, el admin cierra las urnas para nombrar a los ganadores.'
        },
        {
          icon: 'leaderboard',
          q: '¿Cómo se calculan el Ranking y las Estadísticas de la Temporada?',
          a: 'La pantalla de estadísticas recopila el rendimiento de todos los partidos cerrados. Cada victoria otorga 3 puntos, el empate 1 punto y la derrota 0 puntos. Puedes ordenar por puntos, goles, asistencias o notas medias, y filtrar mes a mes.'
        },
        {
          icon: 'account_balance_wallet',
          q: '¿Cómo funciona el módulo de Tesorería y Pagos?',
          a: 'La tesorería gestiona dos modelos: el pago por partido y la gestión de cuotas mensuales para los titulares fijos. El sistema calcula los ingresos previstos en base al número de partidos del mes y permite liquidar los pagos realizados.'
        },
        {
          icon: 'notifications_active',
          q: '¿Cómo funcionan los Recordatorios de Pago y Disponibilidad?',
          a: 'A través de las notificaciones Push integradas, los admins y tesoreros pueden enviar avisos automáticos y segmentados al móvil de los jugadores que tengan deudas pendientes en tesorería o recordatorios para que confirmen su presencia.'
        },
        {
          icon: 'sync',
          q: '¿La aplicación funciona sin conexión o se actualiza en tiempo real?',
          a: 'La aplicación utiliza WebSockets y suscripciones en tiempo real de Supabase. Siempre que alguien se inscribe en un partido o registra un pago, la pantalla de todos los usuarios conectados se actualiza instantáneamente.'
        },
        {
          icon: 'support_agent',
          q: '¿Cómo puedo contactar con el soporte o enviar sugerencias?',
          a: 'En el menú lateral del club tienes botones directos dedicados para "Pedir Ayuda" y "Enviar Feedback", abriendo automáticamente tu cliente de correo electrónico preconfigurado con la dirección de soporte de la app.'
        },
        {
          icon: 'lock_reset',
          q: '¿Qué hacer si pierdo el acceso a mi cuenta?',
          a: 'En la pantalla de inicio de sesión, puedes usar la opción de recuperación de contraseña introduciendo tu email para recibir instrucciones de restablecimiento, o bien optar por el inicio de sesión rápido mediante tu cuenta de Google.'
        },
        {
          icon: 'security',
          q: '¿Mis datos y votaciones están seguros?',
          a: 'Sí. Toda la aplicación está protegida por estrictas políticas de seguridad a nivel de base de datos (Row Level Security), garantizando que solo los miembros autorizados de cada club puedan ver y editar la información de su vestuario.'
        }
      ]
    },
    layout: {
      tabs: {
        games: 'Partidos',
        players: 'Plantilla',
        stats: 'Estadísticas',
        finances: 'Tesorería'
      },
      pwa: {
        installTitle: 'Instalar Aplicación',
        installDescIOS: 'Pulsa Compartir y "Añadir a la Pantalla de Inicio"',
        installDescAndroid: '¡Añádelo a la pantalla de inicio para una experiencia rápida!',
        btnInstall: 'Instalar'
      },
      push: {
        title: 'Activar Alertas',
        desc: 'Recibe avisos de convocatorias y cuotas.',
        btnEnable: 'Activar',
        errNotSupported: 'Tu navegador actual no soporta Notificaciones Web.',
        errDenied: 'Permiso denegado. Activa las notificaciones en los ajustes del navegador.',
        errNoWorker: 'El Service Worker no está activo.',
        successEnabled: '¡Alertas activadas con éxito!',
        errGeneric: 'Fallo al activar las notificaciones.'
      }
    },
    players: {
      header: {
        title: 'Plantilla',
        btnCreateVirtual: 'Crear Virtual'
      },
      card: {
        tooltipVirtual: 'Jugador Virtual Manual'
      },
      modals: {
        createVirtualTitle: 'Añadir Jugador Virtual',
        createVirtualName: 'Nombre del Jugador',
        createVirtualGenPos: 'Posición General',
        createVirtualSpecPos: 'Posición Específica',
        createVirtualBtnCancel: 'Cancelar',
        createVirtualBtnSave: 'Fichar',
  
        editTitle: 'Editar Jugador',
        editOverall: 'MEDIA',
        editModeProDesc: 'Modo Pro: Edición Detallada',
        
        pace: 'RIT',
        shooting: 'TIR',
        passing: 'PAS',
        dribbling: 'REG',
        defending: 'DEF',
        physical: 'FÍS',
        
        diving: 'EST',
        handling: 'PAR',
        kicking: 'SAQ',
        reflexes: 'REF',
        speed: 'VEL',
        positioning: 'POS',
  
        catPace: 'Ritmo (RIT)',
        accel: 'Aceleración',
        sprint: 'Velocidad Sprint',
        
        catShooting: 'Tiro (TIR)',
        pos: 'Posicionamiento',
        finish: 'Definición',
        shotPower: 'Potencia de Tiro',
        longShots: 'Tiros Lejanos',
        volleys: 'Voleas',
        penalties: 'Penaltis',
        
        catPassing: 'Pase (PAS)',
        vision: 'Visión',
        crossing: 'Centros',
        freeKick: 'Precisión Faltas',
        shortPass: 'Pase Corto',
        longPass: 'Pase Largo',
        curve: 'Efecto',
        
        catDribbling: 'Regate (REG)',
        agility: 'Agilidad',
        balance: 'Equilibrio',
        reactions: 'Reacciones',
        ballControl: 'Control de Balón',
        dribble: 'Regates',
        composure: 'Compostura',
        
        catDefending: 'Defensa (DEF)',
        interceptions: 'Intercepciones',
        heading: 'Precisión Cabeceo',
        defAware: 'Conciencia Defensiva',
        standTackle: 'Robos',
        slideTackle: 'Entradas',
        
        catPhysical: 'Físico (FÍS)',
        jumping: 'Salto',
        stamina: 'Resistencia',
        strength: 'Fuerza',
        aggression: 'Agresividad',
  
        btnRemove: 'Eliminar',
        btnCancel: 'Cancelar',
        btnSave: 'Guardar'
      },
      notify: {
        onlyStaffEdit: 'Solo el cuerpo técnico puede editar jugadores.',
        virtualHired: '¡Jugador Virtual fichado!',
        statsUpdated: '¡Atributos FUT actualizados en el Club!',
        errSave: 'Error al guardar: ',
        errOwnerRemove: 'Imposible eliminar al Propietario del club.',
        confirmRemoveTitle: 'Eliminar Jugador',
        confirmRemoveMsg: '¿Estás seguro de que quieres expulsar a {name} de la plantilla? Esta acción puede deshacerse si vuelve a solicitar unirse.',
        btnYesRemove: 'Sí, Eliminar',
        btnCancel: 'Cancelar',
        playerRemoved: '¡Jugador eliminado de la plantilla!'
      },
      categories: [
        { label: 'Excelente', value: 96 },
        { label: 'Muy Bueno', value: 90 },
        { label: 'Bueno', value: 82 },
        { label: 'Regular', value: 70 },
        { label: 'Malo', value: 55 },
        { label: 'Pésimo', value: 40 }
      ]
    },
    finances: {
      headerTitle: 'Tesorería',
      tabs: {
        resumo: 'Partidos',
        mensalidades: 'Cuotas Mensuales'
      },
      loading: 'Cargando finanzas...',
      matches: {
        pendingPayments: 'Pagos Pendientes',
        allSettledTitle: '¡Todo Liquidado!',
        allSettledDesc: 'Los jugadores con cuota mensual han sido filtrados. Ningún jugador ocasional debe partidos.',
        missing: 'Faltan {count}',
        value: 'Valor: ',
        btnPaid: 'Pagado'
      },
      monthly: {
        btnStarters: 'Titulares',
        gamesInMonth: 'Partidos en el Mes:',
        monthlyFee: 'Cuota Mensual:',
        missingPayTitle: 'Falta Pagar',
        btnReminders: 'Recordatorios de Pago',
        allPaidUp: '¡Todos los mensuales están al día!',
        alreadyPaidTitle: 'Ya Pagó',
        noPaymentsThisMonth: 'Ningún pago registrado este mes.'
      },
      configModal: {
        title: 'Modo de Pago (Titulares)',
        noStartersDef: 'Aún no has definido a los Titulares Fijos en los Ajustes del Club.',
        optMonthly: 'Mensualidad',
        optPerMatch: 'Paga por Partido'
      },
      notify: {
        errRestricted: 'Acceso restringido a la tesorería.',
        infoSearchingDebtors: 'Buscando jugadores con pagos pendientes...',
        warnNoDebtorsApp: 'No hay jugadores con cuenta en la app que deban dinero para avisar.',
        warnNoPushEnabled: 'Los deudores no tienen las notificaciones activadas en su móvil.',
        pushTitleMatchDay: 'MatchDay',
        pushMsgMonthly: 'Tienes un pago pendiente referente a {month}.',
        pushMsgMatch: 'Tienes un pago pendiente referente al partido del {date} en {location}.',
        alertsSent: '¡Alertas enviadas con éxito a {count} deudores!',
        errCriticalPush: 'Error crítico al enviar notificaciones.',
        errSupabase: 'Error de Supabase: ',
        configSavedMonth: '¡Configuración guardada para este mes!',
        paymentRegistered: '¡Pago registrado!',
        matchLiquidated: '¡Partido totalmente liquidado!'
      }
    },
    stats: {
      headerTitle: 'Estadísticas de Temporada',
      noStatsTitle: 'Sin Datos Estadísticos',
      noStatsDesc: 'Aún no hay partidos cerrados con resultados para calcular el ranking.',
      timeFilterFullSeason: 'Temporada Completa',
      columns: {
        player: 'Jugador',
        matches: 'PJ',
        matchesTooltip: 'Partidos Jugados',
        goals: 'G',
        goalsTooltip: 'Goles Marcados',
        assists: 'A',
        assistsTooltip: 'Asistencias',
        rating: '★',
        ratingTooltip: 'Nota Media (1 a 10)',
        mvp: 'MVP',
        mvpTooltip: 'Veces Jugador del Partido',
        wins: 'V',
        winsTooltip: 'Victorias',
        draws: 'E',
        drawsTooltip: 'Empates',
        losses: 'D',
        lossesTooltip: 'Derrotas',
        points: 'PTS'
      },
      unknownPlayer: 'Desconocido'
    },
    join: {
      processing: 'Procesando invitación...',
      entering: 'Entrando a tu nuevo club de fútbol.',
      errLogin: '¡Inicia sesión o crea una cuenta para entrar en el club!',
      errSend: 'Error al enviar la solicitud: ',
      infoPending: 'Ya tienes una solicitud pendiente o ya estás en este club.',
      success: '¡Solicitud de ingreso enviada con éxito! Espera la aprobación.'
    },
    error404: {
      title: 'Ups. No hay nada aquí...',
      btnHome: 'Volver al Inicio'
    },
    common: {
      language: 'Idioma',
      system: 'Por Defecto (Sistema)'
    },
    days: [
      { label: 'Lunes', value: 1 }, { label: 'Martes', value: 2 }, { label: 'Miércoles', value: 3 },
      { label: 'Jueves', value: 4 }, { label: 'Viernes', value: 5 }, { label: 'Sábado', value: 6 }, { label: 'Domingo', value: 7 }
    ],
    positions: ['Portero', 'Defensa', 'Centrocampista', 'Delantero'],
    feet: ['Derecho', 'Izquierdo', 'Ambos'],
    specPositions: {
      gr: 'Portero (POR)',
      dc: 'Defensa Central (DFC)',
      ld: 'Lateral Derecho (LD)',
      le: 'Lateral Izquierdo (LI)',
      ad: 'Carrilero Derecho (CAD)',
      ae: 'Carrilero Izquierdo (CAI)',
      mdc: 'Mediocentro Defensivo (MCD)',
      mc: 'Mediocentro (MC)',
      mco: 'Mediocentro Ofensivo (MCO)',
      md: 'Medio Derecho (MD)',
      me: 'Medio Izquierdo (MI)',
      pl: 'Delantero Centro (DC)',
      sa: 'Segundo Delantero (SD)',
      ed: 'Extremo Derecho (ED)',
      ee: 'Extremo Izquierdo (EI)'
    }
  }