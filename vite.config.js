import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import babel from 'vite-plugin-babel'; // Importa el plugin

export default defineConfig({
  plugins: [react(),
    babel()
  ],
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
    global: {},
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
  },
  build: {
    outDir: 'dist',
    // Agrega esto para el build de producción
    target: 'es2020'
  }
})