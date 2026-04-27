var CACHE = 'autohr-v13';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first: siempre red, sin cache de HTML
// Asi el iPhone siempre ve la version mas reciente
self.addEventListener('fetch', function(e){
  if(e.request.url.includes('jsonbin.io')){
    e.respondWith(fetch(e.request).catch(function(){ return new Response('{}'); }));
    return;
  }
  // Para el HTML: siempre red, sin cache
  e.respondWith(fetch(e.request).catch(function(){ return new Response('App sin conexion. Conectate a internet.'); }));
});
