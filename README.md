# AuraTrack - Diario de Migrañas MVP

Una aplicación moderna para registrar episodios de migraña en menos de 10 segundos y convertir datos clínicos mínimos en patrones accionables.

## 🚀 Características

- **Registro rápido**: Captura episodios en <10s con campos pre-rellenados
- **Análisis de patrones**: Insights automáticos sobre triggers y tendencias
- **Diseño responsive**: Optimizado para móvil con accesibilidad WCAG 2.2 AA
- **Exportación CSV**: Exporta datos para análisis médico
- **Arquitectura hexagonal**: Código mantenible y escalable

## 🛠️ Stack Tecnológico

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand + TanStack Query
- **Base de datos**: Supabase
- **Gráficos**: Recharts
- **Fechas**: date-fns

## 📋 Prerequisitos

- Node.js 18+
- Cuenta de Supabase
- Navegador moderno

## ⚡ Instalación Rápida

### 1. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script SQL en el SQL Editor:

```sql
-- Copia y pega el contenido de scripts/setup-database.sql
```

### 2. Configurar Variables de Entorno

1. Completa el archivo `supabase-config.env` con tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
DATABASE_URL=postgresql://postgres:tu_password@db.tu-proyecto.supabase.co:5432/postgres
```

### 3. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp supabase-config.env .env

# Ejecutar en desarrollo
npm run dev
```

## 🎯 Usuario de Prueba

- **Usuario**: `testuser`
- **Contraseña**: `test123`

## 📱 Funcionalidades

### Registro Rápido
- Intensidad (1-10) con slider
- Síntomas clave (náusea, fotofobia, fonofobia, aura)
- Última comida con opciones rápidas
- Triggers comunes
- Medicación opcional

### Dashboard
- KPIs de episodios (7 días)
- Intensidad promedio
- Frecuencia de aura
- Episodios recientes

### Lista de Episodios
- Filtros por fecha, intensidad, aura
- Exportación CSV
- Vista detallada de cada episodio

### Insights
- Triggers más frecuentes
- Intensidad por día de la semana
- Estadísticas de 30 días

## 🏗️ Arquitectura

```
src/
├── domain/           # Entidades y lógica de negocio
├── application/      # Casos de uso y puertos
├── infrastructure/   # Adaptadores (Supabase, etc.)
├── interface/        # UI y componentes React
└── shared/          # Utilidades y configuración
```

## 🎨 Design System

- **Colores**: Paleta clínica con azules y acentos
- **Tipografía**: Inter con escalas fluidas
- **Componentes**: shadcn/ui con customizaciones
- **Responsive**: Mobile-first con breakpoints optimizados

## 📊 Datos Clínicos

### Campos Imprescindibles
- Fecha/hora de inicio
- Intensidad (1-10)
- Síntomas clave
- Última comida

### Campos de Alto Valor
- Descripción de comida
- Triggers rápidos
- Medicación
- Estado (activo/terminado)

### Campos de Contexto
- Horas de sueño
- Hidratación
- Ubicación del dolor
- Tipo de dolor
- Notas

## 🔒 Seguridad

- Autenticación básica (MVP)
- Hash de contraseñas en cliente
- Validación de datos
- Sanitización de inputs

## 📈 Métricas de Rendimiento

- **First Interaction**: <1.5s (3G rápido)
- **TTI**: <2.5s
- **CLS**: <0.1
- **Registro p50**: <10s

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel
```

### Netlify

```bash
# Build
npm run build

# Desplegar carpeta dist/
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 📝 Roadmap

### Fase 1 (Actual)
- ✅ Registro rápido
- ✅ Lista de episodios
- ✅ Insights básicos
- ✅ Exportación CSV

### Fase 2
- [ ] PWA/offline
- [ ] Recordatorios locales
- [ ] Comparativas por períodos
- [ ] Autenticación completa

### Fase 3
- [ ] Análisis predictivo
- [ ] Integración con wearables
- [ ] Compartir con médicos
- [ ] Múltiples usuarios

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/aura-track/issues)
- **Documentación**: [Wiki](https://github.com/tu-usuario/aura-track/wiki)
- **Email**: soporte@auratrack.com

---

**AuraTrack** - Registra episodios en <10s y convierte datos clínicos en patrones accionables 🧠✨