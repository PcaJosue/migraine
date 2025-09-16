import { EntryFilterDto, Result } from '@/shared/types'
import { EntryRepositoryPort } from '../ports/EntryRepositoryPort'

export class ExportCsv {
  constructor(private entryRepository: EntryRepositoryPort) {}

  async execute(input: {
    username: string
    from: string
    to: string
    min_intensity?: number
    has_aura?: boolean
    trigger_contains?: string
    meal_gap_hours?: number
  }): Promise<Result<Blob>> {
    try {
      const filterDto: EntryFilterDto = {
        username: input.username,
        from: input.from,
        to: input.to,
        min_intensity: input.min_intensity,
        has_aura: input.has_aura,
        trigger_contains: input.trigger_contains,
        meal_gap_hours: input.meal_gap_hours
      }

      return await this.entryRepository.exportCsv(filterDto)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al exportar CSV')
      }
    }
  }
}
