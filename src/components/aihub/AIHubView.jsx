import React, { useState, memo } from 'react';
import { Sparkles, Mic, Users, Globe, ArrowLeft } from 'lucide-react';
import VoiceChatPanel from './VoiceChatPanel';
import AIPersonaSelector from './AIPersonaSelector';
import WebSearchPanel from './WebSearchPanel';
import { motion, AnimatePresence } from 'framer-motion';

const HUB_FEATURES = [
  { id: 'personas', title: 'AI Personas', description: 'Choose specialized AI assistants', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'voice', title: 'Voice Chat', description: 'Hands-free AI voice conversations', icon: Mic, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'web', title: 'Real-Time Web Search', description: 'Search live information & web links', icon: Globe, color: 'text-rose-400', bg: 'bg-rose-500/10' }
];

const AIHubView = memo(() => {
  const [activePanel, setActivePanel] = useState(null);

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'voice': return <VoiceChatPanel />;
      case 'personas': return <AIPersonaSelector />;
      case 'web': return <WebSearchPanel />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] text-slate-200 font-mono">
      <div className="p-4 border-b border-[#27395C] bg-[#131B2E]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[var(--accent)]" />
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight uppercase tracking-wider">SATYA AI Hub — Advanced Intelligence</h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">Multimodal AI • Voice Assistant • AI Personas • Live Web Search</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {!activePanel ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {HUB_FEATURES.map(feature => (
                <div 
                  key={feature.id}
                  className="bg-[#131B2E] border border-[#27395C] rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:border-[var(--accent)] transition-all cursor-pointer shadow-lg group"
                  onClick={() => setActivePanel(feature.id)}
                >
                  <div className={`p-4 rounded-full ${feature.bg} group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{feature.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{feature.description}</p>
                  </div>
                  <button className="mt-2 px-6 py-2 bg-[#0B0F19] border border-[#27395C] group-hover:border-[var(--accent)] rounded-full text-xs font-bold transition-all text-slate-200">
                    Open
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-2 border-b border-[#27395C] bg-[#0B0F19]">
                <button 
                  onClick={() => setActivePanel(null)}
                  className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-slate-200 px-3 py-1.5 rounded transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to AI Hub Grid
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {renderActivePanel()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

AIHubView.displayName = 'AIHubView';
export default AIHubView;
