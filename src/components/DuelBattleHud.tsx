import React, { useState, useEffect } from 'react';
import { DuelMatch, DuelTeam, DuelEvent } from '../types';
import { duelService } from '../services/duelService';
import { useI18n } from '../context/I18nContext';
import { calculateHaversineDistance, formatDistance } from '../utils/geo';
import { sounds } from '../utils/audio';
import {
  Swords,
  CloudFog,
  Eye,
  Radio,
  Volume2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

interface DuelBattleHudProps {
  sessionCode: string;
  duelMatchCode: string;
  playerLat: number;
  playerLng: number;
  totalPois: number;
}

export const DuelBattleHud: React.FC<DuelBattleHudProps> = ({
  sessionCode,
  duelMatchCode,
  playerLat,
  playerLng,
  totalPois,
}) => {
  const { t } = useI18n();
  const [match, setMatch] = useState<DuelMatch | null>(null);
  const [showLog, setShowLog] = useState<boolean>(false);
  const [activeFogAlert, setActiveFogAlert] = useState<boolean>(false);
  const [actionCooldown, setActionCooldown] = useState<string | null>(null);

  // Sync duel state
  useEffect(() => {
    duelService.connect(duelMatchCode, sessionCode);

    const unsubscribe = duelService.subscribe((updatedMatch) => {
      setMatch(updatedMatch);
    });

    const unsubscribeAction = duelService.onActionEffect((effect) => {
      if (effect.type === 'fog') {
        setActiveFogAlert(true);
        sounds.playDuelAction();
        setTimeout(() => setActiveFogAlert(false), 30000);
      } else if (effect.type === 'echo') {
        sounds.playDuelEcho();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeAction();
    };
  }, [duelMatchCode, sessionCode]);

  if (!match) return null;

  // Identify my team vs rival team
  const myTeam = match.teams.find((t) => t.sessionCode === sessionCode) || match.teams[0];
  const rivalTeam = match.teams.find((t) => t.id !== myTeam?.id) || match.teams[1];

  // Calculate distance between teams
  let distanceToRival: number | null = null;
  if (myTeam && rivalTeam && rivalTeam.lat && rivalTeam.lng) {
    distanceToRival = calculateHaversineDistance(playerLat, playerLng, rivalTeam.lat, rivalTeam.lng);
  }

  const isRivalNear = distanceToRival !== null && distanceToRival < 60;

  // Trigger stealth audio alert once when entering stealth zone
  useEffect(() => {
    if (isRivalNear) {
      sounds.playStealthAlert();
    }
  }, [isRivalNear]);

  const handleTriggerAction = async (action: 'fog' | 'whisper' | 'echo') => {
    if (actionCooldown) return;
    setActionCooldown(action);
    sounds.playDuelAction();

    await duelService.triggerAction(action);
    setTimeout(() => {
      setActionCooldown(null);
    }, 15000);
  };

  const myPoiRatio = totalPois > 0 ? ((myTeam?.completedPoiIds.length || 0) / totalPois) * 100 : 0;
  const rivalPoiRatio =
    totalPois > 0 && rivalTeam ? ((rivalTeam.completedPoiIds.length || 0) / totalPois) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      {/* 1. Fog Overlay Banner if targeted by rival */}
      {activeFogAlert && (
        <div className="bg-purple-950/90 border border-purple-500/80 rounded-2xl p-2.5 px-4 text-purple-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg shadow-purple-950 animate-pulse">
          <div className="flex items-center gap-2">
            <CloudFog className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{t('duel.fogActiveOnYou')}</span>
          </div>
          <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded">30s</span>
        </div>
      )}

      {/* 2. Proximity Stealth Warning if Rival is < 60m */}
      {isRivalNear && (
        <div className="bg-amber-950/90 border border-amber-500/80 rounded-2xl p-2.5 px-4 text-amber-200 text-xs font-bold flex items-center justify-between gap-2 shadow-lg shadow-amber-950/80 animate-bounce">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('duel.stealthAlert')}</span>
          </div>
          <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
            {formatDistance(distanceToRival || 0)}
          </span>
        </div>
      )}

      {/* 3. Main Head-to-Head Duel Card */}
      <div className="bg-gradient-to-r from-[#18261A]/95 via-[#1E1B15]/95 to-[#162228]/95 border border-amber-500/40 rounded-2xl p-3 sm:p-3.5 shadow-xl text-stone-200 backdrop-blur-md space-y-2.5">
        {/* Top Bar: Match Code, Proximity Radar, Battle Log Toggle */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
              <Swords className="w-3 h-3 text-amber-400" />
              <span>{match.code}</span>
            </span>

            {distanceToRival !== null && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-300 font-medium">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">{t('duel.distanceToRival')}:</span>
                <strong className="text-amber-200">{formatDistance(distanceToRival)}</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowLog(!showLog)}
            className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-black/40 hover:bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors"
          >
            <span>{t('duel.battleFeed')}</span>
            {showLog ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Head-to-Head Progress Bars */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* My Team */}
          <div className="bg-black/40 rounded-xl p-2 sm:p-2.5 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-base">{myTeam?.emblem}</span>
                <span className="font-adventure text-xs font-bold text-emerald-300 truncate">
                  {myTeam?.name} <span className="text-[10px] text-stone-400 font-normal">({t('duel.you')})</span>
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-amber-300 shrink-0">
                {myTeam?.points || 0} pts
              </span>
            </div>

            <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, myPoiRatio)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>{t('duel.poisCompleted')}:</span>
              <strong className="text-stone-200">
                {myTeam?.completedPoiIds.length || 0} / {totalPois}
              </strong>
            </div>
          </div>

          {/* Rival Team */}
          <div className="bg-black/40 rounded-xl p-2 sm:p-2.5 border border-blue-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-base">{rivalTeam ? rivalTeam.emblem : '⏳'}</span>
                <span className="font-adventure text-xs font-bold text-blue-300 truncate">
                  {rivalTeam ? rivalTeam.name : 'Esperando rival...'}
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-amber-300 shrink-0">
                {rivalTeam ? rivalTeam.points : 0} pts
              </span>
            </div>

            <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, rivalPoiRatio)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>{t('duel.poisCompleted')}:</span>
              <strong className="text-stone-200">
                {rivalTeam ? rivalTeam.completedPoiIds.length : 0} / {totalPois}
              </strong>
            </div>
          </div>
        </div>

        {/* Tactical Forest Powers Toolbar */}
        {rivalTeam && (
          <div className="pt-1 flex items-center justify-between gap-1.5 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Tácticas del Bosque:
            </span>

            <div className="flex items-center gap-1.5">
              {/* Niebla Mística */}
              <button
                type="button"
                onClick={() => handleTriggerAction('fog')}
                disabled={Boolean(actionCooldown)}
                title={t('duel.powerFogDesc')}
                className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              >
                <CloudFog className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">{t('duel.powerFog')}</span>
              </button>

              {/* Susurro del Búho */}
              <button
                type="button"
                onClick={() => handleTriggerAction('whisper')}
                disabled={Boolean(actionCooldown)}
                title={t('duel.powerWhisperDesc')}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t('duel.powerWhisper')}</span>
              </button>

              {/* Eco del Bosque */}
              <button
                type="button"
                onClick={() => handleTriggerAction('echo')}
                disabled={Boolean(actionCooldown)}
                title={t('duel.powerEchoDesc')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t('duel.powerEcho')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Battle Log */}
        {showLog && (
          <div className="pt-2 border-t border-white/10 max-h-48 overflow-y-auto space-y-1.5 text-xs animate-in fade-in duration-200">
            {match.events && match.events.length > 0 ? (
              match.events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-black/30 rounded-lg p-2 border border-white/5 flex items-start gap-2"
                >
                  <span className="text-sm shrink-0">{ev.icon || '🌲'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-200 text-[11px] leading-tight">{ev.message}</p>
                    <span className="text-[9px] text-stone-500 font-mono">{ev.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-stone-400 italic text-center py-2">
                {t('duel.noEventsYet')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
