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
      // Remover skipHydration para que funcione la persistencia
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem' }}>
        <div style={{ 
          maxWidth: '28rem', 
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
            🚀 AuraTrack - Versión Estable
          </h1>
          
          {isAuthenticated ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#059669', 
                marginBottom: '1rem' 
              }}>
                ✅ Aplicación Funcionando
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                Logueado como: <strong>testuser</strong>
              </p>
              <div style={{ 
                backgroundColor: '#dcfce7', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem' 
              }}>
                <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
                  Componentes Funcionando:
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#15803d' }}>
                  <p>✅ React</p>
                  <p>✅ Zustand</p>
                  <p>✅ React Query</p>
                  <p>✅ Persistencia</p>
                </div>
              </div>
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
                  />
                </div>
                <button 
                  onClick={async () => {
                    const username = document.getElementById('username').value
                    const password = document.getElementById('password').value
                    await useAuthStore.getState().login(username, password)
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
