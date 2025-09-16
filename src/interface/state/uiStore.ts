import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  quickEntryOpen: boolean
  currentPage: 'home' | 'entries' | 'insights' | 'settings'
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openQuickEntry: () => void
  closeQuickEntry: () => void
  setCurrentPage: (page: 'home' | 'entries' | 'insights' | 'settings') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: false,
      quickEntryOpen: false,
      currentPage: 'home',

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openQuickEntry: () => set({ quickEntryOpen: true }),
      closeQuickEntry: () => set({ quickEntryOpen: false }),
      setCurrentPage: (page) => set({ currentPage: page })
    }),
    {
      name: 'aura-track-ui',
      partialize: (state) => ({
        theme: state.theme,
        currentPage: state.currentPage
      }),
      // Configuración más robusta para evitar problemas en SSR
      skipHydration: true,
      storage: {
        getItem: (name) => {
          try {
            return typeof window !== 'undefined' ? localStorage.getItem(name) : null
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem(name, value)
            }
          } catch {
            // Ignorar errores de localStorage
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(name)
            }
          } catch {
            // Ignorar errores de localStorage
          }
        }
      }
    }
  )
)
