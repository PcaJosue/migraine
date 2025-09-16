import { create } from 'zustand'

// Store simple para probar Zustand
const useTestStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

function App() {
  const { count, increment, decrement } = useTestStore()

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        🚀 AuraTrack - Zustand Test
      </h1>
      
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Application Status</h2>
        <p className="mb-2"><strong>React:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Build:</strong> ✅ Successful</p>
        <p className="mb-2"><strong>Deploy:</strong> ✅ Live</p>
        <p className="mb-2"><strong>Environment:</strong> ✅ Loaded</p>
        <p className="mb-2"><strong>Tailwind CSS:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Zustand:</strong> ✅ Working</p>
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

      <div className="bg-green-100 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-green-800 mb-4">🎯 Next Phase</h2>
        <p className="text-green-700 mb-2">Zustand is working! Now let's add Supabase.</p>
        <p className="text-green-700">This confirms state management is not the issue.</p>
      </div>
    </div>
  )
}

export default App
