# 🛡️ SATYA-GPT — Mobile & Tablet AI Security Operations Center (SOC)

**SATYA-GPT** is a production-grade, brutalist-designed AI Security Operations Center & VirusTotal v3 Threat Detection platform built with React, Vite, Tailwind CSS, Framer Motion, and KAVACH AI Neural Engine.

---

## 🌟 Key Features

- **🛡️ VirusTotal v3 & Multi-Vendor Inspection**: Analyzes links, SMS messages, and QR codes across 92 security engines (Google Safebrowsing, Kaspersky, BitDefender, Sophos).
- **🤖 KAVACH AI Cybersecurity Assistant**: Claude-architected AI security engine providing structured threat summaries and remediation steps.
- **📱 Android & iOS Cross-Platform Support**: Mobile & tablet touch navigation, PWA standalone installation, and Capacitor iOS/Android packaging config.
- **👶 Child Safety Guard Mode**: Automatic filtering of adult redirects, gaming scams (Free Robux traps), and unverified money requests.
- **🔒 Anti-Theft & Data Security Shield**: Anti-copying CSS shield (`user-select: none`), DevTools shortcut locks (`F12`, `Ctrl+U`, `Ctrl+Shift+I`), anti-clickjacking frame busting, and obfuscated local storage.
- **🤫 Secret Founder Admin Vault**: Restricted passcode-protected Admin Panel (`Ctrl+Shift+A` or logo triple-click) with JSON threat vault exporter and custom passcode manager.
- **🔍 100% Threat Block Transparency**: Detailed reason breakdown cards explaining exact target payload, threat category, and vendor signatures.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- `npm` or `yarn`

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/satya-gpt.git
cd satya-gpt

# 2. Install dependencies
npm install

# 3. Create .env file with your VirusTotal API key (Optional)
VITE_VT_API_KEY=your_virustotal_api_key_here

# 4. Start Development Server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 📱 Mobile Native App Build (Android & iOS)

Using **Capacitor**:

```bash
# Add Native Android Platform
npx cap add android
npx cap open android

# Add Native iOS Platform (macOS required)
npx cap add ios
npx cap open ios
```

---

## 📜 License & Copyright

© 2026 **SATYA-GPT**. Protected Intellectual Property. All Rights Reserved.
