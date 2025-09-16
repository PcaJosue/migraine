function App() {
  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        🚀 AuraTrack - Tailwind Test
      </h1>
      
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✅ Application Status</h2>
        <p className="mb-2"><strong>React:</strong> ✅ Working</p>
        <p className="mb-2"><strong>Build:</strong> ✅ Successful</p>
        <p className="mb-2"><strong>Deploy:</strong> ✅ Live</p>
        <p className="mb-2"><strong>Environment:</strong> ✅ Loaded</p>
        <p className="mb-2"><strong>Tailwind CSS:</strong> ✅ Working</p>
      </div>

      <div className="bg-green-100 p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-green-800 mb-4">🎯 Next Phase</h2>
        <p className="text-green-700 mb-2">Tailwind CSS is working! Now let's add Zustand stores.</p>
        <p className="text-green-700">This confirms CSS and styling are not the issue.</p>
      </div>
    </div>
  )
}

export default App
