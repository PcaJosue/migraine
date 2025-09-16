import { useUIStore } from '@/interface/state/uiStore'
import { useAuthStore } from '@/interface/state/authStore'
import { useTheme } from '@/shared/hooks/useTheme'
import { Button } from './ui/Button'
import { Tooltip } from './ui/Tooltip'
import { Menu, Plus, Sun, Moon, LogOut, Zap } from 'lucide-react'

export function TopNav() {
  const { sidebarOpen, setSidebarOpen, openQuickEntry } = useUIStore()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Tooltip content="Menú principal" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </Tooltip>
          
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-h3 font-bold">AuraTrack</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <Button
            variant="gradient"
            onClick={openQuickEntry}
            className="hidden sm:flex"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar ahora
          </Button>
          
          <Tooltip content="Registrar episodio" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={openQuickEntry}
              className="sm:hidden"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Tooltip>

          <Tooltip content={`Cambiar a ${theme === 'light' ? 'modo oscuro' : 'modo claro'}`} side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </Tooltip>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.username}
            </span>
            <Tooltip content="Cerrar sesión" side="bottom">
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  )
}
