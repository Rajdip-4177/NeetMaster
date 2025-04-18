import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png', 'maskable_icon.png'],
      manifest: {
        name: 'NEET Master - Your ultimate NEET preparation app',
        short_name: 'NEET Master',
        description: 'Comprehensive NEET preparation app with chapter-wise tests and analysis',
        theme_color: '#4CAF50',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512'
          },
          {
            src: 'maskable_icon.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable'
          }
        ]
      }
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    https: true,
    host: true, // Expose to network
    port: 5001
  }
});
