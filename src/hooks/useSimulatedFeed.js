import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { generateEvent, generateInitialEvents, getMetricsSnapshot } from '../data/mockEvents';

export function useSimulatedFeed() {
  const [events, setEvents] = useState(() => generateInitialEvents(15));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const intervalRef = useRef(null);

  // Compute metrics in the same render tick without triggering a secondary re-render
  const metrics = useMemo(() => getMetricsSnapshot(events), [events]);

  // Auto-generate new stream events (capped at max 40 for zero memory bloat)
  useEffect(() => {
    const generateNew = () => {
      // Pause updates if tab is backgrounded to save CPU/battery
      if (typeof document !== 'undefined' && document.hidden) return;
      const event = generateEvent();
      setEvents(prev => [event, ...prev].slice(0, 40));
    };

    const scheduleNext = () => {
      intervalRef.current = setTimeout(() => {
        generateNew();
        scheduleNext();
      }, 5000);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  const addManualEvent = useCallback((overrides = {}) => {
    const event = { ...generateEvent(), ...overrides };
    setEvents(prev => [event, ...prev].slice(0, 40));
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

export default useSimulatedFeed;
