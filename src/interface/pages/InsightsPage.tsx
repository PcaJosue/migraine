import { useState } from 'react'
import { useEntries } from '@/shared/hooks/useEntries'
import { Card, CardContent, CardHeader, CardTitle } from '@/interface/components/ui/Card'
import { Button } from '@/interface/components/ui/Button'
import { Tooltip } from '@/interface/components/ui/Tooltip'
import { BarChart3, TrendingUp, Activity, Eye, Download } from 'lucide-react'
import { now, subtractHours } from '@/shared/utils/date'

export function InsightsPage() {
  // Obtener datos de los últimos 30 días - FIJAR las fechas para evitar loop infinito
  const [thirtyDaysAgo, setThirtyDaysAgo] = useState(() => subtractHours(now(), 30 * 24))
  const [currentTime, setCurrentTime] = useState(() => now())
  
  const { data: entries, isLoading } = useEntries({
    from: thirtyDaysAgo,
    to: currentTime
  })

  // Calcular estadísticas
  const stats = {
    totalEpisodes: entries?.length || 0,
    avgIntensity: entries?.length 
      ? Math.round(entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length * 10) / 10
      : 0,
    auraRate: entries?.length
      ? Math.round((entries.filter(entry => entry.key_symptoms.aura).length / entries.length) * 100)
      : 0,
    topTriggers: entries?.reduce((acc, entry) => {
      if (entry.triggers_quick) {
        entry.triggers_quick.forEach(trigger => {
          acc[trigger] = (acc[trigger] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>) || {}
  }

  const topTriggers = Object.entries(stats.topTriggers)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Insights</h1>
          <p className="text-caption text-muted-foreground mt-1">
            Análisis de tus patrones de migraña
          </p>
        </div>
        <Tooltip content="Descargar datos de insights en formato CSV">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar datos
          </Button>
        </Tooltip>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total episodios</CardTitle>
            <Tooltip content="Número total de episodios registrados">
              <Activity className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEpisodes}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intensidad promedio</CardTitle>
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
            <CardTitle className="text-sm font-medium">Frecuencia de aura</CardTitle>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días con episodios</CardTitle>
            <Tooltip content="Número de días únicos con episodios registrados">
              <BarChart3 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entries ? new Set(entries.map(e => e.started_at.split('T')[0])).size : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Días únicos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Triggers */}
      <Card>
        <CardHeader>
          <CardTitle>Triggers más frecuentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : topTriggers.length > 0 ? (
            <div className="space-y-3">
              {topTriggers.map(([trigger, count]) => (
                <div key={trigger} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trigger}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...topTriggers.map(([,c]) => c))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin datos suficientes</h3>
              <p className="text-muted-foreground">
                Registra más episodios para ver insights
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intensidad por día */}
      <Card>
        <CardHeader>
          <CardTitle>Intensidad promedio por día</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
          ) : entries && entries.length > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-1 relative">
              {/* Escala vertical */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground pr-2">
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>
              
              {/* Líneas de referencia horizontales */}
              <div className="absolute left-8 right-0 top-0 h-full">
                {[0, 2, 4, 6, 8, 10].map((value) => (
                  <div 
                    key={value}
                    className="absolute w-full border-t border-neutral-200 dark:border-neutral-700"
                    style={{ top: `${((10 - value) / 10) * 100}%` }}
                  />
                ))}
              </div>

              {/* Gráfico de barras */}
              <div className="flex items-end justify-between space-x-1 ml-12 w-full">
                {Array.from({ length: 7 }, (_, i) => {
                  const dayEntries = entries.filter(entry => {
                    const day = new Date(entry.started_at).getDay()
                    return day === i
                  })
                  const avgIntensity = dayEntries.length > 0 
                    ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
                    : 0
                  
                  return (
                    <div key={i} className="flex flex-col items-center space-y-2 relative group">
                      {/* Barra */}
                      <div 
                        className="w-8 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                        style={{ height: `${(avgIntensity / 10) * 200}px` }}
                      ></div>
                      
                      {/* Tooltip con valor */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {avgIntensity > 0 ? `${avgIntensity.toFixed(1)}/10` : 'Sin datos'}
                      </div>
                      
                      {/* Día de la semana */}
                      <span className="text-xs text-muted-foreground">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin datos</h3>
              <p className="text-muted-foreground">
                Registra episodios para ver el gráfico
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
