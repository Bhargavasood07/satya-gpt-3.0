import React from 'react';
import { Baby, ShieldCheck, ShieldAlert, AlertTriangle, Lock, Eye, Sparkles } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

export default function ChildSafetyView() {
  const { isChildMode, toggleChildMode } = useChildMode();

  return (
    <div className="space-y-5 font-mono text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131B2E] border border-[#27395C] p-4 rounded-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Baby size={22} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
              Child Guard & Family Cyber Protection Shield
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">Automatic safety filter blocking adult sites, gaming coin scams (Robux traps) & predatory links</p>
          </div>
        </div>

        <button
          onClick={toggleChildMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-md flex items-center gap-2 ${
            isChildMode
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[#0B0F19] text-slate-200 border-[#27395C] hover:border-amber-400'
          }`}
        >
          <Baby size={16} />
          <span>{isChildMode ? 'CHILD GUARD: ACTIVE' : 'TURN ON CHILD GUARD'}</span>
        </button>
      </div>

      {/* Main Status Card */}
      <div className={`p-5 rounded-xl border transition-all shadow-2xl ${
        isChildMode
          ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
          : 'bg-[#131B2E] border-[#27395C] text-slate-300'
      }`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {isChildMode ? (
              <ShieldCheck size={36} className="text-amber-400" />
            ) : (
              <ShieldAlert size={36} className="text-slate-500" />
            )}
            <div>
              <div className="text-sm font-bold uppercase">
                {isChildMode ? 'Family Cyber Protection is Fully Active' : 'Child Guard is Disabled'}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {isChildMode
                  ? 'All web links, SMS forwards & QR codes are continuously filtered against harmful content.'
                  : 'Turn on Child Guard to protect children and family members from online threats.'}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
            isChildMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {isChildMode ? 'PROTECTED' : 'OFF'}
          </span>
        </div>

        {/* 4 Feature Protection Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Lock size={14} />
              <span>Adult Site Block</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Filters inappropriate redirect links & adult domains.</p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>Game Scam Trap Block</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Blocks fake Robux, Free Diamonds & gaming login traps.</p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-[var(--accent)] flex items-center gap-1.5">
              <Eye size={14} />
              <span>Safe Search Enforcer</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">Enforces safe search parameters across web lookups.</p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Simple AI Explainer</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">KAVACH AI explains safety rules in simple student-friendly terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
