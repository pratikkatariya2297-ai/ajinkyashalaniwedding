import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Deployment trigger: 2026-03-21T22:45:19+05:30
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
