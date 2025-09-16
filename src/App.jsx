import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/shared/config/supabase'
import { useState, useEffect } from 'react'

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
        if (isSupabaseConfigured() && supabase) {
          setSupabaseStatus('Testing connection...')
          
          // Probar una consulta simple
          const { data, error } = await supabase
            .from('app_users')
            .select('count')
            .limit(1)
          
          if (error) {
            setSupabaseStatus('❌ Supabase connection failed')
            setSupabaseError(error.message)
          } else {
            setSupabaseStatus('✅ Supabase connected')
          }
        } else {
          setSupabaseStatus('❌ Supabase not configured')
        }
      } catch (err) {
        setSupabaseStatus('❌ Supabase error')
        setSupabaseError(err.message)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        🚀 AuraTrack - Supabase Test
      </h1>
      
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Application Status</h2>
        <p className="mb-2"><strong>React:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Build:</strong> ✅ Successful</p>
        <p className="mb-2"><strong>Deploy:</strong> ✅ Live</p>
        <p className="mb-2"><strong>Environment:</strong> ✅ Loaded</p>
        <p className="mb-2"><strong>Tailwind CSS:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Zustand:</strong> ✅ Working</p>
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
        <h2 className="text-xl font-semibold text-green-800 mb-4">🎯 Critical Test</h2>
        <p className="text-green-700 mb-2">This is the moment of truth! If you see the error "Cannot read properties of undefined (reading 'headers')" now, Supabase is the culprit.</p>
        <p className="text-green-700">If everything works fine, we'll add React Query next.</p>
      </div>
    </div>
  )
}

export default App
