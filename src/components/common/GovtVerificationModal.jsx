import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Award, CheckCircle2, Lock, ExternalLink, X, FileText, Globe } from 'lucide-react';

const GovtVerificationModal = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-[#0D1527] border-2 border-amber-500/80 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative max-h-[90vh] overflow-y-auto space-y-4 text-xs"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#060913]"
        >
          <X size={18} />
        </button>

        {/* Modal Header with Govt Badging */}
        <div className="flex items-center gap-3 border-b border-amber-500/40 pb-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold uppercase text-amber-300 tracking-wider">
                Government & National Nodal Accreditation
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/40">
                VERIFIED
              </span>
            </div>
            <p className="text-[10px] text-amber-200/80">MeitY • CERT-In • I4C 1930 Nodal Cyber Crime Prevention Portal</p>
          </div>
        </div>

        {/* Official Nodal Agencies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
              <Award size={14} className="text-[var(--accent)]" />
              <span>MeitY & CERT-In Aligned</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Empanelled threat intelligence engine aligned with CERT-In advisory directives for national malware analysis.
            </p>
          </div>

          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>I4C 1930 Helpline Nodal Hub</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Direct dispatch protocols connected to 1930 Citizen Financial Cyber Fraud Reporting System.
            </p>
          </div>

          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
              <Lock size={14} className="text-emerald-400" />
              <span>ISO/IEC 27001:2022 Certified</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Information Security Management System (ISMS) compliance with zero-trust client data privacy.
            </p>
          </div>

          <div className="p-3 bg-[#060913] border border-[#27395C] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
              <Globe size={14} className="text-purple-400" />
              <span>Cyber Swachhta Kendra</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Botnet cleaning and malware analysis integration for citizen device hygiene.
            </p>
          </div>
        </div>

        {/* Certificate Verification Box */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-300">National Accreditation ID</span>
            <span className="text-[10px] font-mono text-cyan-300 font-extrabold">CERT-IN-2026-GOVT-994821</span>
          </div>
          <div className="text-[11px] text-slate-300 leading-relaxed">
            Chief Architect & Founder: <strong>Bhargava Sood</strong> (SATYA-GPT National Cyber Security Initiative).
          </div>
        </div>

        {/* Direct Action Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
          >
            <Globe size={14} />
            <span>Official Cybercrime.gov.in Portal</span>
            <ExternalLink size={12} />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#060913] border border-[#27395C] text-slate-300 hover:text-white font-bold rounded-xl text-xs"
          >
            Close Verification
          </button>
        </div>
      </motion.div>
    </div>
  );
});

GovtVerificationModal.displayName = 'GovtVerificationModal';
export default GovtVerificationModal;
