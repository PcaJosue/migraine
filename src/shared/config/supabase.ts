import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crear cliente de Supabase solo si las variables están disponibles
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Evitar problemas de persistencia en SSR
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null

// Función helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey
}

// Database types
export interface Database {
  public: {
    Tables: {
      app_users: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          created_at?: string
        }
      }
      migraine_entries: {
        Row: {
          id: string
          username: string
          started_at: string
          ended_at: string | null
          intensity: number
          key_symptoms: {
            nausea: boolean
            photophobia: boolean
            phonophobia: boolean
            aura: boolean
          }
          last_meal_at: string
          last_meal_desc: string | null
          triggers_quick: string[] | null
          medication_quick: {
            taken: boolean
            name: string | null
            dose: string | null
            taken_at: string | null
            effectiveness: number | null
          } | null
          sleep_hours: number | null
          hydration_ml: number | null
          pain_location: string[] | null
          pain_type: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          started_at: string
          ended_at?: string | null
          intensity: number
          key_symptoms: {
            nausea: boolean
            photophobia: boolean
            phonophobia: boolean
            aura: boolean
          }
          last_meal_at: string
          last_meal_desc?: string | null
          triggers_quick?: string[] | null
          medication_quick?: {
            taken: boolean
            name: string | null
            dose: string | null
            taken_at: string | null
            effectiveness: number | null
          } | null
          sleep_hours?: number | null
          hydration_ml?: number | null
          pain_location?: string[] | null
          pain_type?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          started_at?: string
          ended_at?: string | null
          intensity?: number
          key_symptoms?: {
            nausea: boolean
            photophobia: boolean
            phonophobia: boolean
            aura: boolean
          }
          last_meal_at?: string
          last_meal_desc?: string | null
          triggers_quick?: string[] | null
          medication_quick?: {
            taken: boolean
            name: string | null
            dose: string | null
            taken_at: string | null
            effectiveness: number | null
          } | null
          sleep_hours?: number | null
          hydration_ml?: number | null
          pain_location?: string[] | null
          pain_type?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
