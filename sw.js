const C='calistung-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.json'])));self.skipWaiting()});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const k=n.clone();caches.open(C).then(c=>c.put(e.request,k));return n}).catch(()=>caches.match('./Calistung_Ceria.html'))))});
