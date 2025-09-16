-- AuraTrack Database Setup
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear tabla de usuarios (MVP sin Supabase Auth)
CREATE TABLE IF NOT EXISTS app_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de entradas de migraña
CREATE TABLE IF NOT EXISTS migraine_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL REFERENCES app_users(username),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    intensity INT2 CHECK (intensity BETWEEN 1 AND 10) NOT NULL,
    key_symptoms JSONB NOT NULL DEFAULT '{"nausea": false, "photophobia": false, "phonophobia": false, "aura": false}',
    last_meal_at TIMESTAMPTZ NOT NULL,
    last_meal_desc TEXT,
    triggers_quick TEXT[],
    medication_quick JSONB,
    sleep_hours NUMERIC(4,2),
    hydration_ml INT4,
    pain_location TEXT[],
    pain_type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_migraine_entries_username_started_at 
ON migraine_entries (username, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_migraine_entries_triggers_gin 
ON migraine_entries USING GIN (triggers_quick);

CREATE INDEX IF NOT EXISTS idx_migraine_entries_intensity 
ON migraine_entries (intensity);

CREATE INDEX IF NOT EXISTS idx_migraine_entries_key_symptoms_aura 
ON migraine_entries ((key_symptoms->>'aura'));

-- Insertar usuario de prueba (opcional)
-- Contraseña: "test123" (hash simple para MVP)
INSERT INTO app_users (username, password_hash) 
VALUES ('testuser', 'test123')
ON CONFLICT (username) DO NOTHING;

-- Función para obtener estadísticas básicas
CREATE OR REPLACE FUNCTION get_user_stats(p_username TEXT, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_episodes BIGINT,
    avg_intensity NUMERIC,
    aura_percentage NUMERIC,
    top_triggers TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_episodes,
        ROUND(AVG(intensity), 2) as avg_intensity,
        ROUND(
            (COUNT(*) FILTER (WHERE (key_symptoms->>'aura')::boolean = true) * 100.0 / COUNT(*)), 
            1
        ) as aura_percentage,
        ARRAY(
            SELECT trigger_item
            FROM (
                SELECT unnest(triggers_quick) as trigger_item, COUNT(*) as trigger_count
                FROM migraine_entries 
                WHERE username = p_username 
                AND started_at >= NOW() - INTERVAL '1 day' * p_days
                AND triggers_quick IS NOT NULL
                GROUP BY trigger_item
                ORDER BY trigger_count DESC
                LIMIT 5
            ) top_triggers
        ) as top_triggers
    FROM migraine_entries 
    WHERE username = p_username 
    AND started_at >= NOW() - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql;

-- Función para exportar datos en formato CSV
CREATE OR REPLACE FUNCTION export_entries_csv(
    p_username TEXT,
    p_from_date TIMESTAMPTZ,
    p_to_date TIMESTAMPTZ,
    p_min_intensity INTEGER DEFAULT 1
)
RETURNS TEXT AS $$
DECLARE
    csv_content TEXT := '';
    entry_record RECORD;
BEGIN
    -- Headers
    csv_content := 'ID,Fecha Inicio,Fecha Fin,Intensidad,Náusea,Fotofobia,Fonofobia,Aura,Última Comida,Descripción Comida,Triggers,Medicamento,Dosis,Efectividad,Horas Sueño,Hidratación (ml),Ubicación Dolor,Tipo Dolor,Notas,Fecha Creación' || E'\n';
    
    -- Data rows
    FOR entry_record IN
        SELECT *
        FROM migraine_entries
        WHERE username = p_username
        AND started_at BETWEEN p_from_date AND p_to_date
        AND intensity >= p_min_intensity
        ORDER BY started_at DESC
    LOOP
        csv_content := csv_content || 
            '"' || entry_record.id || '",' ||
            '"' || entry_record.started_at || '",' ||
            '"' || COALESCE(entry_record.ended_at::TEXT, '') || '",' ||
            entry_record.intensity || ',' ||
            '"' || CASE WHEN (entry_record.key_symptoms->>'nausea')::boolean THEN 'Sí' ELSE 'No' END || '",' ||
            '"' || CASE WHEN (entry_record.key_symptoms->>'photophobia')::boolean THEN 'Sí' ELSE 'No' END || '",' ||
            '"' || CASE WHEN (entry_record.key_symptoms->>'phonophobia')::boolean THEN 'Sí' ELSE 'No' END || '",' ||
            '"' || CASE WHEN (entry_record.key_symptoms->>'aura')::boolean THEN 'Sí' ELSE 'No' END || '",' ||
            '"' || entry_record.last_meal_at || '",' ||
            '"' || COALESCE(entry_record.last_meal_desc, '') || '",' ||
            '"' || COALESCE(array_to_string(entry_record.triggers_quick, '; '), '') || '",' ||
            '"' || COALESCE(entry_record.medication_quick->>'name', '') || '",' ||
            '"' || COALESCE(entry_record.medication_quick->>'dose', '') || '",' ||
            '"' || COALESCE(entry_record.medication_quick->>'effectiveness', '') || '",' ||
            '"' || COALESCE(entry_record.sleep_hours::TEXT, '') || '",' ||
            '"' || COALESCE(entry_record.hydration_ml::TEXT, '') || '",' ||
            '"' || COALESCE(array_to_string(entry_record.pain_location, '; '), '') || '",' ||
            '"' || COALESCE(entry_record.pain_type, '') || '",' ||
            '"' || COALESCE(entry_record.notes, '') || '",' ||
            '"' || entry_record.created_at || '"' || E'\n';
    END LOOP;
    
    RETURN csv_content;
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE app_users IS 'Usuarios del sistema (MVP sin Supabase Auth)';
COMMENT ON TABLE migraine_entries IS 'Registros de episodios de migraña';
COMMENT ON FUNCTION get_user_stats IS 'Obtiene estadísticas básicas del usuario';
COMMENT ON FUNCTION export_entries_csv IS 'Exporta entradas en formato CSV';
