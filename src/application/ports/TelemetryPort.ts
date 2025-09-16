export interface TelemetryPort {
  track(eventName: string, payload: Record<string, any>): void
  identify(userId: string, traits?: Record<string, any>): void
}
