import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, X, Sparkles, Shield, RefreshCw, ChevronDown, Check,
  Mic, MicOff, Volume2, VolumeX, Copy, CheckCheck, Maximize2, Minimize2,
  Minus, ExternalLink, PhoneCall, Radio, AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { askKavachAi, RECOMMENDED_AI_MODELS } from '../../services/nemotronChatService';
import { useChildMode } from '../../context/ChildModeContext';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import useTextToSpeech from '../../hooks/useTextToSpeech';

// ── CUSTOM INLINE MARKDOWN & SECURITY ACTION RENDERER ────────────────────────
function FormattedChatMessage({ text, isUser, onActionClick }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap font-sans text-xs">{text}</span>;
  }

  // Parse markdown formatting into React elements
  const renderFormattedLine = (line, lineIdx) => {
    // 1. Headers (### or ##)
    if (line.startsWith('### ') || line.startsWith('## ')) {
      const headerText = line.replace(/^#{2,3}\s+/, '');
      return (
        <h4 key={lineIdx} className="font-bold text-cyan-400 text-xs sm:text-sm mt-2 mb-1 flex items-center gap-1.5 font-mono">
          <Shield size={13} className="text-cyan-400 shrink-0" />
          <span>{parseInlineStyles(headerText)}</span>
        </h4>
      );
    }

    // 2. Numbered lists: 1. , 2. , etc.
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1 text-xs">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            {numberedMatch[1]}
          </span>
          <span className="flex-1 leading-relaxed text-slate-200">
            {parseInlineStyles(numberedMatch[2])}
          </span>
        </div>
      );
    }

    // 3. Bullet points: * or -
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const bulletText = line.replace(/^[*\-]\s+/, '');
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
          <span className="flex-1 leading-relaxed text-slate-200">
            {parseInlineStyles(bulletText)}
          </span>
        </div>
      );
    }

    // 4. Regular paragraph
    if (!line.trim()) {
      return <div key={lineIdx} className="h-1.5" />;
    }

    return (
      <p key={lineIdx} className="mb-1.5 last:mb-0 leading-relaxed text-xs text-slate-200">
        {parseInlineStyles(line)}
      </p>
    );
  };

  // Helper to parse **bold**, `code`, links, phone numbers
  const parseInlineStyles = (content) => {
    // Regex for bold, code, URL, and 1930
    const parts = content.split(/(\*\*.*?\*\*|`.*?`|https?:\/\/[^\s)]+|\b1930\b)/g);

    return parts.map((part, i) => {
      if (!part) return null;

      // Bold **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white tracking-wide">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline code `code`
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#060a14] border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }

      // 1930 Helpline Quick Action
      if (part === '1930') {
        return (
          <a
            key={i}
            href="tel:1930"
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-[11px] hover:bg-amber-500/30 transition-all mx-0.5"
            title="Direct Call to National Cyber Crime Helpline"
          >
            <PhoneCall size={10} />
            <span>1930</span>
          </a>
        );
      }

      // URL Links
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px] break-all"
          >
            <span>{part}</span>
            <ExternalLink size={10} className="shrink-0" />
          </a>
        );
      }

      return part;
    });
  };

  const lines = text.split('\n');
  return <div className="space-y-0.5 font-sans">{lines.map((l, idx) => renderFormattedLine(l, idx))}</div>;
}

