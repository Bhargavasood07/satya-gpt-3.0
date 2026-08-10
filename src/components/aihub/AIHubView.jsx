import React, { useState, memo } from 'react';
import { Sparkles, Image as ImageIcon, Mic, FileUp, Users, Globe, ArrowLeft } from 'lucide-react';
import ImageGeneratorPanel from './ImageGeneratorPanel';
import VoiceChatPanel from './VoiceChatPanel';
import FileUploadPanel from './FileUploadPanel';
import AIPersonaSelector from './AIPersonaSelector';
import WebSearchPanel from './WebSearchPanel';
import { motion, AnimatePresence } from 'framer-motion';

const HUB_FEATURES = [
  { id: 'personas', title: 'AI Personas', description: 'Choose specialized assistants', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'voice', title: 'Voice Chat', description: 'Hands-free AI conversations', icon: Mic, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'image', title: 'Image Gen', description: 'Create images from text', icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'files', title: 'Document Q&A', description: 'Chat with your files', icon: FileUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'web', title: 'Web Search', description: 'Real-time information', icon: Globe, color: 'text-rose-400', bg: 'bg-rose-500/10' }
];

const AIHubView = memo(() => {
  const [activePanel, setActivePanel] = useState(null);

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'image': return <ImageGeneratorPanel />;
      case 'voice': return <VoiceChatPanel />;
      case 'files': return <FileUploadPanel />;
      case 'personas': return <AIPersonaSelector />;
      case 'web': return <WebSearchPanel />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] text-slate-200">
      <div className="p-4 border-b border-[#27395C] bg-[#131B2E]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[var(--accent)]" />
          <div>
            <h1 className="font-bold text-lg leading-tight">SATYA AI Hub — Advanced Capabilities</h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">Multimodal AI • Voice • Image • Documents • Web Search</p>
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
              className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {HUB_FEATURES.map(feature => (
                <div 
                  key={feature.id}
                  className="bg-[#131B2E] border border-[#27395C] rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:border-slate-500 transition-colors cursor-pointer"
                  onClick={() => setActivePanel(feature.id)}
                >
                  <div className={`p-4 rounded-full ${feature.bg}`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{feature.description}</p>
                  </div>
                  <button className="mt-2 px-6 py-2 bg-[#0B0F19] border border-[#27395C] rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
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
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-slate-200 px-2 py-1 rounded transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Hub
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
