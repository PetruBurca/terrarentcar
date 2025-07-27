import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Основные React библиотеки
          vendor: ["react", "react-dom"],

          // UI компоненты - разделяем по функциональности
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
          ui_forms: [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-switch",
          ],
          ui_navigation: [
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-tabs",
          ],
          ui_overlays: [
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-hover-card",
          ],

          // Утилиты
          utils: ["clsx", "class-variance-authority", "tailwind-merge"],

          // Интернационализация
          i18n: ["i18next", "react-i18next"],

          // Запросы к API
          query: ["@tanstack/react-query"],

          // Формы
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],

          // Дата и время
          date: ["date-fns", "react-day-picker"],

          // Иконки
          icons: ["lucide-react", "react-icons"],

          // Firebase
          firebase: ["firebase/app", "firebase/storage"],

          // Карусель
          carousel: ["embla-carousel-react"],

          // Роутинг
          router: ["react-router-dom"],
        },
      },
    },
    // Увеличиваем лимит для больших чанков
    chunkSizeWarningLimit: 1000,
    // Оптимизация для продакшена
    minify: mode === "production" ? "terser" : false,
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs:
          mode === "production"
            ? ["console.log", "console.info", "console.debug"]
            : [],
      },
      mangle: {
        safari10: true, // Для лучшей совместимости с Safari
      },
    },
    // Оптимизация CSS
    cssCodeSplit: true,
    // Оптимизация assets
    assetsInlineLimit: 4096, // Inline маленькие assets
    // Оптимизация для мобильных устройств
    target: "es2015", // Для лучшей совместимости
  },
  // Оптимизация для разработки
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "i18next",
      "react-i18next",
      "clsx",
      "class-variance-authority",
      "tailwind-merge",
    ],
    // Исключаем тяжелые зависимости из pre-bundling
    exclude: ["firebase"],
  },
  // Оптимизация CSS
  css: {
    devSourcemap: false, // Отключаем source maps для CSS в продакшене
  },
}));
