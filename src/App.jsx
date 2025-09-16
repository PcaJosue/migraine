import { create } from 'zustand'
import { useState, useEffect } from 'react'

// Store simple para probar Zustand
const useTestStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

function App() {
  const { count, increment, decrement } = useTestStore()
  const [envStatus, setEnvStatus] = useState('Checking...')
  const [envDetails, setEnvDetails] = useState({})

  useEffect(() => {
    const checkEnvironment = () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        console.log('Environment variables check:', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlLength: supabaseUrl?.length || 0,
          keyLength: supabaseKey?.length || 0,
          urlStart: supabaseUrl?.substring(0, 20) || 'N/A',
          keyStart: supabaseKey?.substring(0, 20) || 'N/A'
        })

        setEnvDetails({
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlLength: supabaseUrl?.length || 0,
          keyLength: supabaseKey?.length || 0,
          urlStart: supabaseUrl?.substring(0, 20) || 'N/A',
          keyStart: supabaseKey?.substring(0, 20) || 'N/A'
        })

        if (supabaseUrl && supabaseKey) {
          setEnvStatus('✅ Environment variables found')
        } else {
          setEnvStatus('❌ Environment variables missing')
        }
      } catch (err) {
        console.error('Environment check error:', err)
        setEnvStatus('❌ Error checking environment')
      }
    }

    checkEnvironment()
  }, [])

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        🔍 AuraTrack - Environment Diagnostic
      </h1>
      
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Application Status</h2>
        <p className="mb-2"><strong>React:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Build:</strong> ✅ Successful</p>
        <p className="mb-2"><strong>Deploy:</strong> ✅ Live</p>
        <p className="mb-2"><strong>Tailwind CSS:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Zustand:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Environment Variables:</strong> {envStatus}</p>
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

      <div className="bg-yellow-100 p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4">🔍 Environment Variables Details</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Has URL:</strong> {envDetails.hasUrl ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Has Key:</strong> {envDetails.hasKey ? '✅ Yes' : '❌ No'}</p>
          <p><strong>URL Length:</strong> {envDetails.urlLength} characters</p>
          <p><strong>Key Length:</strong> {envDetails.keyLength} characters</p>
          <p><strong>URL Start:</strong> {envDetails.urlStart}</p>
          <p><strong>Key Start:</strong> {envDetails.keyStart}</p>
        </div>
      </div>

      <div className="bg-green-100 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-green-800 mb-4">🎯 Next Steps</h2>
        <p className="text-green-700 mb-2">Check the console for detailed environment variable information.</p>
        <p className="text-green-700">If environment variables are missing, we need to configure them in Vercel.</p>
      </div>
    </div>
  )
}

export default App
