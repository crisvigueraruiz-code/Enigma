/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ForestPack, PlayerSession, DifficultyType, DurationType, StoryIntro } from './types';
import { SEED_FOREST_PACKS } from './data/seedPacks';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { ForestSelector } from './components/ForestSelector';
import { NewGameModal } from './components/NewGameModal';
import { ResumeGameModal } from './components/ResumeGameModal';
import { GameView } from './components/GameView';
import { CompletionModal } from './components/CompletionModal';
import { AdminPanel } from './components/AdminPanel';
import { CharacterInteractionModal } from './components/CharacterInteractionModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { BriefingModal } from './components/BriefingModal';
import { PauseOrAbandonModal } from './components/PauseOrAbandonModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DuelLobbyModal } from './components/DuelLobbyModal';
import { DuelPodiumModal } from './components/DuelPodiumModal';
import { ExplorerPassportModal } from './components/ExplorerPassportModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { ExpeditionPhotoAlbumModal } from './components/ExpeditionPhotoAlbumModal';
import { PrintableTrailBeaconsModal } from './components/PrintableTrailBeaconsModal';
import { duelService } from './services/duelService';
import { ambientAudio } from './utils/audio';
import { useI18n } from './context/I18nContext';
import { DuelMatch } from './types';

