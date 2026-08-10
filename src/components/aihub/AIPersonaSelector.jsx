import React, { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, RefreshCw, Check, Code, BookOpen, Globe, PenTool, ShieldAlert } from 'lucide-react';
import { askKavachAi } from '../../services/nemotronChatService';
import { useChildMode } from '../../context/ChildModeContext';

export const AI_PERSONAS = [
  {
    id: 'cyber-expert',
    name: 'Cyber Expert',
    emoji: '🛡️',
    description: 'Scam & phishing protection specialist',
    color: '#06b6d4', // cyan-500
    icon: ShieldAlert,
    prompts: [
      'Is this bank KYC link safe?',
      'How to report cyber fraud on 1930?',
      'What is phishing?',
      'How to secure WhatsApp account?',
    ],
    greeting: 'Namaste! 🛡️ I am **SATYA Cyber Expert**. Ask me about suspicious SMS, unknown links, phishing scams, or 1930 Helpline guidance in plain language!'
  },
  {
    id: 'coding-assistant',
    name: 'Coding Assistant',
    emoji: '💻',
    description: 'Debug code, explain algorithms & APIs',
    color: '#10b981', // emerald-500
    icon: Code,
    prompts: [
      'Fix JS async/await error',
      'Explain React useState hook',
      'Python list comprehension example',
      'Write a SQL JOIN query',
    ],
    greeting: 'Hey! 💻 I am **SATYA Code Assistant**. Paste your code error or ask about React, Python, JavaScript, SQL, or algorithm solutions!'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    emoji: '📚',
    description: 'Explain concepts simply, exam prep helper',
    color: '#a855f7', // purple-500
    icon: BookOpen,
    prompts: [
      'Explain photosynthesis simply',
      'CBSE Class 10 Math trigonometry formula',
      'Why is the sky blue?',
      'How does electric current work?',
    ],
    greeting: 'Namaste! 📚 I am **SATYA Teacher**. I break down complex school/exam topics into simple, fun explanations with real-life examples!'
  },
  {
    id: 'translator',
    name: 'Translator',
    emoji: '🌐',
    description: 'Hindi ↔ English real-time translation',
    color: '#f59e0b', // amber-500
    icon: Globe,
    prompts: [
      'Translate to Hindi: Please call me when you reach home',
      'Translate to English: Aapka din shubh ho',
      'Hinglish to English: Aaj bohot garmi hai',
      'Translate to Hindi: Cyber security guidelines',
    ],
    greeting: 'Namaste! 🌐 I am **SATYA Translator**. Type any sentence to translate instantly between **English ↔ Hindi ↔ Hinglish** with transliteration!'
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    emoji: '✍️',
    description: 'Stories, poems & content generation',
    color: '#f43f5e', // rose-500
    icon: PenTool,
    prompts: [
      'Write a short story about a cyber detective',
      'Create 3 catchy Instagram captions',
      'Write a Hindi poem about rain',
      'Write a formal leave application email',
    ],
    greeting: 'Namaste! ✍️ I am **SATYA Creative Writer**. I write short stories, rhyming poems, social media captions, essays, and formal emails!'
  }
];

export const getActivePersona = () => {
  return localStorage.getItem('active_persona') || 'cyber-expert';
};

export const setActivePersona = (id) => {
  localStorage.setItem('active_persona', id);
};

