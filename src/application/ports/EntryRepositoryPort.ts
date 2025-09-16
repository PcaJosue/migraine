import { MigraineEntry, CreateEntryDto, EntryFilterDto, Result } from '@/shared/types'

export interface EntryRepositoryPort {
  create(entryDto: CreateEntryDto): Promise<Result<string>>
  listByRange(filterDto: EntryFilterDto): Promise<Result<MigraineEntry[]>>
  exportCsv(filterDto: EntryFilterDto): Promise<Result<Blob>>
  getById(id: string, username: string): Promise<Result<MigraineEntry>>
  update(id: string, entryDto: Partial<CreateEntryDto>, username: string): Promise<Result<void>>
  delete(id: string, username: string): Promise<Result<void>>
}
