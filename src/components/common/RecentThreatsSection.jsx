import React from 'react';
import { motion } from 'framer-motion';

const threatsData = [
  { id: 1, type: 'Phishing Link', payload: 'sbi-kyc-verify.tk/update', verdict: 'THREAT', severity: 'critical', engine: '89/92 engines', time: '2 min ago', location: 'Mumbai' },
  { id: 2, type: 'UPI Scam SMS', payload: 'Your a/c frozen. Click: paytm-kyc.xyz...', verdict: 'THREAT', severity: 'high', engine: '76/92 engines', time: '7 min ago', location: 'Delhi' },
  { id: 3, type: 'Fake APK', payload: 'e-challan-pay.apk via WhatsApp', verdict: 'THREAT', severity: 'critical', engine: '91/92 engines', time: '12 min ago', location: 'Bangalore' },
  { id: 4, type: 'QR Code', payload: 'QR at unknown ATM kiosk', verdict: 'SUSPICIOUS', severity: 'medium', engine: '24/92 engines', time: '18 min ago', location: 'Chennai' },
  { id: 5, type: 'Safe Link', payload: 'https://www.sbi.co.in/portal/web/home', verdict: 'SAFE', severity: 'none', engine: '0/92 engines', time: '23 min ago', location: 'Pune' }
];

const getVerdictColors = (verdict) => {
  switch (verdict) {
    case 'THREAT':
      return { border: 'var(--crimson-500)', bg: 'rgba(220, 20, 60, 0.1)', text: 'var(--crimson-500)' };
    case 'SUSPICIOUS':
      return { border: 'var(--amber-500)', bg: 'rgba(255, 191, 0, 0.1)', text: 'var(--amber-500)' };
    case 'SAFE':
      return { border: 'var(--emerald-500)', bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--emerald-500)' };
    default:
      return { border: 'var(--border-subtle)', bg: 'transparent', text: 'var(--text-primary)' };
  }
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const RecentThreatsSection = () => {
  return (
    <section className="py-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Recent Threats Caught
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" 
               style={{ backgroundColor: 'rgba(220, 20, 60, 0.1)', color: 'var(--crimson-500)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--crimson-500)' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--crimson-500)' }}></span>
            </span>
            Live
          </div>
        </div>

        <motion.div 
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {threatsData.map((threat) => {
            const colors = getVerdictColors(threat.verdict);
            
            return (
              <motion.div 
                key={threat.id}
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 rounded-lg shadow-sm"
                style={{ 
                  backgroundColor: 'var(--surface-card)', 
                  borderLeft: `4px solid ${colors.border}`,
                  borderTop: '1px solid var(--border-subtle)',
                  borderRight: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {/* Left: Verdict Pill */}
                <div className="flex-shrink-0 mb-2 sm:mb-0 sm:w-32">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide" 
                        style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {threat.verdict}
                  </span>
                </div>

                {/* Middle: Type + Payload + Location */}
                <div className="flex-grow min-w-0 pr-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {threat.type}
                    </span>
                    <span className="text-xs text-ellipsis overflow-hidden whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {threat.payload}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    📍 {threat.location}
                  </div>
                </div>

                {/* Right: Engine Count + Time */}
                <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 mt-2 sm:mt-0">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {threat.engine}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {threat.time}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default RecentThreatsSection;
