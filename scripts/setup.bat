@echo off
REM AuraTrack Setup Script for Windows

echo 🚀 Configurando AuraTrack...

REM Instalar dependencias
echo 📦 Instalando dependencias...
npm install

REM Verificar que las variables de entorno estén configuradas
if not exist "supabase-config.env" (
    echo ❌ Error: Archivo supabase-config.env no encontrado
    echo Por favor, completa el archivo supabase-config.env con tus credenciales
    pause
    exit /b 1
)

REM Crear archivo .env para Vite
echo 🔧 Configurando variables de entorno para Vite...
copy supabase-config.env .env

echo ✅ Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Ejecuta el script SQL en Supabase: scripts/setup-database.sql
echo 2. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo
echo 3. Abre http://localhost:5173 en tu navegador
echo.
echo 🎯 Usuario de prueba: testuser / test123
pause
