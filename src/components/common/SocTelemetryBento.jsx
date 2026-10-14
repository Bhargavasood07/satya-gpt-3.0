import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Radar, Activity, ShieldCheck, ShieldAlert, Cpu, Lock, AlertTriangle,
  Zap, ArrowUpRight, CheckCircle2, RefreshCw, Radio
} from 'lucide-react';

const RADAR_BLIPS = [
  { id: 1, x: 65, y: 35, label: 'SBI Phish', city: 'Mumbai', severity: 'high' },
  { id: 2, x: 28, y: 70, label: 'e-Challan APK', city: 'Pune', severity: 'critical' },
  { id: 3, x: 75, y: 65, label: 'Electricity SMS', city: 'Delhi', severity: 'medium' },
  { id: 4, x: 42, y: 25, label: 'Telegram Scam', city: 'Bengaluru', severity: 'high' },
  { id: 5, x: 80, y: 80, label: 'Fake Job Link', city: 'Hyderabad', severity: 'medium' },
];

const VECTORS = [
  { name: 'Banking Phishing URLs', status: 'Shielded', stat: '99.4% Block Rate', color: 'var(--emerald-500)' },
  { name: 'Malicious Android APKs', status: 'Quarantine Active', stat: '0 Leaks Detected', color: 'var(--cyan-500)' },
  { name: 'Deceptive SMS / UPI Traps', status: 'Live Intercepting', stat: '89 Neutralized', color: 'var(--primary)' },
  { name: 'QR Hijacking & Poisoning', status: 'Zero-Trust Verification', stat: 'Active Radar', color: 'var(--amber-500)' },
];