export default function App() {
  const { currentLanguage, localizeForest, onForestSelected, t } = useI18n();
  const [forests, setForests] = useState<ForestPack[]>(SEED_FOREST_PACKS);
  const [currentView, setCurrentView] = useState<'home' | 'game' | 'admin'>('home');
  const [selectedForest, setSelectedForest] = useState<ForestPack | null>(SEED_FOREST_PACKS[0] || null);
  const [activeSession, setActiveSession] = useState<PlayerSession | null>(null);

  // Modals
  const [isNewGameOpen, setIsNewGameOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isDuelLobbyOpen, setIsDuelLobbyOpen] = useState(false);
  const [isDuelPodiumOpen, setIsDuelPodiumOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [printingForest, setPrintingForest] = useState<ForestPack | null>(null);
  const [activeDuelMatch, setActiveDuelMatch] = useState<DuelMatch | null>(null);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [activeCharacterStory, setActiveCharacterStory] = useState<StoryIntro | null>(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [selectedStoryForNewGame, setSelectedStoryForNewGame] = useState<string | undefined>(undefined);

  // GPS Simulation toggle (default true for smooth testability, toggleable to real GPS anytime)
  const [simulatedGps, setSimulatedGps] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load forests & restore previous session from localStorage on startup
  useEffect(() => {
    loadForests();
    restoreSessionFromStorage();

    // Check URL route for direct organizer access (#admin, /admin, ?admin=true)
    const checkAdminRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const search = window.location.search;
      if (hash === '#admin' || pathname === '/admin' || search.includes('admin=true')) {
        setCurrentView('admin');
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  useEffect(() => {
    if (selectedForest) {
      ambientAudio.updateContext({ forest: selectedForest });
    }
  }, [selectedForest]);

  const loadForests = async () => {
    try {
      const data = await api.getForests();
      if (data && data.length > 0) {
        setForests(data);
        if (!selectedForest) {
          setSelectedForest(data[0]);
        }
      }
    } catch (err) {
      console.warn('Using embedded forests:', err);
    }
  };

  const restoreSessionFromStorage = async () => {
    const savedCode = localStorage.getItem('enigma_active_session');
    if (savedCode) {
      try {
        const { session, forestPack } = await api.getSession(savedCode);
        if (
          !session ||
          !forestPack ||
          !Array.isArray(forestPack.pois) ||
          forestPack.pois.length === 0 ||
          !Array.isArray(session.routePoiIds) ||
          session.routePoiIds.length === 0
        ) {
          throw new Error('Sesión o bosque incompleto en almacenamiento');
        }
        if (typeof session.currentPoiIndex !== 'number' || isNaN(session.currentPoiIndex) || session.currentPoiIndex < 0) {
          session.currentPoiIndex = 0;
        } else if (session.currentPoiIndex >= session.routePoiIds.length) {
          session.currentPoiIndex = session.routePoiIds.length - 1;
        }
        setActiveSession(session);
        setSelectedForest(forestPack);
        if (session.status === 'completed') {
          setIsCompletionOpen(true);
        }
        setCurrentView('game');
      } catch (e) {
        console.warn('Limpiando sesión previa inválida:', e);
        try {
          localStorage.removeItem('enigma_active_session');
        } catch {}
        setActiveSession(null);
        setCurrentView('home');
      }
    }
  };

  // Start a new session
  const handleStartSession = async (config: {
    forestPackId: string;
    name: string;
    type: 'individual' | 'grupo';
    storyId: string;
    difficulty: DifficultyType;
    duration: DurationType;
    easyMode?: boolean;
    language?: string;
  }) => {
    setLoading(true);
    try {
      const { session, forestPack } = await api.createSession({
        ...config,
        language: currentLanguage,
      });
      setActiveSession(session);
      setSelectedForest(forestPack);
      localStorage.setItem('enigma_active_session', session.code);
      setIsNewGameOpen(false);
      setIsBriefingOpen(true);
      setCurrentView('game');
    } catch (e: any) {
      alert(e.message || 'Error al iniciar expedición');
    } finally {
      setLoading(false);
    }
  };

  // Resume game with code
  const handleResumeSession = async (code: string) => {
    setLoading(true);
    try {
      const { session, forestPack } = await api.getSession(code);
      setActiveSession(session);
      setSelectedForest(forestPack);
      localStorage.setItem('enigma_active_session', session.code);
      setIsResumeOpen(false);
      setIsBriefingOpen(false); // Resumed session skips briefing
      setCurrentView('game');
      if (session.status === 'completed') {
        setIsCompletionOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Start duel game
  const handleStartDuelGame = async (sessionCode: string, forestPackId: string) => {
    setLoading(true);
    try {
      const { session, forestPack } = await api.getSession(sessionCode);
      setActiveSession(session);
      setSelectedForest(forestPack);
      localStorage.setItem('enigma_active_session', session.code);
      setIsDuelLobbyOpen(false);
      setIsBriefingOpen(false);
      setCurrentView('game');
    } catch (e: any) {
      alert(e.message || 'Error al iniciar duelo');
    } finally {
      setLoading(false);
    }
  };

  // Listen for duel completion to open podium modal
  useEffect(() => {
    if (!activeSession?.duelMatchCode) return;
    const unsub = duelService.subscribe((match) => {
      setActiveDuelMatch(match);
      if (match.status === 'finished') {
        setIsDuelPodiumOpen(true);
      }
    });
    return () => unsub();
  }, [activeSession?.duelMatchCode]);

  // Submit Answer in Game (Supports 6ter all types & bonus)
  const handleSubmitAnswer = async (answer: string, riddleId?: string) => {
    if (!activeSession) return { isCorrect: false };
    setLoading(true);
    try {
      const res = await api.submitAnswer(activeSession.code, answer, riddleId);
      setActiveSession(res.session);
      return { isCorrect: res.isCorrect, message: res.message };
    } catch (err: any) {
      return { isCorrect: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Arrive at POI (Sección 6bis: desbloqueo GPS 25m/60m o botón «Estoy aquí»)
  const handleArriveAtPoi = async () => {
    if (!activeSession) return;
    try {
      const res = await api.arriveAtPoi(activeSession.code);
      setActiveSession(res.session);
    } catch (e) {
      console.error('Error arriving at POI:', e);
    }
  };

  // Continue Transit to next POI (Sección 6bis: tras pantalla de recompensa)
  const handleContinueTransit = async () => {
    if (!activeSession) return;
    try {
      const res = await api.continueTransit(activeSession.code);
      setActiveSession(res.session);
      if (res.isComplete) {
        setIsCompletionOpen(true);
      }
    } catch (e) {
      console.error('Error continuing transit:', e);
    }
  };

  // Solve Meta-Enigma Final (Sección 6ter)
  const handleSolveMetaEnigma = async (answer: string) => {
    if (!activeSession) return { isCorrect: false, message: 'No hay partida activa' };
    try {
      const res = await api.solveMetaEnigma(activeSession.code, answer);
      setActiveSession(res.session);
      return { isCorrect: res.isCorrect, message: res.message };
    } catch (e: any) {
      return { isCorrect: false, message: e.message || 'Error al resolver el códice' };
    }
  };

  // Request Progressive Hint
  const handleRequestHint = async (level: 1 | 2 | 3) => {
    if (!activeSession) return { hint: '', penalty: 0 };
    const res = await api.requestHint(activeSession.code, level);
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            points: res.currentPoints,
            hintHistory: [
              ...prev.hintHistory,
              {
                poiId: prev.routePoiIds[prev.currentPoiIndex],
                level,
                text: res.hint,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          }
        : null
    );
    return { hint: res.hint, penalty: res.pointsPenalty };
  };

  // Send message to guide
  const handleSendMessage = async (text: string) => {
    if (!activeSession) return;
    // Optimistically record player message
    const playerMsg = {
      id: `msg-p-${Date.now()}`,
      sender: 'player' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveSession((prev) =>
      prev ? { ...prev, messages: [...prev.messages, playerMsg] } : null
    );

    try {
      const { reply } = await api.sendChatMessage(activeSession.code, text);
      setActiveSession((prev) =>
        prev ? { ...prev, messages: [...prev.messages, reply] } : null
      );
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  // Update Location
  const handleUpdateLocation = async (lat: number, lng: number) => {
    if (!activeSession) return;
    await api.updateLocation(activeSession.code, lat, lng);
  };

  // Complete & Rate Game
  const handleFinishGame = async (rating: number, comment: string) => {
    if (!activeSession) return;
    setLoading(true);
    try {
      await api.submitFeedback(activeSession.code, rating, comment);
      localStorage.removeItem('enigma_active_session');
      setTimeout(() => {
        setIsCompletionOpen(false);
        setActiveSession(null);
        setCurrentView('home');
        loadForests();
      }, 1500);
    } catch (e: any) {
      alert(e.message || 'Error al guardar valoración');
    } finally {
      setLoading(false);
    }
  };

  // Pause and save session to resume another day
  const handlePauseAndSave = () => {
    if (activeSession) {
      localStorage.setItem('enigma_active_session', activeSession.code);
    }
    setIsPauseModalOpen(false);
    setCurrentView('home');
  };

  // Abandon session permanently
  const handleAbandonPermanently = async () => {
    if (activeSession) {
      try {
        await api.abandonSession(activeSession.code);
      } catch (e) {
        console.error('Error abandoning session:', e);
      }
      localStorage.removeItem('enigma_active_session');
      setActiveSession(null);
    }
    setIsPauseModalOpen(false);
    setCurrentView('home');
  };

  // Admin Access Gate (Contraseña desactivada por el momento)
  const handleOpenAdmin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
    setCurrentView(activeSession ? 'game' : 'home');
  };

  // Localized data computed reactively based on currentLanguage
  const localizedForests = forests.map((f) => localizeForest(f));
  const localizedSelectedForest = selectedForest ? localizeForest(selectedForest) : null;

  return (
    <div className="min-h-screen bg-[#142016] text-stone-100 flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        sessionCode={activeSession?.code}
        points={activeSession?.points}
        onNavigateHome={() => {
          if (currentView === 'game') {
            setIsPauseModalOpen(true);
          } else {
            setCurrentView(activeSession ? 'game' : 'home');
          }
        }}
        onOpenAdmin={handleOpenAdmin}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogoutAdmin={handleAdminLogout}
        simulatedGps={simulatedGps}
        onToggleSimulatedGps={() => setSimulatedGps(!simulatedGps)}
        onOpenPauseModal={() => setIsPauseModalOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenDuelLobby={() => setIsDuelLobbyOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenOffline={() => setIsOfflineModalOpen(true)}
        onOpenAlbum={() => setIsAlbumModalOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {currentView === 'home' && (
          <ForestSelector
            forests={localizedForests}
            onSelectForest={(f) => {
              onForestSelected(f);
              setSelectedForest(f);
              setSelectedStoryForNewGame(undefined);
              setIsNewGameOpen(true);
            }}
            onResumeGame={() => setIsResumeOpen(true)}
            onInteractWithCharacter={(story, forest) => {
              onForestSelected(forest);
              setSelectedForest(forest);
              setActiveCharacterStory(story);
              setIsCharacterModalOpen(true);
            }}
            onStartRouteWithStory={(forest, storyId) => {
              onForestSelected(forest);
              setSelectedForest(forest);
              setSelectedStoryForNewGame(storyId);
              setIsNewGameOpen(true);
            }}
            loading={loading}
            activeSession={activeSession}
            selectedForest={localizedSelectedForest}
            onContinueSavedGame={() => setCurrentView('game')}
            onOpenPauseOrAbandon={() => setIsPauseModalOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenDuelLobby={() => setIsDuelLobbyOpen(true)}
            onOpenPassport={() => setIsPassportOpen(true)}
            onOpenOffline={() => setIsOfflineModalOpen(true)}
            onOpenAlbum={() => setIsAlbumModalOpen(true)}
            onOpenPrintBeacons={(f) => setPrintingForest(f)}
          />
        )}

        {currentView === 'game' && activeSession && localizedSelectedForest && (
          <GameView
            session={activeSession}
            forest={localizedSelectedForest}
            onSubmitAnswer={handleSubmitAnswer}
            onRequestHint={handleRequestHint}
            onSendMessage={handleSendMessage}
            onUpdateLocation={handleUpdateLocation}
            onArriveAtPoi={handleArriveAtPoi}
            onContinueTransit={handleContinueTransit}
            onSolveMetaEnigma={handleSolveMetaEnigma}
            simulatedGps={simulatedGps}
            onToggleSimulatedGps={() => setSimulatedGps(!simulatedGps)}
            loading={loading}
            onOpenPauseModal={() => setIsPauseModalOpen(true)}
            onFinishGame={handleFinishGame}
          />
        )}

        {currentView === 'game' && (!activeSession || !localizedSelectedForest) && (
          <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto my-12 bg-stone-900/80 border border-emerald-900/60 rounded-3xl space-y-4">
            <p className="text-amber-300 font-bold font-adventure text-lg">No hay ninguna expedición activa seleccionada</p>
            <p className="text-stone-300 text-sm">Elige un bosque o aventura para comenzar a explorar.</p>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-adventure cursor-pointer shadow-lg transition-all"
            >
              Ir al Explorador de Bosques
            </button>
          </div>
        )}

        {currentView === 'admin' && (
          <AdminPanel
            onBackToGame={() => {
              setCurrentView(activeSession ? 'game' : 'home');
              loadForests();
            }}
            onLogoutAdmin={handleAdminLogout}
          />
        )}
      </main>

      {/* Admin Auth Password Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

      {/* New Game Setup Modal */}
      {localizedSelectedForest && (
        <NewGameModal
          forest={localizedSelectedForest}
          isOpen={isNewGameOpen}
          onClose={() => {
            setIsNewGameOpen(false);
            setSelectedStoryForNewGame(undefined);
          }}
          onStartSession={handleStartSession}
          loading={loading}
          initialStoryId={selectedStoryForNewGame}
        />
      )}

      {/* Mandatory Safety & Story Briefing Modal */}
      {localizedSelectedForest && activeSession && isBriefingOpen && (
        <BriefingModal
          isOpen={isBriefingOpen}
          forest={localizedSelectedForest}
          session={activeSession}
          onConfirm={() => setIsBriefingOpen(false)}
        />
      )}

      {/* Resume Game Modal */}
      <ResumeGameModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        onResume={handleResumeSession}
        loading={loading}
      />

      {/* Completion Modal */}
      {activeSession && localizedSelectedForest && isCompletionOpen && (
        <CompletionModal
          session={activeSession}
          forest={localizedSelectedForest}
          onFinish={handleFinishGame}
          loading={loading}
          onOpenPassport={() => setIsPassportOpen(true)}
          onOpenAlbum={() => setIsAlbumModalOpen(true)}
        />
      )}

      {/* Global Character Interaction Modal */}
      {localizedSelectedForest && activeCharacterStory && (
        <CharacterInteractionModal
          isOpen={isCharacterModalOpen}
          onClose={() => setIsCharacterModalOpen(false)}
          story={activeCharacterStory}
          session={activeSession || undefined}
          currentPoi={
            activeSession
              ? localizedSelectedForest.pois.find((p) => p.id === activeSession.routePoiIds[activeSession.currentPoiIndex])
              : localizedSelectedForest.pois[0]
          }
          forest={localizedSelectedForest}
          onSendTextMessage={activeSession ? handleSendMessage : undefined}
          textMessages={activeSession?.messages}
          onSelectOtherCharacter={(other) => setActiveCharacterStory(other)}
        />
      )}

      {/* Pause or Abandon Modal */}
      {localizedSelectedForest && activeSession && (
        <PauseOrAbandonModal
          isOpen={isPauseModalOpen}
          onClose={() => setIsPauseModalOpen(false)}
          forest={localizedSelectedForest}
          session={activeSession}
          onPauseAndSave={handlePauseAndSave}
          onAbandonPermanently={handleAbandonPermanently}
        />
      )}

      {/* How To Play Guide Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Duel Team Lobby Modal */}
      <DuelLobbyModal
        isOpen={isDuelLobbyOpen}
        onClose={() => setIsDuelLobbyOpen(false)}
        forests={localizedForests}
        initialForest={localizedSelectedForest}
        onStartDuelGame={handleStartDuelGame}
      />

      {/* Duel Victory Podium Modal */}
      {activeSession?.duelMatchCode && activeDuelMatch && (
        <DuelPodiumModal
          isOpen={isDuelPodiumOpen}
          match={activeDuelMatch}
          sessionCode={activeSession.code}
          onClose={() => setIsDuelPodiumOpen(false)}
        />
      )}

      {/* Explorer Passport & Downloadable Diploma Modal */}
      <ExplorerPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        forests={localizedForests}
        activeSession={activeSession}
        selectedForest={localizedSelectedForest}
        onOpenAlbum={() => {
          setIsPassportOpen(false);
          setIsAlbumModalOpen(true);
        }}
      />

      {/* Offline Pre-Departure Pack Manager Modal */}
      <OfflineManagerModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        forests={localizedForests}
      />

      {/* Expedition Field Photo Album Modal */}
      <ExpeditionPhotoAlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        forest={localizedSelectedForest || localizedForests[0]}
        forests={localizedForests}
        session={activeSession}
        currentPoi={
          activeSession && localizedSelectedForest
            ? localizedSelectedForest.pois.find((p) => p.id === activeSession.routePoiIds[activeSession.currentPoiIndex])
            : null
        }
        onOpenPassport={() => {
          setIsAlbumModalOpen(false);
          setIsPassportOpen(true);
        }}
      />

      {/* Printable Trail Beacons & Signpost QR Modal */}
      {printingForest && (
        <PrintableTrailBeaconsModal
          isOpen={Boolean(printingForest)}
          onClose={() => setPrintingForest(null)}
          forest={printingForest}
        />
      )}
      {/* Discreet Footer with subtle copyright & organizer trigger */}
      {currentView !== 'admin' && (
        <footer className="py-6 px-4 text-center text-[11px] text-stone-500 border-t border-emerald-950/80 bg-[#0E150F]">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>{t('app.title')}</span>
            <span>•</span>
            <span>{t('footer.subtitle') || 'Rutas y acertijos al aire libre'}</span>
            <span>•</span>
            <button
              type="button"
              onClick={handleOpenAdmin}
              className="text-stone-600 hover:text-stone-400 underline transition-colors cursor-pointer"
              title={t('footer.adminAccess') || 'Acceso organizador'}
            >
              {t('footer.adminAccess') || 'Acceso organizador'}
            </button>
          </p>
        </footer>
      )}
    </div>
  );
}
