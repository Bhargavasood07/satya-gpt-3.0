import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LIVE_ALERTS_EN = [
  '🚨 LIVE ALERT: "Electricity Bill Disconnection SMS" active in Delhi/NCR & UP West',
  '⚠️ WARNING: "Fake Speed e-Challan APK Download" reported in Mumbai & Pune',
  '🛡️ THREAT BLOCKED: "SBI KYC Update WhatsApp Phishing Link" neutralised in Bengaluru',
  '🚨 LIVE ALERT: "Free Laptop Scheme WhatsApp Chain Scam" targeting students nationwide',
  '⚠️ WARNING: "Part-Time Telegram Youtube Like Scam" active across major cities',
];

const LIVE_ALERTS_HI = [
  '🚨 लाइव चेतावनी: दिल्ली और यूपी में "बिजली बिल कटने का फर्जी SMS" फ्रॉड सक्रिय',
  '⚠️ सावधान: मुंबई और पुणे में "फर्जी ट्रैफिक ई-चालान APK" भेजा जा रहा है',
  '🛡️ खतरा रोका गया: बेंगलुरु में "SBI बैंक KYC फर्जी WhatsApp लिंक" ब्लॉक किया गया',
  '🚨 लाइव चेतावनी: पूरे देश में "फ्री लैपटॉप योजना" का फर्जी मैसेज व्हाट्सएप पर वायरल',
  '⚠️ सावधान: बड़े शहरों में "यूट्यूब वीडियो लाइक कर पैसे कमाने का टेलीग्राम झांसा" सक्रिय',
];

const LiveScamTicker = memo(() => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const alerts = isHindi ? LIVE_ALERTS_HI : LIVE_ALERTS_EN;
  // Create a 2x duplicate array for seamless infinite looping without gaps
  const tickerItems = [...alerts, ...alerts];

  return (
    <div
      className="w-full py-1.5 px-3 overflow-hidden select-none font-mono text-xs flex items-center gap-2 border-b"
      style={{
        background: 'var(--surface-raised)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Static Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-500 text-[10px] font-bold shrink-0 z-10 shadow-sm">
        <Activity size={12} className="text-rose-500 animate-pulse" />
        <span>{isHindi ? 'लाइव साइबर अलर्ट' : 'LIVE SCAM RADAR'}</span>
      </div>

      {/* Seamless Marquee Container */}
      <div className="overflow-hidden flex-1 relative w-full">
        <div className="animate-marquee flex w-max cursor-pointer">
          {tickerItems.map((alertText, idx) => (
            <span
              key={idx}
              className="mr-8 text-[11px] font-bold shrink-0 tracking-wide"
              style={{ color: 'var(--warning)' }}
            >
              {alertText}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

LiveScamTicker.displayName = 'LiveScamTicker';
export default LiveScamTicker;
