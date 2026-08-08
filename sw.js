const CACHE_NAME = 'locsbylucs-v1';
const ASSETS_TO_CACHE = [
    '/', 
    '/index.html', 
    '/style.css', /* Add your main CSS file name here */
    '/script.js', /* Add your main JS file name here */
    /* Add paths to your main logo image here so it loads offline */
    '/images/locsbylucs-logo.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch assets from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
