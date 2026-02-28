import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

// API base URL: empty = same origin (production). Set VITE_API_URL=http://localhost:5000 for local dev.
// In PROD, we force it to an empty string so the browser routes requests to the same domain (Railway).
axios.defaults.baseURL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL ?? '');

// Log 400/4xx so you can see the real reason in console (e.g. "User already exists", "No order items")
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || err.config?.baseURL;
    const msg = err.response?.data?.message;
    if (status === 400 && msg) {
      console.warn('[API 400]', url, '→', msg);
    } else if (status && status >= 400) {
      console.warn('[API', status + ']', url, msg || err.message);
    }
    return Promise.reject(err);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
