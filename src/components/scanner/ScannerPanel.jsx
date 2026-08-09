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
    <div className="w-full flex flex-col bg-[#131B2E] border border-[#27395C] rounded-xl overflow-hidden shadow-2xl p-3.5 sm:p-4 font-mono space-y-3.5">
      {/* Formal Header & Child Mode Status */}
      <div className="flex flex-col gap-2.5 border-b border-[#1E2D4A] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <ScanLine className="text-[var(--accent)] shrink-0" size={18} />
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-[var(--text-primary)]">
              {t('scanner.title', 'SATYA AI Threat Scanner')}
            </h3>
          </div>
          {isChildMode && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
              <Shield size={12} className="text-purple-400" />
              <span>CHILD GUARD ACTIVE</span>
            </div>
          )}
        </div>

        {/* Tab Selection Row */}
        <div className="grid grid-cols-4 gap-1 bg-[#0B0F19] p-1 rounded-lg border border-[#1E2D4A]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--accent)] text-slate-950 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#131B2E]'
                }`}
              >
                <Icon size={14} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panel */}
      <div className="min-h-[200px]">
        {activeTab === 'link' && <LinkChecker onScanResult={onScanResult} />}
        {activeTab === 'text' && <TextChecker onScanResult={onScanResult} />}
        {activeTab === 'qr' && <QRScanner onScanResult={onScanResult} />}
        {activeTab === 'camera' && <CameraFeed />}
      </div>
    </div>
  );
};

export default React.memo(ScannerPanel);
