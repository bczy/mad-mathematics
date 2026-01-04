import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
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
})
