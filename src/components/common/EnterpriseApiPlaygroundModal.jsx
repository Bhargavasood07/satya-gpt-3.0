import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Code2, Terminal, Play, CheckCircle2, Copy, Zap, Cpu,
  Key, Globe, RefreshCw, X, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';

const API_ENDPOINTS = [
  {
    id: 'inspect',
    method: 'POST',
    path: '/api/v1/threat/inspect',
    title: 'Real-Time Threat Inspection',
    titleHi: 'रियल-टाइम खतरा जांच API',
    description: 'Inspects any URL, SMS body, UPI deep-link, or APK hash against 92 security engines & KAVACH AI heuristics.',
    samplePayload: {
      target_payload: 'https://sbi-yono-kyc-update.live/auth/login.php',
      scan_type: 'url_heavyduty',
      include_ai_reasoning: true,
      client_session_id: 'sess_in_delhi_9921',
      webhook_callback: 'https://api.yourbank.com/v1/fraud/webhook'
    },
    mockResponse: {
      status: 'success',
      code: 200,
      threat_detected: true,
      verdict: 'MALICIOUS_PHISHING',
      risk_score: 96,
      latency_ms: 12.4,
      taxonomy_code: 'VEC-BANK-KYC-94',
      layer_consensus: {
        virustotal_engines: '89/92 Malicious',
        kavach_neural_model: 'CONFIRMED_FRAUD (Confidence: 99.4%)',
        heuristic_flags: ['DOMAIN_AGE_LESS_24H', 'REVERSE_PROXY_SNIFFER', 'NO_EV_SSL']
      },
      mitigation: {
        action: 'BLOCK_AND_ISOLATE',
        bank_alert_dispatched: true,
        sec_65b_certificate_id: 'SATYA-EVID-2026-IN-9821'
      }
    }
  },
  {
    id: 'radar',
    method: 'POST',
    path: '/api/v1/fraud/radar',
    title: 'Geospatial Velocity & Syndicate Radar',
    titleHi: 'जियोस्पेशियल फ्रॉड वेलोसिटी रडार API',
    description: 'Detects impossible travel speed and coordinated syndicate sweeps across Indian states.',
    samplePayload: {
      user_id: 'cust_8829148',
      last_known_city: 'Pune',
      current_request_city: 'Jamtara',
      time_delta_seconds: 120,
      transaction_amount_inr: 49999
    },
    mockResponse: {
      status: 'success',
      code: 200,
      threat_detected: true,
      verdict: 'IMPOSSIBLE_TRAVEL_VELOCITY',
      risk_score: 98,
      latency_ms: 8.9,
      taxonomy_code: 'VEC-GEO-DISCREPANCY-98',
      calculated_velocity_kmh: 3840,
      recommendation: 'STEP_UP_BIOMETRIC_AUTH_REQUIRED'
    }
  },
  {
    id: 'telemetry',
    method: 'GET',
    path: '/api/v1/telemetry/nodes',
    title: 'Live Indian SOC Fleet Stream',
    titleHi: 'लाइव भारतीय SOC नोड टेलीमेट्री API',
    description: 'Fetches real-time threat intelligence from Delhi, Mumbai, Bengaluru, and Kolkata sensor clusters.',
    samplePayload: null,
    mockResponse: {
      status: 'success',
      code: 200,
      active_nodes: 18,
      global_fleet_status: 'NOMINAL_ONLINE',
      system_latency_p99_ms: 14.1,
      intercepted_threats_last_hour: 412,
      top_active_syndicates: [
        { code: 'VEC-DIGI-ARREST-96', state: 'Delhi NCR', risk: 'CRITICAL' },
        { code: 'VEC-ECHALLAN-APK-91', state: 'Maharashtra', risk: 'HIGH' }
      ]
    }
  }
];

const CODE_TEMPLATES = {
  curl: (endpoint, apiKey) => {
    if (endpoint.method === 'GET') {
      return `curl -X GET "https://api.satya-gpt.com${endpoint.path}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`;
    }
    return `curl -X POST "https://api.satya-gpt.com${endpoint.path}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.samplePayload, null, 2)}'`;
  },
  python: (endpoint, apiKey) => {
    if (endpoint.method === 'GET') {
      return `import requests

url = "https://api.satya-gpt.com${endpoint.path}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.status_code, response.json())`;
    }
    return `import requests

url = "https://api.satya-gpt.com${endpoint.path}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = ${JSON.stringify(endpoint.samplePayload, null, 4)}

response = requests.post(url, headers=headers, json=payload)
data = response.json()

if data.get("threat_detected"):
    print(f"⚠️ THREAT BLOCKED: {data['verdict']} (Score: {data['risk_score']})")`;
  },
  javascript: (endpoint, apiKey) => {
    if (endpoint.method === 'GET') {
      return `const response = await fetch("https://api.satya-gpt.com${endpoint.path}", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`;
    }
    return `const response = await fetch("https://api.satya-gpt.com${endpoint.path}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${JSON.stringify(endpoint.samplePayload, null, 2)})
});

const data = await response.json();
if (data.threat_detected) {
  console.warn(\`Threat blocked in \${data.latency_ms}ms:\`, data.verdict);
}`;
  },
  kotlin: (endpoint, apiKey) => {
    return `// Android Kotlin (Retrofit2 / Coroutines)
interface SatyaThreatApi {
    @POST("${endpoint.path}")
    suspend fun inspectThreat(
        @Header("Authorization") token: String,
        @Body request: ThreatRequest
    ): Response<ThreatResponse>
}

// In Coroutine Scope:
val response = satyaApi.inspectThreat(
    token = "Bearer ${apiKey}",
    request = ThreatRequest(target = payloadUrl)
)
if (response.body()?.threatDetected == true) {
    showTamperShieldAlert(response.body()?.verdict)`;
  }
};

