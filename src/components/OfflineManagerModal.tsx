import React, { useState, useEffect } from 'react';
import { ForestPack } from '../types';
import { offlinePackService, OfflinePackMeta, useOnlineStatus } from '../services/offlinePackService';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import {
  Download,
  CheckCircle2,
  Trash2,
  Wifi,
  WifiOff,
  X,
  HardDrive,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  TreePine,
} from 'lucide-react';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  forests: ForestPack[];
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  forests,
}) => {
  const { t } = useI18n();
  const isOnline = useOnlineStatus();
  const [downloadedPacks, setDownloadedPacks] = useState<Record<string, OfflinePackMeta>>({});
  const [downloadingForestId, setDownloadingForestId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setDownloadedPacks(offlinePackService.getDownloadedPacks());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async (forest: ForestPack) => {
    setDownloadingForestId(forest.id);
    setDownloadProgress(0);
    setStepMessage('Iniciando descarga...');
    sounds.playClick();

    try {
      await offlinePackService.downloadForestPack(forest, (pct, msg) => {
        setDownloadProgress(pct);
        setStepMessage(msg);
      });
      sounds.playSuccess();
      setDownloadedPacks(offlinePackService.getDownloadedPacks());
    } catch (e: any) {
      setStepMessage('Error al descargar');
    } finally {
      setTimeout(() => {
        setDownloadingForestId(null);
      }, 1200);
    }
  };

  const handleRemove = async (forestId: string) => {
    sounds.playClick();
    await offlinePackService.removeForestPack(forestId);
    setDownloadedPacks(offlinePackService.getDownloadedPacks());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1C2C1F] via-[#142017] to-[#0E1610] border border-emerald-600/40 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-[#182B1C] to-emerald-950 px-5 sm:px-6 py-4 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  {t('offline.subtitle') || 'Pack Pre-Salida'}
                </span>
                {isOnline ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-300 bg-green-950/80 px-2 py-0.2 rounded-full border border-green-600/30">
                    <Wifi className="w-3 h-3" /> {t('offline.statusOnline') || 'En Línea'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.2 rounded-full border border-amber-600/30 animate-pulse">
                    <WifiOff className="w-3 h-3" /> {t('offline.statusOffline') || 'Sin Cobertura (Modo Offline Activo)'}
                  </span>
                )}
              </div>
              <h2 className="font-adventure text-lg sm:text-xl font-bold text-amber-100">
                {t('offline.title') || 'Descarga para Senderos sin Cobertura'}
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Explanation Banner */}
          <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-2xl p-3.5 sm:p-4 text-xs text-stone-300 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200 mb-1">
                {t('offline.subtitle') || 'Pack Pre-Salida sin Cobertura'}
              </p>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                {t('offline.desc') || 'Descarga el bosque antes de salir de casa. Guarda en la memoria de tu móvil los mosaicos de mapa, coordenadas GPS de los hitos, acertijos y sonidos ambientales para jugar al 100% de forma autónoma.'}
              </p>
            </div>
          </div>

          {/* Downloading Progress Bar */}
          {downloadingForestId && (
            <div className="bg-black/50 border border-amber-500/50 rounded-2xl p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-amber-200">{stepMessage}</span>
                <span className="font-mono font-bold text-amber-300">{downloadProgress}%</span>
              </div>
              <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Forest Packs List */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {t('offline.allPacksReady') || 'Paquetes Disponibles'}
            </h3>

            {forests.map((forest) => {
              const meta = downloadedPacks[forest.id];
              const isDownloaded = Boolean(meta);
              const isCurrentlyDownloading = downloadingForestId === forest.id;

              return (
                <div
                  key={forest.id}
                  className={`rounded-2xl p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isDownloaded
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                      : 'bg-stone-900/50 border-stone-700/40 hover:border-emerald-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-adventure text-sm font-bold text-amber-100">
                        {forest.name}
                      </h4>
                      {isDownloaded && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {t('offline.downloaded') || 'Listo Offline'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-300">
                      {forest.pois.length} {t('home.statPoisCount') || 'hitos'} · {forest.stories.length} {t('home.statStoriesCount') || 'narrativas'}
                      {meta && ` · ~${meta.sizeEstimateMb} MB (${meta.tilesCount} ${t('offline.tilesCached') || 'mosaicos'})`}
                    </p>
                    {meta && (
                      <p className="text-[10px] text-stone-400">
                        {meta.downloadedAt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {isDownloaded ? (
                      <button
                        type="button"
                        onClick={() => handleRemove(forest.id)}
                        className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-red-400 border border-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        title={t('offline.delete') || 'Liberar espacio'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('offline.delete') || 'Eliminar'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDownload(forest)}
                        disabled={isCurrentlyDownloading}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure text-xs font-bold tracking-wider shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isCurrentlyDownloading ? (t('offline.downloading') || 'Descargando...') : (t('offline.download') || 'Descargar Offline')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-emerald-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-adventure font-bold tracking-wider transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
