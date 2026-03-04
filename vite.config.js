import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/',
  build: {
    // Enable source maps for better debugging
    sourcemap: false,
    // Use content-based hashing for cache busting
    rollupOptions: {
      output: {
        // Generate unique filenames based on content hash
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Code splitting for better performance
        manualChunks: {
          // Core React runtime — always needed
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Animation library — heavy, load separately
          motion: ['framer-motion'],
          // Icon library — smaller, separate from motion
          icons: ['lucide-react'],
          // Supabase client — lazy-loaded actions only
          supabase: ['@supabase/supabase-js'],
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      }
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
}))
