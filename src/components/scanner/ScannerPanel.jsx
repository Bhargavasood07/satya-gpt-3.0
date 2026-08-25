import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine, Camera, QrCode, Link, MessageSquare, Shield } from 'lucide-react';
import CameraFeed from './CameraFeed';
import QRScanner from './QRScanner';
import LinkChecker from './LinkChecker';
import TextChecker from './TextChecker';
import { useChildMode } from '../../context/ChildModeContext';

const ScannerPanel = ({ onScanResult }) => {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [activeTab, setActiveTab] = useState('link');

  const tabs = useMemo(() => [
    { id: 'link', label: t('scanner.linkTab', 'Link Scanner'), icon: Link },
    { id: 'text', label: t('scanner.textTab', 'SMS / Text'), icon: MessageSquare },
    { id: 'qr', label: t('scanner.qrTab', 'QR Code'), icon: QrCode },
    { id: 'camera', label: t('scanner.cameraTab', 'Camera Scan'), icon: Camera },
  ], [t]);

  return (
    <div className="w-full flex flex-col bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-2xl p-3.5 sm:p-4 font-mono space-y-4">
      
      {/* Child Mode Banner */}
      {isChildMode && (
        <div className="flex items-center gap-2 p-2 rounded bg-[var(--emerald-500)]/10 border border-[var(--emerald-500)]/30 text-[var(--emerald-500)] text-xs font-bold w-full">
          <Shield size={16} className="text-[var(--emerald-500)] shrink-0" />
          <span>Child Safety Guard Active — Adult and scam content blocked</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--border-default)] pb-4">
        <div className="flex items-center gap-2 text-[var(--text-primary)]">
          <ScanLine className="text-[var(--cyan-500)] shrink-0" size={20} />
          <h3 className="text-sm sm:text-base font-bold tracking-wide uppercase text-[var(--text-primary)]">
            SATYA-GPT Scanner
          </h3>
        </div>

        {/* Tab Selection Row - Pill Tabs */}
        <div className="flex gap-2 bg-[var(--surface-raised)] p-1 rounded-full border border-[var(--border-subtle)] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-1 ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--text-primary)] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1">
          💡 Paste any link, UPI ID, or forward a suspicious SMS
        </div>
        <div className="text-[var(--text-secondary)] opacity-70 text-xs italic bg-[var(--surface-raised)] border border-[var(--border-subtle)] p-2 rounded">
          Try: http://sbi-kyc-update.tk/verify
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="min-h-[200px] mt-2">
        {activeTab === 'link' && <LinkChecker onScanResult={onScanResult} />}
        {activeTab === 'text' && <TextChecker onScanResult={onScanResult} />}
        {activeTab === 'qr' && <QRScanner onScanResult={onScanResult} />}
        {activeTab === 'camera' && <CameraFeed />}
      </div>
    </div>
  );
};

export default React.memo(ScannerPanel);
