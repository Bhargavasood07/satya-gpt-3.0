import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  // Show only first 5 notifications
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
