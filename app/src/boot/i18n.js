import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US', // O idioma principal
    fallbackLocale: 'pt-PT', 
    messages,
    legacy: false, // <-- ISTO É OBRIGATÓRIO PARA O VUE 3 / SCRIPT SETUP
    globalInjection: true
  })

  // Instala a instância do i18n na App (é isto que resolve o teu erro!)
  app.use(i18n)
})