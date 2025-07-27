const CACHE_NAME = "terra-rent-car-v1.2";
const STATIC_CACHE = "static-v1.2";
const DYNAMIC_CACHE = "dynamic-v1.2";

// Ресурсы для предварительного кэширования
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/index.css",
  "/src/assets/logo.webp",
  "/src/assets/hero-road.webp",
];

// Стратегии кэширования
const CACHE_STRATEGIES = {
  // Критические ресурсы - кэшируем сразу
  CRITICAL: "cache-first",
  // Изображения - кэшируем после загрузки
  IMAGES: "cache-first",
  // API запросы - сеть с fallback на кэш
  API: "network-first",
  // Остальные ресурсы - кэш с fallback на сеть
  DEFAULT: "stale-while-revalidate",
};

// Установка Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Кэширование статических ресурсов");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker установлен");
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Удаление старого кэша:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker активирован");
        return self.clients.claim();
      })
  );
});

// Перехват запросов
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем POST запросы и запросы к внешним API
  if (
    request.method === "POST" ||
    url.hostname === "api.airtable.com" ||
    url.hostname === "firebasestorage.googleapis.com"
  ) {
    return;
  }

  // Определяем стратегию кэширования
  let strategy = CACHE_STRATEGIES.DEFAULT;

  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.startsWith("/src/")
  ) {
    strategy = CACHE_STRATEGIES.CRITICAL;
  } else if (request.destination === "image") {
    strategy = CACHE_STRATEGIES.IMAGES;
  }

  event.respondWith(handleRequest(request, strategy));
});

// Обработка запросов в зависимости от стратегии
async function handleRequest(request, strategy) {
  const cache = await caches.open(DYNAMIC_CACHE);

  switch (strategy) {
    case CACHE_STRATEGIES.CRITICAL:
      return cacheFirst(request, cache);

    case CACHE_STRATEGIES.IMAGES:
      return cacheFirst(request, cache);

    case CACHE_STRATEGIES.API:
      return networkFirst(request, cache);

    default:
      return staleWhileRevalidate(request, cache);
  }
}

// Стратегия: кэш первый
async function cacheFirst(request, cache) {
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Fallback для критических ресурсов
    if (request.destination === "document") {
      return cache.match("/index.html");
    }
    throw error;
  }
}

// Стратегия: сеть первый
async function networkFirst(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Стратегия: устаревший-пока-перевалидируется
async function staleWhileRevalidate(request, cache) {
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Обработка сообщений от основного потока
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
