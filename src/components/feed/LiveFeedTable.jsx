import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, Globe, Rss } from 'lucide-react';

const getSourceIcon = (source) => {
  switch (source?.toLowerCase()) {
    case 'camera': return <Camera size={16} className="text-[var(--text-secondary)]" />;
    case 'qrcode': return <QrCode size={16} className="text-[var(--text-secondary)]" />;
    case 'web': return <Globe size={16} className="text-[var(--text-secondary)]" />;
    default: return <Rss size={16} className="text-[var(--text-secondary)]" />;
  }
};

const LiveFeedTable = ({ events = [], selectedEvent, onSelectEvent }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-lg overflow-hidden flex flex-col max-h-[600px]">
      <div className="overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[var(--bg-secondary)] z-10 border-b border-[var(--border-color)]">
            <tr>
              <th className="p-3 text-sm font-semibold text-[var(--text-primary)]">{t('feed.timestamp')}</th>
              <th className="p-3 text-sm font-semibold text-[var(--text-primary)]">{t('feed.source')}</th>
              <th className="p-3 text-sm font-semibold text-[var(--text-primary)]">{t('feed.preview')}</th>
              <th className="p-3 text-sm font-semibold text-[var(--text-primary)]">{t('feed.verdict')}</th>
              <th className="p-3 text-sm font-semibold text-[var(--text-primary)]">{t('feed.confidence')}</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[var(--text-muted)] italic">
                    {t('feed.noEvents')}
                  </td>
                </tr>
              ) : (
                events.map((event, index) => {
                  const isSelected = selectedEvent?.id === event.id;
                  const isFake = event.verdict === 'fake' || event.verdict === 'malicious';
                  const verdictClass = isFake ? 'badge-threat text-[var(--threat)] bg-[var(--threat-glow)]' : 'badge-safe text-[var(--safe)] bg-[var(--safe-glow)]';
                  const verdictText = isFake ? t('verdict.fake') : t('verdict.real');
                  const confidenceColor = isFake ? 'var(--threat)' : 'var(--safe)';
                  
                  return (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, backgroundColor: 'var(--accent-glow)' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      transition={{ duration: 0.5 }}
                      onClick={() => onSelectEvent(event)}
                      className={`
                        feed-row cursor-pointer border-b border-[var(--border-color)]
                        ${index % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-transparent'}
                        ${isSelected ? 'bg-[var(--bg-secondary)] border-l-4 border-l-[var(--accent)]' : 'border-l-4 border-l-transparent hover:bg-[var(--bg-secondary)]/50'}
                      `}
                    >
                      <td className="p-3">
                        <span className="font-mono text-xs text-[var(--text-secondary)]">{event.timestamp instanceof Date ? event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : String(event.timestamp)}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(event.source)}
                          <span className="text-sm text-[var(--text-primary)]">{t(`sources.${event.source?.toLowerCase()}`)}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-xs text-[var(--text-muted)] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {event.payload}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${verdictClass}`}>
                          {verdictText}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-primary)] w-8">{event.confidence}%</span>
                          <div className="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden min-w-[50px] confidence-bar">
                            <div 
                              className="h-full rounded-full transition-all duration-500 confidence-bar-fill" 
                              style={{ width: `${event.confidence}%`, backgroundColor: confidenceColor }}
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveFeedTable;
