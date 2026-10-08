// Service worker : l'app reste utilisable sans réseau (vocabulaire, verbes, grammaire, prononciation).
// Stratégie : on sert la copie en cache tout de suite et on la met à jour en arrière-plan.
// Le nom du cache inclut le chemin de l'app pour que les apps de langues ne se mélangent pas.
const VERSION = 'v20261008-1100';
const CACHE = 'applangues' + self.location.pathname.replace(/sw\.js$/, '') + VERSION;
const SHELL = [
  './', './index.html', './css/style.css', './css/theme.css', './manifest.webmanifest',
  './fonts/jost-latin.woff2', './fonts/jost-latin-italic.woff2',
  './icons/favicon.svg', './icons/favicon-32.png', './icons/icon-192.png',
  './js/lang.js', './js/conjugator.js', './js/data/vocab.js', './js/data/grammar.js', './js/data/scenarios.js', './js/data/sounds.js',
  './js/store.js', './js/sync.js', './js/speech.js', './js/ai.js', './js/app.js',
];
const PREFIX = 'applangues' + self.location.pathname.replace(/sw\.js$/, '');

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  // Ne supprime que les anciennes versions de cette app-ci
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Seuls les fichiers de l'app sont mis en cache ; les appels IA, GitHub et /api passent toujours par le réseau.
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/api/')) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => cached);
    return cached || network;
  }));
});
