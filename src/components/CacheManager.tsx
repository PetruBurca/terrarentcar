import { useEffect } from "react";
import { useCacheManager } from "@/hooks/use-cache-manager";

interface CacheManagerProps {
  autoClearTime?: number;
  enableDoubleRefresh?: boolean;
  showDebugInfo?: boolean;
}

interface CacheManagerWindow extends Window {
  cacheManager?: {
    clearAll: () => void;
    clearQuery: () => void;
    clearStorage: () => void;
    getTimeSinceLastVisit: () => number;
    shouldClearCacheByTime: () => boolean;
    lastVisitTime: number;
    forceClear: () => void;
    checkCache: () => string[];
    forceClearProduction: () => void;
  };
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

  // Проверяем необходимость очистки кэша при загрузке
  useEffect(() => {
    const timeSinceLastVisit = getTimeSinceLastVisit();

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
    }
  }, [autoClearTime, getTimeSinceLastVisit, clearAllCache]);

  // Добавляем глобальные функции для отладки (доступны в production)
  useEffect(() => {
    if (showDebugInfo) {
      (window as CacheManagerWindow).cacheManager = {
        clearAll: clearAllCache,
        clearQuery: clearQueryCache,
        clearStorage: clearLocalStorage,
        getTimeSinceLastVisit,
        shouldClearCacheByTime,
        lastVisitTime,
        // Дополнительные функции для отладки
        forceClear: () => {
          console.log("🧹 Принудительная очистка кэша");
          clearAllCache();
        },
        checkCache: () => {
          const keys = Object.keys(localStorage);
          const cacheKeys = keys.filter(
            (key) =>
              key.includes("reservation") ||
              key.includes("search") ||
              key.includes("uploaded") ||
              key.includes("privacy") ||
              key.includes("wizard") ||
              key.includes("country") ||
              key.includes("image")
          );
          console.log("📊 Найденные ключи кэша:", cacheKeys);
          return cacheKeys;
        },
        // Функция для продакшена
        forceClearProduction: () => {
          console.log("🧹 Принудительная очистка для продакшена");
          // Очищаем все возможные кэши
          localStorage.clear();
          sessionStorage.clear();
          clearAllCache();

          // Принудительно показываем баннер куки
          localStorage.removeItem("cookieAccepted");

          // Перезагружаем страницу
          setTimeout(() => {
            window.location.reload();
          }, 100);
        },
      };

      console.log("🔧 CacheManager доступен в window.cacheManager для отладки");
      console.log(
        "💡 Используйте window.cacheManager.forceClear() для принудительной очистки"
      );
    }
  }, [
    clearAllCache,
    clearQueryCache,
    clearLocalStorage,
    getTimeSinceLastVisit,
    shouldClearCacheByTime,
    lastVisitTime,
    showDebugInfo,
  ]);

  // Компонент не рендерит ничего видимого
  return null;
};

export default CacheManager;
