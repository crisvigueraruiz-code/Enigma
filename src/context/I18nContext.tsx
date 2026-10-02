import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportedLanguage, t as translateKey, getLocalizedForest } from '../utils/i18n';
import { ForestPack } from '../types';

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  localizeForest: (forest: ForestPack) => ForestPack;
  onForestSelected: (forest: ForestPack) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial state: defaults to saved lang or 'es'
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('enigma_lang');
      if (saved === 'fr' || saved === 'es' || saved === 'en') {
        return saved;
      }
    } catch (e) {}
    return 'es';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('enigma_lang', lang);
      localStorage.setItem('enigma_lang_user_chosen', 'true');
      const activeCode = localStorage.getItem('enigma_active_session');
      if (activeCode) {
        fetch(`/api/sessions/${activeCode}/language`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang }),
        }).catch(() => {});
      }
    } catch (e) {}
  };

  /**
   * Only suggest forest default language if the user has NOT explicitly chosen a language
   */
  const onForestSelected = (forest: ForestPack) => {
    if (!forest) return;
    try {
      const isUserChosen = localStorage.getItem('enigma_lang_user_chosen');
      if (!isUserChosen) {
        const forestDefLang = (forest.defaultLanguage as SupportedLanguage) || 'es';
        if (forestDefLang === 'fr' || forestDefLang === 'es' || forestDefLang === 'en') {
          setCurrentLanguageState(forestDefLang);
          localStorage.setItem('enigma_lang', forestDefLang);
        }
      }
    } catch (e) {}
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return translateKey(key, currentLanguage, params);
  };

  const localizeForest = (forest: ForestPack): ForestPack => {
    return getLocalizedForest(forest, currentLanguage);
  };

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      t,
      localizeForest,
      onForestSelected,
    }),
    [currentLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
