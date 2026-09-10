import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function withSlash(value: string) {
  if (!value || value === "/") return "/";
  return value.endsWith("/") ? value : `${value}/`;
}

export default defineConfig(({ command }) => ({
  base: withSlash(process.env.VITE_BASE || (command === "build" ? "/cordoba/" : "/")),
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
}));
