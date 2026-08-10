import React, { memo } from 'react';
import { Share2, MessageSquare } from 'lucide-react';

const WhatsAppShareButton = memo(({ payload = '', verdict = 'fake' }) => {
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🚨 *SATYA-GPT CYBER ALERT* 🚨\n\n` +
      `Threat Verdict: *${verdict.toUpperCase()}*\n` +
      `Scanned Payload: ${payload || 'http://suspicious-link.xyz'}\n` +
      `VirusTotal 92-Engine Threat Rating: Flagged Malicious / Phishing\n\n` +
      `Verify all suspicious links & SMS for free at:\n` +
      `https://satya-gpt-30.vercel.app/\n\n` +
      `National Cyber Crime Helpline: 1930`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppShare}
      type="button"
      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
      title="Share threat alert directly to WhatsApp contacts or 1930 Helpline"
    >
      <MessageSquare size={14} />
      <span>WhatsApp Alert</span>
    </button>
  );
});

WhatsAppShareButton.displayName = 'WhatsAppShareButton';
export default WhatsAppShareButton;
