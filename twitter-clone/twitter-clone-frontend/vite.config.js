import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: "./private.key",
      cert: "./certificate.crt",
    },
  },
  plugins: [vue()],
});
