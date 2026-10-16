import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, Award, ShieldCheck, DollarSign, Building2,
  CheckCircle2, ArrowRight, Download, Send, Zap, Sparkles, X,
  FileText, Globe, Layers, Lock, Cpu, Mail, Calendar, PhoneCall
} from 'lucide-react';
import { GitHubIcon } from './GitHubIcon';

const FOUNDER_EMAIL = 'bhargavasood5@gmail.com';

const InvestorDataRoomModal = memo(({ onClose, onOpenCalculator, onOpenSimulator }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [activeTab, setActiveTab] = useState('thesis'); // 'thesis', 'market', 'moat', 'compliance', 'financials'
  const [meetingRequested, setMeetingRequested] = useState(false);
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorFund, setInvestorFund] = useState('');

  const handleRequestPitch = (e) => {
    e.preventDefault();
    if (!investorEmail) return;

    const subject = encodeURIComponent(`[SATYA-GPT Investor Inquiry] Pitch Deck Request from ${investorFund || 'Angel/VC'}`);
    const body = encodeURIComponent(
      `Investor / Acquisition Partner Inquiry\n` +
      `-----------------------------------------------------\n` +
      `Fund / Organization: ${investorFund || 'Private Investor'}\n` +
      `Contact Email: ${investorEmail}\n` +
      `Target: SATYA-GPT 3.0 Real-Time Defense SOC\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Requesting Full Confidential Pitch Deck, Cap Table, and Technical Due Diligence Room access.`
    );

    window.open(`mailto:${FOUNDER_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setMeetingRequested(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-[#060a14] border-2 border-purple-500/40 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-purple-500/20 bg-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                  {isHindi ? 'संस्थापक निवेशक डेटा रूम व अनुपालन केंद्र' : 'Investor Executive Data Room & Diligence Suite'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SERIES SEED / STRATEGIC M&A
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? 'बाजार आकार, तकनीकी विशिष्टता, विनियामक अनुपालन व व्यापार मॉडल की संपूर्ण जानकारी।'
                  : 'TAM/SAM/SOM market analysis, proprietary AI moats, unit economics, and DPDP/RBI compliance.'}
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)] overflow-x-auto text-xs">
          {[
            { id: 'thesis', label: 'Investment Thesis', icon: Sparkles },
            { id: 'market', label: 'Market (TAM/SAM)', icon: Globe },
            { id: 'moat', label: 'Proprietary Moat', icon: Lock },
            { id: 'compliance', label: 'Regulatory Compliance', icon: ShieldCheck },
            { id: 'financials', label: 'Business Model', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-300 bg-purple-950/30'
                    : 'border-transparent text-[var(--text-muted)] hover:text-slate-200'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: THESIS */}
          {activeTab === 'thesis' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30 space-y-2">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                  THE MACRO CRISIS & OPPORTUNITY
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-100">
                  India processes 16+ Billion UPI transactions per month. Organized syndicates exploit this with ₹1.25 Lakh Crore in fraud losses.
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SATYA-GPT is built as India’s first sovereign, multi-layered cyber defense platform that intercepts zero-day scams (Digital Arrest, e-Challan APKs, UPI Deep-Links) in under 15ms—before funds leave the victim’s account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">SPEED MOAT</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">14.2ms</div>
                  <p className="text-[10px] text-[var(--text-muted)]">Sub-15ms edge inference across Indian metro clusters.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">INTERCEPTION ACCURACY</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">99.4%</div>
                  <p className="text-[10px] text-[var(--text-muted)]">Ensemble consensus across 92 anti-malware engines.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">CAPITAL EFFICIENCY</div>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">18.5x ROI</div>
                  <p className="text-[10px] text-[var(--text-muted)]">Direct fraud losses prevented vs. API licensing cost.</p>
                </div>
              </div>

              {/* Quick links to Simulator & Calculator */}
              <div className="flex flex-col sm:flex-row gap-3">
                {onOpenSimulator && (
                  <button
                    onClick={() => { onClose(); onOpenSimulator(); }}
                    className="flex-1 p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-left hover:border-rose-400 transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-rose-300 flex items-center justify-between">
                      <span>⚡ Test Zero-Day Attack Simulator</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">See live 4-stage defense in 14ms.</p>
                  </button>
                )}
                {onOpenCalculator && (
                  <button
                    onClick={() => { onClose(); onOpenCalculator(); }}
                    className="flex-1 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                      <span>📈 Explore Enterprise ROI Calculator</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">Simulate bank loss prevention economics.</p>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MARKET SIZE */}
          {activeTab === 'market' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#090e1a] border border-cyan-500/40 space-y-2">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase">TAM (Total Addressable Market)</div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">$15.2 Billion</div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    APAC Cybercrime, Fraud Prevention, and Identity Theft Defense market projected by 2028.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1a] border border-emerald-500/40 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase">SAM (Serviceable Addressable)</div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">$2.8 Billion</div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Indian Fintech, Retail Banking, NBFCs, E-Commerce, and Telecom anti-smishing spend.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1a] border border-purple-500/40 space-y-2">
                  <div className="text-[11px] font-bold text-purple-400 uppercase">SOM (Serviceable Obtainable)</div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">$180 Million</div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Target 3-year market capture across Tier-1/Tier-2 Indian banks and digital lenders.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] space-y-2 text-xs">
                <h4 className="font-bold text-slate-200">Key Catalysts Driving Immediate Adoption:</h4>
                <ul className="space-y-1.5 text-[var(--text-secondary)] list-disc pl-4 leading-relaxed">
                  <li><strong>RBI Digital Lending & Fraud Directives</strong>: Commercial banks mandated to implement real-time mule account and phishing interception mechanisms.</li>
                  <li><strong>DPDP Act 2023 Penalties</strong>: Penalties up to ₹250 Crore for enterprise data breaches accelerating proactive fraud defense spend.</li>
                  <li><strong>Digital Arrest & Video Extortion Surge</strong>: MHA & I4C high-priority alerts creating direct procurement pipelines for law enforcement tech.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PROPRIETARY MOAT */}
          {activeTab === 'moat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Cpu size={15} />
                    <span>Proprietary Vector Feature Taxonomy</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Custom indexing of Indian-specific scam taxonomy codes (e.g., <code>VEC-DIGI-ARREST-96</code>, <code>VEC-ECHALLAN-APK-91</code>). Enables sub-millisecond pattern matching against evolving syndicate operations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    <span>On-Device Sensor & Motion Biometrics</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Patent-pending real-time spatial gyroscope & video frame difference analysis to detect hardware spoofing, deepfakes, and emulation environments with zero cloud latency.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Sparkles size={15} />
                    <span>KAVACH Neural Threat Reasoning Model</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Specialized multimodal LLM fine-tuned on 10,000+ Indian cybercrime FIRs, deceptive SMS payloads, and vernacular Hindi/Hinglish extortion transcripts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Layers size={15} />
                    <span>92-Engine VirusTotal Fleet Consensus</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Automated consensus pipeline eliminating false positives (&lt;0.01% error rate) and providing tamper-proof evidence for police and banking dispute cells.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPLIANCE */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-1.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>DPDP Act 2023 Compliant</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Zero-knowledge scanning architecture: PII and bank details are anonymized on-device; no sensitive citizen credentials persisted.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-1.5">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>RBI Cyber Security Framework Aligned</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Designed to fulfill Annex 1 & 2 requirements for real-time customer transaction risk monitoring and fraud mitigation in commercial banks.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-1.5">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>CERT-In Incident Reporting Protocol</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Standardized automated generation of threat telemetry compliant with CERT-In 6-hour cybersecurity incident reporting mandates.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1.5">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>Sec 65B Indian Evidence Act Certified</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Automated generation of tamper-proof cryptographic certificates admissible in Indian criminal and high courts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIALS & MONETIZATION */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">B2C CONSUMER SHIELD</div>
                  <div className="text-lg font-bold text-slate-100">Freemium + Family Guard</div>
                  <div className="text-xs text-emerald-400 font-mono font-bold">₹99 / month / family</div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Real-time link, SMS, and WhatsApp protection for parents and senior citizens.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">B2B ENTERPRISE API</div>
                  <div className="text-lg font-bold text-slate-100">Pay-Per-Scan API Tier</div>
                  <div className="text-xs text-purple-300 font-mono font-bold">₹0.08 - ₹0.15 / scan</div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Seamless SDK integration into banking, payment, and e-commerce checkout funnels.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] space-y-2">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">B2G LAW ENFORCEMENT</div>
                  <div className="text-lg font-bold text-slate-100">Cyber Command Node</div>
                  <div className="text-xs text-amber-300 font-mono font-bold">Annual Sovereign License</div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Multi-state telemetry and Section 65B automated evidence generation for Police Cyber Cells.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Investor Contact & Pitch Request Form */}
          <div className="p-4 rounded-xl bg-[#090e1a] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail size={15} className="text-purple-400" />
                <span>{isHindi ? 'संस्थापक से सीधे पिच डेक व मीटिंग का अनुरोध करें' : 'Request Pitch Deck & Schedule Founder Briefing'}</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Direct founder access • Bhargava Sood ({FOUNDER_EMAIL})
              </p>
            </div>

            {meetingRequested ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Meeting Request Dispatched!</span>
              </div>
            ) : (
              <form onSubmit={handleRequestPitch} className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Fund Name (e.g. Peak XV)"
                  value={investorFund}
                  onChange={(e) => setInvestorFund(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-default)] text-xs text-slate-200 focus:border-purple-500 focus:outline-none w-full sm:w-44"
                />
                <input
                  type="email"
                  required
                  placeholder="investor@fund.com"
                  value={investorEmail}
                  onChange={(e) => setInvestorEmail(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-card)] border border-[var(--border-default)] text-xs text-slate-200 focus:border-purple-500 focus:outline-none w-full sm:w-48"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md w-full sm:w-auto justify-center"
                >
                  <Send size={13} />
                  <span>Request Deck</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <a
              href="https://github.com/Bhargavasood07/satya-gpt-3.0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <GitHubIcon size={14} />
              <span>Open Source Core</span>
            </a>
            <span>•</span>
            <span className="text-purple-400 font-bold">Live Sovereign SOC v18</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--surface-card)] hover:bg-slate-800 text-slate-300 border border-[var(--border-subtle)] text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

InvestorDataRoomModal.displayName = 'InvestorDataRoomModal';
export default InvestorDataRoomModal;
