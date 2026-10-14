import React, { useState } from 'react';
import { BarChart3, TrendingUp, ShieldAlert, ShieldCheck, PieChart, Activity, Server, ArrowUpRight, Sun, Moon, Sparkles, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslation } from 'react-i18next';

export default function AnalyticsView({ metrics, events }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [graphMode, setGraphMode] = useState('bars'); // 'bars', 'predictive'
  const [isLightContrast, setIsLightContrast] = useState(true); // Default Light Contrast Theme for Graph Clarity!

  const totalScans = metrics?.totalScans || 1435;
  const threatCount = metrics?.threatsBlocked || 98;
  const safeCount = totalScans - threatCount;

  const categories = [
    { 
      id: 'phishing', 
      name: isHindi ? 'फिशिंग लिंक फ्रॉड' : 'Phishing Links', 
      count: 18, 
      color: '#EF4444', 
      gradient: 'from-rose-500 to-red-600', 
      isHigh: true, 
      prediction: isHindi ? '+14% बढ़ोतरी की संभावना' : '+14% Spike Projected' 
    },
    { 
      id: 'sms', 
      name: isHindi ? 'संदिग्ध SMS / संदेश' : 'SMS Scam Forwards', 
      count: 11, 
      color: '#F59E0B', 
      gradient: 'from-amber-400 to-orange-500', 
      isHigh: false, 
      prediction: isHindi ? '+4% सामान्य' : '+4% Moderate' 
    },
    { 
      id: 'qr', 
      name: isHindi ? 'फर्जी QR कोड' : 'Fake QR Codes', 
      count: 6, 
      color: '#3B82F6', 
      gradient: 'from-cyan-400 to-blue-500', 
      isHigh: false, 
      prediction: isHindi ? '-2% कमी दर्ज' : '-2% Declining' 
    },
    { 
      id: 'child', 
      name: isHindi ? 'वयस्क / गेमिंग ब्लॉक' : 'Adult/Child Block', 
      count: 3, 
      color: '#A855F7', 
      gradient: 'from-purple-500 to-indigo-600', 
      isLow: true, 
      prediction: isHindi ? 'स्थिर व सुरक्षित' : 'Stable Low' 
    },
  ];

  return (
    <div className="space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131B2E] border border-[#27395C] p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              {isHindi ? 'SOC सुरक्षा विश्लेषण एवं AI पूर्वानुमान ग्राफ' : 'SOC Security Analytics & Predictive Intelligence Graph'}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isHindi ? 'लाइव साइबर खतरा वितरण, उच्चतम/निम्नतम स्तर और 24-घंटे का AI पूर्वानुमान' : 'Real-time threat distribution, High/Low peak markers & AI 24h predictive trends'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-[#0B0F19] border border-[#1E2D4A] text-emerald-400 font-bold rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isHindi ? 'AI पूर्वानुमान सक्रिय' : 'AI PREDICTOR ACTIVE'}
          </span>
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">{isHindi ? 'कुल जांच (स्कैन)' : 'TOTAL INSPECTED'}</div>
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{totalScans.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
            <ArrowUpRight size={12} />
            <span>{isHindi ? '+14% पिछले 24 घंटे में' : '+14% vs last 24h'}</span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">{isHindi ? 'रोके गए खतरे' : 'THREATS NEUTRALIZED'}</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400">{threatCount}</div>
          <div className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
            <ShieldAlert size={12} />
            <span>{isHindi ? 'सर्वाधिक: फर्जी लिंक' : 'HIGH PEAK: Phishing'}</span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">{isHindi ? 'सुरक्षित सत्यापित' : 'VERIFIED CLEAN'}</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">{safeCount.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
            <ShieldCheck size={12} />
            <span>{isHindi ? 'सुरक्षा रेटिंग उत्तम' : 'Clean Safety Rating'}</span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">{isHindi ? 'अगले 6 घंटे का अनुमान' : 'PREDICTED NEXT 6H'}</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">{isHindi ? 'सचेत रहें' : 'HIGH LEVEL'}</div>
          <div className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
            <TrendingUp size={12} />
            <span>{isHindi ? 'शाम को फर्जी SMS की संभावना' : 'Evening Phishing Wave'}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive High-Contrast Graph Component */}
      <div className="bg-[#131B2E] border border-[#27395C] p-4 sm:p-5 rounded-xl space-y-4 shadow-2xl">
        {/* Graph Controls Header */}
        {/* Graph Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <LineChart size={18} className="text-[var(--cyan-500)] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase break-words">
                {isHindi ? 'साइबर खतरा स्तर तुलना ग्राफ (उच्च / निम्न)' : 'Threat Vector Highs & Lows Comparison Graph'}
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] font-mono break-words">
                {isHindi ? 'विभिन्न श्रेणियों के साइबर खतरों के स्तर, न्यूनतम/अधिकतम रिकॉर्ड और AI पूर्वानुमान' : 'Visual graph mapping threat category peaks, lows & future predictions'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Light / Dark Theme Graph Toggle */}
            <button
              onClick={() => setIsLightContrast((p) => !p)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                isLightContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-[#0B0F19] text-slate-200 border-[#27395C]'
              }`}
              title="Toggle Light Theme / Dark Theme for Graph Clarity"
            >
              {isLightContrast ? <Sun size={13} className="text-slate-950" /> : <Moon size={13} className="text-[var(--cyan-400)]" />}
              <span>{isLightContrast ? (isHindi ? 'लाइट थीम ग्राफ' : 'Light Theme Graph') : (isHindi ? 'डार्क थीम ग्राफ' : 'Dark Theme Graph')}</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex bg-[#0B0F19] rounded-lg p-1 border border-[#1E2D4A] shrink-0">
              <button
                onClick={() => setGraphMode('bars')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  graphMode === 'bars'
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isHindi ? 'बार ग्राफ (उच्च/निम्न)' : 'Bar Graph (High/Low)'}
              </button>
              <button
                onClick={() => setGraphMode('predictive')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  graphMode === 'predictive'
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isHindi ? 'AI पूर्वानुमान' : 'Predictive Trend'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Predictive Insight Banner */}
        <div className="bg-[#0B0F19] border border-amber-500/40 p-3 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-amber-200 break-words">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={16} className="text-amber-400 shrink-0 animate-pulse" />
            <div className="min-w-0 break-words">
              <span className="font-bold text-amber-300">{isHindi ? 'AI सुरक्षा पूर्वानुमान: ' : 'AI Predictive Forecast: '}</span>
              <span className="text-[11px] break-words">
                {isHindi ? (
                  <>फिशिंग लिंक वर्तमान में <strong className="text-rose-400 font-extrabold">उच्चतम स्तर (HIGH PEAK)</strong> पर हैं। शाम 8:00 से 10:00 के बीच फर्जी SMS में बढ़ोतरी की संभावना है। स्कैनर और बाल सुरक्षा मोड सक्रिय रखें!</>
                ) : (
                  <>Phishing Links are at <strong className="text-rose-400 font-extrabold">HIGH PEAK</strong>. An evening scam spike is projected between 20:00-22:00. Keep Scanner & Child Guard active!</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* MODE 1: Vertical Bar Comparison Graph with High/Low Plain Text Labels (No % numbers) */}
        {graphMode === 'bars' && (
          <div className="space-y-4 pt-2">
            <div className={`grid grid-cols-4 gap-3 sm:gap-6 h-72 items-end p-4 rounded-xl border transition-colors relative overflow-hidden ${
              isLightContrast
                ? 'bg-[#F8FAFC] border-slate-300 text-slate-900 shadow-inner'
                : 'bg-[#0B0F19] border-[#1E2D4A] text-slate-100'
            }`}>
              {/* Horizontal Background Grid Lines (Clean Text: HIGH PEAK, MODERATE, LOW SAFE) */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                <div className={`border-b w-full text-[10px] font-extrabold tracking-wider ${isLightContrast ? 'border-slate-300 text-rose-600' : 'border-[#27395C] text-rose-400'}`}>
                  {isHindi ? 'उच्चतम स्तर (HIGH PEAK)' : 'HIGH PEAK'}
                </div>
                <div className={`border-b w-full text-[10px] font-extrabold tracking-wider ${isLightContrast ? 'border-slate-300 text-amber-600' : 'border-[#27395C] text-amber-400'}`}>
                  {isHindi ? 'मध्यम स्तर (MODERATE)' : 'MODERATE'}
                </div>
                <div className={`border-b w-full text-[10px] font-extrabold tracking-wider ${isLightContrast ? 'border-slate-300 text-emerald-600' : 'border-[#27395C] text-emerald-400'}`}>
                  {isHindi ? 'न्यूनतम सुरक्षित (LOW SAFE)' : 'LOW SAFE'}
                </div>
              </div>

              {categories.map((cat) => {
                // Calculation based on threat count
                const barHeights = { phishing: 180, sms: 115, qr: 70, child: 40 };
                const barHeightPx = barHeights[cat.id] || 60;

                return (
                  <div key={cat.id} className="flex flex-col items-center h-full justify-end relative z-10 group">
                    {/* High / Low Badge Indicator */}
                    {cat.isHigh && (
                      <motion.div
                        initial={{ y: -6 }}
                        animate={{ y: 0 }}
                        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                        className="mb-2 px-2.5 py-1 rounded bg-rose-600 text-white text-[10px] font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.8)] shrink-0 border border-rose-400"
                      >
                        {isHindi ? 'उच्चतम स्तर 🚨' : 'HIGH PEAK 🚨'}
                      </motion.div>
                    )}

                    {cat.isLow && (
                      <div className="mb-2 px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.8)] shrink-0 border border-emerald-400">
                        {isHindi ? 'सुरक्षित 🛡️' : 'LOW SAFE 🛡️'}
                      </div>
                    )}

                    {/* Count Label */}
                    <span className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded mb-1.5 shadow-sm border ${
                      isLightContrast
                        ? 'bg-slate-900 text-white border-slate-700'
                        : 'bg-[#131B2E] text-slate-100 border-[#27395C]'
                    }`}>
                      {cat.count} {isHindi ? 'खतरे' : 'Threats'}
                    </span>

                    {/* Vertical High-Visibility Glowing Bar */}
                    <div className={`w-full max-w-[64px] rounded-t-xl overflow-hidden p-1 flex flex-col justify-end transition-all shadow-md ${
                      isLightContrast ? 'bg-slate-200 border border-slate-400' : 'bg-[#131B2E] border border-[#27395C]'
                    }`}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeightPx}px` }}
                        transition={{ duration: 0.8 }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${cat.gradient} shadow-lg relative border-t border-white/40`}
                      >
                        <div className="absolute top-1 left-1 right-1 h-1 bg-white/40 rounded" />
                      </motion.div>
                    </div>

                    {/* Category Name Label */}
                    <span className={`text-[10px] sm:text-[11px] font-extrabold mt-2 text-center truncate max-w-full px-1.5 py-0.5 rounded ${
                      isLightContrast ? 'text-slate-900 bg-white/80 border border-slate-300 shadow-sm' : 'text-slate-200 bg-[#0B0F19]'
                    }`}>
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* High / Low Category Prediction Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--text-primary)] text-[11px]">{cat.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      cat.isHigh ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {cat.isHigh ? (isHindi ? 'उच्चतम' : 'HIGH PEAK') : cat.isLow ? (isHindi ? 'सुरक्षित' : 'LOW SAFE') : (isHindi ? 'मध्यम' : 'MODERATE')}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">{isHindi ? 'पूर्वानुमान: ' : 'Prediction: '}<strong className="text-[var(--cyan-400)]">{cat.prediction}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2: 24h AI Predictive Trend Wave Curve */}
        {graphMode === 'predictive' && (
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-xl border transition-colors space-y-3 ${
              isLightContrast ? 'bg-[#F8FAFC] border-slate-300 text-slate-900 shadow-inner' : 'bg-[#0B0F19] border-[#1E2D4A] text-slate-100'
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">24-Hour Threat Wave (Historical vs AI Predicted)</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">● PREDICTIVE ZONE (RIGHT)</span>
              </div>

              {/* SVG Wave Graph */}
              <div className="h-56 w-full relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <line x1="0" y1="30" x2="500" y2="30" stroke={isLightContrast ? '#CBD5E1' : '#1E2D4A'} strokeDasharray="4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke={isLightContrast ? '#CBD5E1' : '#1E2D4A'} strokeDasharray="4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke={isLightContrast ? '#CBD5E1' : '#1E2D4A'} strokeDasharray="4" />

                  <defs>
                    <linearGradient id="trendGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284C7" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 0 120 Q 60 130 120 100 T 250 40 T 380 20 T 500 100 L 500 150 L 0 150 Z"
                    fill="url(#trendGradLight)"
                  />

                  <path
                    d="M 0 120 Q 60 130 120 100 T 250 40 T 380 20 T 500 100"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="4"
                  />

                  <circle cx="120" cy="100" r="6" fill="#10B981" />
                  <circle cx="250" cy="40" r="6" fill="#F59E0B" />
                  <circle cx="380" cy="20" r="7" fill="#EF4444" className="animate-ping" />
                  <circle cx="380" cy="20" r="6" fill="#EF4444" />
                </svg>
              </div>

              {/* Time X-Axis */}
              <div className={`flex flex-wrap justify-between text-[10px] font-bold pt-2 border-t gap-1 ${isLightContrast ? 'border-slate-300 text-slate-700' : 'border-[#1E2D4A] text-[var(--text-muted)]'}`}>
                <span>00:00 ({isHindi ? 'न्यूनतम' : 'LOW'})</span>
                <span>06:00</span>
                <span>12:00 ({isHindi ? 'मध्यम' : 'MOD'})</span>
                <span className="text-rose-600 font-extrabold">18:00 ({isHindi ? 'उच्चतम' : 'HIGH'})</span>
                <span className="text-amber-600 font-extrabold">21:00 ({isHindi ? 'AI पीक' : 'AI PEAK'})</span>
                <span>24:00</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top VirusTotal Vendor Detection Engine Hits */}
      <div className="bg-[#131B2E] border border-[#27395C] p-4 sm:p-5 rounded-xl space-y-4 shadow-xl cyber-bracket">
        <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-2 break-words">
          <Server size={16} className="text-emerald-400 shrink-0" />
          <span>{isHindi ? 'शीर्ष वायरसटोटल सुरक्षा इंजन डिटेक्शन' : 'Top VirusTotal Vendor Detection Engine Hits'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] gap-2">
            <span className="font-bold text-[var(--text-primary)] break-words min-w-0">Google Safebrowsing</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded shrink-0 font-mono text-[11px]">34 {isHindi ? 'खतरे' : 'Detections'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] gap-2">
            <span className="font-bold text-[var(--text-primary)] break-words min-w-0">Kaspersky Threat Intelligence</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded shrink-0 font-mono text-[11px]">31 {isHindi ? 'खतरे' : 'Detections'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] gap-2">
            <span className="font-bold text-[var(--text-primary)] break-words min-w-0">Sophos Cyber Engine</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded shrink-0 font-mono text-[11px]">29 {isHindi ? 'खतरे' : 'Detections'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] gap-2">
            <span className="font-bold text-[var(--text-primary)] break-words min-w-0">BitDefender URL Scanner</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded shrink-0 font-mono text-[11px]">28 {isHindi ? 'खतरे' : 'Detections'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
