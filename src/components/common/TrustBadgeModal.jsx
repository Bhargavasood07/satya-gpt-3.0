import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Copy, CheckCircle2, X, Code2 } from 'lucide-react';

const TrustBadgeModal = memo(({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const embedSnippet = `<a href="https://satya-gpt-30.vercel.app/" target="_blank" rel="noopener noreferrer">
  <img src="https://satya-gpt-30.vercel.app/assets/satya-shield-badge.png" alt="Protected by SATYA-GPT AI Engine" style="height: 40px;" />
</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-lg bg-[#131B2E] border border-[#27395C] rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-[#1E2D4A] pb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-100">
              "Protected by SATYA-GPT" Enterprise Trust Badge
            </h2>
            <p className="text-[10px] text-[var(--text-muted)]">Embed verified safety seal on your startup website footer</p>
          </div>
        </div>

        {/* Badge Preview */}
        <div className="p-4 bg-[#0B0F19] rounded-xl border border-[#27395C] text-center space-y-2">
          <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Badge Preview:</div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-xs shadow-md">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span>PROTECTED BY SATYA-GPT 92-ENGINE AI</span>
          </div>
        </div>

        {/* Embed Snippet */}
        <div className="space-y-1">
          <label className="block text-[10px] text-[var(--text-muted)] font-bold uppercase flex items-center gap-1">
            <Code2 size={13} className="text-[var(--accent)]" />
            <span>HTML Embed Code:</span>
          </label>
          <pre className="p-3 bg-[#0B0F19] rounded-xl border border-[#27395C] text-[10px] text-cyan-300 overflow-x-auto select-all">
            {embedSnippet}
          </pre>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Badge Snippet Copied!' : 'Copy Embed Code'}</span>
        </button>
      </motion.div>
    </div>
  );
});

TrustBadgeModal.displayName = 'TrustBadgeModal';
export default TrustBadgeModal;
