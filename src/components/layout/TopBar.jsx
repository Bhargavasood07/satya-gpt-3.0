import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, Globe, Sun, Moon, User, ChevronDown, Award, Menu, Sparkles } from 'lucide-react';
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
    <header className="h-13 bg-[#060a14] border-b border-[#1b2a47] px-2.5 sm:px-4 flex items-center justify-between font-mono text-slate-200 z-40 select-none relative shadow-xl backdrop-blur-md">
      {/* Left: 3-Line Hamburger Drawer Button & Logo */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* ☰ 3-Line Hamburger Menu Button (Toggles full drawer sidebar) */}
        <button
          onClick={onToggleDrawer}
          className="p-2 rounded-xl bg-[#0d1629] border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-slate-950 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] focus:outline-none flex items-center justify-center shrink-0 cursor-pointer animate-pulse"
          title="Open Menu & Tools (3-Line Sidebar)"
        >
          <Menu size={20} className="font-extrabold" />
        </button>

        {/* Brand Logo & Name */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
          title="SATYA-GPT AI Cyber Security Platform"
        >
          <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.35)] shrink-0">
            <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--accent)]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline space-y-0.5 sm:space-y-0 sm:space-x-1.5">
            <span className="font-extrabold text-xs sm:text-base tracking-wider text-slate-100 leading-none">
              SATYA<span className="text-[var(--accent)]">-GPT</span>
            </span>
            <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 font-extrabold tracking-widest uppercase flex items-center gap-1 shadow-sm shrink-0">
              <Sparkles size={10} className="text-purple-400 animate-pulse" />
              <span>v12.0 LIQUID</span>
            </span>
          </div>
        </button>
      </div>

      {/* Right Controls: Clean, Uncluttered Essential Cluster */}
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        {/* Live Clock (Desktop) */}
        <div className="hidden xl:flex items-center space-x-1 text-slate-400 text-xs">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{formatTime(time)}</span>
        </div>

        {/* 👤 GUEST USER & ACCOUNT SWITCHER BUTTON */}
        <button
          onClick={openLoginModal}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 rounded-xl bg-[#0d1629] border-2 border-emerald-500/60 text-emerald-400 hover:border-emerald-400 text-[11px] sm:text-xs font-bold transition-all shadow-md cursor-pointer"
          title="Click to Switch Account or Login"
        >
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center shrink-0">
            <User className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-400" />
          </div>
          <span className="max-w-[70px] sm:max-w-[120px] truncate">
            {isAuthenticated ? user?.name : 'Guest'}
          </span>
          <ChevronDown size={13} className="text-emerald-400" />
        </button>

        {/* English ↔ Hindi Language Switcher */}
        <button
          onClick={handleLangToggle}
          className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-xl border transition-colors text-[11px] sm:text-xs font-mono font-bold shadow-sm cursor-pointer ${
            isHindiActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-[#060a14] border-[#24375b] text-slate-200 hover:border-[var(--accent)]'
          }`}
          title="Switch Language (English / हिंदी)"
        >
          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent)]" />
          <span className="uppercase">{isHindiActive ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#0d1629] border border-[#24375b] hover:border-[var(--accent)] transition-colors cursor-pointer"
          title="Toggle Light / Liquid Crystal Theme"
        >
          {theme === 'cyber-slate' || theme === 'liquid-crystal' ? (
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
