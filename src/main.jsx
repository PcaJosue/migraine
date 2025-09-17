import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (typeof global === 'undefined') {
  var global = globalThis;
}

// También asegúrate de que headers esté disponible
if (typeof globalThis !== 'undefined' && !globalThis.headers) {
  globalThis.headers = {};
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
