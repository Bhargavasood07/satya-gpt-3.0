import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, Globe, Sun, Moon, User, ChevronDown, Award, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePwaInstall } from '../../hooks/usePWAInstall';
import { useAuth } from '../../context/AuthContext';

const TopBar = memo(({ onOpenAdmin, onToggleDrawer }) => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openLoginModal } = useAuth();
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
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
    <header className="h-13 bg-[#060913] border-b border-[#1E2D4A] px-3 sm:px-4 flex items-center justify-between font-mono text-slate-200 z-40 select-none relative shadow-xl">
      {/* Left: 3-Line Hamburger Drawer Button & Logo */}
      <div className="flex items-center space-x-3">
        {/* ☰ 3-Line Hamburger Menu Button (Toggles full drawer sidebar) */}
        <button
          onClick={onToggleDrawer}
          className="p-2 rounded-xl bg-[#0D1527] border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-slate-950 transition-all shadow-md focus:outline-none flex items-center justify-center shrink-0"
          title="Open Menu & Tools (3-Line Sidebar)"
        >
          <Menu size={20} className="font-extrabold" />
        </button>

        {/* Brand Logo & Name */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center space-x-2 group focus:outline-none"
          title="SATYA-GPT AI Cyber Security Platform"
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(0,229,255,0.3)]">
            <Shield className="w-4.5 h-4.5 text-[var(--accent)]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-slate-100">
              SATYA<span className="text-[var(--accent)]">-GPT</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-extrabold tracking-widest uppercase hidden sm:flex items-center gap-1">
              <Award size={10} className="text-amber-400" />
              v11.5 PRO
            </span>
          </div>
        </button>
      </div>

      {/* Right Controls: Clean, Uncluttered Essential Cluster */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Live Clock (Desktop) */}
        <div className="hidden xl:flex items-center space-x-1 text-slate-400 text-xs">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{formatTime(time)}</span>
        </div>

        {/* 👤 GUEST USER & ACCOUNT SWITCHER BUTTON */}
        <button
          onClick={openLoginModal}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#0D1527] border-2 border-emerald-500/60 text-emerald-400 hover:border-emerald-400 text-xs font-bold transition-all shadow-md"
          title="Click to Switch Account or Login"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center shrink-0">
            <User className="w-2.5 h-2.5 text-emerald-400" />
          </div>
          <span className="max-w-[85px] sm:max-w-[120px] truncate">
            {isAuthenticated ? user?.name : 'Guest User'}
          </span>
          <ChevronDown size={14} className="text-emerald-400" />
        </button>

        {/* English ↔ Hindi Language Switcher */}
        <button
          onClick={handleLangToggle}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border transition-colors text-xs font-mono font-bold shadow-sm ${
            isHindiActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-[#060913] border-[#27395C] text-slate-200 hover:border-[var(--accent)]'
          }`}
          title="Switch Language (English / हिंदी)"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[11px] uppercase">{isHindiActive ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#0D1527] border border-[#27395C] hover:border-[var(--accent)] transition-colors"
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
