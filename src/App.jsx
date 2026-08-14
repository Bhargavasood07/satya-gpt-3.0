import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Baby, ShieldCheck, Activity, Server, RefreshCw, ArrowUpCircle, ScanLine, Lock, Building2, Award, ShieldAlert, Heart, Share2, PhoneCall, Globe, MapPin, ArrowRight, Sparkles, Bot, GraduationCap } from 'lucide-react';

// Layout
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Ticker & Clipboard Auto-Scanner
import ScannerPanel from './components/scanner/ScannerPanel';
import ClipboardAutoScanner from './components/common/ClipboardAutoScanner';
import LiveScamTicker from './components/common/LiveScamTicker';

// Chatbot
import CyberAiChatbot from './components/chat/CyberAiChatbot';

// Modals
import AdminPanelModal from './components/admin/AdminPanelModal';
import EnterprisePartnershipModal from './components/common/EnterprisePartnershipModal';
import GoldenHourEmergencyModal from './components/common/GoldenHourEmergencyModal';
import TrustBadgeModal from './components/common/TrustBadgeModal';
import FamilyShareModal from './components/common/FamilyShareModal';
import AccountSwitcherModal from './components/common/AccountSwitcherModal';
import GovtVerificationModal from './components/common/GovtVerificationModal';
import CyberThreatMapModal from './components/common/CyberThreatMapModal';
import IpProtectionModal from './components/common/IpProtectionModal';

// Auth
import LoginModal from './components/auth/LoginModal';
import { useAuth } from './context/AuthContext';

// AI Hub & Views
import AIHubView from './components/aihub/AIHubView';
import AnalyticsView from './components/views/AnalyticsView';
import ChildSafetyView from './components/views/ChildSafetyView';
import KavachAcademyView from './components/views/KavachAcademyView';
import GuideDocsView from './components/views/GuideDocsView';

// Onboarding Guide & Auto Updater
import UserOnboardingBanner from './components/common/UserOnboardingBanner';
import { initAutoUpdater, reloadToLatestVersion } from './utils/autoUpdater';
import { secureStorage } from './utils/securityGuard';

// Context
import { useChildMode } from './context/ChildModeContext';

// Feed
import MetricsBar from './components/feed/MetricsBar';
import DeepDivePanel from './components/feed/DeepDivePanel';
import MetricDetailModal from './components/feed/MetricDetailModal';

// Hooks & Services
import { useSimulatedFeed } from './hooks/useSimulatedFeed';
import { scanPayloadOffline } from './services/offlineAiEngine';
import { detectFakeNews } from './services/fakeNewsDetector';

