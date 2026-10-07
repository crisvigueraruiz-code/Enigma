import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ForestPack, WindmillPOI } from '../types';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import {
  Printer,
  X,
  Compass,
  MapPin,
  QrCode,
  Sparkles,
  TreePine,
  Download,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface PrintableTrailBeaconsModalProps {
  isOpen: boolean;
  onClose: () => void;
  forest: ForestPack;
}

interface BeaconData {
  poi: WindmillPOI;
  qrDataUrl: string;
  riddleQuestion?: string;
  stepNumber: number;
}

export const PrintableTrailBeaconsModal: React.FC<PrintableTrailBeaconsModalProps> = ({
  isOpen,
  onClose,
  forest,
}) => {
  const { t } = useI18n();
  const [beacons, setBeacons] = useState<BeaconData[]>([]);
  const [loading, setLoading] = useState(true);
  const [paperStyle, setPaperStyle] = useState<'parchment' | 'clean'>('parchment');

  useEffect(() => {
    if (!isOpen || !forest) return;

    let isMounted = true;
    const generateBeacons = async () => {
      setLoading(true);
      const list: BeaconData[] = [];

      for (let i = 0; i < forest.pois.length; i++) {
        const poi = forest.pois[i];
        const riddle = forest.riddles.find((r) => r.poiId === poi.id);

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://enigmavivo.app';
        const scanUrl = `${baseUrl}/?forest=${encodeURIComponent(forest.id)}&poi=${encodeURIComponent(poi.id)}`;

        let qrDataUrl = '';
        try {
          qrDataUrl = await QRCode.toDataURL(scanUrl, {
            width: 280,
            margin: 1,
            color: {
              dark: '#142217',
              light: '#FFFFFF',
            },
          });
        } catch (e) {
          console.warn('QR generation error for POI:', poi.id, e);
        }

        list.push({
          poi,
          qrDataUrl,
          riddleQuestion: riddle?.question,
          stepNumber: i + 1,
        });
      }

      if (isMounted) {
        setBeacons(list);
        setLoading(false);
      }
    };

    generateBeacons();

    return () => {
      isMounted = false;
    };
  }, [isOpen, forest]);

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:z-auto">
      <div className="relative w-full max-w-4xl bg-[#18261A] border border-emerald-600/40 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black print:my-0">
        {/* Screen Header (Hidden on print) */}
        <div className="print:hidden bg-gradient-to-r from-emerald-950 via-[#1C2C1F] to-emerald-950 px-6 py-4 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Señalética Física para Senderos
              </span>
              <h2 className="font-adventure text-lg sm:text-xl font-bold text-amber-100">
                Balizas y Códigos QR Imprimibles • {forest.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-adventure text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-700/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Screen Sub-toolbar (Hidden on print) */}
        <div className="print:hidden px-6 py-3 bg-black/30 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
          <p className="flex items-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-400" />
            <span>Coloca estas balizas en postes de madera, refugios o tablones de ruta.</span>
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400">Estilo:</span>
            <button
              type="button"
              onClick={() => setPaperStyle('parchment')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                paperStyle === 'parchment'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Pergamino Rústico
            </button>
            <button
              type="button"
              onClick={() => setPaperStyle('clean')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                paperStyle === 'clean'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Monocromo Tinta
            </button>
          </div>
        </div>

        {/* Beacons Grid / Printable Area */}
        <div className="p-6 sm:p-8 space-h-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-adventure text-amber-200">Generando códigos QR y balizas de alta definición...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:text-black">
              {beacons.map((b) => (
                <div
                  key={b.poi.id}
                  className={`relative rounded-3xl p-6 border-2 transition-all flex flex-col justify-between break-inside-avoid shadow-lg ${
                    paperStyle === 'parchment'
                      ? 'bg-[#FBF6E9] text-stone-900 border-[#C99738]'
                      : 'bg-white text-black border-stone-800'
                  }`}
                  style={{ minHeight: '380px' }}
                >
                  {/* Screw hole guides in corners */}
                  <div className="absolute top-3 left-3 w-3 h-3 rounded-full border border-stone-400/80 bg-stone-300/40 flex items-center justify-center text-[7px] text-stone-500">
                    +
                  </div>
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full border border-stone-400/80 bg-stone-300/40 flex items-center justify-center text-[7px] text-stone-500">
                    +
                  </div>
                  <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full border border-stone-400/80 bg-stone-300/40 flex items-center justify-center text-[7px] text-stone-500">
                    +
                  </div>
                  <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full border border-stone-400/80 bg-stone-300/40 flex items-center justify-center text-[7px] text-stone-500">
                    +
                  </div>

                  {/* Beacon Header */}
                  <div className="space-y-1 border-b border-stone-300 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest font-bold text-emerald-800 uppercase">
                        • {forest.name.toUpperCase()} •
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-mono text-[11px] font-black border border-amber-600/40">
                        BALIZA #{b.stepNumber.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-adventure text-lg font-black text-emerald-950 leading-tight">
                      {b.poi.name}
                    </h3>

                    {/* Coordinates & Elevation */}
                    <div className="flex items-center gap-3 text-[10px] font-mono text-stone-600">
                      <span>GPS: {b.poi.lat.toFixed(5)}° N, {Math.abs(b.poi.lng).toFixed(5)}° W</span>
                      {b.poi.altitudeMeters && (
                        <span>• {b.poi.altitudeMeters}m alt</span>
                      )}
                    </div>
                  </div>

                  {/* Beacon Core: QR Code & Riddle teaser */}
                  <div className="my-4 flex items-center gap-4">
                    {/* QR Code image */}
                    {b.qrDataUrl && (
                      <div className="w-32 h-32 p-1 bg-white border-2 border-stone-800 rounded-2xl shadow-sm shrink-0 flex items-center justify-center">
                        <img
                          src={b.qrDataUrl}
                          alt={`QR ${b.poi.name}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Instructions & Riddle Clue */}
                    <div className="space-y-2 text-left min-w-0">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800">
                          Instrucciones en el Sendero:
                        </span>
                        <p className="text-[11px] text-stone-700 leading-snug">
                          Abre la cámara de tu móvil para escanear y registrar tu paso por este hito en <strong>Enigma Vivo</strong>.
                        </p>
                      </div>

                      {b.riddleQuestion && (
                        <div className="p-2 rounded-xl bg-amber-100/70 border border-amber-300/80 text-[10px] text-stone-800 italic leading-snug">
                          &quot;{b.riddleQuestion.slice(0, 110)}...&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Beacon Footer */}
                  <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[9px] font-mono text-stone-500">
                    <span>Sello de Protección Forestal</span>
                    <span>Red de Senderos de Aventura</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Screen Action Footer */}
        <div className="print:hidden p-4 bg-black/40 border-t border-emerald-950 flex items-center justify-between">
          <p className="text-[11px] text-stone-400">
            Consejo: Imprime en cartulina plastificada o papel resistente al agua para máxima durabilidad en la intemperie.
          </p>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir ({beacons.length} Balizas)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
