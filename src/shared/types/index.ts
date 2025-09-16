// Domain types based on path.json specifications

export interface MigraineEntry {
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

export interface UserLite {
  id: string
  username: string
  password_hash: string
  created_at: string
}

// Catalog types from path.json
export const TRIGGERS = [
  'café', 'alcohol', 'queso', 'chocolate', 'ayuno', 'estrés', 
  'falta_sueño', 'ruido', 'luz_bril', 'olor_intenso', 'cambio_clima', 'ejercicio_intenso'
] as const

export const SYMPTOMS_KEYS = [
  'nausea', 'photophobia', 'phonophobia', 'aura'
] as const

export const LOCATIONS = [
  'unilateral', 'bilateral', 'detrás_ojos', 'frontal', 'temporal', 'occipital', 'cuello'
] as const

export const PAIN_TYPES = [
  'pulsátil', 'punzante', 'presión', 'ardor'
] as const

export type TriggerType = typeof TRIGGERS[number]
export type SymptomType = typeof SYMPTOMS_KEYS[number]
export type LocationType = typeof LOCATIONS[number]
export type PainType = typeof PAIN_TYPES[number]

// DTOs for application layer
export interface CreateEntryDto {
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
}

export interface EntryFilterDto {
  username: string
  from: string
  to: string
  min_intensity?: number
  has_aura?: boolean
  trigger_contains?: string
  meal_gap_hours?: number
}

// Result type for error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }
