import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Upload, CheckCircle2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { analyzeScamGlobally } from '../../services/virusTotalService';

const QRScanner = ({ onScanResult }) => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [statusText, setStatusText] = useState('');
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'upload'
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const statusIntervalRef = useRef(null);

  const statusMessages = [
    t('scanner.scanning', 'Scanning for threats...'),
    t('scanner.extracting', 'Extracting payload...'),
    t('scanner.decoding', 'Decoding QR matrix...')
  ];

  const cycleStatusText = useCallback(() => {
    let i = 0;
    setStatusText(statusMessages[0]);
    statusIntervalRef.current = setInterval(() => {
      i = (i + 1) % statusMessages.length;
      setStatusText(statusMessages[i]);
    }, 1500);
  }, [t, statusMessages]);

  const stopStatusCycle = useCallback(() => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }
  }, []);

  const handleScanSuccess = async (decodedText, decodedResult) => {
    stopStatusCycle();
    setScanResult(decodedText);
    setStatusText(t('scanner.scanSuccess', 'QR Code Decoded Successfully'));

    const vtReport = await analyzeScamGlobally(decodedText, 'qr');

    if (onScanResult) {
      onScanResult(decodedText, 'qr', vtReport);
    }
    if (html5QrCodeRef.current && isScanning) {
      html5QrCodeRef.current.stop().then(() => {
        setIsScanning(false);
      }).catch(err => {
        console.error("Error stopping scanner", err);
      });
    }
  };

  const startCameraScan = async () => {
    try {
      setScanResult(null);
      setIsScanning(true);
      cycleStatusText();
      
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        handleScanSuccess,
        (errorMessage) => {
          // parse errors normal
        }
      );
    } catch (err) {
      console.error("Error starting camera scanner:", err);
      setIsScanning(false);
      stopStatusCycle();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setScanResult(null);
      setIsScanning(true);
      cycleStatusText();
      
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
      
      const decodedText = await html5QrCode.scanFile(file, true);
      await handleScanSuccess(decodedText);
    } catch (err) {
      console.error("Error scanning file:", err);
      setIsScanning(false);
      stopStatusCycle();
      setStatusText(t('scanner.scanFailed', 'Scan Failed'));
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  useEffect(() => {
    return () => {
      stopStatusCycle();
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [stopStatusCycle, isScanning]);

  return (
    <div className="flex flex-col gap-4 h-full cyber-card bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-card)] p-4">
      <div className="flex justify-between items-center mb-2 border-b border-[var(--border-color)] pb-3">
        <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
          <QrCode className="text-[var(--accent)]" size={18} />
          <span>{t('scanner.scanQr', 'QR Scanner')}</span>
        </h3>
        
        <div className="flex bg-[var(--bg-primary)] rounded-lg p-1 border border-[var(--border-color)]">
          <button
            onClick={() => setScanMode('camera')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              scanMode === 'camera' 
                ? 'bg-[var(--accent)] text-slate-950 shadow-md' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              scanMode === 'upload' 
                ? 'bg-[var(--accent)] text-slate-950 shadow-md' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Upload Image
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {scanResult ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4 border border-[var(--safe)]/30 bg-[var(--safe)]/5 rounded-xl gap-3">
            <CheckCircle2 size={40} className="text-[var(--safe)]" />
            <div className="text-center">
              <h4 className="text-sm font-bold text-[var(--safe)] mb-1">QR Code Scanned & Analyzed</h4>
              <p className="text-xs font-mono text-[var(--text-primary)] break-all max-w-md bg-[var(--bg-primary)] p-2.5 rounded-lg border border-[var(--border-color)]">
                {scanResult}
              </p>
            </div>
            <button
              onClick={() => {
                setScanResult(null);
                setStatusText('');
              }}
              className="mt-2 px-4 py-1.5 bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs border border-[var(--border-color)] rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              Scan Another QR
            </button>
          </div>
        ) : (
          <>
            {scanMode === 'camera' ? (
              <div className="relative w-full aspect-square max-h-[260px] bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden mx-auto">
                <div id="qr-reader" className="w-full h-full object-cover"></div>
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/90 backdrop-blur-sm z-10">
                    <button
                      onClick={startCameraScan}
                      className="px-5 py-2.5 bg-[var(--accent)] text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2 text-xs shadow-[0_0_15px_var(--accent-glow)]"
                    >
                      <QrCode size={18} />
                      <span>Start QR Scan</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="relative w-full aspect-square max-h-[260px] flex flex-col items-center justify-center bg-[var(--bg-primary)] rounded-xl border-2 border-dashed border-[var(--border-card)] hover:border-[var(--accent)] transition-colors p-4 mx-auto cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div id="qr-reader" className="hidden"></div>
                
                <Upload size={36} className="text-[var(--text-muted)] mb-2" />
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">Drop QR image here</p>
                <p className="text-[11px] text-[var(--text-muted)] mb-4">or click to browse files</p>
                
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <div className="px-4 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg text-xs font-semibold">
                  Choose Image
                </div>
              </div>
            )}

            {isScanning && (
              <div className="mt-2 text-center text-xs font-mono font-semibold text-[var(--accent)] animate-pulse flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                {statusText}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
