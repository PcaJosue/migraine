import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
  // Preferencias de entrada rápida
  quickEntryExpanded: boolean
  
  // Preferencias de notificaciones
  remindersEnabled: boolean
  
  // Preferencias de zona horaria
  timezone: string
  
  // Acciones
  setQuickEntryExpanded: (expanded: boolean) => void
  setRemindersEnabled: (enabled: boolean) => void
  setTimezone: (timezone: string) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // Valores por defecto
      quickEntryExpanded: true,
      remindersEnabled: false,
      timezone: 'America/Mexico_City',
      
      // Acciones
      setQuickEntryExpanded: (expanded) => set({ quickEntryExpanded: expanded }),
      setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),
      setTimezone: (timezone) => set({ timezone }),
    }),
    {
      name: 'aura-track-preferences',
      partialize: (state) => ({
        quickEntryExpanded: state.quickEntryExpanded,
        remindersEnabled: state.remindersEnabled,
        timezone: state.timezone,
      })
    }
  )
)
