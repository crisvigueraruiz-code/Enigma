import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ForestPack, PlayerSession, WindmillPOI, FieldPhoto } from '../types';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import { calculateHaversineDistance, formatDistance } from '../utils/geo';
import { api } from '../services/api';
import {
  Share2,
  Download,
  X,
  Sparkles,
  Compass,
  Footprints,
  Clock,
  Mountain,
  Trophy,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Square,
  Palette,
  Image as ImageIcon,
  Flame,
  KeyRound,
  QrCode,
  MapPin,
  Camera,
  Layers,
} from 'lucide-react';

interface ShareableTrailCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  forest: ForestPack;
  session?: PlayerSession | null;
  onOpenAlbum?: () => void;
  onOpenBackpack?: () => void;
}

type CardFormat = 'story' | 'square';
type CardTheme = 'strava' | 'forest' | 'minimal';

export const ShareableTrailCardModal: React.FC<ShareableTrailCardModalProps> = ({
  isOpen,
  onClose,
  forest,
  session,
  onOpenAlbum,
  onOpenBackpack,
}) => {
  const { t } = useI18n();

  // State
  const [format, setFormat] = useState<CardFormat>('story');
  const [theme, setTheme] = useState<CardTheme>('strava');
  const [customName, setCustomName] = useState<string>(session?.name || 'Noble Explorador');
  const [customNote, setCustomNote] = useState<string>('¡Senda completada a pie descubriendo los enigmas del bosque!');
  const [bgSource, setBgSource] = useState<'map' | 'forest' | 'photo'>('forest');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<FieldPhoto[]>([]);
  const [showQr, setShowQr] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load photos from album if available
  useEffect(() => {
    if (isOpen && session) {
      const list = api.getExpeditionPhotos(session.code);
      setPhotos(list);
      if (list.length > 0 && !selectedPhotoId) {
        setSelectedPhotoId(list[0].id);
      }
    }
  }, [isOpen, session?.code]);

  // Compute Route Coordinates & Track Metrics
  const routePois: WindmillPOI[] = useMemo(() => {
    if (!forest || !Array.isArray(forest.pois) || forest.pois.length === 0) return [];
    if (session?.routePoiIds && session.routePoiIds.length > 0) {
      const ordered = session.routePoiIds
        .map((id) => forest.pois.find((p) => p.id === id))
        .filter((p): p is WindmillPOI => Boolean(p));
      if (ordered.length > 0) return ordered;
    }
    return forest.pois;
  }, [forest, session?.routePoiIds]);

  // Calculate total route distance in meters
  const totalDistanceMeters = useMemo(() => {
    if (routePois.length < 2) return 1800; // default estimated 1.8 km
    let dist = 0;
    for (let i = 0; i < routePois.length - 1; i++) {
      dist += calculateHaversineDistance(
        routePois[i].lat,
        routePois[i].lng,
        routePois[i + 1].lat,
        routePois[i + 1].lng
      );
    }
    // Add 15% estimated trail winding margin
    return Math.round(dist * 1.15);
  }, [routePois]);

  // Calculate elapsed time
  const elapsedTimeStr = useMemo(() => {
    if (session?.dateStarted) {
      const start = new Date(session.dateStarted).getTime();
      const end = session.lastActive ? new Date(session.lastActive).getTime() : Date.now();
      const diffMs = Math.max(60000, end - start);
      const totalMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      if (hours > 0) return `${hours}h ${mins.toString().padStart(2, '0')}m`;
      return `${mins} min`;
    }
    // Fallback based on session duration preset
    return session?.duration || '1h 15m';
  }, [session?.dateStarted, session?.lastActive, session?.duration]);

  // Synthetic elevation gain (+D)
  const elevationGainMeters = useMemo(() => {
    if (routePois.length === 0) return 85;
    let gain = 0;
    for (let i = 0; i < routePois.length; i++) {
      const alt = routePois[i].altitudeMeters || 45 + ((i * 37) % 65);
      const nextAlt = routePois[(i + 1) % routePois.length].altitudeMeters || 45 + (((i + 1) * 37) % 65);
      if (nextAlt > alt) gain += (nextAlt - alt);
    }
    return Math.max(45, Math.min(320, gain || 95));
  }, [routePois]);

  // Solved POIs count
  const completedPoiCount = session?.completedPois?.length || (session?.status === 'completed' ? routePois.length : Math.max(1, (session?.currentPoiIndex || 0) + 1));
  const totalPoiCount = routePois.length;
  const points = session?.points || 350;

  // Selected photo object
  const activePhoto = useMemo(() => {
    if (bgSource !== 'photo') return null;
    return photos.find((p) => p.id === selectedPhotoId) || photos[0] || null;
  }, [bgSource, selectedPhotoId, photos]);

  // Normalized SVG path for the route polyline
  const routeSvgData = useMemo(() => {
    if (routePois.length < 2) {
      return { path: 'M 30,120 Q 90,40 150,110 T 270,70', points: [] };
    }
    const lats = routePois.map((p) => p.lat);
    const lngs = routePois.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = maxLat - minLat || 0.005;
    const lngSpan = maxLng - minLng || 0.005;

    // Canvas viewBox 320 x 180 with 35px padding
    const width = 320;
    const height = 180;
    const pad = 35;

    const mapped = routePois.map((p, idx) => {
      // Invert lat for Y (North is up)
      const x = pad + ((p.lng - minLng) / lngSpan) * (width - pad * 2);
      const y = height - pad - ((p.lat - minLat) / latSpan) * (height - pad * 2);
      return { x, y, name: p.name, emoji: p.emoji || '🌲', idx };
    });

    const pathStr = mapped.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      return `${acc} L ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }, '');

    return { path: pathStr, points: mapped };
  }, [routePois]);

  if (!isOpen) return null;

  // Draw HD Canvas for Download / Sharing
  const renderCardToCanvas = async (): Promise<string | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const isStory = format === 'story';
    const cw = 1080;
    const ch = isStory ? 1920 : 1080;

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Background Fill
    if (theme === 'strava') {
      ctx.fillStyle = '#0B0D11';
      ctx.fillRect(0, 0, cw, ch);
    } else if (theme === 'forest') {
      ctx.fillStyle = '#0D1A10';
      ctx.fillRect(0, 0, cw, ch);
    } else {
      ctx.fillStyle = '#121316';
      ctx.fillRect(0, 0, cw, ch);
    }

    // 2. Background Image (if photo or forest cover)
    const imgUrl = bgSource === 'photo' && activePhoto
      ? activePhoto.dataUrl
      : bgSource === 'forest' && forest.coverImageUrl
      ? forest.coverImageUrl
      : null;

    if (imgUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // don't crash on cross-origin
          img.src = imgUrl;
        });

        if (img.width > 0) {
          ctx.save();
          // Draw image cropped to fill
          const scale = Math.max(cw / img.width, ch / img.height);
          const x = (cw - img.width * scale) / 2;
          const y = (ch - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          // Dark gradient overlay for extreme text readability
          const grad = ctx.createLinearGradient(0, 0, 0, ch);
          if (theme === 'strava') {
            grad.addColorStop(0, 'rgba(11, 13, 17, 0.88)');
            grad.addColorStop(0.4, 'rgba(11, 13, 17, 0.70)');
            grad.addColorStop(0.85, 'rgba(11, 13, 17, 0.95)');
            grad.addColorStop(1, 'rgba(11, 13, 17, 1)');
          } else if (theme === 'forest') {
            grad.addColorStop(0, 'rgba(13, 26, 16, 0.90)');
            grad.addColorStop(0.4, 'rgba(13, 26, 16, 0.72)');
            grad.addColorStop(0.85, 'rgba(13, 26, 16, 0.95)');
            grad.addColorStop(1, 'rgba(13, 26, 16, 1)');
          } else {
            grad.addColorStop(0, 'rgba(18, 19, 22, 0.90)');
            grad.addColorStop(0.4, 'rgba(18, 19, 22, 0.75)');
            grad.addColorStop(1, 'rgba(18, 19, 22, 0.98)');
          }
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, cw, ch);
          ctx.restore();
        }
      } catch (e) {
        console.warn('Canvas image loading skipped:', e);
      }
    }

    // 3. Top Header: Brand & Badge
    ctx.save();
    ctx.fillStyle = theme === 'strava' ? '#FC5200' : theme === 'forest' ? '#10B981' : '#06B6D4';
    ctx.font = 'bold 30px "Montserrat", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('ENIGMA VIVO  •  OUTDOOR EXPEDITION', 70, isStory ? 130 : 90);

    // Date & Session Tag
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '24px "Inter", sans-serif';
    const dateText = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    ctx.fillText(dateText.toUpperCase(), 70, isStory ? 175 : 130);

    // Forest & Story Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px "Cinzel", "Montserrat", sans-serif';
    ctx.fillText(forest.name, 70, isStory ? 250 : 200);

    const storyTitle = forest.stories?.find((s) => s.id === session?.storyId)?.title || 'Exploración de la Senda';
    ctx.fillStyle = theme === 'strava' ? '#FFA726' : theme === 'forest' ? '#6EE7B7' : '#93C5FD';
    ctx.font = 'italic 34px "Cinzel", Georgia, serif';
    ctx.fillText(`«${storyTitle}»`, 70, isStory ? 305 : 245);

    // Explorer Name Tag
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px "Inter", sans-serif';
    ctx.fillText(`Aventurero: ${customName}`, 70, isStory ? 360 : 295);
    ctx.restore();

    // 4. GPS Trail Graphic (Polyline on Canvas)
    ctx.save();
    const mapY = isStory ? 430 : 330;
    const mapH = isStory ? 540 : 320;
    const mapW = cw - 140;

    // Subtle dark box behind track
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(70, mapY, mapW, mapH, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid topo lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let gx = 70; gx < 70 + mapW; gx += 70) {
      ctx.beginPath();
      ctx.moveTo(gx, mapY);
      ctx.lineTo(gx, mapY + mapH);
      ctx.stroke();
    }
    for (let gy = mapY; gy < mapY + mapH; gy += 60) {
      ctx.beginPath();
      ctx.moveTo(70, gy);
      ctx.lineTo(70 + mapW, gy);
      ctx.stroke();
    }

    // Scale SVG track points to canvas map box
    if (routeSvgData.points.length >= 2) {
      const scaleX = (mapW - 100) / 320;
      const scaleY = (mapH - 80) / 180;
      const offX = 70 + 50;
      const offY = mapY + 40;

      // Draw GPS Glow & Line
      ctx.shadowColor = theme === 'strava' ? '#FC5200' : theme === 'forest' ? '#10B981' : '#06B6D4';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = theme === 'strava' ? '#FC5200' : theme === 'forest' ? '#34D399' : '#38BDF8';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      routeSvgData.points.forEach((pt, idx) => {
        const px = offX + pt.x * scaleX;
        const py = offY + pt.y * scaleY;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Draw Waypoint Dots
      routeSvgData.points.forEach((pt, idx) => {
        const px = offX + pt.x * scaleX;
        const py = offY + pt.y * scaleY;

        ctx.beginPath();
        if (idx === 0) {
          // Start point
          ctx.fillStyle = '#22C55E';
          ctx.arc(px, py, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (idx === routeSvgData.points.length - 1) {
          // Finish point
          ctx.fillStyle = '#F59E0B';
          ctx.arc(px, py, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.stroke();
        } else {
          // Intermediate point
          ctx.fillStyle = '#FFFFFF';
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Track label badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(90, mapY + 20, 260, 48, 14);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(`📍 Senda GPS (${routePois.length} Hitos)`, 106, mapY + 52);

    ctx.restore();

    // 5. Strava Big Metrics Grid
    ctx.save();
    const statsY = isStory ? 1020 : 690;
    const statBoxW = (cw - 140 - 30) / 2;
    const statBoxH = 150;

    const stats = [
      {
        label: 'DISTANCIA',
        value: `${(totalDistanceMeters / 1000).toFixed(1)}`,
        unit: 'km',
        icon: '🏃',
        highlight: theme === 'strava' ? '#FC5200' : '#10B981',
      },
      {
        label: 'TIEMPO EN RUTA',
        value: elapsedTimeStr,
        unit: '',
        icon: '⏱️',
        highlight: '#FFFFFF',
      },
      {
        label: 'DESNIVEL POSITIVO',
        value: `+${elevationGainMeters}`,
        unit: 'm',
        icon: '⛰️',
        highlight: '#FFFFFF',
      },
      {
        label: 'PUNTOS ENIGMA',
        value: `${points}`,
        unit: 'pts',
        icon: '🏆',
        highlight: '#F59E0B',
      },
    ];

    stats.forEach((st, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 70 + col * (statBoxW + 30);
      const by = statsY + row * (statBoxH + 20);

      // Card background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.roundRect(bx, by, statBoxW, statBoxH, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(st.label, bx + 24, by + 42);

      // Main Number
      ctx.fillStyle = st.highlight;
      ctx.font = 'bold 64px "Montserrat", sans-serif';
      ctx.fillText(st.value, bx + 24, by + 115);

      if (st.unit) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 28px "Inter", sans-serif';
        const numWidth = ctx.measureText(st.value).width;
        ctx.fillText(st.unit, bx + 30 + numWidth, by + 115);
      }
    });

    ctx.restore();

    // 6. Bottom Showcase & Footer
    ctx.save();
    if (isStory) {
      // 9:16 format has room for quote and verified banner
      const quoteY = 1400;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(70, quoteY, cw - 140, 160, 20);
      ctx.fill();

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.fillText('💬 BITÁCORA DEL EXPLORADOR', 95, quoteY + 45);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'italic 28px Georgia, serif';
      ctx.fillText(`"${customNote.slice(0, 75)}"`, 95, quoteY + 105);

      // Footer challenge brand bar
      const footY = 1620;
      ctx.fillStyle = theme === 'strava' ? '#FC5200' : theme === 'forest' ? '#059669' : '#0284C7';
      ctx.beginPath();
      ctx.roundRect(70, footY, cw - 140, 180, 24);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px "Montserrat", sans-serif';
      ctx.fillText('¿Aceptas el Reto del Bosque?', 110, footY + 70);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '26px "Inter", sans-serif';
      ctx.fillText(`Senda: ${forest.name} • Código de Partida: #${session?.code || 'ENIGMA'}`, 110, footY + 125);
    } else {
      // 1:1 Square format footer bar
      const footY = 1010;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(70, footY, cw - 140, 2);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillText(`ENIGMA VIVO  •  ${forest.name.toUpperCase()}  •  #${session?.code || 'ENIGMA'}`, 70, footY + 45);
    }
    ctx.restore();

    return canvas.toDataURL('image/png');
  };

  const handleDownloadImage = async () => {
    sounds.playClick();
    setIsExporting(true);
    try {
      const dataUrl = await renderCardToCanvas();
      if (!dataUrl) throw new Error('No se pudo generar la imagen');

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ficha-ruta-${forest.id}-${format}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      sounds.playSuccess();
    } catch (e) {
      console.error('Error downloading trail card:', e);
      sounds.playError();
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareNative = async () => {
    sounds.playClick();
    setIsExporting(true);
    try {
      const dataUrl = await renderCardToCanvas();
      if (!dataUrl) throw new Error('No se pudo generar la imagen');

      // Convert data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `enigma-ruta-${forest.id}.png`, { type: 'image/png' });

      const shareText = `🌲 ¡He completado la senda de ${forest.name}! ${(totalDistanceMeters / 1000).toFixed(1)} km y ${points} puntos en Enigma Vivo. ¿Te atreves con el reto? Código: #${session?.code || 'ENIGMA'}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Ficha de Ruta • ${forest.name}`,
          text: shareText,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Ficha de Ruta • ${forest.name}`,
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback to downloading image and copying text
        await handleDownloadImage();
        handleCopyShareText();
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('Native share fallback:', e);
        handleCopyShareText();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyShareText = () => {
    sounds.playClick();
    const text = `🌲 ¡Senda Completada en ${forest.name}!
🏃 Distancia: ${(totalDistanceMeters / 1000).toFixed(1)} km
⏱️ Tiempo: ${elapsedTimeStr}
⛰️ Desnivel: +${elevationGainMeters} m
🏆 Puntos de Sabiduría: ${points} pts (${completedPoiCount}/${totalPoiCount} hitos)
Aventurero: ${customName}

Explora el bosque con geolocalización y acertijos al aire libre: ${window.location.origin}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    sounds.playSuccess();
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {/* Hidden high-res canvas for rendering export image */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-5xl max-h-[96vh] flex flex-col bg-[#111913] border border-amber-600/40 rounded-3xl shadow-2xl overflow-hidden text-stone-100 my-auto">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1A261D] via-[#243527] to-[#18261A] px-5 sm:px-7 py-3.5 border-b border-amber-600/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FC5200]/30 to-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
              <Share2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#FC5200] font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Estilo Strava & Instagram Stories</span>
              </div>
              <h2 className="font-adventure text-lg sm:text-2xl font-bold text-amber-100 leading-tight">
                Ficha de Ruta Compartible
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-white transition-all cursor-pointer"
            title="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Controls & Card Live Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Card Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {/* Aspect Ratio Container */}
            <div
              className={`relative w-full transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border ${
                format === 'story'
                  ? 'max-w-[340px] aspect-[9/16]'
                  : 'max-w-[420px] aspect-square'
              } ${
                theme === 'strava'
                  ? 'bg-[#0B0D11] border-[#FC5200]/50 shadow-[#FC5200]/10'
                  : theme === 'forest'
                  ? 'bg-[#0D1A10] border-emerald-500/50 shadow-emerald-950/60'
                  : 'bg-[#121316] border-cyan-500/40 shadow-cyan-950/40'
              }`}
            >
              {/* Optional Background Image */}
              {bgSource !== 'map' && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={
                      bgSource === 'photo' && activePhoto
                        ? activePhoto.dataUrl
                        : forest.coverImageUrl || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt="Fondo de la senda"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 ${
                      theme === 'strava'
                        ? 'bg-gradient-to-b from-[#0B0D11]/90 via-[#0B0D11]/75 to-[#0B0D11]/95'
                        : theme === 'forest'
                        ? 'bg-gradient-to-b from-[#0D1A10]/92 via-[#0D1A10]/80 to-[#0D1A10]/96'
                        : 'bg-gradient-to-b from-[#121316]/90 via-[#121316]/80 to-[#121316]/95'
                    }`}
                  />
                </div>
              )}

              {/* Card Content Overlay */}
              <div className="relative z-10 w-full h-full p-4 sm:p-5 flex flex-col justify-between text-left select-none">
                {/* Top Brand & Title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] uppercase tracking-widest font-black font-mono ${
                        theme === 'strava'
                          ? 'text-[#FC5200]'
                          : theme === 'forest'
                          ? 'text-emerald-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      ENIGMA VIVO • OUTDOOR TRACK
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-adventure text-base sm:text-lg font-bold text-white leading-tight line-clamp-1 drop-shadow">
                    {forest.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[10px] text-amber-200/90 font-serif italic line-clamp-1">
                    <Compass className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{customName}</span>
                  </div>
                </div>

                {/* Center Route GPS Vector Preview */}
                <div className="my-auto py-2">
                  <div className="relative rounded-2xl bg-black/40 border border-white/10 p-2.5 backdrop-blur-xs">
                    <div className="flex items-center justify-between text-[9px] text-stone-400 font-mono mb-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#FC5200]" />
                        <span>Trazado GPS ({routePois.length} Hitos)</span>
                      </span>
                      <span className="text-emerald-400 font-bold">{completedPoiCount}/{totalPoiCount} hechos</span>
                    </div>

                    <div className="w-full h-24 sm:h-28 flex items-center justify-center">
                      <svg
                        viewBox="0 0 320 180"
                        className="w-full h-full overflow-visible"
                      >
                        {/* Shadow trail */}
                        <path
                          d={routeSvgData.path}
                          fill="none"
                          stroke={theme === 'strava' ? '#FC5200' : theme === 'forest' ? '#10B981' : '#06B6D4'}
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-90 drop-shadow-[0_0_8px_rgba(252,82,0,0.6)]"
                        />

                        {/* Waypoints */}
                        {routeSvgData.points.map((pt, idx) => {
                          const isStart = idx === 0;
                          const isEnd = idx === routeSvgData.points.length - 1;
                          return (
                            <circle
                              key={idx}
                              cx={pt.x}
                              cy={pt.y}
                              r={isStart || isEnd ? 6 : 3.5}
                              fill={isStart ? '#22C55E' : isEnd ? '#F59E0B' : '#FFFFFF'}
                              stroke="#000000"
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Strava 4-Stats Big Grid */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  {/* Distance */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">
                      Distancia
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span
                        className={`text-lg sm:text-2xl font-black font-mono leading-none ${
                          theme === 'strava' ? 'text-[#FC5200]' : 'text-emerald-400'
                        }`}
                      >
                        {(totalDistanceMeters / 1000).toFixed(1)}
                      </span>
                      <span className="text-[10px] text-stone-300 font-bold">km</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">
                      Tiempo
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base sm:text-xl font-bold font-mono text-white leading-none">
                        {elapsedTimeStr}
                      </span>
                    </div>
                  </div>

                  {/* Elevation */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">
                      Desnivel +D
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base sm:text-xl font-bold font-mono text-white leading-none">
                        +{elevationGainMeters}
                      </span>
                      <span className="text-[10px] text-stone-300 font-bold">m</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 font-mono font-bold">
                      Puntos
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-lg sm:text-2xl font-black font-mono text-amber-300 leading-none">
                        {points}
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-bold">pts</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Story Challenge Callout (only in 9:16) */}
                {format === 'story' && (
                  <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-[#FC5200]/25 via-amber-950/40 to-black/60 border border-[#FC5200]/40 flex items-center justify-between text-[9px]">
                    <div className="min-w-0 pr-1">
                      <span className="font-adventure font-bold text-amber-200 block truncate">
                        ¿Superas mi marca en el bosque?
                      </span>
                      <span className="text-stone-300 text-[8px] block truncate font-mono">
                        Código: #{session?.code || 'ENIGMA'}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 text-[#FC5200] font-mono font-bold text-[8px] border border-[#FC5200]/40 shrink-0">
                      100% A PIE
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-stone-400 mt-3 text-center">
              Previsualización a escala • La exportación se genera en alta resolución (1080p HD).
            </p>
          </div>

          {/* Right Column: Customization Controls & Export Actions */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Format Switcher: 9:16 Story vs 1:1 Square */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  1. Formato de Red Social
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setFormat('story');
                    }}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-adventure font-bold transition-all cursor-pointer ${
                      format === 'story'
                        ? 'bg-[#FC5200] text-stone-950 border-[#FC5200] shadow-md shadow-[#FC5200]/30'
                        : 'bg-black/30 border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Story (9:16)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setFormat('square');
                    }}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-adventure font-bold transition-all cursor-pointer ${
                      format === 'square'
                        ? 'bg-[#FC5200] text-stone-950 border-[#FC5200] shadow-md shadow-[#FC5200]/30'
                        : 'bg-black/30 border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>Post Feed (1:1)</span>
                  </button>
                </div>
              </div>

              {/* Theme Switcher: Strava Pro vs Forest Alpine vs Minimal */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  2. Paleta & Estilo Gráfico
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTheme('strava');
                    }}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      theme === 'strava'
                        ? 'bg-[#FC5200]/20 border-[#FC5200] text-[#FC5200] font-bold'
                        : 'bg-black/30 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="text-xs block">⚡ Strava Pro</span>
                    <span className="text-[9px] text-stone-500">Negro & Naranja</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTheme('forest');
                    }}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      theme === 'forest'
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 font-bold'
                        : 'bg-black/30 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="text-xs block">🌲 Bosque</span>
                    <span className="text-[9px] text-stone-500">Verde Alpino</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setTheme('minimal');
                    }}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      theme === 'minimal'
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-black/30 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className="text-xs block">🗺️ Topo</span>
                    <span className="text-[9px] text-stone-500">Gris & Cyan</span>
                  </button>
                </div>
              </div>

              {/* Background Picker */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  3. Imagen de Fondo
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setBgSource('forest')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bgSource === 'forest'
                        ? 'bg-amber-950/60 border-amber-400 text-amber-200 font-bold'
                        : 'bg-black/30 border-stone-800 text-stone-400'
                    }`}
                  >
                    🌲 Bosque Oficial
                  </button>

                  <button
                    type="button"
                    onClick={() => setBgSource('map')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bgSource === 'map'
                        ? 'bg-amber-950/60 border-amber-400 text-amber-200 font-bold'
                        : 'bg-black/30 border-stone-800 text-stone-400'
                    }`}
                  >
                    🗺️ Trazado Puro
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (photos.length > 0) setBgSource('photo');
                      else if (onOpenAlbum) onOpenAlbum();
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      bgSource === 'photo'
                        ? 'bg-amber-950/60 border-amber-400 text-amber-200 font-bold'
                        : 'bg-black/30 border-stone-800 text-stone-400'
                    }`}
                  >
                    📷 Mi Foto ({photos.length})
                  </button>
                </div>

                {/* If user has taken photos and selected 'photo' */}
                {bgSource === 'photo' && photos.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {photos.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPhotoId(p.id)}
                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          selectedPhotoId === p.id
                            ? 'border-[#FC5200] scale-105 shadow-md'
                            : 'border-stone-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={p.dataUrl} alt="Foto" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Personalization Inputs */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Tu Nombre o Equipo
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    maxLength={32}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-900/80 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="Nombre del explorador..."
                  />
                </div>

                {format === 'story' && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Bitácora / Cita Personal
                    </label>
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      maxLength={85}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-900/80 text-xs text-white focus:outline-none focus:border-amber-400"
                      placeholder="Cita sobre la aventura..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleShareNative}
                  disabled={isExporting}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#FC5200] to-amber-500 hover:from-[#e04800] hover:to-amber-400 text-stone-950 font-adventure text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FC5200]/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-stone-950" />
                  <span>{isExporting ? 'Generando...' : 'Compartir en Redes'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-adventure text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Descargar PNG HD</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyShareText}
                className="w-full py-2.5 px-3 rounded-xl bg-black/40 hover:bg-black/60 border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">¡Texto copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copiar Resumen para Strava / Instagram</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
