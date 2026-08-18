import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, ShieldAlert, ShieldCheck, Baby } from 'lucide-react';

const CountUp = memo(({ end, duration = 1200, format = (v) => v }) => {
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
});

const MetricsBar = ({ metrics, onCardClick, isFounderSession = false }) => {
  const { t } = useTranslation();
  const { totalScans = 1442, threatsBlocked = 99, systemIntegrity = 99.4, childBlocks = 47 } = metrics || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  const handleCardClick = (type) => {
    if (isFounderSession && onCardClick) {
      onCardClick(type);
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card 1: Total Scans */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('totalScans')}
        className={`cyber-card p-4 sm:p-5 relative overflow-hidden flex flex-col items-center justify-center bg-[#0d1629] rounded-2xl border border-[#24375b] text-center transition-all ${
          isFounderSession ? 'hover:border-[var(--accent)] cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mb-2.5 shadow-sm">
          <Shield size={20} />
        </div>
        <div className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase font-extrabold tracking-wider">{t('metrics.totalScans', 'Total Scans Today')}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          <CountUp end={totalScans} format={(v) => v.toLocaleString()} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60"></div>
      </motion.div>

      {/* Card 2: Threats Blocked */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('threatsBlocked')}
        className={`cyber-card p-4 sm:p-5 relative overflow-hidden flex flex-col items-center justify-center bg-[#0d1629] rounded-2xl border border-[#24375b] text-center transition-all ${
          isFounderSession ? 'hover:border-rose-500 cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2.5 shadow-sm">
          <ShieldAlert size={20} />
        </div>
        <div className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase font-extrabold tracking-wider">{t('metrics.threatsBlocked', 'Threats Blocked')}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
          <CountUp end={threatsBlocked} format={(v) => v.toLocaleString()} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-60"></div>
      </motion.div>

      {/* Card 3: Child Guard Blocks */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('childBlocks')}
        className={`cyber-card p-4 sm:p-5 relative overflow-hidden flex flex-col items-center justify-center bg-[#0d1629] rounded-2xl border border-[#24375b] text-center transition-all ${
          isFounderSession ? 'hover:border-purple-400 cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-2.5 shadow-sm">
          <Baby size={20} />
        </div>
        <div className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase font-extrabold tracking-wider">{t('metrics.childBlocks', 'Child Guard Blocks')}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
          <CountUp end={childBlocks} format={(v) => v.toLocaleString()} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
      </motion.div>

      {/* Card 4: System Integrity */}
      <motion.div
        variants={itemVariants}
        onClick={() => handleCardClick('systemIntegrity')}
        className={`cyber-card p-4 sm:p-5 relative overflow-hidden flex flex-col items-center justify-center bg-[#0d1629] rounded-2xl border border-[#24375b] text-center transition-all ${
          isFounderSession ? 'hover:border-emerald-400 cursor-pointer' : 'cursor-default'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2.5 shadow-sm">
          <ShieldCheck size={20} />
        </div>
        <div className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase font-extrabold tracking-wider">{t('metrics.systemIntegrity', 'System Integrity')}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
          <CountUp end={Math.floor(systemIntegrity)} format={(v) => `${v}%`} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60"></div>
      </motion.div>
    </motion.div>
  );
};

export default memo(MetricsBar);
