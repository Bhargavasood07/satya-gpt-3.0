import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Shield, Database, Trash2, Download, CheckCircle2, AlertTriangle, X, Eye, EyeOff, Server, KeyRound } from 'lucide-react';
import { secureStorage } from '../../utils/securityGuard';

export default function AdminPanelModal({ isOpen, onClose, events = [], metrics }) {
  // Read Master Passcode from encrypted secureStorage or fallback to default
  const [masterPasscode, setMasterPasscode] = useState(() => {
    return secureStorage.getItem('admin_master_passcode') || 'admin123';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return secureStorage.getItem('admin_session_active') || false;
  });
  
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [adminTab, setAdminTab] = useState('vault');

  // Change Password Form State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [changePassStatus, setChangePassStatus] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === masterPasscode) {
      setIsAuthenticated(true);
      secureStorage.setItem('admin_session_active', true);
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('Invalid Master Admin Passcode!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    secureStorage.removeItem('admin_session_active');
  };

  const handleChangePasscode = (e) => {
    e.preventDefault();
    if (currentPassInput !== masterPasscode) {
      setChangePassStatus({ type: 'error', text: 'Current passcode is incorrect!' });
      return;
    }
    if (!newPassInput || newPassInput.length < 4) {
      setChangePassStatus({ type: 'error', text: 'New passcode must be at least 4 characters!' });
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setChangePassStatus({ type: 'error', text: 'New passcodes do not match!' });
      return;
    }

    // Update and persist new passcode
    setMasterPasscode(newPassInput);
    secureStorage.setItem('admin_master_passcode', newPassInput);
    setChangePassStatus({ type: 'success', text: 'Master Admin Passcode updated successfully!' });
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  const handleExportVault = () => {
    const vaultData = {
      exportedAt: new Date().toISOString(),
      systemMetrics: metrics,
      capturedThreatVault: events,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vaultData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `satya_admin_private_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-[#131B2E] border border-[#27395C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1E2D4A] bg-[#0B0F19] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">SATYA-GPT Private Admin Vault</h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">Restricted Access • Site Owner Only</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#131B2E] hover:bg-rose-500/20 border border-[#27395C] text-[var(--text-primary)] hover:text-rose-400 transition-all text-xs flex items-center gap-1 font-bold"
          >
            <span>CLOSE</span>
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 text-xs">
          {!isAuthenticated ? (
            /* Login Form */
            <div className="max-w-md mx-auto my-8 space-y-4 bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2D4A] text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <Lock size={24} />
              </div>

              <div>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">Admin Authentication Required</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Enter your Master Admin Security Passcode to access private vault logs & keys</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Master Passcode..."
                  className="w-full px-3 py-2 bg-[#131B2E] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-400"
                />

                {authError && <div className="text-rose-400 text-[11px] font-bold">{authError}</div>}

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md"
                >
                  Unlock Admin Vault
                </button>
              </form>
            </div>
          ) : (
            /* Admin Panel Dashboard */
            <div className="space-y-4">
              {/* Admin Navigation Header */}
              <div className="flex items-center justify-between bg-[#0B0F19] p-2 rounded-xl border border-[#1E2D4A]">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setAdminTab('vault')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      adminTab === 'vault' ? 'bg-[var(--accent)] text-slate-950 shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Private Threat Vault ({events.length})
                  </button>
                  <button
                    onClick={() => setAdminTab('passcode')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      adminTab === 'passcode' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Change Passcode
                  </button>
                  <button
                    onClick={() => setAdminTab('apikeys')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      adminTab === 'apikeys' ? 'bg-[var(--accent)] text-slate-950 shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Engine Status
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-bold hover:bg-rose-500/30 transition-all"
                >
                  Lock Vault
                </button>
              </div>

              {/* TAB 1: PRIVATE THREAT VAULT */}
              {adminTab === 'vault' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#0B0F19] rounded-xl border border-[#1E2D4A]">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Encrypted Threat Log Database</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Contains captured URLs, SMS payloads & multi-engine vendor scores</div>
                    </div>

                    <button
                      onClick={handleExportVault}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Download size={14} />
                      <span>Export JSON Vault</span>
                    </button>
                  </div>

                  <div className="bg-[#0B0F19] rounded-xl border border-[#1E2D4A] overflow-hidden max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#131B2E] sticky top-0 border-b border-[#1E2D4A] text-[var(--text-muted)]">
                        <tr>
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Payload Data</th>
                          <th className="p-2.5">Source</th>
                          <th className="p-2.5">Verdict</th>
                          <th className="p-2.5">Risk Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E2D4A]">
                        {events.map((evt) => (
                          <tr key={evt.id} className="hover:bg-[#131B2E]/60">
                            <td className="p-2.5 text-[var(--text-muted)]">{evt.id}</td>
                            <td className="p-2.5 text-[var(--text-primary)] max-w-xs truncate">{evt.payload}</td>
                            <td className="p-2.5 uppercase text-[var(--accent)] font-bold">{evt.source}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                evt.verdict === 'fake' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {evt.verdict === 'fake' ? 'MALICIOUS' : 'CLEAN'}
                              </span>
                            </td>
                            <td className="p-2.5 font-bold">{evt.riskScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CHANGE MASTER PASSCODE */}
              {adminTab === 'passcode' && (
                <div className="space-y-4 max-w-md mx-auto bg-[#0B0F19] p-5 rounded-xl border border-[#1E2D4A]">
                  <div className="flex items-center gap-2">
                    <KeyRound size={20} className="text-amber-400" />
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">Change Master Admin Passcode</h4>
                      <p className="text-[10px] text-[var(--text-muted)]">Set a custom secret passcode for your Admin Vault</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePasscode} className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Current Passcode</label>
                      <input
                        type="password"
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="Enter current passcode..."
                        className="w-full px-3 py-2 bg-[#131B2E] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-400 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">New Passcode</label>
                      <input
                        type="password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Enter new custom passcode..."
                        className="w-full px-3 py-2 bg-[#131B2E] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-400 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Confirm New Passcode</label>
                      <input
                        type="password"
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        placeholder="Confirm new custom passcode..."
                        className="w-full px-3 py-2 bg-[#131B2E] border border-[#27395C] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-400 mt-1"
                      />
                    </div>

                    {changePassStatus && (
                      <div className={`p-2 rounded text-[11px] font-bold ${
                        changePassStatus.type === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {changePassStatus.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md mt-2"
                    >
                      Save Custom Passcode
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: ANONYMOUS ENGINE STATUS */}
              {adminTab === 'apikeys' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#0B0F19] rounded-xl border border-[#1E2D4A] space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">SATYA Security Engine Proxy</div>
                        <div className="text-[10px] text-[var(--text-muted)]">Encapsulated 92-vendor threat detection server proxy</div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold">
                        SECURE & ANONYMOUS
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#131B2E] rounded border border-[#27395C] font-mono text-xs text-emerald-400 font-bold">
                      [PROTECTED ENCAPSULATED KEY — API CREDS HIDDEN FROM PUBLIC & LOGS]
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
