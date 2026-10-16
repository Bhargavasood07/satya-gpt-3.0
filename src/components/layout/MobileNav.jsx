import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ScanLine, Sparkles, Baby, BookOpen, BarChart3 } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

const MOBILE_NAV = [
  { id: 'dashboard',   icon: LayoutDashboard, label: 'Home',    key: 'mobileNav.home' },
  { id: 'scanner',     icon: ScanLine,        label: 'Scan',    key: 'mobileNav.scan' },
  { id: 'aihub',       icon: Sparkles,        label: 'AI Hub',  key: 'mobileNav.aihub' },
  { id: 'analytics',   icon: BarChart3,       label: 'Reports', key: 'mobileNav.reports' },
  { id: 'guidedocs',   icon: BookOpen,        label: 'Guide',   key: 'mobileNav.guide' },
];

export default function MobileNav({ activeTab, onTabChange }) {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+3px)] backdrop-blur-xl"
      style={{
        height: 'calc(3.75rem + env(safe-area-inset-bottom, 0px))',
        background: 'var(--surface-raised)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 25px rgba(0,0,0,0.4)',
      }}
      aria-label="Mobile navigation"
    >
      {MOBILE_NAV.map(({ id, icon: Icon, label, key }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 px-0.5 rounded-xl transition-all duration-150 focus:outline-none min-w-0 overflow-hidden active:scale-95"
            style={{
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-muted)' : 'transparent',
            }}
            aria-current={isActive ? 'page' : undefined}
            aria-label={t(key, label)}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.5 : 1.8}
              className="shrink-0 transition-transform"
            />
            <span
              className="text-[9.5px] truncate max-w-full px-0.5 leading-tight text-center font-sans tracking-tight"
              style={{ fontWeight: isActive ? 700 : 500 }}
            >
              {t(key, label)}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[var(--primary)] mt-0.5 animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
