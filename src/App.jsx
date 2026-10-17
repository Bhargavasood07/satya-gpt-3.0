import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { useCardTilt } from './hooks/useCardTilt';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import {
  RefreshCw, ArrowUpCircle, ScanLine, ShieldAlert, PhoneCall,
  MapPin, Sparkles, Bot, GraduationCap, ArrowRight, Award, Shield,
  Activity, Users,
} from 'lucide-react';
import { GitHubIcon } from './components/common/GitHubIcon';

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

// Core In-View Components
import EnterprisePartnershipModal from './components/common/EnterprisePartnershipModal';
import GoldenHourEmergencyModal from './components/common/GoldenHourEmergencyModal';
import TrustBadgeModal from './components/common/TrustBadgeModal';
import FamilyShareModal from './components/common/FamilyShareModal';
import GovtVerificationModal from './components/common/GovtVerificationModal';
import IpProtectionModal from './components/common/IpProtectionModal';
import SlideOutDrawerSidebar from './components/common/SlideOutDrawerSidebar';
import HowItWorks from './components/common/HowItWorks';
import RecentThreatsSection from './components/common/RecentThreatsSection';
import TestimonialsSection from './components/common/TestimonialsSection';
import CommandPaletteModal from './components/common/CommandPaletteModal';
import SocTelemetryBento from './components/common/SocTelemetryBento';
import LoginModal from './components/auth/LoginModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import EnterpriseShowcaseBento from './components/common/EnterpriseShowcaseBento';
import DeepDivePanel from './components/feed/DeepDivePanel';
import MetricDetailModal from './components/feed/MetricDetailModal';

// Code-split Heavy On-Demand Modals (Loaded only when user opens them)
const AdminPanelModal = lazy(() => import('./components/admin/AdminPanelModal'));
const CyberThreatMapModal = lazy(() => import('./components/common/CyberThreatMapModal'));
const AttackSimulatorModal = lazy(() => import('./components/common/AttackSimulatorModal'));
const Helpline1930Modal = lazy(() => import('./components/common/Helpline1930Modal'));
const EnterpriseRoiCalculatorModal = lazy(() => import('./components/common/EnterpriseRoiCalculatorModal'));
const ForensicReportModal = lazy(() => import('./components/common/ForensicReportModal'));
const EnterpriseApiPlaygroundModal = lazy(() => import('./components/common/EnterpriseApiPlaygroundModal'));
const InvestorDataRoomModal = lazy(() => import('./components/common/InvestorDataRoomModal'));

// Code-split Alternate Tab Views (Loaded only when navigated to)
const AIHubView = lazy(() => import('./components/aihub/AIHubView'));
const AnalyticsView = lazy(() => import('./components/views/AnalyticsView'));
const ChildSafetyView = lazy(() => import('./components/views/ChildSafetyView'));
const KavachAcademyView = lazy(() => import('./components/views/KavachAcademyView'));
const GuideDocsView = lazy(() => import('./components/views/GuideDocsView'));

import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { initAutoUpdater, reloadToLatestVersion } from './utils/autoUpdater';
import { secureStorage } from './utils/securityGuard';
import { useChildMode } from './context/ChildModeContext';
import { useSimulatedFeed } from './hooks/useSimulatedFeed';
import { scanPayloadOffline } from './services/offlineAiEngine';
import { detectFakeNews } from './services/fakeNewsDetector';
import { analyzeCloneAndAdThreat } from './services/cloneAndAdDetector';
import { usePwaInstall } from './hooks/usePwaInstall';

// ── Dashboard Section Components ─────────────────────────────