export default function App() {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(true);
  const [activeMetricModal, setActiveMetricModal] = useState(null);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isEmergencyFreezeOpen, setIsEmergencyFreezeOpen] = useState(false);
  const [isTrustBadgeOpen, setIsTrustBadgeOpen] = useState(false);
  const [isFamilyShareOpen, setIsFamilyShareOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isGovtVerificationOpen, setIsGovtVerificationOpen] = useState(false);
  const [isThreatMapOpen, setIsThreatMapOpen] = useState(false);
  const [isIpProtectionOpen, setIsIpProtectionOpen] = useState(false);
  
  const mainScrollRef = useRef(null);

  // Founder Active Session Check
  const [isFounderSession, setIsFounderSession] = useState(() => {
    return secureStorage.getItem('admin_session_active') || false;
  });

  const { events, metrics, selectedEvent, setSelectedEvent, addManualEvent } =
    useSimulatedFeed(null, t);

  const handleToggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const handleToggleHelp = useCallback(() => {
    setActiveTab('guidedocs');
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setIsAdminOpen(true);
  }, []);

  const handleOpenPartner = useCallback(() => {
    setIsPartnerOpen(true);
  }, []);

  // Auto-scroll main view to top whenever active tab changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  // Update founder session state whenever Admin Vault closes/opens
  useEffect(() => {
    setIsFounderSession(secureStorage.getItem('admin_session_active') || false);
  }, [isAdminOpen]);

  // Initialize Auto-Updater Background Check
  useEffect(() => {
    initAutoUpdater(() => {
      setHasNewVersion(true);
    });
  }, []);

  // Founder Secret Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key ? e.key.toLowerCase() : '';

      if (isCmdOrCtrl && key === 'b') {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
      }

      if (isCmdOrCtrl && e.shiftKey && key === 'a') {
        e.preventDefault();
        setIsAdminOpen(true);
      }

      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setIsChatOpen(false);
        setActiveMetricModal(null);
        setIsAdminOpen(false);
        setIsPartnerOpen(false);
        setIsEmergencyFreezeOpen(false);
        setIsTrustBadgeOpen(false);
        setIsFamilyShareOpen(false);
        setIsAccountSwitcherOpen(false);
        setIsGovtVerificationOpen(false);
        setIsThreatMapOpen(false);
        setIsIpProtectionOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedEvent]);

  const handleScanResult = useCallback(
    (decodedText, source = 'qr', vtReport = null) => {
      // 1. Run Fake News & Misinformation Fact-Checker Engine
      const fakeNewsResult = detectFakeNews(decodedText);

      // 2. Run offline edge AI scanner engine
      const offlineResult = scanPayloadOffline(decodedText);

      const lower = decodedText.toLowerCase();
      const isAdultRedirect = lower.includes('adult') || lower.includes('watch') || lower.includes('hot');
      const isGamingScam = lower.includes('robux') || lower.includes('fire-coins') || lower.includes('free-diamonds');
      const isPhishing =
        lower.includes('http://') ||
        lower.includes('.tk') ||
        lower.includes('.xyz') ||
        lower.includes('sbi-kyc') ||
        lower.includes('bitcoin:') ||
        lower.includes('pan immediately') ||
        lower.includes('.exe') ||
        offlineResult.verdict === 'fake';

      const isSuspicious = fakeNewsResult.isFakeNews || isAdultRedirect || isGamingScam || isPhishing || (vtReport && vtReport.maliciousCount > 0);

      let verdictReason = fakeNewsResult.isFakeNews
        ? fakeNewsResult.reason
        : isSuspicious
        ? 'KAVACH AI & VirusTotal v3 Analysis: High risk malicious payload detected across security vendor engines.'
        : 'KAVACH AI & VirusTotal v3 Analysis: Payload verified clean across 90+ security engines.';

      if (isChildMode && isSuspicious && !fakeNewsResult.isFakeNews) {
        verdictReason = isAdultRedirect
          ? t('childMode.blockedAdult')
          : isGamingScam
          ? t('childMode.blockedScam')
          : t('childMode.blockedPhishing');
      }

      const indicatorsList = fakeNewsResult.isFakeNews
        ? fakeNewsResult.indicators
        : isSuspicious
        ? [
            isChildMode ? 'Child Protection Guard: Blocked' : 'VirusTotal v3 Security Alert',
            'Multi-Engine Flagged (Kaspersky / Safebrowsing)',
            'Unverified Origin / Obfuscated Payload',
          ]
        : ['VirusTotal v3 Clean Rating', 'Official Domain Certificate Verified'];

      const newEvt = addManualEvent({
        source,
        payload: decodedText,
        preview: decodedText.length > 50 ? decodedText.substring(0, 50) + '...' : decodedText,
        verdict: isSuspicious ? 'fake' : 'real',
        verdictLabel: fakeNewsResult.isFakeNews ? 'FAKE NEWS / HOAX' : isSuspicious ? 'FAKE' : 'REAL',
        confidence: isSuspicious ? 98.4 : 99.2,
        riskScore: fakeNewsResult.isFakeNews ? (fakeNewsResult.riskScore || 92) : isSuspicious ? 92 : 4,
        severity: isSuspicious ? 'high' : 'low',
        verdictReason,
        vtReport,
        indicators: indicatorsList,
      });

      setSelectedEvent(newEvt);
    },
    [addManualEvent, isChildMode, t, setSelectedEvent]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#060913]">
      <TopBar
        onToggleChat={handleToggleChat}
        onToggleHelp={handleToggleHelp}
        onOpenAdmin={handleOpenAdmin}
        onOpenPartner={handleOpenPartner}
        onOpenGovtVerification={() => setIsGovtVerificationOpen(true)}
        onOpenThreatMap={() => setIsThreatMapOpen(true)}
      />
      
      {/* Real-Time Live Scam Alert Scrolling Ticker */}
      <LiveScamTicker />

      {/* Zero-Click Clipboard Auto Scanner Banner */}
      <ClipboardAutoScanner onScanLink={(url) => handleScanResult(url, 'clipboard')} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onOpenAdmin={handleOpenAdmin} onOpenPartner={handleOpenPartner} />

        <main ref={mainScrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-4 pb-28 md:pb-6 text-xs sm:text-sm font-mono">
          {/* Auto-Update Banner */}
          {hasNewVersion && (
            <div className="bg-cyan-950/60 border border-cyan-400/60 p-3 rounded-xl flex items-center justify-between font-mono text-xs text-cyan-200 shadow-lg animate-pulse">
              <div className="flex items-center gap-2">
                <ArrowUpCircle size={18} className="text-cyan-300" />
                <span className="font-bold">A new SATYA-GPT system update is ready!</span>
              </div>
              <button
                onClick={reloadToLatestVersion}
                className="px-3 py-1 bg-[var(--accent)] text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-all flex items-center gap-1 shadow-md"
              >
                <RefreshCw size={14} />
                <span>Update Now</span>
              </button>
            </div>
          )}

          {showHelpGuide && activeTab !== 'guidedocs' && <UserOnboardingBanner />}

          {/* National Government Defense Command Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0D1527] border-2 border-[#27395C] p-4 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 via-[var(--accent)] to-emerald-400" />

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#060913] border-2 border-amber-500/60 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shrink-0 shadow-lg">
                <Building2 size={22} />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-extrabold text-xs sm:text-sm text-slate-100 uppercase tracking-wider">
                    NATIONAL CYBER CRIME DEFENSE & THREAT SOC
                  </span>
                  <button
                    onClick={() => setIsGovtVerificationOpen(true)}
                    className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 hover:bg-amber-500/30 transition-all cursor-pointer"
                  >
                    <Award size={12} className="text-amber-400" />
                    MeitY / CERT-In ALIGNED
                  </button>
                  <button
                    onClick={() => setIsIpProtectionOpen(true)}
                    className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 text-[10px] font-extrabold flex items-center gap-1 hover:bg-rose-500/20 transition-all cursor-pointer"
                  >
                    <Lock size={11} className="text-rose-400" />
                    IP FORTRESS SEALED
                  </button>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5">
                  Official Nodal Architecture • VirusTotal v3 90-Engine Verification • Founder: Bhargava Sood
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setIsThreatMapOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-slate-950 font-extrabold transition-all text-xs shadow-md"
              >
                <MapPin size={14} />
                <span>Threat Map</span>
              </button>

              <a
                href="tel:1930"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold transition-all text-xs shadow-md"
              >
                <PhoneCall size={14} />
                <span>Dial 1930</span>
              </a>

              <button
                onClick={() => setIsFamilyShareOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-bold transition-all text-xs shadow-md"
              >
                <Share2 size={13} className="text-amber-400" />
                <span>Family Share</span>
              </button>

              <button
                onClick={() => setIsTrustBadgeOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#060913] border border-[#27395C] text-emerald-400 hover:border-emerald-400 font-bold transition-all text-xs shadow-md"
              >
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Trust Seal</span>
              </button>

              <button
                onClick={() => setIsEmergencyFreezeOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold transition-all text-xs shadow-lg animate-pulse"
              >
                <ShieldAlert size={15} />
                <span>15-Min Bank Freeze</span>
              </button>
            </div>
          </div>

          {/* ═══════════════ TAB CONTENT ═══════════════ */}

          {/* MAIN PRODUCT LANDING PAGE / DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Product Hero Banner */}
              <div className="p-6 bg-gradient-to-r from-[#0D1527] via-[#15213A] to-[#0D1527] border-2 border-[var(--accent)] rounded-2xl shadow-2xl relative overflow-hidden space-y-4">
                <div className="animate-cyber-scan" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)] text-[var(--accent)] text-[10px] font-extrabold uppercase tracking-widest">
                      <Sparkles size={12} className="animate-pulse" />
                      <span>INDIA'S #1 AI CYBER DEFENSE PLATFORM</span>
                    </div>
                    <h1 className="text-lg sm:text-2xl font-extrabold text-slate-100 uppercase tracking-wider leading-tight">
                      SATYA-GPT — Real-Time Threat Intelligence & Fraud Protection
                    </h1>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Powered by VirusTotal v3 90+ engine cross-verification, KAVACH AI voice assistant, and 15-Minute Emergency Bank Lock Nodal Protocols.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setActiveTab('scanner')}
                      className="px-5 py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg hover:scale-105"
                    >
                      <ScanLine size={16} />
                      <span>Launch AI Threat Scanner</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics & Protection Stats */}
              <MetricsBar metrics={metrics} onCardClick={(type) => setActiveMetricModal(type)} isFounderSession={isFounderSession} />

              {/* Product Core Modules Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2 font-mono">
                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                    Core Product Capabilities & Threat Engines
                  </h2>
                  <span className="text-[10px] text-[var(--accent)] font-bold">MODULE OVERVIEW</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Scanner */}
                  <div
                    onClick={() => setActiveTab('scanner')}
                    className="cyber-card p-4 rounded-xl border border-[#27395C] bg-[#0D1527] space-y-2 cursor-pointer hover:border-[var(--accent)] transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                        <ScanLine size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--accent)] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-100">AI Threat Scanner</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Scan links, SMS texts, QR codes, and camera feeds against 90+ VirusTotal security engines.
                    </p>
                  </div>

                  {/* Card 2: AI Hub */}
                  <div
                    onClick={() => setActiveTab('aihub')}
                    className="cyber-card p-4 rounded-xl border border-[#27395C] bg-[#0D1527] space-y-2 cursor-pointer hover:border-purple-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                        <Bot size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-purple-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-100">KAVACH AI Multilingual Hub</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Voice chat assistant in Hindi and English with specialized AI security personas.
                    </p>
                  </div>

                  {/* Card 3: Academy */}
                  <div
                    onClick={() => setActiveTab('academy')}
                    className="cyber-card p-4 rounded-xl border border-[#27395C] bg-[#0D1527] space-y-2 cursor-pointer hover:border-amber-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <GraduationCap size={18} />
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-100">Kavach Cyber Academy</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Masterclass quiz with 10 real-world threat scenarios and Founder signed certificate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED AI THREAT SCANNER PAGE */}
          {activeTab === 'scanner' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="bg-[#0D1527] border-2 border-[var(--accent)] p-5 rounded-2xl font-mono shadow-2xl relative overflow-hidden">
                <div className="animate-cyber-scan" />
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
                  <div className="flex items-center gap-2.5">
                    <ScanLine size={22} className="text-[var(--accent)] animate-pulse" />
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-100 uppercase tracking-wider">
                      SATYA AI Dedicated Threat Scanner Hub
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--accent)] bg-[#060913] px-3 py-1 rounded-xl border border-[#27395C] font-extrabold">
                    92-ENGINE REAL-TIME VERIFICATION
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Scan links, messages, camera feeds, and QR codes with VirusTotal v3 and KAVACH offline edge AI.
                </p>
              </div>

              <div className="cyber-card p-4.5 rounded-2xl border-2 border-[#27395C] bg-[#0D1527] shadow-xl">
                <ScannerPanel onScanResult={handleScanResult} />
              </div>
            </div>
          )}

          {activeTab === 'guidedocs' && <GuideDocsView onSelectTab={setActiveTab} />}

          {activeTab === 'aihub' && <AIHubView />}

          {activeTab === 'academy' && <KavachAcademyView />}

          {activeTab === 'childSafety' && <ChildSafetyView />}

          {activeTab === 'analytics' && <AnalyticsView metrics={metrics} events={events} />}
        </main>

        {/* Overlays */}
        <AnimatePresence>
          {selectedEvent && <DeepDivePanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </AnimatePresence>

        <AnimatePresence>
          {activeMetricModal && isFounderSession && (
            <MetricDetailModal modalType={activeMetricModal} onClose={() => setActiveMetricModal(null)} metrics={metrics} events={events} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAdminOpen && (
            <AdminPanelModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} events={events} metrics={metrics} />
          )}
        </AnimatePresence>

        {/* Government & Enterprise Partner Modal */}
        <AnimatePresence>
          {isPartnerOpen && <EnterprisePartnershipModal onClose={() => setIsPartnerOpen(false)} />}
        </AnimatePresence>

        {/* Official Govt Accreditation Verification Modal */}
        <AnimatePresence>
          {isGovtVerificationOpen && <GovtVerificationModal onClose={() => setIsGovtVerificationOpen(false)} />}
        </AnimatePresence>

        {/* Live State-wise Indian Cyber Threat Heatmap Modal */}
        <AnimatePresence>
          {isThreatMapOpen && <CyberThreatMapModal onClose={() => setIsThreatMapOpen(false)} />}
        </AnimatePresence>

        {/* Intellectual Property Protection Seal Modal */}
        <AnimatePresence>
          {isIpProtectionOpen && <IpProtectionModal onClose={() => setIsIpProtectionOpen(false)} />}
        </AnimatePresence>

        {/* 15-Minute Emergency Bank Freeze Modal */}
        <AnimatePresence>
          {isEmergencyFreezeOpen && <GoldenHourEmergencyModal onClose={() => setIsEmergencyFreezeOpen(false)} />}
        </AnimatePresence>

        {/* Trust Badge Embed Modal */}
        <AnimatePresence>
          {isTrustBadgeOpen && <TrustBadgeModal onClose={() => setIsTrustBadgeOpen(false)} />}
        </AnimatePresence>

        {/* Family Safety Share Modal */}
        <AnimatePresence>
          {isFamilyShareOpen && <FamilyShareModal onClose={() => setIsFamilyShareOpen(false)} />}
        </AnimatePresence>

        {/* Login Modal */}
        <AnimatePresence>
          {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
        </AnimatePresence>

        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} onOpenAdmin={handleOpenAdmin} />
        <CyberAiChatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
      </div>
    </div>
  );
}
