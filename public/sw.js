// Service Worker for EduPlay Jr. (PWA)
const CACHE_NAME = 'eduplay-jr-v1.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon.svg',
];

// 1. Install Event: pre-cache static shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Stale-While-Revalidate + Offline Fallback
self.addEventListener('fetch', event => {
  const req = event.request;

  // Ignore non-GET and foreign chrome-extension requests
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // For HTML navigation: Network first, fallback to cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          return res;
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // For static assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      const fetchPromise = fetch(req)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, cached response will be returned if available
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
