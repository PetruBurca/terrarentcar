const CACHE_NAME = "terra-rent-car-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
];

// Время жизни кэша (1 минута - для полной очистки)
const CACHE_LIFETIME = 1 * 60 * 1000;

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

// Fetch event - ОТКЛЮЧЕНО КЭШИРОВАНИЕ
self.addEventListener("fetch", (event) => {
  console.log("🚫 Service Worker: Кэширование отключено, запрашиваем свежие данные");
  return fetch(event.request);
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker: Активируем новую версию, удаляем старые кэши");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Удаляем старый кэш:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Message event для принудительной очистки
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    console.log("🧹 Принудительная очистка кэша");
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("🗑️ Удаляем кэш:", cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});
