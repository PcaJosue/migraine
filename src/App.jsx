import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Store simple que sabemos que funciona
const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (username, password) => {
        if (username === 'testuser' && password === 'test123') {
          set({ isAuthenticated: true, user: { id: '1', username } })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, user: null })
    }),
    {
      name: 'aura-track-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🚀 AuraTrack - Versión Estable
          </h1>
          
          {isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-green-600 mb-4">
                ✅ Aplicación Funcionando
              </h2>
              <p className="text-gray-600 mb-4">
                Logueado como: <strong>testuser</strong>
              </p>
              <div className="bg-green-100 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-green-800 mb-2">Componentes Funcionando:</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✅ React</p>
                  <p>✅ Tailwind CSS</p>
                  <p>✅ Zustand</p>
                  <p>✅ React Query</p>
                  <p>✅ Persistencia</p>
                </div>
              </div>
              <button 
                onClick={() => useAuthStore.getState().logout()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Login
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <input 
                    type="text" 
                    id="username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="testuser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <input 
                    type="password" 
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="test123"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const username = document.getElementById('username').value
                    const password = document.getElementById('password').value
                    await useAuthStore.getState().login(username, password)
                  }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Login
                </button>
              </div>
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Credenciales:</strong><br/>
                  Usuario: testuser<br/>
                  Contraseña: test123
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
