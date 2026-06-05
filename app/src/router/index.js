import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Guarda de Navegação Global (Proteção de Rotas)
  Router.beforeEach(async (to, from, next) => {
    // Importamos a store dinamicamente para garantir que o Pinia já está inicializado
    const { useAuthStore } = await import('stores/useAuthStore')
    const authStore = useAuthStore()

    // Verifica se a rota destino tem o meta 'requiresAuth'
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // Se exige autenticação e o utilizador não está logado, bloqueia e manda para o login
    if (requiresAuth && !authStore.user) {
      next({ name: 'login' })
    } else {
      // Caso contrário, deixa a navegação prosseguir normalmente
      next()
    }
  })

  return Router
})