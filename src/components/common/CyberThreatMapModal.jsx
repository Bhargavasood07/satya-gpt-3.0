import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MapPin, ShieldAlert, AlertTriangle, Activity, TrendingUp, Search, X,
  CheckCircle2, PhoneCall, Building2, Zap, Radio, Sparkles, Eye,
  Clock, Shield, ArrowUpRight, Flame, BarChart3, Bot, Compass, ExternalLink
} from 'lucide-react';

// ── REAL-TIME SCAM NODES WITH UNIQUE FEATURE IDENTIFIERS & COORDINATES ────────
const SCAM_FEATURE_NODES = [
  {
    id: 'delhi-digiarrest',
    featureCode: 'VEC-DIGI-ARREST-96',
    featureName: 'Digital Arrest Video Extortion',
    featureNameHi: 'डिजिटल अरेस्ट व फर्जी पुलिस वीडियो कॉल',
    category: 'digital-arrest',
    categoryLabel: 'Law Enforcement Impersonation',
    city: 'Delhi NCR',
    state: 'Delhi & Haryana',
    cityHi: 'दिल्ली एनसीआर',
    // SVG Coordinates on India schematic map (x: 0-600, y: 0-650)
    mapX: 235,
    mapY: 215,
    riskScore: 96,
    threatLevel: 'CRITICAL',
    interceptedToday: 642,
    fundsSaved: '₹3.42 Crore',
    primaryVector: 'Skype/WhatsApp Video with fake police station backdrop & arrest warrants',
    primaryVectorHi: 'फर्जी पुलिस स्टेशन का बैकड्रॉप लगाकर वीडियो कॉल पर डिजिटल अरेस्ट की धमकी',
    demographic: 'Senior Citizens, Doctors, Working Professionals',
    liveLatency: '14ms',
    prediction: {
      surgeRisk: '+34% Surge Expected in next 48h',
      predictionScore: 94.8,
      trend: 'RISING_RAPIDLY',
      timeframe: 'Next 24-48 Hours',
      aiForecast: 'AI forecasting reveals syndicates migrating from Telegram to Skype/WhatsApp targeting retirees with fake CBI drug parcels.',
      aiForecastHi: 'AI भविष्यवाणी: जालसाज अब टेलीग्राम से स्काइप/व्हाट्सएप पर शिफ्ट हो रहे हैं और बुजुर्गों को फर्जी ड्रग पार्सल में फंसा रहे हैं।',
      preventionStep: 'Law enforcement NEVER arrests citizens over Skype or WhatsApp video calls. Hang up and dial 1930 immediately.',
    },
  },
  {
    id: 'mumbai-echallan',
    featureCode: 'VEC-ECHALLAN-APK-91',
    featureName: 'e-Challan Fake APK Malware',
    featureNameHi: 'फर्जी ई-चालान APK मैलवेयर फ्रॉड',
    category: 'apk-malware',
    categoryLabel: 'Trojan APK Dropper',
    city: 'Mumbai & Pune',
    state: 'Maharashtra',
    cityHi: 'मुंबई व पुणे',
    mapX: 185,
    mapY: 420,
    riskScore: 91,
    threatLevel: 'HIGH',
    interceptedToday: 518,
    fundsSaved: '₹1.85 Crore',
    primaryVector: 'SMS alerting "Traffic fine unpaid" with link downloading e-challan.apk to steal OTPs',
    primaryVectorHi: 'ट्रैफिक चालान के नाम पर SMS भेजकर खतरनाक APK ऐप डाउनलोड करवाकर बैंक OTP चोरी करना',
    demographic: 'Car & 2-Wheeler Owners, Daily Commuters',
    liveLatency: '18ms',
    prediction: {
      surgeRisk: '+28% Weekend Traffic Fine Surge',
      predictionScore: 92.4,
      trend: 'RISING',
      timeframe: 'Next 36 Hours',
      aiForecast: 'Mass SMS blast predicted on Friday/Saturday targeting city vehicle owners with spoofed Parivahan Sewa links.',
      aiForecastHi: 'शुक्रवार व शनिवार को भारी मात्रा में फर्जी चालान SMS भेजे जाने का AI अनुमान है।',
      preventionStep: 'Official traffic fines are ONLY paid via https://echallan.parivahan.gov.in. Never install .apk files via SMS.',
    },
  },
  {
    id: 'jamtara-mewat-kyc',
    featureCode: 'VEC-CLONE-SBI-KYC-99',
    featureName: 'SBI Banking KYC Clone Harvest',
    featureNameHi: 'SBI बैंक KYC क्लोन नकल वेबसाइट',
    category: 'website-clones',
    categoryLabel: 'Banking Phishing Clone',
    city: 'Jamtara & Mewat Belt',
    state: 'Jharkhand & Haryana Hub',
    cityHi: 'जामताड़ा व मेवात क्षेत्र',
    mapX: 340,
    mapY: 280,
    riskScore: 99,
    threatLevel: 'EXTREME THREAT',
    interceptedToday: 1240,
    fundsSaved: '₹5.60 Crore',
    primaryVector: 'Typosquatting clones (sbi-kyc-update.tk) harvesting netbanking ID, password & OTP',
    primaryVectorHi: 'नकली क्लोन वेबसाइट बनाकर बैंक यूजरनेम, पासवर्ड व OTP चुराना',
    demographic: 'General Public, SBI Account Holders',
    liveLatency: '11ms',
    prediction: {
      surgeRisk: '+45% Critical Syndicate Outflow',
      predictionScore: 98.1,
      trend: 'SPIKE_WARNING',
      timeframe: 'Active Continuous Wave',
      aiForecast: 'AI Neural Detection tracks newly registered .xyz and .tk domains impersonating SBI & PNB netbanking login pages.',
      aiForecastHi: 'AI ने SBI व PNB बैंक के नाम पर नए .xyz और .tk डोमेन बनाए जाने की पुष्टि की है।',
      preventionStep: 'Banks never ask for PAN/Aadhaar update via SMS links. Real portal is ONLY https://www.onlinesbi.sbi',
    },
  },
  {
    id: 'gujarat-betting-ads',
    featureCode: 'VEC-18PLUS-BET-AD-93',
    featureName: '18+ Illegal Betting Ad Minor Trap',
    featureNameHi: '18+ अवैध सट्टेबाजी विज्ञापन व गेमिंग ट्रैप',
    category: '18plus-ads',
    categoryLabel: 'Minor Safety & Predatory Ads',
    city: 'Ahmedabad & Surat',
    state: 'Gujarat',
    cityHi: 'अहमदाबाद व सूरत',
    mapX: 145,
    mapY: 330,
    riskScore: 93,
    threatLevel: 'CRITICAL',
    interceptedToday: 890,
    fundsSaved: '₹2.10 Crore',
    primaryVector: 'Aviator, Stake & Teen Patti pop-up ads inside mobile puzzle games targeted at minors',
    primaryVectorHi: 'बच्चों के मोबाइल गेम्स में 18+ ऑनलाइन सट्टेबाजी व जुए के विज्ञापन दिखाकर पैसे ऐंठना',
    demographic: 'Minors (<18 Years), Students, Mobile Gamers',
    liveLatency: '16ms',
    prediction: {
      surgeRisk: '+58% Surge During Weekend Tournaments',
      predictionScore: 96.5,
      trend: 'RISING_RAPIDLY',
      timeframe: 'Next 48 Hours',
      aiForecast: 'Predicted 60%+ increase in aggressive popup betting ad campaigns on pirate cartoon and game streaming portals.',
      aiForecastHi: 'सप्ताहांत पर कार्टून और गेमिंग साइटों पर अवैध सट्टा विज्ञापनों में 60% वृद्धि का AI पूर्वानुमान।',
      preventionStep: 'Activate SATYA-GPT Child Guard mode immediately to enforce POCSO-compliant ad filtering on family devices.',
    },
  },
  {
    id: 'bengaluru-telegram-task',
    featureCode: 'VEC-TASK-CRYPTO-90',
    featureName: 'Telegram YouTube Task Scam',
    featureNameHi: 'टेलीग्राम यूट्यूब लाइक टास्क व क्रिप्टो फ्रॉड',
    category: 'part-time-task',
    categoryLabel: 'Prepaid Task Fraud',
    city: 'Bengaluru',
    state: 'Karnataka',
    cityHi: 'बेंगलुरु',
    mapX: 225,
    mapY: 530,
    riskScore: 90,
    threatLevel: 'HIGH',
    interceptedToday: 730,
    fundsSaved: '₹2.90 Crore',
    primaryVector: 'Pay ₹150 for liking YouTube videos, then force victim to deposit lakhs in fake crypto escrow',
    primaryVectorHi: 'शुरुआत में वीडियो लाइक के ₹150 देकर भरोसा जीतते हैं, फिर फर्जी क्रिप्टो में लाखों जमा करवाते हैं',
    demographic: 'College Students, Job Seekers, Homemakers',
    liveLatency: '13ms',
    prediction: {
      surgeRisk: '+19% Modest Increase',
      predictionScore: 88.6,
      trend: 'STABLE_ELEVATED',
      timeframe: 'Next 72 Hours',
      aiForecast: 'WhatsApp recruitment bots actively harvesting numbers from social media with "Work From Home Part-Time ₹5000/day" bait.',
      aiForecastHi: 'व्हाट्सएप पर घर बैठे ₹5000/दिन कमाने का लालच देकर टास्क फ्रॉड में फंसाने का अनुमान।',
      preventionStep: 'Legitimate companies never pay you for liking videos. Any job asking you to deposit money is 100% a scam.',
    },
  },
  {
    id: 'hyderabad-fake-trading',
    featureCode: 'VEC-STOCK-TRADING-92',
    featureName: 'Fake Institutional Stock Trading App',
    featureNameHi: 'फर्जी संस्थागत शेयर ट्रेडिंग ऐप घोटाला',
    category: 'banking-upi',
    categoryLabel: 'Stock Investment Fraud',
    city: 'Hyderabad & Cyberabad',
    state: 'Telangana',
    cityHi: 'हैदराबाद',
    mapX: 245,
    mapY: 440,
    riskScore: 92,
    threatLevel: 'CRITICAL',
    interceptedToday: 480,
    fundsSaved: '₹4.15 Crore',
    primaryVector: 'VIP WhatsApp groups claiming 500% profit with fake SEBI certificates & rigged trading dashboard',
    primaryVectorHi: 'व्हाट्सएप ग्रुप में 500% मुनाफे का झांसा देकर नकली ट्रेडिंग ऐप में पैसे निवेश करवाना',
    demographic: 'High Net-Worth Individuals, Stock Investors',
    liveLatency: '15ms',
    prediction: {
      surgeRisk: '+37% High Wealth Risk',
      predictionScore: 93.9,
      trend: 'RISING',
      timeframe: 'Next 48 Hours',
      aiForecast: 'Syndicates using deepfake AI videos of prominent business leaders on Facebook & Instagram to lure investors.',
      aiForecastHi: 'नामी उद्योगपतियों के डीपफेक AI वीडियो बनाकर सोशल मीडिया पर शेयर मार्केट का लालच देने की आशंका।',
      preventionStep: 'Verify all brokers on SEBI official directory (sebi.gov.in). Never transfer investment funds to personal bank accounts.',
    },
  },
  {
    id: 'kolkata-customs-parcel',
    featureCode: 'VEC-PARCEL-CUSTOMS-84',
    featureName: 'FedEx Customs Parcel Duty Hold',
    featureNameHi: 'कस्टम ड्यूटी टैक्स व फर्जी पार्सल SMS',
    category: 'malvertising',
    categoryLabel: 'Courier Phishing Vector',
    city: 'Kolkata',
    state: 'West Bengal',
    cityHi: 'कोलकाता',
    mapX: 395,
    mapY: 330,
    riskScore: 84,
    threatLevel: 'HIGH',
    interceptedToday: 390,
    fundsSaved: '₹95 Lakh',
    primaryVector: 'SMS: "Your package is on hold at airport, pay ₹28 address correction fee" to steal card CVV',
    primaryVectorHi: 'पार्सल एयरपोर्ट पर रुकने का SMS भेजकर ₹28 फीस के नाम पर क्रेडिट/डेबिट कार्ड डेटा चुराना',
    demographic: 'Online Shoppers, International Parcel Recipients',
    liveLatency: '20ms',
    prediction: {
      surgeRisk: '+14% Seasonal Increase',
      predictionScore: 86.2,
      trend: 'STEADY',
      timeframe: 'Next 5 Days',
      aiForecast: 'Automated phishing botnets targeting addresses derived from recent e-commerce order leaks.',
      aiForecastHi: 'हालिया लीक डेटा का इस्तेमाल करके पार्सल टैक्स का झांसा दिए जाने का पूर्वानुमान।',
      preventionStep: 'Couriers never send SMS demanding payment via third-party web links. Check status directly on official website.',
    },
  },
  {
    id: 'punjab-overseas-visa',
    featureCode: 'VEC-VISA-IMMIGRATION-81',
    featureName: 'Overseas Work Visa & Army Canteen',
    featureNameHi: 'विदेश वर्क वीजा व आर्मी कैंटीन फ्रॉड',
    category: 'banking-upi',
    categoryLabel: 'Advance Fee Fraud',
    city: 'Chandigarh & Ludhiana',
    state: 'Punjab & Haryana',
    cityHi: 'चंडीगढ़ व लुधियाना',
    mapX: 215,
    mapY: 160,
    riskScore: 81,
    threatLevel: 'MODERATE',
    interceptedToday: 260,
    fundsSaved: '₹75 Lakh',
    primaryVector: 'Impersonating Canadian immigration agents or Defense Officers selling cheap army vehicles on OLX',
    primaryVectorHi: 'कनाडा वीजा या आर्मी कैंटीन की सस्ती गाड़ी का झांसा देकर एडवांस टोकन मनी की ठगी',
    demographic: 'Youth seeking foreign jobs, Used Car Buyers',
    liveLatency: '17ms',
    prediction: {
      surgeRisk: '-4% Controlled Decline',
      predictionScore: 78.5,
      trend: 'DECLINING',
      timeframe: 'Next 7 Days',
      aiForecast: 'Recent state police cyber crackdown has dispersed local call centers across state borders.',
      aiForecastHi: 'पुलिस कार्रवाई के बाद लोकल सिंडिकेट्स में अस्थायी गिरावट दर्ज की गई है।',
      preventionStep: 'Never pay cash advance without embassy biometric verification. Genuine army personnel never sell vehicles online.',
    },
  },
];

