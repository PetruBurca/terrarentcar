import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface CacheManagerOptions {
  autoClearTime?: number; // время в миллисекундах для автоматической очистки
  enableDoubleRefresh?: boolean; // включить сброс при двойном обновлении
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const {
    autoClearTime = 0, // Кэширование отключено
    enableDoubleRefresh = false, // Отключаем двойное обновление
  } = options;

  const queryClient = useQueryClient();
  const lastVisitTime = useRef<number>(Date.now());
  const refreshCount = useRef<number>(0);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  // Определяем режим разработки
  const isDevelopment = import.meta.env.DEV;

  // Отслеживание времени посещения
  useEffect(() => {
    lastVisitTime.current = Date.now();

    // В режиме разработки не устанавливаем автоматическую очистку
    if (isDevelopment) {
      console.log(
        "🔧 Режим разработки - отключена автоматическая очистка кеша"
      );
      return;
    }

    // Устанавливаем таймер для автоматической очистки только в продакшене
    const clearTimer = setTimeout(() => {
      clearAllCache();
    }, autoClearTime);

    return () => {
      clearTimeout(clearTimer);
    };
  }, [autoClearTime, isDevelopment]);

  // Отслеживание двойного обновления
  useEffect(() => {
    if (!enableDoubleRefresh) return;

    let lastRefreshTime = 0;
    const DOUBLE_REFRESH_THRESHOLD = 2000; // 2 секунды

    const handleBeforeUnload = () => {
      refreshCount.current++;
      lastRefreshTime = Date.now();

      // Сбрасываем счетчик через 3 секунды
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      refreshTimeout.current = setTimeout(() => {
        refreshCount.current = 0;
      }, 3000);
    };

    const handleLoad = () => {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime;

      // Проверяем двойное обновление или жесткую перезагрузку
      if (
        refreshCount.current >= 2 ||
        (refreshCount.current >= 1 &&
          timeSinceLastRefresh < DOUBLE_REFRESH_THRESHOLD)
      ) {
        console.log(
          "🔄 Двойное обновление или жесткая перезагрузка обнаружена"
        );
        clearAllCache();
        refreshCount.current = 0;
      }
    };

    // Дополнительная проверка для жесткой перезагрузки
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+R (Mac) или Ctrl+Shift+R (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "R") {
        console.log("🔄 Жесткая перезагрузка обнаружена");
        clearAllCache();
      }

      // Дополнительная проверка для продакшена
      if ((e.metaKey || e.ctrlKey) && e.key === "F5") {
        console.log("🔄 Альтернативная жесткая перезагрузка обнаружена");
        clearAllCache();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("keydown", handleKeyDown);
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [enableDoubleRefresh]);

  // Очистка всех кэшей
  const clearAllCache = () => {
    console.log("🧹 Очистка всех кэшей...");

    // Очищаем React Query кэш
    queryClient.clear();

    // В режиме разработки НЕ очищаем данные, только React Query кэш
    if (isDevelopment) {
      console.log("🔧 Режим разработки - оставляем данные заявок");
      // Очищаем только React Query кэш, не трогаем localStorage
    } else {
      // В продакшене используем умную очистку по времени
      const keys = Object.keys(localStorage);
      const timeSinceLastVisit = Date.now() - lastVisitTime.current;

      // Данные заявок - очищаем через 1 час (короткое время для UX)
      const reservationKeys = keys.filter(
        (key) =>
          key.includes("reservation-form-") ||
          key.includes("reservation-step-") ||
          key.includes("uploaded-photos-") ||
          key.includes("privacy-accepted-") ||
          key.includes("wizard-data-")
      );

      // Пользовательские настройки - очищаем через 2 часа
      const userSettingsKeys = keys.filter(
        (key) =>
          key.includes("selected-country-code-") ||
          key.includes("active-image-index-") ||
          key.includes("cookieAccepted")
      );

      // Очищаем данные заявок через 1 час
      if (timeSinceLastVisit > 60 * 60 * 1000) {
        reservationKeys.forEach((key) => {
          localStorage.removeItem(key);
        });
        console.log("🧹 Очищены данные заявок (прошло больше часа)");
      }

      // Очищаем пользовательские настройки через 2 часа
      if (timeSinceLastVisit > 2 * 60 * 60 * 1000) {
        userSettingsKeys.forEach((key) => {
          localStorage.removeItem(key);
        });
        console.log(
          "🧹 Очищены пользовательские настройки (прошло больше 2 часов)"
        );
      }

      // Очищаем Service Worker кэш только при необходимости
      if ("serviceWorker" in navigator && "caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }

      console.log("✅ Умная очистка кеша завершена (продакшен режим)");
    }

    // Сбрасываем время последнего посещения
    lastVisitTime.current = Date.now();
  };

  // Очистка только React Query кэша
  const clearQueryCache = () => {
    queryClient.clear();
    console.log("✅ React Query кэш очищен");
  };

  // Очистка только localStorage
  const clearLocalStorage = () => {
    // Очищаем старые ключи
    const oldKeysToRemove = [
      "reservation-form",
      "search-dates",
      "reservation-step",
      "uploaded-photos",
      "privacy-accepted",
      "wizard-data",
      "selected-country-code",
      "active-image-index",
      "selected-car-id",
      "cookieAccepted", // Добавляем ключ куки
    ];

    oldKeysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Очищаем новые ключи с изоляцией по машинам
    const keys = Object.keys(localStorage);
    const carKeys = keys.filter(
      (key) =>
        key.includes("reservation-form-") ||
        key.includes("reservation-step-") ||
        key.includes("uploaded-photos-") ||
        key.includes("privacy-accepted-") ||
        key.includes("wizard-data-") ||
        key.includes("selected-country-code-") ||
        key.includes("active-image-index-")
    );

    carKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Также очищаем ключ куки при очистке localStorage
    localStorage.removeItem("cookieAccepted");

    console.log("✅ LocalStorage очищен (включая кэши машин)");
  };

  // Получение времени с последнего посещения
  const getTimeSinceLastVisit = () => {
    return Date.now() - lastVisitTime.current;
  };

  // Проверка, нужно ли очистить кэш по времени
  const shouldClearCacheByTime = () => {
    return getTimeSinceLastVisit() >= autoClearTime;
  };

  return {
    clearAllCache,
    clearQueryCache,
    clearLocalStorage,
    getTimeSinceLastVisit,
    shouldClearCacheByTime,
    lastVisitTime: lastVisitTime.current,
  };
};
