import React, { useState } from 'react';
import { Settings, Key, Bell, Volume2, RefreshCw, Shield, Download, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChildMode } from '../../context/ChildModeContext';

export default function SystemSettingsView({ events }) {
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefreshRate, setAutoRefreshRate] = useState('4s');

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events || [], null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `satya_gpt_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#131B2E] border border-[#27395C] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
              SATYA-GPT System Configuration & Security Preferences
            </h2>
            <p className="text-xs text-[var(--text-muted)]">Configure threat engine parameters, VirusTotal API, theme profiles & log exports</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* VirusTotal & AI Settings */}
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-2">
            <Key size={16} className="text-[var(--accent)]" />
            Threat Engine & API Configuration
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] flex justify-between items-center">
              <div>
                <div className="text-[var(--text-primary)] font-bold">VirusTotal v3 API Key</div>
                <div className="text-[10px] text-[var(--text-muted)]">Encapsulated in .env (Hidden Key)</div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] flex justify-between items-center">
              <div>
                <div className="text-[var(--text-primary)] font-bold">KAVACH AI Cyber Engine</div>
                <div className="text-[10px] text-[var(--text-muted)]">Threat Reasoning & Scam Detection</div>
              </div>
              <span className="px-2 py-1 bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/40 rounded text-[10px] font-bold">
                ENABLED
              </span>
            </div>
          </div>
        </div>

        {/* User Preferences & Theme */}
        <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase flex items-center gap-2">
            <Shield size={16} className="text-emerald-400" />
            Preferences & System Controls
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] flex justify-between items-center">
              <div>
                <div className="text-[var(--text-primary)] font-bold">Color Theme Profile</div>
                <div className="text-[10px] text-[var(--text-muted)]">Current: {theme}</div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 bg-[#131B2E] hover:border-[var(--accent)] text-[var(--text-primary)] border border-[#27395C] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {theme === 'cyber-slate' ? <Moon size={14} /> : <Sun size={14} />}
                <span>Toggle Theme</span>
              </button>
            </div>

            <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#1E2D4A] flex justify-between items-center">
              <div>
                <div className="text-[var(--text-primary)] font-bold">Export Audit Logs</div>
                <div className="text-[10px] text-[var(--text-muted)]">Download JSON SOC threat history</div>
              </div>
              <button
                onClick={handleExportLogs}
                className="px-3 py-1.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
