import { CreateEntryDto, Result } from '@/shared/types'
import { EntryRepositoryPort } from '../ports/EntryRepositoryPort'
import { TelemetryPort } from '../ports/TelemetryPort'
import { ClockPort } from '../ports/ClockPort'

export class CreateQuickEntry {
  constructor(
    private entryRepository: EntryRepositoryPort,
    private telemetry: TelemetryPort,
    private clock: ClockPort
  ) {}

  async execute(input: {
    username: string
    started_at?: string
    intensity: number
    key_symptoms: {
      nausea: boolean
      photophobia: boolean
      phonophobia: boolean
      aura: boolean
    }
    last_meal_at: string
    last_meal_desc?: string
    triggers_quick?: string[]
    medication_quick?: {
      taken: boolean
      name?: string
      dose?: string
      taken_at?: string
      effectiveness?: number
    }
  }): Promise<Result<string>> {
    try {
      // Validar campos imprescindibles
      if (!input.username || !input.intensity || !input.key_symptoms || !input.last_meal_at) {
        return {
          success: false,
          error: new Error('Campos obligatorios faltantes')
        }
      }

      if (input.intensity < 1 || input.intensity > 10) {
        return {
          success: false,
          error: new Error('Intensidad debe estar entre 1 y 10')
        }
      }

      // Normalizar fechas a UTC
      const startedAt = input.started_at || this.clock.nowUtc()
      const lastMealAt = input.last_meal_at

      // Crear DTO
      const entryDto: CreateEntryDto = {
        username: input.username,
        started_at: startedAt,
        intensity: input.intensity,
        key_symptoms: input.key_symptoms,
        last_meal_at: lastMealAt,
        last_meal_desc: input.last_meal_desc || null,
        triggers_quick: input.triggers_quick || null,
        medication_quick: input.medication_quick ? {
          taken: input.medication_quick.taken,
          name: input.medication_quick.name || null,
          dose: input.medication_quick.dose || null,
          taken_at: input.medication_quick.taken_at || null,
          effectiveness: input.medication_quick.effectiveness || null
        } : null
      }

      // Llamar al repositorio
      const result = await this.entryRepository.create(entryDto)

      if (result.success) {
        // Emitir telemetría
        this.telemetry.track('entry_created', {
          username_hash: this.hashUsername(input.username),
          intensity: input.intensity,
          has_aura: input.key_symptoms.aura,
          triggers_count: input.triggers_quick?.length || 0,
          medication_taken: input.medication_quick?.taken || false
        })
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido')
      }
    }
  }

  private hashUsername(username: string): string {
    // Simple hash para telemetría (no PII)
    return btoa(username).slice(0, 8)
  }
}
