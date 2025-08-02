const CACHE_NAME = "terra-rent-car-v3";
const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v3";

// Ресурсы для предварительного кеширования
const urlsToCache = ["/", "/index.html", "/assets/", "/locales/"];

// Время жизни кэша для разных типов ресурсов
const CACHE_LIFETIMES = {
  static: 24 * 60 * 60 * 1000, // 24 часа для статических файлов
  dynamic: 60 * 60 * 1000, // 1 час для динамических данных
  api: 10 * 60 * 1000, // 10 минут для API запросов
};

// Функция для определения типа ресурса
function getResourceType(url) {
  if (url.includes("/api/") || url.includes("airtable.com")) {
    return "api";
  }
  if (
    url.includes("/assets/") ||
    url.includes(".js") ||
    url.includes(".css") ||
    url.includes(".webp")
  ) {
    return "static";
  }
  return "dynamic";
}

// Функция для проверки актуальности кеша
function isCacheValid(response, resourceType) {
  const cacheTime = response.headers.get("sw-cache-time");
  if (!cacheTime) return false;

  const age = Date.now() - parseInt(cacheTime);
  const maxAge = CACHE_LIFETIMES[resourceType] || CACHE_LIFETIMES.dynamic;

  return age < maxAge;
}

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  // Активируем новый SW сразу
  self.skipWaiting();
});

// Activate event
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

  // Берем контроль над всеми страницами
  event.waitUntil(self.clients.claim());
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== "GET") {
    return;
  }

  // Пропускаем chrome-extension и другие не-http запросы
  if (!url.protocol.startsWith("http")) {
    return;
  }

  const resourceType = getResourceType(url.href);

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Проверяем актуальность кеша
        if (isCacheValid(response, resourceType)) {
          return response;
        } else {
          // Удаляем устаревший кеш
          caches.delete(request);
        }
      }

      // Загружаем свежие данные
      return fetch(request)
        .then((fetchResponse) => {
          // Кешируем только успешные ответы
          if (fetchResponse && fetchResponse.status === 200) {
            const responseToCache = fetchResponse.clone();

            // Добавляем метку времени
            const newResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: {
                ...Object.fromEntries(responseToCache.headers.entries()),
                "sw-cache-time": Date.now().toString(),
                "sw-resource-type": resourceType,
              },
            });

            // Кешируем в соответствующий кеш
            const cacheName =
              resourceType === "static" ? STATIC_CACHE : DYNAMIC_CACHE;
            caches.open(cacheName).then((cache) => {
              cache.put(request, newResponse);
            });
          }

          return fetchResponse;
        })
        .catch((error) => {
          // Возвращаем кешированную версию если есть
          if (response) {
            return response;
          }

          // Для критических ресурсов возвращаем fallback
          if (url.pathname === "/" || url.pathname === "/index.html") {
            return caches.match("/");
          }

          throw error;
        });
    })
  );
});

// Обработка сообщений от основного потока
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});
