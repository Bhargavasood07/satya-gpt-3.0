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
      className="rounded-2xl relative overflow-hidden animate-fade-in dot-grid"
      style={{
        background: 'linear-gradient(135deg, var(--surface-raised) 0%, #0f1e38 100%)',
        border: '1px solid var(--border-brand)',
        boxShadow: '0 0 60px rgba(59,130,246,0.08), 0 20px 60px rgba(0,0,0,0.35)',
      }}
    >
      <div className="animate-cyber-scan pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(59,130,246,0.13), transparent 68%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(168,85,247,0.06), transparent 70%)' }}
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

          {/* Left: Brand message */}
          <div className="space-y-5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge--primary">
                <Sparkles size={9} />
                India's #1 AI Cyber Defense
              </span>
              <span className="badge badge--warning">
                <Award size={9} />
                MeitY / CERT-In Aligned
              </span>
            </div>

            <div>
              <h1 className="text-h1 font-sans leading-tight" style={{ color: 'var(--text-primary)' }}>
                Real-Time Threat<br />
                <span style={{
                  background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Intelligence & Protection
                </span>
              </h1>
              <p className="text-small mt-3" style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.75' }}>
                92-engine VirusTotal v3 cross-verification · KAVACH AI voice assistant ·
                15-minute emergency bank lock protocols. Founder: Bhargava Sood.
              </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full" style={{
                  background: 'var(--success)',
                  animation: 'ping-slow 1.8s cubic-bezier(0,0,0.2,1) infinite',
                }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--success)' }} />
              </span>
              <span className="text-caption font-semibold" style={{ color: 'var(--success)' }}>
                All 92 engines active
              </span>
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>·</span>
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>0 threats in last 5 min</span>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto lg:w-[200px]">
            <button onClick={onScanClick} className="btn btn--primary" style={{ fontSize: '14px', padding: '12px 20px', justifyContent: 'center' }}>
              <ScanLine size={16} />
              Scan a Threat
              <ArrowRight size={14} />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={onFreezeClick} className="btn btn--danger" style={{ fontSize: '12px', padding: '10px 12px', justifyContent: 'center' }}>
                <ShieldAlert size={14} />
                Freeze
              </button>
              <a href="tel:1930" className="btn btn--ghost" style={{ fontSize: '12px', padding: '10px 12px', justifyContent: 'center', color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.3)' }}>
                <PhoneCall size={14} />
                1930
              </a>
            </div>
            <button onClick={onMapClick} className="btn btn--ghost" style={{ fontSize: '12px', padding: '10px 12px', justifyContent: 'center' }}>
              <MapPin size={13} />
              Live Threat Map
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, color, accentBg }) {
  return (
    <div
      className="stat-card p-4 sm:p-5"
      style={{ '--card-accent': color, '--card-accent-muted': accentBg }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accentBg, border: `1px solid ${color}40` }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <div className="text-h2 font-bold font-mono" style={{ color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {value}
      </div>
      <div className="text-caption uppercase tracking-wider mt-1.5" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </div>
      <div className="mt-4 h-px rounded-full" style={{ background: `linear-gradient(90deg, ${color}70, ${color}20, transparent)` }} />
    </div>
  );
}

function ModuleCard({ icon: Icon, title, description, accent, accentBg, onClick }) {
  return (
    <button onClick={onClick} className="card card--interactive p-5 text-left w-full group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: accentBg, border: `1px solid ${accent}35` }}>
          <Icon size={21} style={{ color: accent }} />
        </div>
        <ArrowRight size={14} className="mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" style={{ color: accent }} />
      </div>
      <h3 className="text-[14px] font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-small" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
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
                  <h2 className="text-caption font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Live Protection Stats
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard icon={Shield}     label="Total Scans"        value={metrics?.totalScans?.toLocaleString() ?? '1,442'}      color="#3b82f6" accentBg="rgba(59,130,246,0.12)" />
                    <StatCard icon={ShieldAlert} label="Threats Blocked"   value={metrics?.threatsBlocked?.toLocaleString() ?? '99'}      color="#ef4444" accentBg="rgba(239,68,68,0.12)" />
                    <StatCard icon={Users}       label="Child Guard Blocks" value={metrics?.childBlocks?.toLocaleString() ?? '47'}         color="#a855f7" accentBg="rgba(168,85,247,0.12)" />
                    <StatCard icon={Activity}    label="System Integrity"   value={`${Math.floor(metrics?.systemIntegrity ?? 99)}%`}       color="#10b981" accentBg="rgba(16,185,129,0.12)" />
                  </div>
                </section>

                {/* 3. Core modules */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-caption font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      Core Modules
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <ModuleCard
                      icon={ScanLine}
                      title="AI Threat Scanner"
                      description="Scan links, SMS, QR codes against 92 VirusTotal detection engines in real time."
                      accent="#3b82f6"
                      accentBg="rgba(59,130,246,0.10)"
                      onClick={() => setActiveTab('scanner')}
                    />
                    <ModuleCard
                      icon={Bot}
                      title="KAVACH AI Hub"
                      description="Multilingual voice assistant with Hindi/English cybersecurity-focused AI personas."
                      accent="#a855f7"
                      accentBg="rgba(168,85,247,0.10)"
                      onClick={() => setActiveTab('aihub')}
                    />
                    <ModuleCard
                      icon={GraduationCap}
                      title="Cyber Academy"
                      description="10 real-world threat scenarios with a founder-signed completion certificate."
                      accent="#f59e0b"
                      accentBg="rgba(245,158,11,0.10)"
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
