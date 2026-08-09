import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useChildMode } from '../../context/ChildModeContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Globe, Sun, Moon, Clock, Baby, Download, Bot, HelpCircle, Lock } from 'lucide-react';
import SatyaGptLogo from '../common/SatyaGptLogo';

export default function TopBar({ onToggleChat, onToggleHelp, onOpenAdmin }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const { canInstall, isInstalled, installApp } = usePwaInstall();
  const [time, setTime] = useState(new Date());
  
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

    // Reset click count after 2 seconds
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
    <header className="glass-panel h-16 w-full flex items-center justify-between px-4 border-b border-[var(--border-card)] z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Logo with Secret Founder Triple Click Trigger */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
          title="SATYA-GPT Security Operations Center (Founder Vault: Triple-Click Logo or Ctrl+Shift+A)"
        >
          <SatyaGptLogo size={36} className="drop-shadow-[0_0_10px_var(--accent-glow)] group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-[var(--text-primary)] font-extrabold text-base md:text-lg leading-tight tracking-wider font-mono">
              {t('app.title')}
            </span>
            <span className="text-[var(--text-muted)] text-[10px] md:text-xs">
              {t('app.subtitle')}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] hidden sm:block"></div>

        <div className="hidden md:flex items-center space-x-2 bg-[var(--bg-card)] px-3 py-1 rounded-md border border-[var(--border-card)]">
          <div className="pulse-dot w-2 h-2 rounded-full bg-[var(--safe)]"></div>
          <span className="text-[var(--text-secondary)] text-xs font-mono font-semibold">
            {t('app.status')}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Help / Guide Button */}
        <button
          onClick={onToggleHelp}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono font-semibold transition-all"
          title="How to Use SATYA-GPT (User Guide)"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden xl:inline">User Guide</span>
        </button>

        {/* KAVACH AI Header Button */}
        <button
          onClick={onToggleChat}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--accent)] hover:bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-mono font-bold transition-all shadow-sm"
          title="Open KAVACH AI Cyber Shield Assistant (Ctrl+B)"
        >
          <Bot className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>KAVACH AI</span>
          <span className="hidden sm:inline-block px-1 py-0.2 bg-[var(--bg-primary)] text-[9px] text-[var(--text-muted)] rounded border border-[var(--border-card)] font-mono">
            ⌘B
          </span>
        </button>

        {/* Child Mode Toggle Button */}
        <button
          onClick={toggleChildMode}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
            isChildMode
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
              : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          title={t('childMode.toggleLabel')}
        >
          <Baby className={`w-3.5 h-3.5 ${isChildMode ? 'text-amber-400' : ''}`} />
          <span>{isChildMode ? t('app.childShieldActive') : t('app.childShieldDisabled')}</span>
        </button>

        {/* Download & Install SATYA-GPT App Button */}
        <button
          onClick={installApp}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-primary)] text-xs font-mono font-semibold transition-all shadow-sm"
          title="Download and Install SATYA-GPT Desktop/Mobile App"
        >
          <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="hidden sm:inline">{isInstalled ? 'App Installed' : 'Download App'}</span>
        </button>

        {/* Live Clock */}
        <div className="hidden lg:flex items-center space-x-1.5 text-[var(--text-secondary)]">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-mono text-xs">{formatTime(time)}</span>
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] hidden lg:block"></div>

        {/* Language Toggle */}
        <button
          onClick={handleLangToggle}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-[var(--border-card)] hover:border-[var(--accent)] transition-colors text-[var(--text-primary)] text-xs font-mono font-semibold"
        >
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{t('lang.toggle')}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-colors"
          title={theme === 'cyber-slate' ? t('theme.tacticalNavy') : t('theme.cyberSlate')}
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
