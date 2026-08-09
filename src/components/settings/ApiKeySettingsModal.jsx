import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, X, CheckCircle2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ApiKeySettingsModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cybershield_vt_apikey') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('cybershield_vt_apikey', apiKey.trim());
    } else {
      localStorage.removeItem('cybershield_vt_apikey');
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-3">
          <div className="flex items-center gap-2">
            <Key className="text-[var(--accent)]" size={20} />
            <h3 className="font-bold text-base text-[var(--text-primary)]">VirusTotal v3 API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Enter your personal 64-character VirusTotal v3 API key from{' '}
          <a
            href="https://www.virustotal.com/gui/my-apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            virustotal.com
          </a>
          . Leaves empty to use built-in neural fallback scanner.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-primary)]">API Key (x-apikey):</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="e.g. 4a2b89c... (64 characters)"
            className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> Key Saved Successfully!
            </span>
          ) : (
            <span className="text-[11px] text-[var(--text-muted)]">
              {apiKey ? 'API Key Configured' : 'No Key Set (Using Neural Fallback)'}
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Save size={14} />
            <span>Save Settings</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
