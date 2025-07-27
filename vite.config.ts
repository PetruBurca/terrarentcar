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

          // UI компоненты
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],

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

          // Firebase
          firebase: ["firebase/app", "firebase/storage"],
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
      },
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
