const CACHE_NAME = 'eclettica-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contacts.html',
  '/css/styleIndex.css',
  '/css/styleContacts.css',
  '/js/main.min.js',
  '/images/logo_giusy_oro.png',
  '/images/logo_giusy_bianco.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
