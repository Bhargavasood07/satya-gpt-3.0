import React, { memo } from 'react';
import { Activity } from 'lucide-react';

const LIVE_ALERTS = [
  '🚨 LIVE ALERT: "Electricity Bill Disconnection SMS" active in Delhi/NCR & UP West',
  '⚠️ WARNING: "Fake Speed e-Challan APK Download" reported in Mumbai & Pune',
  '🛡️ THREAT BLOCKED: "SBI KYC Update WhatsApp Phishing Link" neutralised in Bengaluru',
  '🚨 LIVE ALERT: "Free Laptop Scheme WhatsApp Chain Scam" targeting students nationwide',
  '⚠️ WARNING: "Part-Time Telegram Youtube Like Scam" active across major cities',
];

const LiveScamTicker = memo(() => {
  // Create a 2x duplicate array for seamless infinite looping without gaps
  const tickerItems = [...LIVE_ALERTS, ...LIVE_ALERTS];

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
        <span>LIVE SCAM RADAR</span>
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
