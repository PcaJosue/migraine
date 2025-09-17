import { jsonbinClient } from '@/shared/config/jsonbin'
import { MigraineEntry, CreateEntryDto, EntryFilterDto, Result } from '@/shared/types'
import { EntryRepositoryPort } from '@/application/ports/EntryRepositoryPort'

export class JSONBinEntryAdapter implements EntryRepositoryPort {
  async create(entryDto: CreateEntryDto): Promise<Result<string>> {
    try {
      const entries = await jsonbinClient.getMigraineEntries()
      
      // Generar ID único
      const id = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newEntry: MigraineEntry = {
        ...entryDto,
        id,
        created_at: new Date().toISOString()
      }

      entries.push(newEntry)
      
      const success = await jsonbinClient.updateMigraineEntries(entries)
      
      if (!success) {
        return {
          success: false,
          error: new Error('Error al guardar en JSONBin.io')
        }
      }

      return {
        success: true,
        data: id
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al crear entrada')
      }
    }
  }

  async listByRange(filterDto: EntryFilterDto): Promise<Result<MigraineEntry[]>> {
    try {
      const entries = await jsonbinClient.getMigraineEntries()
      
      // Filtrar entradas
      let filtered = entries.filter((entry: MigraineEntry) => {
        // Filtrar por usuario
        if (entry.username !== filterDto.username) return false
        
        // Filtrar por fecha
        if (filterDto.from && new Date(entry.started_at) < new Date(filterDto.from)) return false
        if (filterDto.to && new Date(entry.started_at) > new Date(filterDto.to)) return false
        
        // Filtrar por intensidad mínima
        if (filterDto.min_intensity && entry.intensity < filterDto.min_intensity) return false
        
        // Filtrar por aura
        if (filterDto.has_aura !== undefined && entry.key_symptoms.aura !== filterDto.has_aura) return false
        
        // Filtrar por trigger
        if (filterDto.trigger_contains) {
          const hasTrigger = entry.triggers_quick?.some(trigger => 
            trigger.toLowerCase().includes(filterDto.trigger_contains!.toLowerCase())
          )
          if (!hasTrigger) return false
        }
        
        return true
      })

      // Ordenar por fecha de inicio (más reciente primero)
      filtered.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())

      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al listar entradas')
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
      const entries = await jsonbinClient.getMigraineEntries()
      const entry = entries.find((e: MigraineEntry) => e.id === id && e.username === username)
      
      if (!entry) {
        return {
          success: false,
          error: new Error('Entrada no encontrada')
        }
      }

      return {
        success: true,
        data: entry
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al obtener entrada')
      }
    }
  }

  async update(id: string, entryDto: Partial<CreateEntryDto>, username: string): Promise<Result<void>> {
    try {
      const entries = await jsonbinClient.getMigraineEntries()
      const index = entries.findIndex((e: MigraineEntry) => e.id === id && e.username === username)
      
      if (index === -1) {
        return {
          success: false,
          error: new Error('Entrada no encontrada')
        }
      }

      // Actualizar entrada
      entries[index] = {
        ...entries[index],
        ...entryDto,
        updated_at: new Date().toISOString()
      }

      const success = await jsonbinClient.updateMigraineEntries(entries)
      
      if (!success) {
        return {
          success: false,
          error: new Error('Error al actualizar en JSONBin.io')
        }
      }

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al actualizar entrada')
      }
    }
  }

  async delete(id: string, username: string): Promise<Result<void>> {
    try {
      const entries = await jsonbinClient.getMigraineEntries()
      const filtered = entries.filter((e: MigraineEntry) => !(e.id === id && e.username === username))
      
      if (filtered.length === entries.length) {
        return {
          success: false,
          error: new Error('Entrada no encontrada')
        }
      }

      const success = await jsonbinClient.updateMigraineEntries(filtered)
      
      if (!success) {
        return {
          success: false,
          error: new Error('Error al eliminar en JSONBin.io')
        }
      }

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al eliminar entrada')
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
