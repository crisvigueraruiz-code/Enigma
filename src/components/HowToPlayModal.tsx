import React, { useEffect } from 'react';
import {
  X,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Award,
  BatteryCharging,
  Leaf,
  Users,
  HelpCircle,
  Footprints
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      icon: MapPin,
      color: 'emerald',
      title: t('howToPlay_step1Title'),
      desc: t('howToPlay_step1Desc'),
    },
    {
      num: 2,
      icon: Clock,
      color: 'amber',
      title: t('howToPlay_step2Title'),
      desc: t('howToPlay_step2Desc'),
    },
    {
      num: 3,
      icon: Compass,
      color: 'teal',
      title: t('howToPlay_step3Title'),
      desc: t('howToPlay_step3Desc'),
    },
    {
      num: 4,
      icon: Sparkles,
      color: 'purple',
      title: t('howToPlay_step4Title'),
      desc: t('howToPlay_step4Desc'),
    },
    {
      num: 5,
      icon: MessageSquare,
      color: 'blue',
      title: t('howToPlay_step5Title'),
      desc: t('howToPlay_step5Desc'),
    },
    {
      num: 6,
      icon: Award,
      color: 'amber',
      title: t('howToPlay_step6Title'),
      desc: t('howToPlay_step6Desc'),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#18281B] to-[#0F1811] border border-emerald-700/40 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-200 space-y-6 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-emerald-800/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2
                id="how-to-play-title"
                className="font-adventure text-xl sm:text-2xl font-bold text-amber-100 leading-snug"
              >
                {t('howToPlay_title')}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-400/90 font-medium">
                {t('howToPlay_subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-700/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-stone-300 leading-relaxed flex items-start gap-3">
          <Footprints className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p>{t('howToPlay_intro')}</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-stone-900/60 border border-emerald-900/30 rounded-xl p-3.5 sm:p-4 space-y-2 hover:border-emerald-700/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                    <Icon className="w-4 h-4 text-emerald-300" />
                  </div>
                  <h3 className="font-adventure text-sm font-bold text-amber-100 leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed pl-1">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tips section */}
        <div className="space-y-2.5 border-t border-emerald-900/40 pt-4">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-300/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('howToPlay_tipsTitle')}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-300">
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2.5 flex items-start gap-2">
              <BatteryCharging className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{t('howToPlay_tipBattery')}</p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2.5 flex items-start gap-2">
              <Leaf className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{t('howToPlay_tipNature')}</p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2.5 flex items-start gap-2">
              <Users className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{t('howToPlay_tipTeam')}</p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-adventure text-sm font-bold tracking-wider shadow-lg shadow-emerald-950/80 active:scale-95 transition-all text-center min-h-[44px]"
          >
            {t('howToPlay_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
