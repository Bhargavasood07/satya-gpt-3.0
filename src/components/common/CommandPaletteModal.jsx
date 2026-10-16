import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ScanLine, Bot, ShieldAlert, PhoneCall, MapPin, GraduationCap,
  Baby, Sun, Moon, Globe, ArrowRight, ShieldCheck, Zap, X, Terminal, CornerDownLeft,
  Flame, Calculator, Scale, Code2, TrendingUp
} from 'lucide-react';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onScanSample,
  onTriggerFreeze,
  onOpen1930Helpline,
  onOpenThreatMap,
  onOpenSimulator,
  onOpenCalculator,
  onOpenForensics,
  onOpenApiPlayground,
  onOpenInvestorDataRoom,
  toggleTheme,
  currentTheme,
  toggleLanguage,
  currentLanguage,
  toggleChildMode,
  isChildMode,
}) {
  const isHindi = currentLanguage?.startsWith('hi');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = useMemo(() => [
    {
      id: 'scan',
      category: isHindi ? 'प्रमुख सेवाएं' : 'Core Actions',
      title: isHindi ? 'संदिग्ध लिंक, SMS या QR कोड जांचें' : 'Scan Suspicious Link / SMS / QR',
      subtitle: isHindi ? '92 सुरक्षा इंजनों द्वारा गहन विश्लेषण' : 'Analyze against 92 security engines',
      icon: ScanLine,
      color: 'var(--primary)',
      badge: 'Enter',
      action: () => { onNavigate('scanner'); onClose(); },
    },
    {
      id: 'aihub',
      category: isHindi ? 'प्रमुख सेवाएं' : 'Core Actions',
      title: isHindi ? 'कवच AI सुरक्षा केंद्र खोलें' : 'Open KAVACH AI Security Hub',
      subtitle: isHindi ? 'आवाज से बातचीत, बहुभाषी AI सहायता व सुरक्षा गाइड' : 'Voice chat, multimodal analysis & cyber personas',
      icon: Bot,
      color: 'var(--violet-500)',
      badge: 'Tab',
      action: () => { onNavigate('aihub'); onClose(); },
    },
    {
      id: 'freeze',
      category: isHindi ? 'आपातकालीन सहायता' : 'Emergency Protocol',
      title: isHindi ? '15-मिनट आपातकालीन बैंक खाता फ्रीज करें' : 'Trigger 15-Min Emergency Bank Freeze',
      subtitle: isHindi ? 'धोखाधड़ी होने पर निकासी रोकने का तुरंत उपाय' : 'Golden Hour immediate account lock instructions',
      icon: ShieldAlert,
      color: 'var(--crimson-500)',
      badge: isHindi ? 'आपातकालीन' : 'Critical',
      action: () => { onTriggerFreeze(); onClose(); },
    },
    {
      id: 'helpline',
      category: isHindi ? 'आपातकालीन सहायता' : 'Emergency Protocol',
      title: isHindi ? '1930 राष्ट्रीय साइबर हेल्पलाइन पर कॉल करें' : 'Call 1930 National Cyber Fraud Helpline',
      subtitle: isHindi ? 'भारत सरकार का आधिकारिक नागरिक सहायता नंबर' : 'Official Govt of India Citizen Hotline',
      icon: PhoneCall,
      color: 'var(--amber-500)',
      badge: isHindi ? 'सरकारी' : 'Govt',
      action: () => {
        if (onOpen1930Helpline) {
          onOpen1930Helpline();
        } else {
          window.location.href = 'tel:1930';
        }
        onClose();
      },
    },
    {
      id: 'threatmap',
      category: isHindi ? 'लाइव सुरक्षा' : 'Live Intelligence',
      title: isHindi ? 'लाइव साइबर खतरा मैप देखें' : 'Open Live Cyber Threat Map',
      subtitle: isHindi ? 'देशभर में सक्रिय साइबर हमलों की लाइव स्थिति' : 'Real-time telemetry attacks across India',
      icon: MapPin,
      color: 'var(--cyan-500)',
      action: () => { onOpenThreatMap(); onClose(); },
    },
    {
      id: 'academy',
      category: isHindi ? 'लाइव सुरक्षा' : 'Live Intelligence',
      title: isHindi ? 'साइबर सुरक्षा सीखें (अकादमी)' : 'Cyber Defense Academy',
      subtitle: isHindi ? '10 आम फ्रॉड मामलों का अभ्यास करें' : '10 real-world fraud interactive scenarios',
      icon: GraduationCap,
      color: 'var(--amber-500)',
      action: () => { onNavigate('academy'); onClose(); },
    },
    {
      id: 'simulator',
      category: isHindi ? 'एंटरप्राइज व निवेशक' : 'Enterprise & Investor',
      title: isHindi ? 'लाइव जीरो-डे साइबर हमला सिम्युलेटर' : 'Live Zero-Day Cyber Attack Simulator',
      subtitle: isHindi ? '14ms में 4-स्तरीय AI डिफेंस का लाइव डेमो' : 'Experience 4-stage neural defense in 14ms',
      icon: Flame,
      color: 'var(--crimson-500)',
      badge: 'Demo',
      action: () => { if (onOpenSimulator) onOpenSimulator(); onClose(); },
    },
    {
      id: 'calculator',
      category: isHindi ? 'एंटरप्राइज व निवेशक' : 'Enterprise & Investor',
      title: isHindi ? 'एंटरप्राइज फ्रॉड लॉस व ROI कैलकुलेटर' : 'Enterprise Fraud Loss & ROI Calculator',
      subtitle: isHindi ? 'बैंकों व फिनटेक हेतु वार्षिक बचत व 18.5x ROI' : 'Calculate annual loss prevention and 18.5x ROI',
      icon: Calculator,
      color: 'var(--emerald-500)',
      badge: 'CFO',
      action: () => { if (onOpenCalculator) onOpenCalculator(); onClose(); },
    },
    {
      id: 'forensics',
      category: isHindi ? 'एंटरप्राइज व निवेशक' : 'Enterprise & Investor',
      title: isHindi ? 'धारा 65B डिजिटल साक्ष्य प्रमाणपत्र' : 'Section 65B Cyber Forensic Certificate',
      subtitle: isHindi ? 'कोर्ट व 1930 पुलिस पोर्टल हेतु प्रमाणित रिपोर्ट' : 'Generate court-admissible SHA-256 sealed FIR evidence',
      icon: Scale,
      color: 'var(--cyan-500)',
      badge: 'Legal',
      action: () => { if (onOpenForensics) onOpenForensics(); onClose(); },
    },
    {
      id: 'api-sandbox',
      category: isHindi ? 'एंटरप्राइज व निवेशक' : 'Enterprise & Investor',
      title: isHindi ? 'डेवलपर हब व लाइव API सैंडबॉक्स' : 'Developer Hub & API Sandbox',
      subtitle: isHindi ? 'cURL, Python व Android Kotlin SDKs' : 'Explore REST endpoints with cURL, Python & Android SDK',
      icon: Code2,
      color: 'var(--primary)',
      badge: 'SDK',
      action: () => { if (onOpenApiPlayground) onOpenApiPlayground(); onClose(); },
    },
    {
      id: 'investor-room',
      category: isHindi ? 'एंटरप्राइज व निवेशक' : 'Enterprise & Investor',
      title: isHindi ? 'संस्थापक निवेशक डेटा रूम व अनुपालन केंद्र' : 'Investor Executive Data Room & Diligence',
      subtitle: isHindi ? '$15.2B बाजार अवसर, AI तकनीकी विशिष्टता व DPDP अनुपालन' : '$15.2B TAM, proprietary moat, and DPDP/RBI matrix',
      icon: TrendingUp,
      color: 'var(--violet-500)',
      badge: 'Seed',
      action: () => { if (onOpenInvestorDataRoom) onOpenInvestorDataRoom(); onClose(); },
    },
    {
      id: 'test-phish',
      category: isHindi ? 'त्वरित परीक्षण' : 'One-Click Test Samples',
      title: isHindi ? 'फिशिंग लिंक परीक्षण: नकली SBI KYC' : 'Test Phishing Link: SBI KYC Scam',
      subtitle: isHindi ? 'खतरनाक लिंक पहचान का डेमो देखें' : 'Simulate high-risk banking credential harvesting detection',
      icon: Zap,
      color: 'var(--crimson-500)',
      badge: 'Test',
      action: () => {
        onNavigate('scanner');
        if (onScanSample) onScanSample('http://sbi-kyc-update-verify99.tk/login', 'link');
        onClose();
      },
    },
    {
      id: 'test-safe',
      category: isHindi ? 'त्वरित परीक्षण' : 'One-Click Test Samples',
      title: isHindi ? 'सुरक्षित लिंक परीक्षण: आधिकारिक बैंक पोर्टल' : 'Test Safe Link: Official Bank Domain',
      subtitle: isHindi ? 'सत्यापित सुरक्षित वेबसाइट का डेमो देखें' : 'Simulate verified clean SSL and domain certificate',
      icon: ShieldCheck,
      color: 'var(--emerald-500)',
      badge: 'Test',
      action: () => {
        onNavigate('scanner');
        if (onScanSample) onScanSample('https://www.sbi.co.in/portal/web/home', 'link');
        onClose();
      },
    },
    {
      id: 'childmode',
      category: isHindi ? 'सेटिंग्स' : 'Preferences',
      title: isHindi 
        ? (isChildMode ? 'बाल सुरक्षा मोड बंद करें' : 'बाल सुरक्षा मोड चालू करें')
        : (isChildMode ? 'Disable Child Safety Guard' : 'Enable Child Safety Guard'),
      subtitle: isHindi ? 'वयस्क सामग्री व गेमिंग झांसों को ब्लॉक करें' : 'Block adult, gaming traps and predatory scams',
      icon: Baby,
      color: 'var(--emerald-500)',
      badge: isChildMode ? 'ON' : 'OFF',
      action: () => { if (toggleChildMode) toggleChildMode(); onClose(); },
    },
    {
      id: 'theme',
      category: isHindi ? 'सेटिंग्स' : 'Preferences',
      title: isHindi 
        ? (currentTheme === 'light' ? 'डार्क थीम पर बदलें' : 'लाइट थीम पर बदलें')
        : (currentTheme === 'light' ? 'Switch to Midnight Ops Dark Mode' : 'Switch to Arctic Ops Light Mode'),
      subtitle: isHindi ? 'रंग और थीम बदलें' : 'Toggle theme display mode',
      icon: currentTheme === 'light' ? Moon : Sun,
      color: 'var(--primary)',
      action: () => { if (toggleTheme) toggleTheme(); onClose(); },
    },
    {
      id: 'lang',
      category: isHindi ? 'सेटिंग्स' : 'Preferences',
      title: currentLanguage?.startsWith('hi') ? 'Switch to English (EN)' : 'हिंदी भाषा चुनें (HI)',
      subtitle: isHindi ? 'भाषा बदलें' : 'Toggle platform interface language',
      icon: Globe,
      color: 'var(--cyan-500)',
      action: () => { if (toggleLanguage) toggleLanguage(); onClose(); },
    },
  ], [onNavigate, onClose, onTriggerFreeze, onOpen1930Helpline, onOpenThreatMap, onOpenSimulator, onOpenCalculator, onOpenForensics, onOpenApiPlayground, onOpenInvestorDataRoom, onScanSample, toggleChildMode, isChildMode, currentTheme, toggleTheme, currentLanguage, toggleLanguage, isHindi]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      c => c.title.toLowerCase().includes(lower) ||
           c.subtitle.toLowerCase().includes(lower) ||
           c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Keyboard navigation within command list
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
          {/* Backdrop with high blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Command Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col font-sans"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(26, 108, 249, 0.15)',
            }}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <Search size={18} className="text-[var(--primary)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isHindi ? 'कमांड, खतरा या टूल खोजें... (उदा. स्कैन, फ्रीज, 1930)' : 'Type a command, threat type, or search...'}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
                ESC
              </kbd>
            </div>

            {/* Command Results List */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-10 text-center">
                  <Terminal size={24} className="mx-auto mb-2 text-[var(--text-muted)] opacity-50" />
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">
                    {isHindi ? 'कोई परिणाम नहीं मिला' : 'No commands found'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {isHindi ? '"स्कैन", "फ्रीज", "फिशिंग" या "हेल्प" लिखकर खोजें' : 'Try searching for "scan", "freeze", "phish", or "help"'}
                  </p>
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--surface-overlay)] text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)]/50'
                      }`}
                      style={{
                        border: isSelected ? '1px solid var(--border-brand)' : '1px solid transparent',
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: isSelected ? `${cmd.color}20` : 'var(--surface-inset)',
                            border: `1px solid ${isSelected ? cmd.color : 'var(--border-subtle)'}`,
                          }}
                        >
                          <Icon size={16} style={{ color: cmd.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-[var(--text-primary)] flex items-center gap-2">
                            <span>{cmd.title}</span>
                            {cmd.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] truncate">
                            {cmd.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-[var(--text-muted)]">
                        {isSelected && (
                          <span className="text-[11px] flex items-center gap-1 text-[var(--primary)] font-mono font-medium">
                            <span>{isHindi ? 'चलाएं' : 'Run'}</span>
                            <CornerDownLeft size={12} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Quick Keys */}
            <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--surface-card)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)]">↓</kbd>
                  <span className="ml-0.5">{isHindi ? 'नेविगेट' : 'Navigate'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)]">↵</kbd>
                  <span className="ml-0.5">{isHindi ? 'खोलें' : 'Execute'}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--primary)] font-semibold">
                <Zap size={12} />
                <span>{isHindi ? 'SATYA त्वरित खोज' : 'SATYA Spotlight'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
