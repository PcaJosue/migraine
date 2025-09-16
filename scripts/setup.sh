#!/bin/bash

# AuraTrack Setup Script
echo "🚀 Configurando AuraTrack..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar que las variables de entorno estén configuradas
if [ ! -f "supabase-config.env" ]; then
    echo "❌ Error: Archivo supabase-config.env no encontrado"
    echo "Por favor, completa el archivo supabase-config.env con tus credenciales"
    exit 1
fi

# Verificar variables de entorno
source supabase-config.env

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Variables de entorno de Supabase no configuradas"
    echo "Por favor, completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en supabase-config.env"
    exit 1
fi

echo "✅ Variables de entorno configuradas"

# Crear archivo .env para Vite
echo "🔧 Configurando variables de entorno para Vite..."
cp supabase-config.env .env

echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta el script SQL en Supabase: scripts/setup-database.sql"
echo "2. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo"
echo "3. Abre http://localhost:5173 en tu navegador"
echo ""
echo "🎯 Usuario de prueba: testuser / test123"
