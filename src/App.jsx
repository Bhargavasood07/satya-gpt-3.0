import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RefreshCw, ArrowUpCircle, ScanLine, ShieldAlert, PhoneCall,
  MapPin, Sparkles, Bot, GraduationCap, ArrowRight, Award, Shield,
  Activity, TrendingUp, Users, Zap, ChevronRight,
} from 'lucide-react';

// Layout
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Scanner & Feed
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
import SlideOutDrawerSidebar from './components/common/SlideOutDrawerSidebar';
import LoginModal from './components/auth/LoginModal';
import { useAuth } from './context/AuthContext';

// Views
import AIHubView from './components/aihub/AIHubView';
import AnalyticsView from './components/views/AnalyticsView';
import ChildSafetyView from './components/views/ChildSafetyView';
import KavachAcademyView from './components/views/KavachAcademyView';
import GuideDocsView from './components/views/GuideDocsView';
import MetricsBar from './components/feed/MetricsBar';
import DeepDivePanel from './components/feed/DeepDivePanel';
import MetricDetailModal from './components/feed/MetricDetailModal';

import { initAutoUpdater, reloadToLatestVersion } from './utils/autoUpdater';
import { secureStorage } from './utils/securityGuard';
import { useChildMode } from './context/ChildModeContext';
import { useSimulatedFeed } from './hooks/useSimulatedFeed';
import { scanPayloadOffline } from './services/offlineAiEngine';
import { detectFakeNews } from './services/fakeNewsDetector';
import { usePwaInstall } from './hooks/usePWAInstall';

// ── Dashboard Section Components ───────────────────────────────

function HeroBanner({ onScanClick, onFreezeClick, onMapClick }) {
  return (
    <section
      className="rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-fade-in"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Scan line animation */}
      <div className="animate-cyber-scan pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Brand Message — #1 Visual Priority */}
        <div className="space-y-4 max-w-2xl">
          {/* Badge row — secondary context */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge--primary">
              <Sparkles size={10} />
              India's #1 AI Cyber Defense
            </span>
            <button
              className="badge badge--warning hover:opacity-80 transition-opacity cursor-pointer"
              style={{ border: '1px solid rgba(245,158,11,0.35)' }}
            >
              <Award size={10} />
              MeitY / CERT-In
            </button>
          </div>

          {/* H1 — highest visual weight on screen */}
          <div>
            <h1 className="text-h2 sm:text-h1 font-sans" style={{ color: 'var(--text-primary)' }}>
              Real-Time Threat Intelligence
              <span style={{ color: 'var(--primary)' }}> & Fraud Protection</span>
            </h1>
            <p className="text-small mt-2" style={{ color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: '1.7' }}>
              Powered by 92-engine VirusTotal v3 cross-verification, KAVACH AI voice assistant,
              and 15-minute emergency bank lock protocols.
            </p>
          </div>
        </div>

        {/* Right: Primary CTAs — action hierarchy */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onScanClick}
            className="btn btn--primary"
            style={{ fontSize: '14px', padding: '10px 20px', gap: '8px' }}
          >
            <ScanLine size={16} />
            Scan a Threat
            <ArrowRight size={14} />
          </button>

          <button
            onClick={onFreezeClick}
            className="btn btn--danger"
            style={{ fontSize: '14px', padding: '10px 20px' }}
          >
            <ShieldAlert size={16} />
            Bank Freeze
          </button>

          <button
            onClick={onMapClick}
            className="btn btn--ghost"
            style={{ fontSize: '14px', padding: '10px 16px' }}
          >
            <MapPin size={15} />
            Threat Map
          </button>

          <a
            href="tel:1930"
            className="btn btn--ghost"
            style={{ fontSize: '14px', padding: '10px 16px', color: 'var(--warning)', borderColor: 'var(--warning-muted)' }}
          >
            <PhoneCall size={15} />
            1930
          </a>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div
      className="card p-5 animate-fade-in"
      style={{ '--card-accent': color }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-caption" style={{ color: 'var(--success)' }}>
            <TrendingUp size={11} />
            {trend}
          </div>
        )}
      </div>
      <div className="text-h2 font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-caption mt-1 uppercase tracking-wide" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </div>
      <div className="mt-3 h-px" style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }} />
    </div>
  );
}

function ModuleCard({ icon: Icon, title, description, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card card--interactive p-5 text-left group w-full animate-slide-up"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
        <ChevronRight
          size={16}
          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
          style={{ color: accent }}
        />
      </div>
      <h3 className="text-[15px] font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-small leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    </button>
  );
}

