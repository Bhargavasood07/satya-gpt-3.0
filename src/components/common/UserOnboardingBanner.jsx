import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function UserOnboardingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#131B2E] via-[#16223B] to-[#131B2E] border border-[var(--accent)]/40 p-3.5 sm:p-4 rounded-xl relative shadow-lg font-mono">
      {/* Dismiss Button with safe positioning */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#0B0F19] transition-colors z-10"
        title="Dismiss Guide"
      >
        <X size={16} />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pr-6 sm:pr-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 font-bold text-xs sm:text-sm text-[var(--text-primary)]">
              <span>Quick Guide: How to Use SATYA-GPT</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent)] text-[9px]">
                EASY TO USE
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
              Protect yourself and your family from SMS scams, fake links & phishing in 3 simple steps
            </p>
          </div>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs w-full md:w-auto pt-1 sm:pt-0">
          <div className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-lg border border-[#1E2D4A]">
            <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
            <span className="text-[var(--text-secondary)] text-[11px]">Paste Link / SMS</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-lg border border-[#1E2D4A]">
            <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
            <span className="text-[var(--text-secondary)] text-[11px]">View 92 Engine Scores</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-lg border border-[#1E2D4A]">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
            <span className="text-[var(--text-secondary)] text-[11px]">Ask KAVACH AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
