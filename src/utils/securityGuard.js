/**
 * SATYA-GPT Maximum IP Protection, Code Obfuscation & Source Hiding Guard
 * Prevents code copying, text selection, source viewing, DevTools inspection,
 * image dragging, clickjacking, and unauthorized cloning.
 */

// Simple Obfuscation Salt for Storage Enclosure
const STORAGE_SALT = 'SATYA_GPT_IP_SHIELD_PRO_2026';

export function initializeWebsiteSecurityGuard() {
  // 1. Anti-Clickjacking Frame Busting Shield
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch (e) {
      window.self.location = 'about:blank';
    }
  }

  // 2. Anti-Debugging Code Freeze Trap (Halts DevTools Inspection)
  setInterval(() => {
    try {
      const start = performance.now();
      // Anti-debug trap statement
      (function () {
        return false;
      })['constructor']('debugger')['call']();
      const end = performance.now();
      if (end - start > 100) {
        // DevTools opened! Freeze console
        console.clear();
      }
    } catch (e) {}
  }, 1000);

  // 3. Clear Console & Print Legal Intellectual Property Notice
  setInterval(() => {
    console.clear();
    console.log(
      '%c🛑 STOP! SATYA-GPT SOURCE CODE & INTELLECTUAL PROPERTY PROTECTED',
      'color: #ef4444; font-size: 22px; font-weight: 800; font-family: monospace; background: #0b0f19; padding: 10px; border: 2px solid #ef4444;'
    );
    console.log(
      '%cThis application, algorithm, design system, and underlying threat engine are proprietary intellectual property. Unauthorized copying, scraping, reverse-engineering, or cloning is strictly prohibited under international copyright laws.',
      'color: #94a3b8; font-size: 13px; font-family: monospace;'
    );
  }, 2500);

  // 4. Disable Right-Click Context Menu Entirely (Anti-Copy & Anti-Inspect)
  document.addEventListener('contextmenu', (e) => {
    // Allow typing inside text inputs, block context menu everywhere
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });

  // 5. Block DevTools, View-Source & Copy Shortcuts (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+C, Ctrl+A, Ctrl+S)
  document.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const key = e.key ? e.key.toLowerCase() : '';

    // F12 Key
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker), Ctrl+Shift+K
    if (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U / Cmd+U (View Source Code)
    if (isCmdOrCtrl && key === 'u') {
      e.preventDefault();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Webpage Copy)
    if (isCmdOrCtrl && key === 's') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }

    // Ctrl+A / Cmd+A (Select All Content - Block outside input fields)
    if (isCmdOrCtrl && key === 'a') {
      // Don't intercept secret Founder Admin shortcut (Ctrl+Shift+A)
      if (!e.shiftKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }

    // Ctrl+C / Cmd+C (Copy Text - Block outside input fields)
    if (isCmdOrCtrl && key === 'c') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }
  });

  // 6. Block Dragging Images, Links & Assets (Anti-Asset Theft)
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // 7. Block Copy Event on Non-Input Elements
  document.addEventListener('copy', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });
}

/**
 * XSS & Script Injection Payload Sanitizer
 */
export function sanitizePayload(inputStr) {
  if (!inputStr) return '';
  return String(inputStr)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Secure Obfuscated Storage Helper
 */
export const secureStorage = {
  setItem: (key, val) => {
    try {
      const jsonStr = JSON.stringify(val);
      const encoded = btoa(encodeURIComponent(jsonStr + STORAGE_SALT));
      localStorage.setItem(`satya_sec_${key}`, encoded);
    } catch (e) {
      console.warn('Storage security notice:', e);
    }
  },

  getItem: (key) => {
    try {
      const encoded = localStorage.getItem(`satya_sec_${key}`);
      if (!encoded) return null;
      const decoded = decodeURIComponent(atob(encoded));
      const jsonStr = decoded.replace(STORAGE_SALT, '');
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(`satya_sec_${key}`);
  },
};
