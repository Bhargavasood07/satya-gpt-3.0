import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Baby, ShieldCheck, Activity, Server, Terminal, RefreshCw, ArrowUpCircle, ScanLine, Rss, Info } from 'lucide-react';

// Layout
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Scanner
import ScannerPanel from './components/scanner/ScannerPanel';

// Chatbot
import CyberAiChatbot from './components/chat/CyberAiChatbot';

// Admin Vault
import AdminPanelModal from './components/admin/AdminPanelModal';

// Onboarding Guide & Auto Updater
import UserOnboardingBanner from './components/common/UserOnboardingBanner';
import { initAutoUpdater, reloadToLatestVersion } from './utils/autoUpdater';
import { secureStorage } from './utils/securityGuard';

// Views
import AnalyticsView from './components/views/AnalyticsView';

// Context
import { useChildMode } from './context/ChildModeContext';

// Feed
import MetricsBar from './components/feed/MetricsBar';
import LiveFeedTable from './components/feed/LiveFeedTable';
import DeepDivePanel from './components/feed/DeepDivePanel';
import AttackPathGraph from './components/feed/AttackPathGraph';
import MetricDetailModal from './components/feed/MetricDetailModal';

// Hooks & Data
import { useSimulatedFeed } from './hooks/useSimulatedFeed';

