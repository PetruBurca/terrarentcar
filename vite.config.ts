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
          // Минимальное разделение
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
          utils: ["clsx", "class-variance-authority", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: mode === "production" ? "terser" : false,
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },
    target: "es2015",
    cssCodeSplit: false, // Отключаем разделение CSS
    sourcemap: false, // Отключаем sourcemap в продакшене
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
