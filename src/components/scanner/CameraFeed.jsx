import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, AlertCircle, Video, VideoOff } from 'lucide-react';

const CameraFeed = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-secondary)] cyber-card w-full flex items-center justify-center border border-[var(--border-card)]">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="relative w-2/3 h-2/3 scan-crosshair">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent)] scan-corners"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)] scan-corners"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)] scan-corners-bottom"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent)] scan-corners-bottom"></div>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent)] scan-line-vertical"></div>
              </div>
            </div>
            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--bg-primary)]/80 px-3 py-1 rounded-full backdrop-blur-sm border border-[var(--glass-border)] z-20">
              <div className="w-2 h-2 rounded-full bg-[var(--safe)] pulse-dot"></div>
              <span className="text-xs font-medium text-[var(--safe)]">{t('scanner.cameraActive')}</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center grid-bg p-6 text-center">
            {error ? (
              <div className="flex flex-col items-center text-[var(--threat)] gap-3">
                <AlertCircle size={48} className="opacity-80" />
                <p className="font-semibold text-lg">{t('scanner.permissionDenied')}</p>
                <p className="text-sm opacity-80">{t('scanner.permissionDeniedDetails')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[var(--text-muted)] gap-4">
                <div className="p-4 rounded-full bg-[var(--bg-primary)]/50 border border-[var(--border-color)]">
                  <Camera size={48} className="text-[var(--accent)] opacity-80" />
                </div>
                <p className="text-lg">{t('scanner.cameraInactiveText')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center w-full mt-2">
        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            isActive 
              ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-card)]'
              : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/50 hover:bg-[var(--accent)] hover:text-white'
          }`}
        >
          {isActive ? (
            <>
              <VideoOff size={18} />
              {t('scanner.stopCamera')}
            </>
          ) : (
            <>
              <Video size={18} />
              {t('scanner.startCamera')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;
