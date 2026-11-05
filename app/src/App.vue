<template>
  <router-view />
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

// Importar pacotes nativos do Quasar
import pt from 'quasar/lang/pt'
import enUS from 'quasar/lang/en-US'
import es from 'quasar/lang/es'
import fr from 'quasar/lang/fr'
import it from 'quasar/lang/it'
import de from 'quasar/lang/de'

const { locale } = useI18n()
const $q = useQuasar()

// Traduz calendários e paginações nativas do Quasar
function syncQuasarLanguage(lang) {
  if (lang === 'pt-PT') $q.lang.set(pt)
  else if (lang === 'es-ES') $q.lang.set(es)
  else if (lang === 'fr-FR') $q.lang.set(fr)
  else if (lang === 'it-IT') $q.lang.set(it)
  else if (lang === 'de-DE') $q.lang.set(de)
  else $q.lang.set(enUS) // Inglês por defeito para o resto do mundo
}

onMounted(() => {
  const pref = localStorage.getItem('app_lang_pref') || 'system'
  
  if (pref === 'system') {
    const browserLang = (navigator.language || 'en-US').toLowerCase()
    
    // Detetor inteligente de Idioma do Sistema
    if (browserLang.startsWith('pt')) locale.value = 'pt-PT'
    else if (browserLang.startsWith('es')) locale.value = 'es-ES'
    else if (browserLang.startsWith('fr')) locale.value = 'fr-FR'
    else if (browserLang.startsWith('it')) locale.value = 'it-IT'
    else if (browserLang.startsWith('de')) locale.value = 'de-DE'
    else locale.value = 'en-US'
  } else {
    locale.value = pref
  }
  
  syncQuasarLanguage(locale.value)
})

watch(locale, (newLang) => {
  syncQuasarLanguage(newLang) 
})
</script>