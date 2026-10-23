const routes = [
  // 1. Rota Protegida (Dashboard e tudo o que precisa de login)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/selector' },
      { path: 'selector', component: () => import('pages/ClubSelector.vue') },
      { path: 'club/:id', component: () => import('pages/ClubDashboard.vue'), props: true },
      { path: 'club/:id/players', component: () => import('pages/ClubPlayers.vue'), props: true },
      { path: 'club/:id/stats', component: () => import('pages/ClubStats.vue'), props: true },
      { path: 'club/:id/finances', component: () => import('pages/ClubFinances.vue'), props: true }
    ]
  },

  // 2. Rotas Públicas
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('pages/LoginPage.vue') 
  },
  { 
    path: '/join/:id', 
    name: 'join-club', 
    component: () => import('pages/JoinClub.vue'), 
    props: true 
  },

  // 3. Página 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes