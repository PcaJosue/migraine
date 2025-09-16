import { supabase } from '@/shared/config/supabase'
import { UserLite, Result } from '@/shared/types'
import { AuthPort } from '@/application/ports/AuthPort'

export class SupabaseAuthAdapter implements AuthPort {
  async getUser(username: string): Promise<Result<UserLite | null>> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No user found
          return {
            success: true,
            data: null
          }
        }
        return {
          success: false,
          error: new Error(`Error al obtener usuario: ${error.message}`)
        }
      }

      return {
        success: true,
        data: data as UserLite
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al obtener usuario')
      }
    }
  }

  async verifyPassword(rawPassword: string, hash: string): Promise<Result<boolean>> {
    try {
      // En un entorno real, usarías bcrypt o argon2
      // Para MVP, comparación simple (NO RECOMENDADO PARA PRODUCCIÓN)
      const isValid = rawPassword === hash
      
      return {
        success: true,
        data: isValid
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al verificar contraseña')
      }
    }
  }

  async createUser(username: string, passwordHash: string): Promise<Result<UserLite>> {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .insert({
          username,
          password_hash: passwordHash
        })
        .select('*')
        .single()

      if (error) {
        return {
          success: false,
          error: new Error(`Error al crear usuario: ${error.message}`)
        }
      }

      return {
        success: true,
        data: data as UserLite
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error desconocido al crear usuario')
      }
    }
  }
}
