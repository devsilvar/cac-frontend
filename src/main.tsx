import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'

// React 19 with new createRoot API
const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CustomerAuthProvider>
          <App />
        </CustomerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)