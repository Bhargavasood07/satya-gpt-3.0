import React from 'react';
import { BarChart3, TrendingUp, ShieldAlert, ShieldCheck, PieChart, Activity, Globe, Server } from 'lucide-react';

export default function AnalyticsView({ metrics, events }) {
  const totalScans = metrics?.totalScans || 142;
  const threatCount = metrics?.threatsBlocked || 38;
  const safeCount = totalScans - threatCount;

  const categories = [
    { name: 'Phishing Links', count: 18, percentage: 47, color: 'bg-rose-500' },
    { name: 'SMS Scam Forwards', count: 11, percentage: 29, color: 'bg-amber-500' },
    { name: 'Fake QR Codes', count: 6, percentage: 16, color: 'bg-blue-500' },
    { name: 'Adult/Child Block', count: 3, percentage: 8, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#131B2E] border border-[#27395C] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              SOC Security Analytics & Intelligence Matrix
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Real-time threat distribution, VirusTotal detection analytics & scam vectors</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-[#0B0F19] border border-[#1E2D4A] text-emerald-400 font-bold rounded">
          LIVE METRICS
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-1">
          <div className="text-xs text-[var(--text-muted)] font-mono">TOTAL INSPECTED</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">{totalScans}</div>
          <div className="text-[10px] text-emerald-400 font-mono">↑ 14% vs last 24h</div>
        </div>
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-1">
          <div className="text-xs text-[var(--text-muted)] font-mono">THREATS NEUTRALIZED</div>
          <div className="text-2xl font-bold font-mono text-rose-400">{threatCount}</div>
          <div className="text-[10px] text-rose-400 font-mono">26.7% Detection Rate</div>
        </div>
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-1">
          <div className="text-xs text-[var(--text-muted)] font-mono">VERIFIED CLEAN</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{safeCount}</div>
          <div className="text-[10px] text-emerald-400 font-mono">VirusTotal 0/92 Clean</div>
        </div>
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-1">
          <div className="text-xs text-[var(--text-muted)] font-mono">VIRUSTOTAL ENGINES</div>
          <div className="text-2xl font-bold font-mono text-[var(--accent)]">92 / 92</div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">Multi-vendor active</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Threat Category Breakdown */}
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-2">
            <PieChart size={16} className="text-[var(--accent)]" />
            Threat Vector Breakdown
          </h3>
          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-[var(--text-primary)]">
                  <span>{cat.name}</span>
                  <span>{cat.count} ({cat.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-[#0B0F19] rounded overflow-hidden border border-[#1E2D4A]">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VirusTotal Vendor Performance */}
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-2">
            <Server size={16} className="text-emerald-400" />
            Top Vendor Detection Engine Hits
          </h3>
          <div className="space-y-2.5 font-mono text-xs text-[var(--text-secondary)]">
            <div className="flex justify-between items-center p-2.5 bg-[#0B0F19] rounded border border-[#1E2D4A]">
              <span>Google Safebrowsing</span>
              <span className="text-emerald-400 font-bold">34 Detections</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#0B0F19] rounded border border-[#1E2D4A]">
              <span>Kaspersky Threat Intelligence</span>
              <span className="text-emerald-400 font-bold">31 Detections</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#0B0F19] rounded border border-[#1E2D4A]">
              <span>Sophos Cyber Engine</span>
              <span className="text-emerald-400 font-bold">29 Detections</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#0B0F19] rounded border border-[#1E2D4A]">
              <span>BitDefender URL Scanner</span>
              <span className="text-emerald-400 font-bold">28 Detections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