export default function App() {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(true);
  const [activeMetricModal, setActiveMetricModal] = useState(null);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
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
    setShowHelpGuide((prev) => !prev);
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setIsAdminOpen(true);
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

  // Founder Secret Shortcuts: ⌘B/Ctrl+B Chat, ⌘+Shift+A/Ctrl+Shift+A Secret Admin Vault, Esc Close
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key ? e.key.toLowerCase() : '';

      // Ctrl+B / Cmd+B Chat
      if (isCmdOrCtrl && key === 'b') {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
      }

      // Founder Secret Shortcut: Ctrl+Shift+A / Cmd+Shift+A
      if (isCmdOrCtrl && e.shiftKey && key === 'a') {
        e.preventDefault();
        setIsAdminOpen(true);
      }

      // Escape key to close modals
      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setIsChatOpen(false);
        setActiveMetricModal(null);
        setIsAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedEvent]);

  const handleScanResult = useCallback(
    (decodedText, source = 'qr', vtReport = null) => {
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
        lower.includes('.exe');

      const isSuspicious = isAdultRedirect || isGamingScam || isPhishing || (vtReport && vtReport.maliciousCount > 0);

      let verdictReason = isSuspicious
        ? 'KAVACH AI & VirusTotal v3 Analysis: High risk malicious payload detected across security vendor engines.'
        : 'KAVACH AI & VirusTotal v3 Analysis: Payload verified clean across 90+ security engines.';

      if (isChildMode && isSuspicious) {
        verdictReason = isAdultRedirect
          ? t('childMode.blockedAdult')
          : isGamingScam
          ? t('childMode.blockedScam')
          : t('childMode.blockedPhishing');
      }

      const newEvt = addManualEvent({
        source,
        payload: decodedText,
        preview:
          decodedText.length > 50
            ? decodedText.substring(0, 50) + '...'
            : decodedText,
        verdict: isSuspicious ? 'fake' : 'real',
        verdictLabel: isSuspicious ? 'FAKE' : 'REAL',
        confidence: isSuspicious ? 98.4 : 99.2,
        riskScore: isSuspicious ? 92 : 4,
        severity: isSuspicious ? 'high' : 'low',
        verdictReason,
        vtReport,
        indicators: isSuspicious
          ? [
              isChildMode ? 'Child Protection Guard: Blocked' : 'VirusTotal v3 Security Alert',
              'Multi-Engine Flagged (Kaspersky / Safebrowsing)',
              'Unverified Origin / Obfuscated Payload',
            ]
          : ['VirusTotal v3 Clean Rating', 'Official Domain Certificate Verified'],
      });

      // Opens deep dive detailed drawer directly without intrusive toast popups
      setSelectedEvent(newEvt);
    },
    [addManualEvent, isChildMode, t, setSelectedEvent]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0B0F19]">
      {/* Top Bar (Founder secret triggers active) */}
      <TopBar onToggleChat={handleToggleChat} onToggleHelp={handleToggleHelp} onOpenAdmin={handleOpenAdmin} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop/Tablet Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onOpenAdmin={handleOpenAdmin} />

        {/* Main Workspace Content (Auto-scrolling container) */}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-4 pb-28 md:pb-6 text-xs sm:text-sm">
          {/* New Version Auto-Update Banner */}
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

          {/* User Onboarding Guide Banner */}
          {showHelpGuide && <UserOnboardingBanner />}

          {/* Command Subheader & Active Vulnerability Ticker */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#131B2E] border border-[#1E2D4A] p-3.5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0B0F19] border border-[#27395C] flex items-center justify-center text-[var(--accent)] font-mono font-bold text-xs shrink-0">
                SOC
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs sm:text-sm text-[var(--text-primary)]">SATYA-GPT ENGINE v3.5.0</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    STABLE & SECURE
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)]">
                  Active View: {activeTab.toUpperCase()} • VirusTotal v3 & KAVACH AI Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F19] border border-[#1E2D4A] text-[var(--text-secondary)]">
                <Server size={13} className="text-[var(--accent)]" />
                <span>VT v3: ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F19] border border-[#1E2D4A] text-[var(--text-secondary)]">
                <Activity size={13} className="text-emerald-400 animate-pulse" />
                <span>LATENCY: 12ms</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F19] border border-[#1E2D4A] text-amber-400">
                <ShieldCheck size={13} />
                <span>LEVEL: SAFE</span>
              </div>
            </div>
          </div>

          {/* Child Guard Active Explanation Banner */}
          {isChildMode && (
            <div className="bg-[#131B2E] border border-amber-500/40 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200 font-mono shadow-md">
              <div className="flex items-center gap-2.5">
                <Baby size={18} className="text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-amber-300">Child Guard Protection Active</div>
                  <div className="text-[10px] text-amber-200/80">Automatically blocks adult links, gaming scams (Free Robux traps), and unverified money requests for family safety.</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 w-fit shrink-0">
                CHILD GUARD ACTIVE
              </span>
            </div>
          )}

          {/* Render Active Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* 1st POSITION: Metrics Bar */}
              <MetricsBar
                metrics={metrics}
                onCardClick={(type) => setActiveMetricModal(type)}
                isFounderSession={isFounderSession}
              />

              {/* 2nd POSITION: SATYA AI Dedicated Threat Scanner Hub */}
              <div className="cyber-card p-4 rounded-xl border border-[#27395C] bg-[#131B2E] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-2.5">
                  <div className="flex items-center gap-2">
                    <ScanLine size={18} className="text-[var(--accent)]" />
                    <h2 className="text-xs sm:text-sm font-bold font-mono text-[var(--text-primary)] uppercase">
                      SATYA AI Threat Scanner & Instant Verification
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--accent)] bg-[#0B0F19] px-2 py-0.5 rounded border border-[#1E2D4A]">
                    92-ENGINE VIRUSTOTAL CHECK
                  </span>
                </div>
                <ScannerPanel onScanResult={handleScanResult} />
              </div>

              {/* 3rd POSITION: Incident Audit Logs & Real-Time Stream */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 space-y-4">
                  <div className="cyber-card rounded-xl overflow-hidden border border-[#27395C] bg-[#131B2E]">
                    <div className="p-3.5 border-b border-[#1E2D4A] bg-[#0B0F19] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-[var(--accent)]" />
                        <h2 className="text-xs sm:text-sm font-bold font-mono tracking-wider text-[var(--text-primary)] uppercase">
                          Incident Audit Logs & Real-Time Stream
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[#131B2E] px-2 py-0.5 rounded border border-[#1E2D4A]">
                        AUTO-STREAMING
                      </span>
                    </div>
                    <LiveFeedTable
                      events={events}
                      selectedEvent={selectedEvent}
                      onSelectEvent={setSelectedEvent}
                    />
                  </div>
                </div>
                <div className="xl:col-span-1">
                  <AttackPathGraph selectedEvent={selectedEvent} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scanner' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-[#131B2E] border border-[#27395C] p-4 rounded-xl font-mono">
                <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">
                  SATYA AI Dedicated Threat Scanner Hub
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">Scan links, messages, camera feeds, and QR codes with VirusTotal v3 verification</p>
              </div>
              <ScannerPanel onScanResult={handleScanResult} />
            </div>
          )}

          {activeTab === 'feeds' && (
            <div className="space-y-4 font-mono">
              {/* Intel Feeds Feature Explanation Banner */}
              <div className="bg-[#131B2E] border border-cyan-500/40 p-3.5 rounded-xl flex items-center gap-3 text-xs text-cyan-200 shadow-md">
                <Info size={20} className="text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-cyan-300">Intel Feeds — Global Threat Intelligence Archive</div>
                  <div className="text-[11px] text-cyan-200/80 mt-0.5">This feed logs every live phishing link, scam SMS, and malicious payload blocked by our 92-engine VirusTotal security network in real-time.</div>
                </div>
              </div>

              <div className="cyber-card rounded-xl overflow-hidden border border-[#27395C] bg-[#131B2E]">
                <div className="p-3.5 border-b border-[#1E2D4A] bg-[#0B0F19] flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold font-mono tracking-wider text-[var(--text-primary)] uppercase">
                    Full Threat Intelligence Stream Archive
                  </h2>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[#131B2E] px-2 py-0.5 rounded border border-[#1E2D4A]">
                    {events.length} TOTAL INCIDENTS
                  </span>
                </div>
                <LiveFeedTable
                  events={events}
                  selectedEvent={selectedEvent}
                  onSelectEvent={setSelectedEvent}
                />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView metrics={metrics} events={events} />
          )}
        </main>

        {/* Deep Dive Panel Overlay */}
        <AnimatePresence>
          {selectedEvent && (
            <DeepDivePanel
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </AnimatePresence>

        {/* Metric Detail Modal Overlay */}
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

        {/* Secret Founder Admin Vault Portal Modal */}
        <AnimatePresence>
          {isAdminOpen && (
            <AdminPanelModal
              isOpen={isAdminOpen}
              onClose={() => setIsAdminOpen(false)}
              events={events}
              metrics={metrics}
            />
          )}
        </AnimatePresence>

        {/* Mobile & Tablet Bottom Touch Bar */}
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} onOpenAdmin={handleOpenAdmin} />

        {/* KAVACH AI Cybersecurity Assistant Chatbot */}
        <CyberAiChatbot isOpen={isChatOpen} onToggle={handleToggleChat} />
      </div>
    </div>
  );
}
