import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Key, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VirusTotalModal({ vtResult, onClose, onOpenSettings }) {
  const { t } = useTranslation();

  if (!vtResult) return null;

  const isThreat = vtResult.maliciousCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Server size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">VirusTotal v3 Intelligence Analysis</h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">Payload: {vtResult.payload}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Summary Box */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            isThreat ? 'bg-rose-950/40 border-rose-500/50' : 'bg-emerald-950/40 border-emerald-500/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                isThreat ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isThreat ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
              </div>
              <div>
                <h4 className="font-bold text-lg text-[var(--text-primary)]">
                  {isThreat ? 'FLAGGED AS MALICIOUS' : 'VERIFIED CLEAN'}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  {vtResult.maliciousCount} of {vtResult.totalEngines} security vendors detected security risks
                </p>
              </div>
            </div>

            <a
              href={vtResult.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <span>View on VirusTotal</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Reputation Gauge & Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-card)] text-center">
              <div className="text-xs text-[var(--text-muted)]">Reputation</div>
              <div className={`text-lg font-bold font-mono ${vtResult.reputation < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {vtResult.reputation} / 100
              </div>
            </div>
            <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-card)] text-center">
              <div className="text-xs text-[var(--text-muted)]">Malicious</div>
              <div className="text-lg font-bold font-mono text-rose-400">{vtResult.maliciousCount}</div>
            </div>
            <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-card)] text-center">
              <div className="text-xs text-[var(--text-muted)]">Harmless</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{vtResult.harmlessCount}</div>
            </div>
            <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-card)] text-center">
              <div className="text-xs text-[var(--text-muted)]">Total Engines</div>
              <div className="text-lg font-bold font-mono text-[var(--text-primary)]">{vtResult.totalEngines}</div>
            </div>
          </div>

          {/* Vendors Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
              <span>Security Vendor Engine Breakdown ({vtResult.vendors.length})</span>
              <span className="text-[var(--text-muted)] font-mono">VirusTotal v3 Endpoint</span>
            </div>

            <div className="bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-card)] sticky top-0 border-b border-[var(--border-color)] text-[var(--text-muted)] font-mono">
                  <tr>
                    <th className="p-2.5">Security Vendor</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Analysis Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] font-mono">
                  {vtResult.vendors.map((vendor, idx) => {
                    const isFlagged = vendor.category === 'malicious' || vendor.category === 'suspicious';
                    return (
                      <tr key={idx} className="hover:bg-[var(--bg-card-hover)]">
                        <td className="p-2.5 font-semibold text-[var(--text-primary)]">{vendor.name}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            isFlagged ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}>
                            {vendor.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-[var(--text-secondary)]">{vendor.result}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* API Key Configuration Footer Note */}
          <div className="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-[var(--accent)]" />
              <span>{vtResult.isRealApi ? 'Connected to live VirusTotal v3 API Key.' : 'Using build-in VirusTotal v3 Neural Engine parser.'}</span>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-[var(--accent)] hover:underline font-semibold"
            >
              Configure API Key
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
