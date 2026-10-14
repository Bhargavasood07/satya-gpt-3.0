import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ScanLine, Bot, ShieldAlert, PhoneCall, MapPin, GraduationCap,
  Baby, Sun, Moon, Globe, ArrowRight, ShieldCheck, Zap, X, Terminal, CornerDownLeft
} from 'lucide-react';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onScanSample,
  onTriggerFreeze,
  onOpenThreatMap,
  toggleTheme,
  currentTheme,
  toggleLanguage,
  currentLanguage,
  toggleChildMode,
  isChildMode,
}) {
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
      category: 'Core Actions',
      title: 'Scan Suspicious Link / SMS / QR',
      subtitle: 'Analyze against 92 security engines',
      icon: ScanLine,
      color: 'var(--primary)',
      badge: 'Enter',
      action: () => { onNavigate('scanner'); onClose(); },
    },
    {
      id: 'aihub',
      category: 'Core Actions',
      title: 'Open KAVACH AI Security Hub',
      subtitle: 'Voice chat, multimodal analysis & cyber personas',
      icon: Bot,
      color: 'var(--violet-500)',
      badge: 'Tab',
      action: () => { onNavigate('aihub'); onClose(); },
    },
    {
      id: 'freeze',
      category: 'Emergency Protocol',
      title: 'Trigger 15-Min Emergency Bank Freeze',
      subtitle: 'Golden Hour immediate account lock instructions',
      icon: ShieldAlert,
      color: 'var(--crimson-500)',
      badge: 'Critical',
      action: () => { onTriggerFreeze(); onClose(); },
    },
    {
      id: 'helpline',
      category: 'Emergency Protocol',
      title: 'Call 1930 National Cyber Fraud Helpline',
      subtitle: 'Official Govt of India Citizen Hotline',
      icon: PhoneCall,
      color: 'var(--amber-500)',
      badge: 'Govt',
      action: () => { window.location.href = 'tel:1930'; onClose(); },
    },
    {
      id: 'threatmap',
      category: 'Live Intelligence',
      title: 'Open Live Cyber Threat Map',
      subtitle: 'Real-time telemetry attacks across India',
      icon: MapPin,
      color: 'var(--cyan-500)',
      action: () => { onOpenThreatMap(); onClose(); },
    },
    {
      id: 'academy',
      category: 'Live Intelligence',
      title: 'Cyber Defense Academy',
      subtitle: '10 real-world fraud interactive scenarios',
      icon: GraduationCap,
      color: 'var(--amber-500)',
      action: () => { onNavigate('academy'); onClose(); },
    },
    {
      id: 'test-phish',
      category: 'One-Click Test Samples',
      title: 'Test Phishing Link: SBI KYC Scam',
      subtitle: 'Simulate high-risk banking credential harvesting detection',
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
      category: 'One-Click Test Samples',
      title: 'Test Safe Link: Official Bank Domain',
      subtitle: 'Simulate verified clean SSL and domain certificate',
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
      category: 'Preferences',
      title: isChildMode ? 'Disable Child Safety Guard' : 'Enable Child Safety Guard',
      subtitle: 'Block adult, gaming traps and predatory scams',
      icon: Baby,
      color: 'var(--emerald-500)',
      badge: isChildMode ? 'ON' : 'OFF',
      action: () => { if (toggleChildMode) toggleChildMode(); onClose(); },
    },
    {
      id: 'theme',
      category: 'Preferences',
      title: currentTheme === 'light' ? 'Switch to Midnight Ops Dark Mode' : 'Switch to Arctic Ops Light Mode',
      subtitle: 'Toggle theme display mode',
      icon: currentTheme === 'light' ? Moon : Sun,
      color: 'var(--primary)',
      action: () => { if (toggleTheme) toggleTheme(); onClose(); },
    },
    {
      id: 'lang',
      category: 'Preferences',
      title: currentLanguage?.startsWith('hi') ? 'Switch to English (EN)' : 'Switch to Hindi (हिंदी)',
      subtitle: 'Toggle platform interface language',
      icon: Globe,
      color: 'var(--cyan-500)',
      action: () => { if (toggleLanguage) toggleLanguage(); onClose(); },
    },
  ], [onNavigate, onClose, onTriggerFreeze, onOpenThreatMap, onScanSample, toggleChildMode, isChildMode, currentTheme, toggleTheme, currentLanguage, toggleLanguage]);

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
                placeholder="Type a command, threat type, or search..."
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">No commands found</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Try searching for "scan", "freeze", "phish", or "help"</p>
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
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
                            <span>Run</span>
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
                  <span className="ml-0.5">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)]">↵</kbd>
                  <span className="ml-0.5">Execute</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--primary)] font-semibold">
                <Zap size={12} />
                <span>SATYA Spotlight</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
