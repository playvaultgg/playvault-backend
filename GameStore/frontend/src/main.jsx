import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

// API base URL: empty = same origin (production). Set VITE_API_URL=http://localhost:5000 for local dev.
// In PROD, we force it to an empty string so the browser routes requests to the same domain (Railway).
axios.defaults.baseURL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL ?? '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
