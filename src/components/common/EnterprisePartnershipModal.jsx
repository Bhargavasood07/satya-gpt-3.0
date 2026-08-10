import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, Cpu, Send, CheckCircle2, X, Sparkles, Award, Globe, ExternalLink, Zap, Mail, Key, Code2, Copy } from 'lucide-react';

const FOUNDER_EMAIL = 'bhargavasood5@gmail.com';

const EnterprisePartnershipModal = memo(({ onClose }) => {
  const [activeTab, setActiveTab] = useState('prospectus'); // 'prospectus', 'api_sandbox'
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [orgType, setOrgType] = useState('government');
  const [generatedApiKey, setGeneratedApiKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    proposal: '',
  });

  const handleGenerateApiKey = () => {
    const key = 'satya_live_api_key_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    setGeneratedApiKey(key);
  };

  const handleCopyKey = () => {
    if (!generatedApiKey) return;
    navigator.clipboard.writeText(generatedApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      const stored = JSON.parse(localStorage.getItem('satya_partner_inquiries') || '[]');
      const newInquiry = {
        id: 'inquiry_' + Date.now(),
        ...formData,
        orgType,
        timestamp: new Date().toISOString(),
      };
      stored.unshift(newInquiry);
      localStorage.setItem('satya_partner_inquiries', JSON.stringify(stored));
    } catch (err) {
      console.warn('Storage error:', err);
    }

    const subject = encodeURIComponent(`[SATYA-GPT Proposal] ${formData.organization} (${orgType.toUpperCase()})`);
    const body = encodeURIComponent(
      `Official Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Organization: ${formData.organization}\n` +
      `Type: ${orgType.toUpperCase()}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Collaboration Proposal:\n${formData.proposal}`
    );

    const mailtoUrl = `mailto:${FOUNDER_EMAIL}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');

    setFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-2xl bg-[#131B2E] border border-[#27395C] rounded-2xl p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-slate-100 hover:bg-[#0B0F19] transition-all"
        >
          <X size={18} />
        </button>

        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[var(--accent)] to-purple-500 rounded-t-2xl" />

        {/* Header Title & Badges */}
        <div className="space-y-3 border-b border-[#1E2D4A] pb-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                <Award size={12} className="text-amber-400" />
                <span>GOVERNMENT & FOUNDER COLLABORATION PORTAL</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>MeitY & CERT-In ALIGNED</span>
              </span>
            </div>

            {/* Sub Mode Switcher */}
            <div className="flex bg-[#0B0F19] rounded-lg p-1 border border-[#27395C]">
              <button
                type="button"
                onClick={() => setActiveTab('prospectus')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  activeTab === 'prospectus'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-slate-200'
                }`}
              >
                Prospectus Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('api_sandbox')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  activeTab === 'api_sandbox'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-md'
                    : 'text-[var(--text-muted)] hover:text-slate-200'
                }`}
              >
                B2B API Generator
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B0F19] border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-lg">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide">
                SATYA-GPT National Enterprise Prospectus & API Engine
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Official Platform for Government Agencies, Cyber Divisions & VC Founders</p>
            </div>
          </div>
        </div>

        {activeTab === 'prospectus' && (
          <div className="space-y-4">
            {/* Direct Founder Email Badge */}
            <div className="p-3 bg-[#0B0F19] border border-amber-500/40 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">Direct Founder Inbox Linked: </span>
                  <span className="text-[11px] text-slate-200">All proposals dispatch directly to Founder Office <strong className="text-[var(--accent)]">{FOUNDER_EMAIL}</strong></span>
                </div>
              </div>
            </div>

            {/* 4 Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-[#27395C] space-y-1">
                <div className="font-bold text-[var(--accent)] flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  <span>92-Engine VirusTotal Detection</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">Multi-vendor threat scoring on links, SMS payloads, QR codes & executable malware.</p>
              </div>

              <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-[#27395C] space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Cpu size={16} />
                  <span>NVIDIA Nemotron-3 Ultra 550B</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">Multimodal AI engine offering instant plain-language scam explanations in Indian languages.</p>
              </div>

              <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-[#27395C] space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Zap size={16} />
                  <span>AI Spatial Motion Tracking</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">Real-time device motion radar & frame-difference targeting for physical QR code verification.</p>
              </div>

              <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-[#27395C] space-y-1">
                <div className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Globe size={16} />
                  <span>National 1930 Helpline API</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">Direct dispatch integration for Indian Cyber Crime Helpline & cybercrime.gov.in portal.</p>
              </div>
            </div>

            {/* Collaboration Form */}
            <div className="bg-[#0B0F19] border border-[#27395C] rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400 animate-pulse" />
                  <span>Submit Collaboration Proposal</span>
                </h3>

                <div className="flex bg-[#131B2E] rounded-lg p-1 border border-[#27395C]">
                  <button
                    type="button"
                    onClick={() => setOrgType('government')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      orgType === 'government'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-[var(--text-muted)] hover:text-slate-200'
                    }`}
                  >
                    Government / PSU
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrgType('enterprise')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      orgType === 'enterprise'
                        ? 'bg-[var(--accent)] text-slate-950 shadow-md'
                        : 'text-[var(--text-muted)] hover:text-slate-200'
                    }`}
                  >
                    Founder / VC
                  </button>
                </div>
              </div>

              {formSubmitted ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-2 text-emerald-300 animate-pulse">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                  <div className="font-bold text-sm">Proposal Dispatched to Founder Email!</div>
                  <p className="text-xs text-emerald-200/80">Inquiry dispatched to {FOUNDER_EMAIL}. Our founder office will reply to {formData.email} shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Official Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Officer R. Sharma / Founder"
                        className="w-full bg-[#131B2E] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Official Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="official@gov.in or founder@vc.com"
                        className="w-full bg-[#131B2E] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Organization / Ministry / Fund</label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Cyber Crime Cell / MeitY / Venture Capital Fund"
                      className="w-full bg-[#131B2E] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] font-bold mb-1 uppercase">Collaboration Intent</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.proposal}
                      onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                      placeholder="Describe your government partnership initiative, API integration, or investment proposal..."
                      className="w-full bg-[#131B2E] border border-[#27395C] rounded-lg p-2.5 text-xs text-slate-100 focus:border-[var(--accent)] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Send size={14} />
                    <span>Submit & Email Inquiry to {FOUNDER_EMAIL}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* B2B API Key Generator Tab */}
        {activeTab === 'api_sandbox' && (
          <div className="bg-[#0B0F19] border border-[#27395C] rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E2D4A] pb-3 text-xs font-bold text-slate-200 uppercase">
              <Key size={16} className="text-[var(--accent)]" />
              <span>Instant B2B Threat Scanner API Key Generator</span>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Embed SATYA-GPT’s 92-Engine VirusTotal threat scanner into your own startup app, fintech platform, or government IT portal with 2 lines of code.
            </p>

            {generatedApiKey ? (
              <div className="p-4 bg-[#131B2E] border border-[var(--accent)] rounded-xl space-y-3">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Your Live B2B API Key:</div>
                <div className="flex items-center justify-between gap-2 bg-[#0B0F19] p-3 rounded-lg border border-[#27395C]">
                  <span className="font-mono text-xs text-cyan-300 select-all truncate">{generatedApiKey}</span>
                  <button
                    onClick={handleCopyKey}
                    className="px-3 py-1 bg-[var(--accent)] text-slate-950 font-bold rounded text-xs flex items-center gap-1 shrink-0"
                  >
                    {copiedKey ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                    <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1">
                    <Code2 size={13} className="text-emerald-400" />
                    <span>2-Line JS Embed Snippet:</span>
                  </div>
                  <pre className="p-3 bg-[#0B0F19] rounded-lg border border-[#27395C] text-[10px] text-emerald-400 overflow-x-auto">
{`<script src="https://satya-gpt-30.vercel.app/api/v1/scan.js"></script>
<script>
  SatyaScanner.init({ apiKey: "${generatedApiKey}" });
</script>`}
                  </pre>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateApiKey}
                className="w-full py-3 bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Key size={16} />
                <span>Generate Free Enterprise API Key</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
});

EnterprisePartnershipModal.displayName = 'EnterprisePartnershipModal';
export default EnterprisePartnershipModal;
