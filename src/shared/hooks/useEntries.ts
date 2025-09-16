import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createQuickEntry, listEntries, exportCsv } from '@/shared/config/container'
import { MigraineEntry, CreateEntryDto, EntryFilterDto } from '@/shared/types'
import { useAuthStore } from '@/interface/state/authStore'
import { toast } from 'sonner'

export const useCreateEntry = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (data: {
      started_at?: string
      intensity: number
      key_symptoms: {
        nausea: boolean
        photophobia: boolean
        phonophobia: boolean
        aura: boolean
      }
      last_meal_at: string
      last_meal_desc?: string
      triggers_quick?: string[]
      medication_quick?: {
        taken: boolean
        name?: string
        dose?: string
        taken_at?: string
        effectiveness?: number
      }
    }) => {
      if (!user) throw new Error('Usuario no autenticado')
      
      const result = await createQuickEntry.execute({
        username: user.username,
        ...data
      })

      if (!result.success) {
        throw result.error
      }

      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Episodio guardado correctamente')
    },
    onError: (error) => {
      toast.error('Error al guardar episodio: ' + error.message)
    }
  })
}

export const useEntries = (filter: {
  from: string
  to: string
  min_intensity?: number
  has_aura?: boolean
  trigger_contains?: string
  meal_gap_hours?: number
}) => {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['entries', user?.username, filter],
    queryFn: async () => {
      if (!user) throw new Error('Usuario no autenticado')
      
      const result = await listEntries.execute({
        username: user.username,
        ...filter
      })

      if (!result.success) {
        throw result.error
      }

      return result.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

export const useUpdateEntry = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (data: {
      id: string
      started_at: string
      ended_at?: string | null
      intensity: number
      key_symptoms: {
        nausea: boolean
        photophobia: boolean
        phonophobia: boolean
        aura: boolean
      }
      last_meal_at: string
      last_meal_desc?: string
      triggers_quick?: string[]
      medication_quick?: {
        taken: boolean
        name?: string
        dose?: string
        taken_at?: string
        effectiveness?: number
      }
      sleep_hours?: number
      hydration_ml?: number
      pain_location?: string[]
      pain_type?: string
      notes?: string
    }) => {
      if (!user) throw new Error('Usuario no autenticado')
      
      // TODO: Implementar actualización en el adaptador
      console.log('Actualizando entrada:', data)
      
      // Por ahora, simulamos éxito
      return { success: true, id: data.id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Episodio actualizado correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar episodio: ' + error.message)
    }
  })
}

export const useExportCsv = () => {
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (filter: {
      from: string
      to: string
      min_intensity?: number
      has_aura?: boolean
      trigger_contains?: string
      meal_gap_hours?: number
    }) => {
      if (!user) throw new Error('Usuario no autenticado')
      
      const result = await exportCsv.execute({
        username: user.username,
        ...filter
      })

      if (!result.success) {
        throw result.error
      }

      return result.data
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `migraine-entries-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('CSV exportado correctamente')
    },
    onError: (error) => {
      toast.error('Error al exportar CSV: ' + error.message)
    }
  })
}
