import React, { useState, useEffect, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, HelpCircle, Bot, Baby, Globe, Sun, Moon, Lock, Download, User, Building2, LogOut, RefreshCw, KeyRound } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChildMode } from '../../context/ChildModeContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useAuth } from '../../context/AuthContext';

const TopBar = memo(({ onToggleChat, onToggleHelp, onOpenAdmin, onOpenPartner }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const { isInstalled, installApp } = usePWAInstall();
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  
  const [time, setTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleLangToggle = () => {
    const currentLang = i18n.language || 'en';
    const newLang = currentLang.startsWith('hi') ? 'en' : 'hi';
    i18n.changeLanguage(newLang);
  };

  const isHindiActive = i18n.language && i18n.language.startsWith('hi');

  return (
    <header className="h-12 bg-[#0B0F19] border-b border-[#1E2D4A] px-3 sm:px-4 flex items-center justify-between font-mono text-slate-200 z-40 select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenAdmin}
          className="flex items-center space-x-2 group focus:outline-none"
          title="Triple click or Ctrl+Shift+A for Founder Vault"
        >
          <div className="w-7 h-7 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform shadow-sm">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-extrabold text-sm tracking-wider text-slate-100">
              SATYA<span className="text-[var(--accent)]">-GPT</span>
            </span>
            <span className="text-[10px] text-[var(--accent)] font-bold">v7.8</span>
          </div>
        </button>

        {/* CERT-In & MeitY Alignment Badge */}
        <button
          onClick={onOpenPartner}
          className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold hover:bg-amber-500/20 transition-all"
        >
          <Building2 size={12} className="text-amber-400" />
          <span>MeitY/CERT-In Partner</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {/* User Guide */}
        <button
          onClick={onToggleHelp}
          className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all"
          title="User Guide"
        >
          <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
          <span className="hidden xl:inline ml-1">User Guide</span>
        </button>

        {/* KAVACH AI Header Action */}
        <button
          onClick={onToggleChat}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--accent)] hover:bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-bold transition-all shadow-sm"
          title="Open KAVACH AI Assistant (Ctrl+B)"
        >
          <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>KAVACH AI</span>
        </button>

        {/* Child Mode Toggle Button */}
        <button
          onClick={toggleChildMode}
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
            isChildMode
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
              : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          title={t('childMode.toggleLabel')}
        >
          <Baby className={`w-3.5 h-3.5 ${isChildMode ? 'text-amber-400' : ''}`} />
          <span className="hidden md:inline">{isChildMode ? 'Guard Active' : 'Guard Off'}</span>
        </button>

        {/* 👤 GUEST USER & ACCOUNT SWITCHER BUTTON (Positioned Relative for Dropdown Alignment) */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#131B2E] border border-emerald-500/40 text-emerald-400 hover:border-emerald-400 text-xs font-bold transition-all shadow-md"
            title="Click to Switch Account or Login"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <User className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="max-w-[90px] sm:max-w-[110px] truncate">
              {isAuthenticated ? user?.name : 'Guest User'}
            </span>
          </button>

          {/* 🔽 ACCOUNT SWITCHER DROPDOWN (Aligned directly below Guest User button) */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-[#131B2E] border border-[#27395C] rounded-xl shadow-2xl z-[100] p-2 text-xs font-mono space-y-2 text-slate-200">
              {/* Account Status Header */}
              <div className="px-3 py-2 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] space-y-0.5">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Current Active Session</div>
                <div className="font-bold text-emerald-400 text-xs truncate flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isAuthenticated ? user?.name : 'Guest User (Default)'}</span>
                </div>
                {isAuthenticated && (
                  <div className="text-[9px] text-slate-400 truncate">{user?.email}</div>
                )}
              </div>

              {/* Account Switcher Options */}
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    openLoginModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] text-[var(--accent)] font-bold hover:bg-[var(--accent)] hover:text-slate-950 transition-all text-xs shadow-sm"
                >
                  <RefreshCw size={14} />
                  <span>Switch Account / Login</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B0F19] border border-[#27395C] text-amber-300 hover:border-amber-400 transition-all text-xs font-semibold"
                >
                  <KeyRound size={14} className="text-amber-400" />
                  <span>Founder Admin Vault</span>
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-bold mt-1"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Download App Button */}
        <button
          onClick={installApp}
          className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-primary)] text-xs font-semibold transition-all"
          title="Download App"
        >
          <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{isInstalled ? 'Installed' : 'App'}</span>
        </button>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center space-x-1 text-[var(--text-secondary)]">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-xs">{formatTime(time)}</span>
        </div>

        {/* English ↔ Hindi Language Switcher */}
        <button
          onClick={handleLangToggle}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-colors text-xs font-mono font-bold shadow-sm ${
            isHindiActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-[#0B0F19] border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
          title="Switch Language (English / हिंदी)"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[11px] uppercase">{isHindiActive ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1 sm:px-2 sm:py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-colors"
          title="Toggle Theme"
        >
          {theme === 'cyber-slate' ? (
            <Moon className="w-3.5 h-3.5 text-[var(--accent)]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
