import React, { memo } from 'react';
import { ShieldCheck, Star, Quote, Award, CheckCircle2, UserCheck, Heart } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    role: 'IT Engineer, New Delhi',
    avatar: '👨‍💼',
    rating: 5,
    tag: 'RESCUED FROM UPI SCAM',
    comment: 'Pasted a suspicious electricity bill SMS link on SATYA-GPT. The 92-engine scanner immediately flagged it as a credential phishing trap. Saved my ₹45,000 savings account!',
  },
  {
    id: 2,
    name: 'Priya Nair',
    role: 'Bank Officer, Bengaluru',
    avatar: '👩‍💼',
    rating: 5,
    tag: 'E-CHALLAN MALWARE BLOCKED',
    comment: 'Received a fake RTO e-Challan APK via WhatsApp. SATYA AI detected the malicious signature instantly before installation. Crucial protection for everyday citizens.',
  },
  {
    id: 3,
    name: 'Amitabh Verma',
    role: 'Senior Citizen, Mumbai',
    avatar: '👴',
    rating: 5,
    tag: '1930 BANK FREEZE SUCCESS',
    comment: 'When my brother accidentally entered his UPI PIN on a fake job site, we triggered SATYA 15-Min Bank Freeze and dialed 1930. The fraud payout was blocked within 8 minutes!',
  },
];

const TestimonialsSection = memo(() => {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Quote size={18} className="text-[var(--primary)]" />
          <h2 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
            Verified Defense Reviews & Citizen Trust Seals
          </h2>
        </div>
        <span className="text-xs text-[var(--emerald-500)] font-extrabold flex items-center gap-1">
          <UserCheck size={14} />
          <span>100% VERIFIED SUCCESS</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] space-y-3 shadow-lg hover:border-[var(--primary)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--emerald-muted)] border border-[var(--emerald-500)]/40 text-[var(--emerald-500)] text-[9px] font-extrabold">
                  {t.tag}
                </span>
                <div className="flex text-[var(--amber-500)]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{t.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{t.name}</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{t.role}</p>
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

export default TestimonialsSection;