const EnterpriseApiPlaygroundModal = memo(({ onClose }) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');

  const [activeEndpoint, setActiveEndpoint] = useState(API_ENDPOINTS[0]);
  const [activeLang, setActiveLang] = useState('curl'); // 'curl', 'python', 'javascript', 'kotlin'
  const [apiKey, setApiKey] = useState('satya_live_sandbox_9941_prod_token');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResponse, setExecutionResponse] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionResponse(null);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionResponse({
        httpStatus: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-satya-latency-ms': activeEndpoint.mockResponse.latency_ms || 12.4,
          'x-ratelimit-limit': '100000',
          'x-ratelimit-remaining': '99982',
          'x-satya-node': 'IN-MUMBAI-02'
        },
        body: activeEndpoint.mockResponse
      });
    }, 450);
  };

  const handleCopyCode = () => {
    const code = CODE_TEMPLATES[activeLang](activeEndpoint, apiKey);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleGenerateNewKey = () => {
    const newKey = 'satya_live_sandbox_' + Math.random().toString(36).substring(2, 9) + '_key';
    setApiKey(newKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md font-mono select-none">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-[#060a14] border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(0,229,255,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Code2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-wide">
                  {isHindi ? 'एंटरप्राइज डेवलपर हब व API सैंडबॉक्स' : 'Enterprise Developer Hub & API Sandbox'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REST & SDK
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isHindi
                  ? 'अपने बैंकिंग या फिनटेक ऐप में SATYA-GPT का 12ms फ्रॉड डिफेंस API आसानी से जोड़ें।'
                  : 'Integrate SATYA-GPT’s sub-15ms fraud detection API directly into your backend or mobile app.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Endpoint Selector Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-2 flex items-center justify-between">
              <span>{isHindi ? '1. API एंडपॉइंट चुनें' : '1. Select API Endpoint'}</span>
              <span className="text-cyan-400 text-[10px]">Production v1 • 99.99% Uptime SLA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {API_ENDPOINTS.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setActiveEndpoint(ep);
                    setExecutionResponse(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeEndpoint.id === ep.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ep.method === 'POST' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 truncate font-bold">
                      {ep.path}
                    </span>
                  </div>
                  <div className="text-xs font-semibold truncate text-slate-200">
                    {isHindi ? ep.titleHi : ep.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interactive Sandbox API Token Bar */}
          <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Key size={14} className="text-cyan-400 shrink-0" />
              <span className="text-[var(--text-muted)]">Live Sandbox Token:</span>
              <span className="font-mono text-cyan-300 truncate font-bold">{apiKey}</span>
            </div>
            <button
              onClick={handleGenerateNewKey}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface-card)] hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-[var(--border-subtle)] flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <RefreshCw size={11} />
              <span>{copiedKey ? 'Token Generated & Copied!' : 'Roll New Sandbox Key'}</span>
            </button>
          </div>

          {/* 3. Code Generation Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-[#040711] p-1 rounded-xl border border-[var(--border-subtle)] text-xs">
                {['curl', 'python', 'javascript', 'kotlin'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs capitalize cursor-pointer transition-all ${
                      activeLang === lang
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'javascript' ? 'Node.js' : lang === 'kotlin' ? 'Android Kotlin' : lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                {copiedCode ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="p-3.5 rounded-xl bg-[#040711] border border-[var(--border-default)] font-mono text-xs text-slate-200 overflow-x-auto max-h-56">
              <pre className="leading-relaxed">
                {CODE_TEMPLATES[activeLang](activeEndpoint, apiKey)}
              </pre>
            </div>
          </div>

          {/* 4. Live Response Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase">
              <span>{isHindi ? 'लाइव सर्वर प्रतिक्रिया' : 'Live Mock Sandbox Response'}</span>
              {executionResponse && (
                <span className="text-emerald-400 font-mono text-[10px]">
                  HTTP 200 OK • Latency: {executionResponse.headers['x-satya-latency-ms']}ms
                </span>
              )}
            </div>

            {executionResponse ? (
              <div className="p-3.5 rounded-xl bg-[#040711] border border-emerald-500/40 font-mono text-xs text-emerald-300 overflow-x-auto max-h-52 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <pre>{JSON.stringify(executionResponse.body, null, 2)}</pre>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#040711] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
                Click <span className="text-cyan-400 font-bold">"Send Live Request"</span> below to dispatch real-time request to the SATYA-GPT sandbox engine.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Zap size={14} className="text-cyan-400" />
            <span>Full REST Swagger Docs & SDK available in Enterprise Tier</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>{isHindi ? 'लाइव रिक्वेस्ट भेजें' : 'Send Live Request'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

EnterpriseApiPlaygroundModal.displayName = 'EnterpriseApiPlaygroundModal';
export default EnterpriseApiPlaygroundModal;
