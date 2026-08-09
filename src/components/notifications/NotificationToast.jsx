import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotificationToast = ({ notification, onDismiss }) => {
  const { t } = useTranslation();
  
  const getStyles = () => {
    switch (notification.type) {
      case 'safe':
        return {
          borderClass: 'border-l-4 border-[var(--safe)]',
          shadowClass: 'shadow-[0_0_15px_var(--safe-glow)]',
          icon: <CheckCircle2 className="text-[var(--safe)] w-5 h-5" />,
          badgeClass: 'bg-[var(--safe-glow)] text-[var(--safe)] px-2 py-0.5 rounded text-xs font-medium',
          badgeText: t('notifications.severity.low', 'LOW'),
        };
      case 'threat':
        return {
          borderClass: 'border-l-4 border-[var(--threat)]',
          shadowClass: 'shadow-[0_0_15px_var(--threat-glow)] threat-pulse',
          icon: <AlertTriangle className="text-[var(--threat)] w-5 h-5" />,
          badgeClass: 'bg-[var(--threat-glow)] text-[var(--threat)] px-2 py-0.5 rounded text-xs font-medium',
          badgeText: t('notifications.severity.high', 'HIGH'),
        };
      case 'warning':
        return {
          borderClass: 'border-l-4 border-[var(--accent)]',
          shadowClass: 'shadow-[0_0_15px_var(--accent-glow)]',
          icon: <AlertCircle className="text-[var(--accent)] w-5 h-5" />,
          badgeClass: 'bg-[var(--accent-glow)] text-[var(--accent)] px-2 py-0.5 rounded text-xs font-medium',
          badgeText: t('notifications.severity.medium', 'MEDIUM'),
        };
      case 'info':
      default:
        return {
          borderClass: 'border-l-4 border-[var(--border-color)]',
          shadowClass: 'shadow-lg',
          icon: <Info className="text-[var(--text-secondary)] w-5 h-5" />,
          badgeClass: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-xs font-medium',
          badgeText: t('notifications.severity.info', 'INFO'),
        };
    }
  };

  const style = getStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`w-80 bg-[var(--bg-card)] rounded overflow-hidden flex flex-col p-4 gap-2 ${style.borderClass} ${style.shadowClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {style.icon}
          <h4 className="font-semibold text-[var(--text-primary)] text-sm">{notification.title}</h4>
        </div>
        <button
          onClick={() => onDismiss(notification.id)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={t('notifications.dismiss', 'Dismiss')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-[var(--text-secondary)] text-sm">
        {notification.message}
      </p>
      
      <div className="flex items-center justify-between mt-1">
        <span className={style.badgeClass}>
          {style.badgeText}
        </span>
        <span className="text-[var(--text-muted)] text-xs">
          {notification.timestamp instanceof Date ? notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : t('notifications.justNow', 'Just now')}
        </span>
      </div>
    </motion.div>
  );
};

export default NotificationToast;
