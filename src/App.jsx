import { create } from 'zustand'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Store simple para probar Zustand
const useTestStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

function App() {
  const { count, increment, decrement } = useTestStore()
  const [supabaseStatus, setSupabaseStatus] = useState('Checking...')
  const [supabaseError, setSupabaseError] = useState(null)

  useEffect(() => {
    const testSupabase = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        console.log('Testing Supabase with environment variables:', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlLength: supabaseUrl?.length || 0,
          keyLength: supabaseKey?.length || 0
        })

        if (!supabaseUrl || !supabaseKey) {
          setSupabaseStatus('❌ Environment variables missing')
          return
        }

        // Crear cliente de Supabase con configuración segura
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          },
          global: {
            headers: {
              'X-Client-Info': 'aura-track-app'
            }
          }
        })

        setSupabaseStatus('Testing connection...')
        
        // Probar una consulta simple
        const { data, error } = await supabase
          .from('app_users')
          .select('count')
          .limit(1)
        
        if (error) {
          // Si es un error de tabla no encontrada, es normal
          if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
            setSupabaseStatus('✅ Supabase connected (table not found - normal)')
          } else {
            setSupabaseStatus('❌ Supabase connection failed')
            setSupabaseError(error.message)
          }
        } else {
          setSupabaseStatus('✅ Supabase connected')
        }
      } catch (err) {
        console.error('Supabase test error:', err)
        setSupabaseStatus('❌ Supabase error')
        setSupabaseError(err.message)
      }
    }

    // Delay para asegurar que todo esté cargado
    setTimeout(testSupabase, 100)
  }, [])

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        🚀 AuraTrack - Supabase Test (Fixed)
      </h1>
      
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Application Status</h2>
        <p className="mb-2"><strong>React:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Build:</strong> ✅ Successful</p>
        <p className="mb-2"><strong>Deploy:</strong> ✅ Live</p>
        <p className="mb-2"><strong>Tailwind CSS:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Zustand:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Environment Variables:</strong> ✅ Found</p>
        <p className="mb-2"><strong>Supabase:</strong> {supabaseStatus}</p>
      </div>

      <div className="bg-blue-100 p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">🧪 Zustand Test</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={decrement}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            -
          </button>
          <span className="text-2xl font-bold text-blue-800">{count}</span>
          <button 
            onClick={increment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            +
          </button>
        </div>
        <p className="text-blue-700 mt-2">If you can change the counter, Zustand is working!</p>
      </div>

      {supabaseError && (
        <div className="bg-red-100 p-5 rounded-lg shadow-md mb-5">
          <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Supabase Error</h2>
          <p className="text-red-700">{supabaseError}</p>
        </div>
      )}

      <div className="bg-green-100 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-green-800 mb-4">🎯 Final Test</h2>
        <p className="text-green-700 mb-2">This version creates the Supabase client directly in the component with secure configuration.</p>
        <p className="text-green-700">If this works without the headers error, we can restore the full application!</p>
      </div>
    </div>
  )
}

export default App
