import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import { ChildModeProvider } from './context/ChildModeContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import { initializeWebsiteSecurityGuard } from './utils/securityGuard'

// Initialize Anti-Theft & Data Protection Guard
initializeWebsiteSecurityGuard();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <ChildModeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ChildModeProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
