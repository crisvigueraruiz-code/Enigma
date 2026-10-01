import fs from 'fs';
import path from 'path';

const howToPlayKeys = {
  "howToPlay_navButton": {
    "es": "¿Cómo se juega?",
    "fr": "Comment jouer ?",
    "en": "How to play?"
  },
  "howToPlay_title": {
    "es": "¿Cómo se juega a Enigma del Bosque?",
    "fr": "Comment jouer à l'Énigme de la Forêt ?",
    "en": "How to Play Forest Enigma?"
  },
  "howToPlay_subtitle": {
    "es": "Guía rápida de expedición y rastreo narrativo",
    "fr": "Guide rapide d'expédition et pistage narratif",
    "en": "Quick Expedition & Narrative Tracking Guide"
  },
  "howToPlay_intro": {
    "es": "Enigma del Bosque es un juego de rastreo narrativo al aire libre que combina senderismo real con geolocalización GPS, enigmas patrimoniales, realidad aumentada 3D y personajes interactivos con inteligencia artificial en tiempo real.",
    "fr": "L'Énigme de la Forêt est un jeu de pistage narratif en plein air combinant randonnée réelle avec géolocalisation GPS, énigmes patrimoniales, réalité augmentée 3D et personnages interactifs dotés d'intelligence artificielle en temps réel.",
    "en": "Forest Enigma is an outdoor narrative tracking game combining real hiking with GPS geolocation, heritage riddles, 3D augmented reality, and real-time AI conversational characters."
  },
  "howToPlay_step1Title": {
    "es": "1. Elige tu Bosque e Historia",
    "fr": "1. Choisis ta Forêt et ton Histoire",
    "en": "1. Choose your Forest & Story"
  },
  "howToPlay_step1Desc": {
    "es": "Selecciona entre Canéjan-Cestas (Gironde, Francia) o Nalda (La Rioja, España). Cada bosque cuenta con 4 historias distintas guiadas por personajes únicos: maquis de la Resistencia, molineros del siglo XIX, duendes de la ribera o cronistas medievales.",
    "fr": "Choisis entre Canéjan-Cestas (Gironde, France) ou Nalda (La Rioja, Espagne). Chaque forêt propose 4 histoires différentes guidées par des personnages uniques : maquisards de la Résistance, meuniers du XIXe, lutins ou chroniqueurs médiévaux.",
    "en": "Select between Canéjan-Cestas (Gironde, France) or Nalda (La Rioja, Spain). Each forest features 4 distinct stories guided by unique characters: Resistance maquis, 19th-century millers, woodland sprites, or medieval chroniclers."
  },
  "howToPlay_step2Title": {
    "es": "2. Personaliza tu Ruta",
    "fr": "2. Personnalise ton Parcours",
    "en": "2. Customize your Route"
  },
  "howToPlay_step2Desc": {
    "es": "Adapta la experiencia a tu ritmo: desde recorridos exprés de 30 minutos hasta expediciones completas de 2 horas. Elige tu nivel de desafío: Novato (ideal en familia), Explorador (equilibrado) o Maestro (acertijos avanzados).",
    "fr": "Adapte l'expérience à ton rythme : de parcours express de 30 minutes aux expéditions complètes de 2 heures. Choisis ton niveau : Novice (famille), Explorateur (équilibré) ou Maître (énigmes pointues).",
    "en": "Tailor the experience to your pace: from 30-minute express walks to 2-hour full expeditions. Choose your challenge level: Novice (family-friendly), Explorer (balanced), or Master (advanced riddles)."
  },
  "howToPlay_step3Title": {
    "es": "3. Sigue la Brújula y el Mapa GPS",
    "fr": "3. Suis la Boussole et la Carte GPS",
    "en": "3. Follow the Compass & GPS Map"
  },
  "howToPlay_step3Desc": {
    "es": "Camina por el sendero siguiendo la dirección y distancia en metros hacia el siguiente hito patrimonial (un molino, un roble bicentenario, un castillo o un eremitorio). Si estás probando desde casa, puedes activar el modo de GPS simulado.",
    "fr": "Marche sur le sentier en suivant la direction et la distance en mètres vers le prochain jalon patrimonial (un moulin, un chêne bicentenaire, un château ou des grottes). En cas d'essai à distance, active le mode GPS simulé.",
    "en": "Walk the trail following compass direction and distance in meters to the next heritage point (a mill, a bicentennial oak, a castle, or cave hermitages). When trying remotely, activate simulated GPS mode."
  },
  "howToPlay_step4Title": {
    "es": "4. Realidad Aumentada y Enigmas",
    "fr": "4. Réalité Augmentée et Énigmes",
    "en": "4. Augmented Reality & Riddles"
  },
  "howToPlay_step4Desc": {
    "es": "Al llegar al hito, observa el entorno real. Abre la Realidad Aumentada para ver reconstrucciones 3D (ruedas hidráulicas, cofres secretos, espíritus del bosque). Luego resuelve el enigma: preguntas de deducción, secuencias u observación.",
    "fr": "En arrivant sur le lieu, observe l'environnement. Ouvre la Réalité Augmentée pour contempler des modèles 3D (roues hydrauliques, coffres secrets, esprits sylvestres). Puis résous l'énigme : déduction, chronologie ou observation.",
    "en": "Upon arrival, observe your surroundings. Launch Augmented Reality to reveal 3D models (water wheels, secret chests, forest spirits). Then solve the location's riddle: deduction, sequencing, or keen observation."
  },
  "howToPlay_step5Title": {
    "es": "5. Habla con tu Guía por Voz (IA)",
    "fr": "5. Parle avec ton Guide à la Voix (IA)",
    "en": "5. Talk to your AI Voice Guide"
  },
  "howToPlay_step5Desc": {
    "es": "Pulsa el botón de conversación para hablar en directo por voz o texto con tu guía (impulsado por Gemini 3.8 Live). Puedes pedirle pistas sin que te dé la respuesta directa, consultarle detalles históricos o debatir curiosidades del bosque.",
    "fr": "Appuie sur l'icône de discussion pour échanger en direct à la voix ou à l'écrit avec ton guide (propulsé par Gemini 3.8 Live). Demande-lui des indices progressifs, des détails historiques ou partage tes théories.",
    "en": "Tap the chat icon to talk live by voice or text with your companion guide (powered by Gemini 3.8 Live). Ask for subtle progressive hints, explore historical lore, or share your theories."
  },
  "howToPlay_step6Title": {
    "es": "6. Resuelve el Meta-Enigma Final",
    "fr": "6. Résous le Méta-Enigme Final",
    "en": "6. Solve the Final Meta-Enigma"
  },
  "howToPlay_step6Desc": {
    "es": "Cada hito completado te recompensará con una letra o fragmento rúnico. Al terminar el recorrido, ensambla la palabra clave secreta (el sello NALDA o el códice ROBLE) para sellar el honor de tu equipo.",
    "fr": "Chaque étape franchie te rapporte une lettre ou une rune secrète. En fin de parcours, assemble le mot-clé sacré (le sceau NALDA ou le codex ROBLE) pour couronner la victoire de ton équipe.",
    "en": "Each completed waypoint awards a rune or secret letter. At the trail's end, assemble the sacred keyword (the NALDA seal or ROBLE codex) to crown your team's victory."
  },
  "howToPlay_tipsTitle": {
    "es": "Consejos para exploradores",
    "fr": "Conseils aux explorateurs",
    "en": "Tips for Explorers"
  },
  "howToPlay_tipBattery": {
    "es": "Batería: Lleva tu móvil cargado y el volumen activo para escuchar las narraciones sonoras y los audios ambientales.",
    "fr": "Batterie : Garde ton téléphone bien chargé et le son activé pour profiter des ambiances sonores et des voix.",
    "en": "Battery: Keep your phone charged and audio volume up to enjoy ambient soundscapes and character voices."
  },
  "howToPlay_tipNature": {
    "es": "Respeto a la naturaleza: No dejes basura, permanece en los senderos marcados y no recojas plantas ni dañes la cantería histórica.",
    "fr": "Respect de la nature : Ne laisse aucun déchet, reste sur les sentiers balisés et respecte la faune, la flore et les vieilles pierres.",
    "en": "Respect nature: Leave no trash behind, stay on marked trails, and never harm wildlife, plants, or historical stonework."
  },
  "howToPlay_tipTeam": {
    "es": "Juego en equipo: Puedes jugar en familia o con amigos debatiendo juntos cada enigma antes de responder.",
    "fr": "En équipe : Joue en famille ou entre amis en partageant les énigmes à voix haute avant de valider vos réponses.",
    "en": "Team play: Play with family or friends by discussing clues aloud before submitting each answer."
  },
  "howToPlay_close": {
    "es": "¡Entendido, a explorar!",
    "fr": "Compris, en route !",
    "en": "Got it, let's explore!"
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

  for (const [k, v] of Object.entries(howToPlayKeys)) {
    data.keys[k] = v;
    data.ui.es[k] = v.es;
    data.ui.fr[k] = v.fr;
    data.ui.en[k] = v.en;
  }

  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Saved howToPlay keys to:', p);
}
