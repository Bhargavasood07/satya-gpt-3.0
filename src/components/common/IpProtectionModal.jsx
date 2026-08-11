import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, CheckCircle2, Award, X, FileText, Scale } from 'lucide-react';

const IpProtectionModal = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[#0D1527] border-2 border-rose-500/80 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(239,68,68,0.4)] relative max-h-[90vh] overflow-y-auto space-y-4 text-xs"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#060913]"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-rose-500/40 pb-3">
          <div className="w-11 h-11 rounded-xl bg-rose-500/20 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
            <Lock size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold uppercase text-rose-300 tracking-wider">
                Proprietary IP & Code Fortress Active
              </h2>
            </div>
            <p className="text-[10px] text-rose-200/80">Source Code, Architecture & Threat Engine Protected by Law</p>
          </div>
        </div>

        {/* Protection Shields List */}
        <div className="space-y-2.5">
          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-100 text-xs">Anti-DevTools & Source Obfuscation</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Vite production bundle is compiled with zero source maps (`sourcemap: false`), Terser variable mangling, and dynamic anti-debugger inspection traps.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl flex items-start gap-2.5">
            <Scale size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-100 text-xs">Legal Copyright & Patent Protection</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Protected under Indian Copyright Act (1957), Information Technology Act (2000), and International Intellectual Property Treaties.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-100 text-xs">Zero-Trust Client Data Privacy</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Client session memory is encrypted using salt obfuscation (`SATYA_GPT_ZERO_TRUST_PROPRIETARY_IP_SHIELD_2026`).
              </p>
            </div>
          </div>
        </div>

        {/* Founder Stamp */}
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-center space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Sole Founder & Intellectual Property Owner</div>
          <div className="text-sm font-extrabold text-slate-100">Bhargava Sood</div>
          <div className="text-[10px] text-rose-300">SATYA-GPT National AI Cyber Defense Platform</div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#060913] hover:bg-slate-800 border border-[#27395C] text-slate-200 font-bold rounded-xl text-xs"
        >
          Acknowledge Security Clearance
        </button>
      </motion.div>
    </div>
  );
});

IpProtectionModal.displayName = 'IpProtectionModal';
export default IpProtectionModal;
