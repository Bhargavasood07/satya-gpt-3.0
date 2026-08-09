import React from 'react';
import { ShieldCheck, ShieldAlert, ExternalLink, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VirusTotalBadge({ vtResult, onClick }) {
  const { t } = useTranslation();

  if (!vtResult) return null;

  const isThreat = vtResult.maliciousCount > 0;

  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left w-full ${
        isThreat
          ? 'bg-rose-950/30 border-rose-500/40 hover:border-rose-400'
          : 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
            isThreat ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          {isThreat ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
            <span>VirusTotal v3 Inspection</span>
            {vtResult.isRealApi && (
              <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded text-[9px] font-mono">
                LIVE API
              </span>
            )}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] font-mono">
            {vtResult.maliciousCount} / {vtResult.totalEngines} Security Vendors Flagged
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-[var(--accent)] font-semibold group-hover:translate-x-0.5 transition-transform">
        <span>View Details</span>
        <ExternalLink size={13} />
      </div>
    </button>
  );
}
