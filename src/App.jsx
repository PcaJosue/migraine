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
        {isAuthenticated ? <AppShell /> : <LoginPage />}
      </div>
    </QueryClientProvider>
  )
}

export default App
