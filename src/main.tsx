import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

if (import.meta.env.DEV) {
  const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (faviconLink) {
    const baseHref = faviconLink.getAttribute('href')?.split('?')[0] ?? '/favicon.svg'
    faviconLink.href = `${baseHref}?v=${Date.now()}`
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
