import { useEffect } from "react";

// Расширяем window для easter egg
declare global {
  interface Window {
    terraRentCarEasterEgg?: () => void;
  }
}

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
  autoClearTime = 20 * 60 * 1000, // 20 минут для production
  enableDoubleRefresh = true,
  showDebugInfo = false,
}: CacheManagerProps) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Функции для очистки кеша
  const clearAllCache = () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  };

  const clearQueryCache = () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("query")) {
            caches.delete(name);
          }
        });
      });
    }
  };

  const clearLocalStorage = () => {
    // Очищаем все данные формы и даты
    const keysToRemove = [
      "search-dates",
      "reservation-form",
      "reservation-step",
      "wizard-data",
      "uploaded-photos",
      "privacy-accepted",
      "selected-country-code",
      "active-image-index",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Также очищаем все ключи с префиксами для конкретных машин
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (
        key.includes("reservation-form-") ||
        key.includes("reservation-step-") ||
        key.includes("wizard-data-") ||
        key.includes("uploaded-photos-") ||
        key.includes("privacy-accepted-") ||
        key.includes("selected-country-code-") ||
        key.includes("active-image-index-")
      ) {
        localStorage.removeItem(key);
      }
    });

    sessionStorage.clear();
  };

  const clearServiceWorkerCache = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_CACHE",
      });
    }
  };

  const sendMessageToSW = (type: string) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type });
    }
  };

  const forceClearAllCache = () => {
    clearAllCache();
    clearServiceWorkerCache();
    localStorage.clear();
    sessionStorage.clear();
  };

  // Функция для очистки кеша после успешного бронирования
  const clearCacheAfterBooking = () => {
    console.log("🎉 Бронирование завершено! Очищаем кеш...");

    // Очищаем все данные формы
    clearLocalStorage();

    // Очищаем Service Worker кеш
    clearServiceWorkerCache();

    // Сбрасываем время последнего посещения
    localStorage.removeItem("lastVisitTime");

    // Принудительно обновляем страницу
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Получаем время последнего посещения
  const getTimeSinceLastVisit = () => {
    const lastVisit = localStorage.getItem("lastVisitTime");
    if (!lastVisit) return 0;
    return Date.now() - parseInt(lastVisit);
  };

  const shouldClearCacheByTime = () => {
    const timeSinceLastVisit = getTimeSinceLastVisit();
    return timeSinceLastVisit > autoClearTime;
  };

  const lastVisitTime = Date.now();

  // Автоматическая очистка кеша
  useEffect(() => {
    const timeSinceLastVisit = getTimeSinceLastVisit();

    // Проверяем и очищаем старые данные сразу при загрузке
    if (timeSinceLastVisit > autoClearTime) {
      console.log("⏰ Прошло больше 20 минут, очищаем старые данные");
      clearAllCache();
      clearLocalStorage();

      // Очищаем Service Worker кеш для старых данных
      if (timeSinceLastVisit > 2 * 60 * 60 * 1000) {
        // 2 часа
        clearServiceWorkerCache();
      }
    }

    // В dev режиме всегда очищаем даты при загрузке
    if (isDevelopment) {
      clearLocalStorage();
    }

    // В production сохраняем время последнего посещения
    if (!isDevelopment) {
      localStorage.setItem("lastVisitTime", Date.now().toString());
    }
  }, [autoClearTime, getTimeSinceLastVisit, clearAllCache, isDevelopment]);

  // Дополнительная очистка при истечении времени (работает в фоне)
  useEffect(() => {
    if (isDevelopment) return; // Только для production

    const checkAndClearOldData = () => {
      const timeSinceLastVisit = getTimeSinceLastVisit();
      if (timeSinceLastVisit > autoClearTime) {
        console.log("🧹 Автоматическая очистка старых данных");
        clearLocalStorage();
        clearAllCache();
      }
    };

    // Проверяем каждые 5 минут
    const interval = setInterval(checkAndClearOldData, 5 * 60 * 1000);

    return () => clearInterval(interval);
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
          clearAllCache();
          clearServiceWorkerCache();
          localStorage.clear();
          sessionStorage.clear();
          localStorage.removeItem("search-dates");
        },
        forceClearAll: forceClearAllCache,
        forceClearProduction: () => {
          clearAllCache();
          clearServiceWorkerCache();
          sendMessageToSW("CLEAR_CACHE");
        },
        clearLocalStorage: () => {
          localStorage.clear();
          sessionStorage.clear();
        },
        checkCache: () => {
          const keys = Object.keys(localStorage);
          return keys;
        },
        clearServiceWorker: clearServiceWorkerCache,
        clearAfterBooking: clearCacheAfterBooking, // Новая функция для очистки после бронирования
      };
    }

    // Забавное сообщение для разработчиков
    console.log(
      `
🚗 %cTERRA RENT CAR - DEV MODE 🚗
%c
Привет, разработчик! 👋
Ты выбрал машину? 🚙
Если нет - самое время! 

%c💡 Подсказка: Открой консоль и введи:
%cwindow.cacheManager.checkCache()

%c🎯 Найди easter egg на сайте!
%c🎮 Попробуй: console.log("🚗 VROOM VROOM! 🚗")
%c
    `,
      "color: #ff0000; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
      "color: #ffffff; font-size: 14px;",
      "color: #00ff00; font-size: 16px; font-weight: bold;",
      "color: #ffff00; font-size: 14px; font-family: monospace;",
      "color: #ff00ff; font-size: 16px; font-weight: bold;",
      "color: #ffffff; font-size: 12px;",
      "color: #00ffff; font-size: 14px; font-family: monospace;"
    );

    // Добавляем easter egg в глобальную область
    window.terraRentCarEasterEgg = () => {
      console.log(
        `
🎮 %cEaster Egg найден! 🎮
%c
🚗 VROOM VROOM! 🚗
🏎️ Ты настоящий гонщик! 🏎️
🏁 Поздравляем с находкой! 🏁

%c💎 Секретный код: TERRA-RENT-ROCKS
%c
      `,
        "color: #ff00ff; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
        "color: #ffffff; font-size: 14px;",
        "color: #00ff00; font-size: 16px; font-weight: bold;",
        "color: #ffff00; font-size: 14px; font-family: monospace;"
      );
    };
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
          // Проверяем обновления SW
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Можно показать уведомление пользователю
                }
              });
            }
          });
        })
        .catch((error) => {
          // Ошибка регистрации Service Worker
        });
    }
  }, []);

  return null;
};

export default CacheManager;
