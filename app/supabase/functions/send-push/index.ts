import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import webPush from "https://esm.sh/web-push@3.6.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Permite chamadas do frontend sem bloqueios de CORS
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { title, body, url } = await req.json()

    // Configura as tuas credenciais de envio (Garante que os Secrets estão no Supabase)
    webPush.setVapidDetails(
      'mailto:admin@gestorfutebol.com', 
      Deno.env.get('VAPID_PUBLIC_KEY') || '',
      Deno.env.get('VAPID_PRIVATE_KEY') || ''
    )

    // Inicia o Supabase em modo Admin (ignora segurança RLS para poder ler todos os tokens)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vai buscar todas as subscrições dos jogadores
    const { data: subs, error } = await supabaseAdmin.from('push_subscriptions').select('subscription')
    if (error) throw error

    // Envia o alerta para cada telemóvel registado
    const payload = JSON.stringify({ title, body, url })
    const promises = subs.map(sub => 
      webPush.sendNotification(sub.subscription, payload).catch(e => console.error("Falha ao enviar para token inativo:", e))
    )
    
    await Promise.all(promises)

    return new Response(JSON.stringify({ success: true, sent: subs.length }), { 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, headers: corsHeaders 
    })
  }
})