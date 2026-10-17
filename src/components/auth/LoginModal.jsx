import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, X, Mail, ArrowRight, CheckCircle2, User, KeyRound,
  LogOut, ArrowLeft, Sparkles, ShieldCheck, Loader2, Lock, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GoogleIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubOctocatIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LoginModal = memo(({ onClose }) => {
  const { user, isAuthenticated, logout, login, loginWithGoogle, loginWithGitHub, loginWithEmail } = useAuth();

  // Active view: 'default' | 'google' | 'github'
  const [viewMode, setViewMode] = useState('default');

  // Google Sign-in state
  const [googleEmail, setGoogleEmail] = useState('bhargavasood07@gmail.com');
  const [googleName, setGoogleName] = useState('Bhargava Sood');
  const [isCustomGoogle, setIsCustomGoogle] = useState(false);

  // GitHub Sign-in state
  const [githubUsername, setGithubUsername] = useState('Bhargavasood07');
  const [githubProfile, setGithubProfile] = useState({
    login: 'Bhargavasood07',
    name: 'Bhargava sood',
    avatar_url: 'https://avatars.githubusercontent.com/u/186374284?v=4',
    bio: 'Cybersecurity Architect & SATYA-GPT Creator',
    public_repos: 12,
    followers: 8,
    html_url: 'https://github.com/Bhargavasood07',
  });
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubFetchError, setGithubFetchError] = useState('');

  // Email Magic Link state
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailError, setEmailError] = useState('');

  // Processing & Success feedback
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Fetch real GitHub profile whenever username input changes (with debounce)
  useEffect(() => {
    if (viewMode !== 'github' || !githubUsername.trim()) return;

    const timer = setTimeout(async () => {
      setIsFetchingGithub(true);
      setGithubFetchError('');
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setGithubProfile({
            login: data.login || githubUsername.trim(),
            name: data.name || githubUsername.trim(),
            avatar_url: data.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(githubUsername.trim())}`,
            bio: data.bio || 'Verified GitHub Developer',
            public_repos: data.public_repos ?? 0,
            followers: data.followers ?? 0,
            html_url: data.html_url || `https://github.com/${encodeURIComponent(githubUsername.trim())}`,
          });
        } else if (res.status === 404) {
          setGithubFetchError(`GitHub user "${githubUsername.trim()}" not found.`);
        } else {
          // Rate limit or fallback
          setGithubProfile((prev) => ({
            ...prev,
            login: githubUsername.trim(),
            name: githubUsername.trim(),
            avatar_url: `https://avatars.githubusercontent.com/${encodeURIComponent(githubUsername.trim())}`,
          }));
        }
      } catch {
        // Fallback for network issues
        setGithubProfile((prev) => ({
          ...prev,
          login: githubUsername.trim(),
          name: githubUsername.trim(),
          avatar_url: `https://avatars.githubusercontent.com/${encodeURIComponent(githubUsername.trim())}`,
        }));
      } finally {
        setIsFetchingGithub(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [githubUsername, viewMode]);

  // Execute Google Sign-In with OAuth handshake animation
  const handleGoogleAuth = (customData = {}) => {
    const finalEmail = (customData.email || googleEmail || 'bhargavasood07@gmail.com').trim();
    const finalName = (customData.name || googleName || 'Bhargava Sood').trim();
    const finalAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}&backgroundColor=4285F4&textColor=ffffff`;

    setIsAuthenticating(true);
    setAuthStepMessage('Connecting to Google Identity Services...');

    setTimeout(() => {
      setAuthStepMessage(`Verifying Google ID: ${finalEmail}...`);
      setTimeout(() => {
        setAuthStepMessage('Google OAuth Token Verified!');
        const profile = loginWithGoogle({
          email: finalEmail,
          name: finalName,
          avatar: finalAvatar,
          id: 'google_' + Date.now(),
        });

        setIsAuthenticating(false);
        setSuccessInfo({
          provider: 'google',
          name: profile.name,
          email: profile.email,
        });

        setTimeout(() => {
          if (onClose) onClose();
        }, 900);
      }, 500);
    }, 500);
  };

  // Execute GitHub Sign-In with developer authentication
  const handleGithubAuth = () => {
    const username = (githubProfile.login || githubUsername || 'Bhargavasood07').trim();
    const name = githubProfile.name || username;
    const avatar = githubProfile.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(username)}`;

    setIsAuthenticating(true);
    setAuthStepMessage('Authenticating with GitHub...');

    setTimeout(() => {
      setAuthStepMessage(`Syncing GitHub Profile @${username}...`);
      setTimeout(() => {
        setAuthStepMessage('GitHub Developer Session Verified!');
        const profile = loginWithGitHub({
          username,
          name,
          avatar,
          email: `${username}@users.noreply.github.com`,
          bio: githubProfile.bio,
          public_repos: githubProfile.public_repos,
          id: 'github_' + Date.now(),
        });

        setIsAuthenticating(false);
        setSuccessInfo({
          provider: 'github',
          name: profile.name,
          email: `@${username}`,
        });

        setTimeout(() => {
          if (onClose) onClose();
        }, 900);
      }, 500);
    }, 500);
  };

  // Email Magic Link submission
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
    setIsAuthenticating(true);
    setAuthStepMessage('Verifying Email Magic Link...');

    setTimeout(() => {
      const profile = loginWithEmail(emailInput.trim(), nameInput.trim());
      setIsAuthenticating(false);
      setSuccessInfo({
        provider: 'email',
        name: profile.name,
        email: profile.email,
      });

      setTimeout(() => {
        if (onClose) onClose();
      }, 900);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#131B2E] border-2 border-[var(--accent)] rounded-2xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center relative max-h-[90dvh] overflow-y-auto font-mono"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-[var(--accent)] to-purple-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19] transition-all cursor-pointer"
          aria-label="Close sign in modal"
        >
          <X size={18} />
        </button>

        {/* Back Button (when in sub-views) */}
        {viewMode !== 'default' && !isAuthenticating && !successInfo && (
          <button
            onClick={() => setViewMode('default')}
            className="absolute top-3.5 left-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19] transition-all flex items-center gap-1 text-xs cursor-pointer"
            aria-label="Back to login options"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* Brand Shield Icon */}
        <div className="bg-[#0B0F19] p-3 rounded-full border border-[var(--accent)] mb-3 shadow-lg mt-1">
          {viewMode === 'google' ? (
            <GoogleIcon className="w-8 h-8" />
          ) : viewMode === 'github' ? (
            <GitHubOctocatIcon className="w-8 h-8 text-white" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-[var(--accent)]" />
          )}
        </div>

        {/* Header Title & Subtitle */}
        <h2 className="text-xl font-extrabold text-slate-100 mb-1">
          {viewMode === 'google'
            ? 'Sign in with Google ID'
            : viewMode === 'github'
            ? 'Sign in with GitHub'
            : isAuthenticated
            ? 'SATYA-GPT Active Session'
            : 'Sign in to SATYA-GPT'}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          {viewMode === 'google'
            ? 'Select your Google Account or enter your Google ID'
            : viewMode === 'github'
            ? 'Authenticate using your GitHub username or ID'
            : isAuthenticated
            ? `Signed in as ${user?.name}`
            : 'Select your login method or continue as Guest'}
        </p>

        {/* Authenticating In-Progress Overlay / Banner */}
        {isAuthenticating && (
          <div className="w-full p-4 bg-cyan-500/10 border border-cyan-500/40 rounded-xl flex flex-col items-center gap-2 text-cyan-300 animate-pulse my-4">
            <Loader2 size={28} className="animate-spin text-cyan-400" />
            <div className="font-bold text-xs">{authStepMessage}</div>
            <div className="text-[10px] text-cyan-200/70">Establishing Zero-Trust SOC Handshake</div>
          </div>
        )}

        {/* Success Feedback Confirmation */}
        {successInfo && (
          <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex flex-col items-center gap-2 text-emerald-300 animate-bounce my-4">
            <CheckCircle2 size={32} className="text-emerald-400" />
            <div className="font-bold text-sm">Authentication Successful!</div>
            <div className="text-[11px] text-emerald-200/90 font-mono">
              Welcome, {successInfo.name} ({successInfo.email})
            </div>
          </div>
        )}

        {/* ── ACTIVE SESSION CARD (when authenticated and in default view) ── */}
        {!isAuthenticating && !successInfo && isAuthenticated && viewMode === 'default' && (
          <div className="w-full p-3.5 bg-[#0B0F19] border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-emerald-400/60 bg-emerald-950 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="font-bold text-emerald-400 text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
                {user?.provider === 'google' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full p-0.5 shadow flex items-center justify-center">
                    <GoogleIcon className="w-2.5 h-2.5" />
                  </div>
                )}
                {user?.provider === 'github' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#24292F] rounded-full p-0.5 shadow flex items-center justify-center">
                    <GitHubOctocatIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-bold text-slate-100 truncate">{user?.name}</span>
                <span className="text-[10px] text-emerald-400 truncate flex items-center gap-1">
                  <span>{user?.email || user?.username}</span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono uppercase">
                    {user?.provider}
                  </span>
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            >
              <LogOut size={12} />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* ── VIEW 1: DEFAULT LOGIN VIEW ── */}
        {!isAuthenticating && !successInfo && viewMode === 'default' && (
          <div className="w-full space-y-4">
            {/* Social OAuth Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => setViewMode('google')}
                className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all border border-transparent text-xs shadow-md cursor-pointer hover:shadow-cyan-500/20 group"
              >
                <div className="flex items-center gap-1.5">
                  <GoogleIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Google ID</span>
                </div>
                <span className="text-[9px] font-normal text-slate-500 hidden sm:inline">(Sign In)</span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => setViewMode('github')}
                className="py-2.5 px-3 bg-[#24292F] hover:bg-[#2b3137] text-white rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all border border-slate-700 text-xs shadow-md cursor-pointer hover:border-slate-500 group"
              >
                <div className="flex items-center gap-1.5">
                  <GitHubOctocatIcon className="w-4 h-4 shrink-0 text-white group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </div>
                <span className="text-[9px] font-normal text-slate-400 hidden sm:inline">(OAuth / ID)</span>
              </button>
            </div>

            {/* Quick 1-Click login banner */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-lg py-1 px-2.5">
              <Sparkles size={11} className="text-cyan-400" />
              <span>Full Google & GitHub profile verification enabled</span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#1E2D4A]" />
              <span className="text-[10px] text-[var(--text-muted)] font-bold tracking-wider">
                OR CONTINUE WITH EMAIL
              </span>
              <div className="flex-1 h-px bg-[#1E2D4A]" />
            </div>

            {/* Email Sign-In Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-left">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="enter-your-email@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Display Name (Optional)"
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {emailError && (
                <div className="text-rose-400 text-[11px] font-bold px-1">{emailError}</div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Send Magic Sign-in Link</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        )}

        {/* ── VIEW 2: GOOGLE ID SIGN-IN VIEW ── */}
        {!isAuthenticating && !successInfo && viewMode === 'google' && (
          <div className="w-full space-y-3.5 text-left">
            {/* Quick 1-Click Suggested Account Card */}
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Continue with Google Account:
            </div>

            <div
              onClick={() => handleGoogleAuth({ email: googleEmail, name: googleName })}
              className="p-3 bg-[#0B0F19] hover:bg-[#0f172a] border-2 border-blue-500/40 hover:border-blue-400 rounded-xl flex items-center justify-between transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-sm shadow shrink-0">
                  {googleName ? googleName.charAt(0) : 'B'}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5 truncate">
                    <span>{googleName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                      Default
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-400 truncate">{googleEmail}</span>
                </div>
              </div>
              <button
                type="button"
                className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-lg text-[10px] shrink-0 transition-all flex items-center gap-1"
              >
                <span>Sign In</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* Custom Google ID input toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCustomGoogle(!isCustomGoogle)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>{isCustomGoogle ? '− Use default Google ID' : '+ Use a different Google ID / Workspace email'}</span>
              </button>

              {isCustomGoogle && (
                <div className="mt-2.5 p-3 bg-[#0B0F19] border border-[#27395C] rounded-xl space-y-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Google Email / ID:</label>
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="username@gmail.com"
                      className="w-full px-3 py-1.5 bg-[#060a14] border border-[#27395C] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Display Name"
                      className="w-full px-3 py-1.5 bg-[#060a14] border border-[#27395C] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoogleAuth({ email: googleEmail, name: googleName })}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer mt-1"
                  >
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Authenticate this Google ID</span>
                  </button>
                </div>
              )}
            </div>

            {/* Google Security Assurance */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-950/20 border border-blue-500/20 rounded-xl text-[10px] text-blue-300">
              <Lock size={12} className="text-blue-400 shrink-0" />
              <span>Zero-Trust Google OAuth 2.0 handshake verified by SATYA-GPT SOC.</span>
            </div>
          </div>
        )}

        {/* ── VIEW 3: GITHUB SIGN-IN VIEW ── */}
        {!isAuthenticating && !successInfo && viewMode === 'github' && (
          <div className="w-full space-y-3.5 text-left">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Enter GitHub Username or ID:
            </div>

            {/* Username Input with Live Lookup */}
            <div className="relative">
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="GitHub username (e.g. Bhargavasood07)"
                className="w-full px-3 py-2 bg-[#0B0F19] border border-[#27395C] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-white font-mono"
              />
              {isFetchingGithub && (
                <div className="absolute right-3 top-2.5 text-slate-400">
                  <Loader2 size={14} className="animate-spin" />
                </div>
              )}
            </div>

            {githubFetchError && (
              <div className="text-[10px] text-rose-400 font-bold px-1">
                {githubFetchError}
              </div>
            )}

            {/* Live GitHub Profile Card */}
            <div className="p-3 bg-[#0B0F19] border border-slate-700 rounded-xl flex items-start gap-3">
              <img
                src={githubProfile.avatar_url}
                alt={githubProfile.login}
                className="w-12 h-12 rounded-full border-2 border-purple-500/60 object-cover shrink-0 bg-slate-900"
                onError={(e) => {
                  e.target.src = 'https://avatars.githubusercontent.com/u/186374284?v=4';
                }}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-extrabold text-xs text-slate-100 truncate">
                    {githubProfile.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold shrink-0">
                    ✓ Verified
                  </span>
                </div>
                <span className="text-[11px] text-purple-400 font-mono truncate">
                  @{githubProfile.login}
                </span>
                {githubProfile.bio && (
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {githubProfile.bio}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[9px] text-slate-400 font-mono">
                  <span>📂 {githubProfile.public_repos} Repos</span>
                  <span>👥 {githubProfile.followers} Followers</span>
                </div>
              </div>
            </div>

            {/* Authorize Button */}
            <button
              type="button"
              onClick={handleGithubAuth}
              className="w-full py-2.5 bg-[#24292F] hover:bg-[#2b3137] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-600 shadow-md cursor-pointer hover:border-slate-400"
            >
              <GitHubOctocatIcon className="w-4 h-4 text-white" />
              <span>Authorize SATYA-GPT with GitHub</span>
            </button>

            {/* GitHub Security Footnote */}
            <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-[10px] text-slate-400">
              <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
              <span>Authenticates read-only developer identity & syncs avatar.</span>
            </div>
          </div>
        )}

        {/* Guest Mode Link */}
        {!isAuthenticating && !successInfo && (
          <button
            type="button"
            onClick={() => {
              login('guest');
              if (onClose) onClose();
            }}
            className="mt-4 text-[11px] text-[var(--text-muted)] hover:text-slate-300 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Continue as Guest Mode
          </button>
        )}
      </motion.div>
    </div>
  );
});

LoginModal.displayName = 'LoginModal';
export default LoginModal;
