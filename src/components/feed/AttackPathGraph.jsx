import React, { useState } from 'react';
import { Shield, AlertTriangle, Server, Database, Globe, Lock, ArrowRight, Activity, Terminal } from 'lucide-react';

export default function AttackPathGraph({ selectedEvent }) {
  const isThreat = selectedEvent?.verdict === 'fake' || selectedEvent?.verdict === 'malicious';

  const nodes = [
    { id: 'EXT_GATEWAY', label: 'EDGE GATEWAY', type: 'gateway', status: isThreat ? 'breached' : 'secure', ip: '192.168.1.1' },
    { id: 'DMZ_PROXY', label: 'DMZ INGRESS', type: 'proxy', status: isThreat ? 'warning' : 'secure', ip: '10.0.4.12' },
    { id: 'AUTH_SRV', label: 'AUTH SERVICE', type: 'auth', status: isThreat ? 'critical' : 'secure', ip: '10.0.12.88' },
    { id: 'DATA_NODE', label: 'DB CORE CLUSTER', type: 'database', status: isThreat ? 'isolated' : 'secure', ip: '10.0.24.4' },
  ];

  return (
    <div className="cyber-card bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl p-4 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[var(--accent)]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Lateral Attack Path & Topology Graph
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-card)] text-[var(--text-muted)]">
          2D VECTOR MAP
        </span>
      </div>

      {/* 2D Vector Node Network Flow */}
      <div className="bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-lg p-4 space-y-3">
        <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between mb-2">
          <span>LATERAL HOP CHAIN</span>
          <span>VECTOR ANALYSIS: {isThreat ? 'HIGH RISK BREACH' : 'CLEAN TRAFFIC'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 relative">
          {nodes.map((node, idx) => {
            const isBreached = node.status === 'breached' || node.status === 'critical';
            const isWarning = node.status === 'warning';

            return (
              <div
                key={node.id}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  isBreached
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                    : isWarning
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                    : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-mono font-bold text-[var(--text-muted)]">NODE 0{idx + 1}</div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBreached ? 'bg-rose-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>

                <div className="font-mono font-bold text-xs mb-1">{node.label}</div>
                <div className="text-[10px] font-mono text-[var(--text-muted)]">{node.ip}</div>

                <div className="mt-3 pt-2 border-t border-[var(--border-color)]/50 flex items-center justify-between text-[10px] font-mono">
                  <span>STATUS:</span>
                  <span className="font-bold uppercase">{node.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vector Stream Log */}
      <div className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-card)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
        <div className="text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
          <Terminal size={13} className="text-[var(--accent)]" />
          <span>REAL-TIME PACKET TRAJECTORY</span>
        </div>
        <p className="text-emerald-400">✓ Ingress Filter [192.168.1.1] -&gt; TLS 1.3 Handshake OK</p>
        {isThreat ? (
          <p className="text-rose-400">🚨 Alert: Lateral traversal attempt on AUTH_SRV [10.0.12.88] - Malicious Signature</p>
        ) : (
          <p className="text-slate-400">• Packet payload verified clean against threat signature database</p>
        )}
      </div>
    </div>
  );
}
