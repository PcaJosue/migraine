import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/shared/config/supabase'

function App() {
  const [envStatus, setEnvStatus] = useState('Checking...')
  const [supabaseStatus, setSupabaseStatus] = useState('Checking...')
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      // Verificar variables de entorno
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      console.log('Environment check:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0
      })

      if (supabaseUrl && supabaseKey) {
        setEnvStatus('✅ Environment variables found')
        
        // Verificar configuración de Supabase
        if (isSupabaseConfigured()) {
          setSupabaseStatus('✅ Supabase configured')
          
          // Probar conexión básica
          if (supabase) {
            supabase.from('app_users').select('count').limit(1)
              .then(() => {
                setSupabaseStatus('✅ Supabase connected')
              })
              .catch((err) => {
                setSupabaseStatus(`❌ Supabase error: ${err.message}`)
                setError(err.message)
              })
          } else {
            setSupabaseStatus('❌ Supabase client is null')
          }
        } else {
          setSupabaseStatus('❌ Supabase not configured')
        }
      } else {
        setEnvStatus('❌ Environment variables missing')
        setSupabaseStatus('❌ Cannot check Supabase')
      }
    } catch (err) {
      setError(err.message)
      setEnvStatus('❌ Error checking environment')
      setSupabaseStatus('❌ Error checking Supabase')
    }
  }, [])

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🔍 AuraTrack - Diagnostic Mode
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Environment Status</h2>
        <p><strong>Environment Variables:</strong> {envStatus}</p>
        <p><strong>Supabase Status:</strong> {supabaseStatus}</p>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>Next Steps</h2>
        <p>If everything shows ✅, the issue might be in the components.</p>
        <p>If you see ❌, we need to fix those issues first.</p>
      </div>
    </div>
  )
}

export default App
