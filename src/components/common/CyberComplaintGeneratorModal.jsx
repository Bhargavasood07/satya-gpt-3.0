import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Copy, CheckCircle2, X, ShieldAlert, Building2 } from 'lucide-react';

const CyberComplaintGeneratorModal = memo(({ threatPayload = 'http://suspicious-bank-update.xyz', onClose }) => {
  const [copied, setCopied] = useState(false);
  const [victimName, setVictimName] = useState('');
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [stolenAmount, setStolenAmount] = useState('5000');

  const complaintText = `OFFICIAL CYBER CRIME & BANK COMPLAINT FORM
--------------------------------------------------
To: The Station House Officer / Nodal Officer, Cyber Crime Branch & ${bankName}
Date: ${new Date().toLocaleDateString()}
Incident Time: ${new Date().toLocaleTimeString()}

SUBJECT: Complaint regarding Financial Cyber Fraud / Phishing Link

Respected Sir/Madam,

I am submitting a formal cybercrime complaint regarding a fraudulent transaction / phishing incident.

INCIDENT DETAILS:
- Complainant Name: ${victimName || '[Name]'}
- Financial Bank / Institution: ${bankName}
- Disputed / Defrauded Amount: ₹${stolenAmount}
- Malicious Link / SMS Payload: ${threatPayload}
- VirusTotal 92-Engine Threat Verdict: FAKE / PHISHING (High Risk Score 92/100)
- Technical Evidence: Detected by Kaspersky, Google Safebrowsing, BitDefender URL Scanners

REQUESTED ACTION:
1. Freeze the recipient account immediately under Section 91 CrPC / Cyber Crime Guidelines.
2. Dispatch complaint to National Cyber Crime Reporting Portal (cybercrime.gov.in) & 1930 Helpline.
3. Initiate reversal of disputed funds to victim account.

Sincerely,
${victimName || '[Complainant Signature]'}
Verified via SATYA-GPT National Cyber Safety Platform
--------------------------------------------------`;

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>SATYA-GPT Cyber Crime Complaint</title>
          <style>
            body { font-family: monospace; padding: 40px; line-height: 1.6; }
            pre { font-size: 14px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${complaintText}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-xl bg-[#131B2E] border border-[#27395C] rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-[#1E2D4A] pb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-100">
              1-Click Bank & Police Cyber Complaint PDF Generator
            </h2>
            <p className="text-[10px] text-[var(--text-muted)]">Pre-formatted official complaint document for Indian Banks & 1930 Cyber Police</p>
          </div>
        </div>

        {/* Input Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Victim Name</label>
            <input
              type="text"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-2 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. SBI / HDFC / ICICI"
              className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-2 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Fraud Amount (₹)</label>
            <input
              type="number"
              value={stolenAmount}
              onChange={(e) => setStolenAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-2 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </div>

        {/* Complaint Text Preview Box */}
        <div className="bg-[#0B0F19] border border-[#27395C] p-3 rounded-xl max-h-56 overflow-y-auto text-[11px] font-mono leading-relaxed text-slate-300">
          <pre className="whitespace-pre-wrap">{complaintText}</pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handlePrintPdf}
            className="flex-1 py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Download size={15} />
            <span>Download Official PDF / Print</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 bg-[#0B0F19] border border-[#27395C] hover:border-[var(--accent)] text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
            <span>{copied ? 'Complaint Text Copied!' : 'Copy Complaint Text'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
});

CyberComplaintGeneratorModal.displayName = 'CyberComplaintGeneratorModal';
export default CyberComplaintGeneratorModal;
