import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const HowItWorks = ({ onTryItClick }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const steps = [
    {
      number: '01',
      tag: isHindi ? 'चरण 01: इनपुट दर्ज' : 'STAGE-01 // INGEST',
      title: t('howItWorks.step1Title', 'Paste a suspicious link, SMS, or QR code'),
      description: t('howItWorks.step1Desc', 'Quickly drop any suspicious digital content into the analysis engine.'),
      icon: ScanLine,
      color: 'var(--cyan-500)',
      accentBg: 'rgba(0, 200, 239, 0.12)'
    },
    {
      number: '02',
      tag: isHindi ? 'चरण 02: AI विश्लेषण' : 'STAGE-02 // CORRELATE',
      title: t('howItWorks.step2Title', 'KAVACH AI + 92 engines analyze it instantly'),
      description: t('howItWorks.step2Desc', 'Our proprietary AI combined with global threat intelligence scans the content.'),
      icon: Zap,
      color: 'var(--primary)',
      accentBg: 'rgba(26, 108, 249, 0.12)'
    },
    {
      number: '03',
      tag: isHindi ? 'चरण 03: त्वरित परिणाम' : 'STAGE-03 // VERDICT',
      title: t('howItWorks.step3Title', 'Get a plain-language verdict and next steps'),
      description: t('howItWorks.step3Desc', 'Receive actionable insights and clear steps to protect yourself.'),
      icon: ShieldCheck,
      color: 'var(--emerald-500)',
      accentBg: 'rgba(0, 200, 150, 0.12)'
    }
  ];

  return (
    <section className="py-6 font-sans">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-7 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-[var(--cyan-500)]/30 bg-[var(--cyan-500)]/10 text-[var(--cyan-400)]">
            <Sparkles size={11} />
            <span>{isHindi ? 'तीन सरल चरण' : '3-STEP SOC PROTOCOL'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold break-words" style={{ color: 'var(--text-primary)' }}>
            {t('howItWorks.title', 'How It Works')}
          </h2>
          <p className="text-xs sm:text-sm max-w-lg mx-auto break-words" style={{ color: 'var(--text-secondary)' }}>
            {t('howItWorks.subtitle', 'Three simple steps to secure your digital presence.')}
          </p>
        </div>

        <motion.div 
          className="relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step) => (
            <motion.div 
              key={step.number} 
              variants={itemVariants}
              className="cyber-bracket cyber-network-grid relative rounded-xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-md"
              style={{ 
                backgroundColor: 'var(--surface-card)', 
                border: '1px solid var(--border-default)', 
              }}
            >
              <div>
                {/* Header row with step number and tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border tracking-wider"
                    style={{ borderColor: `${step.color}40`, color: step.color, background: step.accentBg }}>
                    {step.tag}
                  </span>
                  <span className="text-2xl font-black font-mono opacity-40" style={{ color: step.color }}>
                    {step.number}
                  </span>
                </div>
                
                <div 
                  className="w-13 h-13 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
                  style={{ 
                    backgroundColor: step.accentBg, 
                    color: step.color,
                    border: `1px solid ${step.color}40`
                  }}
                >
                  <step.icon size={26} />
                </div>

                <h3 className="text-sm sm:text-base font-bold mb-2 break-words" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
                
                <p className="text-xs break-words" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span>VERIFIED CLEAN</span>
                <span style={{ color: step.color }}>92 ENGINES</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center">
          <button 
            onClick={onTryItClick}
            className="btn btn--primary py-3 px-8 text-sm font-bold shadow-xl flex items-center gap-2"
          >
            <span>{t('howItWorks.tryNow', 'Try it now')}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
