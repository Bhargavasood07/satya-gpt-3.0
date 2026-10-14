import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Star, Quote, Award, CheckCircle2, UserCheck, Heart } from 'lucide-react';

const TestimonialsSection = memo(() => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const testimonials = [
    {
      id: 1,
      name: isHindi ? 'राजेश शर्मा' : 'Rajesh Sharma',
      role: t('testimonials.item1Role', 'IT Engineer, New Delhi'),
      avatar: '👨‍💼',
      rating: 5,
      tag: t('testimonials.item1Tag', 'RESCUED FROM UPI SCAM'),
      comment: t('testimonials.item1Comment', 'Pasted a suspicious electricity bill SMS link on SATYA-GPT. The 92-engine scanner immediately flagged it as a credential phishing trap. Saved my ₹45,000 savings account!'),
    },
    {
      id: 2,
      name: isHindi ? 'प्रिया नायर' : 'Priya Nair',
      role: t('testimonials.item2Role', 'Bank Officer, Bengaluru'),
      avatar: '👩‍💼',
      rating: 5,
      tag: t('testimonials.item2Tag', 'E-CHALLAN MALWARE BLOCKED'),
      comment: t('testimonials.item2Comment', 'Received a fake RTO e-Challan APK via WhatsApp. SATYA AI detected the malicious signature instantly before installation. Crucial protection for everyday citizens.'),
    },
    {
      id: 3,
      name: isHindi ? 'अमिताभ वर्मा' : 'Amitabh Verma',
      role: t('testimonials.item3Role', 'Senior Citizen, Mumbai'),
      avatar: '👴',
      rating: 5,
      tag: t('testimonials.item3Tag', '1930 BANK FREEZE SUCCESS'),
      comment: t('testimonials.item3Comment', 'When my brother accidentally entered his UPI PIN on a fake job site, we triggered SATYA 15-Min Bank Freeze and dialed 1930. The fraud payout was blocked within 8 minutes!'),
    },
  ];

  return (
    <div className="space-y-4 font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-subtle)] pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Quote size={18} className="text-[var(--cyan-500)] shrink-0" />
          <h2 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] uppercase tracking-wider break-words">
            {t('testimonials.title', 'Verified Defense Reviews & Citizen Trust Seals')}
          </h2>
        </div>
        <span className="text-xs text-[var(--emerald-500)] font-extrabold flex items-center gap-1 shrink-0 font-mono">
          <UserCheck size={14} />
          <span>{t('testimonials.verified', '100% VERIFIED SUCCESS')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] space-y-3 shadow-lg hover:border-[var(--primary)] transition-all flex flex-col justify-between cyber-bracket overflow-hidden w-full min-w-0"
          >
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--emerald-muted)] border border-[var(--emerald-500)]/40 text-[var(--emerald-500)] text-[9px] font-extrabold font-mono">
                  {item.tag}
                </span>
                <div className="flex text-[var(--amber-500)] shrink-0">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed break-words font-sans">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg shrink-0">{item.avatar}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] break-words">{item.name}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] break-words">{item.role}</p>
                </div>
              </div>
              <CheckCircle2 size={15} className="text-[var(--emerald-500)] shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';
export default TestimonialsSection;
