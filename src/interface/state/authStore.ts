import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAdapter } from '@/shared/config/container'

interface AuthState {
  user: {
    id: string
    username: string
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
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
          // Obtener usuario de JSONBin.io
          const userResult = await authAdapter.getUser(username)
          
          if (!userResult.success || !userResult.data) {
            set({ isLoading: false })
            return false
          }

          // Verificar contraseña
          const passwordResult = await authAdapter.verifyPassword(password, userResult.data.password_hash)
          
          if (!passwordResult.success || !passwordResult.data) {
            set({ isLoading: false })
            return false
          }

          // Login exitoso
          set({
            user: { id: userResult.data.id, username },
            isAuthenticated: true,
            isLoading: false
          })
          return true
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          return false
        }
      },

      register: async (username: string, password: string) => {
        set({ isLoading: true })
        
        try {
          // Crear hash simple de la contraseña (en producción usar bcrypt)
          const passwordHash = btoa(password) // Base64 encoding simple
          
          const result = await authAdapter.createUser(username, passwordHash)
          
          if (!result.success) {
            set({ isLoading: false })
            return { success: false, error: result.error?.message || 'Error al crear usuario' }
          }

          // Registro exitoso, hacer login automático
          set({
            user: { id: result.data.id, username },
            isAuthenticated: true,
            isLoading: false
          })
          
          return { success: true }
        } catch (error) {
          console.error('Register error:', error)
          set({ isLoading: false })
          return { success: false, error: 'Error inesperado al registrar usuario' }
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
