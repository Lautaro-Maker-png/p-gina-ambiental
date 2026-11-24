// Service worker: guarda la página para que funcione sin conexión.
// Cuando cambies archivos, subí el número de versión para renovar la copia guardada.
const VERSION = 'pv-v1';
const FILES = [
  './', 'index.html', 'aprender.html', 'medi.html', 'juegos.html', 'derechos.html', 'actua.html', 'blog.html', 'docentes.html',
  'style.css', 'layout.js', 'achievements.js', 'script.js', 'eia.js', 'ecoregiones.js', 'foodweb.js', 'clima-agua.js',
  'calidad.js', 'residuos.js', 'audit.js', 'glossary.js', 'blog.js', 'docentes.js', 'ranking.js',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la red (para ver siempre lo último); si no hay conexión, la copia guardada.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
