import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Use /mad-mathematics/ only for production build (GitHub Pages)
  // Use / for development server
  base: command === 'build' ? '/mad-mathematics/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Manual chunks for optimal code splitting
        manualChunks: {
          // Vendor libraries in separate chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'store': ['zustand'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Minification settings
    minify: 'esbuild',
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
}))
