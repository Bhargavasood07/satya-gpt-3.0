import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, AlertCircle, Video, VideoOff, Activity, ShieldCheck, ShieldAlert, Navigation } from 'lucide-react';
import useMotionDetector from '../../hooks/useMotionDetector';

const CameraFeed = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  // AI Motion Detector Radar Hook
  const motionData = useMotionDetector(videoRef, isActive);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError('Permission denied');
      setIsActive(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsActive(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex flex-col gap-4 w-full h-full font-mono">
      {/* Real vs Fake AI Motion Detector Notification Banner */}
      {isActive && (
        <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold shadow-lg transition-all ${
          motionData.verdict === 'FAKE'
            ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse'
            : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
        }`}>
          <div className="flex items-center gap-2">
            {motionData.verdict === 'FAKE' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
            <span>{motionData.alertMessage}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded bg-[#0B0F19] border border-[#27395C] text-[10px]">
              CONFIDENCE: {motionData.verdictConfidence}%
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
              motionData.verdict === 'FAKE' ? 'bg-rose-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}>
              {motionData.verdict}
            </span>
          </div>
        </div>
      )}

      {/* Main Camera Viewport with Motion Radar Target Reticle */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0B0F19] cyber-card w-full flex items-center justify-center border border-[#27395C] shadow-2xl">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* AI Motion Detector Targeting Reticle (Follows motion coordinates) */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div 
                className="absolute w-24 h-24 border-2 border-[var(--accent)] rounded-full transition-all duration-150 flex items-center justify-center shadow-[0_0_15px_var(--accent)]"
                style={{
                  left: `${motionData.posX}%`,
                  top: `${motionData.posY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                <div className="absolute -top-5 text-[9px] font-bold text-[var(--accent)] bg-[#0B0F19]/80 px-1.5 py-0.2 rounded border border-[var(--border-card)]">
                  TARGET LOCK: ({motionData.posX.toFixed(0)}, {motionData.posY.toFixed(0)})
                </div>
              </div>

              {/* Standard Scanning Corners */}
              <div className="absolute inset-8 border border-[var(--accent)]/30 rounded-xl pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--accent)]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--accent)]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--accent)]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--accent)]" />
              </div>
            </div>

            {/* Top-Right Spatial Motion Status Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#0B0F19]/90 px-3 py-1.5 rounded-lg backdrop-blur-md border border-[#27395C] z-20 text-[11px]">
              <Activity size={14} className="text-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400">MOTION RADAR: ACTIVE</span>
              <span className="text-[var(--text-muted)]">|</span>
              <span className="text-[var(--accent)] font-mono">{motionData.motionScore} Hz</span>
            </div>

            {/* Bottom-Left Gyroscope Spatial Orientation Display */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#0B0F19]/90 px-3 py-1.5 rounded-lg backdrop-blur-md border border-[#27395C] z-20 text-[10px] text-[var(--text-muted)]">
              <Navigation size={12} className="text-amber-400" />
              <span>α: {motionData.alpha}°</span>
              <span>β: {motionData.beta}°</span>
              <span>γ: {motionData.gamma}°</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {error ? (
              <div className="flex flex-col items-center text-rose-400 gap-3">
                <AlertCircle size={44} />
                <p className="font-bold text-sm">{t('scanner.permissionDenied')}</p>
                <p className="text-xs text-[var(--text-muted)]">{t('scanner.permissionDeniedDetails')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[var(--text-muted)] gap-3">
                <div className="p-4 rounded-full bg-[#131B2E] border border-[#27395C]">
                  <Camera size={44} className="text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">AI Motion Detector & Spatial Radar Inactive</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Start camera to enable real vs fake device tracking</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Button */}
      <div className="flex justify-center w-full">
        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
            isActive 
              ? 'bg-[#131B2E] text-[var(--text-primary)] border border-[#27395C] hover:bg-slate-800'
              : 'bg-[var(--accent)] hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_var(--accent-glow)]'
          }`}
        >
          {isActive ? (
            <>
              <VideoOff size={16} />
              <span>Stop Motion Radar</span>
            </>
          ) : (
            <>
              <Video size={16} />
              <span>Start Motion Detector Camera</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;
