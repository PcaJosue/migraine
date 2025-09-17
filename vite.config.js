import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default ({ mode }) => {
  // Carga las variables desde el .env correcto según el modo
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  console.log('Loaded env variables:', env) // <- revisa que aparezcan aquí

  return defineConfig({
    plugins: [react()],
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
      // Opcional: inyecta variables globales si quieres usarlas sin import.meta.env
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME),
    }
  })
}
