import fs from 'fs';
import path from 'path';

const additionalKeys = {
  "home.statPoisCount": {
    "es": "Hitos POI",
    "fr": "Jalons POI",
    "en": "POI Landmarks"
  },
  "home.statStoriesCount": {
    "es": "Historias",
    "fr": "Histoires",
    "en": "Stories"
  },
  "home.statRiddlesCount": {
    "es": "Enigmas",
    "fr": "Énigmes",
    "en": "Riddles"
  },
  "home.storiesListTitle": {
    "es": "Historias ({count}):",
    "fr": "Histoires ({count}) :",
    "en": "Stories ({count}):"
  },
  "home.enterForestBtn": {
    "es": "Entrar al Bosque",
    "fr": "Entrer dans la Forêt",
    "en": "Enter Forest"
  },
  "home.territoriesReady": {
    "es": "{count} territorios listos",
    "fr": "{count} territoires prêts",
    "en": "{count} territories ready"
  },
  "home.howTitle": {
    "es": "¿Cómo se juega a Enigma del Bosque?",
    "fr": "Comment jouer à l'Énigme de la Forêt ?",
    "en": "How to Play Forest Enigma?"
  },
  "home.howSubtitle": {
    "es": "Una experiencia pensada para disfrutar al aire libre en familia, con amigos o en solitario.",
    "fr": "Une expérience conçue pour profiter du plein air en famille, entre amis ou en solo.",
    "en": "An experience designed for enjoying the outdoors with family, friends, or solo."
  },
  "home.howStep1Title": {
    "es": "Elige Bosque e Historia",
    "fr": "Choisis Forêt et Histoire",
    "en": "Choose Forest & Story"
  },
  "home.howStep1Desc": {
    "es": "Selecciona tu sendero favorito, la duración del paseo (30min a 2h) y tu nivel de desafío.",
    "fr": "Sélectionne ton sentier favori, la durée de la balade (30 min à 2 h) et ton niveau de défi.",
    "en": "Select your favorite trail, walk duration (30min to 2h), and challenge level."
  },
  "home.howStep2Title": {
    "es": "Camina con GPS Real",
    "fr": "Marche avec le GPS Réel",
    "en": "Hike with Real GPS"
  },
  "home.howStep2Desc": {
    "es": "Sigue la brújula y el mapa interactivo. Los hitos se desbloquean al aproximarte físicamente.",
    "fr": "Suis la boussole et la carte interactive. Les jalons se déverrouillent quand tu t'approches physiquement.",
    "en": "Follow the compass and interactive map. Landmarks unlock as you physically approach."
  },
  "home.howStep3Title": {
    "es": "Habla con tu Guía IA",
    "fr": "Échange avec ton Guide IA",
    "en": "Talk to your AI Guide"
  },
  "home.howStep3Desc": {
    "es": "Conversa por voz o chat en vivo con tu personaje, pide pistas sensoriales y admira reliquias en RA.",
    "fr": "Discute à la voix ou par chat en direct avec ton personnage, demande des indices et admire des reliques en RA.",
    "en": "Chat live by voice or text with your character, ask for sensory hints, and admire relics in AR."
  },
  "home.howStep4Title": {
    "es": "Meta-Enigma Final",
    "fr": "Méta-Énigme Final",
    "en": "Final Meta-Enigma"
  },
  "home.howStep4Desc": {
    "es": "Reúne las letras o runas místicas de cada hito para descifrar la clave final y obtener tu diploma.",
    "fr": "Rassemble les lettres ou runes mystiques de chaque jalon pour déchiffrer le mot final et obtenir ton diplôme.",
    "en": "Gather the mystic letters or runes from each waypoint to decipher the final keyword and earn your diploma."
  },
  "characters.allFilter": {
    "es": "Todos ({count})",
    "fr": "Tous ({count})",
    "en": "All ({count})"
  },
  "characters.talkBtn": {
    "es": "Hablar por Voz / Chat",
    "fr": "Parler à la Voix / Chat",
    "en": "Talk via Voice / Chat"
  },
  "characters.stopVoice": {
    "es": "Detener voz",
    "fr": "Arrêter la voix",
    "en": "Stop voice"
  },
  "characters.listenGreeting": {
    "es": "Escuchar saludo con voz",
    "fr": "Écouter le message vocal",
    "en": "Listen to voice greeting"
  },
  "characters.playWithChar": {
    "es": "Jugar con este personaje en su historia",
    "fr": "Jouer con ce personaje dans son histoire",
    "en": "Play with this character in their story"
  }
};

const paths = [
  path.resolve('src/data/i18n.json'),
  path.resolve('i18n.json')
];

for (const p of paths) {
  if (!fs.existsSync(p)) continue;
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  if (!data.keys) data.keys = {};
  if (!data.ui) data.ui = { es: {}, fr: {}, en: {} };

  for (const [k, v] of Object.entries(additionalKeys)) {
    data.keys[k] = v;
    data.ui.es[k] = v.es;
    data.ui.fr[k] = v.fr;
    data.ui.en[k] = v.en;
  }

  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Added additional keys to:', p);
}
