import React from 'react';
import { WindmillPOI, StoryIntro, ForestPack, PlayerSession } from '../types';
import { useI18n } from '../context/I18nContext';
import { Award, ArrowRight, Sparkles, CheckCircle, KeyRound, BookmarkCheck, Camera, Briefcase, Search, Share2 } from 'lucide-react';
import { getRelicForPoi } from '../data/backpackArtifacts';

interface RewardScreenCardProps {
  session: PlayerSession;
  currentPoi: WindmillPOI;
  nextPoi?: WindmillPOI;
  forest: ForestPack;
  story?: StoryIntro;
  onContinue: () => void;
  onOpenAlbum?: () => void;
  onOpenBackpack?: () => void;
  onOpenShareTrail?: () => void;
  highContrast?: boolean;
}

export const RewardScreenCard: React.FC<RewardScreenCardProps> = ({
  session,
  currentPoi,
  nextPoi,
  forest,
  story,
  onContinue,
  onOpenAlbum,
  onOpenBackpack,
  onOpenShareTrail,
  highContrast,
}) => {
  const { t } = useI18n();
  const currentRune = session.collectedRunes?.find((r) => r.poiId === currentPoi.id);
  const totalPois = session.routePoiIds.length;
  const isFinalPoi = session.currentPoiIndex + 1 >= totalPois;

  // Find or compute unlocked relic for this POI
  const currentRelic = session.inventory?.find((it) => it.foundAtPoiId === currentPoi.id) ||
    getRelicForPoi(currentPoi, forest.name);

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-center ${
        highContrast
          ? 'bg-black border-yellow-400 text-white'
          : 'bg-gradient-to-b from-[#1E2E20] via-[#162518] to-[#111C13] border-amber-500/60 text-stone-100'
      }`}
    >
      {/* Triumphal Icon */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-950/80 animate-bounce">
          <Award className="w-10 h-10" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
          <CheckCircle className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-adventure font-bold tracking-widest text-amber-300">
          {t('reward.passed')}
        </span>
        <h2 className="font-adventure text-2xl sm:text-3xl font-extrabold text-amber-100">
          {t('reward.solved', { poiName: currentPoi.name })}
        </h2>
        <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
          {t('reward.desc')}
        </p>
      </div>

      {/* Relic Unlocked Discovery Card */}
      {currentRelic && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-[#272013] to-emerald-950/60 border border-amber-500/60 max-w-md mx-auto space-y-3 text-left shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nueva Reliquia en tu Mochila</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
              {currentRelic.category === 'relic' ? '🏺 Reliquia' : currentRelic.category === 'tool' ? '🔍 Herramienta' : '📜 Manuscrito'}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-13 h-13 rounded-2xl bg-black/40 border border-amber-400/50 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {currentRelic.iconEmoji}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-adventure text-sm sm:text-base font-bold text-amber-100 leading-tight">
                {currentRelic.name}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-0.5 italic">
                "{currentRelic.shortDesc}"
              </p>
            </div>
          </div>

          {onOpenBackpack && (
            <button
              type="button"
              onClick={onOpenBackpack}
              className="w-full py-2 px-3 rounded-xl bg-amber-900/60 hover:bg-amber-800 border border-amber-500/50 text-amber-200 hover:text-white font-adventure text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow"
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Examinar en la Mochila de Expedición</span>
            </button>
          )}
        </div>
      )}

      {/* Meta-Enigma Rune Reveal Box */}
      {currentRune && (
        <div className="p-5 rounded-2xl bg-black/50 border border-amber-500/50 max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('reward.runeRevealed')}</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center text-3xl font-mono font-black border-2 border-amber-300 shadow-lg">
              {currentRune.letter}
            </div>
            <div className="text-left">
              <div className="font-adventure font-bold text-amber-100 text-base">
                {t('reward.runeLetter', { letter: currentRune.letter })}
              </div>
              <div className="text-xs text-stone-300">
                {t('reward.runeHelp')}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                {t('reward.runeProgress', { current: session.collectedRunes?.length || 1, total: totalPois })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Points & Stats Banner */}
      <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold">
        <div className="px-4 py-2 rounded-xl bg-black/40 border border-emerald-800 text-emerald-300">
          {t('reward.totalPoints')} <span className="text-amber-300 text-sm">{session.points}</span>
        </div>
        <div className="px-4 py-2 rounded-xl bg-black/40 border border-emerald-800 text-stone-300">
          {t('reward.poiStep', { current: session.currentPoiIndex + 1, total: totalPois })}
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="pt-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-emerald-950/80 active:scale-95 transition-all flex items-center justify-center gap-2.5"
        >
          {isFinalPoi ? (
            <>
              <KeyRound className="w-5 h-5 text-amber-300" />
              <span>{t('reward.openMetaEnigma')}</span>
            </>
          ) : (
            <>
              <span>{t('reward.marchToNext', { poiName: nextPoi?.name || '...' })}</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </>
          )}
        </button>

        {!isFinalPoi && nextPoi && (
          <p className="text-[11px] text-stone-400 mt-2">
            {t('reward.nextSealed', { poiName: nextPoi.name })}
          </p>
        )}

        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          {onOpenAlbum && (
            <button
              type="button"
              onClick={onOpenAlbum}
              className="flex-1 py-2.5 px-3 rounded-xl bg-black/40 hover:bg-black/60 border border-amber-600/50 text-amber-200 font-adventure text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>{t('album.captureBtn') || 'Foto de Campo'}</span>
            </button>
          )}

          {onOpenShareTrail && (
            <button
              type="button"
              onClick={onOpenShareTrail}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FC5200]/25 to-amber-950/40 hover:from-[#FC5200]/40 hover:to-amber-900/60 border border-[#FC5200]/50 text-[#FC5200] font-adventure text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-[#FC5200]" />
              <span>Ficha Strava</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