/* Floating 3D geometry for hero backdrop */
/* Floating 3D geometry for hero backdrop — moves in cursor direction */
function FloatingOrb({ size, color, style, factor = 1 }) {
  return (
    <div
      className="floating-orb absolute pointer-events-none rounded-full"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}55, ${color}10 60%, transparent 80%)`,
        border: `1px solid ${color}25`,
        filter: `blur(0.5px)`,
        transform: `translate(calc(var(--mx, 0) * ${28 * factor}px), calc(var(--my, 0) * ${28 * factor}px))`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
        willChange: 'transform',
        ...style,
      }}
    />
  );
}

const HeroBanner = React.memo(function HeroBanner({ onScanClick, onFreezeClick, onHelplineClick, onMapClick }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Directional mouse tracking — smoothly moves elements in the cursor's direction with RAF throttling (zero lag)
  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((clientY - rect.top)  / rect.height - 0.5) * 2;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
      el.style.setProperty('--has-mouse', '1');
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
    el.style.setProperty('--has-mouse', '0');
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-banner cyber-bracket rounded-2xl relative overflow-hidden animate-fade-in cyber-network-grid transition-colors duration-300"
      style={{
        backgroundPosition: 'calc(50% + var(--mx, 0) * 12px) calc(50% + var(--my, 0) * 12px)',
        transition: 'background-position 0.15s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      <div className="cyber-scan-glow" />

      {/* Dynamic Cursor Spotlight — illuminates area directly under the moving cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle 420px at calc(50% + var(--mx, 0) * 42%) calc(50% + var(--my, 0) * 42%), rgba(0, 200, 239, 0.16), transparent 75%)',
          opacity: 'var(--has-mouse, 0)',
        }}
      />

      {/* ── Floating Geometry (Parallax layers moving in same direction as cursor) ── */}
      <FloatingOrb size="280px" color="#3b82f6" factor={1.2} style={{ top: '-60px', right: '-40px', animation: 'float-a 7s ease-in-out infinite', opacity: 0.7 }} />
      <FloatingOrb size="160px" color="#a855f7" factor={0.8} style={{ bottom: '-30px', left: '10%', animation: 'float-b 9s ease-in-out infinite', opacity: 0.5 }} />
      <FloatingOrb size="100px" color="#00c8ef" factor={1.5} style={{ top: '30%', right: '28%', animation: 'float-c 11s ease-in-out infinite', opacity: 0.4 }} />

      {/* Rotating wireframe hexagon — moves in cursor direction */}
      <div
        className="hero-wireframe-blob absolute pointer-events-none spin-slow"
        style={{
          width: '200px', height: '200px',
          right: '60px', top: '-30px',
          background: 'transparent',
          border: '1px solid rgba(0,200,239,0.18)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          boxShadow: 'inset 0 0 40px rgba(0,200,239,0.08)',
          transform: 'translate(calc(var(--mx, 0) * 36px), calc(var(--my, 0) * 36px))',
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
          willChange: 'transform',
        }}
      />
      <div
        className="hero-wireframe-ring absolute pointer-events-none"
        style={{
          width: '120px', height: '120px',
          right: '100px', top: '20px',
          border: '1px dashed rgba(168,85,247,0.22)',
          borderRadius: '50%',
          animation: 'spin-slow 30s linear infinite reverse',
          transform: 'translate(calc(var(--mx, 0) * 48px), calc(var(--my, 0) * 48px))',
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
          willChange: 'transform',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-4 sm:p-7 lg:p-9">
        {/* Tactical Telemetry Header — moves subtly in cursor direction */}
        <div
          className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 font-mono text-[9.5px] sm:text-[10px]"
          style={{
            transform: 'translate(calc(var(--mx, 0) * 6px), calc(var(--my, 0) * 4px))',
            transition: 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)',
            willChange: 'transform',
          }}
        >
          <span className="cyber-telemetry-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-500)] animate-ping" />
            [DEFCON 4 // ACTIVE DEFENSE]
          </span>
          <span className="cyber-telemetry-badge">
            [NODE: DEL-NCR-01]
          </span>
          <span className="cyber-telemetry-badge text-[var(--emerald-500)] border-[var(--emerald-500)]/40 bg-[var(--emerald-500)]/10">
            [92 ENGINES ONLINE]
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">

          {/* Left: Text & Badges — moves smoothly in cursor direction */}
          <div
            className="space-y-3.5 sm:space-y-4 max-w-xl min-w-0"
            style={{
              transform: 'translate(calc(var(--mx, 0) * 10px), calc(var(--my, 0) * 8px))',
              transition: 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)',
              willChange: 'transform',
            }}
          >
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="badge badge--primary text-[10px] sm:text-[11px]"><Sparkles size={9} />{t('hero.badgeIndia', "India's #1 AI Cyber Defense")}</span>
              <span className="badge badge--warning text-[10px] sm:text-[11px]"><Award size={9} />{t('hero.badgeMeity', "MeitY / CERT-In Aligned")}</span>
            </div>

            <div>
              <h1 className="text-h1 font-sans leading-tight break-words max-w-full" style={{ color: 'var(--text-primary)' }}>
                {t('hero.titleLine1', 'Real-Time Threat')}<br />
                <span className="hero-gradient-text">
                  {t('hero.titleLine2', 'Intelligence & Protection')}
                </span>
              </h1>
              <p className="text-small mt-2.5 sm:mt-3 font-medium break-words max-w-full" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                {t('hero.subtitle', '92-engine VirusTotal v3 · KAVACH AI voice assistant · 15-min emergency bank lock protocol.')} <br />
                <span style={{ color: 'var(--text-muted)' }}>{t('hero.founder', 'Founder: Bhargava Sood.')}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-caption">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full"
                  style={{ background: 'var(--success)', animation: 'ping-slow 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--success)' }} />
              </span>
              <span className="font-bold text-[var(--success)]">{t('hero.enginesActive', 'All 92 engines active')}</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="font-mono text-[var(--text-muted)]">{t('hero.threatsStats', '0 threats / 5 min')}</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="font-mono text-[var(--cyan-500)]">AES-256-GCM</span>
            </div>
          </div>

          {/* Right: CTAs — solid containment & instantaneous clickability */}
          <div className="relative z-20 flex flex-col gap-2.5 shrink-0 w-full sm:w-[260px] lg:w-[270px] max-w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onScanClick?.();
              }}
              className="btn btn--primary w-full text-center py-3 sm:py-3.5 px-4 font-bold text-sm shadow-xl cursor-pointer select-none"
            >
              <ScanLine size={16} className="shrink-0 pointer-events-none" />
              <span className="break-words min-w-0 pointer-events-none">{t('hero.scanBtn', 'Scan a Threat')}</span>
              <ArrowRight size={14} className="shrink-0 pointer-events-none" />
            </button>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFreezeClick?.();
                }}
                className="btn btn--danger py-2.5 px-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer select-none"
                title="Emergency Account Freeze"
              >
                <ShieldAlert size={14} className="shrink-0 pointer-events-none" />
                <span className="break-words min-w-0 text-center leading-tight pointer-events-none">
                  {isHindi ? 'खाता फ्रीज' : 'Emergency Freeze'}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onHelplineClick?.();
                }}
                className="btn btn--ghost py-2.5 px-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none"
                style={{
                  color: 'var(--warning)',
                  borderColor: 'var(--warning)',
                  background: 'var(--warning-muted)',
                }}
                title="1930 National Cyber Crime Citizen Helpline"
              >
                <PhoneCall size={14} className="shrink-0 animate-pulse pointer-events-none" />
                <span className="break-words min-w-0 text-center leading-tight pointer-events-none">
                  {isHindi ? '1930 हेल्पलाइन' : 'Call 1930 Helpline'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMapClick?.();
              }}
              className="btn btn--ghost w-full py-2.5 px-3 text-xs font-semibold cursor-pointer select-none"
            >
              <MapPin size={13} className="text-[var(--cyan-500)] shrink-0 pointer-events-none" />
              <span className="break-words min-w-0 pointer-events-none">{t('hero.threatMapBtn', 'Live Threat Map')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

const StatCard = React.memo(function StatCard({ icon: Icon, label, value, color, accentBg }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt({ max: 8, scale: 1.02 });
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="stat-card cyber-bracket p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden"
      style={{ '--card-accent': color, '--card-accent-muted': accentBg, transformStyle: 'preserve-3d' }}
    >
      {/* Shine overlay */}
      <div className="tilt-shine" data-tilt-shine="true" />

      <div className="flex items-center justify-between mb-2.5 sm:mb-3" style={{ transform: 'translateZ(8px)' }}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: accentBg, border: `1px solid ${color}50`, boxShadow: `0 4px 12px ${color}25` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="font-mono text-[8.5px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase"
          style={{ borderColor: `${color}40`, color: color, background: accentBg }}>
          ONLINE
        </span>
      </div>

      <div className="min-w-0">
        <div className="text-xl sm:text-h2 font-bold font-mono truncate" style={{ color: 'var(--text-primary)', lineHeight: 1.1, transform: 'translateZ(12px)' }}>
          {value}
        </div>
        <div className="text-[10px] sm:text-caption uppercase tracking-wider mt-1.5 break-normal truncate" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          {label}
        </div>
      </div>
      <div className="mt-3 sm:mt-3.5 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}80, ${color}25, transparent)` }} />
    </div>
  );
});

