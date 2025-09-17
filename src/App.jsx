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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ 
          maxWidth: '32rem', 
          margin: '0 auto', 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '1.5rem' 
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1.5rem', 
            textAlign: 'center' 
          }}>
            🔍 AuraTrack - Debug Persistencia
          </h1>
          
          {/* Debug Info */}
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}>
            <h3 style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
              🔍 Debug Info:
            </h3>
            <pre style={{ whiteSpace: 'pre-wrap', color: '#92400e' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          {isAuthenticated ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#059669', 
                marginBottom: '1rem' 
              }}>
                ✅ Logueado
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                Usuario: <strong>{user?.username || 'testuser'}</strong>
              </p>
              <button 
                onClick={() => useAuthStore.getState().logout()}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '1rem' 
              }}>
                Login
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    Usuario
                  </label>
                  <input 
                    type="text" 
                    id="username"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      outline: 'none'
                    }}
                    placeholder="testuser"
                    defaultValue="testuser"
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    Contraseña
                  </label>
                  <input 
                    type="password" 
                    id="password"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      outline: 'none'
                    }}
                    placeholder="test123"
                    defaultValue="test123"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const username = document.getElementById('username').value
                    const password = document.getElementById('password').value
                    console.log('Attempting login with:', { username, password })
                    const result = await useAuthStore.getState().login(username, password)
                    console.log('Login result:', result)
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Login
                </button>
              </div>
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                backgroundColor: '#f3f4f6', 
                borderRadius: '0.375rem' 
              }}>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
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
