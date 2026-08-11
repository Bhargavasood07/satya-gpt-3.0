import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, HelpCircle, Bot, Baby, Globe, Sun, Moon, Download, User, Building2, ChevronDown, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChildMode } from '../../context/ChildModeContext';
import { usePwaInstall } from '../../hooks/usePWAInstall';
import { useAuth } from '../../context/AuthContext';

const TopBar = memo(({ onToggleChat, onToggleHelp, onOpenAdmin, onOpenPartner, onOpenGovtVerification }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const { isInstalled, installApp } = usePwaInstall();
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
    <header className="h-13 bg-[#060913] border-b border-[#1E2D4A] px-3 sm:px-5 flex items-center justify-between font-mono text-slate-200 z-40 select-none relative shadow-xl">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenAdmin}
          className="flex items-center space-x-2.5 group focus:outline-none"
          title="Triple click or Ctrl+Shift+A for Founder Vault"
        >
          <div className="w-8.5 h-8.5 rounded-xl bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <Shield className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-slate-100">
              SATYA<span className="text-[var(--accent)]">-GPT</span>
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-extrabold tracking-widest uppercase flex items-center gap-1">
              <Award size={10} className="text-amber-400" />
              v10.0 GOVT EDITION
            </span>
          </div>
        </button>

        {/* CERT-In & MeitY Official Verification Badge */}
        <button
          onClick={onOpenGovtVerification || onOpenPartner}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/50 text-amber-300 text-[10px] font-bold hover:bg-amber-500/20 transition-all shadow-sm animate-pulse"
        >
          <Building2 size={13} className="text-amber-400" />
          <span>MeitY / CERT-In Accredited</span>
          <ShieldCheck size={13} className="text-emerald-400" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5">
        {/* User Guide */}
        <button
          onClick={onToggleHelp}
          className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#0D1527] border border-[#27395C] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold transition-all shadow-sm"
          title="User Guide"
        >
          <HelpCircle className="w-4 h-4 text-[var(--accent)]" />
          <span className="hidden xl:inline ml-1">User Guide</span>
        </button>

        {/* KAVACH AI Header Action */}
        <button
          onClick={onToggleChat}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#0D1527] border border-[var(--accent)] hover:bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,229,255,0.2)]"
          title="Open KAVACH AI Assistant (Ctrl+B)"
        >
          <Bot className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
          <span>KAVACH AI</span>
        </button>

        {/* Child Mode Toggle Button */}
        <button
          onClick={toggleChildMode}
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
            isChildMode
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
              : 'bg-[#0D1527] border-[#27395C] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          title={t('childMode.toggleLabel')}
        >
          <Baby className={`w-3.5 h-3.5 ${isChildMode ? 'text-amber-400' : ''}`} />
          <span className="hidden md:inline">{isChildMode ? 'Guard Active' : 'Guard Off'}</span>
        </button>

        {/* 👤 HIGH-VISIBILITY GUEST USER & ACCOUNT SWITCHER BUTTON */}
        <button
          onClick={openLoginModal}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#0D1527] border-2 border-emerald-500/60 text-emerald-400 hover:border-emerald-400 text-xs font-bold transition-all shadow-md"
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

        {/* Download App Button */}
        <button
          onClick={installApp}
          className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#0D1527] border border-[#27395C] hover:border-[var(--accent)] text-[var(--text-primary)] text-xs font-semibold transition-all"
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
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border transition-colors text-xs font-mono font-bold shadow-sm ${
            isHindiActive
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-[#060913] border-[#27395C] text-[var(--text-primary)] hover:border-[var(--accent)]'
          }`}
          title="Switch Language (English / हिंदी)"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[11px] uppercase">{isHindiActive ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#0D1527] border border-[#27395C] hover:border-[var(--accent)] transition-colors"
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
