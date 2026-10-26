// Obriga o telemóvel a instalar a versão mais recente imediatamente
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Assume o controlo da app logo a seguir à instalação
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  // Apanha exatamente o que o servidor enviou (ou avisa se vier vazio)
  const rawData = event.data ? event.data.text() : 'NENHUM_DADO_RECEBIDO';
  
  let titulo = 'Tesouraria MatchDay';
  let mensagem = rawData; // Por defeito, vai imprimir tudo o que chegou

  try {
    const data = JSON.parse(rawData);
    titulo = data.title || titulo;
    
    // Tenta encontrar a mensagem. Se não encontrar os campos exatos, cospe o JSON inteiro.
    if (data.message) mensagem = data.message;
    else if (data.body) mensagem = data.body;
    else if (data.notification && data.notification.body) mensagem = data.notification.body;
    else mensagem = rawData; 
    
  } catch {
    // Se não for JSON (for apenas uma string), a variável 'mensagem' mantém o rawData
  }

  const options = {
    body: mensagem,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(titulo, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});