// ── AGGREGATE AI PREDICTIONS & SUMMARY METRICS ────────────────────────────────
const PREDICTIVE_AI_INSIGHTS = [
  {
    title: 'Surge Warning: Festive E-Commerce Clones',
    titleHi: 'अलर्ट: त्योहारी सीजन में नकली शॉपिंग वेबसाइट्स',
    probability: '96.4% AI Confidence',
    horizon: 'Next 48 Hours',
    targetZones: 'Maharashtra, Delhi NCR, Gujarat, Karnataka',
    badge: 'HIGH SURGE',
    color: 'rose',
    description: 'Predictive neural models track 240+ spoofed domains registered with names like "amazon-festive-gift.xyz" and "flipkart-dhamaka.club" designed to harvest UPI OTPs ahead of sale events.',
    descriptionHi: 'AI मॉडल ने अमेजन व फ्लिपकार्ट के नाम से 240+ नकली वेबसाइटों के बनने का पता लगाया है जो भारी डिस्काउंट का लालच देकर बैंक डेटा चुराएंगी।',
  },
  {
    title: 'Emerging Vector: 18+ Betting Ads on Student Apps',
    titleHi: 'नया खतरा: छात्रों के ऐप्स में 18+ सट्टेबाजी विज्ञापन',
    probability: '97.8% AI Confidence',
    horizon: 'Weekend Surge',
    targetZones: 'Nationwide (Tier-2 & Tier-3 Cities)',
    badge: 'MINOR CRITICAL',
    color: 'amber',
    description: 'Prediction indicates a 58% surge in predatory ad network injections (Aviator, Stake, Teen Patti) targeting mobile gaming SDKs played by minors under 18 years.',
    descriptionHi: 'नाबालिग बच्चों के गेम्स में 18+ सट्टेबाजी और ऑनलाइन जुए के पॉप-अप विज्ञापनों में 58% की भारी वृद्धि का AI पूर्वानुमान।',
  },
  {
    title: 'Digital Arrest Syndicates Shifting to Video Spoofing',
    titleHi: 'डिजिटल अरेस्ट गैंग्स का नया वीडियो स्पूफिंग पैंतरा',
    probability: '91.2% AI Confidence',
    horizon: 'Next 7 Days',
    targetZones: 'Southern Metros (Bengaluru, Hyderabad, Chennai)',
    badge: 'POLICE ADVISORY',
    color: 'cyan',
    description: 'AI intelligence indicates cyber gangs are utilizing real-time deepfake facial reenactment of senior IPS officers during video calls to intimidate high-net-worth targets.',
    descriptionHi: 'जालसाज अब असली पुलिस अधिकारियों के डीपफेक वीडियो का इस्तेमाल करके वीडियो कॉल पर डिजिटल अरेस्ट कर रहे हैं।',
  },
];

