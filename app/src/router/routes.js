const routes = [
  // 1. Rota Protegida (Dashboard e tudo o que precisa de login)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // 2. Rota Pública (Login isolado)
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('pages/LoginPage.vue') 
  },

  // 3. Página 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes