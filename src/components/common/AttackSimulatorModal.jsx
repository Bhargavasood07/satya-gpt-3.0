import React, { useState, useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert, Play, CheckCircle2, AlertTriangle, Zap, RefreshCw, X,
  Terminal, ShieldCheck, Flame, ArrowRight, Activity, Cpu, Sparkles,
  FileCheck, Copy, Download
} from 'lucide-react';

const SIMULATION_SCENARIOS = [
  {
    id: 'digi-arrest',
    vectorCode: 'VEC-SIM-ARREST-96',
    title: 'Digital Arrest Video Extortion',
    titleHi: 'डिजिटल अरेस्ट व फर्जी पुलिस वीडियो कॉल',
    category: 'Impersonation / Extortion',
    severity: 'CRITICAL',
    payload: 'skype://call?target=cbi-officer-delhi-fake&warrant_id=ED-2026-9901',
    description: 'Syndicate initiates Skype call with synthetic police station background, displaying fake CBI seal and forged Supreme Court arrest warrant.',
    descriptionHi: 'जालसाज फर्जी सीबीआई सील और सुप्रीम कोर्ट का नकली वारंट दिखाकर वीडियो कॉल पर धमकाने का प्रयास करता है।',
    layers: [
      { step: 1, name: 'Caller Domain & Protocol Inspection', detail: 'Flagged unverified WebRTC gateway routing through overseas proxy (IP: 185.220.101.4).', duration: 400 },
      { step: 2, name: 'Facial & Synthetic Backdrop Analysis', detail: 'Detected AI-generated uniform artifacting & deepfake frame jitter (Confidence: 98.4%).', duration: 600 },
      { step: 3, name: 'KAVACH Neural Law Enforcement Heuristic', detail: 'Indian Law Enforcement never issues warrants or conducts arrests via video call. Instant verdict: CRITICAL FRAUD.', duration: 500 },
      { step: 4, name: 'Real-Time Interception & Freeze Protocol', detail: 'Call stream terminated, 1930 Cyber Cell notification pre-drafted, and victim audio channel shielded.', duration: 400 }
    ],
    timeSaved: '₹85,00,000 Extortion Prevented',
    latencyMs: 14.2
  },
  {
    id: 'echallan-apk',
    vectorCode: 'VEC-SIM-APK-91',
    title: 'e-Challan Fake APK Trojan Dropper',
    titleHi: 'फर्जी ई-चालान APK मैलवेयर फ्रॉड',
    category: 'Trojan / Spyware',
    payload: 'https://parivahan-sewa-pay.xyz/dl/echallan-v4.apk (SHA: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)',
    description: 'Phishing SMS alerts victim to unpaid traffic violation with direct link downloading a malicious APK that intercepts SMS and banking OTPs.',
    descriptionHi: 'फर्जी ट्रैफिक चालान का झांसा देकर फोन में खतरनाक ऐप इंस्टॉल करवाकर बैंक के OTP चोरी करने की कोशिश।',
    layers: [
      { step: 1, name: 'Domain Typo-Squatting Check', detail: 'Matched domain "parivahan-sewa-pay.xyz" against official NIC whitelist (*.gov.in / *.nic.in). Domain age: 2 days.', duration: 400 },
      { step: 2, name: 'Manifest Permission Dissection', detail: 'APK requests READ_SMS, RECEIVE_SMS, and ACCESSIBILITY_SERVICE without legitimate transport credentials.', duration: 500 },
      { step: 3, name: '92-Engine VirusTotal Consensus', detail: '89 of 92 anti-malware engines flagged payload as Android.Trojan.BankBot.Intercept.', duration: 600 },
      { step: 4, name: 'Automated Quarantine & Payload Hash Lock', detail: 'Download blocked at socket layer, package signature blacklisted across fleet SOC.', duration: 400 }
    ],
    timeSaved: '₹3,50,000 Savings Drain Prevented',
    latencyMs: 12.8
  },
  {
    id: 'upi-deep-link',
    vectorCode: 'VEC-SIM-UPI-88',
    title: 'Malicious UPI Intent Injection',
    titleHi: 'फर्जी UPI कैशबैक रिवर्स पेमेंट फ्रॉड',
    category: 'UPI Debit Intent',
    payload: 'upi://pay?pa=cashback-rewards-gateway@ybl&pn=PhonePeRewards&am=49999&cu=INR&tn=Cashback%20Reward%20Refund',
    description: 'Scammer presents a QR or SMS claiming "Receive ₹49,999 Reward". The deep link actually executes a DEBIT request draining the user account.',
    descriptionHi: 'पैसे मिलने के बहाने फर्जी UPI लिंक भेजकर खाते से सीधे ₹49,999 डेबिट करने की साजिश।',
    layers: [
      { step: 1, name: 'UPI Intent URI Deconstruction', detail: 'Deconstructed query parameters: `am=49999` with reverse payment intent.', duration: 350 },
      { step: 2, name: 'VPA Merchant Registry Verification', detail: 'VPA "cashback-rewards-gateway@ybl" registered 14 hours ago; flagged in 42 prior citizen complaints.', duration: 450 },
      { step: 3, name: 'KAVACH Behavioral Rule Engine', detail: 'Rule #UPI-REV: UPI transactions NEVER require a PIN or authorization to RECEIVE money.', duration: 400 },
      { step: 4, name: 'Deep-Link Neutralization & NPCI Alert', detail: 'Deep-link execution aborted; simulated warning prompt rendered to block UPI PIN submission.', duration: 350 }
    ],
    timeSaved: '₹49,999 Immediate Loss Averted',
    latencyMs: 9.6
  },
  {
    id: 'sbi-phishing',
    vectorCode: 'VEC-SIM-BANK-94',
    title: 'SBI YONO KYC Reverse-Proxy Phishing',
    titleHi: 'एसबीआई योनो फर्जी KYC फिशिंग वेबसाइट',
    category: 'Credential Harvesting',
    payload: 'https://sbi-yono-kyc-update.live/auth/login.php',
    description: 'Pixel-perfect replica of SBI net-banking portal utilizing cloud reverse-proxies to capture user credentials and live 2FA tokens in real time.',
    descriptionHi: 'एसबीआई बैंक जैसी दिखने वाली हूबहू वेबसाइट बनाकर लॉगिन पासवर्ड और OTP चुराने का जाल।',
    layers: [
      { step: 1, name: 'DOM Visual & Asset Similarity Scan', detail: '99.2% visual cosine similarity with official onlinesbi.sbi, but hosted on uncertified offshore VPS.', duration: 450 },
      { step: 2, name: 'SSL Certificate & SAN Hierarchy Audit', detail: 'Issued by Let\'s Encrypt 6 hours ago; lacks EV-SSL extended validation credentials held by State Bank of India.', duration: 500 },
      { step: 3, name: 'Live Reverse-Proxy Sniffing', detail: 'Backend socket forwards intercepted keystrokes to Telegram Bot API endpoint in real-time.', duration: 550 },
      { step: 4, name: 'Browser DNS Sinkhole & Takedown Notice', detail: 'Injected anti-phishing banner; automated abuse takedown request dispatched to registrar.', duration: 400 }
    ],
    timeSaved: '₹14,20,000 Account Takeover Blocked',
    latencyMs: 15.1
  },
  {
    id: 'aeps-biometric',
    vectorCode: 'VEC-SIM-AEPS-85',
    title: 'Aadhaar AePS Biometric Bypass',
    titleHi: 'आधार बायोमेट्रिक क्लोनिंग माइक्रो-एटीएम फ्रॉड',
    category: 'Biometric Spoofing',
    payload: 'aeps://pos-terminal/debit?aadhaar=XXXX-XXXX-4912&device_id=MANTRA-CLONED-88',
    description: 'Attackers harvest silicon/gelatin fingerprint casts from land registry databases to attempt unauthorized AePS micro-ATM cash withdrawals.',
    descriptionHi: 'रजिस्ट्री दस्तावेजों से फिंगरप्रिंट की नकल बनाकर आधार के जरिए बैंक से पैसे निकालने का प्रयास।',
    layers: [
      { step: 1, name: 'Liveness & Pulse Waveform Check', detail: 'Optical ridge impedance anomaly detected: static pattern lacks sub-dermal hemoglobin pulse signature.', duration: 400 },
      { step: 2, name: 'Geo-Velocity Discrepancy Detection', detail: 'Cardholder mobile pinged in Pune while AePS request originated from micro-ATM in Jamtara (Speed: 1,840 km/h).', duration: 550 },
      { step: 3, name: 'UIDAI Lock-Status Heuristic', detail: 'Triggered UIDAI biometric lock protocol recommendation via mAadhaar gateway.', duration: 450 },
      { step: 4, name: 'Transaction Frozen & Instant SMS Dispatch', detail: 'Micro-ATM withdrawal request declined; emergency bank freeze instruction generated.', duration: 400 }
    ],
    timeSaved: '₹50,000 Micro-ATM Drain Blocked',
    latencyMs: 11.4
  }
];