const AIPersonaSelector = memo(() => {
  const { isChildMode } = useChildMode();
  const [activeId, setActiveId] = useState(getActivePersona());
  const activePersona = AI_PERSONAS.find(p => p.id === activeId) || AI_PERSONAS[0];

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      sender: 'bot',
      text: activePersona.greeting,
      timestamp: new Date(),
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Reset conversation when active persona changes
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: activePersona.greeting,
        timestamp: new Date(),
      }
    ]);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectPersona = (id) => {
    setActiveId(id);
    setActivePersona(id);
  };

  const handleSend = async (userText) => {
    const text = userText || inputVal;
    if (!text || !text.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInputVal('');
    setIsTyping(true);

    const history = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    const aiRes = await askKavachAi(text.trim(), history, 'kavach-pro', isChildMode, {
      personaId: activeId
    });

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiRes.text,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="p-3 sm:p-5 space-y-5 font-mono">
      {/* Top Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2D4A] pb-3">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-[var(--text-primary)] uppercase flex items-center gap-2">
            <span>AI Persona Selection & Interactive Workspace</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Select an AI Persona below to launch its specialized assistant workspace</p>
        </div>
        
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs font-bold text-[var(--accent)] shrink-0 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>ACTIVE: {activePersona.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Grid of 5 Persona Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {AI_PERSONAS.map(persona => {
          const isActive = activeId === persona.id;
          return (
            <motion.button
              key={persona.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectPersona(persona.id)}
              className={`relative overflow-hidden flex flex-col p-3 rounded-xl border text-left transition-all ${
                isActive 
                  ? 'bg-[#131B2E] border-slate-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-slate-300' 
                  : 'bg-[#0B0F19] border-[#27395C] hover:border-slate-500 hover:bg-[#131B2E]/60'
              }`}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5" 
                style={{ backgroundColor: persona.color, opacity: isActive ? 1 : 0.6 }}
              />
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-2xl">{persona.emoji}</span>
                {isActive && <Check size={14} className="text-emerald-400 font-bold" />}
              </div>
              <span className={`font-bold text-xs mb-1 ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                {persona.name}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-tight">
                {persona.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Interactive AI Persona Chat Workspace */}
      <div className="bg-[#131B2E] border border-[#27395C] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
        {/* Workspace Header */}
        <div className="p-3 bg-[#0B0F19] border-b border-[#1E2D4A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg border" style={{ backgroundColor: `${activePersona.color}20`, borderColor: activePersona.color }}>
              {activePersona.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">{activePersona.name} Workspace</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold text-slate-950 uppercase" style={{ backgroundColor: activePersona.color }}>
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">{activePersona.description}</p>
            </div>
          </div>

          <button
            onClick={() => setMessages([{ id: Date.now(), sender: 'bot', text: activePersona.greeting, timestamp: new Date() }])}
            className="p-1.5 rounded-lg bg-[#131B2E] hover:bg-slate-800 border border-[#27395C] text-[var(--text-muted)] hover:text-slate-200 transition-colors text-xs flex items-center gap-1"
            title="Clear Workspace History"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline text-[10px]">Clear</span>
          </button>
        </div>

        {/* Quick Prompt Starter Chips */}
        <div className="p-2 bg-[#0B0F19]/80 border-b border-[#1E2D4A] flex items-center gap-2 overflow-x-auto text-xs">
          <Sparkles size={13} className="text-amber-400 shrink-0 ml-1" />
          <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-bold">Try Prompt:</span>
          {activePersona.prompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(promptText)}
              className="px-2.5 py-1 rounded-lg bg-[#131B2E] border border-[#27395C] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] whitespace-nowrap transition-all shrink-0 text-[10px] font-mono"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F19]/40 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-3.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[var(--accent)] text-slate-950 font-medium rounded-tr-none font-sans'
                    : 'bg-[#131B2E] border border-[#27395C] text-[var(--text-primary)] rounded-tl-none font-sans shadow-md'
                }`}
              >
                {m.text.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-1 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
              <span className="text-[9px] text-[var(--text-muted)] mt-1 font-mono px-1">
                {m.sender === 'user' ? 'You' : `${activePersona.name}`} •{' '}
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-2.5 bg-[#131B2E] border border-[#27395C] rounded-lg w-fit text-xs text-[var(--text-muted)] font-mono animate-pulse">
              <Bot size={14} className="text-[var(--accent)]" />
              <span>{activePersona.name} is processing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#131B2E] border-t border-[#1E2D4A]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Ask ${activePersona.name}...`}
              className="w-full pl-3.5 pr-10 py-2.5 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="absolute right-1.5 p-1.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 rounded-lg transition-all disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

AIPersonaSelector.displayName = 'AIPersonaSelector';
export default AIPersonaSelector;
