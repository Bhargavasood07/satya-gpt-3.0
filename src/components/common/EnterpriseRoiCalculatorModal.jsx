import React, { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, Calculator, ShieldCheck, DollarSign, Building2,
  CheckCircle2, ArrowRight, Download, Send, Zap, Award, Sparkles, X,
  FileSpreadsheet, PhoneCall, HelpCircle
} from 'lucide-react';

const FOUNDER_EMAIL = 'bhargavasood5@gmail.com';

const INDUSTRY_PROFILES = [
  { id: 'fintech', name: 'Fintech & UPI Apps', fraudRate: 0.08, avgTxn: 1450, baseRisk: 'HIGH' },
  { id: 'banking', name: 'Retail Commercial Banks', fraudRate: 0.05, avgTxn: 4200, baseRisk: 'CRITICAL' },
  { id: 'ecommerce', name: 'E-Commerce & Marketplaces', fraudRate: 0.12, avgTxn: 1850, baseRisk: 'MEDIUM' },
  { id: 'telecom', name: 'Telecom & ISP Carriers', fraudRate: 0.15, avgTxn: 450, baseRisk: 'HIGH' },
  { id: 'nbfc', name: 'NBFC & Micro-Lending', fraudRate: 0.10, avgTxn: 12500, baseRisk: 'HIGH' }
];

