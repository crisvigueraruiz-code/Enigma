import React from 'react';
import { Trees, Compass, ArrowLeft, PauseCircle, HelpCircle, Swords, BookOpen, Download, Camera } from 'lucide-react';
import { AmbientAudioControl } from './AmbientAudioControl';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '../context/I18nContext';

interface NavbarProps {
  currentView: 'home' | 'game' | 'admin';
  sessionCode?: string;
  points?: number;
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  isAdminAuthenticated?: boolean;
  onLogoutAdmin?: () => void;
  simulatedGps: boolean;
  onToggleSimulatedGps: () => void;
  onOpenPauseModal?: () => void;
  onOpenHowToPlay?: () => void;
  onOpenDuelLobby?: () => void;
  onOpenPassport?: () => void;
  onOpenOffline?: () => void;
  onOpenAlbum?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  sessionCode,
  points,
  onNavigateHome,
  onOpenAdmin,
  isAdminAuthenticated = false,
  onLogoutAdmin,
  simulatedGps,
  onToggleSimulatedGps,
  onOpenPauseModal,
  onOpenHowToPlay,
  onOpenDuelLobby,
  onOpenPassport,
  onOpenOffline,
  onOpenAlbum,
}) => {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-[#162218]/95 backdrop-blur-md border-b border-[#2D4530] text-stone-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-green-900 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Trees className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-adventure text-base md:text-xl font-bold tracking-wide text-amber-100 flex items-center gap-1.5 leading-tight">
              {t('app.title')}
            </h1>
            <p className="text-[10px] text-emerald-400/80 hidden sm:block tracking-wider font-medium uppercase">
              {t('home.heroBadge')}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* FR · ES · EN Language Selector Always Visible */}
          <LanguageSelector />

          {/* Unified Expedition Utilities Dock */}
          <nav className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-stone-900/70 border border-emerald-800/40 backdrop-blur-md shadow-md" aria-label="Herramientas rápidas">
            {/* Batalla Silenciosa (Duelo) Trigger */}
            {onOpenDuelLobby && (
              <button
                type="button"
                onClick={onOpenDuelLobby}
                title={t('duel.title')}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/70 to-amber-900/40 hover:from-amber-900/80 hover:to-amber-800/60 text-amber-200 hover:text-white font-adventure text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{t('duel.navButton')}</span>
              </button>
            )}

            {/* Pasaporte de Explorador & Diplomas Trigger */}
            {onOpenPassport && (
              <button
                type="button"
                onClick={onOpenPassport}
                title={t('passport.title')}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-xl border border-emerald-700/40 bg-[#16251A]/60 hover:bg-[#1F3424] text-stone-200 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">{t('passport.navButton')}</span>
              </button>
            )}

            {/* Descarga Offline Completa Trigger */}
            {onOpenOffline && (
              <button
                type="button"
                onClick={onOpenOffline}
                title={t('offline.title')}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-xl border border-emerald-700/40 bg-[#16251A]/60 hover:bg-[#1F3424] text-stone-200 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-teal-300" />
                <span className="hidden xl:inline">{t('offline.navButton')}</span>
              </button>
            )}

            {/* Álbum de Fotos de Campo Trigger */}
            {onOpenAlbum && (
              <button
                type="button"
                onClick={onOpenAlbum}
                title={t('album.title')}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-xl border border-emerald-700/40 bg-[#16251A]/60 hover:bg-[#1F3424] text-stone-200 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xl:inline">{t('album.navButton')}</span>
              </button>
            )}

            {/* How to Play Guide Modal Trigger */}
            {onOpenHowToPlay && (
              <button
                type="button"
                onClick={onOpenHowToPlay}
                title={t('howToPlay_title')}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-xl border border-emerald-700/40 bg-[#16251A]/60 hover:bg-[#1F3424] text-stone-200 hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xl:inline">{t('howToPlay_navButton')}</span>
              </button>
            )}

            {/* Audio toggle & Ambient Soundscape Control */}
            <div className="pl-0.5 border-l border-emerald-800/40">
              <AmbientAudioControl variant="compact" />
            </div>
          </nav>

          {currentView === 'game' && sessionCode && (
            <div className="hidden xs:flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-2 py-1">
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                {sessionCode}
              </span>
              {typeof points === 'number' && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1 py-0.5 rounded border border-amber-500/30">
                  {points}p
                </span>
              )}
            </div>
          )}

          {/* GPS Simulation Toggle for outdoor test */}
          {currentView === 'game' && (
            <button
              onClick={onToggleSimulatedGps}
              title={simulatedGps ? t('nav.gpsSimulated') : t('nav.gpsReal')}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg border font-medium transition-all ${
                simulatedGps
                  ? 'bg-amber-950/50 border-amber-600/40 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-emerald-950/50 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${simulatedGps ? 'text-amber-400' : 'text-emerald-400 animate-spin-slow'}`} />
              <span className="hidden md:inline">{simulatedGps ? t('nav.gpsSimulated') : t('nav.gpsReal')}</span>
            </button>
          )}

          {/* Pause / Leave Game button */}
          {currentView === 'game' && onOpenPauseModal && (
            <button
              onClick={onOpenPauseModal}
              title={t('pause.title')}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-amber-600/50 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 hover:text-white font-semibold transition-all shadow-sm active:scale-95"
            >
              <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{t('nav.pause')}</span>
            </button>
          )}

          {/* Audio toggle & Ambient Soundscape Control */}
          <AmbientAudioControl variant="compact" />

          {/* Admin Header Controls (only shown when in admin view) */}
          {currentView === 'admin' && (
            <div className="flex items-center gap-1.5">
              {onLogoutAdmin && (
                <button
                  onClick={onLogoutAdmin}
                  title={t('nav.adminExit')}
                  className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:text-red-300 transition-colors"
                >
                  {t('nav.adminExit')}
                </button>
              )}
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-white transition-all shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.back')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
