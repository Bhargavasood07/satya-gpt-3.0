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
    rollupOptions: {
      output: {
        // Obfuscate generated asset filenames
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
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
