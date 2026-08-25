import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Globe, Sun, Moon, User, ChevronDown, Menu, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const TopBar = memo(({ onOpenAdmin, onToggleDrawer }) => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, openLoginModal } = useAuth();

  const handleLangToggle = () => {
    const lang = i18n.language || 'en';
    i18n.changeLanguage(lang.startsWith('hi') ? 'en' : 'hi');
  };
  const isHindi = i18n.language?.startsWith('hi');

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 select-none z-40 relative"
      style={{
        background: 'var(--surface-raised)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 rgba(59,130,246,0.06)',
      }}
    >
      {/* ── Left: Menu + Brand ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          onClick={onToggleDrawer}
          className="btn btn--ghost p-2"
          aria-label="Open navigation menu"
          title="Menu"
        >
          <Menu size={18} />
        </button>

        {/* Brand */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          aria-label="SATYA-GPT — Admin"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              SATYA<span style={{ color: 'var(--primary)' }}>-GPT</span>
            </span>
            <span
              className="hidden sm:inline-flex items-center gap-1 text-caption badge badge--primary"
            >
              <Zap size={9} />
              SOC v15
            </span>
          </div>
        </button>
      </div>

      {/* ── Right: Controls ── */}
      <div className="flex items-center gap-2">
        {/* Lang */}
        <button
          onClick={handleLangToggle}
          className="btn btn--ghost py-1.5 px-3 text-small"
          title="Toggle language"
          aria-label={isHindi ? 'Switch to English' : 'Switch to Hindi'}
        >
          <Globe size={14} style={{ color: 'var(--primary)' }} />
          <span className="font-semibold">{isHindi ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="btn btn--ghost p-2"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-label="Toggle theme"
        >
          {theme === 'light'
            ? <Moon size={15} style={{ color: 'var(--text-secondary)' }} />
            : <Sun size={15} style={{ color: 'var(--warning)' }} />
          }
        </button>

        {/* Account */}
        <button
          onClick={openLoginModal}
          className="btn btn--ghost py-1.5 px-3 gap-1.5"
          title="Account"
          aria-label="Account switcher"
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--success-muted)', border: '1px solid var(--success)' }}
          >
            <User size={11} style={{ color: 'var(--success)' }} />
          </div>
          <span className="text-small font-semibold max-w-[80px] truncate" style={{ color: 'var(--text-secondary)' }}>
            {isAuthenticated ? user?.name : 'Guest'}
          </span>
          <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
