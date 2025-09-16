import { TelemetryPort } from '@/application/ports/TelemetryPort'

export class TelemetryAdapter implements TelemetryPort {
  track(eventName: string, payload: Record<string, any>): void {
    // Para MVP, solo log en consola
    // En producción, integrar con PostHog, Umami, etc.
    console.log('📊 Telemetry:', eventName, payload)
    
    // Ejemplo de integración futura:
    // posthog.capture(eventName, payload)
  }

  identify(userId: string, traits?: Record<string, any>): void {
    console.log('👤 User identified:', userId, traits)
    
    // Ejemplo de integración futura:
    // posthog.identify(userId, traits)
  }
}
