import { SupabaseEntryAdapter } from '@/infrastructure/adapters/SupabaseEntryAdapter'
import { SupabaseAuthAdapter } from '@/infrastructure/adapters/SupabaseAuthAdapter'
import { ClockAdapter } from '@/infrastructure/adapters/ClockAdapter'
import { TelemetryAdapter } from '@/infrastructure/adapters/TelemetryAdapter'
import { CreateQuickEntry } from '@/application/use-cases/CreateQuickEntry'
import { ListEntries } from '@/application/use-cases/ListEntries'
import { ExportCsv } from '@/application/use-cases/ExportCsv'

// Infrastructure adapters
const entryRepository = new SupabaseEntryAdapter()
const authAdapter = new SupabaseAuthAdapter()
const clockAdapter = new ClockAdapter()
const telemetryAdapter = new TelemetryAdapter()

// Use cases
export const createQuickEntry = new CreateQuickEntry(
  entryRepository,
  telemetryAdapter,
  clockAdapter
)

export const listEntries = new ListEntries(entryRepository)

export const exportCsv = new ExportCsv(entryRepository)

// Export adapters for direct use if needed
export { entryRepository, authAdapter, clockAdapter, telemetryAdapter }
