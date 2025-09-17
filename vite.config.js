import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Agrega esto para protocolos específicos
      protocolImports: true,
    })
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
    global: 'window',
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