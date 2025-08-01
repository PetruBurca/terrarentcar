const CACHE_NAME = "terra-rent-car-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
];

// Время жизни кэша (5 минут)
const CACHE_LIFETIME = 5 * 60 * 1000;

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).then(() => {
        // Добавляем метку времени к кэшированным ресурсам
        return Promise.all(
          urlsToCache.map((url) =>
            cache.match(url).then((response) => {
              if (response) {
                const newResponse = new Response(response.body, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: {
                    ...Object.fromEntries(response.headers.entries()),
                    "sw-cache-time": Date.now().toString(),
                  },
                });
                return cache.put(url, newResponse);
              }
            })
          )
        );
      });
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Проверяем возраст кэша
        const cacheTime = response.headers.get("sw-cache-time");
        if (cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          if (age > CACHE_LIFETIME) {
            // Кэш устарел, удаляем его и запрашиваем свежие данные
            caches.delete(event.request);
            return fetch(event.request);
          }
        }
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Activate event
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
    })
  );
});
