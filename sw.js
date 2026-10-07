// Vorkoo Service Worker for Offline Prototype & GitHub Pages Compatibility
const CACHE_NAME = 'vorkoo-v1';

// Relative assets to pre-cache
const PRECACHE_ASSETS = [
  './',
  './Landing-page/landing.html',
  './Landing-page/landing.css',
  './Landing-page/landing.js',
  './Vor-home/home.html',
  './Vor-home/home.css',
  './Vor-home/home.js',
  './Auth/login.html',
  './Auth/signup.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Resolve relative asset URLs against the Service Worker's actual scope.
      // This guarantees correct resolution under /<repository-name>/ on GitHub Pages.
      const scopeBase = self.registration.scope;
      const urls = PRECACHE_ASSETS.map((asset) => new URL(asset, scopeBase).href);
      return cache.addAll(urls).catch((err) => {
        console.warn('Vorkoo SW pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first with cache fallback strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  // Only handle same-origin requests
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            const landingUrl = new URL('./Landing-page/landing.html', self.registration.scope).href;
            return caches.match(landingUrl);
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
