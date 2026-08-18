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
      <div className="flex items-center justify-between border-b border-[#1b2845] pb-3">
        <div className="flex items-center gap-2">
          <Quote size={18} className="text-[var(--accent)]" />
          <h2 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-wider">
            Verified Defense Reviews & Citizen Trust Seals
          </h2>
        </div>
        <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
          <UserCheck size={14} />
          <span>100% VERIFIED SUCCESS</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="cyber-card p-5 rounded-3xl border border-[#1b2845] bg-[#0a0f24]/80 space-y-3 shadow-xl hover:border-[var(--accent)] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[9px] font-extrabold">
                  {t.tag}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#1b2845] flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#040711] border border-[#1b2845] flex items-center justify-center text-lg shrink-0">
                {t.avatar}
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-100">{t.name}</div>
                <div className="text-[10px] text-slate-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';
export default TestimonialsSection;
