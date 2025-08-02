const CACHE_NAME = "terra-rent-car-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
];

// Время жизни кэша (2 минуты для мобильных устройств)
const CACHE_LIFETIME = 2 * 60 * 1000;

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
  // Проверяем, является ли устройство мобильным и Chrome
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent);
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Проверяем возраст кэша
        const cacheTime = response.headers.get("sw-cache-time");
        if (cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          // На мобильных устройствах используем более короткое время жизни кэша
          // Для Chrome на мобильных еще короче
          let lifetime = CACHE_LIFETIME;
          if (isMobile) {
            lifetime = CACHE_LIFETIME / 2;
            if (isChrome) {
              lifetime = CACHE_LIFETIME / 4; // 30 секунд для Chrome на мобильных
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
