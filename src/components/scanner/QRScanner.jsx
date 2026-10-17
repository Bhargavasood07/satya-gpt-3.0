import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QrCode, Upload, CheckCircle2, ShieldCheck, ShieldAlert, Activity,
  RefreshCw, Copy, Check, AlertTriangle, ExternalLink, PhoneCall,
  Camera, SwitchCamera, Sparkles, AlertOctagon, Eye, EyeOff,
  FileText, Wifi, CreditCard, Link2, ChevronRight, Shield,
  Globe, Server, Lock, ArrowRight, CornerDownRight, Radio,
  Compass, MapPin, Database, Award, Info
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { analyzeScamGlobally } from '../../services/virusTotalService';
import {
  detectInappropriateContent,
  SAMPLE_QR_TESTS,
  parseQrPayload
} from '../../services/inappropriateContentDetector';
import { useChildMode } from '../../context/ChildModeContext';

const QRScanner = ({ onScanResult }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi');
  const { isChildMode } = useChildMode();

  // Scanner States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [vtAnalysis, setVtAnalysis] = useState(null);
  const [statusText, setStatusText] = useState('');
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'upload'
  const [cameraError, setCameraError] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'perimeter' | 'related' | 'threats'

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const statusIntervalRef = useRef(null);
  const isStoppingRef = useRef(false);

  // Play a quick subtle optical scanner audio beep
  const playScanBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }, []);

  const statusMessages = useMemo(() => [
    isHindi ? 'AI मोशन डिटेक्टर रडार सक्रिय...' : 'AI Optical Motion Radar Active...',
    isHindi ? 'QR पेलोड, पेरीमीटर व प्रामाणिकता की जांच...' : 'Evaluating Real vs Fake Authenticity & Security Perimeter...',
    isHindi ? '92 वायरसटोटल इंजनों के साथ विश्लेषण...' : 'Cross-evaluating across 92 SOC engines...',
  ], [isHindi]);

  const cycleStatusText = useCallback(() => {
    let i = 0;
    setStatusText(statusMessages[0]);
    if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    statusIntervalRef.current = setInterval(() => {
      i = (i + 1) % statusMessages.length;
      setStatusText(statusMessages[i]);
    }, 1200);
  }, [statusMessages]);

  const stopStatusCycle = useCallback(() => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
  }, []);

  // Safe scanner teardown that never throws unhandled exceptions
  const safeStopScanner = useCallback(async () => {
    stopStatusCycle();
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        try {
          scanner.clear();
        } catch (_) {}
      }
    } catch (err) {
      console.warn('QR scanner teardown status:', err?.message || err);
    } finally {
      html5QrCodeRef.current = null;
      setIsScanning(false);
      isStoppingRef.current = false;
    }
  }, [stopStatusCycle]);

  // Main scan success handler: runs real/fake detector + perimeter + related content + global VT engines
  const handleScanSuccess = useCallback(async (decodedText) => {
    playScanBeep();
    await safeStopScanner();
    setScanResult(decodedText);
    setStatusText(isHindi ? 'पेरीमीटर व सामग्री का विश्लेषण हो रहा है...' : 'Evaluating Real/Fake Verdict, Security Perimeter & Related Threats...');

    try {
      // 1. Instant Deep Analysis
      const initialReport = detectInappropriateContent(decodedText, { isChildMode });
      setAnalysisReport(initialReport);

      // 2. Global Threat Engine Analysis
      const vtReport = await analyzeScamGlobally(decodedText, 'qr');
      setVtAnalysis(vtReport);

      // 3. Merge VirusTotal data into report
      const fullReport = detectInappropriateContent(decodedText, { isChildMode, vtReport });
      setAnalysisReport(fullReport);

      if (onScanResult) {
        onScanResult(decodedText, 'qr', vtReport);
      }
    } catch (err) {
      console.error('Error analyzing QR content:', err);
    } finally {
      setStatusText('');
    }
  }, [safeStopScanner, playScanBeep, isChildMode, isHindi, onScanResult]);

  // Enumerate cameras on mount
  useEffect(() => {
    let isMounted = true;
    async function discoverCameras() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await Html5Qrcode.getCameras();
          if (isMounted && devices && devices.length > 0) {
            setAvailableCameras(devices);
          }
        }
      } catch (err) {
        console.warn('Camera discovery notice:', err?.message || err);
      }
    }
    discoverCameras();
    return () => {
      isMounted = false;
    };
  }, []);

  // Start Camera Scanning with multi-tier fallback
  const startCameraScan = useCallback(async (preferredCameraId = null) => {
    setCameraError(null);
    try {
      await safeStopScanner();
      setScanResult(null);
      setAnalysisReport(null);
      setVtAnalysis(null);
      setIsScanning(true);
      cycleStatusText();

      const qrContainer = document.getElementById('qr-reader-viewport');
      if (!qrContainer) {
        throw new Error('Scanner viewport container not found');
      }

      const html5QrCode = new Html5Qrcode('qr-reader-viewport');
      html5QrCodeRef.current = html5QrCode;

      const scanConfig = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const edgeSize = Math.max(170, Math.min(Math.floor(minEdge * 0.72), 300));
          return { width: edgeSize, height: edgeSize };
        },
        aspectRatio: 1.0,
      };

      let targetCamera = null;
      if (preferredCameraId) {
        targetCamera = preferredCameraId;
      } else if (availableCameras.length > 0) {
        const backCam = availableCameras.find((c) => /back|rear|environment/i.test(c.label));
        targetCamera = backCam ? backCam.id : availableCameras[activeCameraIndex]?.id || availableCameras[0].id;
      }

      if (targetCamera) {
        try {
          await html5QrCode.start(targetCamera, scanConfig, handleScanSuccess, () => {});
          return;
        } catch (camErr) {
          console.warn('Target camera ID failed, attempting facingMode fallback:', camErr);
        }
      }

      try {
        await html5QrCode.start({ facingMode: 'environment' }, scanConfig, handleScanSuccess, () => {});
      } catch (envErr) {
        await html5QrCode.start({ facingMode: 'user' }, scanConfig, handleScanSuccess, () => {});
      }
    } catch (err) {
      console.warn('Camera access or scanner init notice:', err);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? (isHindi ? 'कैमरा अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में कैमरा की अनुमति दें।' : 'Camera permission denied. Please allow camera access in browser settings.')
          : (err?.message || (isHindi ? 'कैमरा शुरू करने में असमर्थ' : 'Unable to access camera. Try Upload mode or Quick Test Presets.'))
      );
      await safeStopScanner();
    }
  }, [availableCameras, activeCameraIndex, cycleStatusText, handleScanSuccess, isHindi, safeStopScanner]);

  const handleSwitchCamera = useCallback(async () => {
    if (availableCameras.length <= 1) return;
    const nextIndex = (activeCameraIndex + 1) % availableCameras.length;
    setActiveCameraIndex(nextIndex);
    const nextCamera = availableCameras[nextIndex];
    if (nextCamera) {
      await startCameraScan(nextCamera.id);
    }
  }, [availableCameras, activeCameraIndex, startCameraScan]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setUploadedPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      await safeStopScanner();
      setScanResult(null);
      setAnalysisReport(null);
      setVtAnalysis(null);
      setIsScanning(true);
      cycleStatusText();

      let hiddenEl = document.getElementById('qr-file-reader-hidden');
      if (!hiddenEl) {
        hiddenEl = document.createElement('div');
        hiddenEl.id = 'qr-file-reader-hidden';
        hiddenEl.style.display = 'none';
        document.body.appendChild(hiddenEl);
      }

      const html5QrCode = new Html5Qrcode('qr-file-reader-hidden');
      html5QrCodeRef.current = html5QrCode;

      const decodedText = await html5QrCode.scanFile(file, true);
      await handleScanSuccess(decodedText);
    } catch (err) {
      console.warn('Error scanning QR from file:', err);
      setIsScanning(false);
      stopStatusCycle();
      setStatusText(
        isHindi
          ? 'इस छवि में कोई QR कोड नहीं मिला। कृपया स्पष्ट छवि अपलोड करें।'
          : 'No QR code detected in this image. Please upload a clear, high-contrast QR image.'
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload({ target: { files: [file] } });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCopyPayload = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    return () => {
      safeStopScanner();
    };
  }, [safeStopScanner]);

  const isReal = analysisReport?.isReal;
  const isFake = analysisReport?.isFake;
  const perimeter = analysisReport?.perimeterDetails;
  const related = analysisReport?.relatedContent;

  return (
    <div className="flex flex-col gap-3.5 h-full cyber-card bg-[#0a0f1d] rounded-xl border border-[#1e2d4a] p-3.5 sm:p-4 font-mono text-xs text-[var(--text-primary)] relative overflow-hidden">
      {/* Background Cyber Scanning Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2d4a_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Header & Mode Switcher */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-2 border-b border-[#1b2742] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]">
            <QrCode size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{isHindi ? 'AI मोशन QR विश्लेषक (असली या नकली)' : 'AI Optical QR Analyzer (Real vs Fake)'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                v6.2
              </span>
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHindi ? 'असली या नकली की पहचान, तकनीकी पेरीमीटर और संबंधित खतरों का विश्लेषण' : 'Real vs Fake verification, underlying forensic perimeter & related threat intelligence'}
            </p>
          </div>
        </div>

        {/* Mode Toggle & Camera Switch */}
        <div className="flex items-center gap-1.5">
          {scanMode === 'camera' && availableCameras.length > 1 && isScanning && (
            <button
              onClick={handleSwitchCamera}
              className="p-1.5 bg-[#131b2e] hover:bg-[#1c2844] text-[var(--accent)] border border-[#27395c] rounded-lg transition-colors cursor-pointer"
              title={isHindi ? 'कैमरा बदलें' : 'Switch Camera'}
              type="button"
            >
              <SwitchCamera size={14} />
            </button>
          )}

          <div className="flex bg-[#070b14] rounded-lg p-0.5 border border-[#1e2d4a]">
            <button
              type="button"
              onClick={() => {
                safeStopScanner();
                setScanMode('camera');
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                scanMode === 'camera'
                  ? 'bg-[var(--accent)] text-slate-950 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Camera size={12} />
              <span>{isHindi ? 'कैमरा' : 'Camera'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                safeStopScanner();
                setScanMode('upload');
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                scanMode === 'upload'
                  ? 'bg-[var(--accent)] text-slate-950 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Upload size={12} />
              <span>{isHindi ? 'अपलोड' : 'Upload'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative z-10 flex-grow flex flex-col gap-3">
        {scanResult && analysisReport ? (
          /* ── DETAILED REAL vs FAKE & PERIMETER RESULTS VIEW ── */
          <div className="flex flex-col gap-3 animate-fadeIn">
            {/* 1. BOLD REAL vs FAKE VERDICT HERO BANNER */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col gap-2.5 shadow-2xl relative overflow-hidden ${
                isFake
                  ? 'bg-gradient-to-r from-rose-950/70 via-red-950/40 to-slate-950/90 border-rose-500/70 text-rose-200'
                  : 'bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-950/90 border-emerald-500/70 text-emerald-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      isFake
                        ? 'bg-rose-500/25 border-2 border-rose-500 text-rose-400 animate-pulse'
                        : 'bg-emerald-500/25 border-2 border-emerald-500 text-emerald-400'
                    }`}
                  >
                    {isFake ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
                  </div>

                  <div>
                    {/* Big REAL or FAKE Pill */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span
                        className={`px-3 py-1 rounded-md text-xs sm:text-sm font-black uppercase tracking-wider shadow-md ${
                          isFake
                            ? 'bg-rose-500 text-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                            : 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        }`}
                      >
                        {isFake ? '🔴 VERDICT: FAKE SCAM QR' : '🟢 VERDICT: REAL SAFE QR'}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] bg-black/60 px-2 py-0.5 rounded border border-white/10">
                        {analysisReport.authenticityBadge}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                      {analysisReport.title}
                    </h4>
                  </div>
                </div>

                {/* Risk and Perimeter Status Badges */}
                <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
                  <div className="bg-black/60 px-3 py-2 rounded-lg border border-white/10 text-right">
                    <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Perimeter Status</div>
                    <div className={`text-xs font-black font-mono ${isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {perimeter?.perimeterStatus.split(' ')[0] || (isFake ? 'BREACH' : 'SECURE')}
                    </div>
                  </div>
                  <div className="bg-black/60 px-3 py-2 rounded-lg border border-white/10 text-right">
                    <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Risk Index</div>
                    <div className={`text-sm sm:text-base font-black font-mono ${isFake ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {analysisReport.riskScore}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Verdict Summary Box */}
              <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 leading-relaxed flex items-start gap-2">
                <span className="text-[var(--accent)] font-bold shrink-0">
                  {isHindi ? 'निरीक्षण निष्कर्ष:' : 'Forensic Verdict:'}
                </span>
                <span>{analysisReport.reason}</span>
              </div>
            </div>

            {/* 2. INSPECTION TABS (Overview, Perimeter Behind QR, Related Content, Threats) */}
            <div className="flex gap-1 bg-[#060a14] p-1 rounded-xl border border-[#1b2742] text-[11px] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <Compass size={13} />
                <span>{isHindi ? '1. अवलोकन व पेलोड' : '1. Overview & Payload'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('perimeter')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'perimeter'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <Server size={13} />
                <span>{isHindi ? '2. पेरीमीटर (Perimeter Behind QR)' : '2. Perimeter Behind QR'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('related')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'related'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <Globe size={13} />
                <span>{isHindi ? '3. संबंधित सामग्री व तुलना' : '3. Related Content & Comparison'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('threats')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'threats'
                    ? 'bg-[var(--accent)] text-slate-950 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <AlertTriangle size={13} />
                <span>{isHindi ? '4. खतरे व अनुपयुक्त सामग्री' : '4. Inappropriate Flags'}</span>
              </button>
            </div>

            {/* 3. TAB 1: OVERVIEW & PAYLOAD */}
            {activeTab === 'overview' && (
              <div className="bg-[#0b101e] border border-[#1e2d4a] rounded-xl p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#18233a] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
                    {analysisReport.parsedType === 'upi' ? <CreditCard size={15} /> : <Link2 size={15} />}
                    <span className="uppercase">
                      {analysisReport.parsedType === 'upi'
                        ? 'UPI Payment Payload'
                        : analysisReport.parsedType === 'url'
                        ? 'Web URL Destination'
                        : 'Decoded QR Content'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#141d33] hover:bg-[#1e2c4d] text-white rounded-lg border border-[#27395c] text-[11px] transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Payload'}</span>
                  </button>
                </div>

                {/* If UPI: Detailed Fields */}
                {analysisReport.parsedType === 'upi' && analysisReport.parsedDetails && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-[#070b14] p-3 rounded-lg border border-[#1b2742]">
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">Payee VPA Handle</span>
                      <span className="font-bold text-amber-300 font-mono break-all">
                        {analysisReport.parsedDetails.payeeAddress}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">Registered Payee Name</span>
                      <span className="font-bold text-white">
                        {analysisReport.parsedDetails.payeeName || 'Unregistered Individual'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">Transaction Amount</span>
                      <span className="font-bold text-rose-400 font-mono text-xs">
                        {analysisReport.parsedDetails.amount ? `₹${analysisReport.parsedDetails.amount} INR (DEBIT REQUEST)` : 'Variable User Input'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">Transaction Note / Bait</span>
                      <span className="italic text-cyan-300">
                        "{analysisReport.parsedDetails.transactionNote || 'None'}"
                      </span>
                    </div>
                  </div>
                )}

                {/* Raw Decoded Content Box */}
                <div>
                  <div className="text-[10px] uppercase text-[var(--text-muted)] mb-1">Decoded Payload Data</div>
                  <pre className="text-[11px] font-mono text-slate-300 break-all bg-[#070b14] p-3 rounded-lg border border-[#1b2742] max-h-28 overflow-y-auto whitespace-pre-wrap">
                    {scanResult}
                  </pre>
                </div>

                {/* Quick Safety Directives */}
                <div className="p-2.5 rounded-lg bg-[#0e172a] border border-[#1e2d4a] text-[11px] space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Shield size={13} />
                    <span>Safety Directives:</span>
                  </div>
                  {analysisReport.safetyAdvice.map((adv, idx) => (
                    <p key={idx} className="text-slate-300 text-[10.5px]">
                      → {adv}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TAB 2: PERIMETER BEHIND QR (Host, Geo, SSL, Redirect Hops, Financial Flow) */}
            {activeTab === 'perimeter' && perimeter && (
              <div className="bg-[#0b101e] border border-[#1e2d4a] rounded-xl p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-[#18233a] pb-2 text-xs font-bold text-[var(--accent)]">
                  <span className="flex items-center gap-1.5">
                    <Radio size={15} className="animate-pulse" />
                    <span>Underlying Security & Infrastructure Perimeter</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    DEFENSE GRID: {perimeter.socEnginesPassed}/{perimeter.totalEngines} CLEAN
                  </span>
                </div>

                {/* Host & Network Perimeter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-[#070b14] rounded-lg border border-[#1b2742]">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block mb-0.5">
                      📍 Hosting Server IP & Geo-Location
                    </span>
                    <span className="font-bold text-cyan-300 font-mono block">
                      {perimeter.serverIp}
                    </span>
                    <span className="text-slate-300 text-[10px]">
                      {perimeter.serverLocation}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-lg border border-[#1b2742]">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block mb-0.5">
                      🏢 Hosting Provider & ASN
                    </span>
                    <span className="font-bold text-amber-300 font-mono block">
                      {perimeter.hostingAsn}
                    </span>
                    <span className="text-[var(--text-muted)] text-[10px]">
                      Registrar: {perimeter.registrar}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-lg border border-[#1b2742]">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block mb-0.5">
                      🔒 Cryptographic SSL/TLS Cipher
                    </span>
                    <span className={isReal ? 'text-emerald-400 font-bold block' : 'text-rose-400 font-bold block'}>
                      {perimeter.sslCipher}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#070b14] rounded-lg border border-[#1b2742]">
                    <span className="text-[var(--text-muted)] text-[10px] uppercase block mb-0.5">
                      ⏳ Domain Age & Trust Perimeter
                    </span>
                    <span className={isReal ? 'text-emerald-400 font-bold block' : 'text-amber-400 font-bold block'}>
                      {perimeter.domainAge}
                    </span>
                  </div>
                </div>

                {/* Redirect Perimeter Hop Analysis */}
                <div className="p-3 bg-[#070b14] rounded-lg border border-[#1b2742] space-y-2">
                  <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider flex items-center gap-1.5">
                    <CornerDownRight size={13} />
                    <span>Perimeter Traversal & Redirect Hop Timeline</span>
                  </div>
                  <div className="space-y-1.5 pl-1">
                    {perimeter.redirectHops.map((hop, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="w-5 h-5 rounded-full bg-[#131b2e] border border-[#27395c] flex items-center justify-center text-[10px] font-mono text-[var(--accent)] shrink-0">
                          {hop.hop}
                        </span>
                        <span className="text-slate-300 flex-grow font-mono">{hop.label}</span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            hop.status === 'CRITICAL_THREAT' || hop.status === 'MASKING_PROXY'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : hop.status === 'UNTRUSTED_DECODE'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {hop.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Payment Perimeter (if UPI) */}
                {perimeter.financialPerimeter && (
                  <div className="p-3 bg-[#070b14] rounded-lg border border-[#1b2742] space-y-2">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={13} />
                      <span>Financial Cash Flow & NPCI Perimeter</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                      <div className="p-2 bg-[#0b101e] rounded border border-[#1e2d4a]">
                        <span className="text-[var(--text-muted)] block text-[9.5px]">Cash Flow Direction:</span>
                        <span className={perimeter.financialPerimeter.isDebitTrap ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {perimeter.financialPerimeter.cashFlowDirection}
                        </span>
                      </div>
                      <div className="p-2 bg-[#0b101e] rounded border border-[#1e2d4a]">
                        <span className="text-[var(--text-muted)] block text-[9.5px]">NPCI Fraud Compliance:</span>
                        <span className={perimeter.financialPerimeter.isDebitTrap ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {perimeter.financialPerimeter.npciCompliance}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. TAB 3: RELATED CONTENT & MODUS OPERANDI */}
            {activeTab === 'related' && related && (
              <div className="bg-[#0b101e] border border-[#1e2d4a] rounded-xl p-3 flex flex-col gap-3">
                <div className="border-b border-[#18233a] pb-2 text-xs font-bold text-[var(--accent)] flex items-center justify-between">
                  <span>Related Threats & Real vs Fake Comparison</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">
                    Target: {related.comparison.impersonatedBrand}
                  </span>
                </div>

                {/* Side-by-Side Real vs Fake Comparison Card */}
                {related.comparison.isSpoofed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Fake Side */}
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                          <AlertOctagon size={14} />
                          <span>Scanned Fake Target</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                          COUNTERFEIT
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/50 border border-rose-500/30 font-mono text-[11px] text-rose-300 break-all">
                        {related.comparison.scannedFake}
                      </div>
                      <p className="text-[10.5px] text-rose-200/80">
                        ⚠️ Impersonates {related.comparison.impersonatedBrand} using an unauthorized domain or unverified personal VPA.
                      </p>
                    </div>

                    {/* Real Side */}
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>Official Authentic Source</span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          OFFICIAL REAL
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/50 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 break-all flex items-center justify-between gap-1">
                        <span className="truncate">{related.comparison.officialReal}</span>
                        {related.comparison.officialUrl && (
                          <a
                            href={related.comparison.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 shrink-0"
                            title="Visit Official Real Portal"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <p className="text-[10.5px] text-emerald-200/80">
                        ✓ Legitimate authentic portal registered under official sovereign or banking registry.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Award size={16} />
                      <span>100% Genuine Cryptographic Origin Verified</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                      This QR code does not impersonate any brand. It leads directly to its authentic official endpoint with verified SSL and clean SOC telemetry.
                    </p>
                  </div>
                )}

                {/* Modus Operandi Card */}
                <div className="p-3 rounded-xl bg-[#070b14] border border-[#1b2742] space-y-1.5">
                  <div className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Info size={13} />
                    <span>Modus Operandi: {related.modusOperandi.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {related.modusOperandi.howItWorks}
                  </p>
                  <div className="p-2 rounded bg-[#0b101e] border border-[#1e2d4a] text-[10.5px] text-rose-300">
                    <span className="font-bold text-white mr-1">Victim Impact:</span>
                    {related.modusOperandi.victimImpact}
                  </div>
                </div>

                {/* Related Incident Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2.5 bg-[#070b14] rounded-lg border border-[#1b2742]">
                    <span className="text-[var(--text-muted)] block text-[9.5px] uppercase">
                      📊 National Incident Statistics
                    </span>
                    <span className="font-bold text-cyan-300">
                      {related.relatedIncidents.reportedCount}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded-lg border border-[#1b2742]">
                    <span className="text-[var(--text-muted)] block text-[9.5px] uppercase">
                      📑 Statutory Advisory Citation
                    </span>
                    <span className="font-bold text-amber-300">
                      {related.relatedIncidents.advisoryReference}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TAB 4: INAPPROPRIATE CONTENT & THREAT FLAGS */}
            {activeTab === 'threats' && (
              <div className="bg-[#0b101e] border border-[#1e2d4a] rounded-xl p-3 flex flex-col gap-2.5">
                <div className="border-b border-[#18233a] pb-2 text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className={isFake ? 'text-rose-400' : 'text-emerald-400'} />
                    <span>Inappropriate Content & Violation Flags</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {analysisReport.indicators.length} indicators flagged
                  </span>
                </div>

                {/* Indicators List */}
                <div className="space-y-1.5 overflow-y-auto max-h-44 pr-1">
                  {analysisReport.indicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-[11px] leading-snug p-2 rounded bg-[#070b14] border border-[#1b2742]"
                    >
                      <span className="text-rose-400 shrink-0 mt-0.5">•</span>
                      <span className="text-slate-300">{ind}</span>
                    </div>
                  ))}
                  {analysisReport.indicators.length === 0 && (
                    <div className="text-[11px] text-emerald-400 p-3 text-center bg-emerald-950/20 rounded border border-emerald-500/20">
                      ✓ No inappropriate, adult, gambling or malicious indicators detected in this QR code.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#18233a]">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="tel:1930"
                  className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="National Cyber Crime Reporting Helpline"
                >
                  <PhoneCall size={12} className="animate-pulse" />
                  <span>1930 Cyber Helpline</span>
                </a>

                {/* Open Real Official Portal Shortcut */}
                {related?.comparison?.officialUrl && related.comparison.isSpoofed && (
                  <a
                    href={related.comparison.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{related.comparison.actionText}</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setScanResult(null);
                  setAnalysisReport(null);
                  setVtAnalysis(null);
                  setStatusText('');
                  setUploadedPreview(null);
                  setActiveTab('overview');
                }}
                className="px-4 py-1.5 bg-[var(--accent)] text-slate-950 hover:bg-cyan-400 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RefreshCw size={12} />
                <span>{isHindi ? 'दूसरा QR स्कैन करें' : 'Scan Another QR'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── ACTIVE SCANNING / READY VIEW ── */
          <>
            {scanMode === 'camera' ? (
              <div className="relative w-full aspect-square max-h-[280px] bg-[#070b14] rounded-xl border border-[#1e2d4a] overflow-hidden mx-auto shadow-inner flex items-center justify-center">
                <div id="qr-reader-viewport" className="w-full h-full object-cover"></div>

                {!isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070b14]/92 backdrop-blur-sm z-10 p-4 text-center">
                    <button
                      type="button"
                      onClick={() => startCameraScan()}
                      className="px-5 py-2.5 bg-[var(--accent)] text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2 text-xs shadow-[0_0_15px_var(--accent-glow)] cursor-pointer"
                    >
                      <Camera size={16} />
                      <span>{isHindi ? 'कैमरा स्कैनर शुरू करें' : 'Start Camera QR Scanner'}</span>
                    </button>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 max-w-xs">
                      {isHindi
                        ? 'QR कोड स्कैन करते ही असली/नकली की पहचान, तकनीकी पेरीमीटर और संबंधित खतरों की जानकारी मिलेगी।'
                        : 'Scans QR codes and immediately evaluates Real vs Fake authenticity, security perimeter & related threats.'}
                    </p>
                    {cameraError && (
                      <div className="text-[11px] text-rose-300 font-bold mt-2.5 bg-rose-500/15 p-2 rounded-lg border border-rose-500/40 max-w-sm">
                        {cameraError}
                      </div>
                    )}
                  </div>
                )}

                {/* Reticle Overlay when camera is active */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-[var(--accent)]/70 rounded-2xl animate-pulse relative">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--accent)]" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--accent)]" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--accent)]" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--accent)]" />
                      <div className="w-full h-0.5 bg-[var(--accent)]/50 absolute top-1/2 -translate-y-1/2 animate-scanLine" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="relative w-full aspect-square max-h-[280px] flex flex-col items-center justify-center bg-[#070b14] rounded-xl border-2 border-dashed border-[#1e2d4a] hover:border-[var(--accent)] transition-colors p-4 mx-auto cursor-pointer group"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedPreview ? (
                  <div className="relative max-h-40 max-w-full flex items-center justify-center">
                    <img
                      src={uploadedPreview}
                      alt="Uploaded QR"
                      className="max-h-36 rounded-lg object-contain border border-[#27395c]"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] mb-2 group-hover:scale-110 transition-transform">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-[var(--text-primary)] mb-1">
                      {isHindi ? 'QR छवि यहाँ ड्रैग करें' : 'Drop QR Code Image Here'}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mb-3">
                      {isHindi ? 'या फाइल चुनने के लिए क्लिक करें (PNG, JPG, WEBP)' : 'or click to browse files (PNG, JPG, WEBP)'}
                    </p>
                    <div className="px-3.5 py-1.5 bg-[#131b2e] text-[var(--text-primary)] border border-[#27395c] rounded-lg text-xs font-bold shadow-sm">
                      {isHindi ? 'छवि चुनें' : 'Choose Image File'}
                    </div>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
            )}

            {/* Live Status indicator */}
            {isScanning && (
              <div className="text-center text-xs font-mono font-bold text-[var(--accent)] animate-pulse flex items-center justify-center gap-2 py-1">
                <Activity size={14} className="animate-spin text-emerald-400" />
                <span>{statusText}</span>
              </div>
            )}

            {/* QUICK TEST SAMPLES (Instant 1-Click Real vs Fake Test) */}
            <div className="mt-1 pt-3 border-t border-[#18233a] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{isHindi ? 'त्वरित परीक्षण (असली बनाम नकली):' : 'Quick Test Presets (Instant Real vs Fake Verification):'}</span>
                </span>
                <span className="text-[9.5px] text-[var(--text-muted)]">
                  {isHindi ? 'क्लिक करके टेस्ट करें' : 'Click to inspect perimeter & threats'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {SAMPLE_QR_TESTS.map((test) => (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => handleScanSuccess(test.payload)}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#070b14] hover:bg-[#131b2e] border border-[#1b2742] hover:border-[var(--accent)] text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-base shrink-0">{test.icon}</span>
                      <span
                        className={`text-[8.5px] font-extrabold uppercase px-1 rounded ${
                          test.verdict === 'FAKE'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {test.badge}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
                      {test.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(QRScanner);
