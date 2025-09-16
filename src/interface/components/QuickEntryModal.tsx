import { useState, useRef, useEffect } from 'react'
import { useUIStore } from '@/interface/state/uiStore'
import { usePreferencesStore } from '@/interface/state/preferencesStore'
import { useCreateEntry } from '@/shared/hooks/useEntries'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { X, Clock, Utensils, Pill, Moon, Droplets, MapPin, FileText } from 'lucide-react'
import { TRIGGERS, SYMPTOMS_KEYS, LOCATIONS, PAIN_TYPES } from '@/shared/types'
import { now, subtractHours } from '@/shared/utils/date'

export function QuickEntryModal() {
  const { closeQuickEntry } = useUIStore()
  const { quickEntryExpanded } = usePreferencesStore()
  const createEntry = useCreateEntry()
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeQuickEntry()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeQuickEntry])
  
  const [formData, setFormData] = useState({
    intensity: 7,
    started_at: now(),
    key_symptoms: {
      nausea: false,
      photophobia: false,
      phonophobia: false,
      aura: false
    },
    last_meal_at: subtractHours(now(), 2),
    last_meal_desc: '',
    triggers_quick: [] as string[],
    medication_quick: {
      taken: false,
      name: '',
      dose: '',
      taken_at: now(),
      effectiveness: 0
    },
    sleep_hours: '',
    hydration_ml: '',
    pain_location: [] as string[],
    pain_type: '',
    notes: ''
  })

  // Estado para la opción seleccionada de comida
  const [selectedMealOption, setSelectedMealOption] = useState('2h')

  const [showMedication, setShowMedication] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createEntry.mutateAsync({
      started_at: formData.started_at,
      intensity: formData.intensity,
      key_symptoms: formData.key_symptoms,
      last_meal_at: formData.last_meal_at,
      last_meal_desc: formData.last_meal_desc || undefined,
      triggers_quick: formData.triggers_quick.length > 0 ? formData.triggers_quick : undefined,
      medication_quick: formData.medication_quick.taken ? formData.medication_quick : undefined
    })

    if (result) {
      closeQuickEntry()
      // Reset form
      setFormData({
        intensity: 7,
        started_at: now(),
        key_symptoms: {
          nausea: false,
          photophobia: false,
          phonophobia: false,
          aura: false
        },
        last_meal_at: subtractHours(now(), 2),
        last_meal_desc: '',
        triggers_quick: [],
        medication_quick: {
          taken: false,
          name: '',
          dose: '',
          taken_at: now(),
          effectiveness: 0
        },
        sleep_hours: '',
        hydration_ml: '',
        pain_location: [],
        pain_type: '',
        notes: ''
      })
      setSelectedMealOption('2h')
    }
  }

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

  const togglePainLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      pain_location: prev.pain_location.includes(location)
        ? prev.pain_location.filter(l => l !== location)
        : [...prev.pain_location, location]
    }))
  }

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card ref={modalRef} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registrar episodio</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeQuickEntry}
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
                        value={formData.medication_quick.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          medication_quick: { ...prev.medication_quick, name: e.target.value }
                        }))}
                      />
                      <Input
                        placeholder="Dosis (ej: 50mg)"
                        value={formData.medication_quick.dose}
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
                          value={formData.medication_quick.effectiveness}
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

            {/* Campos adicionales - solo se muestran si quickEntryExpanded es true */}
            {quickEntryExpanded && (
              <>
                {/* Sueño */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Moon className="inline w-4 h-4 mr-1" />
                    Horas de sueño (última noche)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '4h o menos', value: '4' },
                      { label: '5h', value: '5' },
                      { label: '6h', value: '6' },
                      { label: '7h', value: '7' },
                      { label: '8h', value: '8' },
                      { label: '9h+', value: '9' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={formData.sleep_hours === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, sleep_hours: option.value }))}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hidratación */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Droplets className="inline w-4 h-4 mr-1" />
                    Vasos de agua hoy
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '0-2', value: '1' },
                      { label: '3-4', value: '3.5' },
                      { label: '5-6', value: '5.5' },
                      { label: '7-8', value: '7.5' },
                      { label: '9-10', value: '9.5' },
                      { label: '11+', value: '11' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={formData.hydration_ml === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, hydration_ml: option.value }))}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Ubicación del dolor */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Ubicación del dolor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCATIONS.map((location) => (
                      <Button
                        key={location}
                        type="button"
                        variant={formData.pain_location.includes(location) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => togglePainLocation(location)}
                        className="text-xs"
                      >
                        {location.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tipo de dolor */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de dolor</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAIN_TYPES.map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={formData.pain_type === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, pain_type: type }))}
                        className="text-xs"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Notas adicionales
                  </label>
                  <textarea
                    placeholder="Cualquier información adicional..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full h-20 px-3 py-2 text-sm border border-input bg-background rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeQuickEntry}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gradient"
                disabled={createEntry.isPending}
                className="flex-1"
              >
                {createEntry.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
