import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, X, Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = memo(({ onClose }) => {
  const { login, loginWithEmail } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSocialLogin = (provider) => {
    login(provider);
    if (onClose) onClose();
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.trim()) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      setEmailError('Invalid email format (e.g. user@example.com)');
      return;
    }

    setEmailError('');
    setIsSuccess(true);

    setTimeout(() => {
      loginWithEmail(emailInput.trim(), nameInput.trim());
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#131B2E] border border-[#27395C] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden font-mono"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[#0B0F19] transition-all"
        >
          <X size={16} />
        </button>

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-[var(--accent)] to-purple-500" />
        
        <div className="bg-[#0B0F19] p-3.5 rounded-full border border-[var(--accent)] mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <ShieldAlert className="w-8 h-8 text-[var(--accent)]" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-100 mb-1">Welcome to SATYA-GPT</h2>
        <p className="text-xs text-[var(--text-muted)] mb-5">Sign in via Email Magic Link or Social OAuth</p>

        {isSuccess ? (
          <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex flex-col items-center gap-2 text-emerald-300 animate-pulse my-4">
            <CheckCircle2 size={32} className="text-emerald-400" />
            <div className="font-bold text-sm">Magic Sign-in Link Verified!</div>
            <div className="text-[11px] text-emerald-200/80">Signing in as {emailInput}...</div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {/* Email Sign-In Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wider block mb-1">
                  Sign in with Email Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="enter-your-email@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Display Name (Optional)"
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {emailError && (
                <div className="text-rose-400 text-[11px] font-bold px-1">{emailError}</div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Send Magic Sign-in Link</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#1E2D4A]" />
              <span className="text-[10px] text-[var(--text-muted)] font-bold">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-[#1E2D4A]" />
            </div>

            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-transparent text-xs shadow-sm"
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
                onClick={() => handleSocialLogin('github')}
                className="py-2 px-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 text-xs shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => handleSocialLogin('guest')}
          className="mt-4 text-[11px] text-[var(--text-muted)] hover:text-slate-300 transition-colors underline underline-offset-4"
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  );
});

LoginModal.displayName = 'LoginModal';
export default LoginModal;
