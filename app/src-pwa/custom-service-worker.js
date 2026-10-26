import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', function(event) {
  if (!event.data) return;

  try {
    // 1. Tenta extrair os dados recebidos
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      // Se não for JSON, apanha como texto puro
      data = { body: event.data.text() };
    }
    
    // 2. Apanha a descrição quer venha como 'body', 'message' ou 'descricao'
    const textoDescricao = data.body || data.message || data.descricao || 'Tens uma nova notificação pendente.';
    const tituloPush = data.title || 'MatchDay';

    const options = {
      body: textoDescricao,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      }
    };

    // 3. Força o desenho do balão no ecrã (vital para iOS e Android)
    event.waitUntil(
      self.registration.showNotification(tituloPush, options)
    );
  } catch (err) {
    console.error('Erro ao processar o Push recebido:', err);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});