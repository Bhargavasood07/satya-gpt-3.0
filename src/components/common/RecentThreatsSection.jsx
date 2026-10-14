import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const threatsData = [
    { 
      id: 1, 
      type: t('recentThreats.phish', 'Phishing Link'), 
      payload: 'sbi-kyc-verify.tk/update', 
      verdict: 'THREAT', 
      engine: isHindi ? '89/92 सुरक्षा इंजन' : '89/92 engines', 
      time: t('time.minutesAgo', { count: 2, defaultValue: '2m ago' }), 
      location: isHindi ? 'मुंबई' : 'Mumbai' 
    },
    { 
      id: 2, 
      type: t('recentThreats.upi', 'UPI Scam SMS'), 
      payload: 'Your a/c frozen. Click: paytm-kyc.xyz...', 
      verdict: 'THREAT', 
      engine: isHindi ? '76/92 सुरक्षा इंजन' : '76/92 engines', 
      time: t('time.minutesAgo', { count: 7, defaultValue: '7m ago' }), 
      location: isHindi ? 'दिल्ली' : 'Delhi' 
    },
    { 
      id: 3, 
      type: t('recentThreats.apk', 'Fake APK'), 
      payload: 'e-challan-pay.apk via WhatsApp', 
      verdict: 'THREAT', 
      engine: isHindi ? '91/92 सुरक्षा इंजन' : '91/92 engines', 
      time: t('time.minutesAgo', { count: 12, defaultValue: '12m ago' }), 
      location: isHindi ? 'बैंगलोर' : 'Bangalore' 
    },
    { 
      id: 4, 
      type: t('recentThreats.qr', 'QR Code'), 
      payload: 'QR at unknown ATM kiosk', 
      verdict: 'SUSPICIOUS', 
      engine: isHindi ? '24/92 सुरक्षा इंजन' : '24/92 engines', 
      time: t('time.minutesAgo', { count: 18, defaultValue: '18m ago' }), 
      location: isHindi ? 'चेन्नई' : 'Chennai' 
    },
    { 
      id: 5, 
      type: t('recentThreats.safe', 'Safe Link'), 
      payload: 'https://www.sbi.co.in/portal/web/home', 
      verdict: 'SAFE', 
      engine: isHindi ? '0/92 कोई खतरा नहीं' : '0/92 engines', 
      time: t('time.minutesAgo', { count: 23, defaultValue: '23m ago' }), 
      location: isHindi ? 'पुणे' : 'Pune' 
    }
  ];

  return (
    <section className="py-4">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {t('recentThreats.title', 'Recent Threats Caught')}
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" 
               style={{ backgroundColor: 'rgba(220, 20, 60, 0.1)', color: 'var(--crimson-500)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--crimson-500)' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--crimson-500)' }}></span>
            </span>
            {t('recentThreats.live', 'LIVE')}
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
            const verdictLabel = t(`verdict.${threat.verdict.toLowerCase()}`, threat.verdict);
            
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
                <div className="flex-shrink-0 mb-2 sm:mb-0 sm:w-36">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide" 
                        style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {verdictLabel}
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
