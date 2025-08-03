import { useEffect } from "react";

// Расширяем window для easter egg
declare global {
  interface Window {
    terraRentCarEasterEgg?: () => void;
  }
}

interface CacheManagerProps {
  showDebugInfo?: boolean;
}

const CacheManager = ({ showDebugInfo = false }: CacheManagerProps) => {
  const isDevelopment = process.env.NODE_ENV === "development";

      // Простая очистка localStorage
    const clearLocalStorage = () => {
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

      sessionStorage.clear();
    };

    // Функция для проверки статуса деплоя
    const checkDeployStatus = () => {
      console.log("🔍 Проверяем статус деплоя...");
      return "Деплой работает!";
    };

  // Автоматическая очистка кеша
  useEffect(() => {
    // В dev режиме всегда очищаем даты при загрузке
    if (isDevelopment) {
      clearLocalStorage();
    }
  }, [isDevelopment]);

  // Добавляем глобальные функции для отладки
  useEffect(() => {
    if (showDebugInfo || isDevelopment) {
      window.cacheManager = {
        clearStorage: clearLocalStorage,
        checkCache: () => {
          const keys = Object.keys(localStorage);
          return keys;
        },
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
%c🚀 Автоматический деплой работает!
%c
      `,
      "color: #ff0000; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
      "color: #ffffff; font-size: 14px;",
      "color: #00ff00; font-size: 16px; font-weight: bold;",
      "color: #ffff00; font-size: 14px; font-family: monospace;",
      "color: #ff00ff; font-size: 16px; font-weight: bold;",
      "color: #ffffff; font-size: 12px;",
      "color: #00ffff; font-size: 14px; font-family: monospace;",
      "color: #00ff00; font-size: 14px; font-weight: bold;"
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
  }, [showDebugInfo, isDevelopment]);

  return null;
};

export default CacheManager;
