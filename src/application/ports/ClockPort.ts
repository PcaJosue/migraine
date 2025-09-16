export interface ClockPort {
  nowUtc(): string
  toTz(date: string, timezone: string): string
  formatDate(date: string, format: string): string
}
