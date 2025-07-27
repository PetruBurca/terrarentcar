const CACHE_NAME = "terra-rent-car-v2";
const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
  "/src/assets/logo.png",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - очистка старых кэшей
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - стратегия кэширования
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Стратегия для статических ресурсов
  if (request.method === "GET") {
    // Кэшируем изображения
    if (request.destination === "image") {
      event.respondWith(
        caches.match(request).then((response) => {
          return (
            response ||
            fetch(request).then((fetchResponse) => {
              return caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
            })
          );
        })
      );
      return;
    }

    // Кэшируем CSS и JS
    if (request.destination === "style" || request.destination === "script") {
      event.respondWith(
        caches.match(request).then((response) => {
          if (response) {
            // Проверяем актуальность кэша
            return fetch(request)
              .then((fetchResponse) => {
                if (fetchResponse.status === 200) {
                  caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, fetchResponse.clone());
                  });
                }
                return fetchResponse;
              })
              .catch(() => response);
          }
          return fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, fetchResponse.clone());
              });
            }
            return fetchResponse;
          });
        })
      );
      return;
    }

    // Для API запросов - Network First
    if (url.pathname.includes("/api/")) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, response.clone());
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
      return;
    }
  }

  // Fallback для остальных запросов
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

// Background sync для офлайн функциональности
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Здесь можно добавить логику для синхронизации данных
  console.log("Background sync triggered");
}
