import { jsonbinClient } from '@/shared/config/jsonbin'
import { UserLite, Result } from '@/shared/types'
import { AuthPort } from '@/application/ports/AuthPort'
import { hashPassword, verifyPassword } from '@/shared/utils/crypto'

export class JSONBinAuthAdapter implements AuthPort {
  async getUser(username: string): Promise<Result<UserLite | null>> {
    try {
      const users = await jsonbinClient.getUsers()
      const user = users.find((u: UserLite) => u.username === username)
      
      return {
        success: true,
        data: user || null
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al obtener usuario')
      }
    }
  }

  async verifyPassword(rawPassword: string, hash: string): Promise<Result<boolean>> {
    try {
      // Verificación segura usando SHA-256
      const isValid = await verifyPassword(rawPassword, hash)
      
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
      const users = await jsonbinClient.getUsers()
      
      // Verificar si el usuario ya existe
      const existingUser = users.find((u: UserLite) => u.username === username)
      if (existingUser) {
        return {
          success: false,
          error: new Error('El usuario ya existe')
        }
      }

      // Crear nuevo usuario
      const newUser: UserLite = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username,
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      }

      users.push(newUser)
      
      const success = await jsonbinClient.updateUsers(users)
      
      if (!success) {
        return {
          success: false,
          error: new Error('Error al guardar usuario en JSONBin.io')
        }
      }

      return {
        success: true,
        data: newUser
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Error al crear usuario')
      }
    }
  }
}
