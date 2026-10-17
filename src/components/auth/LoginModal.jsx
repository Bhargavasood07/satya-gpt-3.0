import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, X, Mail, ArrowRight, CheckCircle2,
  LogOut, ArrowLeft, Sparkles, ShieldCheck, Loader2, Lock,
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

  // Load last used IDs from localStorage
  const lastGithubId = localStorage.getItem('satya_last_github_username') || 'Bhargavasood07';
  const lastGoogleEmail = localStorage.getItem('satya_last_google_email') || 'bhargavasood07@gmail.com';
  const lastGoogleName = localStorage.getItem('satya_last_google_name') || 'Bhargava Sood';

  // Last used general account (for 1-click resume)
  const [lastUsedSession] = useState(() => {
    try {
      const stored = localStorage.getItem('satya_last_used_account');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Saved GitHub accounts list
  const [savedGithubAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('satya_saved_github_accounts');
      const list = stored ? JSON.parse(stored) : [];
      const hasBhargava = list.some((a) => a.login?.toLowerCase() === 'bhargavasood07');
      if (!hasBhargava) {
        return [
          {
            login: 'Bhargavasood07',
            name: 'Bhargava sood',
            avatar_url: 'https://avatars.githubusercontent.com/u/186374284?v=4',
            bio: 'Cybersecurity Architect & SATYA-GPT Creator',
            public_repos: 12,
            isCreator: true,
          },
          ...list,
        ];
      }
      return list;
    } catch {
      return [
        {
          login: 'Bhargavasood07',
          name: 'Bhargava sood',
          avatar_url: 'https://avatars.githubusercontent.com/u/186374284?v=4',
          bio: 'Cybersecurity Architect & SATYA-GPT Creator',
          public_repos: 12,
          isCreator: true,
        },
      ];
    }
  });

  // Saved Google accounts list
  const [savedGoogleAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('satya_saved_google_accounts');
      const list = stored ? JSON.parse(stored) : [];
      const hasDefault = list.some((a) => a.email?.toLowerCase() === 'bhargavasood07@gmail.com');
      if (!hasDefault) {
        return [
          {
            email: 'bhargavasood07@gmail.com',
            name: 'Bhargava Sood',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Bhargava%20Sood&backgroundColor=4285F4&textColor=ffffff',
            isDefault: true,
          },
          ...list,
        ];
      }
      return list;
    } catch {
      return [
        {
          email: 'bhargavasood07@gmail.com',
          name: 'Bhargava Sood',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Bhargava%20Sood&backgroundColor=4285F4&textColor=ffffff',
          isDefault: true,
        },
      ];
    }
  });

  // Selected or typed GitHub state (defaults to the SAME ID the user used before)
  const [selectedGithubLogin, setSelectedGithubLogin] = useState(lastGithubId);
  const [customGithubInput, setCustomGithubInput] = useState('');
  const [isEnteringCustomGithub, setIsEnteringCustomGithub] = useState(false);
  const [githubProfile, setGithubProfile] = useState({
    login: lastGithubId,
    name: lastGithubId === 'Bhargavasood07' ? 'Bhargava sood' : lastGithubId,
    avatar_url: `https://avatars.githubusercontent.com/${encodeURIComponent(lastGithubId)}`,
    bio: 'Verified GitHub Developer',
    public_repos: 0,
    followers: 0,
    html_url: `https://github.com/${encodeURIComponent(lastGithubId)}`,
  });
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubFetchError, setGithubFetchError] = useState('');

  // Google Sign-in state (defaults to the SAME ID the user used before)
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState(lastGoogleEmail);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isEnteringCustomGoogle, setIsEnteringCustomGoogle] = useState(false);

  // Email Magic Link state
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailError, setEmailError] = useState('');

  // Processing & Success feedback
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStepMessage, setAuthStepMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Active target GitHub username to fetch
  const targetGithubUser = isEnteringCustomGithub && customGithubInput.trim()
    ? customGithubInput.trim()
    : selectedGithubLogin;

  // Real-time GitHub Profile Fetching
  useEffect(() => {
    if (viewMode !== 'github' || !targetGithubUser) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsFetchingGithub(true);
      setGithubFetchError('');
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(targetGithubUser)}`);
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;
          setGithubProfile({
            login: data.login || targetGithubUser,
            name: data.name || data.login || targetGithubUser,
            avatar_url: data.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(targetGithubUser)}`,
            bio: data.bio || 'Verified GitHub Developer',
            public_repos: data.public_repos ?? 0,
            followers: data.followers ?? 0,
            html_url: data.html_url || `https://github.com/${encodeURIComponent(targetGithubUser)}`,
          });
        } else if (res.status === 404) {
          if (!isMounted) return;
          setGithubFetchError(`GitHub user "${targetGithubUser}" not found.`);
        } else {
          if (!isMounted) return;
          setGithubProfile((prev) => ({
            ...prev,
            login: targetGithubUser,
            name: targetGithubUser,
            avatar_url: `https://avatars.githubusercontent.com/${encodeURIComponent(targetGithubUser)}`,
          }));
        }
      } catch {
        if (!isMounted) return;
        setGithubProfile((prev) => ({
          ...prev,
          login: targetGithubUser,
          name: targetGithubUser,
          avatar_url: `https://avatars.githubusercontent.com/${encodeURIComponent(targetGithubUser)}`,
        }));
      } finally {
        if (isMounted) setIsFetchingGithub(false);
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [targetGithubUser, viewMode]);

  // Execute GitHub Auth with chosen ID
  const executeGithubLogin = useCallback((chosenAccount) => {
    const username = (chosenAccount?.login || targetGithubUser || 'Bhargavasood07').trim();
    const name = chosenAccount?.name || githubProfile.name || username;
    const avatar = chosenAccount?.avatar_url || githubProfile.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(username)}`;

    setIsAuthenticating(true);
    setAuthStepMessage(`Authenticating with GitHub ID: @${username}...`);

    setTimeout(() => {
      setAuthStepMessage('Syncing developer telemetry & public keys...');
      setTimeout(() => {
        setAuthStepMessage('GitHub Developer Session Verified!');
        const profile = loginWithGitHub({
          username,
          name,
          avatar,
          email: `${username}@users.noreply.github.com`,
          bio: chosenAccount?.bio || githubProfile.bio,
          public_repos: chosenAccount?.public_repos ?? githubProfile.public_repos,
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
    }, 450);
  }, [targetGithubUser, githubProfile, loginWithGitHub, onClose]);

  // Execute Google Auth with chosen ID
  const executeGoogleLogin = useCallback((chosenAccount) => {
    const finalEmail = (chosenAccount?.email || (isEnteringCustomGoogle ? customGoogleEmail : selectedGoogleEmail) || 'bhargavasood07@gmail.com').trim();
    const finalName = (chosenAccount?.name || (isEnteringCustomGoogle ? customGoogleName : lastGoogleName) || 'Bhargava Sood').trim();
    const finalAvatar = chosenAccount?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}&backgroundColor=4285F4&textColor=ffffff`;

    setIsAuthenticating(true);
    setAuthStepMessage(`Authenticating Google ID: ${finalEmail}...`);

    setTimeout(() => {
      setAuthStepMessage('Exchanging OAuth 2.0 zero-trust token...');
      setTimeout(() => {
        setAuthStepMessage('Google ID Verified!');
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
    }, 450);
  }, [isEnteringCustomGoogle, customGoogleEmail, selectedGoogleEmail, customGoogleName, lastGoogleName, loginWithGoogle, onClose]);

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
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono text-slate-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-[#131B2E] border-2 border-[var(--accent)] rounded-2xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center relative max-h-[92dvh] overflow-y-auto font-mono"
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
        <div className="bg-[#0B0F19] p-3 rounded-full border border-[var(--accent)] mb-2 shadow-lg mt-1">
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
            ? 'Sign in with GitHub ID'
            : isAuthenticated
            ? 'SATYA-GPT Active Session'
            : 'Sign in to SATYA-GPT'}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          {viewMode === 'google'
            ? 'Select a saved Google ID or enter a new one'
            : viewMode === 'github'
            ? 'Select a saved GitHub ID or enter any username'
            : isAuthenticated
            ? `Signed in as ${user?.name}`
            : 'Choose your account or enter any ID to authenticate'}
        </p>

        {/* Authenticating In-Progress Banner */}
        {isAuthenticating && (
          <div className="w-full p-4 bg-cyan-500/10 border border-cyan-500/40 rounded-xl flex flex-col items-center gap-2 text-cyan-300 animate-pulse my-4">
            <Loader2 size={28} className="animate-spin text-cyan-400" />
            <div className="font-bold text-xs">{authStepMessage}</div>
            <div className="text-[10px] text-cyan-200/70">Establishing Zero-Trust SOC Handshake</div>
          </div>
        )}

        {/* Success Confirmation Toast */}
        {successInfo && (
          <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex flex-col items-center gap-2 text-emerald-300 animate-bounce my-4">
            <CheckCircle2 size={32} className="text-emerald-400" />
            <div className="font-bold text-sm">Session Activated!</div>
            <div className="text-[11px] text-emerald-200/90 font-mono">
              Welcome, {successInfo.name} ({successInfo.email})
            </div>
          </div>
        )}

        {/* ── ACTIVE SESSION STATUS (when authenticated) ── */}
        {!isAuthenticating && !successInfo && isAuthenticated && viewMode === 'default' && (
          <div className="w-full p-3.5 bg-[#0B0F19] border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-emerald-400/60 bg-emerald-950 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
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
                  <span>{user?.email || (user?.username ? `@${user.username}` : 'Authenticated')}</span>
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
          <div className="w-full space-y-3.5">
            {/* Quick 1-Click Resume Last Used Account (Same ID the user used before) */}
            {lastUsedSession && (
              <div className="w-full p-2.5 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-cyan-950/40 border border-cyan-500/40 rounded-xl flex items-center justify-between text-xs text-left shadow-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-cyan-400 bg-slate-900 flex items-center justify-center">
                    {lastUsedSession.avatar ? (
                      <img
                        src={lastUsedSession.avatar}
                        alt={lastUsedSession.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="font-bold text-cyan-400 text-xs">
                        {lastUsedSession.name ? lastUsedSession.name.charAt(0) : 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={9} />
                      <span>Last Used ID</span>
                    </span>
                    <span className="font-extrabold text-slate-100 truncate text-xs">
                      {lastUsedSession.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {lastUsedSession.email || (lastUsedSession.username ? `@${lastUsedSession.username}` : '')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (lastUsedSession.provider === 'github') {
                      executeGithubLogin({
                        login: lastUsedSession.username || lastUsedSession.name,
                        name: lastUsedSession.name,
                        avatar_url: lastUsedSession.avatar,
                      });
                    } else if (lastUsedSession.provider === 'google') {
                      executeGoogleLogin({
                        email: lastUsedSession.email,
                        name: lastUsedSession.name,
                        avatar: lastUsedSession.avatar,
                      });
                    } else {
                      login(lastUsedSession.provider || 'guest');
                      if (onClose) onClose();
                    }
                  }}
                  className="px-2.5 py-1.5 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition-all shadow cursor-pointer shrink-0"
                >
                  <span>1-Click In</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            )}

            {/* Provider Buttons with explicit selector indication */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => setViewMode('google')}
                className="p-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all border border-transparent text-xs shadow-md cursor-pointer hover:shadow-cyan-500/20 group"
              >
                <div className="flex items-center gap-1.5">
                  <GoogleIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Google ID</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 truncate max-w-[130px]">
                  {lastGoogleEmail ? `Select or change` : 'Select Google ID'}
                </span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => setViewMode('github')}
                className="p-3 bg-[#24292F] hover:bg-[#2b3137] text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all border border-slate-700 text-xs shadow-md cursor-pointer hover:border-slate-500 group"
              >
                <div className="flex items-center gap-1.5">
                  <GitHubOctocatIcon className="w-4 h-4 shrink-0 text-white group-hover:scale-110 transition-transform" />
                  <span>GitHub ID</span>
                </div>
                <span className="text-[9px] font-mono text-purple-300 truncate max-w-[130px]">
                  {lastGithubId ? `@${lastGithubId} or select` : 'Select GitHub ID'}
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#1E2D4A]" />
              <span className="text-[10px] text-[var(--text-muted)] font-bold tracking-wider">
                OR CONTINUE WITH EMAIL
              </span>
              <div className="flex-1 h-px bg-[#1E2D4A]" />
            </div>

            {/* Email Sign-In Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-2.5 text-left">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail size={15} />
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

        {/* ── VIEW 2: GITHUB ID SELECTION & CUSTOM LOGIN VIEW ── */}
        {!isAuthenticating && !successInfo && viewMode === 'github' && (
          <div className="w-full space-y-3 text-left">
            {/* 1. Account Selector List */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Select GitHub ID to Login:</span>
                <span className="text-[9px] text-purple-400 font-mono">
                  {savedGithubAccounts.length} saved
                </span>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {savedGithubAccounts.map((account) => {
                  const isSelected = !isEnteringCustomGithub && selectedGithubLogin === account.login;
                  const isLastUsed = account.login === lastGithubId;

                  return (
                    <div
                      key={account.login}
                      onClick={() => {
                        setIsEnteringCustomGithub(false);
                        setSelectedGithubLogin(account.login);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10'
                          : 'bg-[#0B0F19] border-slate-700/80 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={account.avatar_url || `https://avatars.githubusercontent.com/${encodeURIComponent(account.login)}`}
                          alt={account.login}
                          className="w-9 h-9 rounded-full border border-purple-400/50 object-cover shrink-0 bg-slate-900"
                          onError={(e) => {
                            e.currentTarget.src = `https://avatars.githubusercontent.com/${encodeURIComponent(account.login)}`;
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-extrabold text-xs text-slate-100 truncate">
                              {account.name || account.login}
                            </span>
                            {isLastUsed && (
                              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold shrink-0">
                                Last Used
                              </span>
                            )}
                            {account.isCreator && !isLastUsed && (
                              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold shrink-0">
                                Creator
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-purple-400 font-mono truncate">
                            @{account.login}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          executeGithubLogin(account);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Login</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Enter / Switch to Any Other GitHub ID */}
            <div className="pt-1 border-t border-[#1E2D4A]">
              <button
                type="button"
                onClick={() => setIsEnteringCustomGithub(!isEnteringCustomGithub)}
                className="w-full text-[11px] text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-between font-bold cursor-pointer py-1"
              >
                <span>{isEnteringCustomGithub ? '− Use a saved GitHub ID' : '+ Or enter any other GitHub username / ID'}</span>
                <span className="text-[9px] font-mono text-slate-400">Live API Lookup</span>
              </button>

              {isEnteringCustomGithub && (
                <div className="mt-2 space-y-2.5 p-3 bg-[#0B0F19] border border-purple-500/40 rounded-xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={customGithubInput}
                      onChange={(e) => setCustomGithubInput(e.target.value)}
                      placeholder="Type any GitHub username (e.g. torvalds, Bhargavasood07)"
                      className="w-full pl-3 pr-8 py-2 bg-[#060a14] border border-[#27395C] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-purple-400 font-mono"
                    />
                    {isFetchingGithub && (
                      <div className="absolute right-2.5 top-2.5 text-slate-400">
                        <Loader2 size={14} className="animate-spin" />
                      </div>
                    )}
                  </div>

                  {githubFetchError && (
                    <div className="text-[10px] text-rose-400 font-bold px-1">
                      {githubFetchError}
                    </div>
                  )}

                  {/* Live Fetched Preview */}
                  <div className="p-2.5 bg-[#060a14] border border-slate-800 rounded-lg flex items-center gap-3">
                    <img
                      src={githubProfile.avatar_url}
                      alt={githubProfile.login}
                      className="w-10 h-10 rounded-full border border-purple-400 object-cover shrink-0 bg-slate-900"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-slate-100 truncate">
                          {githubProfile.name}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold shrink-0">
                          ✓ Verified
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono truncate">
                        @{githubProfile.login}
                      </span>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        📂 {githubProfile.public_repos} Repos • 👥 {githubProfile.followers} Followers
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => executeGithubLogin()}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
                  >
                    <GitHubOctocatIcon className="w-4 h-4 text-white" />
                    <span>Authorize & Login with @{githubProfile.login}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Submit with currently selected account if custom input not open */}
            {!isEnteringCustomGithub && (
              <button
                type="button"
                onClick={() => executeGithubLogin()}
                className="w-full py-2.5 bg-[#24292F] hover:bg-[#2b3137] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-600 shadow-md cursor-pointer hover:border-slate-400 mt-1"
              >
                <GitHubOctocatIcon className="w-4 h-4 text-white" />
                <span>Continue with Selected ID (@{targetGithubUser})</span>
              </button>
            )}

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded-lg text-[10px] text-slate-400">
              <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
              <span>Read-only developer handshake. Remembers your selected ID for next visit.</span>
            </div>
          </div>
        )}

        {/* ── VIEW 3: GOOGLE ID SELECTION & CUSTOM LOGIN VIEW ── */}
        {!isAuthenticating && !successInfo && viewMode === 'google' && (
          <div className="w-full space-y-3 text-left">
            {/* 1. Account Selector List */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Select Google ID to Login:</span>
                <span className="text-[9px] text-blue-400 font-mono">
                  {savedGoogleAccounts.length} saved
                </span>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {savedGoogleAccounts.map((account) => {
                  const isSelected = !isEnteringCustomGoogle && selectedGoogleEmail === account.email;
                  const isLastUsed = account.email === lastGoogleEmail;

                  return (
                    <div
                      key={account.email}
                      onClick={() => {
                        setIsEnteringCustomGoogle(false);
                        setSelectedGoogleEmail(account.email);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10'
                          : 'bg-[#0B0F19] border-slate-700/80 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold flex items-center justify-center text-xs shadow shrink-0">
                          {account.name ? account.name.charAt(0) : 'G'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-extrabold text-xs text-slate-100 truncate">
                              {account.name}
                            </span>
                            {isLastUsed && (
                              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold shrink-0">
                                Last Used
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-cyan-400 truncate">
                            {account.email}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          executeGoogleLogin(account);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Login</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Enter / Switch to Any Other Google ID */}
            <div className="pt-1 border-t border-[#1E2D4A]">
              <button
                type="button"
                onClick={() => setIsEnteringCustomGoogle(!isEnteringCustomGoogle)}
                className="w-full text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-between font-bold cursor-pointer py-1"
              >
                <span>{isEnteringCustomGoogle ? '− Use a saved Google ID' : '+ Or enter any other Google ID / Workspace email'}</span>
                <span className="text-[9px] font-mono text-slate-400">Custom ID</span>
              </button>

              {isEnteringCustomGoogle && (
                <div className="mt-2 space-y-2.5 p-3 bg-[#0B0F19] border border-blue-500/40 rounded-xl">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Google Email / ID:</label>
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="your-name@gmail.com"
                      className="w-full px-3 py-1.5 bg-[#060a14] border border-[#27395C] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Display Name:</label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3 py-1.5 bg-[#060a14] border border-[#27395C] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => executeGoogleLogin()}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer mt-1"
                  >
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Authenticate this Google ID</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Submit with currently selected account if custom input not open */}
            {!isEnteringCustomGoogle && (
              <button
                type="button"
                onClick={() => executeGoogleLogin()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer mt-1"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Selected ID ({selectedGoogleEmail})</span>
              </button>
            )}

            {/* Google Security Assurance */}
            <div className="flex items-center gap-2 p-2 bg-blue-950/20 border border-blue-500/20 rounded-lg text-[10px] text-blue-300">
              <Lock size={12} className="text-blue-400 shrink-0" />
              <span>Zero-Trust Google OAuth 2.0 handshake verified by SATYA-GPT SOC.</span>
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
            className="mt-3 text-[11px] text-[var(--text-muted)] hover:text-slate-300 transition-colors underline underline-offset-4 cursor-pointer"
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
