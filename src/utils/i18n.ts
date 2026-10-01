import i18nData from '../data/i18n.json';
import { ForestPack, WindmillPOI, StoryIntro, Riddle } from '../types';

export type SupportedLanguage = 'fr' | 'es' | 'en';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

/**
 * Get UI translated string by key with fallback to forest default language and then 'es'.
 */
export function t(
  key: string,
  lang: string = 'es',
  params?: Record<string, string | number>,
  defaultLangFallback: string = 'es'
): string {
  const ui = (i18nData as any).ui || {};
  const keys = (i18nData as any).keys || {};
  
  let text =
    ui[lang]?.[key] ||
    keys[key]?.[lang] ||
    ui[defaultLangFallback]?.[key] ||
    keys[key]?.[defaultLangFallback] ||
    ui['es']?.[key] ||
    keys[key]?.['es'] ||
    key;

  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }
  return text;
}

/**
 * Get localized ForestPack based on chosen language.
 * Falls back to forest.defaultLanguage, then to base Spanish data.
 */
export function getLocalizedForest(forest: ForestPack, lang: string): ForestPack {
  if (!forest) return forest;

  const targetLang = (lang as SupportedLanguage) || (forest.defaultLanguage as SupportedLanguage) || 'es';
  const forestI18n = (i18nData as any).forests?.[forest.id];
  const keys = (i18nData as any).keys || {};

  const translateKey = (k?: string, fallbackVal?: string): string => {
    if (!k) return fallbackVal || '';
    return t(k, targetLang, undefined, forest.defaultLanguage || 'es');
  };

  // Localize POIs
  const localizedPois: WindmillPOI[] = forest.pois.map((poi) => {
    const poiTrans = forestI18n?.[targetLang]?.pois?.[poi.id];
    const name = poiTrans?.name || (poi.nameKey ? translateKey(poi.nameKey, poi.name) : poi.name);
    const description = poiTrans?.description || (poi.descriptionKey ? translateKey(poi.descriptionKey, poi.description) : poi.description);
    const clueSnippet = poi.clueSnippetKey ? translateKey(poi.clueSnippetKey, poi.clueSnippet) : poi.clueSnippet;
    
    let arAsset = poi.arAsset;
    if (arAsset) {
      const arTitle = arAsset.titleKey ? translateKey(arAsset.titleKey, arAsset.title) : arAsset.title;
      const arDesc = arAsset.descriptionKey ? translateKey(arAsset.descriptionKey, arAsset.description) : arAsset.description;
      arAsset = {
        ...arAsset,
        title: arTitle,
        label: arTitle || arAsset.label,
        description: arDesc,
      };
    }

    return {
      ...poi,
      name,
      description,
      clueSnippet,
      arAsset,
    };
  });

  // Localize Stories
  const localizedStories: StoryIntro[] = forest.stories.map((story) => {
    const storyTrans = forestI18n?.[targetLang]?.stories?.[story.id];
    const title = storyTrans?.title || (story.titleKey ? translateKey(story.titleKey, story.title) : story.title);
    const summary = storyTrans?.summary || (story.summaryKey ? translateKey(story.summaryKey, story.summary) : (story.guide?.personaKey ? translateKey(story.guide.personaKey, story.summary) : story.summary));
    const narrative = story.narrativeKey ? translateKey(story.narrativeKey, story.narrative) : story.narrative;
    const mission = storyTrans?.mission || (story.missionKey ? translateKey(story.missionKey, story.mission) : story.mission);
    const greeting = story.characterGreetingKey
      ? translateKey(story.characterGreetingKey, story.characterGreeting)
      : (story.guide?.greetingKey ? translateKey(story.guide.greetingKey, story.characterGreeting) : story.characterGreeting);

    const narratorName = story.narratorNameKey
      ? translateKey(story.narratorNameKey, story.narratorName || story.narrator?.name)
      : (storyTrans?.narrator?.name || story.narratorName || story.narrator?.name || '');
    const narratorRole = story.narratorRoleKey
      ? translateKey(story.narratorRoleKey, story.narratorRole || story.narrator?.role)
      : (storyTrans?.narrator?.role || story.narratorRole || story.narrator?.role || '');
    const narratorTone = story.narratorToneKey
      ? translateKey(story.narratorToneKey, story.narratorTone || story.narrator?.tone)
      : (storyTrans?.narrator?.tone || story.narratorTone || story.narrator?.tone || '');
    const characterBio = story.characterBioKey
      ? translateKey(story.characterBioKey, story.characterBio)
      : story.characterBio;

    return {
      ...story,
      title,
      summary,
      narrative,
      mission,
      characterGreeting: greeting,
      narratorName,
      narratorRole,
      narratorTone,
      characterBio,
      narrator: {
        name: narratorName,
        role: narratorRole,
        tone: narratorTone,
        avatarEmoji: story.narratorAvatar || story.narrator?.avatarEmoji || '',
        ttsVoice: story.voiceName || story.narrator?.ttsVoice || 'Zephyr',
      },
    };
  });

  // Localize Riddles
  const localizedRiddles: Riddle[] = forest.riddles.map((riddle) => {
    const rTrans = forestI18n?.[targetLang]?.riddles?.[riddle.id];
    let question = rTrans?.question || (riddle.questionKey ? translateKey(riddle.questionKey, riddle.question) : riddle.question);
    if (riddle.descriptionKey) {
      question = translateKey(riddle.descriptionKey, question);
    }
    const name = rTrans?.name || (riddle.nameKey ? translateKey(riddle.nameKey, riddle.name) : (riddle.titleKey ? translateKey(riddle.titleKey, riddle.name) : riddle.name));

    let options = riddle.options;
    if (rTrans?.options) {
      options = [...rTrans.options];
    } else if (riddle.optionsKeys && riddle.optionsKeys.length > 0) {
      options = riddle.optionsKeys.map((ok) => translateKey(ok));
    }

    let hints = riddle.hints;
    if (rTrans?.hints) {
      hints = [...rTrans.hints];
    } else if (riddle.hintsKeys && riddle.hintsKeys.length > 0) {
      hints = riddle.hintsKeys.map((hk) => translateKey(hk));
    }

    let answer = rTrans?.answer || riddle.answer;
    if (riddle.optionsKeys && riddle.correctIndex !== undefined && options && options[riddle.correctIndex]) {
      answer = options[riddle.correctIndex];
    } else if (riddle.answersKeys && riddle.answersKeys.length > 0) {
      answer = translateKey(riddle.answersKeys[0], riddle.answer);
    }

    let acceptedAnswers = rTrans?.acceptedAnswers || riddle.acceptedAnswers;
    if (riddle.answersKeys && riddle.answersKeys.length > 0) {
      acceptedAnswers = riddle.answersKeys.map((ak) => translateKey(ak));
    }

    return {
      ...riddle,
      name,
      question,
      options,
      answer,
      acceptedAnswers,
      hints,
    };
  });

  const forestName = forestI18n?.[targetLang]?.name || (forest.nameKey ? translateKey(forest.nameKey, forest.name) : forest.name);
  const forestDesc = forestI18n?.[targetLang]?.description || (forest.descriptionKey ? translateKey(forest.descriptionKey, forest.description) : forest.description);
  
  let forestCountry = forestI18n?.[targetLang]?.country || (forest.countryKey ? translateKey(forest.countryKey, forest.country) : undefined);
  if (!forestCountry) {
    if (forest.id === 'bosque-canejan-cestas') {
      forestCountry = targetLang === 'es' ? 'Francia (Gironde)' : 'France (Gironde)';
    } else if (forest.id === 'nalda') {
      forestCountry = targetLang === 'fr' ? 'Espagne (La Rioja)' : targetLang === 'en' ? 'Spain (La Rioja)' : 'España (La Rioja)';
    } else {
      forestCountry = forest.country;
    }
  }

  const localizedSceneNarratives: Record<string, string> = {};
  if (forest.sceneNarratives) {
    for (const [k, val] of Object.entries(forest.sceneNarratives)) {
      localizedSceneNarratives[k] = translateKey(k, val) || val;
    }
  }

  return {
    ...forest,
    name: forestName,
    country: forestCountry,
    description: forestDesc,
    pois: localizedPois,
    stories: localizedStories,
    riddles: localizedRiddles,
    sceneNarratives: localizedSceneNarratives,
    metaEnigma: forest.metaEnigma
      ? {
          ...forest.metaEnigma,
          title: forest.metaEnigma.titleKey ? translateKey(forest.metaEnigma.titleKey, forest.metaEnigma.title) : (forestI18n?.[targetLang]?.metaEnigma?.title || forest.metaEnigma.title),
          description: forest.metaEnigma.descriptionKey ? translateKey(forest.metaEnigma.descriptionKey, forest.metaEnigma.description) : (forestI18n?.[targetLang]?.metaEnigma?.description || forest.metaEnigma.description),
        }
      : undefined,
  };
}

/**
 * Fisher-Yates shuffle that guarantees not returning original order if length > 1
 */
export function shuffleArray<T>(items: T[]): T[] {
  if (!items || items.length <= 1) return items ? [...items] : [];
  const array = [...items];
  
  // Try up to 5 times to ensure it's actually shuffled
  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    // Check if distinct from original
    const isDifferent = array.some((val, idx) => val !== items[idx]);
    if (isDifferent) break;
  }
  return array;
}
