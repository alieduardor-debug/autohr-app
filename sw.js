var CACHE = 'autohr-v12';
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
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  if(e.request.url.includes('jsonbin.io')){
    e.respondWith(fetch(e.request).catch(function(){ return new Response('{}'); }));
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(resp){
      if(resp && resp.status === 200){
        var clone = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
      }
      return resp;
    }).catch(function(){
      return caches.match(e.request).then(function(c){ return c || caches.match('./index.html'); });
    })
  );
});
