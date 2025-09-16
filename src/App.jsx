import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/interface/state/authStore'
import { useTheme } from '@/shared/hooks/useTheme'
import { LoginPage } from '@/interface/pages/LoginPage'
import { AppShell } from '@/interface/components/AppShell'
import './App.css'
import '@/interface/components/ui/DateTimeInput.css'

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
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </div>
    </QueryClientProvider>
  )
}

export default App
