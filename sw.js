//======== NAMA CACHE
const CACHE_NAME = 'calistung-v2';

//======== PROSES INSTALL SERVICE WORKER
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );

  //======== AKTIFKAN SERVICE WORKER BARU
  self.skipWaiting();
});

//======== PROSES AKTIVASI
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key =>
            key.startsWith('calistung-') &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );
    })
  );

  //======== AMBIL KENDALI HALAMAN
  self.clients.claim();
});

//======== PROSES PENGAMBILAN DATA
self.addEventListener('fetch', event => {

  //======== HANYA PROSES REQUEST GET
  if (event.request.method !== 'GET') return;

  //======== KHUSUS PERMINTAAN HALAMAN
  if (event.request.mode === 'navigate') {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          //======== SIMPAN VERSI TERBARU
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put('./index.html', copy);
          });

          return response;
        })

        //======== GUNAKAN CACHE JIKA OFFLINE
        .catch(() => {
          return caches.match('./index.html');
        })
    );
  }
});
