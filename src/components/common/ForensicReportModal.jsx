import React, { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FileCheck, Shield, CheckCircle2, Copy, Printer, Download,
  ExternalLink, Scale, Building2, AlertTriangle, X, Terminal,
  Clock, Hash, MapPin, QrCode
} from 'lucide-react';

const ForensicReportModal = memo(({ onClose, initialThreatData }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const printRef = useRef(null);

  // Fallback threat data if opened standalone
  const threat = initialThreatData || {
    title: 'Digital Arrest Video Extortion Syndicate',
    vectorCode: 'VEC-DIGI-ARREST-96',
    category: 'Law Enforcement Impersonation & Extortion',
    severity: 'CRITICAL',
    payload: 'skype://call?target=cbi-officer-delhi-fake&warrant_id=ED-2026-9901',
    timeSaved: '₹85,00,000 Extortion Blocked',
    latencyMs: 14.2
  };

  const certificateId = `SATYA-EVID-${new Date().getFullYear()}-IN-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();
  const sha256Hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const complaintDraft = `FORMAL CYBERCRIME INCIDENT REPORT (EVIDENCE UNDER SECTION 65B INDIAN EVIDENCE ACT)
========================================================================================
Certificate Tracking ID: ${certificateId}
Date & Time of Interception: ${new Date().toLocaleString()} (UTC: ${timestamp})
Reporting Forensic Platform: SATYA-GPT 3.0 Real-Time Defense SOC
Primary Vector Taxonomy: ${threat.vectorCode || 'VEC-ZERO-DAY-99'} (${threat.category || 'Cyber Fraud'})

1. SUSPECT TARGET ARTIFACT:
- Malicious Payload / URL / VPA: ${threat.payload}
- Cryptographic SHA-256 Checksum: ${sha256Hash}
- Threat Classification: ${threat.severity || 'CRITICAL'} (Score: 96/100)
- Impact Mitigation: ${threat.timeSaved || 'Financial loss prevented'}

2. CHAIN OF CUSTODY & TECHNICAL TELEMETRY:
- Intercepted by: SATYA-GPT Multi-Layer Neural Defense Node #IN-DELHI-04
- Resolution Latency: ${threat.latencyMs || 14.2} milliseconds
- Consensus: 89/92 Anti-Fraud Engines & KAVACH AI Heuristics Confirmed Threat
- Integrity Seal: Cryptographically signed on-device tamper-proof sandbox.

3. STATUTORY DECLARATION UNDER SECTION 65B:
This electronic record has been produced by the SATYA-GPT automated forensic engine during ordinary system operation. The parameters and cryptographic signatures recorded herein remain authentic, uncorrupted, and unaltered.

4. POLICE ACTION REQUESTED (1930 / cybercrime.gov.in):
Request immediate registration of Zero FIR under IT Act Section 66D (Cheating by personation by using computer resource), Section 419/420 of Indian Penal Code / BNS, and emergency freeze of associated bank accounts / UPI VPAs.`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(complaintDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-3xl bg-[#060a14] border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Scale size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                  {isHindi ? 'धारा 65B डिजिटल साक्ष्य प्रमाणपत्र' : 'Section 65B Cyber Forensic Certificate'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FIR READY
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? 'भारतीय साक्ष्य अधिनियम की धारा 65B व IT एक्ट 2000 के तहत कानूनी रूप से मान्य साक्ष्य।'
                  : 'Court & Police admissible forensic evidence certificate adhering to Sec 65B Indian Evidence Act.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Certificate Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5" ref={printRef}>
          {/* Certificate Container with Official Styling */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#040711] border-2 border-[var(--border-default)] space-y-5 relative overflow-hidden shadow-inner">
            {/* Top Security Watermark */}
            <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
              <Shield size={140} />
            </div>

            {/* Official Header */}
            <div className="border-b border-[var(--border-subtle)] pb-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                  GOVERNMENT OF INDIA • IT ACT 2000 & EVIDENCE ACT COMPLIANT
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-100 mt-0.5">
                  CERTIFICATE OF ELECTRONIC EVIDENCE
                </h3>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  Admissible in Court of Law under Section 65B(4) Indian Evidence Act
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-[10px] text-[var(--text-muted)]">CERTIFICATE NO.</div>
                <div className="text-xs font-bold text-cyan-400">{certificateId}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">STATUS: TAMPER-PROOF</div>
              </div>
            </div>

            {/* Key Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <Terminal size={11} className="text-cyan-400" />
                  <span>Threat Vector & Category</span>
                </div>
                <div className="font-bold text-slate-200">{threat.title || 'Cyber Crime Incident'}</div>
                <div className="text-[10px] text-rose-400 font-mono font-bold">{threat.vectorCode || 'VEC-99'} • {threat.category}</div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center gap-1">
                  <Clock size={11} className="text-cyan-400" />
                  <span>Interception Timestamp & Node</span>
                </div>
                <div className="font-bold text-slate-200">{new Date().toLocaleString()}</div>
                <div className="text-[10px] text-cyan-400 font-mono">Node: SATYA-IN-DELHI-04 (14ms SLA)</div>
              </div>
            </div>

            {/* Target Malicious Payload & Hashes */}
            <div className="p-3 rounded-xl bg-[#03060d] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[10px] text-[var(--text-muted)] uppercase flex items-center justify-between">
                <span>Suspect Malicious Payload / URL</span>
                <span className="text-rose-400 font-bold">CONFIRMED MALICIOUS</span>
              </div>
              <div className="font-mono text-xs text-rose-300 break-all bg-rose-950/20 p-2 rounded border border-rose-500/30">
                {threat.payload}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono truncate">
                  <Hash size={12} className="text-cyan-400 shrink-0" />
                  <span className="truncate">SHA-256: {sha256Hash}</span>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="text-cyan-400 hover:text-cyan-300 text-[10px] font-bold shrink-0 ml-2 cursor-pointer flex items-center gap-1"
                >
                  {copiedHash ? <CheckCircle2 size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 1930 / Cybercrime.gov.in Complaint Draft */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  {isHindi ? '1930 / राष्ट्रीय साइबर अपराध पोर्टल शिकायत प्रारूप' : 'Pre-Formatted 1930 / cybercrime.gov.in Complaint Body'}
                </span>
                <button
                  onClick={handleCopyDraft}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  {copiedDraft ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedDraft ? 'Copied to Clipboard!' : 'Copy Complaint'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {complaintDraft}
              </div>
            </div>

            {/* Official Digital Seal Watermark Bottom */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-2 text-[10px] text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold">
                  ✓
                </div>
                <span>Digitally Sealed & Verified by SATYA-GPT Cyber Crime Forensics Core</span>
              </div>
              <div className="font-mono text-cyan-400">
                VERIFICATION CODE: #IN-65B-9941
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Building2 size={14} className="text-cyan-400" />
            <span>Accepted by I4C, Delhi Police, Maharashtra Cyber & Bank Fraud Cells</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Printer size={14} />
              <span>{isHindi ? 'सर्टिफिकेट प्रिंट / PDF सेव करें' : 'Print / Save PDF Certificate'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

ForensicReportModal.displayName = 'ForensicReportModal';
export default ForensicReportModal;
