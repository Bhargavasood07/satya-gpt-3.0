import React, { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const AI_PERSONAS = [
  { id: 'cyber-expert', name: 'Cyber Expert', emoji: '🛡️', description: 'Scam & phishing protection specialist', color: '#06b6d4' }, // cyan-500
  { id: 'coding-assistant', name: 'Coding Assistant', emoji: '💻', description: 'Debug code, explain algorithms & APIs', color: '#10b981' }, // emerald-500
  { id: 'teacher', name: 'Teacher', emoji: '📚', description: 'Explain concepts simply, exam prep helper', color: '#a855f7' }, // purple-500
  { id: 'translator', name: 'Translator', emoji: '🌐', description: 'Hindi ↔ English real-time translation', color: '#f59e0b' }, // amber-500
  { id: 'creative-writer', name: 'Creative Writer', emoji: '✍️', description: 'Stories, poems & content generation', color: '#f43f5e' } // rose-500
];

export const getActivePersona = () => {
  return localStorage.getItem('active_persona') || 'cyber-expert';
};

export const setActivePersona = (id) => {
  localStorage.setItem('active_persona', id);
};

const AIPersonaSelector = memo(() => {
  const [activeId, setActiveId] = useState(getActivePersona());

  const handleSelect = (id) => {
    setActiveId(id);
    setActivePersona(id);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {AI_PERSONAS.map(persona => {
          const isActive = activeId === persona.id;
          return (
            <motion.button
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(persona.id)}
              className={`relative overflow-hidden flex flex-col p-4 rounded-xl border text-left transition-all ${
                isActive 
                  ? 'bg-[#131B2E] border-slate-400 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'bg-[#0B0F19] border-[#27395C] hover:border-slate-600'
              }`}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1" 
                style={{ backgroundColor: persona.color, opacity: isActive ? 1 : 0.5 }}
              />
              <span className="text-3xl mb-2">{persona.emoji}</span>
              <span className={`font-bold text-sm mb-1 ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                {persona.name}
              </span>
              <span className="text-xs text-[var(--text-muted)] line-clamp-2">
                {persona.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

AIPersonaSelector.displayName = 'AIPersonaSelector';
export default AIPersonaSelector;
