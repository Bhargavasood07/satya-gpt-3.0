import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield, Globe, Sun, Moon, User, ChevronDown, Menu, Zap,
  Search, Radio, Bell, Flame
} from 'lucide-react';
import { GitHubIcon } from '../common/GitHubIcon';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const TopBar = memo(({ onOpenAdmin, onToggleDrawer, onOpenCommandPalette, onOpenSimulator }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openLoginModal } = useAuth();

  const handleLangToggle = () => {
    const lang = i18n.language || 'en';
    i18n.changeLanguage(lang.startsWith('hi') ? 'en' : 'hi');
  };
  const isHindi = i18n.language?.startsWith('hi');

  return (
    <header
      className="flex items-center justify-between px-2.5 sm:px-6 select-none z-40 relative backdrop-blur-md w-full pt-[env(safe-area-inset-top)]"
      style={{
        height: 'calc(3.5rem + env(safe-area-inset-top, 0px))',
        background: 'var(--surface-raised)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 rgba(59,130,246,0.06)',
      }}
    >
      {/* ── Left: Menu + Brand ── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Hamburger Menu (Mobile/Drawer) */}
        <button
          onClick={onToggleDrawer}
          className="btn btn--ghost p-1.5 sm:p-2 shrink-0"
          aria-label="Open navigation menu"
          title="Menu"
        >
          <Menu size={18} />
        </button>

        {/* Brand */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 sm:gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg group min-w-0"
          aria-label="SATYA-GPT — Admin"
        >
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-md shadow-blue-500/20"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            <Shield size={15} strokeWidth={2.5} />
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[14px] sm:text-[15px] font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
              SATYA<span style={{ color: 'var(--primary)' }}>-GPT</span>
            </span>
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[10px] py-0.5 px-2 rounded-full font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25 shrink-0"
            >
              <Zap size={9} />
              SOC v18
            </span>
          </div>
        </button>
      </div>

      {/* ── Center: Modern Spotlight Quick Search (Ctrl+K) ── */}
      <div className="flex-1 max-w-md mx-3 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-inset)]/60 text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-all group cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
            <Search size={13} className="text-[var(--cyan-500)] group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors truncate">
              {t('topbar.searchPlaceholder', 'Search threats, domains, protocols... (Ctrl K)')}
            </span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] shadow-xs shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* ── Right: Live Status + Controls ── */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile Spotlight Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden btn btn--ghost p-1.5 sm:p-2"
          title="Search / Command Palette"
          aria-label="Search / Command Palette"
        >
          <Search size={16} style={{ color: 'var(--primary)' }} />
        </button>

        {/* Live SOC Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold">{t('topbar.socOnline', 'SOC Online')}</span>
          <span className="text-emerald-500/70 font-mono text-[10px]">14ms</span>
        </div>

        {/* Attack Simulator Button */}
        {onOpenSimulator && (
          <button
            onClick={onOpenSimulator}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
            title="Launch Zero-Day Cyber Attack Simulator"
          >
            <Flame size={12} className="text-rose-400" />
            <span>Simulator</span>
          </button>
        )}

        {/* Lang Toggle */}
        <button
          onClick={handleLangToggle}
          className="btn btn--ghost py-1 px-2 sm:px-2.5 text-xs font-mono"
          title="Toggle language"
          aria-label={isHindi ? 'Switch to English' : 'Switch to Hindi'}
        >
          <Globe size={13} style={{ color: 'var(--primary)' }} />
          <span className="font-semibold">{isHindi ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn--ghost p-1.5 sm:p-2"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-label="Toggle theme"
        >
          {theme === 'light'
            ? <Moon size={15} style={{ color: 'var(--text-secondary)' }} />
            : <Sun size={15} style={{ color: 'var(--warning)' }} />
          }
        </button>

        {/* GitHub Repository Link (Desktop only in topbar - on mobile it is in drawer & footer) */}
        <a
          href="https://github.com/Bhargavasood07/satya-gpt-3.0"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex btn btn--ghost p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:text-white transition-colors"
          title="GitHub Repository (Bhargavasood07/satya-gpt-3.0)"
          aria-label="GitHub Repository"
        >
          <GitHubIcon size={16} />
        </a>

        {/* Account Button */}
        <button
          onClick={openLoginModal}
          className="btn btn--ghost py-1 px-2 sm:px-3 gap-1.5 sm:gap-2 cursor-pointer"
          title={isAuthenticated ? `Account: ${user?.name || 'User'} (${user?.email || user?.username || 'Authenticated'})` : 'Sign In'}
          aria-label="Account switcher"
        >
          {user?.avatar ? (
            <div className="relative w-5 h-5 rounded-full shrink-0">
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {user.provider === 'google' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 border border-slate-900" />
              )}
              {user.provider === 'github' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-500 border border-slate-900" />
              )}
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: isAuthenticated ? 'var(--success-muted)' : 'var(--surface-card)',
                border: `1px solid ${isAuthenticated ? 'var(--success)' : 'var(--border-subtle)'}`,
              }}
            >
              <User size={11} style={{ color: isAuthenticated ? 'var(--success)' : 'var(--text-muted)' }} />
            </div>
          )}
          <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate" style={{ color: 'var(--text-secondary)' }}>
            {isAuthenticated ? (user?.name || user?.username) : t('topbar.signIn', 'Sign In')}
          </span>
          <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
