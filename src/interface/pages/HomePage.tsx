import { useState } from 'react'
import { useUIStore } from '@/interface/state/uiStore'
import { useEntries } from '@/shared/hooks/useEntries'
import { Card, CardContent, CardHeader, CardTitle } from '@/interface/components/ui/Card'
import { Button } from '@/interface/components/ui/Button'
import { Tooltip } from '@/interface/components/ui/Tooltip'
import { EditEntryModal } from '@/interface/components/EditEntryModal'
import { Plus, TrendingUp, Activity, Eye } from 'lucide-react'
import { formatDate, now, subtractHours } from '@/shared/utils/date'
import { MigraineEntry } from '@/shared/types'

export function HomePage() {
  const { openQuickEntry } = useUIStore()
  
  // Obtener datos de los últimos 7 días - FIJAR las fechas para evitar loop infinito
  const [sevenDaysAgo, setSevenDaysAgo] = useState(() => subtractHours(now(), 7 * 24))
  const [currentTime, setCurrentTime] = useState(() => now())
  
  // Estado para el modal de edición
  const [editingEntry, setEditingEntry] = useState<MigraineEntry | null>(null)
  
  const { data: entries, isLoading } = useEntries({
    from: sevenDaysAgo,
    to: currentTime
  })

  // Calcular estadísticas
  const stats = {
    episodes7d: entries?.length || 0,
    avgIntensity: entries?.length 
      ? Math.round(entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length * 10) / 10
      : 0,
    auraRate: entries?.length
      ? Math.round((entries.filter(entry => entry.key_symptoms.aura).length / entries.length) * 100)
      : 0
  }

  const quickTips = [
    'Hidrátate regularmente',
    'Evita pantallas brillantes',
    'Respira 4-7-8 para relajarte'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Inicio</h1>
          <p className="text-caption text-muted-foreground mt-1">
            Resumen de tus episodios recientes
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={openQuickEntry}
          className="hidden sm:flex"
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar ahora
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Episodios (7d)</CardTitle>
            <Tooltip content="Número de episodios en los últimos 7 días">
              <Activity className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.episodes7d}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intensidad media</CardTitle>
            <Tooltip content="Intensidad promedio de dolor en escala 1-10">
              <TrendingUp className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgIntensity}/10</div>
            <p className="text-xs text-muted-foreground">
              Promedio de intensidad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aura %</CardTitle>
            <Tooltip content="Porcentaje de episodios con síntomas de aura">
              <Eye className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auraRate}%</div>
            <p className="text-xs text-muted-foreground">
              Con aura visual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Episodios recientes</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Haz clic en un episodio para editarlo
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  onClick={() => setEditingEntry(entry)}
                >
                  <div>
                    <div className="font-medium">
                      {formatDate(entry.started_at, 'dd/MM HH:mm')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Intensidad: {entry.intensity}/10
                      {entry.key_symptoms.aura && ' • Aura'}
                      {entry.key_symptoms.nausea && ' • Náusea'}
                      {entry.key_symptoms.photophobia && ' • Fotofobia'}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.intensity <= 3 
                      ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                      : entry.intensity <= 6
                      ? 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300'
                      : 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300'
                  }`}>
                    {entry.intensity}/10
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin registros</h3>
              <p className="text-muted-foreground mb-4">
                Empieza registrando tu primer episodio
              </p>
              <Button variant="gradient" onClick={openQuickEntry}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar ahora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Consejos rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
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
