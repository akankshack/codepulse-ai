/**
 * @file vite.config.ts
 * @description Vite configuration file setting up React plugin, dev server port, proxying, and `@` path aliases.
 * 
 * PURPOSE:
 * Configures bundler compilation, dev server options (port 5173), and alias paths (`@/components/...`).
 * 
 * ROLE IN REQUEST FLOW:
 * Used during `npm run dev` and `npm run build` in `/frontend`.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
