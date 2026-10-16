import React from 'react';
import { ShieldAlert, Info, CheckCircle2, AlertTriangle, FileText, ChevronRight, Lock, ExternalLink, Globe, ShieldX, Baby, Megaphone } from 'lucide-react';

export default function BlockTransparencyCard({ event }) {
  if (!event) return null;

  const isBlocked = event.verdict === 'fake';
  const vtReport = event.vtReport;
  const clone = event.cloneAnalysis || vtReport?.cloneAnalysis;
  const ageAd = event.ageAnalysis || vtReport?.ageAnalysis;
  const phishAd = event.adAnalysis || vtReport?.adAnalysis;

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

      {/* ── 1. WEBSITE CLONE / COPYCAT DETECTION CARD ────────────────── */}
      {clone?.isClone && (
        <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-500/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 text-[11px] uppercase tracking-wide">
              <Globe size={15} className="text-rose-400" />
              <span>Fake Copycat Clone Website Detected</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px] border border-rose-500/40">
              TYPOSQUATTING
            </span>
          </div>

          <p className="text-[10.5px] text-rose-200/90 leading-relaxed">
            This website is an <strong>unauthorized copy</strong> attempting to impersonate <strong>{clone.brand}</strong> to steal credentials, OTPs, or credit card details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[10px]">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-rose-500/30">
              <span className="text-rose-400 font-bold uppercase block mb-0.5">⚠️ Fake Clone Host</span>
              <span className="text-[var(--text-primary)] font-mono break-all">{clone.spoofedDomain}</span>
            </div>
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-emerald-500/30">
              <span className="text-emerald-400 font-bold uppercase block mb-0.5">✅ Official Real Website</span>
              <a
                href={`https://${clone.officialDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-emerald-200 underline font-mono flex items-center gap-1"
              >
                <span>{clone.officialDomain}</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. 18+ AD & MINOR SAFETY VIOLATION CARD ──────────────────── */}
      {ageAd?.isAgeRestricted && (
        <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] uppercase tracking-wide">
              <Baby size={15} className="text-amber-400" />
              <span>18+ Ad / Minor Safety Violation</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] border border-amber-500/40">
              AGE-RESTRICTED
            </span>
          </div>

          <p className="text-[10.5px] text-amber-200/90 leading-relaxed">
            {ageAd.reason}
          </p>

          <div className="p-2 bg-[#0B0F19] rounded-lg border border-amber-500/30 flex items-center justify-between text-[10px]">
            <span className="text-[var(--text-muted)]">Target Protection:</span>
            <span className="text-amber-400 font-bold">{ageAd.targetAudienceAlert || 'Blocked for Minors (Under 18)'}</span>
          </div>
        </div>
      )}

      {/* ── 3. PHISHING AD / MALVERTISING REDIRECTION CARD ───────────── */}
      {phishAd?.isPhishingAd && (
        <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-[11px] uppercase tracking-wide">
              <Megaphone size={15} className="text-cyan-400" />
              <span>Malvertising Phishing Ad Trap</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[9px] border border-cyan-500/40">
              SPONSORED AD TRAP
            </span>
          </div>

          <p className="text-[10.5px] text-cyan-200/90 leading-relaxed">
            {phishAd.reason}
          </p>

          <div className="p-2 bg-[#0B0F19] rounded-lg border border-cyan-500/30 flex items-center justify-between text-[10px]">
            <span className="text-[var(--text-muted)]">Deceptive Hook Vector:</span>
            <span className="text-cyan-400 font-bold">{phishAd.lureType}</span>
          </div>
        </div>
      )}

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
                  {clone?.isClone ? 'Fake Website Copycat Clone' :
                   ageAd?.isAgeRestricted ? '18+ Minor Safety Violation' :
                   phishAd?.isPhishingAd ? 'Malvertising Phishing Ad' :
                   event.payload.toLowerCase().includes('sbi') || event.payload.toLowerCase().includes('bank') ? 'Banking KYC Phishing Scam' : 
                   event.payload.toLowerCase().includes('robux') ? 'Gaming Currency Trap' : 'Malicious Web Origin'}
                </div>
              </div>
              <div className="p-2 bg-[#131B2E] rounded border border-[#27395C]">
                <div className="text-[10px] text-[var(--text-muted)]">Vendor Hit Evidence</div>
                <div className="text-[11px] font-bold text-amber-300">
                  {vtReport ? `${vtReport.maliciousCount} / ${vtReport.totalEngines} Security Engines` : '24 Multi-Engine Flags'}
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
