import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Baby, TrendingUp } from 'lucide-react';

const CountUp = memo(({ end, duration = 1000, format = (v) => v }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    let raf;
    const animate = (now) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.floor(ease * end));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <>{format(count)}</>;
});

const CARDS = [
  { key: 'totalScans',      icon: Shield,      label: 'Total Scans',        color: 'var(--primary)',  fmt: (v) => v.toLocaleString() },
  { key: 'threatsBlocked',  icon: ShieldAlert, label: 'Threats Blocked',    color: 'var(--danger)',   fmt: (v) => v.toLocaleString() },
  { key: 'childBlocks',     icon: Baby,        label: 'Child Guard Blocks', color: '#a855f7',         fmt: (v) => v.toLocaleString() },
  { key: 'systemIntegrity', icon: ShieldCheck, label: 'System Integrity',   color: 'var(--success)',  fmt: (v) => `${v}%` },
];

const MetricsBar = ({ metrics = {}, onCardClick, isFounderSession }) => {
  const { totalScans = 1442, threatsBlocked = 99, systemIntegrity = 99, childBlocks = 47 } = metrics;
  const values = { totalScans, threatsBlocked, childBlocks, systemIntegrity: Math.floor(systemIntegrity) };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {CARDS.map(({ key, icon: Icon, label, color, fmt }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.25 }}
          onClick={() => isFounderSession && onCardClick?.(key)}
          className="card p-4 sm:p-5"
          style={{ cursor: isFounderSession ? 'pointer' : 'default' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}35` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
          </div>
          <div
            className="text-h3 font-bold font-mono"
            style={{ color: 'var(--text-primary)' }}
          >
            <CountUp end={values[key]} format={fmt} />
          </div>
          <div
            className="text-caption uppercase tracking-wide mt-1"
            style={{ color: 'var(--text-muted)', fontWeight: 600 }}
          >
            {label}
          </div>
          <div
            className="mt-3 h-px"
            style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default memo(MetricsBar);
