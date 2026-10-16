import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Flame, Calculator, Scale, Code2, TrendingUp, ArrowRight,
  ShieldCheck, Sparkles, Zap, Award, Building2, Terminal
} from 'lucide-react';

const EnterpriseShowcaseBento = memo(({
  onOpenSimulator,
  onOpenCalculator,
  onOpenForensics,
  onOpenApiPlayground,
  onOpenInvestorDataRoom
}) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const tools = [
    {
      id: 'simulator',
      title: 'Zero-Day Attack Simulator',
      titleHi: 'जीरो-डे साइबर हमला सिम्युलेटर',
      badge: 'INVESTOR PITCH DEMO',
      badgeColor: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
      description: 'Simulate Digital Arrest, e-Challan APKs, and UPI traps neutralized in 14ms.',
      descriptionHi: 'डिजिटल अरेस्ट, फर्जी APK और UPI फ्रॉड को 14ms में ब्लॉक होते हुए लाइव देखें।',
      icon: Flame,
      iconColor: 'text-rose-400',
      bgGlow: 'hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]',
      onClick: onOpenSimulator
    },
    {
      id: 'calculator',
      title: 'Fraud Loss & ROI Calculator',
      titleHi: 'एंटरप्राइज फ्रॉड लॉस व ROI कैलकुलेटर',
      badge: 'CFO & BOARD TOOL',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
      description: 'Calculate annual loss prevention, capital payback (<18 days), and 18.5x ROI.',
      descriptionHi: 'बैंकों व फिनटेक हेतु वार्षिक बचत, पूंजी पेबैक व 18.5x ROI का त्वरित विश्लेषण।',
      icon: Calculator,
      iconColor: 'text-emerald-400',
      bgGlow: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      onClick: onOpenCalculator
    },
    {
      id: 'forensics',
      title: 'Sec 65B Forensic Certificates',
      titleHi: 'धारा 65B डिजिटल साक्ष्य प्रमाणपत्र',
      badge: 'POLICE & COURT READY',
      badgeColor: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
      description: 'Generate SHA-256 sealed FIR evidence admissible under IT Act 2000 & 1930 portal.',
      descriptionHi: '1930 पोर्टल व कोर्ट में मान्य SHA-256 प्रमाणित डिजिटल साक्ष्य रिपोर्ट बनाएं।',
      icon: Scale,
      iconColor: 'text-cyan-400',
      bgGlow: 'hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.2)]',
      onClick: onOpenForensics
    },
    {
      id: 'api',
      title: 'Developer Hub & API Sandbox',
      titleHi: 'डेवलपर हब व लाइव API सैंडबॉक्स',
      badge: 'REST & ANDROID SDK',
      badgeColor: 'border-blue-500/40 bg-blue-500/15 text-blue-300',
      description: 'Test sub-15ms threat detection endpoints with live cURL, Python & Kotlin snippets.',
      descriptionHi: 'cURL, पायथन और कोटलिन कोड के साथ 12ms फ्रॉड डिफेंस API का तुरंत परीक्षण करें।',
      icon: Code2,
      iconColor: 'text-blue-400',
      bgGlow: 'hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
      onClick: onOpenApiPlayground
    },
    {
      id: 'investor',
      title: 'Investor Data Room & Diligence',
      titleHi: 'संस्थापक निवेशक डेटा रूम व अनुपालन',
      badge: '$15.2B TAM • SEED/M&A',
      badgeColor: 'border-purple-500/40 bg-purple-500/15 text-purple-300',
      description: 'TAM/SAM/SOM market analysis, proprietary AI moat taxonomy, and DPDP Act compliance.',
      descriptionHi: '$15.2B बाजार विश्लेषण, KAVACH AI पेटेंटेबल डिफेंस व DPDP 2023 अनुपालन।',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      bgGlow: 'hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
      onClick: onOpenInvestorDataRoom
    }
  ];

  return (
    <section className="space-y-3 font-sans w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs">
            ★
          </div>
          <h2 className="text-caption font-bold uppercase tracking-widest text-[var(--text-muted)]">
            {isHindi ? 'एंटरप्राइज व निवेशक सूट • अत्याधुनिक सुरक्षा क्षमताएं' : 'Enterprise & Investor Suite • Strategic Capabilities'}
          </h2>
        </div>
        <div className="text-[10px] font-mono font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center gap-1">
          <Sparkles size={10} className="animate-pulse" />
          <span>INSTANT DUE-DILIGENCE SUITE</span>
        </div>
      </div>

      {/* Grid of 5 High-Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {tools.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={item.onClick}
              className={`p-3.5 sm:p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] flex flex-col justify-between transition-all cursor-pointer group ${item.bgGlow}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-[#040711] border border-[var(--border-subtle)] flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon size={17} />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors">
                  {isHindi ? item.titleHi : item.title}
                </h3>

                <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 leading-snug line-clamp-3">
                  {isHindi ? item.descriptionHi : item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                <span>{isHindi ? 'सूट खोलें' : 'Launch Suite'}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});

EnterpriseShowcaseBento.displayName = 'EnterpriseShowcaseBento';
export default EnterpriseShowcaseBento;
