import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'satya_user';
const CHAT_HISTORY_KEY = 'satya_chat_history';

/**
 * Authentication Provider for SATYA-GPT
 * Provides simulated local auth (Email Magic Link, Google, GitHub, Guest) with localStorage persistence
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

  // Social Login handler (Google, GitHub, Guest) with custom data support
  const login = useCallback((provider, customData = {}) => {
    const defaultProfiles = {
      google: {
        name: customData.name || 'Bhargava Sood',
        email: customData.email || 'bhargavasood07@gmail.com',
        provider: 'google',
        avatar: customData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customData.name || 'Bhargava Sood')}&backgroundColor=4285F4&textColor=ffffff`,
        loginTime: new Date().toISOString(),
        id: customData.id || 'google_' + Date.now(),
        verified: true,
        providerLabel: 'Google ID Verified',
      },
      github: {
        name: customData.name || 'Bhargava sood',
        email: customData.email || `${customData.username || 'Bhargavasood07'}@users.noreply.github.com`,
        username: customData.username || 'Bhargavasood07',
        provider: 'github',
        avatar: customData.avatar || 'https://avatars.githubusercontent.com/u/186374284?v=4',
        loginTime: new Date().toISOString(),
        id: customData.id || 'github_' + Date.now(),
        verified: true,
        providerLabel: 'GitHub Verified Developer',
      },
      guest: {
        name: 'Guest User',
        email: 'guest@satya-gpt.app',
        provider: 'guest',
        avatar: null,
        loginTime: new Date().toISOString(),
        id: 'guest_' + Date.now(),
        verified: false,
        providerLabel: 'Guest Session',
      },
    };

    const baseProfile = defaultProfiles[provider] || defaultProfiles.guest;
    const userProfile = {
      ...baseProfile,
      ...customData,
      provider: provider || 'guest',
      loginTime: new Date().toISOString(),
    };

    setUser(userProfile);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));

      // Persist last used account & account history for quick selection
      if (userProfile.provider === 'github' && (userProfile.username || userProfile.name)) {
        const uName = userProfile.username || userProfile.name;
        localStorage.setItem('satya_last_github_username', uName);
        const existing = JSON.parse(localStorage.getItem('satya_saved_github_accounts') || '[]');
        const updated = [
          {
            login: uName,
            name: userProfile.name || uName,
            avatar_url: userProfile.avatar || `https://avatars.githubusercontent.com/${encodeURIComponent(uName)}`,
            bio: userProfile.bio || 'Verified GitHub Developer',
            public_repos: userProfile.public_repos ?? 0,
            lastLogin: new Date().toISOString(),
          },
          ...existing.filter(a => a.login?.toLowerCase() !== uName.toLowerCase()),
        ].slice(0, 5);
        localStorage.setItem('satya_saved_github_accounts', JSON.stringify(updated));
      } else if (userProfile.provider === 'google' && userProfile.email) {
        localStorage.setItem('satya_last_google_email', userProfile.email);
        localStorage.setItem('satya_last_google_name', userProfile.name || 'User');
        const existing = JSON.parse(localStorage.getItem('satya_saved_google_accounts') || '[]');
        const updated = [
          {
            email: userProfile.email,
            name: userProfile.name || 'User',
            avatar: userProfile.avatar,
            lastLogin: new Date().toISOString(),
          },
          ...existing.filter(a => a.email?.toLowerCase() !== userProfile.email.toLowerCase()),
        ].slice(0, 5);
        localStorage.setItem('satya_saved_google_accounts', JSON.stringify(updated));
      }

      // Save global last used session
      localStorage.setItem('satya_last_used_account', JSON.stringify({
        provider: userProfile.provider,
        name: userProfile.name,
        email: userProfile.email,
        username: userProfile.username,
        avatar: userProfile.avatar,
        lastLogin: new Date().toISOString(),
      }));
    } catch {
      // Storage full or private mode
    }
    setIsLoginModalOpen(false);
    return userProfile;
  }, []);

  // Google ID Sign-in handler
  const loginWithGoogle = useCallback((googleData = {}) => {
    return login('google', googleData);
  }, [login]);

  // GitHub ID Sign-in handler
  const loginWithGitHub = useCallback((githubData = {}) => {
    return login('github', githubData);
  }, [login]);

  // Custom Email Sign-In handler (Magic Link / Passwordless Email Login)
  const loginWithEmail = useCallback((emailInput, customName = '') => {
    const cleanEmail = emailInput ? emailInput.trim().toLowerCase() : 'user@example.com';
    const emailPrefix = cleanEmail.split('@')[0] || 'User';
    const formattedName = customName || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    const emailProfile = {
      name: formattedName,
      email: cleanEmail,
      provider: 'email',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=06b6d4&textColor=ffffff`,
      loginTime: new Date().toISOString(),
      id: 'email_' + Date.now(),
      verified: true,
      providerLabel: 'Magic Link Verified',
    };

    setUser(emailProfile);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(emailProfile));
    } catch {
      // Storage full or private mode
    }
    setIsLoginModalOpen(false);
    return emailProfile;
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
    loginWithGoogle,
    loginWithGitHub,
    loginWithEmail,
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
