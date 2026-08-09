import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Search, MessageSquare, X, ArrowRight, HelpCircle } from 'lucide-react';

export default function UserOnboardingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#131B2E] via-[#16223B] to-[#131B2E] border border-[var(--accent)]/40 p-4 rounded-xl relative shadow-lg">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#0B0F19] transition-colors"
        title="Dismiss Guide"
      >
        <X size={16} />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono font-bold text-sm text-[var(--text-primary)]">
              <span>Quick Guide: How to Use SATYA-GPT</span>
              <span className="px-2 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent)] text-[10px]">EASY TO USE</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Protect yourself and your family from fake news, SMS scams, and malicious phishing links in 3 simple steps</p>
          </div>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-lg border border-[#1E2D4A]">
            <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-slate-950 font-bold flex items-center justify-center text-[11px]">1</span>
            <span className="text-[var(--text-secondary)]">Paste Link / SMS</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-lg border border-[#1E2D4A]">
            <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">2</span>
            <span className="text-[var(--text-secondary)]">View 92 Engine Scores</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-lg border border-[#1E2D4A]">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[11px]">3</span>
            <span className="text-[var(--text-secondary)]">Ask KAVACH AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
