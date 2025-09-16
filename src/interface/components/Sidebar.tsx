import { useUIStore } from '@/interface/state/uiStore'
import { Button } from './ui/Button'
import { Tooltip } from './ui/Tooltip'
import { Home, FileText, BarChart3, Settings, Plus, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const navigation = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'entries', label: 'Episodios', icon: FileText },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
] as const

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, openQuickEntry, setSidebarOpen } = useUIStore()

  // Función para manejar clic en item de navegación
  const handleNavigationClick = (pageId: string) => {
    setCurrentPage(pageId as any)
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false)
    }
  }

  // Función para manejar clic en botón de entrada rápida
  const handleQuickEntryClick = () => {
    openQuickEntry()
    // Cerrar sidebar en móvil después de abrir entrada rápida
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => useUIStore.getState().setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'
      )}>
        <div className="flex h-full flex-col">
          {/* Header with close button */}
          {sidebarOpen && (
            <div className="flex justify-end p-4 border-b">
              <Tooltip content="Cerrar menú" side="bottom">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 flex flex-col">
            {navigation.map((item) => {
              const Icon = item.icon
              const button = (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    sidebarOpen ? 'px-3' : 'px-2'
                  )}
                  onClick={() => handleNavigationClick(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </Button>
              )

              return (
                <Tooltip key={item.id} content={item.label} side="right">
                  {button}
                </Tooltip>
              )
            })}
          </nav>

          {/* Quick Entry Button */}
          <div className="p-4">
            <Tooltip content="Registrar episodio" side="right">
              <Button
                variant="gradient"
                className={cn(
                  'w-full',
                  sidebarOpen ? 'px-3' : 'px-2'
                )}
                onClick={handleQuickEntryClick}
              >
                <Plus className="h-5 w-5" />
                {sidebarOpen && (
                  <span className="ml-3">Registrar</span>
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
      </aside>
    </>
  )
}
