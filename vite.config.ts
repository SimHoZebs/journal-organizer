// @deno-types="npm:@types/node"
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  envDir: "../",
  server: {
    proxy: {
      // When the client makes a request to /api, forward it to the backend at localhost:3001
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // you can adjust if needed
      },
    },
  },
});
