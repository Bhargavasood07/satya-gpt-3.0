import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Zap, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const HowItWorks = ({ onTryItClick }) => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      title: t('howItWorks.step1Title', 'Paste a suspicious link, SMS, or QR code'),
      description: t('howItWorks.step1Desc', 'Quickly drop any suspicious digital content into the analysis engine.'),
      icon: ScanLine,
    },
    {
      number: '02',
      title: t('howItWorks.step2Title', 'KAVACH AI + 92 engines analyze it instantly'),
      description: t('howItWorks.step2Desc', 'Our proprietary AI combined with global threat intelligence scans the content.'),
      icon: Zap,
    },
    {
      number: '03',
      title: t('howItWorks.step3Title', 'Get a plain-language verdict and next steps'),
      description: t('howItWorks.step3Desc', 'Receive actionable insights and clear steps to protect yourself.'),
      icon: ShieldCheck,
    }
  ];

  return (
    <section className="py-6">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {t('howItWorks.title', 'How It Works')}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('howItWorks.subtitle', 'Three simple steps to secure your digital presence.')}
          </p>
        </div>

        <motion.div 
          className="relative flex flex-col md:flex-row justify-between items-start md:items-stretch gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Desktop connector line */}
          <div 
            className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t border-dashed"
            style={{ borderColor: 'var(--border-subtle)', transform: 'translateY(-50%)', zIndex: 0 }}
          />

          {steps.map((step) => (
            <motion.div 
              key={step.number} 
              variants={itemVariants}
              className="relative flex-1 rounded-xl p-6 flex flex-col items-center text-center"
              style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-subtle)', zIndex: 1 }}
            >
              <div 
                className="text-5xl font-extrabold mb-4 opacity-20 bg-clip-text text-transparent bg-gradient-to-br from-blue-500 to-cyan-500"
                style={{ 
                  background: 'linear-gradient(to bottom right, var(--primary), var(--cyan-500))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {step.number}
              </div>
              
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
              >
                <step.icon size={32} />
              </div>

              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center">
          <button 
            onClick={onTryItClick}
            className="px-8 py-3 rounded-lg font-semibold transition-transform hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white',
              boxShadow: '0 4px 14px 0 rgba(var(--primary-rgb), 0.39)' 
            }}
          >
            {t('howItWorks.tryNow', 'Try it now')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
