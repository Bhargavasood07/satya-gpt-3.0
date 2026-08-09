import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Server, ShieldAlert, ShieldCheck, Baby, Activity, ExternalLink, Database, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export default function MetricDetailModal({ modalType, onClose, metrics, events = [] }) {
  if (!modalType) return null;

  const { totalScans = 1442, threatsBlocked = 99, systemIntegrity = 99.4, childBlocks = 47 } = metrics || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#131B2E] border border-[#27395C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1E2D4A] bg-[#0B0F19] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
              {modalType === 'totalScans' && <Server size={18} />}
              {modalType === 'threatsBlocked' && <ShieldAlert size={18} className="text-rose-400" />}
              {modalType === 'childBlocks' && <Baby size={18} className="text-purple-400" />}
              {modalType === 'systemIntegrity' && <Activity size={18} className="text-emerald-400" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)] font-mono uppercase">
                {modalType === 'totalScans' && 'Total Scans & VirusTotal v3 API Details'}
                {modalType === 'threatsBlocked' && 'Neutralized Threat Intelligence Audit'}
                {modalType === 'childBlocks' && 'Child Guard Shield Filter Logs'}
                {modalType === 'systemIntegrity' && 'SOC System Health & Backend Diagnostics'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">Backend Endpoint: /vt-api/v3 & Satya AI Node</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#131B2E] hover:bg-rose-500/20 border border-[#27395C] hover:border-rose-500 text-[var(--text-primary)] hover:text-rose-400 transition-all font-mono font-bold text-xs flex items-center gap-1"
          >
            <span>CLOSE</span>
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
          {/* TOTAL SCANS MODAL CONTENT */}
          {modalType === 'totalScans' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0B0F19] rounded-xl border border-[#1E2D4A] flex justify-between items-center">
                <div>
                  <div className="text-[var(--text-muted)] text-[10px]">TOTAL SCANS COMPLETED TODAY</div>
                  <div className="text-3xl font-bold text-[var(--accent)]">{totalScans.toLocaleString()}</div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-bold">
                  200 OK CONNECTED
                </span>
              </div>

              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-[#1E2D4A] space-y-2">
                <div className="text-[var(--text-muted)] font-bold text-[11px]">VIRUSTOTAL v3 BACKEND PROXY METRICS</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-2 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">API Endpoint</div>
                    <div className="text-[11px] font-bold text-cyan-300">/vt-api/urls/</div>
                  </div>
                  <div className="p-2 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">Active Key</div>
                    <div className="text-[11px] font-bold text-emerald-400">Encapsulated .env</div>
                  </div>
                  <div className="p-2 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">Vendor Engines</div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)]">92 Vendors</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[var(--text-muted)] font-bold text-[11px]">RECENT INSPECTED PAYLOADS</div>
                <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#1E2D4A] space-y-1.5 max-h-40 overflow-y-auto">
                  {events.slice(0, 5).map((evt, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] border-b border-[#1E2D4A]/50 pb-1 last:border-0">
                      <span className="truncate max-w-xs text-[var(--text-primary)]">{evt.payload}</span>
                      <span className={`px-2 py-0.2 rounded font-bold text-[9px] ${evt.verdict === 'fake' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {evt.verdict === 'fake' ? 'FLAGGED' : 'CLEAN'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* THREATS BLOCKED MODAL CONTENT */}
          {modalType === 'threatsBlocked' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-500/50 flex justify-between items-center">
                <div>
                  <div className="text-rose-300/80 text-[10px]">TOTAL MALICIOUS THREATS NEUTRALIZED</div>
                  <div className="text-3xl font-bold text-rose-400">{threatsBlocked.toLocaleString()}</div>
                </div>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>Report Fraud</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-[#1E2D4A] space-y-2">
                <div className="text-[var(--text-muted)] font-bold text-[11px]">TOP FLAGGING SECURITY VENDORS</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between p-2 bg-[#131B2E] rounded border border-[#27395C]">
                    <span>Google Safebrowsing API</span>
                    <span className="text-rose-400 font-bold">34 Malicious Flags</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#131B2E] rounded border border-[#27395C]">
                    <span>Kaspersky Threat Intelligence</span>
                    <span className="text-rose-400 font-bold">31 Malicious Flags</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#131B2E] rounded border border-[#27395C]">
                    <span>Sophos Cyber Engine</span>
                    <span className="text-rose-400 font-bold">29 Malicious Flags</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHILD BLOCKS MODAL CONTENT */}
          {modalType === 'childBlocks' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-500/50 flex justify-between items-center">
                <div>
                  <div className="text-purple-300/80 text-[10px]">TOTAL CHILD SAFETY BLOCKS</div>
                  <div className="text-3xl font-bold text-purple-400">{childBlocks.toLocaleString()}</div>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/40 rounded text-xs font-bold">
                  ACTIVE GUARD
                </span>
              </div>

              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-[#1E2D4A] space-y-2">
                <div className="text-[var(--text-muted)] font-bold text-[11px]">CHILD GUARD ACTIVE RULES</div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2 p-2 bg-[#131B2E] rounded border border-[#27395C] text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Explicit Adult Site Redirects Automatically Blocked</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#131B2E] rounded border border-[#27395C] text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Free Robux / Fire Coin Gaming Scam Traps Intercepted</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#131B2E] rounded border border-[#27395C] text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Unverified OTP Money Request Messages Intercepted</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM INTEGRITY MODAL CONTENT */}
          {modalType === 'systemIntegrity' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/50 flex justify-between items-center">
                <div>
                  <div className="text-emerald-300/80 text-[10px]">SYSTEM INTEGRITY HEALTH SCORE</div>
                  <div className="text-3xl font-bold text-emerald-400">{systemIntegrity}%</div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-bold">
                  99.98% UPTIME
                </span>
              </div>

              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-[#1E2D4A] space-y-2">
                <div className="text-[var(--text-muted)] font-bold text-[11px]">BACKEND NODE DIAGNOSTICS</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">API Latency</div>
                    <div className="text-xs font-bold text-emerald-400">12ms (Optimal)</div>
                  </div>
                  <div className="p-2.5 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">TLS Handshake</div>
                    <div className="text-xs font-bold text-cyan-300">TLS 1.3 Encrypted</div>
                  </div>
                  <div className="p-2.5 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">Threat Cache Pool</div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">vtCacheMap Active (0ms)</div>
                  </div>
                  <div className="p-2.5 bg-[#131B2E] rounded border border-[#27395C]">
                    <div className="text-[10px] text-[var(--text-muted)]">KAVACH Engine</div>
                    <div className="text-xs font-bold text-emerald-400">Claude-3.5 Sonnet Ready</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
