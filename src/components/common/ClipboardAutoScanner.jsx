import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, ShieldAlert, Sparkles, X, ArrowRight } from 'lucide-react';

const ClipboardAutoScanner = memo(({ onScanLink }) => {
  const [clipboardUrl, setClipboardUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text && (text.startsWith('http://') || text.startsWith('https://') || text.includes('sbi') || text.includes('pan'))) {
            // Check if already scanned recently
            const lastScanned = sessionStorage.getItem('last_clipboard_scanned');
            if (lastScanned !== text) {
              setClipboardUrl(text);
              setIsVisible(true);
            }
          }
        }
      } catch (err) {
        // Clipboard permission not granted or silent background failure
      }
    };

    // Check on mount & window focus
    checkClipboard();
    window.addEventListener('focus', checkClipboard);
    return () => window.removeEventListener('focus', checkClipboard);
  }, []);

  const handleScan = () => {
    sessionStorage.setItem('last_clipboard_scanned', clipboardUrl);
    setIsVisible(false);
    if (onScanLink) {
      onScanLink(clipboardUrl);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem('last_clipboard_scanned', clipboardUrl);
    setIsVisible(false);
  };

  if (!isVisible || !clipboardUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-[65] w-[92%] max-w-md bg-[#131B2E] border border-[var(--accent)] rounded-2xl p-3.5 shadow-[0_0_25px_rgba(0,229,255,0.3)] font-mono text-slate-200 backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#1E2D4A] pb-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
            <Clipboard size={16} className="animate-pulse" />
            <span>ZERO-CLICK CLIPBOARD LINK DETECTED</span>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] text-[var(--text-muted)] truncate bg-[#0B0F19] p-2 rounded-lg border border-[#27395C]">
            {clipboardUrl}
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleScan}
              className="flex-1 py-2 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Sparkles size={14} />
              <span>1-Tap Scan (92 Engines)</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={handleDismiss}
              className="px-3 py-2 bg-[#0B0F19] text-[var(--text-muted)] hover:text-slate-200 border border-[#27395C] rounded-xl text-xs font-bold"
            >
              Ignore
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

ClipboardAutoScanner.displayName = 'ClipboardAutoScanner';
export default ClipboardAutoScanner;
