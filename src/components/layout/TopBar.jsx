import React, { useState, useEffect, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, HelpCircle, Bot, Baby, Globe, Sun, Moon, Lock, Download, User, Building2, LogOut, RefreshCw, KeyRound, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChildMode } from '../../context/ChildModeContext';
import { usePwaInstall } from '../../hooks/usePWAInstall';
import { useAuth } from '../../context/AuthContext';

const TopBar = memo(({ onToggleChat, onToggleHelp, onOpenAdmin, onOpenPartner }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const { isInstalled, installApp } = usePwaInstall();
  const { user, isAuthenticated, logout, openLoginModal, login } = useAuth();
  
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
    <header className="h-12 bg-[#0B0F19] border-b border-[#1E2D4A] px-3 sm:px-4 flex items-center justify-between font-mono text-slate-200 z-40 select-none relative">
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

        {/* 👤 HIGH-VISIBILITY GUEST USER & ACCOUNT SWITCHER BUTTON */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#131B2E] border-2 border-emerald-500/60 text-emerald-400 hover:border-emerald-400 text-xs font-bold transition-all shadow-lg animate-pulse"
            title="Click to Switch Account or Login"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center shrink-0">
              <User className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="max-w-[95px] sm:max-w-[120px] truncate">
              {isAuthenticated ? user?.name : 'Guest User'}
            </span>
            <ChevronDown size={14} className="text-emerald-400" />
          </button>

          {/* 🔽 FIXED PORTAL ACCOUNT SWITCHER MODAL (100% Guaranteed Never to Clip) */}
          {showUserMenu && (
            <div className="fixed top-14 right-3 sm:right-6 z-[9999] w-72 sm:w-80 bg-[#131B2E] border-2 border-[var(--accent)] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.85)] p-4 font-mono text-xs space-y-3 text-slate-200 backdrop-blur-md">
              {/* Account Status Header */}
              <div className="p-3 bg-[#0B0F19] rounded-xl border border-[#27395C] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase">
                  <span>Current Session</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ACTIVE
                  </span>
                </div>
                <div className="font-extrabold text-slate-100 text-sm truncate">
                  {isAuthenticated ? user?.name : 'Guest User (Default)'}
                </div>
                <div className="text-[10px] text-cyan-300 truncate">
                  {isAuthenticated ? user?.email : 'No registration required • Full feature access'}
                </div>
              </div>

              {/* User-Friendly Account Action Buttons */}
              <div className="space-y-2">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-1">
                  Switch Account / Sign In:
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    openLoginModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  <RefreshCw size={15} />
                  <span>Switch Account / Sign In</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      login('google');
                      setShowUserMenu(false);
                    }}
                    className="py-2 px-2.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    onClick={() => {
                      login('github');
                      setShowUserMenu(false);
                    }}
                    className="py-2 px-2.5 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all border border-slate-700 shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    login('guest');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0B0F19] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all border border-[#27395C]"
                >
                  <User size={14} className="text-emerald-400" />
                  <span>Use Guest Mode</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold rounded-xl text-xs transition-all border border-amber-500/30"
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
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs transition-all border border-rose-500/30 mt-1"
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
