// sw.js
const CACHE = 'm-key-cache-v3';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/app.js'];

self.addEventListener('install', e => {
  self.skipWaiting(); // одразу активуємо новий SW (за потреби)
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim(); // керуємо відкритими вкладками
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});