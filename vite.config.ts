import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copy } from "fs-extra";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "./" : "/",
  server: {
    host: "::",
    port: 8080,
    // Отключаем кеширование в dev режиме
    hmr: {
      overlay: true,
    },
    // Принудительно обновляем файлы
    watch: {
      usePolling: true,
    },
    // Добавляем заголовки для отключения кеширования
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
  // Отключаем кеширование в dev режиме
  define: {
    __DEV__: mode === "development",
  },
  plugins: [
    react(),
    {
      name: "copy-cname",
      writeBundle() {
        copy("CNAME", "dist/CNAME");
        copy("404.html", "dist/404.html");
        copy(".nojekyll", "dist/.nojekyll");
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем vendor библиотеки
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
          utils: [
            "clsx",
            "class-variance-authority",
            "lucide-react",
            "date-fns",
          ],
          i18n: ["i18next", "react-i18next"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    // Увеличиваем лимит для больших чанков
    chunkSizeWarningLimit: 1000,
    // Оптимизация для продакшена
    minify: mode === "production" ? "terser" : false,
    terserOptions: {
      compress: {
        drop_console: false, // Оставляем console.log для разработчиков
        drop_debugger: mode === "production",
      },
    },
  },
  // Оптимизация для разработки
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "i18next",
      "react-i18next",
    ],
  },
}));
