import { useState } from 'react'
import { useAuthStore } from '@/interface/state/authStore'
import { Button } from '@/interface/components/ui/Button'
import { Input } from '@/interface/components/ui/Input'
import { Card } from '@/interface/components/ui/Card'
import { Eye, EyeOff, Zap, UserPlus } from 'lucide-react'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [error, setError] = useState('')
  const { login, register, isLoading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (isRegisterMode) {
      const result = await register(username, password)
      if (!result.success) {
        setError(result.error || 'Error al registrar usuario')
      }
    } else {
      const success = await login(username, password)
      if (!success) {
        setError('Usuario o contraseña incorrectos')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-900 dark:to-neutral-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-h1 text-neutral-900 dark:text-white mb-2">
            AuraTrack
          </h1>
          <p className="text-caption text-neutral-600 dark:text-neutral-400">
            {isRegisterMode ? 'Crear nueva cuenta' : 'Diario de migrañas MVP'}
          </p>
        </div>

        {/* Formulario de login */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? 'Creando cuenta...' : 'Iniciando sesión...') 
                : (isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión')
              }
            </Button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode)
                setError('')
                setUsername('')
                setPassword('')
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <UserPlus className="w-4 h-4" />
              {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Registra episodios en &lt;10s y convierte datos clínicos en patrones accionables
          </p>
        </div>
      </div>
    </div>
  )
}
