import { createClient } from '@supabase/supabase-js'

if (typeof global === 'undefined') {
  globalThis.global = globalThis;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Pre-Supabase check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValue: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined',
  keyValue: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'undefined',
  globalExists: typeof global !== 'undefined',
  globalThisExists: typeof globalThis !== 'undefined',
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}


// Crear cliente con configuración completamente básica
let supabase: any = null;
let isUsingMock = false;

try {
  // Configuración mínima sin opciones adicionales
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully');
  console.log('🔗 Supabase URL:', supabaseUrl);
} catch (error) {
  console.error('❌ Error creating Supabase client:', error);
  console.log('🔄 Using mock client instead');
  isUsingMock = true;
  
  // Crear un cliente mock para desarrollo
  supabase = {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => ({ 
            data: null, 
            error: { message: 'Mock client - no real data' } 
          }) 
        }),
        gte: () => ({ lte: () => ({ order: () => ({ data: [], error: null }) }) })
      }),
      insert: () => ({ 
        select: () => ({ 
          single: () => ({ 
            data: { id: 'mock-id' }, 
            error: null 
          }) 
        }) 
      }),
      update: () => ({ 
        eq: () => ({ 
          data: null, 
          error: null 
        }) 
      }),
      delete: () => ({ 
        eq: () => ({ 
          data: null, 
          error: null 
        }) 
      })
    })
  };
}

// Exportar también el estado para debugging
export const isSupabaseMock = isUsingMock;

export { supabase }

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
