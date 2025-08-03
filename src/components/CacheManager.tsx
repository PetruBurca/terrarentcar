import { useEffect } from "react";
import { useCacheManager } from "@/hooks/use-cache-manager";

// Тип для глобального cacheManager
interface CacheManagerGlobal {
  clearAll: () => void;
  clearQuery: () => void;
  clearStorage: () => void;
  getTimeSinceLastVisit: () => number;
  shouldClearCacheByTime: () => boolean;
  lastVisitTime: number;
  forceClear: () => void;
  checkCache: () => string[];
  forceClearProduction: () => void;
  clearServiceWorker: () => void;
  clearLocalStorage: () => void;
}

// Расширяем Window интерфейс
declare global {
  interface Window {
    cacheManager?: CacheManagerGlobal;
  }
}

interface CacheManagerProps {
  autoClearTime?: number;
  enableDoubleRefresh?: boolean;
  showDebugInfo?: boolean;
}

const CacheManager = ({
  autoClearTime = 5 * 60 * 1000,
  enableDoubleRefresh = true,
  showDebugInfo = false,
}: CacheManagerProps) => {
  const {
    clearAllCache,
    clearQueryCache,
    clearLocalStorage,
    getTimeSinceLastVisit,
    shouldClearCacheByTime,
    lastVisitTime,
  } = useCacheManager({
    autoClearTime,
    enableDoubleRefresh,
  });

  // Определяем режим разработки
  const isDevelopment = import.meta.env.DEV;

  // Функция для очистки Service Worker кеша
  const clearServiceWorkerCache = async () => {
    if ("serviceWorker" in navigator && "caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            console.log("🧹 Очищаем SW кеш:", cacheName);
            return caches.delete(cacheName);
          })
        );
        console.log("✅ Service Worker кеш очищен");
      } catch (error) {
        console.error("❌ Ошибка очистки SW кеша:", error);
      }
    }
  };

  // Функция для отправки сообщения в Service Worker
  const sendMessageToSW = (type: string) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type });
      });
    }
  };

  // Функция для принудительной очистки всех кэшей
  const forceClearAllCache = () => {
    console.log("🧹 Принудительная очистка всех кэшей");
    
    // Очищаем localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Очищаем Service Worker кэш
    clearServiceWorkerCache();
    
    // Отправляем сообщение в Service Worker
    sendMessageToSW("CLEAR_CACHE");
    
    // Очищаем React Query кэш
    clearQueryCache();
    
    console.log("✅ Все кэши очищены");
  };

  // КЭШИРОВАНИЕ ОТКЛЮЧЕНО
  useEffect(() => {
    console.log("🚫 Кэширование отключено - приложение работает без кэша");
    
    // Очищаем все кэши при загрузке
    localStorage.clear();
    sessionStorage.clear();
    clearServiceWorkerCache();
    clearQueryCache();
    
    console.log("🧹 Все кэши очищены, приложение работает чисто");
  }, []);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;
      clearButton.onclick = () => {
        localStorage.clear();
        sessionStorage.clear();
        alert("Кэш очищен! Страница перезагрузится.");
        window.location.reload();
      };
      document.body.appendChild(clearButton);
      console.log("📱 Добавлена кнопка очистки кэша для мобильных");
    }

    // Проверяем, есть ли сохраненные данные заявки
    const keys = Object.keys(localStorage);
    const hasReservationData = keys.some(
      (key) =>
        key.includes("reservation-form-") ||
        key.includes("reservation-step-") ||
        key.includes("wizard-data-")
    );

    if (hasReservationData) {
      console.log(
        "👋 Привет! Ты уже выбрал машину? Данные заявки восстановлены."
      );
    }

    // Если прошло больше времени чем autoClearTime, очищаем кэш
    if (
      timeSinceLastVisit > autoClearTime &&
      timeSinceLastVisit < 24 * 60 * 60 * 1000
    ) {
      console.log(
        `🕐 Прошло ${Math.round(
          timeSinceLastVisit / 1000 / 60
        )} минут с последнего посещения, очищаем кэш`
      );
      clearAllCache();

      // Очищаем Service Worker кеш только для старых данных
      if (timeSinceLastVisit > 2 * 60 * 60 * 1000) {
        // 2 часа
        clearServiceWorkerCache();
      }
    }
  }, [autoClearTime, getTimeSinceLastVisit, clearAllCache, isDevelopment]);

  // Добавляем глобальные функции для отладки (доступны в production)
  useEffect(() => {
    if (showDebugInfo || isDevelopment) {
      window.cacheManager = {
        clearAll: clearAllCache,
        clearQuery: clearQueryCache,
        clearStorage: clearLocalStorage,
        getTimeSinceLastVisit,
        shouldClearCacheByTime,
        lastVisitTime,
        forceClear: () => {
          console.log("🧹 Принудительная очистка всех кешей");
          clearAllCache();
          clearServiceWorkerCache();
          localStorage.clear();
          sessionStorage.clear();

          // Принудительно очищаем даты поиска
          localStorage.removeItem("search-dates");
          console.log("🗑️ Очищены даты поиска");
        },
        forceClearAll: forceClearAllCache, // Добавляем новую функцию
        forceClearProduction: () => {
          console.log("🧹 Принудительная очистка для продакшена");
          clearAllCache();
          clearServiceWorkerCache();
          sendMessageToSW("CLEAR_CACHE");
        },
        clearLocalStorage: () => {
          console.log("🧹 Ручная очистка localStorage");
          localStorage.clear();
          sessionStorage.clear();
          console.log("🗑️ localStorage полностью очищен");
        },
        checkCache: () => {
          const keys = Object.keys(localStorage);
          console.log("📋 Текущие ключи в localStorage:", keys);
          return keys;
        },
        clearServiceWorker: clearServiceWorkerCache,
      };

      console.log("🔧 Глобальный cacheManager доступен в window.cacheManager");
    }
  }, [
    showDebugInfo,
    isDevelopment,
    clearAllCache,
    clearQueryCache,
    clearLocalStorage,
    getTimeSinceLastVisit,
    shouldClearCacheByTime,
    lastVisitTime,
  ]);

  // Регистрируем Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker зарегистрирован:", registration);

          // Проверяем обновления SW
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("🔄 Доступно обновление Service Worker");
                  // Можно показать уведомление пользователю
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("❌ Ошибка регистрации Service Worker:", error);
        });
    }
  }, []);

  return null;
};

export default CacheManager;
