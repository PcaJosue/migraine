import { useState } from 'react'
import { useEntries, useExportCsv } from '@/shared/hooks/useEntries'
import { Card, CardContent, CardHeader, CardTitle } from '@/interface/components/ui/Card'
import { Button } from '@/interface/components/ui/Button'
import { Input } from '@/interface/components/ui/Input'
import { Tooltip } from '@/interface/components/ui/Tooltip'
import { EditEntryModal } from '@/interface/components/EditEntryModal'
import { Download, Filter, Calendar } from 'lucide-react'
import { formatDate } from '@/shared/utils/date'
import { now, subtractHours } from '@/shared/utils/date'
import { MigraineEntry } from '@/shared/types'
import '@/interface/components/ui/DateTimeInput.css'

export function EntriesPage() {
  const [filters, setFilters] = useState({
    from: subtractHours(now(), 30 * 24), // 30 días atrás
    to: now(),
    min_intensity: 1,
    has_aura: undefined as boolean | undefined,
    trigger_contains: '',
    meal_gap_hours: undefined as number | undefined
  })

  // Estado para el modal de edición
  const [editingEntry, setEditingEntry] = useState<MigraineEntry | null>(null)

  const { data: entries, isLoading } = useEntries(filters)
  const exportCsv = useExportCsv()

  const handleExport = () => {
    exportCsv.mutate(filters)
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
    if (intensity <= 6) return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300'
    return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Episodios</h1>
          <p className="text-caption text-muted-foreground mt-1">
            Historial de tus episodios de migraña
          </p>
        </div>
        <Tooltip content="Descargar todos los episodios filtrados en formato CSV">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportCsv.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </Tooltip>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Desde</label>
              <Input
                type="datetime-local"
                value={filters.from.slice(0, 16)}
                onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value + ':00.000Z' }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hasta</label>
              <Input
                type="datetime-local"
                value={filters.to.slice(0, 16)}
                onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value + ':00.000Z' }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Intensidad mínima</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={filters.min_intensity}
                onChange={(e) => setFilters(prev => ({ ...prev, min_intensity: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Con aura</label>
              <select
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm"
                value={filters.has_aura === undefined ? '' : filters.has_aura.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  has_aura: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de episodios */}
      <Card>
        <CardHeader>
          <CardTitle>
            {entries?.length || 0} episodios encontrados
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Haz clic en un episodio para editarlo
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-4 rounded-lg border bg-card cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() => setEditingEntry(entry)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-medium">
                        {formatDate(entry.started_at, 'dd/MM/yyyy HH:mm')}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(entry.intensity)}`}>
                        {entry.intensity}/10
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {entry.key_symptoms.aura && (
                        <span className="px-2 py-1 bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300 rounded-full text-xs">
                          Aura
                        </span>
                      )}
                      {entry.key_symptoms.nausea && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 rounded-full text-xs">
                          Náusea
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    {entry.last_meal_desc && (
                      <div>Última comida: {entry.last_meal_desc}</div>
                    )}
                    {entry.triggers_quick && entry.triggers_quick.length > 0 && (
                      <div>Triggers: {entry.triggers_quick.join(', ')}</div>
                    )}
                    {entry.medication_quick?.taken && entry.medication_quick.name && (
                      <div>Medicación: {entry.medication_quick.name} {entry.medication_quick.dose}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin episodios</h3>
              <p className="text-muted-foreground">
                No se encontraron episodios con los filtros seleccionados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de edición */}
      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  )
}
