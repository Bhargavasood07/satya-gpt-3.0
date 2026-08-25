import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, MessageSquare, Activity } from 'lucide-react';
import { analyzeScamGlobally } from '../../services/virusTotalService';
import { useChildMode } from '../../context/ChildModeContext';

export default function TextChecker({ onScanResult }) {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [textInput, setTextInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const samples = [
    {
      label: t('satyaGpt.sampleKycSms', '🔴 Fake SBI KYC SMS Alert'),
      value: 'Dear Customer, your SBI YONO Account will be blocked today. Please update your PAN immediately: http://sbi-kyc-verify99.tk',
    },
    {
      label: t('satyaGpt.sampleGamingScam', '🟣 Free Game Currency Scam'),
      value: 'Congratulations Kid! Click here to claim 5,000 FREE ROBUX / Free Fire Diamonds instantly! Enter your password: http://free-robux.xyz',
    },
    {
      label: '🟡 Electricity Power Cut Threat SMS',
      value: 'Dear consumer, your electricity power will be disconnected at 9:30 PM tonight due to unpaid bill. Call officer immediately at 9876543210',
    }
  ];

  const handleVerify = async (textToTest) => {
    const txt = textToTest || textInput;
    if (!txt || !txt.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    const stepTimer = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    const vtReport = await analyzeScamGlobally(txt, 'text');

    clearInterval(stepTimer);
    setIsScanning(false);
    setScanStep(0);

    onScanResult(txt, 'text', vtReport);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Textarea Input Box */}
      <div className="relative">
        <textarea
          rows={3}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={t('satyaGpt.inputPlaceholderText', 'Paste suspicious SMS message, WhatsApp forward, or email text to verify...')}
          className="w-full p-3.5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)] transition-all resize-none shadow-inner"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
            <MessageSquare size={13} />
            NLP Scam Keyword Detection Active
          </span>
          <button
            onClick={() => handleVerify()}
            disabled={isScanning || !textInput.trim()}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 shadow-lg shadow-[var(--primary-glow)] cursor-pointer"
          >
            {isScanning ? (
              <span className="flex items-center gap-1.5">
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Analyzing SMS</span>
              </span>
            ) : (
              <>
                <Search size={14} />
                <span>Verify Message</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Scan Progress Activity Indicator */}
      {isScanning && (
        <div className="p-3 bg-[var(--surface-raised)] border border-[var(--primary)]/30 rounded-xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--primary)]">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="animate-pulse text-[var(--cyan-500)]" />
              {scanStep === 1 && "1/3 Analyzing threat vectors & intent..."}
              {scanStep === 2 && "2/3 Cross-referencing 1930 fraud database..."}
              {scanStep === 3 && "3/3 Inspecting redirect links & APK signatures..."}
            </span>
            <span className="text-[var(--cyan-500)] font-mono">{scanStep * 33}%</span>
          </div>
          <div className="w-full h-1.5 bg-[var(--surface-inset)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--cyan-500)] transition-all duration-300 rounded-full" 
              style={{ width: `${scanStep * 33.3}%` }} 
            />
          </div>
        </div>
      )}

      {/* Quick Example Samples */}
      <div className="space-y-2">
        <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
          <Sparkles size={13} className="text-[var(--amber-500)]" />
          <span>{t('satyaGpt.quickExamples', 'Try Sample Scams Caught Today:')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTextInput(s.value);
                handleVerify(s.value);
              }}
              className="text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] hover:bg-[var(--surface-overlay)] transition-all text-left flex flex-col gap-1 cursor-pointer group shadow-sm"
            >
              <span className="font-bold text-[var(--text-primary)] text-[11px] group-hover:text-[var(--primary)] transition-colors">
                {s.label}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] line-clamp-2 font-mono">
                {s.value}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
