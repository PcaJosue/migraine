import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Store con persistencia manual más robusta
const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  _hasHydrated: false,
  
  login: async (username, password) => {
    if (username === 'testuser' && password === 'test123') {
      const newState = { 
        isAuthenticated: true, 
        user: { id: '1', username } 
      }
      set(newState)
      
      // Persistir manualmente
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('aura-track-auth', JSON.stringify(newState))
          console.log('Saved to localStorage:', newState)
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
      
      return true
    }
    return false
  },
  
  logout: () => {
    const newState = { isAuthenticated: false, user: null }
    set(newState)
    
    // Limpiar localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('aura-track-auth')
        console.log('Cleared localStorage')
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
  
  hydrate: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('aura-track-auth')
        if (stored) {
          const parsed = JSON.parse(stored)
          console.log('Hydrating from localStorage:', parsed)
          set({ ...parsed, _hasHydrated: true })
          return
        }
      }
    } catch (error) {
      console.error('Error hydrating from localStorage:', error)
    }
    set({ _hasHydrated: true })
  }
}))

// Hydratar inmediatamente si estamos en el cliente
if (typeof window !== 'undefined') {
  useAuthStore.getState().hydrate()
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  
  // Debug: Check localStorage and Zustand state
  const [debugInfo, setDebugInfo] = React.useState({})
  
  React.useEffect(() => {
    const checkStorage = () => {
      try {
        const stored = localStorage.getItem('aura-track-auth')
        const parsed = stored ? JSON.parse(stored) : null
        setDebugInfo({
          localStorage: stored,
          parsed,
          isAuthenticated,
          user,
          hasHydrated: _hasHydrated,
          hasWindow: typeof window !== 'undefined',
          hasLocalStorage: typeof localStorage !== 'undefined',
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        setDebugInfo({
          error: error.message,
          isAuthenticated,
          user,
          hasHydrated: _hasHydrated,
          hasWindow: typeof window !== 'undefined',
          hasLocalStorage: typeof localStorage !== 'undefined',
          timestamp: new Date().toISOString()
        })
      }
    }
    
    checkStorage()
    
    // Check again after a delay to see if Zustand hydrates
    const timer = setTimeout(checkStorage, 1000)
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, _hasHydrated])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🚀 AuraTrack - Versión Estable
          </h1>
          
          {/* Debug Info - Solo mostrar si hay problemas */}
          {debugInfo.error && (
            <div className="bg-yellow-100 p-4 rounded-lg mb-4 text-xs font-mono">
              <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
              <pre className="whitespace-pre-wrap text-yellow-700">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          
          {isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-green-600 mb-4">
                ✅ Aplicación Funcionando
              </h2>
              <p className="text-gray-600 mb-4">
                Logueado como: <strong>{user?.username || 'testuser'}</strong>
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
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
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
                    defaultValue="testuser"
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
                    defaultValue="test123"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const username = document.getElementById('username').value
                    const password = document.getElementById('password').value
                    await useAuthStore.getState().login(username, password)
                  }}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
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
