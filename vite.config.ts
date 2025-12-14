import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      enableRouteGeneration: false,
      routesDirectory: "./src/features",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
      routeFileIgnorePrefix: "@",
      quoteStyle: "single"
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["ella-ui-dev.wyvernp.id.vn"],
  },
});
