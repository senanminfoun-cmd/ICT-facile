// Network first: the app updates as soon as the phone is online; the cache serves it offline.
const C='ict-facile-v10';
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl))}return res})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
