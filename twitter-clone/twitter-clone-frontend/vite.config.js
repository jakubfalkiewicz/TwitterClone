import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    https: {
      key: "./private.key",
      cert: "./certificate.crt",
    },
  },
  preview: {
    open: true,
    host: true,
    port: 5173,
    https: {
      key: "./private.key",
      cert: "./certificate.crt",
    },
  },
  plugins: [vue()],
});
