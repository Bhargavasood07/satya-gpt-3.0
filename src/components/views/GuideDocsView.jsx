import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BookOpen, Sparkles, ScanLine, Bot, ShieldAlert, GraduationCap, Baby, Building2, Lock, CheckCircle2, PhoneCall, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

const GuideDocsView = memo(({ onSelectTab }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  return (
    <div className="space-y-6 font-mono text-slate-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0D1527] via-[#15213A] to-[#0D1527] border-2 border-[var(--accent)] p-5 sm:p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="animate-cyber-scan" />
        <div className="flex items-center gap-3.5 border-b border-[#1E2D4A] pb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-lg">
            <BookOpen size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-wider text-slate-100">
                {isHindi ? 'SATYA-GPT उपयोगकर्ता मार्गदर्शिका एवं नियम' : 'SATYA-GPT User Guide & System Documentation'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] text-[10px] font-extrabold border border-[var(--accent)]">
                {isHindi ? 'आधिकारिक गाइड' : 'OFFICIAL DOCS'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHindi 
                ? 'नागरिकों के लिए सरल साइबर सुरक्षा निर्देश, खतरा जांचने की तकनीक और आपातकालीन खाता फ्रीज प्रक्रिया।'
                : 'Comprehensive operational manual, threat detection architecture, and emergency nodal protocols.'}
            </p>
          </div>
        </div>

        {/* 3-Step Quick Guide Banner */}
        <div className="mt-4 p-4 bg-[#060913] border border-[#27395C] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
              <Sparkles size={15} className="text-[var(--accent)]" />
              <span>{isHindi ? '3 आसान चरण: अपने और अपने परिवार के बैंक खातों को सुरक्षित रखें' : '3-Step Protection Guide: Protect Yourself & Your Family'}</span>
            </span>
            <span className="text-[10px] text-cyan-300 font-extrabold uppercase">
              {isHindi ? 'सरल व आसान' : 'EASY TO USE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#0D1527] border border-[#27395C] rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <span className="font-bold text-slate-100">
                  {isHindi ? 'लिंक, SMS या QR कोड डालें' : 'Paste Link, SMS, or QR'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                {isHindi 
                  ? 'किसी भी बैंक SMS, बिजली बिल संदेश, अनजान WhatsApp लिंक या QR कोड को कॉपी करके स्कैनर में पेस्ट करें।'
                  : 'Copy any suspicious SMS, WhatsApp text, UPI QR link, or website URL and paste into SATYA Threat Scanner.'}
              </p>
            </div>

            <div className="p-3 bg-[#0D1527] border border-[#27395C] rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <span className="font-bold text-slate-100">
                  {isHindi ? '92 सुरक्षा इंजनों का स्कोर देखें' : 'View 92 Engine Scores'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                {isHindi
                  ? 'विश्व के 92 प्रमुख एंटीवायरस और सुरक्षा सिस्टम तुरंत बता देंगे कि लिंक सुरक्षित है या फ्रॉड।'
                  : 'Instant VirusTotal v3 verification cross-checking 90+ security vendors with offline edge AI detection.'}
              </p>
            </div>

            <div className="p-3 bg-[#0D1527] border border-[#27395C] rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <span className="font-bold text-slate-100">
                  {isHindi ? 'कवच AI सहायक से पूछें' : 'Ask KAVACH AI Assistant'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                {isHindi
                  ? 'हिंदी या अंग्रेजी में बोलकर तुरंत सलाह पाएं कि अगर फ्रॉड हो गया है तो पैसे कैसे बचाएं।'
                  : 'Get instant Hindi & English voice audio advice and expert guidance on how to avoid financial losses.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive System Documentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Threat Scanner Architecture */}
        <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] space-y-2.5">
          <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-sm border-b border-[#1E2D4A] pb-2">
            <ScanLine size={18} className="text-[var(--accent)]" />
            <span>{isHindi ? '1. AI खतरा स्कैनर एवं सुरक्षा जांच' : '1. AI Threat Scanner & VirusTotal Integration'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi 
              ? 'संदिग्ध वेबसाइट, बैंकिंग SMS और खतरनाक APK फाइल को सेकंडों में जांचकर बताता है कि यह असली है या फ्रॉड।'
              : 'Combines client-side VirusTotal v3 REST API verification with offline edge AI signature models to flag phishing URLs, malicious APK payloads, and scam SMS templates in sub-2ms.'}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li>{isHindi ? 'कॉपी किए गए लिंक की तुरंत स्वतः जांच (ऑटो-स्कैन)' : 'Zero-Click Clipboard Auto-Scanning for instant link safety check'}</li>
            <li>{isHindi ? 'फर्जी बिजली बिल SMS, ई-चालान APK और बैंक KYC फ्रॉड की पहचान' : 'Detects e-Challan APK malware, SBI KYC phishing, and Telegram job scams'}</li>
            <li>{isHindi ? 'कास्परस्की, सोफोस व गूगल सेफ ब्राउजिंग द्वारा सत्यापित' : 'Real-time vendor breakdowns (Kaspersky, Sophos, Google Safebrowsing)'}</li>
          </ul>
        </div>

        {/* Module 2: KAVACH AI & TTS Voice Alerts */}
        <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] space-y-2.5">
          <div className="flex items-center gap-2.5 text-purple-300 font-bold text-sm border-b border-[#1E2D4A] pb-2">
            <Bot size={18} className="text-purple-400" />
            <span>{isHindi ? '2. कवच AI बहुभाषी आवाज सहायक' : '2. KAVACH AI Multilingual Voice Assistant'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi 
              ? 'हिंदी और अंग्रेजी में बोलकर साइबर अपराध से बचने के सरल और तुरंत उपाय पूछें।'
              : 'Multi-modal cyber assistant powered by high-performance LLM engines with integrated Web Speech TTS voice synthesis in Hindi and English.'}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li>{isHindi ? 'हिंदी में बोलकर जवाब सुनाने की सुविधा (आवाज रीप्ले)' : 'Voice Replay button for audio alert playback'}</li>
            <li>{isHindi ? 'विभिन्न AI विशेषज्ञ (साइबर सुरक्षा, शिक्षक, अनुवादक)' : 'Specialized AI Personas (Cyber Security Expert, Teacher, Translator)'}</li>
            <li>{isHindi ? 'PDF, वर्ड और एक्सेल फाइलों को स्कैन करने की सुविधा' : 'RAG Document Parser supporting PDF, DOCX, XLSX, and TXT files'}</li>
          </ul>
        </div>

        {/* Module 3: 15-Minute Bank Freeze Protocol */}
        <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] space-y-2.5">
          <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm border-b border-[#1E2D4A] pb-2">
            <ShieldAlert size={18} className="text-rose-400" />
            <span>{isHindi ? '3. 15-मिनट आपातकालीन बैंक खाता फ्रीज' : '3. 15-Min Golden Hour Emergency Bank Lock'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi
              ? 'यदि आपके साथ धोखाधड़ी हुई है, तो पहले 15 मिनट (गोल्डन ऑवर) में पैसे निकालने पर तुरंत रोक लगाने की सुविधा।'
              : 'Direct Nodal API Integration connecting victims to SBI, HDFC, ICICI, Axis, PNB, and NPCI gateways to lock fraud beneficiary payouts.'}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li>{isHindi ? 'सुरक्षित 2-चरणीय OTP सत्यापन' : '2-Step 2FA Security OTP verification for safe authorization'}</li>
            <li>{isHindi ? 'आधिकारिक आपातकालीन रेफरेंस टोकन जारी' : 'Generates official Emergency Lock Reference Token (FREEZE-1930-XXXXXX)'}</li>
            <li>{isHindi ? '1-क्लिक से 1930 राष्ट्रीय साइबर हेल्पलाइन पर कॉल' : '1-Tap direct dial link to 1930 National Cyber Fraud Helpline'}</li>
          </ul>
        </div>

        {/* Module 4: Kavach Cyber Security Academy */}
        <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] space-y-2.5">
          <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm border-b border-[#1E2D4A] pb-2">
            <GraduationCap size={18} className="text-amber-400" />
            <span>{isHindi ? '4. कवच साइबर अकादमी एवं सर्टिफिकेट' : '4. Kavach Academy & Candidate Certificate'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi 
              ? '10 वास्तविक फ्रॉड परिदृश्यों का अभ्यास करें और डिजिटल सुरक्षा के गुर सीखें।'
              : 'Interactive 10-Scenario Threat Simulator teaching real-world defense against UPI QR fraud, AI voice deepfakes, e-Challan APKs, and SIM KYC scams.'}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li>{isHindi ? 'हर बार नए विकल्पों के साथ अभ्यास' : 'Fisher-Yates dynamic option shuffling on every quiz attempt'}</li>
            <li>{isHindi ? 'संस्थापक भार्गव सूद द्वारा हस्ताक्षरित आधिकारिक सर्टिफिकेट' : 'Official signed candidate certificate with authentic SVG signature of Founder Bhargava Sood'}</li>
            <li>{isHindi ? 'डाउनलोड करने योग्य उच्च-गुणवत्ता PDF सर्टिफिकेट' : 'Printable & downloadable high-resolution Cyber Security Masterclass PDF'}</li>
          </ul>
        </div>

        {/* Module 5: Child Safety & Family Share Guard */}
        <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] space-y-2.5">
          <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-sm border-b border-[#1E2D4A] pb-2">
            <Baby size={18} className="text-emerald-400" />
            <span>{isHindi ? '5. बाल व परिवार सुरक्षा शील्ड' : '5. Child Guard & 1-Click Family Share'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi 
              ? 'बच्चों और बुजुर्गों को अश्लील विज्ञापनों, गेमिंग फ्रॉड और गलत लिंक से पूरी सुरक्षा देता है।'
              : 'Parental protection system blocking adult content, gaming scams, and phishing redirects with 1-tap WhatsApp family link share.'}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li>{isHindi ? 'माता-पिता और वरिष्ठ नागरिकों के लिए पूर्व-कॉन्फ़िगर सुरक्षा' : 'Pre-configures Guard mode for parents and children'}</li>
            <li>{isHindi ? 'असुरक्षित वेबसाइट्स को खोलने से पहले ही ब्लॉक करना' : 'Real-time blocking feedback for unsafe web requests'}</li>
          </ul>
        </div>

        {/* Module 6: MeitY & CERT-In Accreditation */}
        <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] space-y-2.5">
          <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm border-b border-[#1E2D4A] pb-2">
            <Building2 size={18} className="text-amber-400" />
            <span>{isHindi ? '6. राष्ट्रीय नोडल मानक एवं सरकारी दिशा-निर्देश' : '6. National Nodal Accreditation & Compliance'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHindi 
              ? 'भारत सरकार के MeitY, CERT-In, I4C 1930 और साइबर स्वच्छता केंद्र के दिशा-निर्देशों के पूर्णतः अनुरूप।'
              : 'Aligned with CERT-In directives, MeitY Cyber Defense Framework, I4C 1930 Portal, Cyber Swachhta Kendra, and ISO/IEC 27001:2022 ISMS standards.'}
          </p>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
            <li>{isHindi ? 'बैंक खाता और फोन नंबर का शून्य-ट्रस्ट डेटा मास्किंग' : 'Zero-Trust field masking for bank accounts and phone numbers'}</li>
            <li>{isHindi ? 'उच्च-सुरक्षा युक्त उत्पादन कोड' : 'Production code hardening with zero source map exposure'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

GuideDocsView.displayName = 'GuideDocsView';
export default GuideDocsView;
