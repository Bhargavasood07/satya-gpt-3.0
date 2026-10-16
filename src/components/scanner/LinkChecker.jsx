import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Search, Sparkles, ShieldAlert, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { analyzeWithVirusTotal } from '../../services/virusTotalService';
import { useChildMode } from '../../context/ChildModeContext';

export default function LinkChecker({ onScanResult }) {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const samples = [
    { label: t('satyaGpt.sampleCloneUrl', '🔴 Fake SBI Clone Website'), value: 'http://sbi.co.in.kyc-verify-portal.tk/login', type: 'clone' },
    { label: t('satyaGpt.sampleAgeAdUrl', '🔞 18+ Betting Ad (Minor Risk)'), value: 'http://teenpatti-18plus-realcash-casino.xyz/play?ad=mobile_game', type: 'ad18' },
    { label: t('satyaGpt.sampleMalvertisingUrl', '📢 Malvertising Search Ad'), value: 'https://sponsored-adclick.fake-support.online/customer-care-refund', type: 'ad' },
    { label: t('satyaGpt.sampleSafeUrl', '🟢 Official Real Portal'), value: 'https://www.sbi.co.in/portal/web/home', type: 'safe' },
  ];

  const handleVerify = async (urlToTest) => {
    const url = urlToTest || urlInput;
    if (!url || !url.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    const stepTimer = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    const vtReport = await analyzeWithVirusTotal(url);
    
    clearInterval(stepTimer);
    setIsScanning(false);
    setScanStep(0);

    onScanResult(url, 'link', vtReport);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Search Input Box */}
      <div className="relative flex flex-col sm:block gap-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-[var(--cyan-500)]" />
          </div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={t('satyaGpt.inputPlaceholderUrl', 'Paste URL or Link to scan (e.g. sbi-kyc-verify.tk, 18+ ad)...')}
            className="w-full pl-11 pr-4 sm:pr-36 py-3.5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)] transition-all shadow-inner break-all"
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
          <button
            onClick={() => handleVerify()}
            disabled={isScanning || !urlInput.trim()}
            className="hidden sm:flex absolute right-2 top-2 bottom-2 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg text-xs items-center gap-1.5 transition-all disabled:opacity-40 shadow-lg shadow-[var(--primary-glow)] cursor-pointer"
          >
            {isScanning ? (
              <span className="flex items-center gap-1.5">
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>{t('scanner.scanning', 'Scanning...')}</span>
              </span>
            ) : (
              <>
                <Search size={14} className="shrink-0" />
                <span className="break-words">{t('satyaGpt.checkNow', 'Scan Link')}</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile-only full width scan button so text never clips or overlaps */}
        <button
          onClick={() => handleVerify()}
          disabled={isScanning || !urlInput.trim()}
          className="sm:hidden w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 shadow-lg cursor-pointer"
        >
          {isScanning ? (
            <span className="flex items-center gap-1.5">
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
              <span>{t('scanner.scanning', 'Scanning...')}</span>
            </span>
          ) : (
            <>
              <Search size={14} className="shrink-0" />
              <span className="break-words">{t('satyaGpt.checkNow', 'Scan Link')}</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Scan Progress Activity Indicator */}
      {isScanning && (
        <div className="p-3 bg-[var(--surface-raised)] border border-[var(--primary)]/30 rounded-xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--primary)]">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="animate-pulse text-[var(--cyan-500)]" />
              {scanStep === 1 && (t('scanner.step1', '1/3 Querying 92 VirusTotal engines & Clone Registry...'))}
              {scanStep === 2 && (t('scanner.step2', '2/3 Checking 18+ Minor Safety & Malvertising heuristics...'))}
              {scanStep === 3 && (t('scanner.step3', '3/3 Verifying SSL certificate, DNS & brand identity...'))}
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
          <span>{t('satyaGpt.quickExamples', 'Try One-Click Test Cases:')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(s.value);
                handleVerify(s.value);
              }}
              className="text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] hover:bg-[var(--surface-overlay)] transition-all text-left flex flex-col gap-1 cursor-pointer group shadow-sm w-full min-w-0 overflow-hidden"
            >
              <span className="font-bold text-[var(--text-primary)] text-[11px] group-hover:text-[var(--cyan-400)] transition-colors break-words">
                {s.label}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] break-all font-mono">
                {s.value}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
