import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QrCode, Upload, CheckCircle2, ShieldCheck, ShieldAlert, Activity,
  RefreshCw, Copy, Check, AlertTriangle, ExternalLink, PhoneCall,
  Camera, SwitchCamera, Sparkles, AlertOctagon, Eye, EyeOff,
  FileText, Wifi, CreditCard, Link2, ChevronRight, Shield
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
  const [isProcessing, setIsProcessing] = useState(false);

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
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
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
    isHindi ? 'QR पेलोड और अनुपयुक्त सामग्री की जांच...' : 'Scanning QR payload & inappropriate content...',
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

  // Main scan success handler: runs inappropriate content detector + global VT engines
  const handleScanSuccess = useCallback(async (decodedText) => {
    playScanBeep();
    await safeStopScanner();
    setScanResult(decodedText);
    setIsProcessing(true);
    setStatusText(isHindi ? 'सामग्री का विश्लेषण हो रहा है...' : 'Evaluating Inappropriate Content & Threat Matrices...');

    try {
      // 1. Instant Deep Inappropriate Content Analysis
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
      setIsProcessing(false);
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

  // Start Camera Scanning with multi-tier fallback (environment -> user -> deviceId)
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

      // Camera selection strategy:
      // 1. Explicit camera ID if supplied or selected
      // 2. Back camera if detected in available cameras
      // 3. facingMode: "environment"
      // 4. Fallback to facingMode: "user" (e.g. desktop webcams)
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

      // Try facingMode: environment
      try {
        await html5QrCode.start({ facingMode: 'environment' }, scanConfig, handleScanSuccess, () => {});
      } catch (envErr) {
        console.warn('Environment facingMode failed, falling back to front/user webcam:', envErr);
        // Fallback to front webcam / user camera (crucial for laptops/desktops)
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

  // Switch between available cameras
  const handleSwitchCamera = useCallback(async () => {
    if (availableCameras.length <= 1) return;
    const nextIndex = (activeCameraIndex + 1) % availableCameras.length;
    setActiveCameraIndex(nextIndex);
    const nextCamera = availableCameras[nextIndex];
    if (nextCamera) {
      await startCameraScan(nextCamera.id);
    }
  }, [availableCameras, activeCameraIndex, startCameraScan]);

  // Handle Image File Upload (PNG, JPG, WEBP, SVG)
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show image preview
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

      // Ensure hidden container exists
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

  // Copy payload to clipboard
  const handleCopyPayload = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Safe cleanup on unmount
  useEffect(() => {
    return () => {
      safeStopScanner();
    };
  }, [safeStopScanner]);

  const isInappropriate = analysisReport?.isInappropriate;
  const isMalicious = analysisReport?.isMalicious || (vtAnalysis && (vtAnalysis.maliciousCount > 0 || vtAnalysis.riskScore > 50));
  const isSafe = analysisReport?.isSafe && !isMalicious;

  return (
    <div className="flex flex-col gap-3.5 h-full cyber-card bg-[#0e1424] rounded-xl border border-[#1e2d4a] p-3.5 sm:p-4 font-mono text-xs text-[var(--text-primary)]">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#1b2742] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
            <QrCode size={16} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <span>{isHindi ? 'AI मोशन व अनुपयुक्त सामग्री QR स्कैनर' : 'AI Optical & Content Scanner'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                v6.2
              </span>
            </h3>
            <p className="text-[10px] text-[var(--text-muted)]">
              {isHindi ? '18+ सामग्री, सट्टा, नकली UPI और मैलवेयर की रीयल-टाइम पहचान' : 'Real-time detection of 18+ adult, betting, fake UPI & malware payloads'}
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

          <div className="flex bg-[#080d1a] rounded-lg p-0.5 border border-[#1e2d4a]">
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
      <div className="flex-grow flex flex-col gap-3">
        {scanResult && analysisReport ? (
          /* ── DETAILED SCAN & INAPPROPRIATE CONTENT RESULTS VIEW ── */
          <div className="flex flex-col gap-3.5 animate-fadeIn">
            {/* Primary Threat Banner */}
            <div
              className={`p-4 rounded-xl border flex flex-col gap-3 shadow-xl relative overflow-hidden ${
                isInappropriate || isMalicious
                  ? 'bg-gradient-to-br from-rose-950/40 via-red-900/20 to-slate-950/80 border-rose-500/60 text-rose-200'
                  : 'bg-gradient-to-br from-emerald-950/40 via-teal-900/20 to-slate-950/80 border-emerald-500/60 text-emerald-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      isInappropriate || isMalicious
                        ? 'bg-rose-500/20 border border-rose-500 text-rose-400 animate-pulse'
                        : 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                    }`}
                  >
                    {isInappropriate || isMalicious ? (
                      <AlertOctagon size={26} />
                    ) : (
                      <ShieldCheck size={26} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                          isInappropriate || isMalicious
                            ? 'bg-rose-500 text-slate-950 shadow-sm'
                            : 'bg-emerald-500 text-slate-950 shadow-sm'
                        }`}
                      >
                        {analysisReport.badgeLabel || (isMalicious ? 'THREAT DETECTED' : 'SAFE')}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        {analysisReport.rating}
                      </span>
                      {analysisReport.isChildSafetyViolation && (
                        <span className="text-[9.5px] font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                          <Shield size={10} />
                          {isHindi ? 'बाल सुरक्षा उल्लंघन' : 'Child Safety Violation'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      {analysisReport.title}
                    </h4>
                  </div>
                </div>

                {/* Risk Score Pill */}
                <div className="text-right shrink-0 bg-black/50 p-2 rounded-lg border border-white/10">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Risk Index</div>
                  <div
                    className={`text-base sm:text-lg font-black font-mono leading-none ${
                      analysisReport.riskScore > 70
                        ? 'text-rose-400'
                        : analysisReport.riskScore > 40
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {analysisReport.riskScore}/100
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] mt-0.5">
                    {analysisReport.confidence}% confidence
                  </div>
                </div>
              </div>

              {/* Inappropriate Reason Description */}
              <div className="bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-[var(--text-primary)] leading-relaxed">
                <span className="font-bold text-[var(--accent)] mr-1">
                  {isHindi ? 'मूल्यांकन निष्कर्ष:' : 'Analysis Summary:'}
                </span>
                {analysisReport.reason}
              </div>
            </div>

            {/* Content & Metadata Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left Column: Decoded Payload & QR Type Details */}
              <div className="bg-[#0b101e] border border-[#1e2d4a] rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-[#18233a] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
                    {analysisReport.parsedType === 'upi' ? (
                      <CreditCard size={14} />
                    ) : analysisReport.parsedType === 'url' ? (
                      <Link2 size={14} />
                    ) : analysisReport.parsedType === 'wifi' ? (
                      <Wifi size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                    <span className="uppercase">
                      {analysisReport.parsedType === 'upi'
                        ? 'UPI Payment Payload'
                        : analysisReport.parsedType === 'url'
                        ? 'Web URL Target'
                        : analysisReport.parsedType === 'wifi'
                        ? 'Wi-Fi Network Profile'
                        : 'Decoded Text Payload'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="flex items-center gap-1 px-2 py-0.5 bg-[#141d33] hover:bg-[#1e2c4d] text-[var(--text-secondary)] hover:text-white rounded border border-[#27395c] text-[10px] transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{copied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'कॉपी करें' : 'Copy')}</span>
                  </button>
                </div>

                {/* Parsed Field Inspector for UPI */}
                {analysisReport.parsedType === 'upi' && analysisReport.parsedDetails && (
                  <div className="space-y-1.5 text-[11px] bg-[#070b14] p-2.5 rounded-lg border border-[#1b2742]">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Payee Address (VPA):</span>
                      <span className="font-bold text-amber-300 font-mono">
                        {analysisReport.parsedDetails.payeeAddress || 'N/A'}
                      </span>
                    </div>
                    {analysisReport.parsedDetails.payeeName && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)]">Payee Display Name:</span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {analysisReport.parsedDetails.payeeName}
                        </span>
                      </div>
                    )}
                    {analysisReport.parsedDetails.amount && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)]">Requested Debit Amount:</span>
                        <span className="font-bold text-rose-400 font-mono">
                          ₹{analysisReport.parsedDetails.amount} {analysisReport.parsedDetails.currency || 'INR'}
                        </span>
                      </div>
                    )}
                    {analysisReport.parsedDetails.transactionNote && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)]">Transaction Note / Lure:</span>
                        <span className="italic text-cyan-300">
                          "{analysisReport.parsedDetails.transactionNote}"
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Parsed Field Inspector for URL */}
                {analysisReport.parsedType === 'url' && analysisReport.parsedDetails && (
                  <div className="space-y-1 text-[11px] bg-[#070b14] p-2.5 rounded-lg border border-[#1b2742]">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Destination Host:</span>
                      <span className="font-bold text-cyan-300 font-mono">
                        {analysisReport.parsedDetails.hostname}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--text-muted)]">Protocol Encryption:</span>
                      <span className={analysisReport.parsedDetails.isHttps ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {analysisReport.parsedDetails.protocol?.toUpperCase() || 'HTTP'} {analysisReport.parsedDetails.isHttps ? '🔒 Secure' : '⚠️ Unencrypted'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Raw Decoded Text */}
                <div className="mt-1">
                  <div className="text-[9.5px] uppercase text-[var(--text-muted)] mb-1">
                    {isHindi ? 'कच्चा पेलोड (Raw Data):' : 'Raw Decoded Text:'}
                  </div>
                  <pre className="text-[11px] font-mono text-[var(--text-secondary)] break-all bg-[#070b14] p-2.5 rounded-lg border border-[#1b2742] max-h-24 overflow-y-auto whitespace-pre-wrap">
                    {scanResult}
                  </pre>
                </div>
              </div>

              {/* Right Column: Inappropriate Indicators & Safety Directives */}
              <div className="bg-[#0b101e] border border-[#1e2d4a] rounded-xl p-3 flex flex-col gap-2.5">
                <div className="border-b border-[#18233a] pb-2 text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className={isInappropriate ? 'text-rose-400' : 'text-emerald-400'} />
                    <span>{isHindi ? 'पहचाने गए खतरे व संकेत' : 'Detected Risk Indicators'}</span>
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">
                    {analysisReport.indicators.length} {isHindi ? 'संकेत' : 'flags'}
                  </span>
                </div>

                {/* Indicators List */}
                <div className="space-y-1.5 flex-grow overflow-y-auto max-h-36 pr-1">
                  {analysisReport.indicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-[11px] leading-snug p-1.5 rounded bg-[#070b14] border border-[#1b2742]"
                    >
                      <span className="text-rose-400 shrink-0 mt-0.5">•</span>
                      <span className="text-[var(--text-secondary)]">{ind}</span>
                    </div>
                  ))}
                  {analysisReport.indicators.length === 0 && (
                    <div className="text-[11px] text-emerald-400 p-2 text-center bg-emerald-950/20 rounded border border-emerald-500/20">
                      ✓ {isHindi ? 'कोई संदिग्ध या अनुपयुक्त सामग्री नहीं मिली' : 'Zero suspicious or inappropriate vectors detected'}
                    </div>
                  )}
                </div>

                {/* Actionable Advice Card */}
                {analysisReport.safetyAdvice.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#0e172a] border border-[#1e2d4a] text-[11px] space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <Shield size={12} />
                      <span>{isHindi ? 'सुरक्षा निर्देश (Safety Directives):' : 'Safety Advice & Protocol:'}</span>
                    </div>
                    {analysisReport.safetyAdvice.map((adv, idx) => (
                      <p key={idx} className="text-[var(--text-secondary)] text-[10.5px] leading-tight">
                        → {adv}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#18233a]">
              <div className="flex items-center gap-2">
                <a
                  href="tel:1930"
                  className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="National Cyber Crime Reporting Helpline"
                >
                  <PhoneCall size={12} className="animate-pulse" />
                  <span>{isHindi ? '1930 साइबर हेल्पलाइन' : 'Report to 1930 Helpline'}</span>
                </a>

                {analysisReport.parsedType === 'url' && isSafe && (
                  <a
                    href={scanResult.startsWith('http') ? scanResult : `https://${scanResult}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{isHindi ? 'सुरक्षित खोलें' : 'Open Link'}</span>
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
                {/* Viewport for Html5Qrcode video & canvas */}
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
                        ? 'कैमरा फ़ीड में QR कोड रखें। अनुपयुक्त व 18+ सामग्री की तुरंत जांच होगी।'
                        : 'Point camera at any QR code. Detects 18+ adult material, fake UPI traps & malicious payloads instantly.'}
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

            {/* QUICK TEST SAMPLES CAROUSEL (Allows instant 1-click test of inappropriate content detection) */}
            <div className="mt-1 pt-3 border-t border-[#18233a] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{isHindi ? 'त्वरित परीक्षण नमूने (1-क्लिक टेस्ट):' : 'Quick Test Presets (Instant Inappropriate Verification):'}</span>
                </span>
                <span className="text-[9.5px] text-[var(--text-muted)]">
                  {isHindi ? 'क्लिक करके टेस्ट करें' : 'Click to inspect'}
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
                          test.color === 'rose' || test.color === 'red'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : test.color === 'amber' || test.color === 'orange'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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
