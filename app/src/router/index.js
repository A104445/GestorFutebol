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
    const { useAuthStore } = await import('stores/useAuthStore')
    const authStore = useAuthStore()
    const { supabase } = await import('boot/supabase')

    // 1. CORREÇÃO CRÍTICA GOOGLE AUTH (QUASAR HASH MODE GLITCH)
    // Intercetar o URL de retorno do Google OAuth antes que cause erro 404
    // 1. CORREÇÃO CRÍTICA GOOGLE AUTH (QUASAR HASH MODE GLITCH)
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        authStore.user = user
        
        // NOVO: Esperar 1 segundo para o trigger da base de dados criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // NOVO: Extrair o nome diretamente do Google e atualizar o perfil
        const googleName = user.user_metadata?.full_name || user.user_metadata?.name
        if (googleName) {
          await supabase.from('profiles').update({ name: googleName }).eq('id', user.id)
        }

        await authStore.fetchProfile(user.id)
                 
        const lastClub = localStorage.getItem('last_club_id')
        if (lastClub) {
          next({ path: `/club/${lastClub}` })
        } else {
          next({ path: '/' })
        }
        return
      }
    }

    // 2. REIDRATAÇÃO EM REFRESH (ANTI-F5)
    if (!authStore.user) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        authStore.user = user
        await authStore.fetchProfile(user.id)
      }
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !authStore.user) {
      next({ name: 'login' })
    } else {
      if (authStore.user) {
        // 3. ENTRAR LOGO NO ÚLTIMO CLUBE ABERTO
        // Redireciona se houver um ID gravado e o destino for a raiz ou o seletor
        const lastClubId = localStorage.getItem('last_club_id')
        if (lastClubId && (to.path === '/' || to.path === '/selector')) {
          next({ path: `/club/${lastClubId}` })
          return
        }

        if (to.name === 'login') {
          next({ path: '/' })
          return
        }
      }
      next()
    }
  })

  return Router
})