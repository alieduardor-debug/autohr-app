var CACHE = 'autohr-v10';
var FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  // Para JSONBin (sync en la nube): siempre red, nunca cache
  if(e.request.url.includes('jsonbin.io')){
    e.respondWith(fetch(e.request).catch(function(){ return new Response('{}'); }));
    return;
  }
  // Para el resto: cache first, red como fallback
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(resp){
        if(!resp || resp.status!==200 || resp.type==='opaque') return resp;
        var clone = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return resp;
      });
    }).catch(function(){
      return caches.match('./index.html');
    })
  );
});
