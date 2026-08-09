import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, ShieldAlert, ShieldCheck, Baby } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';
import { secureStorage } from '../../utils/securityGuard';

const CountUp = ({ end, duration = 1500, format = (v) => v }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{format(count)}</>;
};

const MetricsBar = ({ metrics, onCardClick, isFounderSession = false }) => {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const { totalScans = 1442, threatsBlocked = 99, systemIntegrity = 99.4, childBlocks = 47 } = metrics || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleCardClick = (type) => {
    // Only allow click action if active Founder Admin session
    if (isFounderSession && onCardClick) {
      onCardClick(type);
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card 1: Total Scans */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('totalScans')}
        className={`cyber-card p-5 relative overflow-hidden flex flex-col items-center justify-center border-b-2 border-b-[var(--accent)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] text-center transition-all ${
          isFounderSession ? 'hover:border-[var(--accent)] cursor-pointer hover:scale-[1.02]' : 'cursor-default'
        }`}
      >
        <Shield className="text-[var(--accent)] mb-2" size={24} />
        <div className="text-[var(--text-muted)] text-xs mb-1 font-mono">{t('metrics.totalScans')}</div>
        <div className="text-3xl font-bold font-mono text-[var(--text-primary)]">
          <CountUp end={totalScans} format={(v) => v.toLocaleString()} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40"></div>
      </motion.div>

      {/* Card 2: Threats Blocked */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('threatsBlocked')}
        className={`cyber-card p-5 relative overflow-hidden flex flex-col items-center justify-center border-b-2 border-b-[var(--threat)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] text-center transition-all ${
          isFounderSession ? 'hover:border-rose-500 cursor-pointer hover:scale-[1.02]' : 'cursor-default'
        }`}
      >
        <ShieldAlert className="text-[var(--threat)] mb-2" size={24} />
        <div className="text-[var(--text-muted)] text-xs mb-1 font-mono">{t('metrics.threatsBlocked')}</div>
        <div className="text-3xl font-bold font-mono text-[var(--threat)]">
          <CountUp end={threatsBlocked} format={(v) => v.toLocaleString()} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--threat)] to-transparent opacity-40"></div>
      </motion.div>

      {/* Card 3: Child Guard Blocks */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('childBlocks')}
        className={`cyber-card p-5 relative overflow-hidden flex flex-col items-center justify-center border-b-2 border-b-purple-500 bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] text-center transition-all ${
          isFounderSession ? 'hover:border-purple-400 cursor-pointer hover:scale-[1.02]' : 'cursor-default'
        }`}
      >
        <Baby className="text-purple-400 mb-2" size={24} />
        <div className="text-[var(--text-muted)] text-xs mb-1 font-mono">{t('metrics.childBlocks')}</div>
        <div className="text-3xl font-bold font-mono text-purple-400">
          <CountUp end={childBlocks} format={(v) => v.toLocaleString()} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40"></div>
      </motion.div>

      {/* Card 4: System Integrity */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('systemIntegrity')}
        className={`cyber-card p-5 relative overflow-hidden flex flex-col items-center justify-center border-b-2 border-b-[var(--safe)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] text-center transition-all ${
          isFounderSession ? 'hover:border-emerald-400 cursor-pointer hover:scale-[1.02]' : 'cursor-default'
        }`}
      >
        <ShieldCheck className="text-[var(--safe)] mb-2" size={24} />
        <div className="text-[var(--text-muted)] text-xs mb-1 font-mono">{t('metrics.systemIntegrity')}</div>
        <div className="text-3xl font-bold font-mono text-[var(--safe)]">
          <CountUp end={Math.floor(systemIntegrity)} format={(v) => `${v}%`} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--safe)] to-transparent opacity-40"></div>
      </motion.div>
    </motion.div>
  );
};

export default MetricsBar;
