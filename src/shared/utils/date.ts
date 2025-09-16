import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Fecha inválida'
    return format(dateObj, formatStr, { locale: es })
  } catch {
    return 'Fecha inválida'
  }
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm')
}

export const formatRelativeTime = (date: string | Date): string => {
  return formatDate(date, 'PPPp')
}

export const now = (): string => {
  return new Date().toISOString()
}

export const addHours = (date: string | Date, hours: number): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const newDate = new Date(dateObj.getTime() + hours * 60 * 60 * 1000)
  return newDate.toISOString()
}

export const subtractHours = (date: string | Date, hours: number): string => {
  return addHours(date, -hours)
}
