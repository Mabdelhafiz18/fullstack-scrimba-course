import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The Express API runs on port 5050 in dev. Vite proxies /api to it so the
// frontend can call relative URLs like fetch("/api/posts").
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5050",
    },
  },
});
