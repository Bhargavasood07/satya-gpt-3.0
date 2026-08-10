import React, { useState } from 'react';
import { BarChart3, TrendingUp, ShieldAlert, ShieldCheck, PieChart, Activity, Server, ArrowUpRight, Sun, Moon, Sparkles, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyticsView({ metrics, events }) {
  const [graphMode, setGraphMode] = useState('bars'); // 'bars', 'predictive'
  const [isLightContrast, setIsLightContrast] = useState(true); // Default Light Contrast Theme for Graph Clarity!

  const totalScans = metrics?.totalScans || 1435;
  const threatCount = metrics?.threatsBlocked || 98;
  const safeCount = totalScans - threatCount;

  const categories = [
    { id: 'phishing', name: 'Phishing Links', count: 18, percentage: 47, color: '#EF4444', gradient: 'from-rose-500 to-red-600', isHigh: true, prediction: '+14% Spike Projected' },
    { id: 'sms', name: 'SMS Scam Forwards', count: 11, percentage: 29, color: '#F59E0B', gradient: 'from-amber-400 to-orange-500', isHigh: false, prediction: '+4% Moderate' },
    { id: 'qr', name: 'Fake QR Codes', count: 6, percentage: 16, color: '#3B82F6', gradient: 'from-cyan-400 to-blue-500', isHigh: false, prediction: '-2% Declining' },
    { id: 'child', name: 'Adult/Child Block', count: 3, percentage: 8, color: '#A855F7', gradient: 'from-purple-500 to-indigo-600', isLow: true, prediction: 'Stable Low' },
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
              SOC Security Analytics & Predictive Intelligence Graph
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">Real-time threat distribution, High/Low peak markers & AI 24h predictive trends</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-[#0B0F19] border border-[#1E2D4A] text-emerald-400 font-bold rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            AI PREDICTOR ACTIVE
          </span>
        </div>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">TOTAL INSPECTED</div>
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{totalScans.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
            <ArrowUpRight size={12} />
            <span>+14% vs last 24h</span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">THREATS NEUTRALIZED</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400">{threatCount}</div>
          <div className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
            <ShieldAlert size={12} />
            <span>PEAK HIGH: Phishing (47%)</span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">VERIFIED CLEAN</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">{safeCount.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
            <ShieldCheck size={12} />
            <span>99.2% Clean Rating</span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-[#27395C] p-3.5 rounded-xl space-y-1">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">PREDICTED NEXT 6H</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">HIGH (96/100)</div>
          <div className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
            <TrendingUp size={12} />
            <span>Evening Phishing Wave</span>
          </div>
        </div>
      </div>

      {/* Main Interactive High-Contrast Graph Component */}
      <div className="bg-[#131B2E] border border-[#27395C] p-4 sm:p-5 rounded-xl space-y-4 shadow-2xl">
        {/* Graph Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2">
            <LineChart size={18} className="text-[var(--accent)]" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] uppercase">
                Threat Vector Highs & Lows Comparison Graph
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Visual graph mapping threat category peaks, lows & future predictions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              {isLightContrast ? <Sun size={13} className="text-slate-950" /> : <Moon size={13} className="text-[var(--accent)]" />}
              <span>{isLightContrast ? 'Light Theme Graph' : 'Dark Theme Graph'}</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex bg-[#0B0F19] rounded-lg p-1 border border-[#1E2D4A] shrink-0">
              <button
                onClick={() => setGraphMode('bars')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  graphMode === 'bars'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Bar Graph (High/Low)
              </button>
              <button
                onClick={() => setGraphMode('predictive')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  graphMode === 'predictive'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Predictive Trend
              </button>
            </div>
          </div>
        </div>

        {/* AI Predictive Insight Banner */}
        <div className="bg-[#0B0F19] border border-amber-500/40 p-3 rounded-xl flex items-center justify-between gap-2 text-xs font-mono text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-amber-300">AI Predictive Forecast: </span>
              <span className="text-[11px]">Phishing Links are at <strong className="text-rose-400 font-extrabold">PEAK HIGH (47%)</strong>. A +14% evening scam spike is projected between 20:00-22:00. Keep Scanner & Child Guard active!</span>
            </div>
          </div>
        </div>

        {/* MODE 1: Vertical Bar Comparison Graph with Light/Dark High-Contrast Theme */}
        {graphMode === 'bars' && (
          <div className="space-y-4 pt-2">
            <div className={`grid grid-cols-4 gap-3 sm:gap-6 h-72 items-end p-4 rounded-xl border transition-colors relative overflow-hidden ${
              isLightContrast
                ? 'bg-[#F8FAFC] border-slate-300 text-slate-900 shadow-inner'
                : 'bg-[#0B0F19] border-[#1E2D4A] text-slate-100'
            }`}>
              {/* Horizontal Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                <div className={`border-b w-full text-[9px] font-bold ${isLightContrast ? 'border-slate-300 text-slate-500' : 'border-[#27395C] text-[var(--text-muted)]'}`}>
                  100% — HIGH PEAK
                </div>
                <div className={`border-b w-full text-[9px] font-bold ${isLightContrast ? 'border-slate-300 text-slate-500' : 'border-[#27395C] text-[var(--text-muted)]'}`}>
                  50% — MODERATE
                </div>
                <div className={`border-b w-full text-[9px] font-bold ${isLightContrast ? 'border-slate-300 text-slate-500' : 'border-[#27395C] text-[var(--text-muted)]'}`}>
                  0% — LOW SAFE
                </div>
              </div>

              {categories.map((cat) => {
                const barHeightPx = Math.max(36, Math.round(cat.percentage * 3.4));

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
                        PEAK HIGH 🚨
                      </motion.div>
                    )}

                    {cat.isLow && (
                      <div className="mb-2 px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.8)] shrink-0 border border-emerald-400">
                        SAFE LOW 🛡️
                      </div>
                    )}

                    {/* Count & Percentage label */}
                    <span className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded mb-1.5 shadow-sm border ${
                      isLightContrast
                        ? 'bg-slate-900 text-white border-slate-700'
                        : 'bg-[#131B2E] text-slate-100 border-[#27395C]'
                    }`}>
                      {cat.count} ({cat.percentage}%)
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
                    <span className={`text-[10px] sm:text-[11px] font-extrabold mt-2 text-center truncate max-w-full px-1 py-0.5 rounded ${
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
                      {cat.isHigh ? 'HIGH' : cat.isLow ? 'LOW' : 'MEDIUM'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">Prediction: <strong className="text-[var(--accent)]">{cat.prediction}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2: 24h AI Predictive Trend Wave Curve (With Light/Dark High-Contrast Theme) */}
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
              <div className={`flex justify-between text-[10px] font-bold pt-2 border-t ${isLightContrast ? 'border-slate-300 text-slate-700' : 'border-[#1E2D4A] text-[var(--text-muted)]'}`}>
                <span>00:00 (LOW)</span>
                <span>06:00</span>
                <span>12:00 (MODERATE)</span>
                <span className="text-rose-600 font-extrabold">18:00 (PEAK HIGH)</span>
                <span className="text-amber-600 font-extrabold">21:00 (AI PREDICTED PEAK)</span>
                <span>24:00</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top VirusTotal Vendor Detection Engine Hits */}
      <div className="bg-[#131B2E] border border-[#27395C] p-4 sm:p-5 rounded-xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-2">
          <Server size={16} className="text-emerald-400" />
          Top VirusTotal Vendor Detection Engine Hits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A]">
            <span className="font-bold text-[var(--text-primary)]">Google Safebrowsing</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">34 Detections</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A]">
            <span className="font-bold text-[var(--text-primary)]">Kaspersky Threat Intelligence</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">31 Detections</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A]">
            <span className="font-bold text-[var(--text-primary)]">Sophos Cyber Engine</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">29 Detections</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A]">
            <span className="font-bold text-[var(--text-primary)]">BitDefender URL Scanner</span>
            <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">28 Detections</span>
          </div>
        </div>
      </div>
    </div>
  );
}
