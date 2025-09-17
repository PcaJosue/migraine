import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: {
    id: string
    username: string
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true })
        
        try {
          // Para MVP, validación simple
          if (username === 'testuser' && password === 'test123') {
            set({
              user: { id: '1', username },
              isAuthenticated: true,
              isLoading: false
            })
            return true
          }
          
          set({ isLoading: false })
          return false
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'aura-track-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
