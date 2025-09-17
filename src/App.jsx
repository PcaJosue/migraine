import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useTheme } from '@/shared/hooks/useTheme'
import { LoginPage } from '@/interface/pages/LoginPage'
import { AppShell } from '@/interface/components/AppShell'
import { useAuthStore } from '@/interface/state/authStore'
import { isSupabaseMock } from '@/shared/config/supabase'

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
        {/* Debug info para Supabase */}
        {isSupabaseMock && (
          <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md text-sm z-50">
            ⚠️ Usando cliente mock de Supabase
          </div>
        )}
        
        {isAuthenticated ? <AppShell /> : <LoginPage />}
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  )
}

export default App
