import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Agregar estilos básicos inline para evitar problemas con CSS
const style = document.createElement('style')
style.textContent = `
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
