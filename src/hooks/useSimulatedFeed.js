import { useState, useEffect, useCallback, useRef } from 'react';
import { generateEvent, generateInitialEvents, getMetricsSnapshot } from '../data/mockEvents';

export function useSimulatedFeed(addNotification, t) {
  const [events, setEvents] = useState(() => generateInitialEvents(15));
  const [metrics, setMetrics] = useState(() => getMetricsSnapshot([]));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const intervalRef = useRef(null);

  // Update metrics when events change
  useEffect(() => {
    setMetrics(getMetricsSnapshot(events));
  }, [events]);

  // Auto-generate new events (capped at max 50 for zero memory bloat)
  useEffect(() => {
    const generateNew = () => {
      const event = generateEvent();
      setEvents(prev => [event, ...prev].slice(0, 50));

      // Fire notification
      if (addNotification) {
        if (event.verdict === 'fake') {
          const threatMessages = [
            t ? t('notifications.phishingDetected') : 'Phishing Attempt Detected',
            t ? t('notifications.malwareDetected') : 'Malware Signature Found',
            t ? t('notifications.qrMalicious') : 'Malicious QR Payload Detected',
          ];
          addNotification(
            'threat',
            t ? t('notifications.threatTitle') : 'Threat Alert',
            threatMessages[Math.floor(Math.random() * threatMessages.length)]
          );
        } else if (Math.random() > 0.8) { // Notify on ~20% of safe events
          const safeMessages = [
            t ? t('notifications.urlSafe') : 'URL Verified Safe',
            t ? t('notifications.qrSafe') : 'QR Code Verified Clean',
            t ? t('notifications.scanComplete') : 'Scan Complete',
          ];
          addNotification(
            'safe',
            t ? t('notifications.safeTitle') : 'Safe Event Detected',
            safeMessages[Math.floor(Math.random() * safeMessages.length)]
          );
        }
      }
    };

    // Schedule next stream update (4s interval)
    const scheduleNext = () => {
      intervalRef.current = setTimeout(() => {
        generateNew();
        scheduleNext();
      }, 4000);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [addNotification, t]);

  const addManualEvent = useCallback((overrides = {}) => {
    const event = { ...generateEvent(), ...overrides };
    setEvents(prev => [event, ...prev].slice(0, 50));
    return event;
  }, []);

  return {
    events,
    metrics,
    selectedEvent,
    setSelectedEvent,
    addManualEvent,
  };
}
