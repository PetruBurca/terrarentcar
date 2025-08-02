const CACHE_NAME = "terra-rent-car-v5";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
];

// Время жизни кэша (5 минут - нормальное время)
const CACHE_LIFETIME = 5 * 60 * 1000;

// Install event
self.addEventListener("install", (event) => {
  console.log("🔄 Service Worker: Устанавливаем новую версию кэша v5");
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
                    "sw-version": "v5",
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
  // Проверяем, является ли устройство мобильным и Chrome
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isChrome = /Chrome/i.test(navigator.userAgent);

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Проверяем возраст кэша
        const cacheTime = response.headers.get("sw-cache-time");
        if (cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          // На мобильных устройствах используем более короткое время жизни кэша
          // Для Chrome на мобильных немного короче
          let lifetime = CACHE_LIFETIME;
          if (isMobile) {
            lifetime = CACHE_LIFETIME / 2; // 2.5 минуты для мобильных
            if (isChrome) {
              lifetime = CACHE_LIFETIME / 3; // 1.5 минуты для Chrome на мобильных
            }
          }
          if (age > lifetime) {
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
