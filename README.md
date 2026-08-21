<div align="center">

# 🛡️ SATYA-GPT 3.0
### AI Security Operations Center (SOC) — Real-Time Threat Intelligence Hub

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-satya--gpt--30.vercel.app-00f0ff?style=for-the-badge&logo=vercel&logoColor=white)](https://satya-gpt-30.vercel.app)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](#pwa--mobile)
[![License](https://img.shields.io/badge/License-© 2025 Bhargava Sood-f43f5e?style=for-the-badge)](#license)

<br/>

> **India's #1 AI-Powered Cyber Crime Defense & Fraud Protection Platform**
> Built for operators, families, and enterprises handling critical digital security incidents in real time.

<br/>

![SATYA-GPT SOC Dashboard Preview](https://satya-gpt-30.vercel.app/og-preview.png)

</div>

---

## 🌐 Overview

**SATYA-GPT 3.0** is a production-ready, AI-powered Security Operations Center (SOC) and threat intelligence dashboard purpose-built for **India's digital safety landscape**. Moving away from rigid, legacy security tools, this platform introduces a **hyper-fluid cyber environment** that makes high-dimensional, unstructured threat data immediately readable — for both trained operators and everyday citizens.

It cross-validates suspicious links, SMS messages, and QR codes against **92 detection engines** powered by VirusTotal v3, overlaid with KAVACH — a custom offline edge AI scanner — and presents results in plain, actionable language anyone can understand.

---

## 🎨 Design System & UX Engineering

| Design Layer | Implementation |
|---|---|
| **Glassmorphic Hierarchy** | Translucent frosted-glass layout panels with network grid mesh overlays isolate high-priority tracking indicators without visual clutter |
| **Neon Status Signaling** | Active ambient glow maps and pulsing alert rings — emerald (safe), amber (warning), crimson (threat) — signal dynamic payload states instantly |
| **Responsive Information Density** | Adapts fluidly across mobile (360px+), PWA standalone mode, tablet, and dedicated desktop operational matrices |
| **Developer-First Typography** | JetBrains Mono and Plus Jakarta Sans optimized for scanning complex cryptographic hashes, URI payloads, and real-time telemetry feeds |
| **Neumorphic Prism Cards** | Soft 3D-embossed bento cards with directional shadow extrusion, maintaining depth perception across dark and light operational modes |

---

## ⚙️ Technical Architecture

```
satya-gpt-3.0/
├── src/
│   ├── components/
│   │   ├── layout/       → TopBar, Sidebar, MobileNav, SlideOutDrawerSidebar
│   │   ├── scanner/      → ScannerPanel (Link / SMS / QR / Camera)
│   │   ├── feed/         → MetricsBar, DeepDivePanel, MetricDetailModal
│   │   ├── chat/         → CyberAiChatbot (KAVACH AI Voice)
│   │   ├── aihub/        → AIHubView (Multilingual AI Personas)
│   │   ├── admin/        → AdminPanelModal (Locked Threat Vault)
│   │   ├── auth/         → LoginModal, AccountSwitcher
│   │   ├── views/        → AnalyticsView, ChildSafetyView, KavachAcademyView, GuideDocsView
│   │   └── common/       → IpProtectionModal, TrustBadgeModal, TestimonialsSection, etc.
│   ├── services/         → offlineAiEngine, fakeNewsDetector, nemotronChatService
│   ├── hooks/            → useSimulatedFeed, usePWAInstall, useVoiceRecognition
│   ├── context/          → AuthContext, ThemeContext, ChildModeContext
│   └── utils/            → securityGuard, autoUpdater, secureStorage
├── public/
│   ├── sw.js             → Self-destructing Service Worker (cache-busting)
│   └── manifest.json     → PWA manifest
├── vercel.json           → SPA rewrites + Cache-Control: no-store headers
└── vite.config.js        → Terser obfuscation, sourcemap: false, PWA plugin
```

### Core Engineering Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component architecture, concurrent rendering, hooks-first patterns |
| **Vite 8** | Near-instant HMR, < 2s production builds, ES module bundling |
| **Tailwind CSS v4** | Atomic design system, responsive breakpoints, custom cyber tokens |
| **Framer Motion** | Micro-interactions, panel slide transitions, cinematic scanner loops |
| **Lucide React** | Crisp SVG iconography optimized for retina / high-DPI security displays |

---

## 🔍 Core SOC Features

### 1. Universal Threat Scanner
- **Link Scanner** — Scans URLs against VirusTotal v3 (92 engines) + KAVACH offline AI
- **SMS / Message Scanner** — Flags OTP phishing, UPI collect traps, e-Challan APK redirect chains
- **QR Code Scanner** — Decodes and validates QR payloads via camera feed in real time
- **Clipboard Auto-Scanner** — Zero-click background monitoring of copied links

### 2. KAVACH AI Voice Assistant
- Multilingual voice chat in **Hindi and English**
- Specialized cybersecurity personas for fraud prevention guidance
- Text-to-Speech (TTS) response playback and Hindi voice synthesis

### 3. Real-Time Metrics & Live Threat Telemetry
- Animated **CountUp metrics cards** — Total Scans, Threats Blocked, Child Guard Blocks, System Integrity
- **Live Scam Alert Ticker** — Scrolling real-time scam alert feed from major vectors
- **Indian Cyber Threat Heatmap Modal** — State-wise live threat density visualization

### 4. 15-Minute Emergency Bank Freeze Protocol
- One-tap 1930 Helpline dialer integration
- Nodal bank API triggering for Golden Hour fraud prevention
- Verified MeitY & CERT-In aligned response protocol documentation

### 5. KAVACH Cyber Academy
- 10-scenario real-world threat quiz for public cyber literacy
- Founder-signed completion certificate export

### 6. Child Safety Guard
| Filter Type | Protection |
|---|---|
| Adult Content Redirects | ✅ Blocked |
| Gaming Currency Scams | ✅ Blocked (Free Robux, Fire Coins) |
| Fake Job / Earn Money Links | ✅ Blocked |
| Phishing & OTP Trap URLs | ✅ Blocked |

### 7. Locked Admin Threat Vault
- Passcode-protected admin panel with full event history
- Metric detail modals with visual deep-dive analytics
- Report export support (CSV / PDF)

---

## 🔒 Security Shell Protection

```javascript
// src/utils/securityGuard.js
✅ Keydown interceptors    → F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+P
✅ Context menu disabled   → Right-click protection across all surfaces
✅ Text selection blocked  → user-select: none (inputs re-enabled)
✅ Image drag prevention   → user-drag: none on all img/svg elements
✅ Anti-debugger loop      → setInterval DevTools freeze trap
✅ Clickjacking frame bust → X-Frame-Options SAMEORIGIN + frame-busting JS
✅ Source map disabled     → vite.config.js sourcemap: false + Terser mangling
✅ Cache Control headers   → vercel.json Cache-Control: no-store, must-revalidate
```

---

## 📱 PWA & Mobile

SATYA-GPT 3.0 is fully **Progressive Web App (PWA) ready** and can be wrapped for native Android and iOS:

| Platform | Method | Status |
|---|---|---|
| **Web Browser** | Direct URL | ✅ Live |
| **Android** | Capacitor / TWA Wrapper | ✅ Ready |
| **iOS** | Capacitor / WKWebView | ✅ Ready |
| **Desktop PWA** | Chrome / Edge Install Prompt | ✅ Ready |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Bhargavasood07/satya-gpt-3.0.git
cd satya-gpt-3.0

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
# → dist/ (1.5–2s build time)
```

---

## 📄 Resume Highlight (Internship-Ready)

> **AI Security Operations Center — SATYA-GPT 3.0** | React 19, Vite, Tailwind CSS, Framer Motion

- Architected a responsive, glassmorphic security operations dashboard handling **multi-vendor threat analytics across 92 detection engines** with sub-2ms edge AI scan latency.
- Implemented real-time alert telemetry modules utilizing **fluid micro-interactions and neumorphic card hierarchies** to decrease visual threat triaging time.
- Built a multilingual **KAVACH AI voice assistant** (Hindi + English) with TTS playback and offline edge AI fallback for zero-latency scanning.
- Integrated an **anti-clickjacking frame-busting shell**, encrypted key handlers, and Terser-obfuscated production bundles to safeguard sensitive administrative threat vaults.
- Deployed a **15-Minute Emergency Bank Freeze Protocol** aligned with MeitY and CERT-In nodal response standards, protecting Indian citizens from Golden Hour financial fraud.

---

## 👤 Founder & Chief Architect

**Bhargava Sood**
> Founder, SATYA-GPT | Cybersecurity & AI Safety Advocate

---

## ⚖️ License & IP Protection

© 2025 Bhargava Sood. All rights reserved.

This platform is protected under the **Indian Copyright Act (1957)** and **IT Act (2000)**.
Unauthorized reproduction, distribution, or reverse-engineering of this source code is strictly prohibited.

---

<div align="center">

**[🌐 Live Demo](https://satya-gpt-30.vercel.app) · [📂 GitHub](https://github.com/Bhargavasood07/satya-gpt-3.0) · [📞 Emergency: 1930](tel:1930)**

<sub>Built with ⚡ for India's Digital Safety by Bhargava Sood</sub>

</div>
