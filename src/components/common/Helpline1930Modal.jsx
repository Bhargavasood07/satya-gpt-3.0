import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PhoneCall, ShieldAlert, CheckCircle2, Copy, ExternalLink, Clock,
  Building2, AlertTriangle, X, Volume2, VolumeX, MapPin, ArrowRight,
  ShieldCheck, HelpCircle
} from 'lucide-react';
import { STATE_CYBER_CELL_DIRECTORY } from '../../services/bankAccountLookupService';
import useTextToSpeech from '../../hooks/useTextToSpeech';

const Helpline1930Modal = memo(({ onClose, onOpenBankFreeze, initialDossier }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const { speak, stop, isSpeaking } = useTextToSpeech();

  const [copiedScript, setCopiedScript] = useState(false);
  const [selectedState, setSelectedState] = useState(STATE_CYBER_CELL_DIRECTORY[0]);

  // Pre-filled incident details
  const [victimName, setVictimName] = useState(initialDossier?.victimName || 'Citizen Victim');
  const [bankName, setBankName] = useState(initialDossier?.bankName || 'State Bank of India');
  const [fraudUtr, setFraudUtr] = useState(initialDossier?.fraudUtr || '329188492011');
  const [fraudAmount, setFraudAmount] = useState(initialDossier?.amount || '₹49,999');
  const [scammerContact, setScammerContact] = useState(initialDossier?.scammerContact || '+91-9876543210 (or scam link)');

  const callScriptEn = `URGENT 1930 POLICE COMPLAINT SCRIPT (READ TO OFFICER):
"Hello Officer, I have been defrauded in an online financial cybercrime within the last hour.
- My Bank: ${bankName}
- Transaction UTR / Ref Number: ${fraudUtr}
- Amount Debited: ${fraudAmount}
- Suspect Scammer Number / UPI ID: ${scammerContact}
- Time of Fraud: Just now (within the Golden Hour)

Please immediately trigger an Emergency Nodal Lock on the beneficiary bank account to freeze the money before the fraudster withdraws it at an ATM."`;

  const callScriptHi = `1930 पुलिस अधिकारी को बताने हेतु 30-सेकंड की जरूरी जानकारी:
"नमस्ते अधिकारी महोदय, मेरे साथ अभी साइबर फ्रॉड हुआ है।
- मेरा बैंक: ${bankName}
- लेन-देन का UTR / रेफरेंस नंबर: ${fraudUtr}
- कटी हुई राशि: ${fraudAmount}
- जालसाज का नंबर / UPI ID: ${scammerContact}
- घटना का समय: अभी कुछ देर पहले (गोल्डन ऑवर के भीतर)

कृपया लाभार्थी (ठग) के बैंक खाते पर तुरंत नोडल फ्रीज लगाएं ताकि पैसे ATM से निकाले न जा सकें।"`;

  const activeScript = isHindi ? callScriptHi : callScriptEn;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(activeScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleVoiceReadout = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(activeScript, isHindi ? 'hi-IN' : 'en-IN');
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-[#060a14] border-2 border-amber-500/40 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-amber-500/20 bg-amber-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <PhoneCall size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                  {isHindi ? '1930 राष्ट्रीय साइबर अपराध हेल्पलाइन पोर्टल' : '1930 National Cyber Crime Citizen Helpline'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GOVT OF INDIA (MHA / I4C)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? 'गृह मंत्रालय (MHA) व I4C द्वारा संचालित 24x7 आपातकालीन वित्तीय धोखाधड़ी हेल्पलाइन।'
                  : 'Official 24x7 emergency helpline by Ministry of Home Affairs & Indian Cybercrime Coordination Centre (I4C).'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Primary Action Banner: Big Call 1930 Button */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/50 border-2 border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                <Clock size={15} className="text-amber-400" />
                <span>{isHindi ? 'गोल्डन ऑवर: पहले 2 घंटे सबसे महत्वपूर्ण हैं' : 'Golden Hour: First 120 Minutes are Critical'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {isHindi ? 'राष्ट्रीय हेल्पलाइन 1930 पर सीधे कॉल करें' : 'Direct Dial National Helpline 1930'}
              </h3>
              <p className="text-xs text-slate-300">
                {isHindi
                  ? '2 घंटे के अंदर सूचना देने पर 84% मामलों में पैसे बैंक गेटवे पर ही रोक लिए जाते हैं।'
                  : '84% of defrauded funds are frozen at the banking gateway if reported within 120 minutes.'}
              </p>
            </div>

            <a
              href="tel:1930"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-900/40 shrink-0 cursor-pointer animate-pulse"
            >
              <PhoneCall size={18} />
              <span>{isHindi ? 'अभी 1930 डायल करें' : 'Call 1930 Now'}</span>
            </a>
          </div>

          {/* 2. 30-Second Pre-Call Briefing Dossier */}
          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={14} className="text-cyan-400" />
                <span>{isHindi ? 'कॉल पर क्या बोलें (30-सेकंड की तैयारी)' : 'What to Say to 1930 Officer (30-Sec Script)'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleVoiceReadout}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSpeaking
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-[var(--surface-card)] text-slate-300 border-[var(--border-subtle)] hover:text-white'
                  }`}
                  title="Listen to Script Audio"
                >
                  {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen Script'}</span>
                </button>

                <button
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  {copiedScript ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            {/* Quick editable parameter row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold">Your Bank:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#040711] border border-[var(--border-subtle)] rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold">Fraud UTR / Txn ID:</label>
                <input
                  type="text"
                  value={fraudUtr}
                  onChange={(e) => setFraudUtr(e.target.value)}
                  className="w-full bg-[#040711] border border-[var(--border-subtle)] rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold">Amount Lost:</label>
                <input
                  type="text"
                  value={fraudAmount}
                  onChange={(e) => setFraudAmount(e.target.value)}
                  className="w-full bg-[#040711] border border-[var(--border-subtle)] rounded p-1.5 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold">Scammer Contact:</label>
                <input
                  type="text"
                  value={scammerContact}
                  onChange={(e) => setScammerContact(e.target.value)}
                  className="w-full bg-[#040711] border border-[var(--border-subtle)] rounded p-1.5 text-slate-200"
                />
              </div>
            </div>

            {/* Formatted Script Box */}
            <div className="p-3 rounded-lg bg-[#040711] border border-[var(--border-subtle)] text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
              {activeScript}
            </div>
          </div>

          {/* 3. State-Wise Police Cyber Crime Cell Directory */}
          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} className="text-amber-400" />
                <span>{isHindi ? 'राज्य स्तरीय साइबर क्राइम सेल डायरेक्टरी' : 'State Police Cyber Cell Direct Lines'}</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Alternative Landline Directory</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATE_CYBER_CELL_DIRECTORY.map((dir) => (
                <button
                  key={dir.state}
                  onClick={() => setSelectedState(dir)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedState.state === dir.state
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-[#040711] border-[var(--border-subtle)] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{dir.state}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5 truncate">{dir.phone}</div>
                </button>
              ))}
            </div>

            {/* Selected State Details Card */}
            {selectedState && (
              <div className="p-3 rounded-lg bg-[#040711] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 justify-center sm:justify-start">
                    <MapPin size={13} className="text-amber-400" />
                    <span>{selectedState.state}: {selectedState.address}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Direct: <span className="text-cyan-300 font-mono font-bold">{selectedState.phone}</span> • Alt: {selectedState.altPhone} • {selectedState.email}
                  </div>
                </div>

                <a
                  href={`tel:${selectedState.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                >
                  <PhoneCall size={12} />
                  <span>Call {selectedState.state} Cell</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between flex-wrap gap-3">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1.5 font-bold"
          >
            <span>Visit Official Portal (cybercrime.gov.in)</span>
            <ExternalLink size={12} />
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenBankFreeze && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBankFreeze();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <ShieldAlert size={14} />
                <span>{isHindi ? 'पहले बैंक खाता फ्रीज करें' : 'Emergency Bank Freeze First'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

Helpline1930Modal.displayName = 'Helpline1930Modal';
export default Helpline1930Modal;