const SocTelemetryBento = memo(({ onScanClick, onFreezeClick, onOpenMap }) => {
  const [activeBlipIndex, setActiveBlipIndex] = useState(0);
  const [liveLatency, setLiveLatency] = useState(14);

  // Cycle through detected radar blips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlipIndex((prev) => (prev + 1) % RADAR_BLIPS.length);
      setLiveLatency(Math.floor(12 + Math.random() * 6));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const activeBlip = RADAR_BLIPS[activeBlipIndex];

  return (
    <section className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-[var(--primary)] animate-pulse" />
          <h2 className="text-caption font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Live SOC Threat Telemetry & Resilience Matrix
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--emerald-500)]">
          <span className="w-2 h-2 rounded-full bg-[var(--emerald-500)] animate-ping" />
          <span>REAL-TIME STREAM · {liveLatency}ms</span>
        </div>
      </div>

      {/* Bento 3-column / 2-row layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        {/* Bento 1: Live Cyber Radar (5 cols on md+) */}
        <div
          className="md:col-span-5 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-2xl"
            style={{ background: 'var(--primary)' }}
          />

          <div className="flex items-center justify-between mb-2 z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary-muted)] border border-[var(--primary)]/30 flex items-center justify-center">
                <Radar size={15} className="text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)]">AI Threat Radar</h3>
                <p className="text-[10px] text-[var(--text-muted)]">National Spatial Defense Grid</p>
              </div>
            </div>
            <button
              onClick={onOpenMap}
              className="text-[11px] font-semibold flex items-center gap-1 text-[var(--primary)] hover:underline"
            >
              <span>Full Map</span>
              <ArrowUpRight size={12} />
            </button>
          </div>

          {/* Interactive Radar Visual */}
          <div className="relative h-44 my-2 flex items-center justify-center overflow-hidden rounded-xl bg-[var(--surface-inset)] border border-[var(--border-subtle)]">
            {/* Concentric radar rings */}
            <div className="absolute w-36 h-36 rounded-full border border-blue-500/20" />
            <div className="absolute w-24 h-24 rounded-full border border-blue-500/30" />
            <div className="absolute w-12 h-12 rounded-full border border-blue-500/40" />

            {/* Crosshairs */}
            <div className="absolute w-full h-px bg-blue-500/15" />
            <div className="absolute h-full w-px bg-blue-500/15" />

            {/* Radar Sweeper */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none origin-center"
              style={{
                background: 'conic-gradient(from 0deg, rgba(26,108,249,0.35) 0deg, transparent 65deg, transparent 360deg)',
                animation: 'spin-slow 4s linear infinite',
              }}
            />

            {/* Render Radar Blips */}
            {RADAR_BLIPS.map((blip, idx) => {
              const isActive = idx === activeBlipIndex;
              return (
                <div
                  key={blip.id}
                  className="absolute"
                  style={{ top: `${blip.y}%`, left: `${blip.x}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <span className="relative flex h-3 w-3">
                    {isActive && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        isActive ? 'bg-red-500 ring-2 ring-red-300' : 'bg-red-500/60'
                      }`}
                    />
                  </span>
                </div>
              );
            })}

            {/* Live Detected Target Card overlay */}
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-lg bg-[var(--surface-raised)]/90 backdrop-blur-md border border-[var(--border-default)] flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="font-bold text-[var(--text-primary)] truncate">{activeBlip.label}</span>
                <span className="text-[var(--text-muted)] truncate">({activeBlip.city})</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-red-400 shrink-0">INTERCEPTED</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
            <span>Tracking 5 active hot zones</span>
            <span className="font-mono text-[var(--cyan-500)]">VIRUSTOTAL v3 SYNCED</span>
          </div>
        </div>

        {/* Bento 2: Cyber Resilience & DEFCON Readiness (4 cols on md+) */}
        <div
          className="md:col-span-4 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--emerald-muted)] border border-[var(--emerald-500)]/30 flex items-center justify-center">
                <ShieldCheck size={15} className="text-[var(--emerald-500)]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)]">System Resilience</h3>
                <p className="text-[10px] text-[var(--text-muted)]">DEFCON 4 · Guarded</p>
              </div>
            </div>
            <span className="badge badge--success text-[10px] font-mono">OPTIMAL</span>
          </div>

          {/* Big Score Counter */}
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-mono font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              96.4
            </span>
            <span className="text-sm font-mono text-[var(--emerald-500)] font-bold">/ 100</span>
            <span className="text-xs text-[var(--text-muted)] ml-auto font-medium">Posture Score</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[var(--surface-inset)] overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: '96.4%',
                background: 'linear-gradient(90deg, var(--primary), var(--emerald-500))',
              }}
            />
          </div>

          {/* Telemetry checklist */}
          <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--emerald-500)]" />
                <span>92 VirusTotal Engines</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--emerald-500)] font-semibold">100% Ready</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--emerald-500)]" />
                <span>Zero-Trust DNS Resolver</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--emerald-500)] font-semibold">Protected</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--emerald-500)]" />
                <span>15-Min Bank Freeze</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--primary)] font-semibold">Armed & Ready</span>
            </div>
          </div>
        </div>

        {/* Bento 3: Quick Defensive Actions & Vectors (3 cols on md+) */}
        <div
          className="md:col-span-3 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--amber-muted)] border border-[var(--amber-500)]/30 flex items-center justify-center">
                <Zap size={15} className="text-[var(--amber-500)]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--text-primary)]">Quick Protocols</h3>
                <p className="text-[10px] text-[var(--text-muted)]">Immediate citizen safety</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onScanClick}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-overlay)] border border-[var(--border-subtle)] hover:border-[var(--primary)] text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Activity size={14} className="text-[var(--primary)] shrink-0" />
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">Instant Deep Scan</span>
                </div>
                <ArrowUpRight size={13} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
              </button>

              <button
                onClick={onFreezeClick}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--crimson-muted)] hover:bg-[var(--crimson-muted)]/80 border border-[var(--crimson-500)]/40 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldAlert size={14} className="text-[var(--crimson-500)] shrink-0" />
                  <span className="text-xs font-bold text-[var(--crimson-500)] truncate">Emergency Bank Freeze</span>
                </div>
                <ArrowUpRight size={13} className="text-[var(--crimson-500)]" />
              </button>

              <a
                href="tel:1930"
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-overlay)] border border-[var(--border-subtle)] text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[var(--amber-500)] shrink-0">1930</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">Govt Helpline</span>
                </div>
                <ArrowUpRight size={13} className="text-[var(--text-muted)] group-hover:text-[var(--amber-500)] transition-colors" />
              </a>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center justify-between">
            <span>CERT-In Guidelines</span>
            <span className="text-[var(--emerald-500)] font-semibold">100% Compliant</span>
          </div>
        </div>
      </div>

      {/* Vector Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {VECTORS.map((v, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--border-strong)] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Vector 0{i + 1}
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.color }} />
            </div>
            <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
              {v.name}
            </div>
            <div className="text-[11px] font-mono mt-1" style={{ color: v.color }}>
              {v.stat}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

SocTelemetryBento.displayName = 'SocTelemetryBento';
export default SocTelemetryBento;
