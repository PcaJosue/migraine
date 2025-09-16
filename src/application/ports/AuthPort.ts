import { UserLite, Result } from '@/shared/types'

export interface AuthPort {
  getUser(username: string): Promise<Result<UserLite | null>>
  verifyPassword(rawPassword: string, hash: string): Promise<Result<boolean>>
  createUser(username: string, passwordHash: string): Promise<Result<UserLite>>
}
