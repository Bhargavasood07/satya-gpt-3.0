import React, { createContext, useContext, useState, useEffect } from 'react';
import { secureStorage } from '../utils/securityGuard';

const ChildModeContext = createContext();

export const ChildModeProvider = ({ children }) => {
  const [isChildMode, setIsChildMode] = useState(() => {
    const saved = secureStorage.getItem('child_guard_mode');
    return saved !== null ? saved : true; // Default to Child Safety ON for family protection
  });

  useEffect(() => {
    secureStorage.setItem('child_guard_mode', isChildMode);
  }, [isChildMode]);

  const toggleChildMode = () => {
    setIsChildMode((prev) => !prev);
  };

  return (
    <ChildModeContext.Provider value={{ isChildMode, toggleChildMode }}>
      {children}
    </ChildModeContext.Provider>
  );
};

export const useChildMode = () => {
  const context = useContext(ChildModeContext);
  if (!context) {
    throw new Error('useChildMode must be used within a ChildModeProvider');
  }
  return context;
};
