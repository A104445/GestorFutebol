// src-pwa/custom-service-worker.js

import { precacheAndRoute } from 'workbox-precaching'

// Injeta o cache offline gerado pelo Quasar (Obrigatório manter esta linha)
precacheAndRoute(self.__WB_MANIFEST)

// O TEU CÓDIGO DE NOTIFICAÇÕES:
self.addEventListener('push', function (event) {
  let data = { title: 'MatchDay', body: 'Nova notificação!', url: '/' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});