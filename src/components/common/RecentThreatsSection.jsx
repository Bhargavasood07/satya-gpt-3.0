import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Radio, ShieldAlert, AlertTriangle, ShieldCheck, MapPin, Activity } from 'lucide-react';

const getVerdictColors = (verdict) => {
  switch (verdict) {
    case 'THREAT':
      return { 
        border: 'var(--crimson-500)', 
        bg: 'var(--crimson-muted)', 
        text: 'var(--crimson-500)',
        glow: 'rgba(255, 45, 79, 0.25)',
        icon: ShieldAlert
      };
    case 'SUSPICIOUS':
      return { 
        border: 'var(--amber-500)', 
        bg: 'var(--amber-muted)', 
        text: 'var(--amber-500)',
        glow: 'rgba(245, 166, 35, 0.25)',
        icon: AlertTriangle
      };
    case 'SAFE':
      return { 
        border: 'var(--emerald-500)', 
        bg: 'var(--safe-muted)', 
        text: 'var(--emerald-500)',
        glow: 'rgba(0, 200, 150, 0.25)',
        icon: ShieldCheck
      };
    default:
      return { 
        border: 'var(--border-subtle)', 
        bg: 'transparent', 
        text: 'var(--text-primary)',
        glow: 'transparent',
        icon: ShieldCheck
      };
  }
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
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
      location: isHindi ? 'मुंबई' : 'Mumbai',
      protocol: 'HTTPS_TRAP'
    },
    { 
      id: 2, 
      type: t('recentThreats.upi', 'UPI Scam SMS'), 
      payload: 'Your a/c frozen. Click: paytm-kyc.xyz...', 
      verdict: 'THREAT', 
      engine: isHindi ? '76/92 सुरक्षा इंजन' : '76/92 engines', 
      time: t('time.minutesAgo', { count: 7, defaultValue: '7m ago' }), 
      location: isHindi ? 'दिल्ली' : 'Delhi',
      protocol: 'SMS_HOOK'
    },
    { 
      id: 3, 
      type: t('recentThreats.apk', 'Fake APK'), 
      payload: 'e-challan-pay.apk via WhatsApp', 
      verdict: 'THREAT', 
      engine: isHindi ? '91/92 सुरक्षा इंजन' : '91/92 engines', 
      time: t('time.minutesAgo', { count: 12, defaultValue: '12m ago' }), 
      location: isHindi ? 'बैंगलोर' : 'Bangalore',
      protocol: 'APK_SIDELOAD'
    },
    { 
      id: 4, 
      type: t('recentThreats.qr', 'QR Code'), 
      payload: 'QR at unknown ATM kiosk', 
      verdict: 'SUSPICIOUS', 
      engine: isHindi ? '24/92 सुरक्षा इंजन' : '24/92 engines', 
      time: t('time.minutesAgo', { count: 18, defaultValue: '18m ago' }), 
      location: isHindi ? 'चेन्नई' : 'Chennai',
      protocol: 'STATIC_QR'
    },
    { 
      id: 5, 
      type: t('recentThreats.safe', 'Safe Link'), 
      payload: 'https://www.sbi.co.in/portal/web/home', 
      verdict: 'SAFE', 
      engine: isHindi ? '0/92 कोई खतरा नहीं' : '0/92 clean', 
      time: t('time.minutesAgo', { count: 23, defaultValue: '23m ago' }), 
      location: isHindi ? 'पुणे' : 'Pune',
      protocol: 'VERIFIED_SSL'
    }
  ];

  return (
    <section className="py-2 font-sans">
      <div className="w-full">
        {/* Section Header: Tactical Cyber Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio size={16} className="text-[var(--cyan-500)] animate-pulse shrink-0" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--text-primary)] break-words">
              {t('recentThreats.title', 'Recent Threats Caught')}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="cyber-telemetry-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--crimson-500)] animate-ping" />
              {t('recentThreats.live', 'LIVE THREAT FEED')}
            </span>
          </div>
        </div>

        {/* List of threats with 100% container containment */}
        <motion.div 
          className="flex flex-col gap-2.5 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {threatsData.map((threat) => {
            const colors = getVerdictColors(threat.verdict);
            const verdictLabel = t(`verdict.${threat.verdict.toLowerCase()}`, threat.verdict);
            const IconComponent = colors.icon;
            
            return (
              <motion.div 
                key={threat.id}
                variants={itemVariants}
                className="cyber-bracket flex flex-col md:flex-row md:items-center justify-between p-3 sm:p-3.5 rounded-xl transition-all w-full overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--surface-card)', 
                  borderLeft: `4px solid ${colors.border}`,
                  borderTop: '1px solid var(--border-default)',
                  borderRight: '1px solid var(--border-default)',
                  borderBottom: '1px solid var(--border-default)',
                  boxShadow: `0 2px 10px rgba(0,0,0,0.25), 0 0 12px ${colors.glow}`,
                }}
              >
                {/* Left: Verdict Badge & Icon */}
                <div className="flex items-center gap-2 mb-2 md:mb-0 shrink-0 md:w-36">
                  <span 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wide border uppercase"
                    style={{ 
                      backgroundColor: colors.bg, 
                      color: colors.text, 
                      borderColor: colors.border 
                    }}
                  >
                    <IconComponent size={12} className="shrink-0" />
                    <span>{verdictLabel}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] md:hidden">
                    {threat.time}
                  </span>
                </div>

                {/* Middle: Type + Payload Box (strictly stays in box) */}
                <div className="flex-1 min-w-0 md:px-4 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] break-words">
                      {threat.type}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-inset)] text-[var(--cyan-400)] border border-[var(--border-subtle)]">
                      {threat.protocol}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-0.5 shrink-0">
                      <MapPin size={11} className="text-[var(--text-muted)]" />
                      <span>{threat.location}</span>
                    </span>
                  </div>

                  {/* Payload container: break-all and max-w-full guarantees zero overflow */}
                  <div className="w-full min-w-0">
                    <code className="block w-full text-[11px] font-mono text-[var(--text-secondary)] break-all bg-[var(--surface-inset)]/80 px-2 py-1 rounded border border-[var(--border-subtle)]">
                      {threat.payload}
                    </code>
                  </div>
                </div>

                {/* Right: Engine Count & Timestamp */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 mt-2 md:mt-0 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] break-words text-right">
                    {threat.engine}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] hidden md:block">
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

export default React.memo(RecentThreatsSection);
