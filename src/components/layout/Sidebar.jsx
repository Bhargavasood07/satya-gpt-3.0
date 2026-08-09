import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ScanLine, Rss, BarChart3, Baby, Lock } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

export default function Sidebar({ activeTab, onTabChange, onOpenAdmin }) {
  const { t } = useTranslation();
  const { isChildMode, toggleChildMode } = useChildMode();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard', 'Dashboard') },
    { id: 'scanner', icon: ScanLine, label: t('nav.scanner', 'AI Scanner') },
    { id: 'feeds', icon: Rss, label: t('nav.feeds', 'Intel Feeds') },
    { id: 'childSafety', icon: Baby, action: toggleChildMode, isToggle: true, label: t('nav.childSafety', 'Child Guard') },
    { id: 'analytics', icon: BarChart3, label: t('nav.analytics', 'Analytics') },
    { id: 'adminVault', icon: Lock, action: onOpenAdmin, label: 'Admin Vault' },
  ];

  return (
    <aside className="sidebar-nav hidden md:flex flex-col w-16 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-card)] py-4 items-center z-40 font-mono">
      <div className="flex flex-col space-y-4 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.isToggle && isChildMode);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`group relative flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? item.isToggle
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'bg-[var(--accent-muted)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }`}
              title={item.label}
            >
              {isActive && (
                <div
                  className={`absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-3/4 rounded-r-md ${
                    item.isToggle ? 'bg-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]' : 'bg-[var(--accent)] drop-shadow-[0_0_5px_var(--accent-glow)]'
                  }`}
                />
              )}
              <Icon className="w-6 h-6" />

              {/* Tooltip */}
              <div className="absolute left-14 px-2 py-1 bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-primary)] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none font-semibold">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
