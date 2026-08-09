import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ScanLine, Bot, Rss, Lock, Baby } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

export default function MobileNav({ activeTab, onTabChange, onToggleChat, onOpenAdmin }) {
  const { t } = useTranslation();
  const { isChildMode, toggleChildMode } = useChildMode();

  const mobileNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'scanner', icon: ScanLine, label: 'Scanner' },
    { id: 'kavachAi', icon: Bot, action: onToggleChat, label: 'KAVACH AI' },
    { id: 'feeds', icon: Rss, label: 'Feeds' },
    { id: 'childSafety', icon: Baby, action: toggleChildMode, isToggle: true, label: 'Guard' },
    { id: 'adminVault', icon: Lock, action: onOpenAdmin, label: 'Admin' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131B2E] border-t border-[#27395C] z-40 px-2 flex items-center justify-around shadow-2xl font-mono">
      {mobileNavItems.map((item) => {
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
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all font-mono ${
              isActive
                ? item.isToggle
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-[var(--accent)] bg-[var(--accent-muted)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon size={20} className={item.id === 'kavachAi' ? 'animate-pulse' : ''} />
            <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
