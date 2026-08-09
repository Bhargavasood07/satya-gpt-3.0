import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldOff, X, ExternalLink, Server } from 'lucide-react';
import VirusTotalBadge from '../virustotal/VirusTotalBadge';
import VirusTotalModal from '../virustotal/VirusTotalModal';
import ApiKeySettingsModal from '../settings/ApiKeySettingsModal';
import BlockTransparencyCard from './BlockTransparencyCard';

const CircularRiskScore = ({ score }) => {
  let color = 'var(--safe)';
  if (score > 40) color = 'var(--accent)';
  if (score > 75) color = 'var(--threat)';

  return (
    <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 36 36">
        <path
          className="text-[var(--bg-primary)]"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="transition-all duration-1000 ease-out"
          strokeDasharray={`${score}, 100`}
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          style={{ color }}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="text-2xl font-bold" style={{ color }}>{score}</div>
    </div>
  );
};

const DeepDivePanel = ({ event, onClose }) => {
  const { t } = useTranslation();
  const [showVtModal, setShowVtModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const isThreat = event?.verdict === 'fake' || event?.verdict === 'malicious';

  const vtResult = event?.vtReport || {
    success: true,
    isRealApi: false,
    payload: event?.payload || '',
    verdict: isThreat ? 'malicious' : 'clean',
    maliciousCount: isThreat ? Math.floor(event.riskScore / 6) + 4 : 0,
    totalEngines: 92,
    harmlessCount: isThreat ? 92 - (Math.floor(event.riskScore / 6) + 4) : 92,
    vendors: [
      { name: 'Google Safebrowsing', category: isThreat ? 'malicious' : 'harmless', result: isThreat ? 'Phishing' : 'Clean' },
      { name: 'Kaspersky', category: isThreat ? 'malicious' : 'harmless', result: isThreat ? 'Trojan.Script.Phish' : 'Clean' },
      { name: 'BitDefender', category: isThreat ? 'malicious' : 'harmless', result: isThreat ? 'Phishing.URL' : 'Clean' },
      { name: 'Sophos', category: isThreat ? 'malicious' : 'harmless', result: isThreat ? 'Malicious Site' : 'Clean' },
      { name: 'CrowdStrike', category: isThreat ? 'malicious' : 'harmless', result: isThreat ? 'Phishing' : 'Clean' },
    ],
    reputation: isThreat ? -78 : 88,
    permalink: `https://www.virustotal.com/gui/search/${encodeURIComponent(event?.payload || '')}`,
  };

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:w-96 lg:w-[450px] bg-[var(--bg-secondary)] border-l border-[var(--border-card)] z-50 shadow-2xl flex flex-col font-sans"
      >
        {/* Top Header with Prominent Close Cross Button */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-card)] bg-[var(--bg-card)]">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span>{t('deepDive.title')}</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">ID: {event.id}</span>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close threat details panel"
            className="p-2 rounded-lg bg-[var(--bg-primary)] hover:bg-rose-500/20 border border-[var(--border-card)] hover:border-rose-500 text-[var(--text-primary)] hover:text-rose-400 transition-all flex items-center gap-1 text-xs font-mono font-bold"
          >
            <span>CLOSE</span>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Transparent Block Reason Breakdown Card */}
          <BlockTransparencyCard event={event} />

          {/* Verdict Banner with Cross Button */}
          {event.verdict && (
            <div className={`relative p-4 rounded-xl flex flex-col items-center justify-center text-center ${(event.verdict === 'fake' || event.verdict === 'malicious') ? 'bg-rose-950/30 border border-rose-500/50' : 'bg-emerald-950/30 border border-emerald-500/50'}`}>
              <button
                onClick={onClose}
                className="absolute top-2.5 right-2.5 p-1 rounded bg-black/40 hover:bg-black/80 text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>

              {(event.verdict === 'fake' || event.verdict === 'malicious') ? (
                <ShieldAlert size={44} className="text-rose-500 mb-2" />
              ) : (
                <ShieldCheck size={44} className="text-emerald-400 mb-2" />
              )}
              <div className="text-lg font-extrabold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                {(event.verdict === 'fake' || event.verdict === 'malicious') ? t('verdict.fake') : t('verdict.real')}
              </div>
            </div>
          )}

          {/* VirusTotal v3 Badge */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--text-muted)] font-mono">Multi-Engine VirusTotal v3 Inspection:</div>
            <VirusTotalBadge vtResult={vtResult} onClick={() => setShowVtModal(true)} />
          </div>

          {/* Risk Score */}
          <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-card)] font-mono">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 text-center">{t('deepDive.riskScore')}</h3>
            <CircularRiskScore score={event.riskScore || 0} />
          </div>

          {/* CyberCrime Portal Reporting Link */}
          {isThreat && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center justify-between font-mono">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-rose-300">Monetary Scam / Phishing Alert</span>
                <span className="text-[11px] text-rose-200/80">Report incident to National Cyber Crime Portal</span>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-all shadow-md shrink-0"
              >
                <span>Report</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Action & Close Buttons */}
        <div className="p-4 border-t border-[var(--border-card)] bg-[var(--bg-card)] flex flex-wrap gap-2">
          <button className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors font-mono">
            <ShieldCheck size={14} />
            {t('deepDive.markSafe')}
          </button>
          <button className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-amber-500/50 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors font-mono">
            <AlertTriangle size={14} />
            {t('deepDive.escalate')}
          </button>
          <button
            onClick={onClose}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-md"
          >
            <X size={15} />
            <span>Close (Esc)</span>
          </button>
        </div>
      </motion.div>

      {/* VirusTotal Vendor Analysis Modal */}
      {showVtModal && (
        <VirusTotalModal
          vtResult={vtResult}
          onClose={() => setShowVtModal(false)}
          onOpenSettings={() => {
            setShowVtModal(false);
            setShowSettingsModal(true);
          }}
        />
      )}

      {/* VirusTotal API Key Settings Modal */}
      {showSettingsModal && (
        <ApiKeySettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </>
  );
};

export default DeepDivePanel;
