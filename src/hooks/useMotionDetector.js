import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom Hook: AI Motion Detector & Spatial Threat Radar
 * Tracks device motion (DeviceMotionEvent/DeviceOrientationEvent) + Canvas Frame Difference
 */
export default function useMotionDetector(videoRef, isCameraActive) {
  const [motionData, setMotionData] = useState({
    motionScore: 0,
    motionStatus: 'STABLE',
    alpha: 0,
    beta: 0,
    gamma: 0,
    posX: 50,
    posY: 50,
    verdict: 'REAL',
    verdictConfidence: 99.4,
    threatDetected: false,
    alertMessage: 'REAL SAFE ENVIRONMENT',
  });

  const canvasRef = useRef(null);
  const prevFrameRef = useRef(null);
  const animFrameRef = useRef(null);

  // 1. Device Sensor Motion & Gyroscope Listener
  useEffect(() => {
    const handleDeviceMotion = (e) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;

      const totalAcc = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
      const deltaAcc = Math.abs(totalAcc - 9.81);

      setMotionData((prev) => {
        const newScore = Math.min(100, Math.round(deltaAcc * 15));
        const status = newScore > 50 ? 'HIGH_TURBULENCE' : newScore > 20 ? 'SCANNING_MOTION' : 'STABLE';
        const posX = Math.max(10, Math.min(90, prev.posX + (acc.x || 0) * 2));
        const posY = Math.max(10, Math.min(90, prev.posY - (acc.y || 0) * 2));

        return {
          ...prev,
          motionScore: newScore,
          motionStatus: status,
          posX,
          posY,
        };
      });
    };

    const handleDeviceOrientation = (e) => {
      setMotionData((prev) => ({
        ...prev,
        alpha: Math.round(e.alpha || 0),
        beta: Math.round(e.beta || 0),
        gamma: Math.round(e.gamma || 0),
      }));
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // 2. Video Frame Difference Motion Analysis
  const analyzeFrameMotion = useCallback(() => {
    if (!videoRef?.current || !isCameraActive) return;

    const video = videoRef.current;
    if (video.readyState !== 4) {
      animFrameRef.current = requestAnimationFrame(analyzeFrameMotion);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 160;
      canvasRef.current.height = 120;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 160, 120);

    const frameData = ctx.getImageData(0, 0, 160, 120).data;

    if (prevFrameRef.current) {
      let diff = 0;
      for (let i = 0; i < frameData.length; i += 16) {
        diff += Math.abs(frameData[i] - prevFrameRef.current[i]);
      }
      const pixelMotionScore = Math.min(100, Math.round(diff / 500));

      setMotionData((prev) => {
        const combinedScore = Math.max(prev.motionScore, pixelMotionScore);
        const isHighRisk = combinedScore > 75;

        return {
          ...prev,
          motionScore: combinedScore,
          verdict: isHighRisk ? 'FAKE' : 'REAL',
          threatDetected: isHighRisk,
          verdictConfidence: isHighRisk ? 94.8 : 99.4,
          alertMessage: isHighRisk
            ? '⚠️ MOTION ALERT: SUSPICIOUS PAYLOAD DISRUPTION DETECTED (FAKE)'
            : '✅ MOTION VERDICT: STABLE SAFE ENVIRONMENT (REAL)',
        };
      });
    }

    prevFrameRef.current = frameData;
    animFrameRef.current = requestAnimationFrame(analyzeFrameMotion);
  }, [videoRef, isCameraActive]);

  useEffect(() => {
    if (isCameraActive) {
      animFrameRef.current = requestAnimationFrame(analyzeFrameMotion);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, analyzeFrameMotion]);

  return motionData;
}
