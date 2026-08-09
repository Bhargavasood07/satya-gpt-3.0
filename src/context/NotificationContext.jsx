import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext();

let notifId = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});

  const addNotification = useCallback((type, title, message, duration = 6000) => {
    const id = ++notifId;
    const notification = {
      id,
      type, // 'safe' | 'threat' | 'info' | 'warning'
      title,
      message,
      timestamp: new Date(),
    };

    setNotifications(prev => [notification, ...prev].slice(0, 8));

    // Auto-dismiss
    timersRef.current[id] = setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const clearAll = useCallback(() => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
