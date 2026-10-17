import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine, Camera, QrCode, Link, MessageSquare, Shield, Loader2 } from 'lucide-react';
import LinkChecker from './LinkChecker';
import TextChecker from './TextChecker';
import ErrorBoundary from '../common/ErrorBoundary';
import { useChildMode } from '../../context/ChildModeContext';

const QRScanner = lazy(() => import('./QRScanner'));
const CameraFeed = lazy(() => import('./CameraFeed'));

const ScannerPanel = ({ onScanResult }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const { isChildMode } = useChildMode();
  const [activeTab, setActiveTab] = useState('link');

  const tabs = useMemo(() => [
    { id: 'link', label: t('scanner.linkTab', 'Link Scanner'), icon: Link },
    { id: 'text', label: t('scanner.textTab', 'SMS / Text'), icon: MessageSquare },
    { id: 'qr', label: t('scanner.qrTab', 'QR Code'), icon: QrCode },
    { id: 'camera', label: t('scanner.cameraTab', 'Camera Scan'), icon: Camera },
  ], [t]);

  return (
    <div className="w-full flex flex-col bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-2xl p-3.5 sm:p-5 font-mono space-y-4 cyber-bracket cyber-network-grid relative">
      <div className="cyber-scan-glow" />
      
      {/* Child Mode Banner */}
      {isChildMode && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--emerald-500)]/10 border border-[var(--emerald-500)]/30 text-[var(--emerald-500)] text-xs font-bold w-full break-words">
          <Shield size={16} className="text-[var(--emerald-500)] shrink-0" />
          <span className="min-w-0">{t('childMode.activeBanner', 'Child Safety Guard Active — Adult and scam content blocked')}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--border-default)] pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[var(--text-primary)] min-w-0">
            <ScanLine className="text-[var(--cyan-500)] shrink-0" size={20} />
            <h3 className="text-sm sm:text-base font-bold tracking-wide uppercase text-[var(--text-primary)] break-words">
              {t('scanner.title', 'SATYA-GPT Scanner')}
            </h3>
          </div>
          <span className="cyber-telemetry-badge shrink-0">
            [92 ENGINES SYNCED]
          </span>
        </div>

        {/* Tab Selection Row - Responsive 2x2 Grid on Mobile, Row on Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1.5 sm:gap-2 bg-[var(--surface-raised)] p-1 sm:p-1.5 rounded-xl sm:rounded-full border border-[var(--border-subtle)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-full text-xs font-bold transition-all truncate flex-1 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--text-primary)] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1">
          💡 {isHindi ? 'कोई भी संदिग्ध लिंक, UPI ID या बैंक SMS यहाँ पेस्ट करें' : 'Paste any link, UPI ID, or forward a suspicious SMS'}
        </div>
        <div className="text-[var(--text-secondary)] opacity-70 text-xs italic bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-2 rounded">
          {isHindi ? 'जांचें: http://sbi-kyc-update.tk/verify' : 'Try: http://sbi-kyc-update.tk/verify'}
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="min-h-[200px] mt-2">
        <ErrorBoundary inline title="Scanner Module Protected" key={activeTab}>
          {activeTab === 'link' && <LinkChecker onScanResult={onScanResult} />}
          {activeTab === 'text' && <TextChecker onScanResult={onScanResult} />}
          {activeTab === 'qr' && (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-cyan-400">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-xs">Initializing Optical QR Scanner Engine...</span>
              </div>
            }>
              <QRScanner onScanResult={onScanResult} />
            </Suspense>
          )}
          {activeTab === 'camera' && (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-cyan-400">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-xs">Initializing Camera Hardware Stream...</span>
              </div>
            }>
              <CameraFeed />
            </Suspense>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default React.memo(ScannerPanel);