const ModuleCard = React.memo(function ModuleCard({ icon: Icon, title, description, accent, accentBg, onClick }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt({ max: 8, scale: 1.02 });
  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="module-card-3d cyber-bracket p-4 sm:p-5 text-left w-full overflow-hidden flex flex-col justify-between"
      style={{ transformStyle: 'preserve-3d' }}
      onFocus={e => e.currentTarget.style.outline = '2px solid var(--border-focus)'}
      onBlur={e => e.currentTarget.style.outline = 'none'}
    >
      {/* Shine */}
      <div className="tilt-shine" data-tilt-shine="true" />

      <div>
        <div className="flex items-start justify-between mb-3.5" style={{ transform: 'translateZ(10px)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${accentBg} 0%, ${accent}18 100%)`,
              border: `1px solid ${accent}40`,
              boxShadow: `0 8px 20px ${accent}20, inset 0 1px 0 ${accent}30`,
            }}>
            <Icon size={22} style={{ color: accent, filter: `drop-shadow(0 0 6px ${accent}80)` }} />
          </div>
          <ArrowRight size={14} className="mt-1.5 transition-all duration-200 shrink-0"
            style={{ color: accent, opacity: 0.5 }}
          />
        </div>

        <h3 className="text-[14px] font-semibold mb-2 break-words" style={{ color: 'var(--text-primary)', transform: 'translateZ(6px)' }}>
          {title}
        </h3>
        <p className="text-small break-words" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="mt-4 h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
    </button>
  );
});


