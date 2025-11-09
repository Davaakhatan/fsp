import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fsp/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@fsp/database': path.resolve(__dirname, '../../packages/database/src'),
    },
  },
  server: {
    port: 3000,
  },
});

