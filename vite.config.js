import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Completely disable source maps so source code cannot be viewed in DevTools
    sourcemap: false,
    cssMinify: true,
    // Strip all copyright comments or code annotations from final JavaScript bundles
    legalComments: 'none',
    // Increase chunk size warning limit for library-heavy builds
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Obfuscate generated asset filenames
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        // Code-split heavy libraries via function-based manualChunks (Vite 8 / rolldown)
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('node_modules/react-dom') || normalizedId.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (normalizedId.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (normalizedId.includes('node_modules/pdfjs-dist')) {
            return 'vendor-pdf';
          }
          if (normalizedId.includes('node_modules/mammoth') || normalizedId.includes('node_modules/xlsx')) {
            return 'vendor-docs';
          }
          if (normalizedId.includes('node_modules/i18next') || normalizedId.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          if (normalizedId.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/vt-api': {
        target: 'https://www.virustotal.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vt-api/, ''),
      },
    },
  },
})
