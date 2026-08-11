import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ScanLine, BarChart3, Baby, Sparkles, Building2, GraduationCap, ShieldAlert, Award } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

export default function Sidebar({ activeTab, onTabChange, onOpenAdmin, onOpenPartner }) {
  const { t } = useTranslation();
  const { isChildMode, toggleChildMode } = useChildMode();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard', 'SOC Dashboard') },
    { id: 'scanner', icon: ScanLine, label: t('nav.scanner', 'AI Threat Scanner') },
    { id: 'aihub', icon: Sparkles, label: 'AI Intelligence Hub' },
    { id: 'academy', icon: GraduationCap, label: 'Kavach Cyber Academy' },
    { id: 'partner', icon: Building2, action: onOpenPartner, label: 'MeitY & Founder Portal' },
    { id: 'childSafety', icon: Baby, action: toggleChildMode, isToggle: true, label: t('nav.childSafety', 'Child & Family Guard') },
    { id: 'analytics', icon: BarChart3, label: t('nav.analytics', 'Security Analytics') },
  ];

  return (
    <aside className="sidebar-nav hidden md:flex flex-col w-16 lg:w-56 h-full bg-[#0B0F19] border-r border-[#1E2D4A] py-4 items-center lg:items-stretch z-40 font-mono select-none">
      <div className="flex flex-col space-y-1.5 w-full px-2">
        <div className="hidden lg:block px-3 py-2 text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider">
          Enterprise Cyber Navigation
        </div>

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
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold ${
                isActive
                  ? item.isToggle
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : item.id === 'aihub'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:bg-[#131B2E] hover:text-slate-100 border border-transparent'
              }`}
              title={item.label}
            >
              {isActive && (
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-3/4 rounded-r-md ${
                    item.isToggle
                      ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                      : item.id === 'aihub'
                      ? 'bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                      : 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]'
                  }`}
                />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline truncate">{item.label}</span>

              {/* Tooltip for Icon-only Mode */}
              <div className="lg:hidden absolute left-14 px-2.5 py-1 bg-[#131B2E] border border-[#27395C] text-slate-100 text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none font-bold">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Enterprise Badge */}
      <div className="mt-auto px-3 pt-4 hidden lg:block">
        <div className="p-3 bg-[#131B2E] border border-[#27395C] rounded-xl text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300 font-bold uppercase">
            <Award size={13} className="text-amber-400" />
            <span>CERT-In & MeitY Aligned</span>
          </div>
          <p className="text-[9px] text-[var(--text-muted)]">National AI Threat Intelligence Engine</p>
        </div>
      </div>
    </aside>
  );
}
