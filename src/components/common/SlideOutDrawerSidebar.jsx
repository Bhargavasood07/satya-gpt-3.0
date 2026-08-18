import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ScanLine, BookOpen, Sparkles, GraduationCap, Building2, Baby, BarChart3, ShieldAlert, Share2, ShieldCheck, MapPin, KeyRound, Download, X, Bot, Award, PhoneCall } from 'lucide-react';
import { useChildMode } from '../../context/ChildModeContext';

const SlideOutDrawerSidebar = memo(({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onOpenAdmin,
  onOpenPartner,
  onOpenGovtVerification,
  onOpenThreatMap,
  onOpenBankFreeze,
  onOpenFamilyShare,
  onOpenTrustBadge,
  onOpenChat,
  onInstallApp,
  isAppInstalled
}) => {
  const { isChildMode, toggleChildMode } = useChildMode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex font-mono text-slate-200">
      {/* Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Slide-out Drawer Panel */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-80 sm:w-96 max-w-[85vw] h-full bg-[#060a14] border-r-2 border-[var(--accent)] shadow-[15px_0_50px_rgba(0,229,255,0.25)] flex flex-col z-10 overflow-y-auto p-4 space-y-5 backdrop-blur-2xl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#1b2a47] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] font-extrabold shadow-md">
              ≡
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-100 tracking-wider">
                SATYA<span className="text-[var(--accent)]">-GPT</span>
              </div>
              <div className="text-[9px] text-purple-300 font-bold flex items-center gap-1">
                <Sparkles size={10} className="text-purple-400 animate-pulse" />
                <span>LIQUID CRYSTAL v12.0</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0d1629] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Main Navigation Category */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider px-1">
            Main System Pages
          </div>

          <button
            onClick={() => { onTabChange('dashboard'); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)] shadow-md'
                : 'text-slate-300 hover:bg-[#0d1629]'
            }`}
          >
            <LayoutDashboard size={17} />
            <span>SOC Dashboard (Home)</span>
          </button>

          <button
            onClick={() => { onTabChange('scanner'); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)] shadow-md'
                : 'text-slate-300 hover:bg-[#0d1629]'
            }`}
          >
            <ScanLine size={17} />
            <span>AI Threat Scanner</span>
          </button>

          <button
            onClick={() => { onTabChange('guidedocs'); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'guidedocs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                : 'text-slate-300 hover:bg-[#0d1629]'
            }`}
          >
            <BookOpen size={17} className="text-amber-400" />
            <span>Guide & Documentation</span>
          </button>

          <button
            onClick={() => { onTabChange('aihub'); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'aihub'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md'
                : 'text-slate-300 hover:bg-[#0d1629]'
            }`}
          >
            <Sparkles size={17} className="text-purple-400" />
            <span>AI Intelligence Hub</span>
          </button>

          <button
            onClick={() => { onTabChange('academy'); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'academy'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                : 'text-slate-300 hover:bg-[#0d1629]'
            }`}
          >
            <GraduationCap size={17} className="text-amber-400" />
            <span>Kavach Cyber Academy</span>
          </button>

          <button
            onClick={() => { onTabChange('analytics'); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                : 'text-slate-300 hover:bg-[#0d1629]'
            }`}
          >
            <BarChart3 size={17} />
            <span>Security Analytics</span>
          </button>
        </div>

        {/* 2. Emergency & Defense Actions */}
        <div className="space-y-1.5 pt-2 border-t border-[#1b2a47]">
          <div className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider px-1">
            Emergency & Safety Tools
          </div>

          <button
            onClick={() => { onClose(); onOpenBankFreeze(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg animate-pulse cursor-pointer"
          >
            <ShieldAlert size={17} />
            <span>15-Min Emergency Bank Freeze</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenFamilyShare(); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#0d1629] text-amber-300 hover:bg-slate-800 border border-amber-500/30 cursor-pointer"
          >
            <Share2 size={16} className="text-amber-400" />
            <span>1-Click Family Guard Share</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenTrustBadge(); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#0d1629] text-emerald-400 hover:bg-slate-800 border border-emerald-500/30 cursor-pointer"
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Trust Badge Seal Generator</span>
          </button>

          <button
            onClick={() => { toggleChildMode(); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isChildMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                : 'bg-[#0d1629] text-slate-300 border-[#24375b]'
            }`}
          >
            <Baby size={16} className={isChildMode ? 'text-amber-400' : ''} />
            <span>Child Guard ({isChildMode ? 'ACTIVE' : 'OFF'})</span>
          </button>
        </div>

        {/* 3. Government & Verification */}
        <div className="space-y-1.5 pt-2 border-t border-[#1b2a47]">
          <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider px-1">
            Govt & Nodal Intelligence
          </div>

          <button
            onClick={() => { onClose(); onOpenGovtVerification(); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#0d1629] text-amber-300 hover:bg-slate-800 border border-amber-500/30 cursor-pointer"
          >
            <Building2 size={16} className="text-amber-400" />
            <span>MeitY / CERT-In Verification</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenThreatMap(); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#0d1629] text-cyan-300 hover:bg-slate-800 border border-cyan-500/30 cursor-pointer"
          >
            <MapPin size={16} className="text-cyan-400" />
            <span>Live State Threat Heatmap</span>
          </button>

          <button
            onClick={() => { onClose(); onOpenAdmin(); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-[#0d1629] text-amber-300 hover:bg-slate-800 border border-[#24375b] cursor-pointer"
          >
            <KeyRound size={16} className="text-amber-400" />
            <span>Founder Admin Vault</span>
          </button>
        </div>

        {/* Quick Footer Action */}
        <div className="mt-auto pt-3 border-t border-[#1b2a47] space-y-2">
          <button
            onClick={() => { onClose(); onOpenChat(); }}
            className="w-full py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Bot size={16} />
            <span>Open KAVACH AI Chatbot</span>
          </button>
        </div>
      </motion.aside>
    </div>
  );
});

SlideOutDrawerSidebar.displayName = 'SlideOutDrawerSidebar';
export default SlideOutDrawerSidebar;
