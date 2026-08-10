import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useChildMode } from '../../context/ChildModeContext';
import { useAuth } from '../../context/AuthContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Globe, Sun, Moon, Clock, Baby, Download, Bot, HelpCircle, User, LogOut } from 'lucide-react';
import SatyaGptLogo from '../common/SatyaGptLogo';

export default function TopBar({ onToggleChat, onToggleHelp, onOpenAdmin }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();
  const { isInstalled, installApp } = usePwaInstall();
  const [time, setTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Secret Founder Click Counter (Triple click logo to open Founder Admin Vault)
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        onOpenAdmin();
        return 0;
      }
      return next;
    });

    setTimeout(() => {
      setLogoClickCount(0);
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(undefined, {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleLangToggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="glass-panel h-14 sm:h-16 w-full flex items-center justify-between px-3 sm:px-4 border-b border-[var(--border-card)] z-50 select-none overflow-hidden">
      {/* Left Section: Logo & Title */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 cursor-pointer group"
          title="SATYA-GPT SOC (Founder Vault: Triple-Click Logo or Ctrl+Shift+A)"
        >
          <SatyaGptLogo size={32} className="drop-shadow-[0_0_8px_var(--accent-glow)] group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-[var(--text-primary)] font-extrabold text-sm sm:text-base leading-tight tracking-wider font-mono">
              SATYA-GPT
            </span>
            <span className="text-[var(--text-muted)] text-[9px] sm:text-[10px] hidden sm:block">
              {t('app.subtitle')}
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-[var(--border-color)] hidden md:block"></div>

        <div className="hidden lg:flex items-center space-x-2 bg-[var(--bg-card)] px-2.5 py-0.5 rounded-md border border-[var(--border-card)]">
          <div className="pulse-dot w-2 h-2 rounded-full bg-[var(--safe)]"></div>
          <span className="text-[var(--text-secondary)] text-xs font-mono font-semibold">
            {t('app.status')}
          </span>
        </div>
      </div>

      {/* Right Section: Compact Responsive Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 font-mono">
        {/* User Guide */}
        <button
          onClick={onToggleHelp}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all"
          title="User Guide"
        >
          <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
          <span className="hidden xl:inline ml-1">User Guide</span>
        </button>

        {/* KAVACH AI Header Action (Desktop/Tablet) */}
        <button
          onClick={onToggleChat}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--accent)] hover:bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-bold transition-all shadow-sm"
          title="Open KAVACH AI Assistant (Ctrl+B)"
        >
          <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>KAVACH AI</span>
        </button>

        {/* Child Mode Toggle Button (Desktop/Tablet) */}
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

        {/* User Auth Button */}
        <div className="relative">
          {isAuthenticated ? (
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-emerald-500/40 text-emerald-400 text-xs font-semibold transition-all hover:bg-emerald-500/10"
              title={user?.name || 'User'}
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <User className="w-2.5 h-2.5" />
              </div>
              <span className="hidden md:inline max-w-[70px] truncate">{user?.name}</span>
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all"
              title="Login"
            >
              <User className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="hidden md:inline">Login</span>
            </button>
          )}

          {/* User Dropdown Menu */}
          {showUserMenu && isAuthenticated && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-[#131B2E] border border-[#27395C] rounded-xl shadow-2xl z-50 p-1.5 text-xs">
              <div className="px-2.5 py-1.5 border-b border-[#1E2D4A] mb-1">
                <div className="font-bold text-[var(--text-primary)] truncate">{user?.name}</div>
                <div className="text-[9px] text-[var(--text-muted)] truncate">{user?.email}</div>
              </div>
              <button
                onClick={() => { logout(); setShowUserMenu(false); }}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Download App Button (Desktop) */}
        <button
          onClick={installApp}
          className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-primary)] text-xs font-semibold transition-all"
          title="Download App"
        >
          <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{isInstalled ? 'Installed' : 'App'}</span>
        </button>

        {/* Live Clock (Desktop) */}
        <div className="hidden xl:flex items-center space-x-1 text-[var(--text-secondary)]">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-xs">{formatTime(time)}</span>
        </div>

        {/* Language Toggle */}
        <button
          onClick={handleLangToggle}
          className="flex items-center space-x-1 px-2 py-1 rounded-lg border border-[var(--border-card)] hover:border-[var(--accent)] transition-colors text-[var(--text-primary)] text-xs font-semibold"
          title="Change Language"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="uppercase text-[10px]">{i18n.language === 'hi' ? 'HI' : 'EN'}</span>
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
            <Sun className="w-3.5 h-3.5 text-[var(--accent)]" />
          )}
        </button>
      </div>
    </header>
  );
}
