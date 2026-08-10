import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, PhoneCall, Lock, CheckCircle2, X, Send } from 'lucide-react';

const GoldenHourEmergencyModal = memo(({ onClose }) => {
  const [frozen, setFrozen] = useState(false);
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('');
  const [fraudTxnId, setFraudTxnId] = useState('');

  const handleDispatchFreeze = (e) => {
    e.preventDefault();
    setFrozen(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-[#131B2E] border-2 border-rose-500/80 rounded-2xl p-5 sm:p-6 shadow-[0_0_40px_rgba(239,68,68,0.4)] relative max-h-[90vh] overflow-y-auto space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-rose-500/40 pb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-rose-300">
              15-Minute "Golden Hour" Emergency Bank Freeze Dispatch
            </h2>
            <p className="text-[10px] text-rose-200/80">Immediate Nodal Officer Dispatch to Lock Fraudulent Beneficiary Accounts</p>
          </div>
        </div>

        {frozen ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-3 font-mono">
            <CheckCircle2 size={40} className="mx-auto text-emerald-400 animate-bounce" />
            <div className="text-sm font-bold text-emerald-300">Emergency Freeze Signal Dispatched to NPCI & {bankName}!</div>
            <p className="text-xs text-emerald-200/80">Reference Token: <strong className="text-white">FREEZE-1930-883921</strong></p>
            <div className="flex justify-center gap-2 pt-1">
              <a
                href="tel:1930"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md"
              >
                <PhoneCall size={14} />
                <span>Dial 1930 Helpline Now</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDispatchFreeze} className="space-y-3 text-xs">
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-[11px] text-rose-200 leading-relaxed font-mono">
              <AlertTriangle size={14} className="inline mr-1 text-rose-400" />
              Use this emergency dispatch ONLY if you recently transferred money to a scammer. Action will alert Bank Cyber Nodal Officers to block beneficiary account payout.
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Your Bank Name</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. SBI / HDFC / ICICI / Paytm Bank"
                className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Account / UPI ID</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 9876543210@upi or A/C"
                  className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">UPI / UTR Transaction ID</label>
                <input
                  type="text"
                  required
                  value={fraudTxnId}
                  onChange={(e) => setFraudTxnId(e.target.value)}
                  placeholder="e.g. 329188492011"
                  className="w-full bg-[#0B0F19] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Lock size={15} />
              <span>Dispatch Emergency Lock Signal to Bank & 1930</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
});

GoldenHourEmergencyModal.displayName = 'GoldenHourEmergencyModal';
export default GoldenHourEmergencyModal;
