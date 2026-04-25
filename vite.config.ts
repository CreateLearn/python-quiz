import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@mui/')) {
            return 'mui';
          }
          if (id.includes('node_modules/react')) {
            return 'react';
          }
          if (
            id.includes('node_modules/dompurify') ||
            id.includes('node_modules/zod')
          ) {
            return 'sanitizer';
          }
          return undefined;
        },
      },
    },
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
