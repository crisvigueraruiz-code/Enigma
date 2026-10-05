import React, { useState, useEffect } from 'react';
import { ForestPack, StoryIntro, DuelMatch } from '../types';
import { duelService } from '../services/duelService';
import { useI18n } from '../context/I18nContext';
import { sounds } from '../utils/audio';
import {
  Swords,
  X,
  Copy,
  Check,
  Users,
  Shield,
  Bot,
  Sparkles,
  ArrowRight,
  Flame,
  Radio,
  Eye,
  Compass,
} from 'lucide-react';

interface DuelLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  forests: ForestPack[];
  initialForest?: ForestPack | null;
  onStartDuelGame: (sessionCode: string, forestPackId: string) => void;
}

const EMBLEMS = [
  { icon: '🐺', label: 'Lobo' },
  { icon: '🦅', label: 'Águila' },
  { icon: '🦊', label: 'Zorro' },
  { icon: '🐗', label: 'Jabalí' },
  { icon: '🦉', label: 'Búho' },
  { icon: '🐻', label: 'Oso' },
];

const COLORS = [
  { hex: '#10b981', label: 'Esmeralda' },
  { hex: '#f59e0b', label: 'Ámbar' },
  { hex: '#3b82f6', label: 'Zafiro' },
  { hex: '#ec4899', label: 'Rubí' },
  { hex: '#8b5cf6', label: 'Amatista' },
];

