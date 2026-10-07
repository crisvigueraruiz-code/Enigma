import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { WindmillPOI, ForestPack, PlayerSession } from '../types';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import {
  QrCode,
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  RotateCcw,
  Keyboard,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface PhysicalBeaconScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoi: WindmillPOI;
  forest: ForestPack;
  session?: PlayerSession | null;
  onBeaconVerified: (poi: WindmillPOI) => void;
}

export const PhysicalBeaconScannerModal: React.FC<PhysicalBeaconScannerModalProps> = ({
  isOpen,
  onClose,
  currentPoi,
  forest,
  session,
  onBeaconVerified,
}) => {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Clean shutdown of media stream and animation frames
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setTorchEnabled(false);
  };

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    setScanSuccess(false);
    setScannedFeedback(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('La cámara no está soportada en este navegador.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Check if torch/flashlight is supported on the video track
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities: any = track.getCapabilities?.() || {};
        setTorchSupported(Boolean(capabilities.torch));
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        requestScanFrame();
      }
    } catch (err: any) {
      console.warn('Error starting camera for QR beacon scan:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Permiso de cámara denegado. Puedes escribir el código de la baliza manualmente o subir una foto.'
          : 'No se pudo acceder a la cámara. Prueba el código manual o sube una foto.'
      );
    }
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const next = !torchEnabled;
      await (track as any).applyConstraints({
        advanced: [{ torch: next }],
      });
      setTorchEnabled(next);
      sounds.playClick();
    } catch (e) {
      console.warn('Torch constraint error:', e);
    }
  };

  const toggleFacingMode = () => {
    sounds.playClick();
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  // Real-time video frame decoding loop
  const requestScanFrame = () => {
    if (!videoRef.current || !canvasRef.current || scanSuccess) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleCodeDetected(code.data);
        return; // Stop scanning loop on detection
      }
    }

    animationFrameRef.current = requestAnimationFrame(requestScanFrame);
  };

  // Handle scanned QR string (supports URLs, JSON, and raw strings)
  const handleCodeDetected = (rawText: string) => {
    if (scanSuccess) return;

    const text = rawText.trim();
    console.log('QR Beacon Scanned:', text);

    // 1. Check if it matches expected currentPoi beaconCode or ID
    const isCurrentPoiBeacon = checkBeaconMatch(text, currentPoi);

    if (isCurrentPoiBeacon) {
      triggerSuccess(currentPoi);
      return;
    }

    // 2. Check if it matches another POI in the forest
    const otherPoi = forest.pois.find((p) => p.id !== currentPoi.id && checkBeaconMatch(text, p));
    if (otherPoi) {
      sounds.playWarning();
      setScannedFeedback(
        `Baliza detectada: «${otherPoi.name}». Tu objetivo actual es «${currentPoi.name}». Sigue el sendero hasta tu hito.`
      );
      // Resume scanning after 3 seconds
      setTimeout(() => {
        setScannedFeedback(null);
        if (!scanSuccess) requestScanFrame();
      }, 3500);
      return;
    }

    // 3. Generic QR not related to this trail
    sounds.playClick();
    setScannedFeedback('Código QR no reconocido para este sendero. Verifica la placa de la baliza física.');
    setTimeout(() => {
      setScannedFeedback(null);
      if (!scanSuccess) requestScanFrame();
    }, 2800);
  };

  // Matcher function for various QR formats (URL params, raw codes, beacon prefixes)
  const checkBeaconMatch = (text: string, poi: WindmillPOI): boolean => {
    const lower = text.toLowerCase();
    const poiIdLower = poi.id.toLowerCase();
    const beaconCodeLower = (poi.beaconCode || `beacon-${poi.id}`).toLowerCase();

    // Check query params in URL: ?poi=... or &poi=...
    if (lower.includes(`poi=${poiIdLower}`) || lower.includes(`poi=${encodeURIComponent(poi.id)}`)) {
      return true;
    }

    // Check direct beacon code match
    if (lower === beaconCodeLower || lower === poiIdLower) {
      return true;
    }

    // Check prefix formats: BEACON:forestId:poiId or BEACON_poiId
    if (lower.includes(`beacon:${forest.id.toLowerCase()}:${poiIdLower}`)) {
      return true;
    }
    if (lower.includes(`beacon:${poiIdLower}`) || lower.includes(`beacon_${poiIdLower}`)) {
      return true;
    }

    // Match short human code if specified
    if (poi.beaconCode && lower.includes(poi.beaconCode.toLowerCase())) {
      return true;
    }

    return false;
  };

  const triggerSuccess = (verifiedPoi: WindmillPOI) => {
    setScanSuccess(true);
    stopCamera();
    sounds.playSuccess();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 75, 150]);
    }

    setTimeout(() => {
      onBeaconVerified(verifiedPoi);
      onClose();
    }, 1200);
  };

  // Process chosen image file from camera gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleCodeDetected(code.data);
        } else {
          sounds.playWarning();
          setManualError('No se detectó ningún código QR en la imagen subida. Prueba con otra foto o escribe el código.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle manual code submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    const input = manualCodeInput.trim();
    if (!input) return;

    if (checkBeaconMatch(input, currentPoi)) {
      triggerSuccess(currentPoi);
    } else {
      sounds.playWarning();
      setManualError(`El código «${input}» no coincide con la baliza de «${currentPoi.name}».`);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1C2E20] via-[#152318] to-[#0D1710] border-2 border-amber-500/60 rounded-3xl shadow-2xl text-stone-100 overflow-hidden">
        {/* Hidden File Input for Gallery upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-600/30 bg-gradient-to-r from-amber-950/80 via-emerald-950 to-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                Escáner de Campo
              </span>
              <h3 className="font-adventure text-base sm:text-lg font-bold text-amber-100 leading-tight">
                Baliza Física QR • {currentPoi.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900/70 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Viewfinder */}
        <div className="p-5 space-y-4">
          {/* Target POI Badge & Physical Clue */}
          <div className="p-3 rounded-2xl bg-black/40 border border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block">
                  Hito Objetivo:
                </span>
                <span className="font-adventure font-bold text-amber-200">
                  {currentPoi.emoji} {currentPoi.name}
                </span>
              </div>
            </div>

            {currentPoi.beaconHint && (
              <span className="text-[10px] text-amber-300/90 italic bg-amber-950/50 border border-amber-600/40 px-2.5 py-1 rounded-lg">
                💡 {currentPoi.beaconHint}
              </span>
            )}
          </div>

          {/* Scanner Viewport */}
          <div className="relative aspect-square max-h-72 w-full mx-auto rounded-3xl overflow-hidden bg-black border-2 border-emerald-500/50 shadow-inner flex items-center justify-center">
            {scanSuccess ? (
              <div className="p-6 text-center space-y-2 animate-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-adventure text-lg font-bold text-emerald-200">
                  ¡Baliza Confirmada!
                </h4>
                <p className="text-xs text-stone-300">
                  Llegada verificada en el terreno. Desbloqueando enigma...
                </p>
              </div>
            ) : cameraError ? (
              <div className="p-6 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 font-adventure text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reintentar Cámara</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Reticle Overlay */}
                <div className="absolute inset-8 pointer-events-none border-2 border-emerald-400/60 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  {/* Corner Marks */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1 rounded-br" />

                  {/* Pulsing Scan Beam */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_10px_#fde047] animate-pulse absolute top-1/2 -translate-y-1/2" />
                </div>

                <div className="absolute bottom-2 text-center text-[10px] font-mono text-stone-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                  Apunta a la placa QR de la baliza física
                </div>
              </>
            )}
          </div>

          {/* Feedback banner */}
          {scannedFeedback && (
            <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/70 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{scannedFeedback}</span>
            </div>
          )}

          {/* Camera Controls Toolbar */}
          {!scanSuccess && !cameraError && (
            <div className="flex items-center justify-center gap-3">
              {torchSupported && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    torchEnabled
                      ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-lg'
                      : 'bg-black/40 border-stone-700 text-stone-300 hover:text-white'
                  }`}
                  title="Linterna para balizas en sombra o atardecer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{torchEnabled ? 'Linterna ON' : 'Linterna'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleFacingMode}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Cambiar cámara"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cambiar</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Subir foto tomada previamente"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Subir Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showManualInput
                    ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold'
                    : 'bg-black/40 border-stone-700 text-stone-300 hover:text-white'
                }`}
                title="Escribir el código manualmente"
              >
                <Keyboard className="w-4 h-4 text-amber-300" />
                <span>Código</span>
              </button>
            </div>
          )}

          {/* Manual Code Input Dropdown / Fallback */}
          {showManualInput && !scanSuccess && (
            <form onSubmit={handleManualSubmit} className="p-4 rounded-2xl bg-black/50 border border-amber-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span>Introducir Código Impreso en la Baliza</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Ej: {currentPoi.beaconCode || `BEACON-${currentPoi.id.toUpperCase()}`}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCodeInput}
                  onChange={(e) => setManualCodeInput(e.target.value)}
                  placeholder={`Código de baliza (${currentPoi.beaconCode || currentPoi.id})`}
                  className="flex-1 bg-[#101912] border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder:text-stone-600 uppercase font-mono focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure text-xs font-bold tracking-wider cursor-pointer shadow-md"
                >
                  Verificar
                </button>
              </div>

              {manualError && (
                <p className="text-[11px] text-red-400 italic">
                  {manualError}
                </p>
              )}
            </form>
          )}

          {/* Demo helper for organizers/testers */}
          <div className="p-3 rounded-xl bg-stone-900/40 border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Baliza oficial: <strong className="font-mono text-amber-300">{currentPoi.beaconCode || `BEACON-${currentPoi.id.toUpperCase()}`}</strong></span>
            </span>
            <button
              type="button"
              onClick={() => {
                setManualCodeInput(currentPoi.beaconCode || currentPoi.id);
                setShowManualInput(true);
              }}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer"
            >
              Autocompletar
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-emerald-950 flex items-center justify-between text-xs text-stone-400">
          <p className="text-[11px]">
            La baliza física confirma tu llegada exacta independientemente de la cobertura GPS.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-adventure text-xs font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