const CyberThreatMapModal = memo(({ onClose }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'prediction'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(SCAM_FEATURE_NODES[0]);
  const [simulatedClock, setSimulatedClock] = useState('LIVE');

  // Pulsing telemetry effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = useMemo(() => [
    { id: 'all', label: isHindi ? 'सभी खतरे' : 'All Vectors' },
    { id: 'website-clones', label: isHindi ? 'नकली क्लोन' : 'Website Clones' },
    { id: '18plus-ads', label: isHindi ? '18+ विज्ञापन' : '18+ Minor Ads' },
    { id: 'digital-arrest', label: isHindi ? 'डिजिटल अरेस्ट' : 'Digital Arrest' },
    { id: 'apk-malware', label: isHindi ? 'APK मैलवेयर' : 'APK Malware' },
    { id: 'banking-upi', label: isHindi ? 'UPI / बैंक' : 'Banking & UPI' },
  ], [isHindi]);

  const filteredNodes = useMemo(() => {
    return SCAM_FEATURE_NODES.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.city.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.featureName.toLowerCase().includes(q) ||
        item.featureCode.toLowerCase().includes(q) ||
        (item.featureNameHi && item.featureNameHi.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="w-full max-w-5xl bg-[#080E1C] border border-cyan-500/40 rounded-2xl p-4 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] relative max-h-[92dvh] overflow-y-auto space-y-4 cyber-bracket cyber-network-grid"
      >
        <div className="cyber-scan-glow" />

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E2D4A] pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Compass size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-100 tracking-wider">
                  {isHindi ? 'राष्ट्रीय साइबर अपराध रडार व AI भविष्यवाणी मानचित्र' : 'National Cyber Threat Heatmap & AI Prediction Grid'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{simulatedClock}</span>
                </span>
              </div>
              <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
                {isHindi
                  ? 'रियल-टाइम डेटा एवं अद्वितीय फीचर नामों के साथ देश भर में सक्रिय साइबर ठगी और AI भविष्यवाणी'
                  : 'Real-Time Spatial Threat Telemetry & 48-Hour AI Predictive Forecast Matrix'}
              </p>
            </div>
          </div>

          {/* Right Controls: Tabs & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle: Live Map vs AI Prediction */}
            <div className="flex items-center p-1 rounded-xl bg-[#060913] border border-[#27395C]">
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-cyan-400'
                }`}
              >
                <Radio size={12} className={activeTab === 'map' ? 'animate-pulse' : ''} />
                <span>{isHindi ? 'लाइव मानचित्र' : 'Live Map'}</span>
              </button>
              <button
                onClick={() => setActiveTab('prediction')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'prediction'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              >
                <Sparkles size={12} />
                <span>{isHindi ? 'AI भविष्यवाणी' : 'AI Prediction'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-[#27395C] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Category Filters & Quick Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                    : 'bg-[#060913] text-slate-400 border-[#27395C] hover:text-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? 'शहर, फीचर या फ्रॉड खोजें...' : 'Search city, vector, feature...'}
              className="w-full pl-8 pr-3 py-1.5 bg-[#060913] border border-[#27395C] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
        </div>

        {/* ── TAB 1: INTERACTIVE REAL-TIME MAP VIEW ─────────────────────────── */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Geospatial SVG Interactive Map (7 cols) */}
            <div className="lg:col-span-7 bg-[#060a14] border border-[#1E2D4A] rounded-xl p-3 relative flex flex-col justify-between overflow-hidden min-h-[340px] sm:min-h-[420px]">
              {/* Radar Coordinate Grid Background */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />

              {/* Status Header inside Map */}
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 border-b border-[#1E2D4A]/50 pb-2 z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>NATIONAL GEOSPATIAL THREAT GRID</span>
                </span>
                <span>NODES: {filteredNodes.length} ACTIVE HOTSPOTS</span>
              </div>

              {/* Interactive SVG Radar Map Canvas */}
              <div className="relative flex-1 flex items-center justify-center my-2 select-none">
                <svg
                  viewBox="0 0 600 650"
                  className="w-full h-full max-h-[380px] object-contain"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.15))' }}
                >
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="attackArc" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* India Geospatial Stylized Boundary Silhouette */}
                  <path
                    d="M 220 70 L 250 110 L 230 150 L 260 170 L 210 200 L 170 240 L 130 300 L 150 360 L 180 420 L 190 480 L 230 570 L 260 620 L 270 590 L 280 500 L 330 430 L 410 330 L 480 300 L 530 260 L 500 240 L 450 250 L 380 270 L 320 220 L 280 180 L 240 120 Z"
                    fill="url(#mapGlow)"
                    stroke="#1e3a5f"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Animated Attack Syndicate Arc (Mewat/Jamtara -> Target Metros) */}
                  <path
                    d="M 340 280 Q 280 230 235 215"
                    fill="none"
                    stroke="url(#attackArc)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  <path
                    d="M 340 280 Q 250 360 185 420"
                    fill="none"
                    stroke="url(#attackArc)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  <path
                    d="M 340 280 Q 270 420 225 530"
                    fill="none"
                    stroke="url(#attackArc)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />

                  {/* Render Map Nodes */}
                  {filteredNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isCritical = node.threatLevel === 'CRITICAL' || node.threatLevel === 'EXTREME THREAT';
                    const nodeColor = isCritical ? '#ef4444' : '#06b6d4';

                    return (
                      <g
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer group"
                      >
                        {/* Outer Pulsing Wave */}
                        {isSelected && (
                          <circle
                            cx={node.mapX}
                            cy={node.mapY}
                            r="22"
                            fill="none"
                            stroke={nodeColor}
                            strokeWidth="1.5"
                            className="animate-ping opacity-60"
                          />
                        )}

                        {/* Radar Halo */}
                        <circle
                          cx={node.mapX}
                          cy={node.mapY}
                          r={isSelected ? '12' : '8'}
                          fill={isSelected ? `${nodeColor}40` : `${nodeColor}20`}
                          stroke={nodeColor}
                          strokeWidth={isSelected ? '2' : '1'}
                          className="transition-all duration-200"
                        />

                        {/* Center Dot */}
                        <circle
                          cx={node.mapX}
                          cy={node.mapY}
                          r="3.5"
                          fill={nodeColor}
                        />

                        {/* Pin City Label */}
                        <text
                          x={node.mapX + 10}
                          y={node.mapY + 4}
                          fill={isSelected ? '#ffffff' : '#94a3b8'}
                          fontSize={isSelected ? '11' : '9.5'}
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="transition-all pointer-events-none"
                        >
                          {isHindi ? (node.cityHi || node.city) : node.city}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Legend */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-[#1E2D4A]/50 pt-2 z-10 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Extreme Threat / Syndicate Hub</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>High Risk Vector</span>
                  </span>
                </div>
                <span className="font-mono text-cyan-400">Click node to inspect feature</span>
              </div>
            </div>

            {/* Right: Selected Scam Feature & Real-Time Intelligence Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#060a14] border-2 border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-3">
                {/* Feature Header */}
                <div className="border-b border-[#1E2D4A] pb-2.5">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[9px] border border-cyan-500/40">
                      {selectedNode.featureCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      selectedNode.threatLevel === 'EXTREME THREAT' || selectedNode.threatLevel === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    }`}>
                      {selectedNode.threatLevel} ({selectedNode.riskScore}%)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 leading-snug">
                    {isHindi ? (selectedNode.featureNameHi || selectedNode.featureName) : selectedNode.featureName}
                  </h3>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                    <MapPin size={11} className="text-cyan-400" />
                    <span>{isHindi ? (selectedNode.cityHi || selectedNode.city) : selectedNode.city}, {selectedNode.state}</span>
                  </div>
                </div>

                {/* Real-time Telemetry Stats Row */}
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2.5 bg-[#0D1527] border border-[#27395C] rounded-xl space-y-0.5">
                    <span className="text-[9.5px] text-[var(--text-muted)] uppercase block">Intercepted Today</span>
                    <span className="text-sm font-bold text-cyan-300 font-mono">{selectedNode.interceptedToday}</span>
                    <span className="text-[9px] text-emerald-400 block">✓ Real-time Neutralized</span>
                  </div>
                  <div className="p-2.5 bg-[#0D1527] border border-[#27395C] rounded-xl space-y-0.5">
                    <span className="text-[9.5px] text-[var(--text-muted)] uppercase block">Financial Loss Saved</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{selectedNode.fundsSaved}</span>
                    <span className="text-[9px] text-slate-400 block">1930 Helpline Blocked</span>
                  </div>
                </div>

                {/* Primary Attack Vector Description */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {isHindi ? 'धोखाधड़ी का तरीका (Attack Vector):' : 'Modus Operandi & Attack Vector:'}
                  </span>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans bg-[#0D1527] p-2.5 rounded-lg border border-[#1E2D4A]">
                    {isHindi ? (selectedNode.primaryVectorHi || selectedNode.primaryVector) : selectedNode.primaryVector}
                  </p>
                </div>

                {/* AI 48-Hour Predictive Vector Box */}
                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-400 animate-pulse" />
                      <span>{isHindi ? 'AI खतरा भविष्यवाणी (Next 48h)' : 'AI 48h Threat Prediction'}</span>
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-500/20 rounded text-[9px]">{selectedNode.prediction.surgeRisk}</span>
                  </div>
                  <p className="text-[10.5px] text-amber-200/90 leading-relaxed font-sans">
                    {isHindi ? (selectedNode.prediction.aiForecastHi || selectedNode.prediction.aiForecast) : selectedNode.prediction.aiForecast}
                  </p>
                </div>
              </div>

              {/* Action Buttons: 1930 & Advisory */}
              <div className="pt-2 border-t border-[#1E2D4A] space-y-2">
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 size={12} />
                  <span>{isHindi ? 'नागरिक सुरक्षा सलाह:' : 'Proactive Defense Action:'}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {selectedNode.prediction.preventionStep}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="tel:1930"
                    className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md text-center"
                  >
                    <PhoneCall size={13} />
                    <span>{isHindi ? '1930 पर तुरंत कॉल करें' : 'Call 1930 Helpline'}</span>
                  </a>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-[#131B2E] hover:bg-[#1E2D4A] border border-[#27395C] text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    <span>Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: AI PREDICTIVE THREAT FORECASTING VIEW ───────────────────── */}
        {activeTab === 'prediction' && (
          <div className="space-y-4 animate-fade-in">
            {/* Top Prediction Horizon Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-cyan-500/10 to-transparent border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                    {isHindi ? 'न्यूरल AI 48-घंटे का साइबर हमला पूर्वानुमान' : 'KAVACH Neural AI 48-Hour Cyber Threat Forecast'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {isHindi
                      ? 'मशीन लर्निंग मॉडल द्वारा देश भर में आने वाले संभावित साइबर हमलों का पहले से सटीक विश्लेषण'
                      : 'Predictive Heuristic Modeling Forecasting Emerging Attack Vectors Across Indian Demographics'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold">
                  96.8% FORECAST ACCURACY
                </span>
              </div>
            </div>

            {/* 3 Macro Predictive Vectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PREDICTIVE_AI_INSIGHTS.map((pred, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#060a14] border border-[#27395C] space-y-2.5 flex flex-col justify-between cyber-bracket hover:border-cyan-500/60 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] border border-amber-500/40">
                        {pred.badge}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">
                        {pred.horizon}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-100 leading-snug">
                      {isHindi ? pred.titleHi : pred.title}
                    </h4>

                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <MapPin size={10} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{pred.targetZones}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans pt-1">
                      {isHindi ? pred.descriptionHi : pred.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[var(--text-muted)]">Confidence:</span>
                    <span className="text-emerald-400 font-bold">{pred.probability}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* State Predictive Risk Heat Table */}
            <div className="p-4 bg-[#060a14] rounded-xl border border-[#27395C] space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <BarChart3 size={15} className="text-cyan-400" />
                  <span>{isHindi ? 'राज्यवार अनुमानित जोखिम रैंकिंग (अगले 7 दिन)' : 'State-wise Projected Vulnerability Ranking (Next 7 Days)'}</span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">Based on 92 VT Engines + I4C Feeds</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
                {SCAM_FEATURE_NODES.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-[#0D1527] border border-[#1E2D4A] space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-200">{n.city}</span>
                      <span className="text-rose-400 font-bold">{n.riskScore}%</span>
                    </div>
                    <div className="text-[10px] text-cyan-300 font-mono truncate">{n.featureCode}</div>
                    <div className="text-[9.5px] text-amber-300 font-bold">{n.prediction.surgeRisk}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
});

CyberThreatMapModal.displayName = 'CyberThreatMapModal';
export default CyberThreatMapModal;
