import React, { memo } from 'react';
import { ShieldAlert, AlertTriangle, Activity } from 'lucide-react';

const LIVE_ALERTS = [
  '🚨 LIVE ALERT: "Electricity Bill Disconnection SMS" active in Delhi/NCR & UP West',
  '⚠️ WARNING: "Fake Speed e-Challan APK Download" reported in Mumbai & Pune',
  '🛡️ THREAT BLOCKED: "SBI KYC Update WhatsApp Phishing Link" neutralised in Bengaluru',
  '🚨 LIVE ALERT: "Free Laptop Scheme WhatsApp Chain Scam" targeting students nationwide',
  '⚠️ WARNING: "Part-Time Telegram Youtube Like Scam" active across major cities',
];

const LiveScamTicker = memo(() => {
  return (
    <div className="w-full bg-[#070A14] border-b border-[#1E2D4A] py-1.5 px-3 overflow-hidden select-none font-mono text-xs flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold shrink-0 animate-pulse">
        <Activity size={12} className="text-rose-400" />
        <span>LIVE SCAM RADAR</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap flex-1 relative">
        <div className="inline-block animate-[ticker_35s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
          {LIVE_ALERTS.map((alertText, idx) => (
            <span key={idx} className="mr-8 text-amber-300 text-[11px] font-bold">
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
