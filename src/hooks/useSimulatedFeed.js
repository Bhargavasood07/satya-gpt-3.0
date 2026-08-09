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

  // Auto-generate new stream events (capped at max 50 for zero memory bloat)
  useEffect(() => {
    const generateNew = () => {
      const event = generateEvent();
      setEvents(prev => [event, ...prev].slice(0, 50));
      // Automatic popup notifications are disabled so user view remains 100% clean and clear
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
  }, []);

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