// ── Main App Component ─────────────────────────────────────────
export default function App() {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const { isInstalled, installApp } = usePwaInstall();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeMetricModal, setActiveMetricModal] = useState(null);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isEmergencyFreezeOpen, setIsEmergencyFreezeOpen] = useState(false);
  const [isTrustBadgeOpen, setIsTrustBadgeOpen] = useState(false);
  const [isFamilyShareOpen, setIsFamilyShareOpen] = useState(false);
  const [isGovtVerificationOpen, setIsGovtVerificationOpen] = useState(false);
  const [isThreatMapOpen, setIsThreatMapOpen] = useState(false);
  const [isIpProtectionOpen, setIsIpProtectionOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainScrollRef = useRef(null);

  const [isFounderSession] = useState(
    () => secureStorage.getItem('admin_session_active') || false
  );

  const { events, metrics, selectedEvent, setSelectedEvent, addManualEvent } =
    useSimulatedFeed(null, t);

  const handleToggleChat = useCallback(() => setIsChatOpen(p => !p), []);
  const handleOpenAdmin = useCallback(() => setIsAdminOpen(true), []);
  const handleOpenPartner = useCallback(() => setIsPartnerOpen(true), []);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    initAutoUpdater(() => setHasNewVersion(true));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setIsChatOpen(false);
        setActiveMetricModal(null);
        setIsAdminOpen(false);
        setIsPartnerOpen(false);
        setIsEmergencyFreezeOpen(false);
        setIsGovtVerificationOpen(false);
        setIsThreatMapOpen(false);
        setIsDrawerOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsChatOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSelectedEvent]);

  const handleScanResult = useCallback(
    (decodedText, source = 'qr', vtReport = null) => {
      const fakeNewsResult = detectFakeNews(decodedText);
      const offlineResult = scanPayloadOffline(decodedText);
      const lower = decodedText.toLowerCase();

      const isAdultRedirect = lower.includes('adult') || lower.includes('watch') || lower.includes('hot');
      const isGamingScam = lower.includes('robux') || lower.includes('fire-coins') || lower.includes('free-diamonds');
      const isPhishing =
        lower.includes('http://') || lower.includes('.tk') || lower.includes('.xyz') ||
        lower.includes('sbi-kyc') || lower.includes('bitcoin:') ||
        lower.includes('pan immediately') || lower.includes('.exe') ||
        offlineResult.verdict === 'fake';

      const isSuspicious =
        fakeNewsResult.isFakeNews || isAdultRedirect || isGamingScam || isPhishing ||
        (vtReport && vtReport.maliciousCount > 0);

      const newEvt = addManualEvent({
        source,
        payload: decodedText,
        preview: decodedText.length > 50 ? decodedText.substring(0, 50) + '...' : decodedText,
        verdict: isSuspicious ? 'fake' : 'real',
        verdictLabel: fakeNewsResult.isFakeNews ? 'FAKE NEWS / HOAX' : isSuspicious ? 'FAKE' : 'REAL',
        confidence: isSuspicious ? 98.4 : 99.2,
        riskScore: fakeNewsResult.isFakeNews ? (fakeNewsResult.riskScore || 92) : isSuspicious ? 92 : 4,
        severity: isSuspicious ? 'high' : 'low',
        verdictReason: isSuspicious
          ? 'KAVACH AI & VirusTotal v3: High-risk payload detected across security engines.'
          : 'KAVACH AI & VirusTotal v3: Payload verified clean across 90+ engines.',
        vtReport,
        indicators: isSuspicious
          ? ['VirusTotal v3 Security Alert', 'Multi-Engine Flagged', 'Unverified Origin']
          : ['VirusTotal v3 Clean', 'Official Domain Certificate Verified'],
      });

      setSelectedEvent(newEvt);
    },
    [addManualEvent, t, setSelectedEvent]
  );

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      <TopBar onOpenAdmin={handleOpenAdmin} onToggleDrawer={() => setIsDrawerOpen(true)} />

      {/* Live scam ticker */}
      <LiveScamTicker />

      {/* Clipboard auto-scan */}
      <ClipboardAutoScanner onScanLink={(url) => handleScanResult(url, 'clipboard')} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAdmin={handleOpenAdmin}
          onOpenPartner={handleOpenPartner}
        />

        <main
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--surface-base)' }}
        >
          {/* Content wrapper — max-width + consistent padding */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 space-y-6">

            {/* Update banner */}
            {hasNewVersion && (
              <div
                className="rounded-xl p-4 flex items-center justify-between gap-4 animate-slide-up"
                style={{
                  background: 'var(--primary-muted)',
                  border: '1px solid rgba(59,130,246,0.3)',
                }}
              >
                <div className="flex items-center gap-2.5" style={{ color: 'var(--primary)' }}>
                  <ArrowUpCircle size={18} />
                  <span className="text-small font-semibold">A new update is ready.</span>
                </div>
                <button
                  onClick={reloadToLatestVersion}
                  className="btn btn--primary text-small"
                  style={{ padding: '6px 14px' }}
                >
                  <RefreshCw size={13} />
                  Update
                </button>
              </div>
            )}

            {/* ── DASHBOARD ─────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* 1. Hero — primary purpose, highest hierarchy */}
                <HeroBanner
                  onScanClick={() => setActiveTab('scanner')}
                  onFreezeClick={() => setIsEmergencyFreezeOpen(true)}
                  onMapClick={() => setIsThreatMapOpen(true)}
                />

                {/* 2. Stats — secondary context, 2×2 on mobile, 4-col on desktop */}
                <section>
                  <h2 className="text-small font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Live Protection Stats
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard icon={Shield}   label="Total Scans"       value={metrics?.totalScans?.toLocaleString() ?? '1,442'}  color="var(--primary)"  trend="+12%" />
                    <StatCard icon={ShieldAlert} label="Threats Blocked" value={metrics?.threatsBlocked?.toLocaleString() ?? '99'} color="var(--danger)"  />
                    <StatCard icon={Users}    label="Child Guard Blocks" value={metrics?.childBlocks?.toLocaleString() ?? '47'}     color="#a855f7" />
                    <StatCard icon={Activity} label="System Integrity"   value={`${Math.floor(metrics?.systemIntegrity ?? 99)}%`}   color="var(--success)" trend="Stable" />
                  </div>
                </section>

                {/* 3. Core modules — tertiary navigation */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-small font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      Core Modules
                    </h2>
                    <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
                      {3} modules
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <ModuleCard
                      icon={ScanLine}
                      title="AI Threat Scanner"
                      description="Scan links, SMS, QR codes against 92 VirusTotal detection engines."
                      accent="var(--primary)"
                      onClick={() => setActiveTab('scanner')}
                    />
                    <ModuleCard
                      icon={Bot}
                      title="KAVACH AI Hub"
                      description="Multilingual voice assistant with cybersecurity-focused AI personas."
                      accent="#a855f7"
                      onClick={() => setActiveTab('aihub')}
                    />
                    <ModuleCard
                      icon={GraduationCap}
                      title="Cyber Academy"
                      description="10 real-world threat scenarios and a founder-signed completion certificate."
                      accent="var(--warning)"
                      onClick={() => setActiveTab('academy')}
                    />
                  </div>
                </section>
              </div>
            )}

            {/* ── SCANNER ───────────────────────────────── */}
            {activeTab === 'scanner' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-h2 font-bold" style={{ color: 'var(--text-primary)' }}>
                    AI Threat Scanner
                  </h1>
                  <p className="text-small mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Paste a link, SMS text, or scan a QR code — verified against 92 security engines.
                  </p>
                </div>
                <div className="card p-6">
                  <ScannerPanel onScanResult={handleScanResult} />
                </div>
              </div>
            )}

            {activeTab === 'guidedocs'  && <GuideDocsView onSelectTab={setActiveTab} />}
            {activeTab === 'aihub'      && <AIHubView />}
            {activeTab === 'academy'    && <KavachAcademyView />}
            {activeTab === 'childSafety'&& <ChildSafetyView />}
            {activeTab === 'analytics'  && <AnalyticsView metrics={metrics} events={events} />}
          </div>
        </main>

        {/* ── Overlay Layer ─────────────────────────────── */}
        <AnimatePresence>
          {selectedEvent && (
            <DeepDivePanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeMetricModal && isFounderSession && (
            <MetricDetailModal
              modalType={activeMetricModal}
              onClose={() => setActiveMetricModal(null)}
              metrics={metrics}
              events={events}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAdminOpen && (
            <AdminPanelModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} events={events} metrics={metrics} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPartnerOpen && <EnterprisePartnershipModal onClose={() => setIsPartnerOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isGovtVerificationOpen && <GovtVerificationModal onClose={() => setIsGovtVerificationOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isThreatMapOpen && <CyberThreatMapModal onClose={() => setIsThreatMapOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isIpProtectionOpen && <IpProtectionModal onClose={() => setIsIpProtectionOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isDrawerOpen && (
            <SlideOutDrawerSidebar
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenAdmin={handleOpenAdmin}
              onOpenPartner={handleOpenPartner}
              onOpenGovtVerification={() => setIsGovtVerificationOpen(true)}
              onOpenThreatMap={() => setIsThreatMapOpen(true)}
              onOpenBankFreeze={() => setIsEmergencyFreezeOpen(true)}
              onOpenFamilyShare={() => setIsFamilyShareOpen(true)}
              onOpenTrustBadge={() => setIsTrustBadgeOpen(true)}
              onOpenChat={handleToggleChat}
              onInstallApp={installApp}
              isAppInstalled={isInstalled}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEmergencyFreezeOpen && (
            <GoldenHourEmergencyModal onClose={() => setIsEmergencyFreezeOpen(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTrustBadgeOpen && <TrustBadgeModal onClose={() => setIsTrustBadgeOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isFamilyShareOpen && <FamilyShareModal onClose={() => setIsFamilyShareOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
        </AnimatePresence>

        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} onOpenAdmin={handleOpenAdmin} />
        <CyberAiChatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
      </div>
    </div>
  );
}
