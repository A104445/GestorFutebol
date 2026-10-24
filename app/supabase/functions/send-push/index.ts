import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import webpush from "npm:web-push@3.6.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Tratamento do CORS (Obrigatório para pedidos do Browser)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    // O frontend ou trigger envia a 'subscription' (da base de dados) e a mensagem
    const { subscription, title, message, url } = body

    // 2. Carregar as variáveis de ambiente (Secrets)
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:geral@matchday.pt' // Substitui pelo teu email

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('As chaves VAPID_PUBLIC_KEY ou VAPID_PRIVATE_KEY não estão definidas nos Secrets.')
    }

    // 3. Configurar a identidade do servidor para a Google (FCM)
    webpush.setVapidDetails(
      vapidSubject,
      vapidPublicKey,
      vapidPrivateKey
    )

    // 4. Estruturar o pacote a enviar para o Service Worker
    const payload = JSON.stringify({
      title: title || 'MatchDay',
      body: message || 'Tens um novo aviso da equipa!',
      url: url || '/'
    })

    // 5. Disparar a notificação
    const sendResult = await webpush.sendNotification(subscription, payload)

    return new Response(
      JSON.stringify({ success: true, sent: 1, result: sendResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao enviar push:', error)
    
    // Devolve o erro exato para sabermos o que falhou
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})