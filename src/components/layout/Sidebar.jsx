import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ScanLine, BarChart3, Baby, Sparkles, Building2, GraduationCap, BookOpen, Award } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

const NAV_ITEMS = [
  {
    group: 'Main',
    items: [
      { id: 'dashboard',   icon: LayoutDashboard, label: 'SOC Dashboard',        key: 'nav.dashboard' },
      { id: 'scanner',     icon: ScanLine,        label: 'Threat Scanner',        key: 'nav.scanner' },
      { id: 'aihub',       icon: Sparkles,        label: 'AI Intelligence Hub',   key: 'nav.aihub' },
    ],
  },
  {
    group: 'Tools',
    items: [
      { id: 'academy',     icon: GraduationCap,   label: 'Cyber Academy',         key: 'nav.academy' },
      { id: 'childSafety', icon: Baby,            label: 'Child Safety Guard',    key: 'nav.childSafety', isToggle: true },
      { id: 'analytics',   icon: BarChart3,       label: 'Security Analytics',    key: 'nav.analytics' },
    ],
  },
  {
    group: 'Resources',
    items: [
      { id: 'guidedocs',   icon: BookOpen,        label: 'Guide & Docs',          key: 'nav.guidedocs' },
      { id: 'partner',     icon: Building2,       label: 'MeitY & Founder Portal', key: 'nav.partner', isAction: true },
    ],
  },
];

export default function Sidebar({ activeTab, onTabChange, onOpenAdmin, onOpenPartner }) {
  const { t } = useTranslation();
  const { isChildMode, toggleChildMode } = useChildMode();

  return (
    <aside
      className="hidden md:flex flex-col w-14 lg:w-52 h-full py-4 shrink-0 select-none z-40"
      style={{
        background: 'var(--surface-raised)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto px-2">
        {NAV_ITEMS.map(({ group, items }) => (
          <div key={group}>
            {/* Group label — desktop only */}
            <div
              className="hidden lg:block px-3 pb-1.5 text-caption uppercase tracking-widest font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              {group}
            </div>

            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = item.isToggle
                  ? isChildMode
                  : activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isAction) onOpenPartner?.();
                      else if (item.isToggle) toggleChildMode();
                      else onTabChange(item.id);
                    }}
                    className="group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{
                      background: isActive ? 'var(--primary-muted)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--surface-overlay)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                    title={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4/5 rounded-r-full"
                        style={{ background: 'var(--primary)' }}
                      />
                    )}

                    <Icon size={17} className="shrink-0" />
                    <span className="hidden lg:block text-small truncate">
                      {t(item.key, item.label)}
                    </span>

                    {/* Tooltip — icon-only mode */}
                    <div
                      className="lg:hidden absolute left-12 px-2.5 py-1.5 rounded-md text-small font-semibold whitespace-nowrap z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg"
                      style={{
                        background: 'var(--surface-overlay)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {t(item.key, item.label)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="hidden lg:block px-3 pt-4 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div
          className="px-3 py-2.5 rounded-lg"
          style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-1.5 text-caption font-semibold" style={{ color: 'var(--warning)' }}>
            <Award size={12} />
            <span>MeitY / CERT-In Aligned</span>
          </div>
          <p className="text-caption mt-0.5" style={{ color: 'var(--text-muted)' }}>
            National Threat Intelligence
          </p>
        </div>
      </div>
    </aside>
  );
}
