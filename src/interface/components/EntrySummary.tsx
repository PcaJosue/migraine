import { MigraineEntry } from '@/shared/types'
import { formatDate } from '@/shared/utils/date'
import { 
  Clock, 
  Zap, 
  Eye, 
  Volume2, 
  Sun, 
  Moon, 
  Utensils, 
  Pill, 
  Droplets, 
  MapPin, 
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface EntrySummaryProps {
  entry: MigraineEntry
  onClick?: () => void
}

export function EntrySummary({ entry, onClick }: EntrySummaryProps) {
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (intensity <= 6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getIntensityIcon = (intensity: number) => {
    if (intensity <= 3) return <CheckCircle className="w-4 h-4" />
    if (intensity <= 6) return <AlertTriangle className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  const formatDuration = (startedAt: string, endedAt: string | null) => {
    if (!endedAt) return 'En curso'
    
    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  return (
    <div 
      className="p-4 rounded-lg border bg-card cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      onClick={onClick}
    >
      {/* Header con fecha y duración */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="font-medium">
              {formatDate(entry.started_at, 'dd/MM/yyyy HH:mm')}
            </span>
          </div>
          {entry.ended_at && (
            <div className="flex items-center space-x-1 text-sm text-neutral-500">
              <span>•</span>
              <span>Duración: {formatDuration(entry.started_at, entry.ended_at)}</span>
            </div>
          )}
        </div>
        
        {/* Intensidad */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getIntensityColor(entry.intensity)}`}>
          {getIntensityIcon(entry.intensity)}
          <span>{entry.intensity}/10</span>
        </div>
      </div>

      {/* Síntomas clave */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {entry.key_symptoms.aura && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full text-xs">
              <Zap className="w-3 h-3" />
              <span>Aura</span>
            </div>
          )}
          {entry.key_symptoms.nausea && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>Náusea</span>
            </div>
          )}
          {entry.key_symptoms.photophobia && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs">
              <Sun className="w-3 h-3" />
              <span>Fotofobia</span>
            </div>
          )}
          {entry.key_symptoms.phonophobia && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs">
              <Volume2 className="w-3 h-3" />
              <span>Fonofobia</span>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional en grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {/* Última comida */}
        {entry.last_meal_desc && (
          <div className="flex items-start space-x-2">
            <Utensils className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Última comida:</span>
              <div className="font-medium">{entry.last_meal_desc}</div>
              <div className="text-xs text-neutral-500">
                {formatDate(entry.last_meal_at, 'dd/MM HH:mm')}
              </div>
            </div>
          </div>
        )}

        {/* Triggers */}
        {entry.triggers_quick && entry.triggers_quick.length > 0 && (
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Triggers:</span>
              <div className="font-medium">{entry.triggers_quick.join(', ')}</div>
            </div>
          </div>
        )}

        {/* Medicación */}
        {entry.medication_quick?.taken && entry.medication_quick.name && (
          <div className="flex items-start space-x-2">
            <Pill className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Medicación:</span>
              <div className="font-medium">
                {entry.medication_quick.name} {entry.medication_quick.dose}
              </div>
              {entry.medication_quick.taken_at && (
                <div className="text-xs text-neutral-500">
                  {formatDate(entry.medication_quick.taken_at, 'dd/MM HH:mm')}
                </div>
              )}
              {entry.medication_quick.effectiveness && (
                <div className="text-xs text-neutral-500">
                  Efectividad: {entry.medication_quick.effectiveness}/10
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sueño */}
        {entry.sleep_hours && (
          <div className="flex items-start space-x-2">
            <Moon className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Sueño:</span>
              <div className="font-medium">{entry.sleep_hours}h</div>
            </div>
          </div>
        )}

        {/* Hidratación */}
        {entry.hydration_ml && (
          <div className="flex items-start space-x-2">
            <Droplets className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Hidratación:</span>
              <div className="font-medium">{entry.hydration_ml}ml</div>
            </div>
          </div>
        )}

        {/* Ubicación del dolor */}
        {entry.pain_location && entry.pain_location.length > 0 && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Dolor en:</span>
              <div className="font-medium">{entry.pain_location.join(', ')}</div>
            </div>
          </div>
        )}

        {/* Tipo de dolor */}
        {entry.pain_type && (
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400">Tipo de dolor:</span>
              <div className="font-medium">{entry.pain_type}</div>
            </div>
          </div>
        )}
      </div>

      {/* Notas */}
      {entry.notes && (
        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-neutral-600 dark:text-neutral-400 text-sm">Notas:</span>
              <div className="text-sm mt-1">{entry.notes}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
