import fs from 'fs';
import path from 'path';

// Load missing i18n keys for meta_enigma_canejan and bridge phrases
const extraI18nKeys = {
  "meta_enigma_canejan_title": {
    "es": "El Códice del Roble Antiguo",
    "fr": "Le Codex du Chêne Antique",
    "en": "The Codex of the Ancient Oak"
  },
  "meta_enigma_canejan_description": {
    "es": "Reúne las 5 letras de la palabra sagrada ROBLE escondidas a lo largo del río Eau Bourde.",
    "fr": "Rassemble les 5 lettres du mot sacré ROBLE cachées le long de l'Eau Bourde.",
    "en": "Gather the 5 letters of the sacred word ROBLE hidden along the Eau Bourde river."
  },
  "meta_enigma_canejan_hint": {
    "es": "El árbol rey del bosque bordelés que resiste al tiempo.",
    "fr": "L'arbre roi de la forêt bordelaise qui résiste au temps.",
    "en": "The king tree of the Bordeaux forest that withstands time."
  },
  "meta_enigma_canejan_success": {
    "es": "¡Has descifrado la palabra sagrada ROBLE! El bosque de Canéjan-Cestas te reconoce como su protector.",
    "fr": "Tu as déchiffré le mot sacré ROBLE ! La forêt de Canéjan-Cestas te reconnaît comme son protecteur.",
    "en": "You have deciphered the sacred word ROBLE! The Canéjan-Cestas forest recognizes you as its protector."
  },
  "bridge_moulin_ruisseau": {
    "es": "Sigue la ribera dejando atrás las muelas hasta alcanzar el remanso del arroyo.",
    "fr": "Longe la rive en laissant les meules derrière toi jusqu'au remous du ruisseau.",
    "en": "Follow the bank leaving the millstones behind until reaching the brook's calm water."
  },
  "bridge_ruisseau_chene": {
    "es": "Cruza entre los alisos hacia el claro donde se alza el roble centenario.",
    "fr": "Franchis les aulnes vers la clairière où se dresse le chêne centenaire.",
    "en": "Pass through the alders toward the clearing where the century-old oak rises."
  },
  "bridge_chene_pont": {
    "es": "Sigue la senda de musgo hasta divisar los arcos de piedra del puente.",
    "fr": "Suis le sentier moussu jusqu'à apercevoir les arches de pierre du pont.",
    "en": "Follow the mossy trail until you spot the stone arches of the bridge."
  },
  "bridge_chene_belvedere": {
    "es": "Asciende por la colina hacia el mirador con vistas a todo el valle.",
    "fr": "Monte par la colline vers le belvédère surplombant toute la vallée.",
    "en": "Climb up the hill toward the viewpoint overlooking the entire valley."
  },
  "bridge_pont_belvedere": {
    "es": "Deja atrás el murmullo del río y sube al punto panorámico.",
    "fr": "Laisse derrière toi le murmure de la rivière et monte au point panoramique.",
    "en": "Leave the river's murmur behind and climb to the panoramic spot."
  },
  "bridge_pont_moulin": {
    "es": "Regresa por el camino de ribera hacia el viejo molino.",
    "fr": "Reviens par le sentier de rive vers le vieux moulin.",
    "en": "Head back along the river path toward the old mill."
  }
};

function updateI18n(filePath) {
  if (!fs.existsSync(filePath)) return;
  const i18n = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!i18n.ui) i18n.ui = { es: {}, fr: {}, en: {} };
  if (!i18n.keys) i18n.keys = {};

  for (const [k, v] of Object.entries(extraI18nKeys)) {
    i18n.keys[k] = v;
    i18n.ui.es[k] = v.es;
    i18n.ui.fr[k] = v.fr;
    i18n.ui.en[k] = v.en;
  }
  fs.writeFileSync(filePath, JSON.stringify(i18n, null, 2), 'utf-8');
}

updateI18n(path.resolve('src/data/i18n.json'));
updateI18n(path.resolve('i18n.json'));
console.log('Extra i18n keys saved.');
