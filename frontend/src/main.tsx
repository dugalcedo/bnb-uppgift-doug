import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style/_main.css'
import { AppContextProvider, AppContextDebug } from './context/AppContext.tsx'
import { DEV } from './util/backendFetch.ts'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        {DEV && <AppContextDebug />}
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
