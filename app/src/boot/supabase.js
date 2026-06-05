import { boot } from 'quasar/wrappers'
import { createClient } from '@supabase/supabase-js'

// Cola aqui as chaves que copiaste do painel do Supabase!
const supabaseUrl = 'https://vvgoqiizwbjuqrahqtal.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z29xaWl6d2JqdXFyYWhxdGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjY4OTksImV4cCI6MjA5NjI0Mjg5OX0.MhcwqK8UWZTbgLYOcSqcvAbqQsdmXo-qSL0r006DEzI'

const supabase = createClient(supabaseUrl, supabaseKey)

export default boot(({ app }) => {
  app.config.globalProperties.$supabase = supabase
})

export { supabase }