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
    <header className="h-14 bg-[#eaeff5] border-b border-[#cbd5e1] px-3 sm:px-5 flex items-center justify-between font-mono text-slate-800 z-40 select-none relative shadow-sm">
      {/* Left: 3-Line Hamburger Drawer Button & Logo */}
      <div className="flex items-center space-x-3">
        {/* ☰ 3-Line Hamburger Menu Button */}
        <button
          onClick={onToggleDrawer}
          className="p-2 rounded-xl bg-[#f0f4f9] border border-white text-[var(--accent)] hover:bg-[#0284c7] hover:text-white transition-all shadow-[4px_4px_10px_rgba(166,180,200,0.5),-4px_-4px_10px_rgba(255,255,255,0.9)] focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
          title="Open Menu & Tools (3-Line Sidebar)"
        >
          <Menu size={20} className="font-extrabold" />
        </button>

        {/* Brand Logo & Name */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center space-x-2.5 group focus:outline-none cursor-pointer"
          title="SATYA-GPT AI Cyber Security Platform"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0284c7] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-[3px_3px_8px_rgba(2,132,199,0.3)] shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline space-y-0.5 sm:space-y-0 sm:space-x-2">
            <span className="font-extrabold text-sm sm:text-lg tracking-wider text-slate-900 leading-none">
              SATYA<span className="text-[#0284c7]">-GPT</span>
            </span>
            <span className="text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400 text-cyan-700 font-extrabold tracking-widest uppercase flex items-center gap-1 shadow-sm shrink-0">
              <Sparkles size={10} className="text-cyan-600 animate-pulse" />
              <span>NEUMORPHIC PRISM v14.0</span>
            </span>
          </div>
        </button>
      </div>

      {/* Right Controls: Clean, Uncluttered Essential Cluster */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Live Clock (Desktop) */}
        <div className="hidden xl:flex items-center space-x-1.5 text-slate-600 text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>{formatTime(time)}</span>
        </div>

        {/* 👤 GUEST USER & ACCOUNT SWITCHER BUTTON */}
        <button
          onClick={openLoginModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#f0f4f9] border border-white text-emerald-700 hover:border-emerald-500 text-xs font-extrabold transition-all shadow-[3px_3px_8px_rgba(166,180,200,0.4),-3px_-3px_8px_rgba(255,255,255,0.9)] cursor-pointer"
          title="Click to Switch Account or Login"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center shrink-0">
            <User className="w-2.5 h-2.5 text-emerald-600" />
          </div>
          <span className="max-w-[75px] sm:max-w-[120px] truncate">
            {isAuthenticated ? user?.name : 'Guest'}
          </span>
          <ChevronDown size={14} className="text-emerald-600" />
        </button>

        {/* English ↔ Hindi Language Switcher */}
        <button
          onClick={handleLangToggle}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition-colors text-xs font-mono font-extrabold shadow-sm cursor-pointer ${
            isHindiActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-800'
              : 'bg-[#f0f4f9] border-white text-slate-700 hover:border-[#0284c7]'
          }`}
          title="Switch Language (English / हिंदी)"
        >
          <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
          <span className="uppercase">{isHindiActive ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#f0f4f9] border border-white text-slate-700 hover:border-[#0284c7] transition-colors cursor-pointer shadow-[3px_3px_8px_rgba(166,180,200,0.4),-3px_-3px_8px_rgba(255,255,255,0.9)]"
          title="Toggle Dark / Neumorphic Theme"
        >
          {theme === 'cyber-slate' ? (
            <Moon className="w-3.5 h-3.5 text-[#0284c7]" />
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
