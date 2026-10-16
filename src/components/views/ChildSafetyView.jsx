import React from 'react';
import { useTranslation } from 'react-i18next';
import { Baby, ShieldCheck, ShieldAlert, AlertTriangle, Lock, Eye, Sparkles } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

export default function ChildSafetyView() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const { isChildMode, toggleChildMode } = useChildMode();

  return (
    <div className="space-y-5 font-mono text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131B2E] border border-[#27395C] p-4 rounded-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Baby size={22} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
              {t('childMode.title', 'Child Guard & Family Cyber Protection Shield')}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t('childMode.subtitle', 'Automatic safety filter blocking adult sites, gaming coin scams (Robux traps) & predatory links')}
            </p>
          </div>
        </div>

        <button
          onClick={toggleChildMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-md flex items-center gap-2 cursor-pointer ${
            isChildMode
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[#0B0F19] text-slate-200 border-[#27395C] hover:border-amber-400'
          }`}
        >
          <Baby size={16} />
          <span>{isChildMode ? (isHindi ? 'बाल सुरक्षा: सक्रिय' : 'CHILD GUARD: ACTIVE') : (isHindi ? 'बाल सुरक्षा चालू करें' : 'TURN ON CHILD GUARD')}</span>
        </button>
      </div>

      {/* Main Status Card */}
      <div className={`p-5 rounded-xl border transition-all shadow-2xl ${
        isChildMode
          ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
          : 'bg-[#131B2E] border-[#27395C] text-slate-300'
      }`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {isChildMode ? (
              <ShieldCheck size={36} className="text-amber-400" />
            ) : (
              <ShieldAlert size={36} className="text-slate-500" />
            )}
            <div>
              <div className="text-sm font-bold uppercase">
                {isChildMode 
                  ? (isHindi ? 'परिवार व बाल सुरक्षा कवच पूर्ण रूप से सक्रिय है' : 'Family Cyber Protection is Fully Active') 
                  : (isHindi ? 'बाल सुरक्षा मोड अभी बंद है' : 'Child Guard is Disabled')}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {isChildMode
                  ? (isHindi 
                      ? 'सभी वेबसाइट लिंक, WhatsApp मैसेज व QR कोड को बच्चों के लिए सुरक्षित रखने हेतु जांचा जा रहा है।' 
                      : 'All web links, SMS forwards & QR codes are continuously filtered against harmful content.')
                  : (isHindi 
                      ? 'बच्चों और बुजुर्गों को फर्जी गेमिंग झांसों और ऑनलाइन खतरों से बचाने के लिए बाल सुरक्षा चालू करें।' 
                      : 'Turn on Child Guard to protect children and family members from online threats.')}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
            isChildMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {isChildMode ? (isHindi ? 'सुरक्षित' : 'PROTECTED') : (isHindi ? 'बंद' : 'OFF')}
          </span>
        </div>

        {/* 4 Feature Protection Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Lock size={14} />
              <span>{isHindi ? 'अनुचित सामग्री ब्लॉक' : 'Adult Site Block'}</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHindi ? 'गलत वेबसाइट्स और अनुचित रीडायरेक्ट को तुरंत रोकता है।' : 'Filters inappropriate redirect links & adult domains.'}
            </p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>{isHindi ? 'गेमिंग स्कैम से बचाव' : 'Game Scam Trap Block'}</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHindi ? 'फ्री रोबक्स, डायमंड्स व फर्जी गेमिंग ऑफर को ब्लॉक करता है।' : 'Blocks fake Robux, Free Diamonds & gaming login traps.'}
            </p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-[var(--accent)] flex items-center gap-1.5">
              <Eye size={14} />
              <span>{isHindi ? 'सुरक्षित सर्च फिल्टर' : 'Safe Search Enforcer'}</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHindi ? 'इंटरनेट सर्च में केवल सुरक्षित सामग्री ही दिखाता है।' : 'Enforces safe search parameters across web lookups.'}
            </p>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>{isHindi ? 'सरल AI सुरक्षा सलाह' : 'Simple AI Explainer'}</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHindi ? 'कवच AI आसान भाषा में समझाता है कि क्या सुरक्षित है और क्या नहीं।' : 'KAVACH AI explains safety rules in simple student-friendly terms.'}
            </p>
          </div>
        </div>

        {/* Specialized 18+ Ad & Clone Protection Grid */}
        <div className="pt-3 border-t border-[#27395C]/60 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
            <span>🛡️</span>
            <span>{isHindi ? 'नाबालिगों (Under 18) के लिए विशेष सुरक्षा ढाल' : 'Specialized Minor Protection Defenses (<18 Years)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 18+ Ad Blocker */}
            <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>🔞</span>
                  <span>{isHindi ? '18+ विज्ञापन व जुआ ऐप ब्लॉकर' : '18+ Ad & Betting Blocker'}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">
                  POCSO COMPLIANT
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'बच्चों के गेम और वीडियो में आने वाले 18+ जुआ (Teen Patti, Aviator, 1xBet), सट्टा और अश्लील विज्ञापनों को सीधे फ़िल्टर करता है।'
                  : 'Automatically intercepts 18+ betting ads (Aviator, Stake, Teen Patti), adult dating popups, and predatory cash traps shown to minors.'}
              </p>
              <div className="text-[10px] text-amber-300/80 font-mono">
                ✓ {isHindi ? 'अवैध सट्टेबाजी व आयु-प्रतिबंधित लिंक ब्लॉक' : 'Blocks illegal betting & age-restricted ad redirects'}
              </div>
            </div>

            {/* Fake Copycat Clone Shield */}
            <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <span>🌐</span>
                  <span>{isHindi ? 'नकली क्लोन वेबसाइट ढाल' : 'Copycat Website Clone Shield'}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px]">
                  ANTI-TYPOSQUATTING
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {isHindi
                  ? 'असली जैसी दिखने वाली नकली वेबसाइट्स (जैसे फर्जी स्कॉलरशिप पोर्टल, गेमिंग लॉगिन, या बैंक क्लोन) की पहचान कर परिवार को अलर्ट करता है।'
                  : 'Detects typosquatting clone sites (fake scholarship portals, copycat bank logins, fake game stores) and highlights the real official URL.'}
              </p>
              <div className="text-[10px] text-rose-300/80 font-mono">
                ✓ {isHindi ? 'ब्रांड धोखाधड़ी व फ़िशिंग नकल की 100% पहचान' : '100% Brand impersonation & copycat phishing detection'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
