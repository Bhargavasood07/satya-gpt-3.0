import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, MessageSquare, Activity } from 'lucide-react';
import { analyzeScamGlobally } from '../../services/virusTotalService';
import { useChildMode } from '../../context/ChildModeContext';

export default function TextChecker({ onScanResult }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const { isChildMode } = useChildMode();
  const [textInput, setTextInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const samples = [
    {
      label: t('satyaGpt.sampleKycSms', '🔴 Fake SBI KYC SMS Alert'),
      value: isHindi 
        ? 'प्रिय ग्राहक, आपका SBI YONO खाता आज ब्लॉक हो जाएगा। कृपया तुरंत पैन कार्ड अपडेट करें: http://sbi-kyc-verify99.tk'
        : 'Dear Customer, your SBI YONO Account will be blocked today. Please update your PAN immediately: http://sbi-kyc-verify99.tk',
    },
    {
      label: t('satyaGpt.sampleGamingScam', '🟣 Free Game Currency Scam'),
      value: isHindi
        ? 'बधाई हो! 5,000 फ्री रोबक्स / फ्री फायर डायमंड तुरंत पाने के लिए यहां क्लिक करें! अपना पासवर्ड दर्ज करें: http://free-robux.xyz'
        : 'Congratulations Kid! Click here to claim 5,000 FREE ROBUX / Free Fire Diamonds instantly! Enter your password: http://free-robux.xyz',
    },
    {
      label: t('satyaGpt.sampleElectricitySms', '🟡 Electricity Power Cut Threat SMS'),
      value: isHindi
        ? 'प्रिय उपभोक्ता, बिल जमा न होने के कारण आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। तुरंत बिजली अधिकारी से 9876543210 पर संपर्क करें।'
        : 'Dear consumer, your electricity power will be disconnected at 9:30 PM tonight due to unpaid bill. Call officer immediately at 9876543210',
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
          className="w-full p-3.5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)] transition-all resize-none shadow-inner break-words"
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 w-full">
          <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 min-w-0 break-words">
            <MessageSquare size={13} className="shrink-0 text-[var(--cyan-500)]" />
            <span>{isHindi ? 'AI फ्रॉड शब्द पहचान सक्रिय' : 'NLP Scam Keyword Detection Active'}</span>
          </span>
          <button
            onClick={() => handleVerify()}
            disabled={isScanning || !textInput.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 shadow-lg shadow-[var(--primary-glow)] cursor-pointer shrink-0"
          >
            {isScanning ? (
              <span className="flex items-center gap-1.5">
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>{isHindi ? 'SMS जांच जारी...' : 'Analyzing SMS'}</span>
              </span>
            ) : (
              <>
                <Search size={14} className="shrink-0" />
                <span className="break-words">{t('satyaGpt.checkNow', 'Verify Message')}</span>
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
              {scanStep === 1 && (isHindi ? '1/3: फ्रॉड शब्दों और संदेश के इरादे का विश्लेषण...' : '1/3 Analyzing threat vectors & intent...')}
              {scanStep === 2 && (isHindi ? '2/3: 1930 राष्ट्रीय फ्रॉड डेटाबेस से मिलान...' : '2/3 Cross-referencing 1930 fraud database...')}
              {scanStep === 3 && (isHindi ? '3/3: लिंक व APK सुरक्षा हस्ताक्षर जांच...' : '3/3 Inspecting redirect links & APK signatures...')}
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
              className="text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] hover:bg-[var(--surface-overlay)] transition-all text-left flex flex-col gap-1 cursor-pointer group shadow-sm w-full min-w-0 overflow-hidden"
            >
              <span className="font-bold text-[var(--text-primary)] text-[11px] group-hover:text-[var(--cyan-400)] transition-colors break-words">
                {s.label}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] line-clamp-2 font-mono break-words">
                {s.value}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
