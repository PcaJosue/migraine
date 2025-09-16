import { supabase } from '@/shared/config/supabase'
import { MigraineEntry, CreateEntryDto, EntryFilterDto, Result } from '@/shared/types'
import { EntryRepositoryPort } from '@/application/ports/EntryRepositoryPort'

export class SupabaseEntryAdapter implements EntryRepositoryPort {
  async create(entryDto: CreateEntryDto): Promise<Result<string>> {
    try {
      const { data, error } = await supabase
        .from('migraine_entries')
        .insert(entryDto)
        .select('id')
        .single()

      if (error) {
        return {
          success: false,
          error: new Error(`Error al crear entrada: ${error.message}`)
        }
      }

      return {
        success: true,
        data: data.id
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al crear entrada')
      }
    }
  }

  async listByRange(filterDto: EntryFilterDto): Promise<Result<MigraineEntry[]>> {
    try {
      let query = supabase
        .from('migraine_entries')
        .select('*')
        .eq('username', filterDto.username)
        .gte('started_at', filterDto.from)
        .lte('started_at', filterDto.to)
        .order('started_at', { ascending: false })

      if (filterDto.min_intensity) {
        query = query.gte('intensity', filterDto.min_intensity)
      }

      if (filterDto.has_aura !== undefined) {
        query = query.eq('key_symptoms->aura', filterDto.has_aura)
      }

      if (filterDto.trigger_contains) {
        query = query.contains('triggers_quick', [filterDto.trigger_contains])
      }

      const { data, error } = await query

      if (error) {
        return {
          success: false,
          error: new Error(`Error al listar entradas: ${error.message}`)
        }
      }

      return {
        success: true,
        data: data as MigraineEntry[]
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al listar entradas')
      }
    }
  }

  async exportCsv(filterDto: EntryFilterDto): Promise<Result<Blob>> {
    try {
      const result = await this.listByRange(filterDto)
      
      if (!result.success) {
        return result
      }

      const entries = result.data
      const csvContent = this.generateCsv(entries)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      return {
        success: true,
        data: blob
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al exportar CSV')
      }
    }
  }

  async getById(id: string, username: string): Promise<Result<MigraineEntry>> {
    try {
      const { data, error } = await supabase
        .from('migraine_entries')
        .select('*')
        .eq('id', id)
        .eq('username', username)
        .single()

      if (error) {
        return {
          success: false,
          error: new Error(`Error al obtener entrada: ${error.message}`)
        }
      }

      return {
        success: true,
        data: data as MigraineEntry
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al obtener entrada')
      }
    }
  }

  async update(id: string, entryDto: Partial<CreateEntryDto>, username: string): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from('migraine_entries')
        .update(entryDto)
        .eq('id', id)
        .eq('username', username)

      if (error) {
        return {
          success: false,
          error: new Error(`Error al actualizar entrada: ${error.message}`)
        }
      }

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al actualizar entrada')
      }
    }
  }

  async delete(id: string, username: string): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from('migraine_entries')
        .delete()
        .eq('id', id)
        .eq('username', username)

      if (error) {
        return {
          success: false,
          error: new Error(`Error al eliminar entrada: ${error.message}`)
        }
      }

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al eliminar entrada')
      }
    }
  }

  private generateCsv(entries: MigraineEntry[]): string {
    const headers = [
      'ID', 'Fecha Inicio', 'Fecha Fin', 'Intensidad', 'Náusea', 'Fotofobia', 
      'Fonofobia', 'Aura', 'Última Comida', 'Descripción Comida', 'Triggers',
      'Medicamento', 'Dosis', 'Efectividad', 'Horas Sueño', 'Hidratación (ml)',
      'Ubicación Dolor', 'Tipo Dolor', 'Notas', 'Fecha Creación'
    ]

    const rows = entries.map(entry => [
      entry.id,
      entry.started_at,
      entry.ended_at || '',
      entry.intensity,
      entry.key_symptoms.nausea ? 'Sí' : 'No',
      entry.key_symptoms.photophobia ? 'Sí' : 'No',
      entry.key_symptoms.phonophobia ? 'Sí' : 'No',
      entry.key_symptoms.aura ? 'Sí' : 'No',
      entry.last_meal_at,
      entry.last_meal_desc || '',
      entry.triggers_quick?.join('; ') || '',
      entry.medication_quick?.name || '',
      entry.medication_quick?.dose || '',
      entry.medication_quick?.effectiveness || '',
      entry.sleep_hours || '',
      entry.hydration_ml || '',
      entry.pain_location?.join('; ') || '',
      entry.pain_type || '',
      entry.notes || '',
      entry.created_at
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  }
}
