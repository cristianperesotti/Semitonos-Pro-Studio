const CACHE = 'semitonos-pro-android-v1';
const APP_FILES = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const req = event.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); } return res; }).catch(() => caches.match('./index.html'))));
  } else if (url.protocol === 'https:') {
    // Runtime cache para módulos del motor IA; los pesos del modelo también usan caché del navegador.
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok && res.type !== 'opaque') { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); } return res; })));
  }
});
