// A simple, no-op service worker that satisfies the PWA installability criteria.
// For a real-world app, you would add caching strategies here.

const CACHE_NAME = 'socialmix-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  // Add other critical assets here, e.g., '/styles.css', '/app.js'
  // For this CDN-based app, caching the root and HTML is a good start.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
