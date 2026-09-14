// ==========================================
// NER-LANDSAFE PWA SERVICE WORKER
// Enables offline access to app shell, guidelines, and safety chatbot
// ==========================================

const CACHE_NAME = "ner-landsafe-v1";
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/translations.js",
    "/manifest.json",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"
];

// Install Event
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[ServiceWorker] Caching App Shell and Offline Assets");
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("[ServiceWorker] Clearing Old Cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event (Cache First, Network Fallback)
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If API request fails offline, return offline fallback response
                if (event.request.url.includes("/api/")) {
                    return new Response(
                        JSON.stringify({
                            success: true,
                            offline: true,
                            message: "Offline Mode Active: Displaying cached emergency instructions and safety guidelines."
                        }),
                        { headers: { "Content-Type": "application/json" } }
                    );
                }
            });
        })
    );
});
