import { JSONBinEntryAdapter } from '@/infrastructure/adapters/JSONBinEntryAdapter'
import { JSONBinAuthAdapter } from '@/infrastructure/adapters/JSONBinAuthAdapter'
import { ClockAdapter } from '@/infrastructure/adapters/ClockAdapter'
import { TelemetryAdapter } from '@/infrastructure/adapters/TelemetryAdapter'
import { CreateQuickEntry } from '@/application/use-cases/CreateQuickEntry'
import { ListEntries } from '@/application/use-cases/ListEntries'
import { ExportCsv } from '@/application/use-cases/ExportCsv'

// Infrastructure adapters - Usar JSONBin.io para persistencia
const entryRepository = new JSONBinEntryAdapter()
const authAdapter = new JSONBinAuthAdapter()
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
