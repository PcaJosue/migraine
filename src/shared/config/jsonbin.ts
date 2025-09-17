// Configuración de JSONBin.io
const JSONBIN_API_KEY = import.meta.env.VITE_JSONBIN_API_KEY
const JSONBIN_BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID

if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
  throw new Error('Missing JSONBin.io environment variables')
}

const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b'

// Cliente de JSONBin.io
export class JSONBinClient {
  private apiKey: string
  private binId: string

  constructor() {
    this.apiKey = JSONBIN_API_KEY
    this.binId = JSONBIN_BIN_ID
  }

  // Obtener todos los datos del bin
  async getData(): Promise<any> {
    try {
      const response = await fetch(`${JSONBIN_BASE_URL}/${this.binId}/latest`, {
        headers: {
          'X-Master-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.record || { migraine_entries: [], app_users: [] }
    } catch (error) {
      console.error('Error fetching data from JSONBin:', error)
      // Retornar estructura vacía si hay error
      return { migraine_entries: [], app_users: [] }
    }
  }

  // Actualizar todos los datos del bin
  async updateData(data: any): Promise<boolean> {
    try {
      const response = await fetch(`${JSONBIN_BASE_URL}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error updating data in JSONBin:', error)
      return false
    }
  }

  // Obtener entradas de migraña
  async getMigraineEntries(): Promise<any[]> {
    const data = await this.getData()
    return data.migraine_entries || []
  }

  // Actualizar entradas de migraña
  async updateMigraineEntries(entries: any[]): Promise<boolean> {
    const data = await this.getData()
    data.migraine_entries = entries
    return await this.updateData(data)
  }

  // Obtener usuarios
  async getUsers(): Promise<any[]> {
    const data = await this.getData()
    return data.app_users || []
  }

  // Actualizar usuarios
  async updateUsers(users: any[]): Promise<boolean> {
    const data = await this.getData()
    data.app_users = users
    return await this.updateData(data)
  }
}

// Instancia singleton del cliente
export const jsonbinClient = new JSONBinClient()
