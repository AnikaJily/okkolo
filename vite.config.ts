import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Вынести тяжёлые зависимости в отдельный кешируемый чанк,
        // который не сбрасывается при правках кода страниц.
        manualChunks: {
          vendor: ['@radix-ui/react-dialog', 'embla-carousel-react'],
        },
      },
    },
  },
});
