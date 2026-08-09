import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Shield, RefreshCw, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { askKavachAi, RECOMMENDED_AI_MODELS } from '../../services/nemotronChatService';
import { useChildMode } from '../../context/ChildModeContext';

export default function CyberAiChatbot({ isOpen, onToggle }) {
  const { t } = useTranslation();
  const { isChildMode } = useChildMode();
  const [selectedModelId, setSelectedModelId] = useState('kavach-pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! I am **KAVACH AI**, your personal cybersecurity assistant inside SATYA-GPT.\n\nAsk me about any suspicious SMS, fake bank link, or unknown QR code in plain language!',
      modelName: 'KAVACH AI Pro',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeModel = RECOMMENDED_AI_MODELS.find(m => m.id === selectedModelId) || RECOMMENDED_AI_MODELS[0];

  const quickPrompts = [
    'I received a fake SBI KYC SMS, what to do?',
    'How to report scam on 1930 Helpline?',
    'How does Child Guard keep my family safe?',
    'Is this link safe to click?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText) => {
    const text = userText || inputValue;
    if (!text || !text.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInputValue('');
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

  return (
    <>
      {/* Floating Action Button at Bottom-Right (Positioned above mobile navigation bar) */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={onToggle}
          className="relative group px-3.5 py-2.5 bg-[#131B2E] border border-[#27395C] hover:border-[var(--accent)] text-[var(--text-primary)] rounded-xl shadow-2xl transition-all hover:scale-105 flex items-center gap-2 font-mono font-bold text-xs"
        >
          <Bot size={18} className="text-[var(--accent)] animate-pulse" />
          <span>KAVACH AI</span>
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </button>
      </div>

      {/* Slide-Out Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-32 right-3 sm:right-6 w-[92vw] sm:w-[420px] h-[540px] sm:h-[580px] bg-[#131B2E] border border-[#27395C] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header with Model Selector */}
            <div className="p-3 bg-[#0B0F19] border-b border-[#1E2D4A] flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#131B2E] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <Bot size={16} />
                </div>
                
                {/* Interactive Model Engine Dropdown Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown((prev) => !prev)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-[#131B2E] hover:bg-[#1C2A47] border border-[#27395C] rounded-lg text-left transition-colors"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{activeModel.name}</span>
                        <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[8px] font-mono font-bold">
                          {activeModel.badge}
                        </span>
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono">{activeModel.provider}</span>
                    </div>
                    <ChevronDown size={14} className="text-[var(--text-muted)] ml-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {showModelDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-[#131B2E] border border-[#27395C] rounded-xl shadow-2xl z-50 p-1.5 space-y-1 font-mono">
                      <div className="text-[10px] text-[var(--text-muted)] px-2 py-1 border-b border-[#1E2D4A]">KAVACH AI ENGINES</div>
                      {RECOMMENDED_AI_MODELS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModelId(m.id);
                            setShowModelDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                            selectedModelId === m.id ? 'bg-[var(--accent-muted)] border border-[var(--accent)]/40 text-[var(--accent)]' : 'hover:bg-[#0B0F19] text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold">{m.name}</span>
                              <span className="text-[8px] px-1 py-0.2 rounded bg-[#0B0F19] text-[var(--text-muted)] border border-[#1E2D4A]">{m.badge}</span>
                            </div>
                            <span className="text-[9px] text-[var(--text-muted)]">{m.description}</span>
                          </div>
                          {selectedModelId === m.id && <Check size={14} className="text-[var(--accent)] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: Date.now(),
                        sender: 'bot',
                        text: `Namaste! I am KAVACH AI powered by **${activeModel.name}**. How can I assist you?`,
                        modelName: activeModel.name,
                        timestamp: new Date(),
                      },
                    ])
                  }
                  className="p-1.5 rounded hover:bg-[#131B2E] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded hover:bg-[#131B2E] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-[#0B0F19] border-b border-[#1E2D4A] flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <Sparkles size={12} className="text-amber-400 shrink-0 ml-1" />
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  className="px-2.5 py-1 rounded bg-[#131B2E] border border-[#27395C] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] whitespace-nowrap transition-all shrink-0 font-mono text-[10px]"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#0B0F19]/40 font-sans">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-lg text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[var(--accent)] text-slate-950 font-medium rounded-tr-none font-sans'
                        : 'bg-[#131B2E] border border-[#27395C] text-[var(--text-primary)] rounded-tl-none font-sans'
                    }`}
                  >
                    {m.text.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>

                  <span className="text-[9px] text-[var(--text-muted)] mt-1 font-mono px-1">
                    {m.sender === 'user' ? 'You' : `KAVACH (${m.modelName || 'KAVACH AI Pro'})`} •{' '}
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-2.5 bg-[#131B2E] border border-[#27395C] rounded-lg w-fit text-xs text-[var(--text-muted)] font-mono animate-pulse">
                  <Shield size={14} className="text-[var(--accent)]" />
                  <span>KAVACH ({activeModel.name}) is analyzing threat...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-[#131B2E] border-t border-[#1E2D4A]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask KAVACH (${activeModel.name})...`}
                  className="w-full pl-3 pr-10 py-2 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 p-1.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 rounded transition-all disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
