import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'billminder',
        short_name: 'billminder',
        description:
          'billminder for bills reminder and monthly budget tracking.',
        theme_color: '#0F0F0F',
      },
      workbox: {
        navigateFallback: '/home',
        runtimeCaching: [
          {
            urlPattern: /^\/__\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
