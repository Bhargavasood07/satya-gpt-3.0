import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, RefreshCw, KeyRound, X, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AccountSwitcherModal = memo(({ onClose, onOpenAdmin }) => {
  const { user, isAuthenticated, logout, openLoginModal, login } = useAuth();

  const userInitial = isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : 'G';

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-end p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-xs sm:max-w-sm bg-[#131B2E] border-2 border-[var(--accent)] rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative font-mono text-xs text-slate-200 mt-12 mr-1 sm:mr-4 space-y-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19] transition-all"
        >
          <X size={16} />
        </button>

        {/* Profile Card Header (Matching YouTube/Google Style) */}
        <div className="flex items-center gap-3.5 border-b border-[#1E2D4A] pb-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 border-2 border-[var(--accent)] flex items-center justify-center text-white font-extrabold text-lg shadow-lg shrink-0">
            {userInitial}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-extrabold text-sm text-slate-100 truncate">
              {isAuthenticated ? user?.name : 'Guest User'}
            </span>
            <span className="text-[11px] text-cyan-400 truncate">
              {isAuthenticated ? user?.email : '@guest-session'}
            </span>
            <span className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{isAuthenticated ? 'Authenticated Account' : 'Guest Account Active'}</span>
            </span>
          </div>
        </div>

        {/* Action Options */}
        <div className="space-y-2">
          <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-1">
            Account Options:
          </div>

          <button
            onClick={() => {
              onClose();
              openLoginModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md"
          >
            <RefreshCw size={15} />
            <span>Switch Account / Sign In</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                login('google');
                onClose();
              }}
              className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              onClick={() => {
                login('github');
                onClose();
              }}
              className="py-2.5 px-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-700 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <button
            onClick={() => {
              login('guest');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0B0F19] hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all border border-[#27395C]"
          >
            <User size={14} className="text-emerald-400" />
            <span>Continue as Guest</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenAdmin) onOpenAdmin();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold rounded-xl text-xs transition-all border border-amber-500/30"
          >
            <KeyRound size={14} className="text-amber-400" />
            <span>Founder Admin Vault</span>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-xs transition-all border border-rose-500/30 mt-1"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
});

AccountSwitcherModal.displayName = 'AccountSwitcherModal';
export default AccountSwitcherModal;
