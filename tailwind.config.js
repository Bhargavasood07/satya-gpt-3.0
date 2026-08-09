/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        card: 'var(--bg-card)',
        'card-hover': 'var(--bg-card-hover)',
        accent: 'var(--accent)',
        'accent-glow': 'var(--accent-glow)',
        'accent-muted': 'var(--accent-muted)',
        safe: 'var(--safe)',
        'safe-glow': 'var(--safe-glow)',
        threat: 'var(--threat)',
        'threat-glow': 'var(--threat-glow)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      borderColor: {
        card: 'var(--border-card)',
        default: 'var(--border-color)',
      },
      boxShadow: {
        'accent-glow': '0 0 20px var(--accent-glow)',
        'safe-glow': '0 0 20px var(--safe-glow)',
        'threat-glow': '0 0 20px var(--threat-glow)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