export const DuelLobbyModal: React.FC<DuelLobbyModalProps> = ({
  isOpen,
  onClose,
  forests,
  initialForest,
  onStartDuelGame,
}) => {
  const { t, currentLanguage } = useI18n();
  const [tab, setTab] = useState<'create' | 'join'>('create');

  // Form states
  const [selectedForestId, setSelectedForestId] = useState<string>(
    initialForest?.id || forests[0]?.id || ''
  );
  const [selectedStoryId, setSelectedStoryId] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [selectedEmblem, setSelectedEmblem] = useState<string>('🐺');
  const [selectedColor, setSelectedColor] = useState<string>('#10b981');
  const [joinCode, setJoinCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Waiting room state
  const [createdMatch, setCreatedMatch] = useState<DuelMatch | null>(null);
  const [createdSessionCode, setCreatedSessionCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const activeForest = forests.find((f) => f.id === selectedForestId) || forests[0];

  useEffect(() => {
    if (activeForest && activeForest.stories.length > 0) {
      if (!selectedStoryId || !activeForest.stories.some((s) => s.id === selectedStoryId)) {
        setSelectedStoryId(activeForest.stories[0].id);
      }
    }
  }, [activeForest]);

  // Subscribe to match updates to auto-start when second player joins
  useEffect(() => {
    if (!createdMatch) return;

    const unsubscribe = duelService.subscribe((updatedMatch) => {
      if (updatedMatch.code === createdMatch.code) {
        setCreatedMatch(updatedMatch);
        if (updatedMatch.teams.length >= 2 && updatedMatch.status === 'in_progress') {
          sounds.playSuccess();
          setTimeout(() => {
            onStartDuelGame(createdSessionCode, updatedMatch.forestPackId);
            onClose();
          }, 1200);
        }
      }
    });

    return () => unsubscribe();
  }, [createdMatch, createdSessionCode, onStartDuelGame, onClose]);

  if (!isOpen) return null;

  const handleCreateMatch = async (includeShadowRival: boolean = false) => {
    setErrorMsg('');
    setLoading(true);
    try {
      sounds.playClick();
      const res = await duelService.createMatch({
        forestPackId: activeForest.id,
        storyId: selectedStoryId || activeForest.stories[0]?.id,
        teamName: teamName.trim() || (selectedEmblem === '🐺' ? 'Los Lobos del Iregua' : 'Equipo Forestal'),
        emblem: selectedEmblem,
        color: selectedColor,
        includeShadowRival,
        language: currentLanguage,
      });

      setCreatedMatch(res.match);
      setCreatedSessionCode(res.sessionCode);

      if (includeShadowRival) {
        sounds.playSuccess();
        setTimeout(() => {
          onStartDuelGame(res.sessionCode, res.match.forestPackId);
          onClose();
        }, 1000);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error al crear la batalla');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setErrorMsg('Introduce el código de batalla');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      sounds.playClick();
      const res = await duelService.joinMatch({
        code: joinCode.trim(),
        teamName: teamName.trim() || 'Las Águilas de Nalda',
        emblem: selectedEmblem === '🐺' ? '🦅' : selectedEmblem,
        color: selectedColor === '#10b981' ? '#3b82f6' : selectedColor,
        language: currentLanguage,
      });

      sounds.playSuccess();
      setTimeout(() => {
        onStartDuelGame(res.sessionCode, res.match.forestPackId);
        onClose();
      }, 1000);
    } catch (e: any) {
      setErrorMsg(e.message || 'No se pudo unir al duelo');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (createdMatch?.code) {
      navigator.clipboard?.writeText(createdMatch.code);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1E2E21] via-[#162319] to-[#0F1912] border border-amber-500/40 rounded-3xl shadow-2xl text-stone-100 overflow-hidden my-6">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-950/60 via-emerald-950 to-stone-950 px-5 sm:px-6 py-4 border-b border-amber-600/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                {t('duel.heroBadge')}
              </span>
              <h2 className="font-adventure text-lg sm:text-xl font-bold text-amber-100 leading-tight">
                {t('duel.title')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If waiting for rival after creating room */}
          {createdMatch && createdMatch.status === 'waiting' ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-3xl shadow-lg shadow-amber-950/60 animate-bounce">
                {selectedEmblem}
              </div>

              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span>{t('duel.waitingRival')}</span>
                </span>
                <h3 className="font-adventure text-2xl font-bold text-amber-100">
                  {createdMatch.teams[0]?.name}
                </h3>
                <p className="text-xs text-stone-300 max-w-sm mx-auto">
                  {t('duel.shareCodePrompt')}
                </p>
              </div>

              {/* Match Code Box */}
              <div className="bg-black/60 border border-amber-500/50 rounded-2xl p-4 max-w-xs mx-auto flex items-center justify-between gap-3 shadow-inner">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-amber-300">
                  {createdMatch.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('duel.copied') : t('duel.copyCode')}</span>
                </button>
              </div>

              {/* Or switch to play immediately vs shadow bot */}
              <div className="pt-4 border-t border-emerald-900/40">
                <p className="text-xs text-stone-400 mb-2">
                  {t('duel.startSoloDuelDesc')}
                </p>
                <button
                  type="button"
                  onClick={() => handleCreateMatch(true)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600/50 text-xs font-adventure font-bold tracking-wider inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>{t('duel.startSoloDuelBtn')}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => setTab('create')}
                  className={`py-2 px-3 rounded-xl font-adventure text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                    tab === 'create'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{t('duel.createTab')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('join')}
                  className={`py-2 px-3 rounded-xl font-adventure text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 ${
                    tab === 'join'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('duel.joinTab')}</span>
                </button>
              </div>

              {/* Subtitle description */}
              <p className="text-xs text-stone-300 leading-relaxed bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-3 flex items-start gap-2.5">
                <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('duel.subtitle')}</span>
              </p>

              {/* CREATE TAB */}
              {tab === 'create' ? (
                <div className="space-y-4">
                  {/* Select Forest */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {t('duel.selectForest')}
                    </label>
                    <select
                      value={selectedForestId}
                      onChange={(e) => setSelectedForestId(e.target.value)}
                      className="w-full bg-[#111A13] border border-emerald-700/50 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      {forests.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.pois.length} POIs)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Story */}
                  {activeForest.stories.length > 1 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        {t('duel.selectStory')}
                      </label>
                      <select
                        value={selectedStoryId}
                        onChange={(e) => setSelectedStoryId(e.target.value)}
                        className="w-full bg-[#111A13] border border-emerald-700/50 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                      >
                        {activeForest.stories.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.narratorName || 'Guía'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Team Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {t('duel.teamNameLabel')}
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder={t('duel.teamNamePlaceholder')}
                      className="w-full bg-[#111A13] border border-emerald-700/50 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Emblem and Color Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        {t('duel.teamEmblemLabel')}
                      </label>
                      <div className="flex items-center gap-2">
                        {EMBLEMS.map((e) => (
                          <button
                            key={e.icon}
                            type="button"
                            onClick={() => setSelectedEmblem(e.icon)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-95 ${
                              selectedEmblem === e.icon
                                ? 'bg-amber-500/30 border-2 border-amber-400 scale-110 shadow-md shadow-amber-950'
                                : 'bg-black/40 border border-white/10 hover:border-white/30'
                            }`}
                          >
                            {e.icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        {COLORS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setSelectedColor(c.hex)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-7 h-7 rounded-full transition-transform active:scale-95 ${
                              selectedColor === c.hex ? 'ring-4 ring-white/60 scale-110' : 'opacity-80 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleCreateMatch(false)}
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-adventure text-xs sm:text-sm font-black tracking-wider shadow-lg shadow-amber-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Flame className="w-4 h-4 text-stone-950" />
                      <span>{t('duel.createBtn')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCreateMatch(true)}
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-500/30 font-adventure text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Bot className="w-4 h-4 text-amber-400" />
                      <span>{t('duel.startSoloDuelBtn')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* JOIN TAB */
                <form onSubmit={handleJoinMatch} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {t('duel.matchCodeLabel')}
                    </label>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder={t('duel.matchCodePlaceholder')}
                      className="w-full bg-[#111A13] border border-amber-500/50 rounded-xl px-3.5 py-3 text-center font-mono text-lg font-bold text-amber-300 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {t('duel.teamNameLabel')}
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Ej. Las Águilas de Nalda"
                      className="w-full bg-[#111A13] border border-emerald-700/50 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {t('duel.teamEmblemLabel')}
                    </label>
                    <div className="flex items-center gap-2">
                      {EMBLEMS.map((e) => (
                        <button
                          key={e.icon}
                          type="button"
                          onClick={() => setSelectedEmblem(e.icon)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-95 ${
                            selectedEmblem === e.icon
                              ? 'bg-amber-500/30 border-2 border-amber-400 scale-110 shadow-md shadow-amber-950'
                              : 'bg-black/40 border border-white/10 hover:border-white/30'
                          }`}
                        >
                          {e.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure text-xs sm:text-sm font-bold tracking-wider shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Swords className="w-4 h-4 text-amber-300" />
                      <span>{t('duel.joinBtn')}</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
