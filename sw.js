// Auto H&R Service Worker v14
// Estrategia: network-first sin cache para HTML, siempre fresco
var CACHE_NAME = 'autohr-v14';

self.addEventListener('install', function(e){
  // Borrar todo cache anterior e instalar inmediatamente
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  // JSONBin: siempre red, nunca cache
  if(e.request.url.includes('jsonbin.io')){
    e.respondWith(
      fetch(e.request, {credentials:'omit'})
        .catch(function(){ return new Response('{}',{headers:{'Content-Type':'application/json'}}); })
    );
    return;
  }
  // Todo lo demas: siempre red (no cache), para garantizar version mas reciente
  e.respondWith(
    fetch(e.request)
      .catch(function(){ return new Response('Sin conexion. Recarga cuando tengas internet.'); })
  );
});
