import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// 1. Obriga o telemóvel a assumir a versão nova imediatamente
self.skipWaiting()
clientsClaim()

// 2. A LINHA QUE O VERCEL ESTAVA A PEDIR (Cache offline da PWA)
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// =========================================================
// 3. A NOSSA LÓGICA DE PUSH NOTIFICATIONS
// =========================================================
self.addEventListener('push', function(event) {
  if (!event.data) return;

  try {
    const rawData = event.data.text();
    let data = {};
    
    try {
      data = JSON.parse(rawData);
    } catch {
      data = { message: rawData };
    }
    
    const titulo = data.title || 'MatchDay';
    const mensagem = data.message || data.body || 'Tens uma nova notificação.';

    const options = {
      body: mensagem,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(titulo, options)
    );
  } catch (err) {
    console.error('Erro crítico no Push:', err);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});