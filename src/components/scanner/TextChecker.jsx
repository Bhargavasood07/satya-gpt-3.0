import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Search, Sparkles } from 'lucide-react';
import { analyzeScamGlobally } from '../../services/virusTotalService';
import { useChildMode } from '../../context/ChildModeContext';

export default function TextChecker({ onScanResult }) {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [textInput, setTextInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const samples = [
    {
      label: t('satyaGpt.sampleKycSms'),
      value: 'Dear Customer, your SBI YONO Account will be blocked today. Please update your PAN immediately: http://sbi-kyc-verify99.tk',
    },
    {
      label: t('satyaGpt.sampleGamingScam'),
      value: 'Congratulations Kid! Click here to claim 5,000 FREE ROBUX / Free Fire Diamonds instantly! Enter your password: http://free-robux.xyz',
    },
  ];

  const handleVerify = async (textToTest) => {
    const txt = textToTest || textInput;
    if (!txt || !txt.trim()) return;

    setIsScanning(true);
    const vtReport = await analyzeScamGlobally(txt, 'text');
    setIsScanning(false);

    onScanResult(txt, 'text', vtReport);
  };

  return (
    <div className="space-y-4">
      {/* Textarea Input Box */}
      <div className="relative">
        <textarea
          rows={3}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={t('satyaGpt.inputPlaceholderText')}
          className="w-full pl-3 pr-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleVerify()}
            disabled={isScanning || !textInput.trim()}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isScanning ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <Search size={14} />
                {t('satyaGpt.checkNow')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Example Samples */}
      <div className="space-y-2">
        <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-medium">
          <Sparkles size={12} className="text-amber-400" />
          {t('satyaGpt.quickExamples')}
        </div>
        <div className="flex flex-wrap gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTextInput(s.value);
                handleVerify(s.value);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all text-left"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
