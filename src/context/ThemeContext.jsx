import { createContext, useContext, useState, useEffect } from 'react';
import { secureStorage } from '../utils/securityGuard';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return secureStorage.getItem('theme_profile') || 'cyber-slate';
    } catch {
      return 'cyber-slate';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      secureStorage.setItem('theme_profile', theme);
    } catch {
      // Storage unavailable
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev =>
      prev === 'cyber-slate' ? 'tactical-navy' : 'cyber-slate'
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
