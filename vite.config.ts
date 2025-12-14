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
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  server: {
    allowedHosts: ["ella-ui-dev.wyvernp.id.vn"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // React core libraries
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor_react";
            }
            // UI component libraries
            if (id.includes("@radix-ui")) {
              return "vendor_radix";
            }
            // TanStack libraries (router, query, form)
            if (id.includes("@tanstack")) {
              return "vendor_tanstack";
            }
            // i18n libraries
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "vendor_i18n";
            }
            // Large utilities
            if (id.includes("zod")) {
              return "vendor_zod";
            }
            if (id.includes("axios")) {
              return "vendor_axios";
            }
            if (id.includes("framer-motion")) {
              return "vendor_animation";
            }
            // Everything else
            return "vendor";
          }
        },
      },
    },
    // Increase chunk size warning limit for better optimization
    chunkSizeWarningLimit: 1000,
  },
});
