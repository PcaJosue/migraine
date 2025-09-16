import { useAuthStore } from '@/interface/state/authStore'
import { usePreferencesStore } from '@/interface/state/preferencesStore'
import { useTheme } from '@/shared/hooks/useTheme'
import { Card, CardContent, CardHeader, CardTitle } from '@/interface/components/ui/Card'
import { Button } from '@/interface/components/ui/Button'
import { Input } from '@/interface/components/ui/Input'
import { Tooltip } from '@/interface/components/ui/Tooltip'
import { Sun, Moon, Monitor, User, Key, Globe } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const { 
    quickEntryExpanded, 
    remindersEnabled, 
    timezone,
    setQuickEntryExpanded, 
    setRemindersEnabled, 
    setTimezone 
  } = usePreferencesStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1">Configuración</h1>
        <p className="text-caption text-muted-foreground mt-1">
          Personaliza tu experiencia con AuraTrack
        </p>
      </div>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-5 w-5" />
            Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tema</label>
            <div className="grid grid-cols-3 gap-2">
              <Tooltip content="Tema claro - colores claros para mejor visibilidad durante el día">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="justify-start"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Claro
                </Button>
              </Tooltip>
              <Tooltip content="Tema oscuro - colores oscuros para reducir fatiga visual">
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="justify-start"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Oscuro
                </Button>
              </Tooltip>
              <Tooltip content="Tema del sistema - sigue la preferencia de tu dispositivo">
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="justify-start"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Sistema
                </Button>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tema actual: <span className="font-medium">{theme}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Usuario</label>
            <Input
              value={user?.username || ''}
              disabled
              className="bg-neutral-100 dark:bg-neutral-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <div className="flex space-x-2">
              <Input
                type="password"
                value="••••••••"
                disabled
                className="bg-neutral-100 dark:bg-neutral-800"
              />
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Cambiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Preferencias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Zona horaria</label>
            <select 
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="America/Mexico_City">México (GMT-6)</option>
              <option value="America/New_York">Nueva York (GMT-5)</option>
              <option value="Europe/Madrid">Madrid (GMT+1)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Entrada rápida por defecto</div>
                <div className="text-xs text-muted-foreground">
                  Mostrar campos adicionales en el modal de entrada rápida
                </div>
              </div>
              <input 
                type="checkbox" 
                className="rounded cursor-pointer" 
                checked={quickEntryExpanded}
                onChange={(e) => setQuickEntryExpanded(e.target.checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Recordatorios</div>
                <div className="text-xs text-muted-foreground">
                  Notificaciones para registrar episodios
                </div>
              </div>
              <input 
                type="checkbox" 
                className="rounded cursor-pointer" 
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la app */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Versión</span>
            <span className="text-sm">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Build</span>
            <span className="text-sm">2025.01.15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Modo</span>
            <span className="text-sm">MVP</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
