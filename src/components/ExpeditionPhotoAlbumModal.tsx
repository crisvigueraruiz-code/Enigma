import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ForestPack, PlayerSession, WindmillPOI, FieldPhoto } from '../types';
import { api } from '../services/api';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import {
  Camera,
  Image as ImageIcon,
  X,
  Trash2,
  Download,
  Share2,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  TreePine,
  Maximize2,
  Video,
  BookOpen,
} from 'lucide-react';

interface ExpeditionPhotoAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  forest: ForestPack;
  forests?: ForestPack[];
  session?: PlayerSession | null;
  currentPoi?: WindmillPOI | null;
  onPhotoAdded?: (photo: FieldPhoto) => void;
  onOpenPassport?: () => void;
}

// Procedural stylized field sketch/photo generator for realistic demo photos
const createDemoPhotoDataUrl = (type: 'forest' | 'landmark' | 'ruins' | 'summit', title: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 675;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (type === 'forest') {
    // Deep green mystical forest with sun rays
    const grad = ctx.createLinearGradient(0, 0, 0, 675);
    grad.addColorStop(0, '#102A16');
    grad.addColorStop(0.5, '#1B4725');
    grad.addColorStop(1, '#0C1C10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 675);

    // Sun rays
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(450, 0);
      ctx.lineTo(100 + i * 140, 675);
      ctx.lineTo(160 + i * 140, 675);
      ctx.closePath();
      ctx.fillStyle = '#FFEAA7';
      ctx.fill();
    }
    ctx.restore();

    // Silhouettes of ancient trees
    ctx.fillStyle = '#061309';
    for (let x = 60; x < 900; x += 130) {
      ctx.beginPath();
      ctx.moveTo(x - 25, 675);
      ctx.lineTo(x, 180 + (x % 70));
      ctx.lineTo(x + 25, 675);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, 180 + (x % 70), 80, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'landmark') {
    // Sunset windmill / stone tower
    const grad = ctx.createLinearGradient(0, 0, 0, 675);
    grad.addColorStop(0, '#E67E22');
    grad.addColorStop(0.4, '#F39C12');
    grad.addColorStop(0.7, '#D35400');
    grad.addColorStop(1, '#1A252F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 675);

    // Sun
    ctx.fillStyle = '#FFF275';
    ctx.beginPath();
    ctx.arc(650, 220, 50, 0, Math.PI * 2);
    ctx.fill();

    // Hill
    ctx.fillStyle = '#11191F';
    ctx.beginPath();
    ctx.ellipse(450, 700, 550, 250, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tower
    ctx.fillRect(400, 320, 100, 250);
    // Blades
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(330, 250);
    ctx.lineTo(570, 390);
    ctx.moveTo(570, 250);
    ctx.lineTo(330, 390);
    ctx.stroke();
  } else if (type === 'ruins') {
    // Twilight mossy stone ruins
    const grad = ctx.createLinearGradient(0, 0, 0, 675);
    grad.addColorStop(0, '#1E272C');
    grad.addColorStop(0.6, '#2C3E50');
    grad.addColorStop(1, '#0E171E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 675);

    // Stone arches
    ctx.fillStyle = '#080C0F';
    ctx.fillRect(180, 280, 70, 350);
    ctx.fillRect(380, 280, 70, 350);
    ctx.fillRect(180, 240, 270, 50);

    ctx.fillRect(560, 340, 80, 290);
    ctx.fillRect(720, 340, 80, 290);
    ctx.fillRect(560, 300, 240, 50);

    // Glowing rune
    ctx.strokeStyle = '#F1C40F';
    ctx.lineWidth = 4;
    ctx.strokeRect(300, 360, 30, 40);
  } else {
    // Summit ridge with golden sunrise
    const grad = ctx.createLinearGradient(0, 0, 0, 675);
    grad.addColorStop(0, '#8E44AD');
    grad.addColorStop(0.4, '#E74C3C');
    grad.addColorStop(0.7, '#F39C12');
    grad.addColorStop(1, '#1C2833');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 675);

    // Mountains
    ctx.fillStyle = '#17202A';
    ctx.beginPath();
    ctx.moveTo(0, 675);
    ctx.lineTo(250, 340);
    ctx.lineTo(500, 480);
    ctx.lineTo(750, 280);
    ctx.lineTo(900, 675);
    ctx.fill();
  }

  // Camera vignette
  const vig = ctx.createRadialGradient(450, 337, 200, 450, 337, 500);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, 900, 675);

  // Bottom caption banner in photo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(20, 595, 860, 60);

  ctx.fillStyle = '#F5E6CA';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'left';
  ctx.fillText(title.toUpperCase(), 40, 633);

  ctx.fillStyle = '#E5B869';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('ENIGMA VIVO • CUADERNO DE CAMPO', 860, 633);

  return canvas.toDataURL('image/jpeg', 0.88);
};

export const ExpeditionPhotoAlbumModal: React.FC<ExpeditionPhotoAlbumModalProps> = ({
  isOpen,
  onClose,
  forest,
  forests,
  session,
  currentPoi,
  onPhotoAdded,
  onOpenPassport,
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [photos, setPhotos] = useState<FieldPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<FieldPhoto | null>(null);
  const [captionInput, setCaptionInput] = useState<string>('');
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [generatingCollage, setGeneratingCollage] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'current' | string>('all');
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);

  const sessionCode = session?.code || 'LOCAL_EXPEDITION';

  // Camera helpers are declared up front (before any effect or early return
  // that might reference them), and wrapped in useCallback so the closures
  // stay stable across renders. Declaring them further down used to throw
  // "Cannot access 'stopLiveCamera' before initialization" whenever the
  // modal closed, because the early `if (!isOpen) return null;` below
  // prevented that render from ever reaching their old declaration.
  const stopLiveCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraActive(false);
  }, []);

  const startLiveCamera = useCallback(async () => {
    sounds.playClick();
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setIsLiveCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      console.warn('Live camera not available, falling back to file input:', err);
      setIsLiveCameraActive(false);
      fileInputRef.current?.click();
    }
  }, []);

  // Load photos from storage whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const list = api.getExpeditionPhotos(sessionCode);
      setPhotos(list);
    } else {
      stopLiveCamera();
    }
    return () => {
      stopLiveCamera();
    };
  }, [isOpen, sessionCode, stopLiveCamera]);

  // Teardown camera on unmount
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, [stopLiveCamera]);

  if (!isOpen) return null;

  const captureLiveFrame = () => {
    if (!videoRef.current) return;
    sounds.playClick();
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.85);
      setTempImagePreview(compressed);
      setIsCapturing(true);
      stopLiveCamera();
    }
  };

  // Process chosen or captured file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize gracefully on Canvas to keep storage lightweight (<250KB)
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setTempImagePreview(compressed);
          setIsCapturing(true);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSavePhoto = () => {
    if (!tempImagePreview) return;

    sounds.playSuccess();
    const newPhoto: FieldPhoto = {
      id: `photo-${Date.now()}`,
      dataUrl: tempImagePreview,
      timestamp: new Date().toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      poiId: currentPoi?.id,
      poiName: currentPoi?.name || forest.name,
      forestId: forest.id,
      forestName: forest.name,
      caption: captionInput.trim() || undefined,
      lat: session?.lat || forest.centerLat,
      lng: session?.lng || forest.centerLng,
    };

    const updated = api.saveExpeditionPhoto(sessionCode, newPhoto);
    setPhotos(updated);
    setTempImagePreview(null);
    setCaptionInput('');
    setIsCapturing(false);

    if (onPhotoAdded) {
      onPhotoAdded(newPhoto);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm(t('album.confirmDelete') || '¿Eliminar esta foto del álbum de campo?')) {
      sounds.playClick();
      const updated = api.deleteExpeditionPhoto(sessionCode, photoId);
      setPhotos(updated);
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    }
  };

  // Populate album with authentic illustrated field photos
  const handleLoadDemoPhotos = () => {
    sounds.playSuccess();
    const demoItems: FieldPhoto[] = [
      {
        id: `demo-${Date.now()}-1`,
        dataUrl: createDemoPhotoDataUrl('forest', forest.pois[0]?.name || 'Hayedo Ancestral'),
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleDateString([], {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        poiId: forest.pois[0]?.id,
        poiName: forest.pois[0]?.name || 'Hayedo Ancestral',
        forestId: forest.id,
        forestName: forest.name,
        caption: 'Árboles centenarios envueltos en la bruma matinal. ¡Comienza la aventura!',
        lat: forest.centerLat + 0.0012,
        lng: forest.centerLng - 0.0008,
      },
      {
        id: `demo-${Date.now()}-2`,
        dataUrl: createDemoPhotoDataUrl('landmark', forest.pois[1]?.name || 'Hito Histórico'),
        timestamp: new Date(Date.now() - 3600000).toLocaleDateString([], {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        poiId: forest.pois[1]?.id,
        poiName: forest.pois[1]?.name || 'Atalaya de Piedra',
        forestId: forest.id,
        forestName: forest.name,
        caption: 'Encontramos las marcas talladas en la roca del hito principal.',
        lat: forest.centerLat + 0.0025,
        lng: forest.centerLng + 0.0015,
      },
      {
        id: `demo-${Date.now()}-3`,
        dataUrl: createDemoPhotoDataUrl('ruins', forest.pois[2]?.name || 'Ruinas del Santuario'),
        timestamp: new Date(Date.now() - 1800000).toLocaleDateString([], {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        poiId: forest.pois[2]?.id,
        poiName: forest.pois[2]?.name || 'Ruinas del Santuario',
        forestId: forest.id,
        forestName: forest.name,
        caption: 'Vestigios arcanos entre el musgo y las piedras centenarias.',
        lat: forest.centerLat - 0.0015,
        lng: forest.centerLng + 0.0018,
      },
      {
        id: `demo-${Date.now()}-4`,
        dataUrl: createDemoPhotoDataUrl('summit', 'Cumbre del Sendero'),
        timestamp: new Date().toLocaleDateString([], {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        poiId: currentPoi?.id || forest.pois[3]?.id,
        poiName: currentPoi?.name || forest.pois[3]?.name || 'Mirador del Viento',
        forestId: forest.id,
        forestName: forest.name,
        caption: '¡El equipo ha completado todos los enigmas antes del ocaso!',
        lat: forest.centerLat - 0.0022,
        lng: forest.centerLng - 0.0019,
      },
    ];

    let currentList = photos;
    for (const item of demoItems) {
      currentList = api.saveExpeditionPhoto(sessionCode, item);
    }
    setPhotos(currentList);
  };

  // Generate high-resolution Collage Poster on HTML5 Canvas (1920x1080)
  const generateCollage = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // Background Parchment Gradient
      const bgGrad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
      bgGrad.addColorStop(0, '#FFFBF0');
      bgGrad.addColorStop(0.5, '#F7EED9');
      bgGrad.addColorStop(1, '#E8DAC0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine borders
      ctx.strokeStyle = '#1E3A24';
      ctx.lineWidth = 12;
      ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

      ctx.strokeStyle = '#C99738';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Title & Header Heraldry
      ctx.fillStyle = '#C99738';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('• ENIGMA VIVO •', 960, 110);

      ctx.fillStyle = '#142918';
      ctx.font = 'bold 50px serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('DIARIO FOTOGRÁFICO DE EXPEDICIÓN', 960, 175);

      ctx.fillStyle = '#664E30';
      ctx.font = 'italic 24px serif';
      ctx.fillText(
        `${forest.name.toUpperCase()} • ${session?.name || 'Noble Explorador'} • ${new Date().toLocaleDateString()}`,
        960,
        220
      );

      // Draw up to 4 polaroids in a curated layout
      const collagePhotos = photos.slice(0, 4);
      if (collagePhotos.length === 0) {
        ctx.fillStyle = '#735B3B';
        ctx.font = '32px serif';
        ctx.fillText('Sin fotografías registradas aún en esta expedición.', 960, 560);
        return resolve(canvas.toDataURL('image/png'));
      }

      const layouts = [
        [{ x: 960, y: 620, rot: 0, w: 560, h: 480 }],
        [
          { x: 620, y: 620, rot: -0.05, w: 480, h: 420 },
          { x: 1300, y: 620, rot: 0.04, w: 480, h: 420 },
        ],
        [
          { x: 440, y: 620, rot: -0.06, w: 400, h: 360 },
          { x: 960, y: 610, rot: 0.02, w: 420, h: 380 },
          { x: 1480, y: 620, rot: -0.04, w: 400, h: 360 },
        ],
        [
          { x: 380, y: 620, rot: -0.05, w: 340, h: 320 },
          { x: 760, y: 610, rot: 0.03, w: 340, h: 320 },
          { x: 1160, y: 625, rot: -0.04, w: 340, h: 320 },
          { x: 1540, y: 615, rot: 0.05, w: 340, h: 320 },
        ],
      ];

      const currentLayout = layouts[Math.min(collagePhotos.length - 1, 3)];

      let loadedCount = 0;
      collagePhotos.forEach((item, idx) => {
        const conf = currentLayout[idx];
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.translate(conf.x, conf.y);
          ctx.rotate(conf.rot);

          // Polaroid card shadow
          ctx.shadowColor = 'rgba(0,0,0,0.25)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetX = 4;
          ctx.shadowOffsetY = 8;

          // Polaroid white frame
          const pw = conf.w;
          const ph = conf.h;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-pw / 2, -ph / 2, pw, ph);

          // Reset shadow for photo inside
          ctx.shadowColor = 'transparent';

          // Inner photo area
          const padding = 16;
          const photoW = pw - padding * 2;
          const photoH = ph - padding * 2 - 45;
          ctx.drawImage(img, -pw / 2 + padding, -ph / 2 + padding, photoW, photoH);

          // Polaroid caption & POI stamp
          ctx.fillStyle = '#261C14';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          const title = item.poiName || `Hito #${idx + 1}`;
          ctx.fillText(title, 0, ph / 2 - 24);

          ctx.fillStyle = '#735B3B';
          ctx.font = '11px sans-serif';
          ctx.fillText(item.timestamp, 0, ph / 2 - 8);

          ctx.restore();

          loadedCount++;
          if (loadedCount === collagePhotos.length) {
            // Draw Official Seal
            ctx.fillStyle = '#991B1B';
            ctx.beginPath();
            ctx.arc(1740, 940, 55, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#FFF5F5';
            ctx.font = 'bold 12px serif';
            ctx.textAlign = 'center';
            ctx.fillText('CONSEJO DEL', 1740, 935);
            ctx.fillText('BOSQUE', 1740, 955);

            resolve(canvas.toDataURL('image/png'));
          }
        };
        img.src = item.dataUrl;
      });
    });
  };

  const handleDownloadCollage = async () => {
    setGeneratingCollage(true);
    sounds.playClick();
    try {
      const dataUrl = await generateCollage();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Album-Expedicion-${forest.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      sounds.playSuccess();
    } finally {
      setGeneratingCollage(false);
    }
  };

  const handleShareCollage = async () => {
    sounds.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Diario Fotográfico • ${forest.name}`,
          text: `¡Mira las fotos de nuestra expedición en ${forest.name} con Enigma Vivo!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('¡Enlace de expedición copiado al portapapeles!');
    }
  };

  const filteredPhotos =
    activeFilter === 'current' && currentPoi
      ? photos.filter((p) => p.poiId === currentPoi.id)
      : activeFilter !== 'all' && activeFilter !== 'current'
      ? photos.filter((p) => p.forestId === activeFilter)
      : photos;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#1C2C1F] via-[#142017] to-[#0E1610] border border-amber-500/50 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
        {/* Hidden Camera/File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-amber-950/70 via-emerald-950 to-stone-950 px-5 sm:px-6 py-4 border-b border-amber-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                {t('album.subtitle') || 'Cuaderno de Recuerdos'}
              </span>
              <h2 className="font-adventure text-lg sm:text-xl font-bold text-amber-100 leading-tight">
                {t('album.title') || 'Álbum de Fotos de Campo'} • {forest.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Camera Button */}
            <button
              type="button"
              onClick={startLiveCamera}
              className="hidden sm:flex px-3 py-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-200 text-xs font-bold tracking-wider items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              title="Abrir cámara en vivo"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>{t('album.liveCamera') || 'Cámara'}</span>
            </button>

            {/* Quick Capture / File Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                fileInputRef.current?.click();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-adventure text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-stone-950" />
              <span>{t('album.captureBtn') || 'Tomar Foto'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopLiveCamera();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-700/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Camera Viewfinder Overlay */}
        {isLiveCameraActive && (
          <div className="p-4 bg-black/90 border-b border-emerald-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Visor de Cámara en Directo</span>
              </span>
              <button
                type="button"
                onClick={stopLiveCamera}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
            <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-stone-700">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-amber-400/40 rounded-2xl pointer-events-none" />
              <button
                type="button"
                onClick={captureLiveFrame}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-90 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-stone-950" />
                <span>Disparar Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* Sub-toolbar: Filters, Demo Loader & Collage Export */}
        <div className="px-5 sm:px-6 py-3 bg-black/40 border-b border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {t('album.filterAll') || 'Todas las Fotos'} ({photos.length})
            </button>

            {currentPoi && (
              <button
                type="button"
                onClick={() => setActiveFilter('current')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeFilter === 'current'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {t('album.filterPoi') || 'De este hito'}: {currentPoi.name}
              </button>
            )}

            {/* Forest Filter if forests array available */}
            {forests && forests.length > 1 && (
              <select
                value={activeFilter.startsWith('forest_') || activeFilter === forest.id ? activeFilter : ''}
                onChange={(e) => setActiveFilter(e.target.value || 'all')}
                className="bg-[#121E14] border border-emerald-800/60 rounded-xl px-2.5 py-1 text-stone-300 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="">Filtrar por Bosque...</option>
                {forests.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Demo Photos button */}
            <button
              type="button"
              onClick={handleLoadDemoPhotos}
              className="px-2.5 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
              title="Añadir fotografías de muestra de expedición"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('album.loadDemoPhotos') || 'Cargar Muestras'}</span>
            </button>

            {photos.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleDownloadCollage}
                  disabled={generatingCollage}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-200 hover:text-white font-adventure text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{generatingCollage ? 'Generando Collage...' : t('album.viewFullCollage') || 'Descargar Collage (HD)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareCollage}
                  className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white cursor-pointer"
                  title="Compartir Álbum"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* New Photo Confirmation Drawer */}
          {isCapturing && tempImagePreview && (
            <div className="bg-[#18261B] border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-adventure text-sm font-bold text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Añadir Nueva Foto al Diario de Campo</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCapturing(false)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-stone-700 shrink-0 shadow-lg bg-black">
                  <img
                    src={tempImagePreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-stone-300">
                    {currentPoi?.name || forest.name}
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1">
                      Pie de foto / Nota del explorador (opcional):
                    </label>
                    <input
                      type="text"
                      value={captionInput}
                      onChange={(e) => setCaptionInput(e.target.value)}
                      placeholder="Ej: ¡Equipo junto a las rocas milenarias!"
                      maxLength={120}
                      className="w-full bg-[#101912] border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="text-[11px] text-stone-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentPoi?.name || forest.name}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar en el Diario de la Expedición</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-black/20 rounded-3xl border border-dashed border-stone-800 p-8">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-adventure text-lg font-bold text-amber-100">
                  {t('album.emptyTitle') || 'Aún no hay fotos en tu cuaderno'}
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  {t('album.emptyDesc') ||
                    'Inmortaliza los hallazgos en cada hito: los árboles ancestrales, el equipo o las vistas del bosque.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-adventure text-xs font-bold tracking-wider inline-flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-stone-950" />
                  <span>{t('album.takeFirstPhoto') || 'Tomar Primera Foto de Campo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemoPhotos}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-200 font-adventure text-xs font-bold tracking-wider inline-flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('album.loadDemoPhotos') || 'Cargar Fotos de Muestra'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-[#FAF7EE] text-stone-900 rounded-2xl p-3 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
                  style={{ transform: 'rotate(-0.5deg)' }}
                >
                  {/* Decorative tape on top */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-200/60 border-t border-b border-amber-300/40 rounded-xs backdrop-blur-xs shadow-xs" />

                  {/* Photo Thumbnail */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPhoto(photo);
                    }}
                    className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-900 cursor-pointer"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.caption || photo.poiName || 'Foto de campo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Maximize2 className="w-6 h-6 text-white drop-shadow" />
                    </div>
                  </div>

                  {/* Polaroid text area */}
                  <div className="pt-2.5 pb-1 px-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-adventure text-xs font-bold text-emerald-950 truncate">
                        {photo.poiName || forest.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                        className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {photo.caption && (
                      <p className="text-[11px] text-stone-700 italic line-clamp-2 leading-tight">
                        &quot;{photo.caption}&quot;
                      </p>
                    )}

                    <div className="text-[9px] font-mono text-stone-500 flex items-center justify-between pt-1 border-t border-stone-200">
                      <span>{photo.timestamp}</span>
                      {photo.lat && photo.lng && (
                        <span>
                          {photo.lat.toFixed(4)}°, {photo.lng.toFixed(4)}°
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal for enlarged photo */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="relative max-w-2xl w-full bg-[#18261A] border border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 text-stone-100">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <h4 className="font-adventure text-base font-bold text-amber-100">
                    {selectedPhoto.poiName || forest.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 font-mono">
                    {selectedPhoto.timestamp} • {selectedPhoto.lat?.toFixed(5)}° N,{' '}
                    {selectedPhoto.lng?.toFixed(5)}° W
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative max-h-[60vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.dataUrl}
                  alt={selectedPhoto.caption || 'Foto ampliada'}
                  className="max-h-[60vh] w-auto object-contain mx-auto"
                />
              </div>

              {selectedPhoto.caption && (
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-900/60 text-xs text-amber-200 italic text-center">
                  &quot;{selectedPhoto.caption}&quot;
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Foto</span>
                </button>

                <a
                  href={selectedPhoto.dataUrl}
                  download={`Foto-Expedicion-${selectedPhoto.id}.jpg`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 font-adventure text-xs font-bold tracking-wider flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-stone-950" />
                  <span>Descargar Foto</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-black/40 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tus fotos se conservan en tu dispositivo vinculadas a esta expedición.</span>
          </p>

          <div className="flex items-center gap-2">
            {onOpenPassport && (
              <button
                type="button"
                onClick={() => {
                  stopLiveCamera();
                  onClose();
                  onOpenPassport();
                }}
                className="px-4 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 text-amber-300 font-adventure text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('album.passportLink') || 'Ver Pasaporte'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stopLiveCamera();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-adventure text-xs font-bold tracking-wider transition-all cursor-pointer"
            >
              Cerrar Álbum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
