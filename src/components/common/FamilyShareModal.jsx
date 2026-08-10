import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Baby, MessageSquare, Copy, X, CheckCircle2, Heart } from 'lucide-react';

const FamilyShareModal = memo(({ onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const shareText = `👨‍👩‍👧 *SATYA-GPT FAMILY CYBER SHIELD* 👨‍👩‍👧\n\nI have pre-configured SATYA-GPT Child & Senior Safety Guard for our family!\n\nOpen this link to automatically protect your phone from online scams, phishing, and fake news:\nhttps://satya-gpt-30.vercel.app/?guard=active\n\nStay Safe! ❤️`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-md bg-[#131B2E] border border-amber-500/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-[#1E2D4A] pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Baby size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              1-Click Family Cyber Guard Share
            </h2>
            <p className="text-[10px] text-[var(--text-muted)]">Protect parents, kids & relatives with a 1-tap WhatsApp link</p>
          </div>
        </div>

        <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#27395C] text-xs font-mono text-amber-200/90 leading-relaxed">
          <pre className="whitespace-pre-wrap">{shareText}</pre>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <MessageSquare size={16} />
            <span>Share Guard Link on WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[#0B0F19] border border-[#27395C] hover:border-amber-400 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Text'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
});

FamilyShareModal.displayName = 'FamilyShareModal';
export default FamilyShareModal;
