# 🗄️ Configuración de Supabase - AuraTrack

## ⚠️ Problema Resuelto

El error que experimentaste:
```
ERROR: 42704: data type text has no default operator class for access method "gin"
```

Se debe a que el índice GIN no puede crearse directamente en campos JSONB extraídos con `->>`. 

## ✅ Solución

### 1. Usar el Script Corregido

**NO uses** `scripts/setup-database.sql` (tiene el error)

**SÍ usa** `scripts/setup-database-fixed.sql` (corregido)

### 2. Pasos para Configurar Supabase

1. **Ve a tu proyecto en Supabase**
2. **Abre el SQL Editor**
3. **Copia y pega el contenido de `scripts/setup-database-fixed.sql`**
4. **Ejecuta el script**

### 3. Verificación

Después de ejecutar el script, deberías ver:
- ✅ Tablas creadas: `app_users` y `migraine_entries`
- ✅ Usuario de prueba: `testuser` / `test123`
- ✅ Índices básicos (sin errores GIN)
- ✅ Funciones SQL para estadísticas

### 4. Cambios Realizados

**Antes (problemático):**
```sql
CREATE INDEX ... USING GIN ((key_symptoms->>'aura'));
```

**Después (corregido):**
```sql
CREATE INDEX ... ON migraine_entries ((key_symptoms->>'aura'));
```

### 5. Índices Incluidos

- ✅ `idx_migraine_entries_username_started_at` - Para consultas por usuario y fecha
- ✅ `idx_migraine_entries_intensity` - Para filtros de intensidad
- ✅ `idx_migraine_entries_aura` - Para filtros de aura (sin GIN)

### 6. Funciones SQL

- ✅ `get_user_stats()` - Estadísticas del usuario
- ✅ `export_entries_csv()` - Exportación CSV

## 🚀 Próximos Pasos

1. **Ejecuta el script corregido en Supabase**
2. **Verifica que las tablas se crearon**
3. **Prueba la aplicación en `http://localhost:5173`**
4. **Usa las credenciales: `testuser` / `test123`**

## 🔧 Si Aún Tienes Problemas

### Error de Node.js
Si ves errores de versión de Node.js:
```bash
# El package.json ya está corregido con versiones compatibles
npm install
npm run dev
```

### Error de Variables de Entorno
Verifica que `supabase-config.env` tenga todas las credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
DATABASE_URL=postgresql://postgres:tu_password@db.tu-proyecto.supabase.co:5432/postgres
```

## 📞 Soporte

Si necesitas ayuda adicional:
1. Verifica que el script `setup-database-fixed.sql` se ejecutó sin errores
2. Confirma que las tablas aparecen en el Table Editor de Supabase
3. Prueba hacer login con `testuser` / `test123`

---

**¡La aplicación debería funcionar perfectamente después de ejecutar el script corregido!** 🎉
