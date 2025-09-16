function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🚀 AuraTrack - Basic Test
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>✅ Application Status</h2>
        <p><strong>React:</strong> ✅ Working</p>
        <p><strong>Build:</strong> ✅ Successful</p>
        <p><strong>Deploy:</strong> ✅ Live</p>
        <p><strong>Environment:</strong> ✅ Loaded</p>
      </div>

      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2d5a2d', marginBottom: '15px' }}>🎯 Next Phase</h2>
        <p>Basic app is working! Now we can add components one by one.</p>
        <p>This confirms the build and deployment process is correct.</p>
      </div>
    </div>
  )
}

export default App
