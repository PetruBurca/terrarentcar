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
          // Основные библиотеки
          vendor: ["react", "react-dom"],

          // UI компоненты - разделяем на более мелкие чанки
          "ui-dialog": ["@radix-ui/react-dialog"],
          "ui-select": ["@radix-ui/react-select"],
          "ui-forms": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
          ],
          "ui-navigation": [
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-tabs",
          ],
          "ui-overlays": ["@radix-ui/react-popover", "@radix-ui/react-tooltip"],

          // Утилиты
          utils: [
            "clsx",
            "class-variance-authority",
            "lucide-react",
            "date-fns",
          ],

          // Интернационализация
          i18n: ["i18next", "react-i18next"],

          // React Query
          query: ["@tanstack/react-query"],

          // Firebase (отдельно для мобильных)
          firebase: ["firebase/app", "firebase/storage"],

          // Карусель (отдельно)
          carousel: ["embla-carousel-react"],

          // Формы
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
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
        // Дополнительные оптимизации для мобильных
        pure_funcs:
          mode === "production" ? ["console.log", "console.info"] : [],
        passes: mode === "production" ? 2 : 1,
      },
      mangle: mode === "production",
    },
    // Оптимизация для мобильных устройств
    target: "es2015", // Поддержка старых браузеров
    cssCodeSplit: true, // Разделение CSS
    sourcemap: mode === "development",
  },
  // Оптимизация для разработки
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "i18next",
      "react-i18next",
      "firebase/app",
      "firebase/storage",
    ],
    // Исключаем тяжелые зависимости из предварительной оптимизации
    exclude: ["embla-carousel-react"],
  },
  // Оптимизация CSS
  css: {
    devSourcemap: mode === "development",
  },
}));
