import { useState, useEffect, useRef } from 'react'
import { useUpdateEntry } from '@/shared/hooks/useEntries'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { X, Clock, Utensils, Pill } from 'lucide-react'
import { TRIGGERS, SYMPTOMS_KEYS } from '@/shared/types'
import { formatDate, now, subtractHours } from '@/shared/utils/date'
import { MigraineEntry } from '@/shared/types'

interface EditEntryModalProps {
  entry: MigraineEntry
  onClose: () => void
}

export function EditEntryModal({ entry, onClose }: EditEntryModalProps) {
  const updateEntry = useUpdateEntry()
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])
  
  const mealTimeOptions = [
    { label: 'Hace 1h', value: '1h' },
    { label: 'Hace 2h', value: '2h' },
    { label: 'Hace 3h', value: '3h' },
    { label: 'Hace 4h+', value: '4h+' }
  ]

  const getMealTimeValue = (option: string) => {
    switch (option) {
      case '1h': return subtractHours(now(), 1)
      case '2h': return subtractHours(now(), 2)
      case '3h': return subtractHours(now(), 3)
      case '4h+': return subtractHours(now(), 4)
      default: return option
    }
  }

  const getMealTimeOption = (dateValue: string) => {
    const date = new Date(dateValue)
    const nowDate = new Date(now())
    const diffHours = Math.floor((nowDate.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours <= 1) return '1h'
    if (diffHours <= 2) return '2h'
    if (diffHours <= 3) return '3h'
    return '4h+'
  }

  const [formData, setFormData] = useState({
    intensity: entry.intensity,
    started_at: entry.started_at,
    ended_at: entry.ended_at || '',
    key_symptoms: entry.key_symptoms,
    last_meal_at: entry.last_meal_at,
    last_meal_desc: entry.last_meal_desc || '',
    triggers_quick: entry.triggers_quick || [],
    medication_quick: entry.medication_quick || {
      taken: false,
      name: '',
      dose: '',
      taken_at: now(),
      effectiveness: 0
    },
    sleep_hours: entry.sleep_hours || '',
    hydration_ml: entry.hydration_ml || '',
    pain_location: entry.pain_location || [],
    pain_type: entry.pain_type || '',
    notes: entry.notes || ''
  })

  // Estado para la opción seleccionada de comida
  const [selectedMealOption, setSelectedMealOption] = useState(() => 
    getMealTimeOption(entry.last_meal_at)
  )

  const [showMedication, setShowMedication] = useState(!!entry.medication_quick?.taken)

  const toggleSymptom = (symptom: keyof typeof formData.key_symptoms) => {
    setFormData(prev => ({
      ...prev,
      key_symptoms: {
        ...prev.key_symptoms,
        [symptom]: !prev.key_symptoms[symptom]
      }
    }))
  }

  const toggleTrigger = (trigger: string) => {
    setFormData(prev => ({
      ...prev,
      triggers_quick: prev.triggers_quick.includes(trigger)
        ? prev.triggers_quick.filter(t => t !== trigger)
        : [...prev.triggers_quick, trigger]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateEntry.mutateAsync({
        id: entry.id,
        started_at: formData.started_at,
        ended_at: formData.ended_at || null,
        intensity: formData.intensity,
        key_symptoms: formData.key_symptoms,
        last_meal_at: formData.last_meal_at,
        last_meal_desc: formData.last_meal_desc || undefined,
        triggers_quick: formData.triggers_quick.length > 0 ? formData.triggers_quick : undefined,
        medication_quick: formData.medication_quick.taken ? formData.medication_quick : undefined,
        sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours.toString()) : undefined,
        hydration_ml: formData.hydration_ml ? parseInt(formData.hydration_ml.toString()) : undefined,
        pain_location: formData.pain_location.length > 0 ? formData.pain_location : undefined,
        pain_type: formData.pain_type || undefined,
        notes: formData.notes || undefined
      })
      
      onClose()
    } catch (error) {
      console.error('Error al actualizar entrada:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card ref={modalRef} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Editar episodio</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Intensidad */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Intensidad: {formData.intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData(prev => ({ ...prev, intensity: parseInt(e.target.value) }))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
              />
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Fecha de inicio
              </label>
              <Input
                type="datetime-local"
                value={formData.started_at.slice(0, 16)}
                onChange={(e) => setFormData(prev => ({ ...prev, started_at: e.target.value + ':00.000Z' }))}
              />
            </div>

            {/* Fecha de fin */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha de fin (opcional)
              </label>
              <Input
                type="datetime-local"
                value={formData.ended_at ? formData.ended_at.slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  ended_at: e.target.value ? e.target.value + ':00.000Z' : null 
                }))}
              />
            </div>

            {/* Síntomas clave */}
            <div>
              <label className="block text-sm font-medium mb-2">Síntomas clave</label>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOMS_KEYS.map((symptom) => (
                  <Button
                    key={symptom}
                    type="button"
                    variant={formData.key_symptoms[symptom] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSymptom(symptom)}
                    className="justify-start"
                  >
                    {symptom === 'nausea' && 'Náusea'}
                    {symptom === 'photophobia' && 'Fotofobia'}
                    {symptom === 'phonophobia' && 'Fonofobia'}
                    {symptom === 'aura' && 'Aura'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Última comida */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Utensils className="inline w-4 h-4 mr-1" />
                Última comida
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mealTimeOptions.map((option) => (
                  <Button
                    key={option.label}
                    type="button"
                    variant={selectedMealOption === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedMealOption(option.value)
                      setFormData(prev => ({ 
                        ...prev, 
                        last_meal_at: getMealTimeValue(option.value) 
                      }))
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="¿Qué comiste/bebiste?"
                value={formData.last_meal_desc}
                onChange={(e) => setFormData(prev => ({ ...prev, last_meal_desc: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium mb-2">Posibles triggers</label>
              <div className="grid grid-cols-3 gap-2">
                {TRIGGERS.map((trigger) => (
                  <Button
                    key={trigger}
                    type="button"
                    variant={formData.triggers_quick.includes(trigger) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTrigger(trigger)}
                    className="text-xs"
                  >
                    {trigger}
                  </Button>
                ))}
              </div>
            </div>

            {/* Medicación */}
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="medication-taken"
                  checked={formData.medication_quick.taken}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      medication_quick: { ...prev.medication_quick, taken: e.target.checked }
                    }))
                    if (e.target.checked) {
                      setShowMedication(true)
                    }
                  }}
                  className="cursor-pointer"
                />
                <label 
                  htmlFor="medication-taken" 
                  className="text-sm cursor-pointer flex items-center"
                >
                  <Pill className="w-4 h-4 mr-2" />
                  Tomé medicación
                </label>
              </div>
              
              {showMedication && (
                <div className="mt-2 space-y-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  
                  {formData.medication_quick.taken && (
                    <>
                      <Input
                        placeholder="Nombre del medicamento"
                        value={formData.medication_quick.name || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          medication_quick: { ...prev.medication_quick, name: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Dosis (ej: 50mg)"
                        value={formData.medication_quick.dose || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          medication_quick: { ...prev.medication_quick, dose: e.target.value }
                        }))}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Efectividad: {formData.medication_quick.effectiveness}/10
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={formData.medication_quick.effectiveness || 0}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            medication_quick: { ...prev.medication_quick, effectiveness: parseInt(e.target.value) }
                          }))}
                          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas adicionales</label>
              <textarea
                className="w-full h-20 px-4 py-2 rounded-xl border border-input bg-background text-sm resize-none"
                placeholder="Notas sobre el episodio..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gradient"
                disabled={updateEntry.isPending}
                className="flex-1"
              >
                {updateEntry.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
