import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from '@/shared/hooks/useTheme'
import { LoginPage } from '@/interface/pages/LoginPage'
import { AppShell } from '@/interface/components/AppShell'
import { useAuthStore } from '@/interface/state/authStore'

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
  useTheme() // Inicializar el tema

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {isAuthenticated ? (
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              🎉 ¡Aplicación Funcionando!
            </h1>
            <div className="bg-green-100 p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                ✅ Todos los Componentes Funcionan
              </h2>
              <div className="text-left space-y-2 text-sm">
                <p>✅ React - Funcionando</p>
                <p>✅ Tailwind CSS - Funcionando</p>
                <p>✅ Zustand - Funcionando</p>
                <p>✅ React Query - Funcionando</p>
                <p>✅ Theme Hook - Funcionando</p>
                <p>✅ LoginPage - Funcionando</p>
                <p>✅ Auth Store - Funcionando</p>
                <p>❌ AppShell - Problema con Supabase hooks</p>
              </div>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                🔍 Problema Identificado
              </h3>
              <p className="text-blue-700 text-sm">
                El AppShell usa hooks que intentan conectarse a Supabase, causando el error de "headers".
                Necesitamos crear adaptadores mock o solucionar el problema de Supabase.
              </p>
            </div>
            <button 
              onClick={() => useAuthStore.getState().logout()}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <LoginPage />
        )}
      </div>
    </QueryClientProvider>
  )
}

export default App
