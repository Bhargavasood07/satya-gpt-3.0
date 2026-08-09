import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, Globe, Rss, Link as LinkIcon } from 'lucide-react';

const getSourceIcon = (source) => {
  switch (source?.toLowerCase()) {
    case 'camera': return <Camera size={14} className="text-[var(--accent)] shrink-0" />;
    case 'qr':
    case 'qrcode': return <QrCode size={14} className="text-amber-400 shrink-0" />;
    case 'link':
    case 'url': return <LinkIcon size={14} className="text-emerald-400 shrink-0" />;
    case 'web': return <Globe size={14} className="text-cyan-400 shrink-0" />;
    default: return <Rss size={14} className="text-[var(--text-muted)] shrink-0" />;
  }
};

const LiveFeedTable = ({ events = [], selectedEvent, onSelectEvent }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-[#131B2E] border border-[#27395C] rounded-xl overflow-hidden flex flex-col max-h-[500px] font-mono text-xs shadow-xl">
      <div className="overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0B0F19] z-10 border-b border-[#1E2D4A] text-[var(--text-muted)] text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3 font-bold">{t('feed.timestamp', 'Time')}</th>
              <th className="p-3 font-bold">{t('feed.source', 'Origin')}</th>
              <th className="p-3 font-bold">{t('feed.preview', 'Payload Data')}</th>
              <th className="p-3 font-bold">{t('feed.verdict', 'Verdict')}</th>
              <th className="p-3 font-bold">{t('feed.confidence', 'Score')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2D4A]/60">
            <AnimatePresence>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-[var(--text-muted)] italic font-mono text-xs">
                    {t('feed.noEvents', 'No incidents logged yet.')}
                  </td>
                </tr>
              ) : (
                events.map((event, index) => {
                  const isSelected = selectedEvent?.id === event.id;
                  const isFake = event.verdict === 'fake' || event.verdict === 'malicious';
                  const timeFormatted = event.timestamp instanceof Date 
                    ? event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) 
                    : String(event.timestamp);
                  
                  return (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => onSelectEvent(event)}
                      className={`
                        cursor-pointer transition-colors border-l-4 font-mono text-xs
                        ${index % 2 === 0 ? 'bg-[#0B0F19]/40' : 'bg-transparent'}
                        ${isSelected ? 'bg-[#1C2A47] border-l-[var(--accent)] text-[var(--text-primary)]' : 'border-l-transparent hover:bg-[#131B2E]'}
                      `}
                    >
                      <td className="p-3 whitespace-nowrap text-[var(--text-muted)] text-[11px]">
                        {timeFormatted}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[var(--text-secondary)]">
                          {getSourceIcon(event.source)}
                          <span>{event.source}</span>
                        </div>
                      </td>
                      <td className="p-3 max-w-[200px] sm:max-w-xs truncate text-[var(--text-primary)] font-mono text-[11px]">
                        {event.payload}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                          isFake 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isFake ? 'MALICIOUS' : 'CLEAN'}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-[11px] ${isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {event.riskScore ? `${event.riskScore}%` : `${event.confidence}%`}
                          </span>
                          <div className="w-12 h-1.5 bg-[#0B0F19] rounded-full overflow-hidden border border-[#1E2D4A]">
                            <div 
                              className={`h-full rounded-full transition-all ${isFake ? 'bg-rose-500' : 'bg-emerald-400'}`}
                              style={{ width: `${event.riskScore || event.confidence}%` }}
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

export default React.memo(LiveFeedTable);
