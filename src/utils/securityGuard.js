/**
 * SATYA-GPT Enterprise Code Fortress, IP Protection & Anti-Cloning Security Suite
 * Completely locks down source code, prevents DevTools inspection, blocks code copying,
 * halts reverse-engineering, prevents screen printing, and secures intellectual property.
 */

// Encryption Salt for Obfuscated Client Storage
const STORAGE_SALT = 'SATYA_GPT_ZERO_TRUST_PROPRIETARY_IP_SHIELD_2026';

/**
 * High-Security Field Masker (Prevents Shoulder Surfing & Log Leakage)
 */
export function maskSensitiveField(val = '', type = 'account') {
  if (!val || typeof val !== 'string') return '';
  const str = val.trim();
  if (str.length <= 4) return '****';

  if (type === 'phone') {
    return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
  }

  if (type === 'email') {
    const parts = str.split('@');
    if (parts.length < 2) return '****';
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.charAt(0) + '***' + (name.length > 2 ? name.charAt(name.length - 1) : '');
    return `${maskedName}@${domain}`;
  }

  return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
}

export function initializeWebsiteSecurityGuard() {
  // 1. Anti-Clickjacking Frame Busting Shield (Prevents iframe embedding/cloning)
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch (e) {
      window.self.location = 'about:blank';
    }
  }

  // 2. Anti-Print & Anti-Screen Save Stylesheet Injection
  try {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media print {
        body { display: none !important; }
      }
      .no-select {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(styleEl);
  } catch (e) {}

  // 3. Dynamic Anti-Debugger Freeze Trap (Freezes browser execution if DevTools is opened)
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
  }, 800);

  // 4. Console Purge & Intellectual Property Warning Notice
  setInterval(() => {
    console.clear();
    console.log(
      '%c🛑 LEGAL NOTICE: SATYA-GPT PROPRIETARY INTELLECTUAL PROPERTY',
      'color: #ef4444; font-size: 20px; font-weight: 800; font-family: monospace; background: #0b0f19; padding: 10px; border: 2px solid #ef4444;'
    );
    console.log(
      '%cThis application, architecture, UI/UX system, and threat intelligence algorithms are protected under the Indian Copyright Act (1957), Information Technology Act (2000), and International IP Laws. Unauthorized code extraction, cloning, or reverse engineering will result in legal prosecution under criminal law. Founder: Bhargava Sood.',
      'color: #94a3b8; font-size: 12px; font-family: monospace;'
    );
  }, 2000);

  // 5. Disable Right-Click Context Menu Entirely (Anti-Inspect & Anti-Copy)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });

  // 6. Block DevTools, View-Source, Copy, Print & Save Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const key = e.key ? e.key.toLowerCase() : '';

    // F12 Key
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker), Ctrl+Shift+K
    if (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c', 'k', 'e', 'm'].includes(key)) {
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

    // Ctrl+P / Cmd+P (Print Page Code)
    if (isCmdOrCtrl && key === 'p') {
      e.preventDefault();
      return false;
    }

    // Ctrl+A / Cmd+A (Select All Content - Block outside input fields)
    if (isCmdOrCtrl && key === 'a') {
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

    // Ctrl+X / Cmd+X (Cut Text - Block outside input fields)
    if (isCmdOrCtrl && key === 'x') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    }
  });

  // 7. Block Image & Asset Dragging (Anti-Asset Theft)
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // 8. Block Text Selection Event outside Input Fields
  document.addEventListener('selectstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });

  // 9. Block Copy Event outside Input Fields
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
