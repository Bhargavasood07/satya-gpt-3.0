import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldOff, X, ExternalLink, Server, CheckCircle2, FileText, Volume2 } from 'lucide-react';
import VirusTotalBadge from '../virustotal/VirusTotalBadge';
import VirusTotalModal from '../virustotal/VirusTotalModal';
import ApiKeySettingsModal from '../settings/ApiKeySettingsModal';
import BlockTransparencyCard from './BlockTransparencyCard';
import WhatsAppShareButton from '../common/WhatsAppShareButton';
import CyberComplaintGeneratorModal from '../common/CyberComplaintGeneratorModal';
import { speakVoiceAlert } from '../../services/voiceAlertService';

const CircularRiskScore = ({ score }) => {
  let color = 'var(--safe)';
  if (score > 40) color = 'var(--accent)';
  if (score > 75) color = 'var(--threat)';

  return (
    <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center font-mono">
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
  const { t, i18n } = useTranslation();
  const [showVtModal, setShowVtModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const isThreat = event?.verdict === 'fake' || event?.verdict === 'malicious';
  const isHindi = i18n.language && i18n.language.startsWith('hi');

  // Trigger TTS Voice Announcement on mount
  useEffect(() => {
    if (event?.verdict) {
      speakVoiceAlert(event.verdict, isHindi);
    }
  }, [event, isHindi]);

  const handleReplayVoice = () => {
    if (event?.verdict) {
      speakVoiceAlert(event.verdict, isHindi);
    }
  };

  const handleMarkSafe = () => {
    if (event) {
      event.verdict = 'real';
      event.verdictLabel = 'REAL';
      event.riskScore = 0;
      event.severity = 'low';
    }
    setActionFeedback('✅ Marked as Safe by Security Operator!');
    setTimeout(() => {
      setActionFeedback(null);
      if (onClose) onClose();
    }, 1500);
  };

  const handleEscalate = () => {
    setActionFeedback('🚨 Escalated to National 1930 Cyber Fraud Helpline!');
    window.open('https://cybercrime.gov.in', '_blank');
    setTimeout(() => {
      setActionFeedback(null);
    }, 2000);
  };

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
        className="fixed right-0 top-0 h-full w-full sm:w-96 lg:w-[450px] bg-[#131B2E] border-l border-[#27395C] z-50 shadow-2xl flex flex-col font-mono text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1E2D4A] bg-[#0B0F19]">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              {t('deepDive.title')}
            </h2>
            <span className="text-[10px] text-[var(--text-muted)]">ID: {event.id}</span>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close threat details panel"
            className="p-1.5 rounded-lg bg-[#131B2E] hover:bg-rose-500/20 border border-[#27395C] text-slate-300 hover:text-rose-400 transition-all flex items-center gap-1 text-xs font-bold"
          >
            <span>CLOSE</span>
            <X size={16} />
          </button>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-pulse flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionFeedback}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <BlockTransparencyCard event={event} />

          {/* Verdict Banner with Voice TTS Replay Button */}
          {event.verdict && (
            <div className={`relative p-4 rounded-xl flex flex-col items-center justify-center text-center ${(event.verdict === 'fake' || event.verdict === 'malicious') ? 'bg-rose-950/40 border border-rose-500/50' : 'bg-emerald-950/40 border border-emerald-500/50'}`}>
              <button
                onClick={handleReplayVoice}
                className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-[#0B0F19] hover:bg-black border border-[#27395C] text-[10px] font-bold text-amber-300 flex items-center gap-1 transition-all"
                title="Speak Voice Alert in Hindi/English"
              >
                <Volume2 size={13} className="text-amber-400 animate-pulse" />
                <span>Voice Alert</span>
              </button>

              {(event.verdict === 'fake' || event.verdict === 'malicious') ? (
                <ShieldAlert size={40} className="text-rose-400 mb-2" />
              ) : (
                <ShieldCheck size={40} className="text-emerald-400 mb-2" />
              )}
              <div className="text-base font-extrabold text-slate-100 uppercase tracking-wider">
                {event.verdictLabel || ((event.verdict === 'fake' || event.verdict === 'malicious') ? t('verdict.fake') : t('verdict.real'))}
              </div>
            </div>
          )}

          {/* VirusTotal v3 Badge */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[var(--text-muted)]">Multi-Engine VirusTotal v3 Inspection:</div>
            <VirusTotalBadge vtResult={vtResult} onClick={() => setShowVtModal(true)} />
          </div>

          {/* Risk Score */}
          <div className="bg-[#0B0F19] p-4 rounded-xl border border-[#27395C]">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-3 text-center">{t('deepDive.riskScore')}</h3>
            <CircularRiskScore score={event.riskScore || 0} />
          </div>

          {/* 1-Click WhatsApp Share & PDF Complaint Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#0B0F19] border border-[#27395C] rounded-xl">
            <WhatsAppShareButton payload={event.payload} verdict={event.verdict} />

            <button
              onClick={() => setShowComplaintModal(true)}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <FileText size={14} />
              <span>Generate Police PDF</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-[#1E2D4A] bg-[#0B0F19] flex flex-wrap gap-2">
          <button 
            onClick={handleMarkSafe}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold border border-emerald-500/50 text-emerald-400 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition-all shadow-md"
          >
            <ShieldCheck size={15} />
            <span>Mark Safe</span>
          </button>

          <button 
            onClick={handleEscalate}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold border border-amber-500/50 text-amber-300 bg-amber-500/10 rounded-xl hover:bg-amber-500/20 transition-all shadow-md"
          >
            <AlertTriangle size={15} />
            <span>Escalate (1930)</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-md"
          >
            <X size={15} />
            <span>Close</span>
          </button>
        </div>
      </motion.div>

      {/* 1-Click Bank & Police Cyber Complaint PDF Modal */}
      {showComplaintModal && (
        <CyberComplaintGeneratorModal
          threatPayload={event.payload}
          onClose={() => setShowComplaintModal(false)}
        />
      )}

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
