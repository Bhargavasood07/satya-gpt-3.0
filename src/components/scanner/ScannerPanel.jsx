import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanLine, Camera, QrCode, Link, MessageSquare, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, Shield } from 'lucide-react';
import CameraFeed from './CameraFeed';
import QRScanner from './QRScanner';
import LinkChecker from './LinkChecker';
import TextChecker from './TextChecker';
import { useChildMode } from '../../context/ChildModeContext';

const ScannerPanel = ({ onScanResult }) => {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [activeTab, setActiveTab] = useState('link'); // Default to Link checker for quick test

  const tabs = [
    { id: 'link', label: t('scanner.linkTab'), icon: Link },
    { id: 'text', label: t('scanner.textTab'), icon: MessageSquare },
    { id: 'qr', label: t('scanner.qrTab'), icon: QrCode },
    { id: 'camera', label: t('scanner.cameraTab'), icon: Camera },
  ];

  return (
    <div className="w-full flex flex-col cyber-card bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-xl overflow-hidden shadow-xl p-4 md:p-5 space-y-4">
      {/* Header & Child Mode Status */}
      <div className="flex flex-col gap-3 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <ScanLine className="text-[var(--accent)]" size={22} />
            <h2 className="text-lg font-bold tracking-wide">{t('scanner.title')}</h2>
          </div>
          {isChildMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Shield size={13} className="text-purple-400" />
              <span>{t('app.childShieldActive')}</span>
            </div>
          )}
        </div>

        {/* Tab Selection Row */}
        <div className="grid grid-cols-4 gap-1.5 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-card)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--accent)] text-slate-950 shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[220px]">
        {activeTab === 'link' && <LinkChecker onScanResult={onScanResult} />}
        {activeTab === 'text' && <TextChecker onScanResult={onScanResult} />}
        {activeTab === 'qr' && <QRScanner onScanResult={onScanResult} />}
        {activeTab === 'camera' && <CameraFeed />}
      </div>
    </div>
  );
};

export default ScannerPanel;
