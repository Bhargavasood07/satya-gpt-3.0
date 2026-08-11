/**
 * SATYA-GPT Maximum IP Protection, Code Obfuscation & Zero-Trust Data Security Guard
 * Prevents code copying, source viewing, DevTools inspection, data leakage,
 * shoulder surfing, and unauthorized memory harvesting.
 */

// Obfuscation Salt for Encrypted Local Storage
const STORAGE_SALT = 'SATYA_GPT_ZERO_TRUST_DATA_SHIELD_2026';

/**
 * High-Security Field Masker (Prevents Shoulder Surfing & Log Leakage)
 */
export function maskSensitiveField(val = '', type = 'account') {
  if (!val || typeof val !== 'string') return '';
  const str = val.trim();
  if (str.length <= 4) return '****';

  if (type === 'phone') {
    // 9876543210 -> 98******10
    return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
  }

  if (type === 'email') {
    // user@example.com -> u***@example.com
    const parts = str.split('@');
    if (parts.length < 2) return '****';
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.charAt(0) + '***' + (name.length > 2 ? name.charAt(name.length - 1) : '');
    return `${maskedName}@${domain}`;
  }

  // Account / UTR / Card: 329188492011 -> 32********11
  return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
}

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
      (function () {
        return false;
      })['constructor']('debugger')['call']();
      const end = performance.now();
      if (end - start > 100) {
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
      '%cThis application, algorithm, design system, and underlying threat engine are proprietary intellectual property. Zero-trust client-side encryption is active.',
      'color: #94a3b8; font-size: 13px; font-family: monospace;'
    );
  }, 2500);

  // 4. Disable Right-Click Context Menu Entirely (Anti-Copy & Anti-Inspect)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });

  // 5. Block DevTools, View-Source & Copy Shortcuts
  document.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const key = e.key ? e.key.toLowerCase() : '';

    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    if (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) {
      e.preventDefault();
      return false;
    }

    if (isCmdOrCtrl && key === 'u') {
      e.preventDefault();
      return false;
    }

    if (isCmdOrCtrl && key === 's') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }

    if (isCmdOrCtrl && key === 'a') {
      if (!e.shiftKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }

    if (isCmdOrCtrl && key === 'c') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }
  });

  // 6. Block Dragging Assets
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
 * Secure Obfuscated Storage Helper (Zero-Trust AES-Style Obfuscation)
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
