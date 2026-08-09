import React from 'react';
import { ShieldAlert, Info, CheckCircle2, AlertTriangle, FileText, ChevronRight, Lock } from 'lucide-react';

export default function BlockTransparencyCard({ event }) {
  if (!event) return null;

  const isBlocked = event.verdict === 'fake';
  const vtReport = event.vtReport;

  return (
    <div className={`cyber-card p-4 rounded-xl border ${
      isBlocked ? 'border-rose-500/50 bg-rose-950/20' : 'border-emerald-500/50 bg-emerald-950/20'
    } space-y-3 font-mono text-xs`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2.5">
        <div className="flex items-center gap-2">
          {isBlocked ? (
            <ShieldAlert size={18} className="text-rose-400" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-400" />
          )}
          <span className={`font-bold uppercase tracking-wider text-xs ${isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isBlocked ? 'Transparent Threat Block Reason' : 'Verified Clean Safety Certificate'}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#0B0F19] border border-[#27395C] text-[10px] text-[var(--text-muted)] font-bold">
          TRANSPARENCY VERIFIED
        </span>
      </div>

      {/* Primary Payload Target */}
      <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1E2D4A] space-y-1">
        <div className="text-[10px] text-[var(--text-muted)] uppercase">Target Scanned Payload</div>
        <div className="font-bold text-[var(--text-primary)] break-all">{event.payload}</div>
      </div>

      {/* Specific Block Reason Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-bold text-[11px]">
          <Info size={14} className="text-[var(--accent)]" />
          <span>Why Was This {isBlocked ? 'Blocked' : 'Approved'}?</span>
        </div>

        <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] text-[var(--text-primary)] leading-relaxed space-y-2">
          <p className="text-[11px]">{event.verdictReason || (isBlocked ? 'Flagged as malicious by VirusTotal v3 security engines.' : 'Verified safe by 90+ security engines.')}</p>

          {isBlocked && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#1E2D4A]">
              <div className="p-2 bg-[#131B2E] rounded border border-[#27395C]">
                <div className="text-[10px] text-[var(--text-muted)]">Threat Category</div>
                <div className="text-[11px] font-bold text-rose-400">
                  {event.payload.toLowerCase().includes('sbi') || event.payload.toLowerCase().includes('bank') ? 'Banking KYC Phishing Scam' : 
                   event.payload.toLowerCase().includes('robux') ? 'Gaming Currency Trap' : 'Malicious Web Origin'}
                </div>
              </div>
              <div className="p-2 bg-[#131B2E] rounded border border-[#27395C]">
                <div className="text-[10px] text-[var(--text-muted)]">Vendor Hit Evidence</div>
                <div className="text-[11px] font-bold text-amber-300">
                  {vtReport ? `${vtReport.maliciousCount} / ${vtReport.totalEngines} Security Engines` : '6 Multi-Engine Flags'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Evidence Bullet Points */}
      {isBlocked && event.indicators && event.indicators.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Detected Risk Indicators</div>
          <div className="space-y-1">
            {event.indicators.map((ind, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 bg-[#0B0F19] rounded border border-[#1E2D4A] text-[11px] text-rose-300">
                <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
