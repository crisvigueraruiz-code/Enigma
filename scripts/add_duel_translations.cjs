const fs = require('fs');
const path = require('path');

const p1 = path.join(__dirname, '../src/data/i18n.json');
const p2 = path.join(__dirname, '../i18n.json');

const d1 = JSON.parse(fs.readFileSync(p1, 'utf-8'));
const d2 = JSON.parse(fs.readFileSync(p2, 'utf-8'));

const duelTranslations = {
  "duel.navButton": {
    es: "Batalla Silenciosa",
    fr: "Combat Silencieux",
    en: "Silent Battle"
  },
  "duel.title": {
    es: "Modo Equipos / Batalla Silenciosa",
    fr: "Mode Équipes / Combat Silencieux",
    en: "Team Mode / Silent Battle"
  },
  "duel.subtitle": {
    es: "Dos equipos recorren el bosque en tiempo real. Sigue el rastro del rival en el mapa, mantén el sigilo y usa tácticas del bosque.",
    fr: "Deux équipes parcourent la forêt en temps réel. Suivez la trace rivale sur la carte, restez discret et utilisez les ruses de la forêt.",
    en: "Two teams explore the forest in real time. Track the rival team on the map, maintain stealth, and unleash forest tactics."
  },
  "duel.heroBadge": {
    es: "Multijugador Silencioso en Tiempo Real",
    fr: "Multijoueur Silencieux en Temps Réel",
    en: "Real-Time Silent Multiplayer"
  },
  "duel.createTab": {
    es: "Crear Sala de Duelo",
    fr: "Créer une Salle de Duel",
    en: "Create Duel Room"
  },
  "duel.joinTab": {
    es: "Unirse con Código",
    fr: "Rejoindre avec Code",
    en: "Join with Code"
  },
  "duel.selectForest": {
    es: "Bosque de la Batalla",
    fr: "Forêt du Combat",
    en: "Battle Forest"
  },
  "duel.selectStory": {
    es: "Sendero / Aventura",
    fr: "Sentier / Aventure",
    en: "Trail / Story"
  },
  "duel.teamNameLabel": {
    es: "Nombre de tu Equipo",
    fr: "Nom de votre Équipe",
    en: "Your Team Name"
  },
  "duel.teamNamePlaceholder": {
    es: "Ej. Los Lobos del Iregua",
    fr: "Ex. Les Loups d'Iregua",
    en: "E.g. The Iregua Wolves"
  },
  "duel.teamEmblemLabel": {
    es: "Emblema del Equipo",
    fr: "Emblème de l'Équipe",
    en: "Team Emblem"
  },
  "duel.matchCodeLabel": {
    es: "Código de Batalla",
    fr: "Code de Combat",
    en: "Battle Code"
  },
  "duel.matchCodePlaceholder": {
    es: "Ej. DUEL-48",
    fr: "Ex. DUEL-48",
    en: "E.g. DUEL-48"
  },
  "duel.createBtn": {
    es: "Crear Batalla y Esperar Rival",
    fr: "Créer le Combat et Attendre",
    en: "Create Battle & Wait"
  },
  "duel.startSoloDuelBtn": {
    es: "Desafiar al Guardián Fantasma (IA)",
    fr: "Défier le Gardien Fantôme (IA)",
    en: "Challenge Ghost Guardian (AI)"
  },
  "duel.startSoloDuelDesc": {
    es: "¿No tienes rival presencial? Juega contra un equipo fantasma que recorre el bosque a ritmo real.",
    fr: "Pas de rival sur place ? Jouez contre une équipe fantôme qui parcourt la forêt à rythme réel.",
    en: "No rival nearby? Play against a phantom team navigating the forest at a realistic pace."
  },
  "duel.joinBtn": {
    es: "Unirse a la Batalla",
    fr: "Rejoindre le Combat",
    en: "Join Battle"
  },
  "duel.waitingRival": {
    es: "Sala creada. Esperando al equipo rival...",
    fr: "Salle créée. En attente de l'équipe rivale...",
    en: "Room created. Waiting for rival team..."
  },
  "duel.shareCodePrompt": {
    es: "Comparte este código con el otro equipo para comenzar la expedición:",
    fr: "Partagez ce code avec l'autre équipe pour commencer l'expédition :",
    en: "Share this code with the other team to begin the expedition:"
  },
  "duel.copyCode": {
    es: "Copiar Código",
    fr: "Copier le Code",
    en: "Copy Code"
  },
  "duel.copied": {
    es: "¡Copiado al portapapeles!",
    fr: "Copié dans le presse-papier !",
    en: "Copied to clipboard!"
  },
  "duel.stealthAlert": {
    es: "⚠️ ¡RIVAL A MENOS DE 60 METROS! Mantened el sigilo en el sendero...",
    fr: "⚠️ RIVAL À MOINS DE 60 MÈTRES ! Restez silencieux sur le sentier...",
    en: "⚠️ RIVAL WITHIN 60 METERS! Maintain stealth on the trail..."
  },
  "duel.radarStealth": {
    es: "Radar Silencioso",
    fr: "Radar Silencieux",
    en: "Silent Radar"
  },
  "duel.distanceToRival": {
    es: "Distancia al rival",
    fr: "Distance au rival",
    en: "Distance to rival"
  },
  "duel.powerFog": {
    es: "Niebla Mística",
    fr: "Brouillard Mystique",
    en: "Mystic Fog"
  },
  "duel.powerFogDesc": {
    es: "Empaña la brújula y el radar del rival durante 30s",
    fr: "Brouille la boussole et le radar rival pendant 30s",
    en: "Blurs rival compass & radar for 30s"
  },
  "duel.powerWhisper": {
    es: "Susurro del Búho",
    fr: "Chuchotement du Hibou",
    en: "Owl's Whisper"
  },
  "duel.powerWhisperDesc": {
    es: "Revela las coordenadas y el próximo hito del rival",
    fr: "Révèle les coordonnées et le prochain repère rival",
    en: "Reveals coordinates and next rival waypoint"
  },
  "duel.powerEcho": {
    es: "Eco del Bosque",
    fr: "Écho de la Forêt",
    en: "Forest Echo"
  },
  "duel.powerEchoDesc": {
    es: "Envía un crujido misterioso al teléfono rival",
    fr: "Envoie un craquement mystérieux au téléphone rival",
    en: "Sends an eerie branch crack to rival phone"
  },
  "duel.actionReady": {
    es: "Disponible",
    fr: "Disponible",
    en: "Ready"
  },
  "duel.actionUsed": {
    es: "¡Invocado!",
    fr: "Invoqué !",
    en: "Cast!"
  },
  "duel.fogActiveOnYou": {
    es: "🌫️ ¡El equipo rival ha invocado Niebla Mística sobre vuestra senda!",
    fr: "🌫️ L'équipe rivale a invoqué un Brouillard Mystique sur votre sentier !",
    en: "🌫️ The rival team summoned Mystic Fog upon your trail!"
  },
  "duel.echoHeard": {
    es: "🍃 ¡Un crujido resuena en las ramas! El rival os vigila de cerca...",
    fr: "🍃 Un craquement résonne dans les branches ! Le rival vous observe...",
    en: "🍃 A snap echoes in the branches! The rival is watching you closely..."
  },
  "duel.podiumTitle": {
    es: "Veredicto de la Batalla Silenciosa",
    fr: "Verdict du Combat Silencieux",
    en: "Silent Battle Verdict"
  },
  "duel.winnerTitle": {
    es: "👑 ¡VICTORIA DE LA SENDA!",
    fr: "👑 VICTOIRE DU SENTIER !",
    en: "👑 TRAIL VICTORY!"
  },
  "duel.defeatedTitle": {
    es: "Honorables Exploradores",
    fr: "Honorables Explorateurs",
    en: "Honorable Explorers"
  },
  "duel.winnerDesc": {
    es: "Vuestro equipo ha demostrado mayor perspicacia y maestría en el bosque.",
    fr: "Votre équipe a fait preuve d'une plus grande perspicacité et maîtrise de la forêt.",
    en: "Your team demonstrated greater cunning and mastery of the forest."
  },
  "duel.liveBadge": {
    es: "DUELO EN VIVO",
    fr: "DUEL EN DIRECT",
    en: "LIVE DUEL"
  },
  "duel.battleFeed": {
    es: "Diario del Duelo",
    fr: "Journal du Duel",
    en: "Battle Log"
  },
  "duel.noEventsYet": {
    es: "La expedición acaba de comenzar. ¡Avanzad hacia el primer hito!",
    fr: "L'expédition vient de commencer. Avancez vers le premier repère !",
    en: "The expedition has just begun. Advance towards the first waypoint!"
  },
  "duel.you": {
    es: "Tu Equipo",
    fr: "Votre Équipe",
    en: "Your Team"
  },
  "duel.rival": {
    es: "Equipo Rival",
    fr: "Équipe Rivale",
    en: "Rival Team"
  },
  "duel.poisCompleted": {
    es: "Hitos Conquistados",
    fr: "Repères Conquis",
    en: "Waypoints Conquered"
  },
  "duel.viewIntel": {
    es: "Ver Inteligencia del Duelo",
    fr: "Voir l'Espionnage du Duel",
    en: "View Duel Intel"
  },
  "duel.close": {
    es: "Cerrar",
    fr: "Fermer",
    en: "Close"
  }
};

for (const [key, trans] of Object.entries(duelTranslations)) {
  for (const lang of ['es', 'fr', 'en']) {
    if (!d1.ui[lang]) d1.ui[lang] = {};
    if (!d2.ui[lang]) d2.ui[lang] = {};
    d1.ui[lang][key] = trans[lang];
    d2.ui[lang][key] = trans[lang];
  }
  if (!d1.keys) d1.keys = {};
  if (!d2.keys) d2.keys = {};
  d1.keys[key] = trans;
  d2.keys[key] = trans;
}

fs.writeFileSync(p1, JSON.stringify(d1, null, 2), 'utf-8');
fs.writeFileSync(p2, JSON.stringify(d2, null, 2), 'utf-8');
console.log('Successfully added duel translations. Total keys in ES:', Object.keys(d1.ui.es).length);