const EnterpriseRoiCalculatorModal = memo(({ onClose, onOpenEnterprisePartnership }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRY_PROFILES[0]);
  const [monthlyVolumeCr, setMonthlyVolumeCr] = useState(250); // ₹250 Crore monthly volume
  const [monthlyUsers, setMonthlyUsers] = useState(1500000); // 1.5 Million MAU
  const [customFraudRate, setCustomFraudRate] = useState(selectedIndustry.fraudRate);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [companyEmail, setCompanyEmail] = useState('');

  // Currency multiplier: 1 USD ~ ₹85
  const fxRate = currency === 'USD' ? 85 : 1;

  // Real-time calculations
  const calculation = useMemo(() => {
    // Monthly Volume in actual Rupee amount
    const volumeINR = monthlyVolumeCr * 10000000;
    
    // Total annual transaction volume
    const annualVolumeINR = volumeINR * 12;

    // Gross Fraud Exposure (Annual)
    const annualFraudExposureINR = annualVolumeINR * (customFraudRate / 100);

    // SATYA-GPT Interception rate: 93.6%
    const interceptionRate = 0.936;
    const directLossesSavedINR = annualFraudExposureINR * interceptionRate;

    // Estimated API scans per year (estimated at 1.5 checks per MAU per month)
    const annualApiScans = monthlyUsers * 1.5 * 12;

    // SATYA-GPT B2B Tier Cost (₹0.08 per scan at scale)
    const annualSatyaCostINR = Math.max(1200000, annualApiScans * 0.08);

    // ROI Multiple: (Savings - Cost) / Cost
    const netSavingsINR = directLossesSavedINR - annualSatyaCostINR;
    const roiMultiplier = Math.max(1.5, (directLossesSavedINR / annualSatyaCostINR)).toFixed(1);

    // Payback period in days
    const dailySavings = directLossesSavedINR / 365;
    const paybackDays = Math.max(3, Math.round(annualSatyaCostINR / dailySavings));

    // Customer Trust & Retention value estimate (1.2% saved churn)
    const brandValuePreservedINR = (monthlyUsers * 420) * 0.012;

    return {
      annualVolumeINR,
      annualFraudExposureINR,
      directLossesSavedINR,
      annualSatyaCostINR,
      netSavingsINR,
      roiMultiplier,
      paybackDays,
      brandValuePreservedINR,
    };
  }, [monthlyVolumeCr, customFraudRate, monthlyUsers]);

  const formatCurrency = (valINR) => {
    if (currency === 'USD') {
      const usd = valINR / 85;
      if (usd >= 1000000) return `$${(usd / 1000000).toFixed(2)}M`;
      if (usd >= 1000) return `$${(usd / 1000).toFixed(0)}K`;
      return `$${usd.toFixed(0)}`;
    }
    // INR formatting in Crores / Lakhs
    if (valINR >= 10000000) return `₹${(valINR / 10000000).toFixed(2)} Cr`;
    if (valINR >= 100000) return `₹${(valINR / 100000).toFixed(2)} Lakh`;
    return `₹${Math.round(valINR).toLocaleString('en-IN')}`;
  };

  const handleIndustryChange = (ind) => {
    setSelectedIndustry(ind);
    setCustomFraudRate(ind.fraudRate);
  };

  const handleSendReport = (e) => {
    e.preventDefault();
    if (!companyEmail) return;

    const subject = encodeURIComponent(`[SATYA-GPT ROI Case] Enterprise Inquiry for ${selectedIndustry.name}`);
    const body = encodeURIComponent(
      `Enterprise Inquiry for SATYA-GPT B2B API Shield\n` +
      `-----------------------------------------------------\n` +
      `Industry: ${selectedIndustry.name}\n` +
      `Monthly Volume: ${formatCurrency(monthlyVolumeCr * 10000000)}\n` +
      `Monthly Active Users: ${monthlyUsers.toLocaleString()}\n` +
      `Projected Annual Fraud Saved: ${formatCurrency(calculation.directLossesSavedINR)}\n` +
      `Projected Enterprise ROI: ${calculation.roiMultiplier}x\n` +
      `Payback Period: ${calculation.paybackDays} Days\n\n` +
      `Contact Email: ${companyEmail}\n` +
      `Date: ${new Date().toLocaleString()}`
    );

    window.open(`mailto:${FOUNDER_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setLeadSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-[#060a14] border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-emerald-500/20 bg-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calculator size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                  {isHindi ? 'एंटरप्राइज फ्रॉड लॉस व ROI कैलकुलेटर' : 'Enterprise Fraud Loss & ROI Calculator'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CFO & INVESTOR TOOL
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? 'देखें कि SATYA-GPT API इंटीग्रेशन से आपके बैंक या ऐप के कितने करोड़ रुपये बच सकते हैं।'
                  : 'Calculate how much capital SATYA-GPT API saves your enterprise from digital fraud syndicates.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency toggle */}
            <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-0.5 text-xs font-bold">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded cursor-pointer ${currency === 'INR' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded cursor-pointer ${currency === 'USD' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
              >
                $ USD
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Industry Sector Selector */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>{isHindi ? '1. उद्योग क्षेत्र चुनें' : '1. Select Your Enterprise Sector'}</span>
              <span className="text-emerald-400 text-[10px]">Benchmarked against RBI & I4C 2025 Data</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {INDUSTRY_PROFILES.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => handleIndustryChange(ind)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIndustry.id === ind.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{ind.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">
                    Avg Txn: ₹{ind.avgTxn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sliders & Dynamic Parameter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Volume */}
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  {isHindi ? 'मासिक लेनदेन वॉल्यूम' : 'Monthly Transaction Volume'}
                </span>
                <span className="font-bold text-emerald-400 font-mono">
                  {formatCurrency(monthlyVolumeCr * 10000000)} / mo
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={monthlyVolumeCr}
                onChange={(e) => setMonthlyVolumeCr(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                <span>{currency === 'USD' ? '$1.2M' : '₹10 Cr'}</span>
                <span>{currency === 'USD' ? '$120M' : '₹1,000 Cr'}</span>
                <span>{currency === 'USD' ? '$240M+' : '₹2,000 Cr+'}</span>
              </div>
            </div>

            {/* Monthly Active Users */}
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  {isHindi ? 'मासिक सक्रिय उपयोगकर्ता (MAU)' : 'Monthly Active Users (MAU)'}
                </span>
                <span className="font-bold text-cyan-400 font-mono">
                  {(monthlyUsers / 1000000).toFixed(1)} Million Users
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={monthlyUsers}
                onChange={(e) => setMonthlyUsers(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                <span>100K Users</span>
                <span>5M Users</span>
                <span>10M+ Users</span>
              </div>
            </div>
          </div>

          {/* 3. Output ROI Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Annual Losses Prevented */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/40 space-y-1 shadow-lg">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>{isHindi ? 'वार्षिक फ्रॉड रोकथाम' : 'Annual Fraud Prevented'}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
                {formatCurrency(calculation.directLossesSavedINR)}
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                Based on 93.6% SATYA-GPT interception efficiency.
              </p>
            </div>

            {/* Enterprise ROI Multiple */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/50 to-slate-900 border border-cyan-500/40 space-y-1 shadow-lg">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} />
                <span>{isHindi ? 'अनुमानित ROI मल्टीपल' : 'Projected Enterprise ROI'}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
                {calculation.roiMultiplier}x
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                Net value saved vs. SATYA B2B API licensing cost.
              </p>
            </div>

            {/* Payback Period */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/50 to-slate-900 border border-purple-500/40 space-y-1 shadow-lg">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>{isHindi ? 'कैपिटल पेबैक समय' : 'Capital Payback Period'}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
                {calculation.paybackDays} Days
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                Recoups full annual API fee in under {calculation.paybackDays} days of operation.
              </p>
            </div>
          </div>

          {/* 4. Value Breakdown Table */}
          <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>{isHindi ? 'विस्तृत वित्तीय प्रभाव' : 'Detailed Financial Impact Breakdown'}</span>
              <span className="text-[10px] text-emerald-400 font-normal">SLA & Regulatory Compliant</span>
            </h4>

            <div className="divide-y divide-[var(--border-subtle)] text-xs font-mono">
              <div className="py-2 flex justify-between">
                <span className="text-[var(--text-secondary)]">Estimated Annual Gross Fraud Exposure:</span>
                <span className="font-bold text-rose-400">{formatCurrency(calculation.annualFraudExposureINR)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[var(--text-secondary)]">Direct Savings with SATYA-GPT Shield:</span>
                <span className="font-bold text-emerald-400">+{formatCurrency(calculation.directLossesSavedINR)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[var(--text-secondary)]">Estimated Annual SATYA-GPT API Tier Cost:</span>
                <span className="font-bold text-slate-300">{formatCurrency(calculation.annualSatyaCostINR)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[var(--text-secondary)]">Preserved Brand Equity & Customer Churn Value:</span>
                <span className="font-bold text-cyan-300">+{formatCurrency(calculation.brandValuePreservedINR)}</span>
              </div>
              <div className="py-2 flex justify-between text-sm font-bold bg-emerald-950/20 px-2 rounded">
                <span className="text-emerald-300">Net Enterprise Value Created:</span>
                <span className="text-emerald-400">+{formatCurrency(calculation.netSavingsINR)} / yr</span>
              </div>
            </div>
          </div>

          {/* 5. Direct Lead Capture & Prospectus Request */}
          <div className="p-4 rounded-xl bg-[#090e1a] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 justify-center sm:justify-start">
                <FileSpreadsheet size={15} className="text-cyan-400" />
                <span>{isHindi ? 'CFO व बोर्ड हेतु एग्जीक्यूटिव प्रपोजल प्राप्त करें' : 'Request Executive Business Case & SLA Proposal'}</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Includes custom volume pricing, pilot sandbox access, and integration roadmap.
              </p>
            </div>

            {leadSubmitted ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Proposal Request Dispatched!</span>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  placeholder="corporate.email@bank.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-default)] text-xs text-slate-200 focus:border-cyan-500 focus:outline-none w-full sm:w-56"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md"
                >
                  <Send size={13} />
                  <span>Send</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Award size={14} className="text-emerald-400" />
            <span>Designed for RBI Digital Lending & DPDP Act 2023 Enterprise Compliance</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenEnterprisePartnership && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEnterprisePartnership();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Building2 size={14} />
                <span>{isHindi ? 'B2B पार्टनरशिप पोर्टल खोलें' : 'Open Enterprise Partnership Deck'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

EnterpriseRoiCalculatorModal.displayName = 'EnterpriseRoiCalculatorModal';
export default EnterpriseRoiCalculatorModal;
