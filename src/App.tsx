import { Toaster } from "@/components/ui/feedback/toaster";
import { Toaster as Sonner } from "@/components/ui/feedback/sonner";
import { TooltipProvider } from "@/components/ui/overlays/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes - увеличили для лучшего кеширования
      gcTime: 1000 * 60 * 10, // 10 minutes - увеличили для лучшего кеширования
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Добавляем fallback для сетевых ошибок
      networkMode: "online",
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Компонент для обработки ошибок загрузки
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("App error:", event.error);

      // На мобильных устройствах не показываем ошибку для незначительных проблем
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isChrome = /Chrome/i.test(navigator.userAgent);

      if (isMobile && event.error && event.error.message) {
        const errorMessage = event.error.message.toLowerCase();
        if (
          errorMessage.includes("script") ||
          errorMessage.includes("module") ||
          errorMessage.includes("import") ||
          errorMessage.includes("fetch") ||
          errorMessage.includes("chrome") ||
          errorMessage.includes("blob") ||
          errorMessage.includes("url")
        ) {
          console.log("📱 Мобильная ошибка, игнорируем:", errorMessage);
          return;
        }

        // Специальная обработка для Chrome на мобильных
        if (isChrome && isMobile) {
          console.log("📱 Chrome мобильная ошибка, игнорируем:", errorMessage);
          return;
        }
      }

      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);

      // На мобильных устройствах не показываем ошибку для незначительных проблем
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isChrome = /Chrome/i.test(navigator.userAgent);

      if (isMobile && event.reason && typeof event.reason === "string") {
        const errorMessage = event.reason.toLowerCase();
        if (
          errorMessage.includes("script") ||
          errorMessage.includes("module") ||
          errorMessage.includes("import") ||
          errorMessage.includes("fetch") ||
          errorMessage.includes("network") ||
          errorMessage.includes("chrome") ||
          errorMessage.includes("blob") ||
          errorMessage.includes("url")
        ) {
          console.log("📱 Мобильная ошибка промиса, игнорируем:", errorMessage);
          return;
        }

        // Специальная обработка для Chrome на мобильных
        if (isChrome && isMobile) {
          console.log(
            "📱 Chrome мобильная ошибка промиса, игнорируем:",
            errorMessage
          );
          return;
        }
      }

      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
        <div className="bg-zinc-800/50 border border-[#B90003] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-[#B90003]/20">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-[#B90003] rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Что-то пошло не так
            </h2>
            <p className="text-gray-300 mb-6">
              Произошла ошибка при загрузке приложения. Попробуйте обновить
              страницу.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Всегда показываем баннер при загрузке
    setVisible(true);
  }, []);

  const acceptCookies = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
      <div className="bg-black/95 border border-[#B90003] rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-[#B90003]/20 transform transition-all duration-300 scale-100">
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#B90003] mb-3">
            🍪 {t("cookie.title", "Файлы cookie")}
          </h3>
          <p className="text-white mb-6 leading-relaxed">
            {t(
              "cookie.message",
              "Мы используем файлы cookie для улучшения вашего опыта на сайте."
            )}
          </p>
          <button
            onClick={acceptCookies}
            className="w-full px-6 py-3 bg-[#B90003] text-white font-bold text-lg rounded-xl hover:bg-[#A00002] hover:scale-105 shadow-lg transition-all duration-300"
          >
            {t("cookie.accept", "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  // Главное сообщение для разработчиков
  console.log("🎯 ВЫБРАЛ МАШИНУ?");

  // Забавное сообщение для разработчиков
  console.log(
    `
🚗 %cTERRA RENT CAR 🚗
%c
Привет, разработчик! 👋
Ты выбрал машину? 🚙
Если нет - самое время!

%c🎯 Найди easter egg на сайте!
%c🎮 Подсказка: в хэдере
    `,
    "color: #ff0000; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);",
    "color: #ffffff; font-size: 14px;",
    "color: #00ff00; font-size: 16px; font-weight: bold;",
    "color: #ffff00; font-size: 14px; font-family: monospace;",

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

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <CookieBanner />
          {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
