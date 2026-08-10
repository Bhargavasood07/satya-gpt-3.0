import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'satya_user';
const CHAT_HISTORY_KEY = 'satya_chat_history';

/**
 * Authentication Provider for SATYA-GPT
 * Provides simulated local auth (OAuth-ready UI) with localStorage persistence
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isAuthenticated = !!user;

  // Login handler (simulated OAuth — stores user profile locally)
  const login = useCallback((provider) => {
    const profiles = {
      google: {
        name: 'SATYA User',
        email: 'user@gmail.com',
        provider: 'google',
        avatar: null,
        loginTime: new Date().toISOString(),
        id: 'google_' + Date.now(),
      },
      github: {
        name: 'SATYA Dev',
        email: 'dev@github.com',
        provider: 'github',
        avatar: null,
        loginTime: new Date().toISOString(),
        id: 'github_' + Date.now(),
      },
      guest: {
        name: 'Guest User',
        email: 'guest@satya-gpt.app',
        provider: 'guest',
        avatar: null,
        loginTime: new Date().toISOString(),
        id: 'guest_' + Date.now(),
      },
    };

    const userProfile = profiles[provider] || profiles.guest;
    setUser(userProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
    setIsLoginModalOpen(false);
    return userProfile;
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Keep chat history even after logout for convenience
  }, []);

  // Chat history persistence (keyed by user ID)
  const saveChatHistory = useCallback((messages) => {
    if (!user) return;
    try {
      const historyMap = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '{}');
      historyMap[user.id] = messages.slice(-50); // Keep last 50 messages
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(historyMap));
    } catch {
      // Storage quota exceeded — silently fail
    }
  }, [user]);

  const loadChatHistory = useCallback(() => {
    if (!user) return [];
    try {
      const historyMap = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || '{}');
      return historyMap[user.id] || [];
    } catch {
      return [];
    }
  }, [user]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    saveChatHistory,
    loadChatHistory,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