// ── MAIN KAVACH AI CHATBOT COMPONENT ─────────────────────────────────────────
export default function CyberAiChatbot({ isOpen, onToggle }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const { isChildMode } = useChildMode();

  const [selectedModelId, setSelectedModelId] = useState('kavach-pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [windowState, setWindowState] = useState('normal'); // 'normal' | 'maximized' | 'minimized'
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Voice recognition & Text-to-speech hooks
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported: voiceInputSupported } = useVoiceRecognition({
    lang: isHindi ? 'hi-IN' : 'en-IN',
  });
  const { speak, stop: stopSpeech, isSpeaking } = useTextToSpeech();

  const initialBotText = isHindi
    ? 'नमस्ते! मैं **कवच AI** हूँ, SATYA-GPT में आपका व्यक्तिगत साइबर सुरक्षा सहायक।\n\n- 🌐 **क्लोन वेबसाइट्स**: असली व नकली बैंक/सरकारी साइट्स की पहचान\n- 🔞 **18+ विज्ञापन ब्लॉकर**: बच्चों को ऑनलाइन सट्टेबाजी व जुए से सुरक्षा\n- 📢 **फ़िशिंग सर्च ऐड्स**: भ्रामक कस्टमर केयर नंबरों की जांच\n\nमुझसे कोई भी प्रश्न पूछें!'
    : 'Namaste! I am **KAVACH AI**, your personal cybersecurity assistant inside SATYA-GPT.\n\n- 🌐 **Clone Websites**: Instant detection of fake copycat portals (SBI, Income Tax, Amazon)\n- 🔞 **18+ Ad Guard**: Interception of online betting & predatory ads for minors\n- 📢 **Malvertising Shield**: Spot deceptive sponsored search ads & fake helplines\n\nAsk me any cybersecurity question or paste a suspicious link/SMS below!';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: initialBotText,
      modelName: 'KAVACH AI Pro',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeModel = RECOMMENDED_AI_MODELS.find((m) => m.id === selectedModelId) || RECOMMENDED_AI_MODELS[0];

  // Auto-fill speech transcript into input box
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const quickPrompts = isHindi
    ? [
        { label: '🌐 नकली SBI क्लोन जांचें', prompt: 'मुझे फर्जी SBI KYC का लिंक आया है, कैसे पहचानूं कि यह असली है या क्लोन?' },
        { label: '🔞 18+ सट्टेबाजी विज्ञापन', prompt: 'गेम में 18+ Teen Patti / Aviator विज्ञापन आ रहे हैं, बच्चों को कैसे सुरक्षित रखें?' },
        { label: '📞 1930 पुलिस हेल्पलाइन', prompt: 'साइबर फ्रॉड होने पर 1930 हेल्पलाइन पर शिकायत करने की पूरी प्रक्रिया क्या है?' },
        { label: '💳 15 मिनट बैंक फ्रीज', prompt: 'अगर धोखाधड़ी से पैसे कट जाएं तो तुरंत बैंक खाता कैसे फ्रीज करें?' },
      ]
    : [
        { label: '🌐 Detect Fake SBI Clone', prompt: 'How do I detect if an SBI KYC website is a fake copycat clone?' },
        { label: '🔞 Block 18+ Betting Ads', prompt: 'How does Child Guard block 18+ illegal betting apps & adult ads for minors?' },
        { label: '📞 Call 1930 Police Helpline', prompt: 'What is the step-by-step process to report financial fraud on 1930 Helpline?' },
        { label: '💳 15-Min Bank Account Freeze', prompt: 'How can I freeze my bank accounts and UPI immediately if scammed?' },
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && windowState !== 'minimized') {
      scrollToBottom();
    }
  }, [messages, isOpen, windowState]);

  const handleSend = async (userText) => {
    const text = userText || inputValue;
    if (!text || !text.trim() || isTyping) return;

    if (isListening) {
      stopListening();
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    resetTranscript();
    setIsTyping(true);

    const history = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    const aiRes = await askKavachAi(text.trim(), history, selectedModelId, isChildMode);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiRes.text,
        modelName: aiRes.modelName,
        timestamp: new Date(),
      },
    ]);
  };

  // Copy message to clipboard
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Speak bot response using SpeechSynthesis
  const handleToggleSpeak = (id, text) => {
    if (isSpeaking && speakingMsgId === id) {
      stopSpeech();
      setSpeakingMsgId(null);
    } else {
      stopSpeech();
      setSpeakingMsgId(id);
      // Clean markdown tags for natural speech
      const cleanText = text.replace(/[*#`_]/g, '');
      speak(cleanText, isHindi ? 'hi-IN' : 'en-IN');
    }
  };

  // Toggle voice recognition
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <>
      {/* Floating Action Button at Bottom-Right */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={onToggle}
          className="relative group px-4 py-2.5 bg-[#0B0F19] border border-cyan-500/50 hover:border-cyan-400 text-slate-100 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all hover:scale-105 flex items-center gap-2.5 font-mono font-bold text-xs cursor-pointer cyber-bracket backdrop-blur-md"
        >
          <div className="relative">
            <Bot size={18} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping absolute -top-1 -right-1" />
          </div>
          <span>{isHindi ? 'कवच AI सहायक' : 'KAVACH AI'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            PRO
          </span>
        </button>
      </div>

      {/* Slide-Out / Docked Cyber Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className={`fixed z-50 flex flex-col bg-[#0B0F19] border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] overflow-hidden cyber-bracket ${
              windowState === 'minimized'
                ? 'bottom-20 right-4 md:bottom-6 md:right-6 w-80 h-14'
                : windowState === 'maximized'
                ? 'inset-3 sm:inset-6 md:inset-10'
                : 'inset-x-3 bottom-20 top-16 sm:top-auto sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[440px] sm:h-[620px] max-h-[calc(100dvh-5.5rem)]'
            }`}
          >
            {/* Top Glowing Ambient Edge */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

            {/* Header with Model Selector & Window Controls */}
            <div className="px-3.5 py-2.5 bg-[#060a14] border-b border-[#1E2D4A] flex items-center justify-between font-mono shrink-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Bot size={17} />
                </div>

                {/* Interactive Model Selector Dropdown */}
                <div className="relative min-w-0">
                  <button
                    onClick={() => setShowModelDropdown((prev) => !prev)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#131B2E] hover:bg-[#1C2A47] border border-[#27395C] rounded-lg text-left transition-colors cursor-pointer min-w-0"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono font-bold text-xs text-slate-100 truncate">{activeModel.name}</span>
                        <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[8px] font-mono font-bold shrink-0">
                          {activeModel.badge}
                        </span>
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono truncate">{activeModel.provider}</span>
                    </div>
                    <ChevronDown size={14} className="text-[var(--text-muted)] ml-0.5 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showModelDropdown && (
                    <div className="absolute top-full left-0 mt-1.5 w-72 bg-[#0B0F19] border border-cyan-500/40 rounded-xl shadow-2xl z-50 p-2 space-y-1 font-mono backdrop-blur-xl">
                      <div className="text-[10px] text-cyan-400 px-2 py-1 border-b border-[#1E2D4A] font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>{isHindi ? 'सुरक्षा AI मॉडल चुनें' : 'SELECT CYBER AI ENGINE'}</span>
                        <Radio size={11} className="animate-pulse" />
                      </div>
                      {RECOMMENDED_AI_MODELS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModelId(m.id);
                            setShowModelDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                            selectedModelId === m.id
                              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                              : 'hover:bg-[#131B2E] text-slate-200'
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold truncate">{m.name}</span>
                              <span className="text-[8px] px-1 py-0.2 rounded bg-[#060a14] text-slate-400 border border-[#1E2D4A] shrink-0">
                                {m.badge}
                              </span>
                            </div>
                            <span className="text-[9.5px] text-[var(--text-muted)] truncate">{m.description}</span>
                          </div>
                          {selectedModelId === m.id && <Check size={14} className="text-cyan-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Window Controls: Clear, Minimize, Maximize, Close */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: Date.now(),
                        sender: 'bot',
                        text: isHindi
                          ? `नमस्ते! मैं कवच AI हूँ (**${activeModel.name}** द्वारा संचालित)। मैं आपकी क्या सहायता कर सकता हूँ?`
                          : `Namaste! I am KAVACH AI powered by **${activeModel.name}**. How can I assist you?`,
                        modelName: activeModel.name,
                        timestamp: new Date(),
                      },
                    ])
                  }
                  className="p-1.5 rounded-lg hover:bg-[#131B2E] text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                  title={isHindi ? 'चैट रीसेट करें' : 'Clear Chat'}
                >
                  <RefreshCw size={13} />
                </button>

                <button
                  onClick={() => setWindowState((prev) => (prev === 'minimized' ? 'normal' : 'minimized'))}
                  className="p-1.5 rounded-lg hover:bg-[#131B2E] text-slate-400 hover:text-slate-100 transition-colors cursor-pointer hidden sm:block"
                  title={windowState === 'minimized' ? 'Expand' : 'Minimize'}
                >
                  <Minus size={13} />
                </button>

                <button
                  onClick={() => setWindowState((prev) => (prev === 'maximized' ? 'normal' : 'maximized'))}
                  className="p-1.5 rounded-lg hover:bg-[#131B2E] text-slate-400 hover:text-slate-100 transition-colors cursor-pointer hidden sm:block"
                  title={windowState === 'maximized' ? 'Restore' : 'Maximize'}
                >
                  {windowState === 'maximized' ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>

                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* If minimized, show compact bar with quick expand button */}
            {windowState === 'minimized' ? (
              <div
                onClick={() => setWindowState('normal')}
                className="flex-1 px-3 flex items-center justify-between cursor-pointer hover:bg-cyan-500/5 transition-colors font-mono text-xs text-cyan-400"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>KAVACH AI Active</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">[Click to Expand]</span>
              </div>
            ) : (
              <>
                {/* Quick Security Prompt Chips */}
                <div className="p-2 bg-[#060a14] border-b border-[#1E2D4A] flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
                  <Sparkles size={12} className="text-amber-400 shrink-0 ml-1" />
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp.prompt)}
                      className="px-2.5 py-1 rounded-lg bg-[#131B2E] border border-[#27395C] text-slate-300 hover:text-cyan-300 hover:border-cyan-400 hover:bg-[#1C2A47] whitespace-nowrap transition-all shrink-0 font-mono text-[10.5px] cursor-pointer shadow-sm"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-[#0B0F19]/60 font-sans">
                  {messages.map((m) => {
                    const isBot = m.sender === 'bot';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[92%] sm:max-w-[85%] p-3.5 rounded-2xl relative group ${
                            isBot
                              ? 'bg-[#131B2E] border border-cyan-500/30 text-slate-100 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                              : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md font-medium'
                          }`}
                        >
                          <FormattedChatMessage text={m.text} isUser={!isBot} />

                          {/* Bot Message Action Toolbar (Copy & Read Aloud) */}
                          {isBot && (
                            <div className="mt-2.5 pt-2 border-t border-[#27395C]/60 flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                              <span className="flex items-center gap-1 text-cyan-400/80">
                                <Shield size={11} />
                                <span>{m.modelName || 'KAVACH AI Pro'}</span>
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleSpeak(m.id, m.text)}
                                  className={`p-1 rounded hover:bg-[#0B0F19] transition-colors cursor-pointer ${
                                    isSpeaking && speakingMsgId === m.id ? 'text-amber-400 animate-pulse' : 'hover:text-cyan-300'
                                  }`}
                                  title="Listen via Voice"
                                >
                                  {isSpeaking && speakingMsgId === m.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                </button>
                                <button
                                  onClick={() => handleCopy(m.id, m.text)}
                                  className="p-1 rounded hover:bg-[#0B0F19] hover:text-cyan-300 transition-colors cursor-pointer"
                                  title="Copy Response"
                                >
                                  {copiedMsgId === m.id ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[9px] text-[var(--text-muted)] mt-1 font-mono px-1">
                          {isBot ? `KAVACH` : (isHindi ? 'आप' : 'You')} •{' '}
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 p-3 bg-[#131B2E] border border-cyan-500/30 rounded-2xl rounded-tl-sm w-fit text-xs text-cyan-300 font-mono shadow-md animate-pulse">
                      <Shield size={14} className="animate-spin text-cyan-400" />
                      <span>{isHindi ? 'कवच AI खतरे का विश्लेषण कर रहा है...' : `KAVACH (${activeModel.name}) analyzing threat...`}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Live Speech Recognition Listening Bar */}
                {isListening && (
                  <div className="px-3.5 py-2 bg-cyan-950/60 border-t border-cyan-500/40 flex items-center justify-between text-xs text-cyan-300 font-mono animate-fade-in shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                      <span className="truncate">{isHindi ? 'बोलें, सुन रहा हूँ...' : 'Listening... Speak your query'}</span>
                    </div>
                    <button
                      onClick={stopListening}
                      className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* Input Footer with Voice Mic & Send Buttons */}
                <div className="p-3 bg-[#060a14] border-t border-[#1E2D4A] shrink-0">
                  <div className="relative flex items-center gap-1.5">
                    {/* Voice Recognition Mic Button */}
                    {voiceInputSupported && (
                      <button
                        type="button"
                        onClick={handleVoiceToggle}
                        className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                          isListening
                            ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                            : 'bg-[#131B2E] border-[#27395C] text-slate-300 hover:text-cyan-400 hover:border-cyan-400'
                        }`}
                        title={isListening ? 'Stop Listening' : 'Speak to KAVACH AI'}
                      >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>
                    )}

                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isHindi ? 'कवच AI से कोई भी साइबर सुरक्षा सवाल पूछें...' : `Ask KAVACH (${activeModel.name})...`}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-[#131B2E] border border-[#27395C] rounded-xl text-xs text-slate-100 font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isTyping}
                      className="absolute right-1.5 p-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-40 cursor-pointer shadow-md"
                      aria-label="Send Message"
                    >
                      <Send size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] font-mono mt-1.5 px-1">
                    <span>⚡ AI Defense: AES-256-GCM</span>
                    <span>1930 Helpline Aligned</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
