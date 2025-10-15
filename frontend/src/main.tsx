import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style/_main.css'
import { AppContextProvider, AppContextDebug } from './context/AppContext.tsx'
import { BrowseContextProvider } from './context/BrowseContext.tsx'
import { ToastContextProvider } from './context/ToastContext.tsx'
import { DEV } from './util/backendFetch.ts'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <BrowseContextProvider>
          <ToastContextProvider>
            {/* {DEV && <AppContextDebug />} */}
            <App />
          </ToastContextProvider>
        </BrowseContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