const AttackSimulatorModal = memo(({ onClose, onOpenForensicCertificate }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [selectedScenario, setSelectedScenario] = useState(SIMULATION_SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const timerRef = useRef(null);

  const startSimulation = () => {
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentStep(1);
    setElapsedMs(0);

    const startTime = performance.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Math.round(performance.now() - startTime));
    }, 25);

    let accumTime = 0;
    selectedScenario.layers.forEach((layer, idx) => {
      accumTime += layer.duration;
      setTimeout(() => {
        setCurrentStep(idx + 1);
        if (idx === selectedScenario.layers.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setIsCompleted(true);
            if (timerRef.current) clearInterval(timerRef.current);
          }, 300);
        }
      }, accumTime);
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleScenarioChange = (scenario) => {
    if (isRunning) return;
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setIsCompleted(false);
    setElapsedMs(0);
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(selectedScenario.payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-[#060a14] border-2 border-rose-500/40 rounded-2xl shadow-[0_0_60px_rgba(244,63,94,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-rose-500/20 bg-rose-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Flame size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                  {isHindi ? 'लाइव जीरो-डे साइबर हमला सिम्युलेटर' : 'Live Zero-Day Cyber Attack Simulator'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  DEFENSE SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? 'रियल-टाइम में देखें कि SATYA-GPT का 4-स्तरीय AI डिफेंस सिंडिकेट के हमलों को 14ms में कैसे नाकाम करता है।'
                  : 'Experience how SATYA-GPT’s 4-layer neural defense neutralizes enterprise attacks in 14ms.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Attack Scenarios Selector */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>{isHindi ? '1. हमला वेक्टर चुनें' : '1. Select Live Threat Scenario'}</span>
              <span className="text-cyan-400 text-[10px]">{SIMULATION_SCENARIOS.length} Enterprise Vectors Loaded</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SIMULATION_SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  disabled={isRunning}
                  onClick={() => handleScenarioChange(scen)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedScenario.id === scen.id
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-slate-600 hover:text-slate-100'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-[9px] font-mono text-cyan-400 font-bold mb-1 truncate">
                    {scen.vectorCode}
                  </div>
                  <div className="text-xs font-bold line-clamp-2">
                    {isHindi ? scen.titleHi : scen.title}
                  </div>
                  <div className="mt-2 text-[9px] font-semibold text-rose-400 uppercase tracking-wider">
                    {scen.severity}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Active Scenario Details & Live Payload Card */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">
                  {isHindi ? selectedScenario.titleHi : selectedScenario.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {selectedScenario.category}
                </span>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>{selectedScenario.timeSaved}</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              {isHindi ? selectedScenario.descriptionHi : selectedScenario.description}
            </p>

            {/* Injected Payload Bar */}
            <div className="p-2 rounded-lg bg-[#040711] border border-[var(--border-subtle)] flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-rose-400 min-w-0 flex-1 truncate">
                <Terminal size={13} className="shrink-0" />
                <span className="font-mono truncate">{selectedScenario.payload}</span>
              </div>
              <button
                onClick={copyPayload}
                className="p-1 text-[var(--text-muted)] hover:text-cyan-400 shrink-0 cursor-pointer"
                title="Copy Payload"
              >
                {copiedPayload ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* 3. Real-Time Layered Defense Pipeline */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] flex items-center justify-between">
              <span>{isHindi ? '2. SATYA-GPT 4-स्तरीय सुरक्षा प्रणाली' : '2. SATYA-GPT 4-Layer Defense Protocol'}</span>
              <span className="font-mono text-cyan-400 text-[10px]">
                {isRunning ? `SCANNING ACTIVE (${elapsedMs}ms)` : isCompleted ? `BLOCKED IN ${selectedScenario.latencyMs}ms` : 'READY TO TRIGGER'}
              </span>
            </div>

            <div className="space-y-2">
              {selectedScenario.layers.map((layer, idx) => {
                const isStepActive = currentStep === layer.step;
                const isStepDone = currentStep > layer.step || isCompleted;

                return (
                  <motion.div
                    key={layer.step}
                    initial={{ opacity: 0.8 }}
                    animate={{
                      opacity: isStepDone || isStepActive ? 1 : 0.45,
                      borderColor: isStepActive ? 'rgba(0, 229, 255, 0.6)' : isStepDone ? 'rgba(16, 185, 129, 0.4)' : 'rgba(51, 65, 85, 0.4)'
                    }}
                    className={`p-3 rounded-xl border transition-all ${
                      isStepActive
                        ? 'bg-cyan-950/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : isStepDone
                        ? 'bg-emerald-950/20'
                        : 'bg-[#090e1a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isStepDone
                            ? 'bg-emerald-500 text-slate-950'
                            : isStepActive
                            ? 'bg-cyan-400 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isStepDone ? '✓' : layer.step}
                        </div>
                        <span className="text-xs font-bold text-slate-200">
                          {layer.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {isStepDone ? 'VERIFIED' : isStepActive ? 'ANALYZING...' : 'QUEUED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] pl-7">
                      {layer.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 4. Interception Banner when completed */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-emerald-300 flex items-center gap-2">
                      <span>THREAT NEUTRALIZED IN {selectedScenario.latencyMs}ms</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        99.8% CONFIDENCE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {selectedScenario.timeSaved} • Vector signature registered to global SOC fleet.
                    </p>
                  </div>
                </div>

                {onOpenForensicCertificate && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenForensicCertificate(selectedScenario);
                    }}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <FileCheck size={14} />
                    <span>{isHindi ? 'धारा 65B फॉरेंसिक रिपोर्ट जनरेट करें' : 'Generate Sec 65B FIR Certificate'}</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Activity size={14} className="text-rose-400" />
            <span>Target SLA: &lt; 20ms • Zero-Day Defense Integrity: 100%</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={startSimulation}
              disabled={isRunning}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-900/40'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{isHindi ? 'हमला सिम्युलेट हो रहा है...' : 'Neutralizing Vector...'}</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>{isHindi ? 'हमला सिम्युलेट करें' : 'Launch Attack Simulation'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

AttackSimulatorModal.displayName = 'AttackSimulatorModal';
export default AttackSimulatorModal;
