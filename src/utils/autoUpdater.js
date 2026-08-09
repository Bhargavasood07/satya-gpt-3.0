/**
 * SATYA-GPT Long-Term Reliability & Automated Version Auto-Updater
 * Checks for Service Worker & bundle updates automatically every 5 minutes.
 */

export function initAutoUpdater(onUpdateFound) {
  if (!('serviceWorker' in navigator)) return;

  // Check for updates every 5 minutes
  const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000;

  navigator.serviceWorker.ready.then((registration) => {
    // Check on initial load
    registration.update();

    setInterval(() => {
      registration.update().catch((err) => {
        console.warn('Auto-updater background check notice:', err);
      });
    }, UPDATE_CHECK_INTERVAL);

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Fresh new build is ready!
          if (onUpdateFound) {
            onUpdateFound();
          }
        }
      });
    });
  });
}

export function reloadToLatestVersion() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
  } else {
    window.location.reload();
  }
}