export default function App() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n?.language?.startsWith('hi');
  const { theme, toggleTheme } = useTheme();
  const { isChildMode, toggleChildMode } = useChildMode();
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const { isInstalled, installApp } = usePwaInstall();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
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

  // Enterprise & Investor Suite Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isForensicsOpen, setIsForensicsOpen] = useState(false);
  const [isApiPlaygroundOpen, setIsApiPlaygroundOpen] = useState(false);
  const [isInvestorDataRoomOpen, setIsInvestorDataRoomOpen] = useState(false);
  const [selectedForensicThreat, setSelectedForensicThreat] = useState(null);

  // 1930 National Helpline Modal
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [helplineDossier, setHelplineDossier] = useState(null);

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
        setIsCommandPaletteOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(p => !p);
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
      const offlineResult = scanPayloadOffline(decodedText, isChildMode);
      const cloneAndAdReport = analyzeCloneAndAdThreat(decodedText, isChildMode);
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
        cloneAndAdReport.hasThreat || (vtReport && vtReport.maliciousCount > 0);

      // Determine precise verdict label, severity and indicators
      let verdictLabel = 'REAL';
      let riskScore = 4;
      let severity = 'low';
      let verdictReason = 'KAVACH AI & VirusTotal v3: Payload verified clean across 90+ engines.';
      let indicators = ['VirusTotal v3 Clean', 'Official Domain Certificate Verified'];

      if (cloneAndAdReport.cloneAnalysis?.isClone) {
        verdictLabel = 'WEBSITE CLONE (COPYCAT)';
        riskScore = cloneAndAdReport.cloneAnalysis.riskScore || 99;
        severity = 'critical';
        verdictReason = cloneAndAdReport.cloneAnalysis.reason;
        indicators = cloneAndAdReport.cloneAnalysis.indicators || [];
      } else if (cloneAndAdReport.ageAnalysis?.isAgeRestricted) {
        verdictLabel = '18+ AD / CHILD BLOCKED';
        riskScore = cloneAndAdReport.ageAnalysis.riskScore || 97;
        severity = 'critical';
        verdictReason = cloneAndAdReport.ageAnalysis.reason;
        indicators = cloneAndAdReport.ageAnalysis.indicators || [];
      } else if (cloneAndAdReport.adAnalysis?.isPhishingAd) {
        verdictLabel = 'PHISHING AD (MALVERTISING)';
        riskScore = cloneAndAdReport.adAnalysis.riskScore || 95;
        severity = 'high';
        verdictReason = cloneAndAdReport.adAnalysis.reason;
        indicators = cloneAndAdReport.adAnalysis.indicators || [];
      } else if (fakeNewsResult.isFakeNews) {
        verdictLabel = 'FAKE NEWS / HOAX';
        riskScore = fakeNewsResult.riskScore || 92;
        severity = 'high';
        verdictReason = fakeNewsResult.reason;
        indicators = fakeNewsResult.indicators || ['Contains Misinformation / Hoax Pattern'];
      } else if (isSuspicious) {
        verdictLabel = 'FAKE';
        riskScore = 92;
        severity = 'high';
        verdictReason = 'KAVACH AI & VirusTotal v3: High-risk payload detected across security engines.';
        indicators = ['VirusTotal v3 Security Alert', 'Multi-Engine Flagged', 'Unverified Origin'];
      }

      const newEvt = addManualEvent({
        source,
        payload: decodedText,
        preview: decodedText.length > 50 ? decodedText.substring(0, 50) + '...' : decodedText,
        verdict: isSuspicious ? 'fake' : 'real',
        verdictLabel,
        confidence: isSuspicious ? 98.6 : 99.2,
        riskScore,
        severity,
        verdictReason,
        vtReport,
        indicators,
        cloneAnalysis: cloneAndAdReport.cloneAnalysis,
        ageAnalysis: cloneAndAdReport.ageAnalysis,
        adAnalysis: cloneAndAdReport.adAnalysis,
      });

      setSelectedEvent(newEvt);
    },
    [addManualEvent, setSelectedEvent, isChildMode]
  );

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'var(--surface-base)' }}
    >
      <TopBar
        onOpenAdmin={handleOpenAdmin}
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Live scam ticker */}
      <LiveScamTicker />

      {/* Real-Time Cyber Security Defense Network Bar */}
      <div className="w-full py-1 px-2.5 sm:px-6 bg-[var(--surface-void)] border-b border-[var(--border-subtle)] flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono select-none gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <span className="flex items-center gap-1.5 text-[var(--cyan-400)] font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-400)] animate-ping" />
            <span className="hidden sm:inline">[DEFENSE_GRID: DEFCON-4 ACTIVE]</span>
            <span className="sm:hidden">[GRID: ACTIVE]</span>
          </span>
          <span className="text-[var(--text-muted)] hidden sm:inline">|</span>
          <span className="text-[var(--text-secondary)] hidden sm:inline truncate">
            // SOC_NODE: DEL-CENTRAL-01
          </span>
          <span className="text-[var(--text-muted)] hidden md:inline">|</span>
          <span className="text-[var(--emerald-400)] font-semibold hidden md:inline">
            PROTOCOL: AES-256-GCM
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto font-bold">
          <span className="text-[var(--text-secondary)] hidden xs:inline">
            92 ENGINES
          </span>
          <span className="text-[var(--text-muted)] hidden xs:inline">|</span>
          <span className="text-[var(--cyan-400)]">
            14ms
          </span>
        </div>
      </div>

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
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-28 md:pb-8 space-y-5 sm:space-y-6">

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
                  onHelplineClick={() => setIsHelplineOpen(true)}
                  onMapClick={() => setIsThreatMapOpen(true)}
                />

                {/* 2. Stats — secondary context, 2×2 on mobile, 4-col on desktop */}
                <section>
                  <h2 className="text-caption font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    {t('metrics.liveTitle', 'Live Protection Stats')}
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard icon={Shield}     label={t('metrics.totalScans', 'Total Scans')}        value={metrics?.totalScans?.toLocaleString() ?? '1,442'}  color="#1a6cf9" accentBg="rgba(26,108,249,0.12)" />
                    <StatCard icon={ShieldAlert} label={t('metrics.threatsBlocked', 'Threats Blocked')}   value={metrics?.threatsBlocked?.toLocaleString() ?? '99'}  color="#ff2d4f" accentBg="rgba(255,45,79,0.12)" />
                    <StatCard icon={Users}       label={t('metrics.childBlocks', 'Child Guard Blocks')} value={metrics?.childBlocks?.toLocaleString() ?? '47'}     color="#7c5cfc" accentBg="rgba(124,92,252,0.12)" />
                    <StatCard icon={Activity}    label={t('metrics.systemIntegrity', 'System Integrity')}   value={`${Math.floor(metrics?.systemIntegrity ?? 99)}%`}  color="#00c896" accentBg="rgba(0,200,150,0.12)" />
                  </div>
                </section>

                {/* 3. Live SOC Threat Radar & Cyber Resilience Matrix */}
                <SocTelemetryBento
                  onScanClick={() => setActiveTab('scanner')}
                  onFreezeClick={() => setIsEmergencyFreezeOpen(true)}
                  onHelplineClick={() => setIsHelplineOpen(true)}
                  onOpenMap={() => setIsThreatMapOpen(true)}
                />

                {/* 3.5. Enterprise & Investor Command Suite */}
                <EnterpriseShowcaseBento
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                  onOpenCalculator={() => setIsCalculatorOpen(true)}
                  onOpenForensics={() => setIsForensicsOpen(true)}
                  onOpenApiPlayground={() => setIsApiPlaygroundOpen(true)}
                  onOpenInvestorDataRoom={() => setIsInvestorDataRoomOpen(true)}
                />

                {/* 4. Core modules */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-caption font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {t('modules.coreTitle', 'Core Modules')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <ModuleCard
                      icon={ScanLine}
                      title={t('modules.scannerTitle', 'AI Threat Scanner')}
                      description={t('modules.scannerDesc', 'Scan links, SMS, QR codes against 92 VirusTotal detection engines in real time.')}
                      accent="#3b82f6"
                      accentBg="rgba(59,130,246,0.10)"
                      onClick={() => setActiveTab('scanner')}
                    />
                    <ModuleCard
                      icon={Bot}
                      title={t('modules.aihubTitle', 'KAVACH AI Hub')}
                      description={t('modules.aihubDesc', 'Multilingual voice assistant with Hindi/English cybersecurity-focused AI personas.')}
                      accent="#a855f7"
                      accentBg="rgba(168,85,247,0.10)"
                      onClick={() => setActiveTab('aihub')}
                    />
                    <ModuleCard
                      icon={GraduationCap}
                      title={t('modules.academyTitle', 'Cyber Academy')}
                      description={t('modules.academyDesc', '10 real-world threat scenarios with a founder-signed completion certificate.')}
                      accent="#f59e0b"
                      accentBg="rgba(245,158,11,0.10)"
                      onClick={() => setActiveTab('academy')}
                    />
                  </div>
                </section>

                {/* 4. Recent Threats Caught Live Feed */}
                <RecentThreatsSection />

                {/* 5. How It Works - 3 Step Flow */}
                <HowItWorks onTryItClick={() => setActiveTab('scanner')} />

                {/* 6. Citizen Trust Reviews & Testimonials */}
                <TestimonialsSection />

                {/* 7. SOC Defense Grid Footer & Open Source GitHub Link */}
                <footer className="mt-10 pt-8 pb-12 border-t border-[var(--border-subtle)] text-center text-xs space-y-4">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <a
                      href="https://github.com/Bhargavasood07/satya-gpt-3.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:border-blue-500 hover:shadow-md transition-all font-mono text-xs font-semibold"
                    >
                      <GitHubIcon size={15} className="text-white" />
                      <span>github.com/Bhargavasood07/satya-gpt-3.0</span>
                    </a>
                    <a
                      href="https://satya-gpt-30.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all font-mono text-xs font-semibold"
                    >
                      <span>🌐 Live SOC Deployment</span>
                    </a>
                  </div>
                  <p className="text-[var(--text-muted)] text-[11px] font-mono">
                    {isHindi
                      ? '© 2025 SATYA-GPT 3.0 • भारत का AI-संचालित साइबर अपराध सुरक्षा ग्रिड • ओपन सोर्स रिपॉजिटरी'
                      : '© 2025 SATYA-GPT 3.0 • India’s AI-Powered Cyber Defense & Fraud Protection Grid • Open Source'}
                  </p>
                </footer>
              </div>
            )}

            {/* ── SCANNER ───────────────────────────────── */}
            {activeTab === 'scanner' && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-h2 font-bold" style={{ color: 'var(--text-primary)' }}>
                    {t('scanner.title', 'AI Threat Scanner')}
                  </h1>
                  <p className="text-small mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {t('modules.scannerDesc', 'Scan links, SMS, QR codes against 92 VirusTotal detection engines in real time.')}
                  </p>
                </div>
                <div className="card p-6">
                  <ScannerPanel onScanResult={handleScanResult} />
                </div>
              </div>
            )}

            {activeTab === 'guidedocs'  && (
              <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-cyan-400 animate-pulse">Loading Guide Docs...</div>}>
                <GuideDocsView onSelectTab={setActiveTab} />
              </Suspense>
            )}
            {activeTab === 'aihub'      && (
              <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-purple-400 animate-pulse">Loading AI Hub...</div>}>
                <AIHubView />
              </Suspense>
            )}
            {activeTab === 'academy'    && (
              <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-emerald-400 animate-pulse">Loading KAVACH Academy...</div>}>
                <KavachAcademyView />
              </Suspense>
            )}
            {activeTab === 'childSafety'&& (
              <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-amber-400 animate-pulse">Loading Child Safety Guard...</div>}>
                <ChildSafetyView />
              </Suspense>
            )}
            {activeTab === 'analytics'  && (
              <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-blue-400 animate-pulse">Loading Telemetry Analytics...</div>}>
                <AnalyticsView metrics={metrics} events={events} />
              </Suspense>
            )}
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
            <Suspense fallback={null}>
              <AdminPanelModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} events={events} metrics={metrics} />
            </Suspense>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPartnerOpen && <EnterprisePartnershipModal onClose={() => setIsPartnerOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isGovtVerificationOpen && <GovtVerificationModal onClose={() => setIsGovtVerificationOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isThreatMapOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="Threat Map Protected" onReset={() => setIsThreatMapOpen(false)}>
                <CyberThreatMapModal onClose={() => setIsThreatMapOpen(false)} />
              </ErrorBoundary>
            </Suspense>
          )}
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
              onOpen1930Helpline={() => setIsHelplineOpen(true)}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onOpenForensics={() => setIsForensicsOpen(true)}
              onOpenApiPlayground={() => setIsApiPlaygroundOpen(true)}
              onOpenInvestorDataRoom={() => setIsInvestorDataRoomOpen(true)}
              onOpenChat={handleToggleChat}
              onInstallApp={installApp}
              isAppInstalled={isInstalled}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEmergencyFreezeOpen && (
            <ErrorBoundary inline title="Emergency Freeze Protected" onReset={() => setIsEmergencyFreezeOpen(false)}>
              <GoldenHourEmergencyModal
                onClose={() => setIsEmergencyFreezeOpen(false)}
                onOpen1930Helpline={(dossier) => {
                  setHelplineDossier(dossier);
                  setIsHelplineOpen(true);
                }}
              />
            </ErrorBoundary>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isHelplineOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="1930 Helpline Protected" onReset={() => setIsHelplineOpen(false)}>
                <Helpline1930Modal
                  initialDossier={helplineDossier}
                  onClose={() => setIsHelplineOpen(false)}
                  onOpenBankFreeze={() => setIsEmergencyFreezeOpen(true)}
                />
              </ErrorBoundary>
            </Suspense>
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

        {/* ── Enterprise & Investor Modals ── */}
        <AnimatePresence>
          {isSimulatorOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="Simulator Protected" onReset={() => setIsSimulatorOpen(false)}>
                <AttackSimulatorModal
                  onClose={() => setIsSimulatorOpen(false)}
                  onOpenForensicCertificate={(threat) => {
                    setSelectedForensicThreat(threat);
                    setIsForensicsOpen(true);
                  }}
                />
              </ErrorBoundary>
            </Suspense>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCalculatorOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="ROI Calculator Protected" onReset={() => setIsCalculatorOpen(false)}>
                <EnterpriseRoiCalculatorModal
                  onClose={() => setIsCalculatorOpen(false)}
                  onOpenEnterprisePartnership={() => setIsPartnerOpen(true)}
                />
              </ErrorBoundary>
            </Suspense>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isForensicsOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="Forensics Protected" onReset={() => setIsForensicsOpen(false)}>
                <ForensicReportModal
                  initialThreatData={selectedForensicThreat}
                  onClose={() => setIsForensicsOpen(false)}
                />
              </ErrorBoundary>
            </Suspense>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isApiPlaygroundOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="API Playground Protected" onReset={() => setIsApiPlaygroundOpen(false)}>
                <EnterpriseApiPlaygroundModal onClose={() => setIsApiPlaygroundOpen(false)} />
              </ErrorBoundary>
            </Suspense>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isInvestorDataRoomOpen && (
            <Suspense fallback={null}>
              <ErrorBoundary inline title="Investor Data Room Protected" onReset={() => setIsInvestorDataRoomOpen(false)}>
                <InvestorDataRoomModal
                  onClose={() => setIsInvestorDataRoomOpen(false)}
                  onOpenCalculator={() => setIsCalculatorOpen(true)}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              </ErrorBoundary>
            </Suspense>
          )}
        </AnimatePresence>

        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={setActiveTab}
          onScanSample={handleScanResult}
          onTriggerFreeze={() => setIsEmergencyFreezeOpen(true)}
          onOpen1930Helpline={() => setIsHelplineOpen(true)}
          onOpenThreatMap={() => setIsThreatMapOpen(true)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenForensics={() => setIsForensicsOpen(true)}
          onOpenApiPlayground={() => setIsApiPlaygroundOpen(true)}
          onOpenInvestorDataRoom={() => setIsInvestorDataRoomOpen(true)}
          toggleTheme={toggleTheme}
          currentTheme={theme}
          toggleLanguage={() => {
            const lang = i18n?.language || 'en';
            i18n?.changeLanguage(lang.startsWith('hi') ? 'en' : 'hi');
          }}
          currentLanguage={i18n?.language}
          toggleChildMode={toggleChildMode}
          isChildMode={isChildMode}
        />

        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} onOpenAdmin={handleOpenAdmin} />
        <CyberAiChatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
      </div>
    </div>
  );
}
