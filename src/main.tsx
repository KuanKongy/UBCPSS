import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'

// /admin is the content dashboard: a separate lazy chunk, so the public site
// never downloads the Supabase client or the editors. vercel.json's SPA
// rewrite already serves index.html for every path.
const AdminApp = lazy(() => import('./admin/AdminApp'))
const isAdminPath = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPath ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
