import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Search, Sparkles, Server } from 'lucide-react';
import { analyzeWithVirusTotal } from '../../services/virusTotalService';
import { useChildMode } from '../../context/ChildModeContext';

export default function LinkChecker({ onScanResult }) {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const samples = [
    { label: t('satyaGpt.samplePhishingUrl'), value: 'http://sbi-kyc-update-verify99.tk/login' },
    { label: t('satyaGpt.sampleGamingScam'), value: 'http://free-robux-fire-coins-generator.xyz/claim' },
    { label: t('satyaGpt.sampleSafeUrl'), value: 'https://www.google.com' },
  ];

  const handleVerify = async (urlToTest) => {
    const url = urlToTest || urlInput;
    if (!url || !url.trim()) return;

    setIsScanning(true);
    const vtReport = await analyzeWithVirusTotal(url);
    setIsScanning(false);

    onScanResult(url, 'link', vtReport);
  };

  return (
    <div className="space-y-4">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Link className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder={t('satyaGpt.inputPlaceholderUrl')}
          className="w-full pl-10 pr-36 py-3 bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
        />
        <button
          onClick={() => handleVerify()}
          disabled={isScanning || !urlInput.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          {isScanning ? (
            <span className="animate-spin text-sm">⏳</span>
          ) : (
            <>
              <Server size={14} />
              <span>VirusTotal v3</span>
            </>
          )}
        </button>
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
                setUrlInput(s.value);
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
