import React, { useState, useRef, useEffect } from 'react';
import { ForestPack, PlayerSession } from '../types';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import {
  BookOpen,
  Award,
  Download,
  Share2,
  X,
  Sparkles,
  CheckCircle2,
  TreePine,
  Shield,
  Compass,
  Scroll,
  Calendar,
  Star,
  Swords,
  Lock,
} from 'lucide-react';

interface ExplorerPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  forests: ForestPack[];
  activeSession?: PlayerSession | null;
  selectedForest?: ForestPack | null;
}

interface PassportStamp {
  forestId: string;
  forestName: string;
  date: string;
  points: number;
  solvedMeta: boolean;
}

export const ExplorerPassportModal: React.FC<ExplorerPassportModalProps> = ({
  isOpen,
  onClose,
  forests,
  activeSession,
  selectedForest,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'passport' | 'badges' | 'diploma'>('passport');
  const [explorerName, setExplorerName] = useState<string>(activeSession?.name || 'Noble Explorador');
  const [downloadingDiploma, setDownloadingDiploma] = useState<boolean>(false);
  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load stamps from past and active sessions
  useEffect(() => {
    if (!isOpen) return;

    const list: PassportStamp[] = [];

    // Check localStorage saved sessions
    try {
      const savedIndex = localStorage.getItem('enigma_local_sessions');
      if (savedIndex) {
        const codes: string[] = JSON.parse(savedIndex);
        for (const c of codes) {
          const raw = localStorage.getItem(`enigma_local_sessions_${c}`);
          if (raw) {
            const s: PlayerSession = JSON.parse(raw);
            const f = forests.find((pack) => pack.id === s.forestPackId);
            if (f && s.status === 'completed') {
              list.push({
                forestId: f.id,
                forestName: f.name,
                date: new Date(s.lastActive || s.dateStarted).toLocaleDateString(),
                points: s.points,
                solvedMeta: Boolean(s.metaEnigmaSolved),
              });
            }
          }
        }
      }
    } catch {}

    // Include current session if completed or active with points
    if (activeSession && selectedForest) {
      const already = list.some((st) => st.forestId === selectedForest.id);
      if (!already) {
        list.push({
          forestId: selectedForest.id,
          forestName: selectedForest.name,
          date: new Date().toLocaleDateString(),
          points: activeSession.points,
          solvedMeta: Boolean(activeSession.metaEnigmaSolved),
        });
      }
    }

    // Default demonstration stamps if first time exploring
    if (list.length === 0 && selectedForest) {
      list.push({
        forestId: selectedForest.id,
        forestName: selectedForest.name,
        date: new Date().toLocaleDateString(),
        points: activeSession?.points || 280,
        solvedMeta: true,
      });
    }

    setStamps(list);
  }, [isOpen, activeSession, selectedForest, forests]);

  if (!isOpen) return null;

  const currentForestName = selectedForest?.name || (stamps[0]?.forestName || 'Bosque de Nalda');
  const totalScore = stamps.reduce((acc, s) => acc + s.points, 0);

  const badges = [
    {
      id: 'botanist',
      title: t('passport.badgeBotanist') || 'Botánico de Cestas',
      desc: t('passport.badgeBotanistDesc') || 'Completar acertijos de flora y encinas ancestrales',
      icon: '🌿',
      unlocked: stamps.some((s) => s.forestId.includes('canejan') || s.forestId.includes('cestas')),
    },
    {
      id: 'hermit',
      title: t('passport.badgeHermit') || 'Ermitaño de Nalda',
      desc: t('passport.badgeHermitDesc') || 'Explorar las Cuevas de Los Palomares excavadas en la roca',
      icon: '🏰',
      unlocked: stamps.some((s) => s.forestId.includes('nalda')),
    },
    {
      id: 'owl_ear',
      title: t('passport.badgeOwl') || 'Oído de Búho',
      desc: t('passport.badgeOwlDesc') || 'Completar con éxito los 30 segundos de silencio y escucha',
      icon: '🦉',
      unlocked: true,
    },
    {
      id: 'cronicon',
      title: t('passport.badgeCronicon') || 'Custodio del Cronicón',
      desc: t('passport.badgeCroniconDesc') || 'Descubrir las runas arcanas y resolver el Gran Meta-Enigma',
      icon: '📜',
      unlocked: stamps.some((s) => s.solvedMeta),
    },
    {
      id: 'silent_duelist',
      title: t('passport.badgeDuelist') || 'Guerrero Silencioso',
      desc: t('passport.badgeDuelistDesc') || 'Participar en una Batalla Silenciosa multijugador',
      icon: '⚔️',
      unlocked: Boolean(activeSession?.duelMatchCode),
    },
    {
      id: 'compass_master',
      title: t('passport.badgeCompass') || 'Orientador Magistral',
      desc: t('passport.badgeCompassDesc') || 'Alcanzar el rumbo exacto con la brújula magnética',
      icon: '🧭',
      unlocked: true,
    },
  ];

  // Draw high-resolution completion diploma (2048x1440) on HTML5 Canvas
  const generateDiplomaImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // 1. Parchment Background with gradient
      const bgGrad = ctx.createRadialGradient(1024, 720, 200, 1024, 720, 1100);
      bgGrad.addColorStop(0, '#FFFBF0');
      bgGrad.addColorStop(0.6, '#F8F1DE');
      bgGrad.addColorStop(1, '#E9DAC0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle vintage texture specks
      ctx.fillStyle = 'rgba(120, 80, 40, 0.03)';
      for (let i = 0; i < 4000; i++) {
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 3 + 1,
          Math.random() * 3 + 1
        );
      }

      // 2. Ornate Golden and Emerald Borders
      ctx.strokeStyle = '#1D3B24';
      ctx.lineWidth = 14;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      ctx.strokeStyle = '#C99738';
      ctx.lineWidth = 4;
      ctx.strokeRect(66, 66, canvas.width - 132, canvas.height - 132);

      ctx.strokeStyle = '#1D3B24';
      ctx.lineWidth = 2;
      ctx.strokeRect(76, 76, canvas.width - 152, canvas.height - 152);

      // Corner rosettes
      const corners = [
        [80, 80],
        [canvas.width - 80, 80],
        [80, canvas.height - 80],
        [canvas.width - 80, canvas.height - 80],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = '#C99738';
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1D3B24';
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Header Heraldry
      ctx.fillStyle = '#C99738';
      ctx.font = 'bold 30px serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '8px';
      ctx.fillText('• ENIGMA VIVO •', 1024, 180);

      ctx.fillStyle = '#1C2E20';
      ctx.font = 'bold 74px serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('DIPLOMA DE MAESTRO EXPLORADOR', 1024, 280);

      // Divider line
      ctx.strokeStyle = '#C99738';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(350, 315);
      ctx.lineTo(1698, 315);
      ctx.stroke();

      // 4. Citation Text
      ctx.fillStyle = '#4A3B2C';
      ctx.font = 'italic 34px serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('Hágase saber que por virtud del presente testimonio,', 1024, 400);

      // Explorer Name
      ctx.fillStyle = '#152E1B';
      ctx.font = 'bold 64px serif';
      ctx.fillText(explorerName.toUpperCase(), 1024, 500);

      // Underline explorer name
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(600, 525);
      ctx.lineTo(1448, 525);
      ctx.stroke();

      ctx.fillStyle = '#4A3B2C';
      ctx.font = '32px serif';
      ctx.fillText(
        `ha recorrido con sagacidad, respeto a la naturaleza y agudeza mental`,
        1024,
        610
      );
      ctx.fillText(
        `los senderos y enigmas milenarios del`,
        1024,
        660
      );

      // Forest Name
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 52px serif';
      ctx.fillText(currentForestName.toUpperCase(), 1024, 750);

      ctx.fillStyle = '#4A3B2C';
      ctx.font = 'italic 30px serif';
      ctx.fillText(
        `habiendo alcanzado una honorable marca de ${activeSession?.points || totalScore || 280} Puntos de Sabiduría`,
        1024,
        830
      );
      ctx.fillText(
        `y descifrado las runas arcanas de los espíritus guardianes del bosque.`,
        1024,
        880
      );

      // 5. Official Wax Seal (Bottom-Center-Right)
      const sealX = 1450;
      const sealY = 1100;
      ctx.fillStyle = '#A31D1D'; // Royal red wax
      ctx.beginPath();
      ctx.arc(sealX, sealY, 90, 0, Math.PI * 2);
      ctx.fill();

      // Embossed inner ring
      ctx.strokeStyle = '#E05D5D';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 78, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FFF2F2';
      ctx.font = 'bold 22px serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('SELLO OFICIAL', sealX, sealY - 15);
      ctx.fillText('CONSEJO DEL BOSQUE', sealX, sealY + 20);

      // 6. Signature (Bottom-Left)
      ctx.fillStyle = '#1C2E20';
      ctx.font = 'italic 32px serif';
      ctx.textAlign = 'left';
      ctx.fillText('Los Guardianes de la Senda', 300, 1140);
      ctx.strokeStyle = '#1C2E20';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 1155);
      ctx.lineTo(650, 1155);
      ctx.stroke();

      ctx.font = '22px serif';
      ctx.fillStyle = '#6B5843';
      ctx.fillText(`Consagrado el ${new Date().toLocaleDateString('es-ES')}`, 300, 1190);

      resolve(canvas.toDataURL('image/png'));
    });
  };

  const handleDownloadDiploma = async () => {
    setDownloadingDiploma(true);
    sounds.playClick();
    try {
      const dataUrl = await generateDiplomaImage();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Diploma-Enigma-Vivo-${explorerName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      sounds.playSuccess();
    } finally {
      setDownloadingDiploma(false);
    }
  };

  const handleShare = async () => {
    sounds.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Diploma de Explorador - Enigma Vivo`,
          text: `¡He completado la expedición en ${currentForestName} con ${totalScore} puntos en Enigma Vivo!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#213023] via-[#17231A] to-[#0F1811] border border-amber-500/50 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-950/70 via-emerald-950 to-stone-950 px-5 sm:px-6 py-4 border-b border-amber-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                {t('passport.subtitle') || 'Cuaderno de Campo'}
              </span>
              <h2 className="font-adventure text-lg sm:text-xl font-bold text-amber-100 leading-tight">
                {t('passport.title') || 'Pasaporte de Explorador & Diploma'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 rounded-2xl border border-emerald-900/40">
            <button
              type="button"
              onClick={() => setActiveTab('passport')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-adventure text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'passport'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>{t('passport.tabPassport') || 'Sellos'} ({stamps.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('badges')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-adventure text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t('passport.tabBadges') || 'Medallas'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('diploma')}
              className={`py-2 px-2 sm:px-3 rounded-xl font-adventure text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'diploma'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>{t('passport.tabDiploma') || 'Diploma'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: PASAPORTE DE SELLOS */}
          {activeTab === 'passport' && (
            <div className="space-y-4">
              <div className="bg-[#121B13] border border-amber-600/30 rounded-3xl p-5 shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">
                      Titular del Pasaporte
                    </span>
                    <h3 className="font-adventure text-base sm:text-lg font-bold text-amber-100">
                      {explorerName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-mono uppercase font-bold">
                      Puntos Totales
                    </span>
                    <div className="font-mono text-base font-extrabold text-amber-300">
                      {totalScore} pts
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {stamps.map((st, idx) => (
                    <div
                      key={idx}
                      className="relative bg-gradient-to-br from-[#1C2C1E] to-[#142017] border-2 border-amber-500/50 rounded-2xl p-4 shadow-lg overflow-hidden flex flex-col justify-between"
                    >
                      {/* Wax Stamp Emblem */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[9px] font-bold text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            CONQUISTADO
                          </span>
                          <h4 className="font-adventure text-sm font-bold text-amber-100 truncate">
                            {st.forestName}
                          </h4>
                          <p className="text-[11px] text-stone-300 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            {st.date}
                          </p>
                        </div>

                        {/* Stamp Wax Seal Graphic */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
                          <div className="w-full h-full bg-[#18261A] rounded-full flex flex-col items-center justify-center text-center">
                            <TreePine className="w-5 h-5 text-amber-300" />
                            <span className="text-[8px] font-mono font-bold text-amber-200">
                              {st.points}p
                            </span>
                          </div>
                        </div>
                      </div>

                      {st.solvedMeta && (
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Gran Meta-Enigma Consagrado</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Future Forests watermark */}
                  <div className="bg-stone-900/30 border border-dashed border-stone-700/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[120px] text-stone-500 space-y-1">
                    <TreePine className="w-8 h-8 opacity-40" />
                    <p className="text-xs font-adventure font-semibold text-stone-400">
                      Próxima Expedición
                    </p>
                    <p className="text-[10px]">Recorre nuevos senderos para sellar tu pasaporte</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDALLAS Y LOGROS */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-2xl p-3.5 border transition-all flex items-start gap-3.5 ${
                    b.unlocked
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/40'
                      : 'bg-stone-900/40 border-stone-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      b.unlocked
                        ? 'bg-amber-500/20 border border-amber-400/60 shadow-inner'
                        : 'bg-black/40 border border-white/5 grayscale'
                    }`}
                  >
                    {b.icon}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-adventure text-xs sm:text-sm font-bold text-amber-100">
                        {b.title}
                      </h4>
                      {b.unlocked ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Obtenida
                        </span>
                      ) : (
                        <Lock className="w-3 h-3 text-stone-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DIPLOMA OFICIAL DESCARGABLE */}
          {activeTab === 'diploma' && (
            <div className="space-y-4 text-center">
              {/* Name customization input */}
              <div className="max-w-xs mx-auto space-y-1 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Nombre para el Diploma
                </label>
                <input
                  type="text"
                  value={explorerName}
                  onChange={(e) => setExplorerName(e.target.value)}
                  placeholder="Tu Nombre de Explorador"
                  className="w-full bg-[#111A13] border border-amber-500/50 rounded-xl px-3.5 py-2 text-xs text-amber-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-adventure"
                />
              </div>

              {/* Live Preview Card */}
              <div className="relative rounded-2xl border-4 border-amber-600/60 bg-[#FBF6E9] text-stone-900 p-6 sm:p-8 shadow-2xl space-y-3.5 text-center overflow-hidden">
                <div className="absolute inset-0 border-2 border-emerald-900/30 pointer-events-none m-2" />
                <span className="text-[10px] font-mono tracking-widest text-amber-800 uppercase font-bold">
                  • ENIGMA VIVO •
                </span>
                <h3 className="font-adventure text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                  DIPLOMA DE MAESTRO EXPLORADOR
                </h3>
                <p className="text-xs text-stone-700 italic">
                  Otorgado con todos los honores de la senda a:
                </p>
                <div className="font-adventure text-2xl sm:text-3xl font-extrabold text-amber-900 tracking-wide">
                  {explorerName.toUpperCase()}
                </div>
                <p className="text-xs text-stone-700 max-w-sm mx-auto leading-relaxed">
                  Por culminar con éxito la expedición de <strong>{currentForestName}</strong> con{' '}
                  <strong className="text-emerald-900">{totalScore} Puntos de Sabiduría</strong>.
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-600 border-t border-stone-300">
                  <span>Los Guardianes de la Senda</span>
                  <span className="font-mono">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadDiploma}
                  disabled={downloadingDiploma}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-adventure text-xs sm:text-sm font-black tracking-wider shadow-xl shadow-amber-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-stone-950" />
                  <span>{downloadingDiploma ? 'Generando PNG 300DPI...' : 'Descargar Diploma (PNG)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Compartir Expedición</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
