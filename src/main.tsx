import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializePerformanceMonitoring } from './lib/performance'

// Initialize performance monitoring for constitutional compliance
if (typeof window !== 'undefined') {
  initializePerformanceMonitoring();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
