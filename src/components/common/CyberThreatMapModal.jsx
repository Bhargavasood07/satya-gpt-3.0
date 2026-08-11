import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldAlert, AlertTriangle, Activity, TrendingUp, Search, X, CheckCircle2, PhoneCall, Building2 } from 'lucide-react';

const INDIAN_STATE_THREATS = [
  {
    id: 'delhi-ncr',
    state: 'Delhi NCR & Gurgaon',
    riskScore: 94,
    level: 'CRITICAL',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    topScam: 'Digital Arrest Vishing & Fake CBI/ED Law Enforcement Threats',
    description: 'Scammers posing as Telecom Department / CBI officials claiming illegal SIM or courier drugs.',
    activeCases: 1420,
    trend: '+18% this week'
  },
  {
    id: 'mumbai-mh',
    state: 'Mumbai & Maharashtra',
    riskScore: 88,
    level: 'HIGH',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    topScam: 'e-Challan APK Malware & Electricity Power Cut SMS',
    description: 'Malicious Android APK links sent via SMS pretending to be pending RTO traffic fines.',
    activeCases: 980,
    trend: '+12% this week'
  },
  {
    id: 'bengaluru-ka',
    state: 'Bengaluru & Karnataka',
    riskScore: 91,
    level: 'CRITICAL',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    topScam: 'Telegram YouTube Task Scam & Fake Crypto Trading Apps',
    description: 'Victims lured with Rs 500 per YouTube like, then tricked into investing lakhs in fake crypto portals.',
    activeCases: 1150,
    trend: '+22% this week'
  },
  {
    id: 'hyderabad-ts',
    state: 'Cyberabad & Telangana',
    riskScore: 85,
    level: 'HIGH',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    topScam: 'Fake Stock Market Investment & Institutional Trading Group Scams',
    description: 'WhatsApp groups offering insider stock tips using fake SEBI-registered broker apps.',
    activeCases: 890,
    trend: '+8% this week'
  },
  {
    id: 'jamtara-mewat',
    state: 'Jamtara & Mewat Scam Belt',
    riskScore: 98,
    level: 'EXTREME THREAT',
    badgeColor: 'bg-red-600 text-white border-red-500 font-extrabold animate-pulse',
    topScam: 'UPI QR Collect Pin Fraud & Bank KYC Vishing Calls',
    description: 'High-volume OTP harvesting and fake buyer UPI Collect request scams on OLX/FB Marketplace.',
    activeCases: 2310,
    trend: '+31% this week'
  },
  {
    id: 'kolkata-wb',
    state: 'Kolkata & West Bengal',
    riskScore: 82,
    level: 'HIGH',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    topScam: 'Customs Duty Tax & FedEx Parcel Hold SMS',
    description: 'Fake SMS claiming overseas package held by Customs requiring immediate small online payment.',
    activeCases: 640,
    trend: '+5% this week'
  },
  {
    id: 'punjab-pb',
    state: 'Punjab & Haryana',
    riskScore: 76,
    level: 'MODERATE',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    topScam: 'Overseas Work Visa & Army Canteen Vehicle Fraud',
    description: 'Scammers posing as Defense Personnel selling army canteen cars or fake Canada visa offers.',
    activeCases: 420,
    trend: '-3% this week'
  }
];

const CyberThreatMapModal = memo(({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState(INDIAN_STATE_THREATS[0]);

  const filteredStates = INDIAN_STATE_THREATS.filter(
    (item) =>
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topScam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-3xl bg-[#0D1527] border-2 border-[var(--accent)] rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(0,229,255,0.3)] relative max-h-[90vh] overflow-y-auto space-y-4 text-xs"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#060913]"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#1E2D4A] pb-3">
          <div className="w-11 h-11 rounded-xl bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-lg">
            <MapPin size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-100 tracking-wider">
                Live State-wise Indian Cyber Threat Heatmap
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE RADAR
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Real-Time Threat Vector Index Across Indian States & Metro Cities</p>
          </div>
        </div>

        {/* Search & Filter Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state, city, or scam type (e.g. Digital Arrest, e-Challan, Delhi, Mumbai)..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#060913] border border-[#27395C] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Main Grid: State Cards & Live Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: State Threat Index List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredStates.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedState(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedState.id === item.id
                    ? 'bg-[#15213A] border-[var(--accent)] shadow-md'
                    : 'bg-[#060913] border-[#27395C] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[var(--accent)]" />
                    <span>{item.state}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${item.badgeColor}`}>
                    {item.level} ({item.riskScore}%)
                  </span>
                </div>
                <div className="text-[11px] text-cyan-300 font-bold truncate">
                  🚨 {item.topScam}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Active State Threat Intelligence Breakdown */}
          <div className="p-4 bg-[#060913] border-2 border-[#27395C] rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2">
                <span className="font-extrabold text-sm text-slate-100">{selectedState.state}</span>
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <TrendingUp size={13} />
                  <span>{selectedState.trend}</span>
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Primary Active Cyber Threat Vector</div>
                <div className="text-xs font-bold text-rose-400 leading-snug">
                  {selectedState.topScam}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Modus Operandi & Pattern</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedState.description}
                </p>
              </div>

              <div className="p-2.5 bg-[#0D1527] border border-[#27395C] rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Reported Fraud Cases (7 Days):</span>
                <span className="text-cyan-300 font-extrabold">{selectedState.activeCases} Incidents</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E2D4A] space-y-2">
              <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Nodal Action Advisory:</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Never transfer funds under video-call threats or click unknown traffic fine APK links.
              </p>
              <a
                href="tel:1930"
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <PhoneCall size={14} />
                <span>Report Incident to 1930 Helpline</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

CyberThreatMapModal.displayName = 'CyberThreatMapModal';
export default CyberThreatMapModal;
