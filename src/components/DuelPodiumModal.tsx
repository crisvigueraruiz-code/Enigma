import React from 'react';
import { DuelMatch } from '../types';
import { useI18n } from '../context/I18nContext';
import { Trophy, Swords, Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DuelPodiumModalProps {
  isOpen: boolean;
  match: DuelMatch;
  sessionCode: string;
  onClose: () => void;
}

export const DuelPodiumModal: React.FC<DuelPodiumModalProps> = ({
  isOpen,
  match,
  sessionCode,
  onClose,
}) => {
  const { t } = useI18n();

  if (!isOpen || !match) return null;

  const myTeam = match.teams.find((t) => t.sessionCode === sessionCode) || match.teams[0];
  const rivalTeam = match.teams.find((t) => t.id !== myTeam?.id) || match.teams[1];

  const winner = match.teams.find((t) => t.id === match.winnerTeamId) || match.teams[0];
  const isMyTeamWinner = winner?.id === myTeam?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#222E21] via-[#1A251B] to-[#121B13] border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 text-center space-y-6 my-6">
        {/* Crown / Trophy */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-2xl shadow-amber-950 flex items-center justify-center">
          <div className="w-full h-full bg-[#18261A] rounded-full flex items-center justify-center text-4xl">
            {winner?.emblem || '🏆'}
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-200 animate-spin-slow" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 font-mono">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('duel.podiumTitle')}</span>
          </div>

          <h2 className="font-adventure text-2xl sm:text-3xl font-extrabold text-amber-100 leading-tight">
            {isMyTeamWinner ? t('duel.winnerTitle') : t('duel.defeatedTitle')}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto leading-relaxed">
            {winner?.name} ha completado la senda y reclamado el Gran Sello del Bosque.
          </p>
        </div>

        {/* Comparative Podium Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Winner Card */}
          <div className="bg-amber-950/40 border-2 border-amber-500/70 rounded-2xl p-3.5 space-y-2 relative shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider">
              1º PUESTO
            </span>
            <div className="text-2xl pt-1">{winner?.emblem}</div>
            <h4 className="font-adventure text-xs sm:text-sm font-bold text-amber-200 truncate">
              {winner?.name}
            </h4>
            <div className="text-lg font-mono font-extrabold text-amber-300">
              {winner?.points || 0} pts
            </div>
            <p className="text-[11px] text-stone-400">
              {winner?.completedPoiIds.length || 0} hitos superados
            </p>
          </div>

          {/* Second Place Card */}
          {rivalTeam && (
            <div className="bg-stone-900/60 border border-stone-700/60 rounded-2xl p-3.5 space-y-2 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-stone-700 text-stone-200 text-[10px] font-bold uppercase tracking-wider">
                2º PUESTO
              </span>
              <div className="text-2xl pt-1">
                {isMyTeamWinner ? rivalTeam.emblem : myTeam.emblem}
              </div>
              <h4 className="font-adventure text-xs sm:text-sm font-bold text-stone-300 truncate">
                {isMyTeamWinner ? rivalTeam.name : myTeam.name}
              </h4>
              <div className="text-lg font-mono font-extrabold text-stone-300">
                {isMyTeamWinner ? rivalTeam.points : myTeam.points} pts
              </div>
              <p className="text-[11px] text-stone-400">
                {(isMyTeamWinner ? rivalTeam.completedPoiIds.length : myTeam.completedPoiIds.length) || 0} hitos superados
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-adventure text-xs sm:text-sm font-black tracking-wider shadow-xl shadow-amber-950 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>{t('duel.close')}</span>
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
