import { ClockPort } from '@/application/ports/ClockPort'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export class ClockAdapter implements ClockPort {
  nowUtc(): string {
    return new Date().toISOString()
  }

  toTz(date: string, _timezone: string): string {
    try {
      const dateObj = parseISO(date)
      return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { 
        locale: es,
        // Note: Para manejo completo de timezones, usar date-fns-tz
      })
    } catch {
      return date
    }
  }

  formatDate(date: string, formatStr: string): string {
    try {
      const dateObj = parseISO(date)
      return format(dateObj, formatStr, { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }
}
