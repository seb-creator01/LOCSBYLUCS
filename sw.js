const CACHE_NAME = "locsbylucs-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css"
];

// Install event
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Activate new worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event - Delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});

// Fetch event - Network First for HTML, Cache First for assets
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Network First for HTML navigations (so new install code loads immediately)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache First for CSS/Images (offline support)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).catch(() => new Response("Offline", { status: 503 }));
    })
  );
});
