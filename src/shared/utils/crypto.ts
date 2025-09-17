// Utilidades de criptografía para hashing seguro de contraseñas

/**
 * Genera un hash seguro de una contraseña usando Web Crypto API
 * @param password - Contraseña en texto plano
 * @returns Promise<string> - Hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  // Convertir la contraseña a ArrayBuffer
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  
  // Generar hash SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  
  // Convertir a string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * Verifica si una contraseña coincide con su hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado
 * @returns Promise<boolean> - True si coinciden
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Genera un salt aleatorio para mayor seguridad
 * @returns string - Salt aleatorio
 */
export function generateSalt(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash con salt para máxima seguridad
 * @param password - Contraseña en texto plano
 * @param salt - Salt opcional (se genera si no se proporciona)
 * @returns Promise<{hash: string, salt: string}> - Hash y salt
 */
export async function hashPasswordWithSalt(password: string, salt?: string): Promise<{hash: string, salt: string}> {
  const actualSalt = salt || generateSalt()
  const saltedPassword = password + actualSalt
  const hash = await hashPassword(saltedPassword)
  
  return { hash, salt: actualSalt }
}

/**
 * Verifica contraseña con salt
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado
 * @param salt - Salt almacenado
 * @returns Promise<boolean> - True si coinciden
 */
export async function verifyPasswordWithSalt(password: string, hash: string, salt: string): Promise<boolean> {
  const saltedPassword = password + salt
  const passwordHash = await hashPassword(saltedPassword)
  return passwordHash === hash
}
