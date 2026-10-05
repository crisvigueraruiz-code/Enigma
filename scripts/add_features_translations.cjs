const fs = require('fs');
const path = require('path');

const p1 = path.join(__dirname, '../src/data/i18n.json');
const p2 = path.join(__dirname, '../i18n.json');

const d1 = JSON.parse(fs.readFileSync(p1, 'utf-8'));
const d2 = JSON.parse(fs.readFileSync(p2, 'utf-8'));

const newKeys = {
  es: {
    "passport.title": "Pasaporte de Explorador & Diplomas",
    "passport.navButton": "Pasaporte",
    "passport.subtitle": "Cuaderno de Campo",
    "passport.tabPassport": "Sellos",
    "passport.tabBadges": "Medallas",
    "passport.tabDiploma": "Diploma",
    "passport.owner": "Titular del Pasaporte",
    "passport.totalScore": "Puntos Totales",
    "passport.conquered": "CONQUISTADO",
    "passport.metaSolved": "Códice Descifrado",
    "passport.downloadDiploma": "Descargar Diploma Oficial (PNG HD)",
    "passport.downloading": "Generando Pergamino...",
    "passport.shareDiploma": "Compartir Diploma",
    "passport.namePlaceholder": "Escribe tu nombre para el diploma",
    "passport.diplomaPreview": "Pergamino Oficial del Explorador",
    "passport.badgeBotanist": "Botánico de Cestas",
    "passport.badgeBotanistDesc": "Completar acertijos de flora y encinas ancestrales",
    "passport.badgeHermit": "Ermitaño de Nalda",
    "passport.badgeHermitDesc": "Explorar las Cuevas de Los Palomares excavadas en la roca",
    "passport.badgeOwl": "Oído de Búho",
    "passport.badgeOwlDesc": "Completar con éxito los 30 segundos de silencio y escucha",
    "passport.badgeCronicon": "Custodio del Cronicón",
    "passport.badgeCroniconDesc": "Descubrir las runas arcanas y resolver el Gran Meta-Enigma",
    "passport.badgeDuelist": "Guerrero Silencioso",
    "passport.badgeDuelistDesc": "Participar en una Batalla Silenciosa multijugador",
    "passport.badgeCompass": "Orientador Magistral",
    "passport.badgeCompassDesc": "Alcanzar el rumbo exacto con la brújula magnética",

    "offline.title": "Descarga Offline Completa",
    "offline.navButton": "Offline",
    "offline.subtitle": "Pack Pre-Salida sin Cobertura",
    "offline.desc": "Descarga mapas satelitales/topográficos, relatos, pistas y modelos 3D antes de salir a la montaña para jugar 100% sin conexión a internet.",
    "offline.download": "Descargar Pack Pre-Salida",
    "offline.downloading": "Descargando...",
    "offline.downloaded": "Listo Offline",
    "offline.delete": "Liberar Espacio",
    "offline.tilesCached": "mosaicos de mapa",
    "offline.statusOnline": "Conectado a Internet",
    "offline.statusOffline": "Sin Conexión (Modo Offline Activo)",
    "offline.allPacksReady": "Packs Pre-Salida Disponibles",

    "ar.timePortalTitle": "Ventana al Pasado • Siglo XIII",
    "ar.timePortalDesc": "Desliza para viajar en el tiempo y superponer la reconstrucción histórica 3D medieval sobre las ruinas reales.",
    "ar.timePortalButton": "Ventana al Pasado",
    "ar.timePortalActive": "Portal Histórico Activo",
    "ar.timePortalSlider": "Control Temporal"
  },
  fr: {
    "passport.title": "Passeport d'Explorateur & Diplômes",
    "passport.navButton": "Passeport",
    "passport.subtitle": "Carnet de Terrain",
    "passport.tabPassport": "Tampons",
    "passport.tabBadges": "Médailles",
    "passport.tabDiploma": "Diplôme",
    "passport.owner": "Titulaire du Passeport",
    "passport.totalScore": "Points Totaux",
    "passport.conquered": "CONQUIS",
    "passport.metaSolved": "Codex Déchiffré",
    "passport.downloadDiploma": "Télécharger Diplôme Officiel (PNG HD)",
    "passport.downloading": "Génération du Parchemin...",
    "passport.shareDiploma": "Partager le Diplôme",
    "passport.namePlaceholder": "Écrivez votre nom pour le diplôme",
    "passport.diplomaPreview": "Parchemin Officiel de l'Explorateur",
    "passport.badgeBotanist": "Botaniste des Paniers",
    "passport.badgeBotanistDesc": "Résoudre les énigmes de la flore et des chênes ancestraux",
    "passport.badgeHermit": "Ermite de Nalda",
    "passport.badgeHermitDesc": "Explorer les Grottes de Los Palomares taillées dans la roche",
    "passport.badgeOwl": "Ouïe de Hibou",
    "passport.badgeOwlDesc": "Compléter avec succès les 30 secondes d'écoute et de silence",
    "passport.badgeCronicon": "Gardien du Chronicon",
    "passport.badgeCroniconDesc": "Découvrir les runes mystiques et résoudre le Grand Méta-Énigme",
    "passport.badgeDuelist": "Guerrier Silencieux",
    "passport.badgeDuelistDesc": "Participer à une Bataille Silencieuse multijoueur",
    "passport.badgeCompass": "Maître de l'Orientation",
    "passport.badgeCompassDesc": "Atteindre le cap exact avec la boussole magnétique",

    "offline.title": "Téléchargement Hors-Ligne Complet",
    "offline.navButton": "Hors-Ligne",
    "offline.subtitle": "Pack Pré-Départ sans Réseau",
    "offline.desc": "Téléchargez les cartes topographiques, récits, indices et modèles 3D avant de partir en forêt pour jouer 100% hors-ligne.",
    "offline.download": "Télécharger Pack Pré-Départ",
    "offline.downloading": "Téléchargement...",
    "offline.downloaded": "Prêt Hors-Ligne",
    "offline.delete": "Libérer l'Espace",
    "offline.tilesCached": "tuiles de carte",
    "offline.statusOnline": "Connecté à Internet",
    "offline.statusOffline": "Hors-Ligne (Mode Hors-Ligne Actif)",
    "offline.allPacksReady": "Packs Pré-Départ Disponibles",

    "ar.timePortalTitle": "Fenêtre sur le Passé • XIIIe Siècle",
    "ar.timePortalDesc": "Glissez pour voyager dans le temps et superposer la reconstitution historique 3D médiévale sur les ruines réelles.",
    "ar.timePortalButton": "Fenêtre sur le Passé",
    "ar.timePortalActive": "Portail Historique Actif",
    "ar.timePortalSlider": "Contrôle Temporel"
  },
  en: {
    "passport.title": "Explorer Passport & Diplomas",
    "passport.navButton": "Passport",
    "passport.subtitle": "Field Notebook",
    "passport.tabPassport": "Stamps",
    "passport.tabBadges": "Badges",
    "passport.tabDiploma": "Diploma",
    "passport.owner": "Passport Holder",
    "passport.totalScore": "Total Points",
    "passport.conquered": "CONQUERED",
    "passport.metaSolved": "Codex Deciphered",
    "passport.downloadDiploma": "Download Official Diploma (HD PNG)",
    "passport.downloading": "Generating Parchment...",
    "passport.shareDiploma": "Share Diploma",
    "passport.namePlaceholder": "Enter your name for the diploma",
    "passport.diplomaPreview": "Official Explorer Parchment",
    "passport.badgeBotanist": "Basket Botanist",
    "passport.badgeBotanistDesc": "Complete flora and ancestral oak tree riddles",
    "passport.badgeHermit": "Hermit of Nalda",
    "passport.badgeHermitDesc": "Explore Los Palomares Caves carved into the rock cliff",
    "passport.badgeOwl": "Owl Hearing",
    "passport.badgeOwlDesc": "Successfully complete the 30-second nature silence challenge",
    "passport.badgeCronicon": "Keeper of the Chronicon",
    "passport.badgeCroniconDesc": "Discover arcane runes and solve the Grand Meta-Enigma",
    "passport.badgeDuelist": "Silent Warrior",
    "passport.badgeDuelistDesc": "Compete in a real-time Silent Battle duel",
    "passport.badgeCompass": "Master Navigator",
    "passport.badgeCompassDesc": "Reach precise bearing with the magnetic compass",

    "offline.title": "Full Offline Download",
    "offline.navButton": "Offline",
    "offline.subtitle": "Pre-Departure Pack (No Signal)",
    "offline.desc": "Download topographic maps, stories, clues, and 3D assets before heading into the forest to play 100% without internet connection.",
    "offline.download": "Download Pre-Departure Pack",
    "offline.downloading": "Downloading...",
    "offline.downloaded": "Offline Ready",
    "offline.delete": "Free Space",
    "offline.tilesCached": "map tiles",
    "offline.statusOnline": "Connected to Internet",
    "offline.statusOffline": "Offline (Offline Mode Active)",
    "offline.allPacksReady": "Pre-Departure Packs Available",

    "ar.timePortalTitle": "Window to the Past • 13th Century",
    "ar.timePortalDesc": "Slide to travel back in time and superimpose the 3D medieval historical reconstruction over real ruins.",
    "ar.timePortalButton": "Window to the Past",
    "ar.timePortalActive": "Historic Time Portal Active",
    "ar.timePortalSlider": "Time Control"
  }
};

for (const lang of ['es', 'fr', 'en']) {
  if (!d1.ui[lang]) d1.ui[lang] = {};
  if (!d2.ui[lang]) d2.ui[lang] = {};
  Object.assign(d1.ui[lang], newKeys[lang]);
  Object.assign(d2.ui[lang], newKeys[lang]);
}

fs.writeFileSync(p1, JSON.stringify(d1, null, 2), 'utf-8');
fs.writeFileSync(p2, JSON.stringify(d2, null, 2), 'utf-8');
console.log('Successfully updated i18n dictionaries with passport, offline, and AR time portal translations');
