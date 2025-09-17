import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import babel from 'vite-plugin-babel'

export default defineConfig({
  plugins: [react(), babel()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/domain": path.resolve(__dirname, "./src/domain"),
      "@/application": path.resolve(__dirname, "./src/application"),
      "@/infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@/interface": path.resolve(__dirname, "./src/interface"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
})