const CACHE_NAME = "terra-rent-car-v2"; // Увеличиваем версию
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  // Принудительно активируем новый SW
  self.skipWaiting();
});

// Fetch event с улучшенной стратегией
self.addEventListener("fetch", (event) => {
  // Для API запросов - всегда сеть
  if (event.request.url.includes('/api/') || event.request.url.includes('airtable.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Для статических ресурсов - кэш с fallback
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Проверяем актуальность кэша
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          }
          return response;
        }).catch(() => response);
      }
      return fetch(event.request);
    })
  );
});

// Activate event с принудительным обновлением
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Принудительно берем контроль над всеми клиентами
      return self.clients.claim();
    })
  );
});

// Обработчик сообщений для принудительного обновления
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
