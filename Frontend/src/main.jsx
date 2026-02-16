import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider} from './context/AuthContext'
import { SearchProvider } from './context/SearchContext'
import { UIProvider } from './context/UIContext'
import { ToastProvider } from './context/ToastContext'

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <UIProvider>
          <AuthProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </AuthProvider>
        </UIProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
