import fs from 'fs';
import path from 'path';

const i18nPath = path.resolve('src/data/i18n.json');
const rootI18nPath = path.resolve('i18n.json');
const forestsPath = path.resolve('data/forests.json');
const seedPath = path.resolve('forest-packs-seed.json');
const dataSeedPath = path.resolve('data/forest-packs-seed.json');

const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf-8'));
const forests = JSON.parse(fs.readFileSync(forestsPath, 'utf-8'));

// Exact keys to update/ensure based on user's exact specification
const updatedKeys = {
  // POI Names: Proper place names NOT translated
  "poi_moulin_rouillac_name": {
    "es": "Moulin de Rouillac",
    "fr": "Moulin de Rouillac",
    "en": "Moulin de Rouillac"
  },
  "poi_ruisseau_moulin_name": {
    "es": "Ruisseau du Moulin",
    "fr": "Ruisseau du Moulin",
    "en": "Ruisseau du Moulin"
  },
  "poi_chene_soupirs_name": {
    "es": "Chêne des Soupirs",
    "fr": "Chêne des Soupirs",
    "en": "Chêne des Soupirs"
  },
  "poi_pont_sorciere_name": {
    "es": "Pont de la Sorcière",
    "fr": "Pont de la Sorcière",
    "en": "Pont de la Sorcière"
  },
  "poi_cabane_forestier_name": {
    "es": "Cabane du Forestier",
    "fr": "Cabane du Forestier",
    "en": "Cabane du Forestier"
  },
  "poi_belvedere_canejan_name": {
    "es": "Belvédère de Canéjan",
    "fr": "Belvédère de Canéjan",
    "en": "Belvédère de Canéjan"
  },

  // POI Descriptions
  "poi_moulin_rouillac_description": {
    "es": "Antiguo molino del s. XIX a orillas del río Eau Bourde. Sus muelas trituraban trigo y centeno impulsadas por la corriente.",
    "fr": "Ancien moulin du XIXe siècle au bord de l'Eau Bourde. Ses meules broyaient blé et seigle sous l'impulsion du courant.",
    "en": "Ancient 19th-century mill on the banks of the Eau Bourde river. Its millstones crushed wheat and rye driven by the current."
  },
  "poi_ruisseau_moulin_description": {
    "es": "Arroyo cantarín cubierto de musgo que alimenta el caz del molino, donde nadan pequeños peces de río.",
    "fr": "Ruisseau chantant recouvert de mousse qui alimente le bief du moulin, où nagent de petits poissons de rivière.",
    "en": "Babbling moss-covered brook feeding the millrace, where small river fish swim."
  },
  "poi_chene_soupirs_description": {
    "es": "Roble bicentenario con ramas arqueadas como brazos protectores. El viento murmura confidencias entre sus hojas.",
    "fr": "Chêne bicentenaire aux branches arquées comme des bras protecteurs. Le vent murmure des confidences entre ses feuilles.",
    "en": "Two-hundred-year-old oak with branches arched like protecting arms. The wind whispers confidences among its leaves."
  },
  "poi_pont_sorciere_description": {
    "es": "Puente rústico de piedra sobre una curva cerrada del sendero, envuelto en leyendas de pociones y fuego fatuo.",
    "fr": "Pont rustique en pierre sur un virage serré du sentier, enveloppé de légendes de potions et de feux follets.",
    "en": "Rustic stone bridge over a sharp bend in the path, wrapped in legends of potions and will-o'-the-wisps."
  },
  "poi_cabane_forestier_description": {
    "es": "Refugio tradicional de resineros construido con troncos de pino marítimo de las Landas.",
    "fr": "Abri traditionnel de résiniers bâti en troncs de pin maritime des Landes.",
    "en": "Traditional resin tappers' shelter built from maritime pine logs of the Landes."
  },
  "poi_belvedere_canejan_description": {
    "es": "Mirador sobre el dosel de pinos que ofrece una vista despejada sobre la ribera arbolada del valle del Eau Bourde.",
    "fr": "Belvédère au-dessus de la canopée de pins offrant une vue dégagée sur la rive boisée de la vallée de l'Eau Bourde.",
    "en": "Viewpoint above the pine canopy offering an unobstructed vista over the wooded banks of the Eau Bourde valley."
  },

  // POI Clues
  "poi_moulin_rouillac_clue": {
    "es": "Busca los viejos engranajes de hierro y las compuertas de madera que regulaban la fuerza del agua.",
    "fr": "Cherche les vieux engrenages en fer et les vannes en bois qui régulaient la force de l'eau.",
    "en": "Look for the old iron gears and wooden floodgates that regulated the water's force."
  },
  "poi_ruisseau_moulin_clue": {
    "es": "El susurro de la corriente oculta el secreto de las piedras redondeadas por los siglos.",
    "fr": "Le murmure du courant cache le secret des pierres polies par les siècles.",
    "en": "The whisper of the current hides the secret of stones rounded over the centuries."
  },
  "poi_chene_soupirs_clue": {
    "es": "En la corteza rugosa del lado norte se aprecian las marcas que dejaron antiguos viajeros.",
    "fr": "Sur l'écorce rugueuse du côté nord, on distingue les marques laissées par d'anciens voyageurs.",
    "en": "On the rough bark on the north side, marks left by ancient travelers can be seen."
  },
  "poi_pont_sorciere_clue": {
    "es": "Bajo el arco de piedra, el reflejo del agua dibuja símbolos sólo visibles con buena luz.",
    "fr": "Sous l'arche de pierre, le reflet de l'eau dessine des symboles visibles seulement par bonne lumière.",
    "en": "Under the stone arch, the reflection of the water traces symbols only visible in good light."
  },
  "poi_cabane_forestier_clue": {
    "es": "El dintel de madera lleva grabado un año y un símbolo de resina.",
    "fr": "Le linteau de bois porte gravé une année et un symbole de résine.",
    "en": "The wooden lintel has a year and a resin symbol carved into it."
  },
  "poi_belvedere_canejan_clue": {
    "es": "Desde aquí se observa el horizonte donde las copas verdes se funden con el cielo.",
    "fr": "D'ici, on observe l'horizon où les cimes vertes se fondent avec le ciel.",
    "en": "From here you can observe the horizon where the green treetops merge with the sky."
  },

  // AR Titles & Descriptions
  "ar_moulin_rouillac_title": {
    "es": "Rueda Hidráulica de Madera y Bronce",
    "fr": "Roue Hydraulique en Bois et Bronze",
    "en": "Wooden and Bronze Water Wheel"
  },
  "ar_moulin_rouillac_description": {
    "es": "La réplica etérea de la gran rueda dentada gira impulsada por el agua del río Eau Bourde.",
    "fr": "La réplique éthérée de la grande roue dentée tourne actionnée par l'eau de l'Eau Bourde.",
    "en": "The ethereal replica of the large cogged wheel turns powered by the water of the Eau Bourde river."
  },
  "ar_ruisseau_moulin_title": {
    "es": "Cofre Sumergido de la Resistencia",
    "fr": "Coffre Immergé de la Résistance",
    "en": "Submerged Resistance Chest"
  },
  "ar_ruisseau_moulin_description": {
    "es": "Un cofre de campaña estanco que guardaba mapas de evacuación y códigos cifrados de 1944.",
    "fr": "Un coffre de campagne étanche qui abritait des cartes d'évacuation et des codes chiffrés de 1944.",
    "en": "A watertight field chest that held evacuation maps and encrypted codes from 1944."
  },
  "ar_chene_soupirs_title": {
    "es": "Espíritu Guardián del Bosque",
    "fr": "Esprit Gardien de la Forêt",
    "en": "Guardian Spirit of the Forest"
  },
  "ar_chene_soupirs_description": {
    "es": "Un orbe luminoso con filamentos dorados que pulsa al compás del viento entre las ramas del roble.",
    "fr": "Un orbe lumineux aux filaments dorés qui palpite au rythme du vent entre les branches du chêne.",
    "en": "A luminous orb with golden filaments pulsing to the rhythm of the wind among the oak's branches."
  },
  "ar_pont_sorciere_title": {
    "es": "Caldero Mágico de Piedra",
    "fr": "Chaudron Magique en Pierre",
    "en": "Stone Magic Cauldron"
  },
  "ar_pont_sorciere_description": {
    "es": "Caldero de la bruja Sylvaine del que emanan partículas brillantes de vapor azul y verde.",
    "fr": "Chaudron de la sorcière Sylvaine d'où émanent des particules scintillantes de vapeur bleue et verte.",
    "en": "Witch Sylvaine's cauldron emitting shimmering particles of blue and green vapor."
  },
  "ar_cabane_forestier_title": {
    "es": "Farol y Cuaderno de Resinero",
    "fr": "Lanterne et Carnet de Résinier",
    "en": "Resin Tapper's Lantern and Notebook"
  },
  "ar_cabane_forestier_description": {
    "es": "Un farol de queroseno encendido junto al diario de campo de los antiguos leñadores.",
    "fr": "Une lanterne à pétrole allumée à côté du journal de bord des anciens bûcherons.",
    "en": "A lit kerosene lantern next to the field journal of the old woodcutters."
  },
  "ar_belvedere_canejan_title": {
    "es": "Catalejo Náutico de Bronce",
    "fr": "Longue-vue Nautique en Bronze",
    "en": "Bronze Nautical Spyglass"
  },
  "ar_belvedere_canejan_description": {
    "es": "Instrumento óptico apuntando hacia las copas de los pinos y las coordenadas del valle.",
    "fr": "Instrument optique pointé vers la cime des pins et les coordonnées de la vallée.",
    "en": "Optical instrument pointed towards the pine treetops and the coordinates of the valley."
  }
};

// Apply updated keys to i18n dictionaries
for (const [k, v] of Object.entries(updatedKeys)) {
  i18n.keys[k] = v;
  if (!i18n.ui) i18n.ui = { es: {}, fr: {}, en: {} };
  i18n.ui.es[k] = v.es;
  i18n.ui.fr[k] = v.fr;
  i18n.ui.en[k] = v.en;
}

fs.writeFileSync(i18nPath, JSON.stringify(i18n, null, 2), 'utf-8');
fs.writeFileSync(rootI18nPath, JSON.stringify(i18n, null, 2), 'utf-8');
console.log('Saved i18n keys successfully');

// Now enrich Canejan in forests.json and seed files with base text fields
const canejan = forests.find(f => f.id === 'bosque-canejan-cestas');
if (canejan) {
  // 1. POIs
  canejan.pois = canejan.pois.map(poi => {
    const name = i18n.keys[poi.nameKey]?.es || poi.name;
    const desc = i18n.keys[poi.descriptionKey]?.es || poi.description;
    const clue = i18n.keys[poi.clueSnippetKey]?.es || poi.clueSnippet;
    const arTitle = poi.arAsset?.titleKey ? i18n.keys[poi.arAsset.titleKey]?.es : poi.arAsset?.title;
    const arDesc = poi.arAsset?.descriptionKey ? i18n.keys[poi.arAsset.descriptionKey]?.es : poi.arAsset?.description;

    return {
      ...poi,
      name,
      description: desc,
      clueSnippet: clue,
      arAsset: poi.arAsset ? {
        ...poi.arAsset,
        title: arTitle,
        description: arDesc,
        label: arTitle || poi.arAsset.label
      } : undefined
    };
  });

  // 2. Stories
  canejan.stories = canejan.stories.map(story => {
    const title = i18n.keys[story.titleKey]?.es || story.title;
    const summary = i18n.keys[story.summaryKey]?.es || story.summary;
    const narrative = i18n.keys[story.narrativeKey]?.es || story.narrative;
    const mission = i18n.keys[story.missionKey]?.es || story.mission;
    const narratorName = i18n.keys[story.narratorNameKey]?.es || story.narratorName || story.narrator?.name;
    const narratorRole = i18n.keys[story.narratorRoleKey]?.es || story.narratorRole || story.narrator?.role;
    const narratorTone = i18n.keys[story.narratorToneKey]?.es || story.narratorTone || story.narrator?.tone;
    const charBio = i18n.keys[story.characterBioKey]?.es || story.characterBio;
    const charGreeting = i18n.keys[story.characterGreetingKey]?.es || story.characterGreeting;

    return {
      ...story,
      title,
      summary,
      narrative,
      mission,
      narratorName,
      narratorRole,
      narratorTone,
      characterBio: charBio,
      characterGreeting: charGreeting,
      narrator: {
        name: narratorName,
        role: narratorRole,
        tone: narratorTone,
        avatarEmoji: story.narratorAvatar || '🧭',
        ttsVoice: story.guide?.voiceName || story.voiceName || 'Fenrir'
      }
    };
  });

  // 3. Riddles
  canejan.riddles = canejan.riddles.map(r => {
    const name = i18n.keys[r.nameKey]?.es || r.name;
    const question = i18n.keys[r.questionKey]?.es || r.question;
    const options = r.optionsKeys ? r.optionsKeys.map(k => i18n.keys[k]?.es || k) : r.options;
    const hints = r.hintsKeys ? r.hintsKeys.map(k => i18n.keys[k]?.es || k) : r.hints;
    let answer = r.answer;
    if (r.type === 'multiple_choice' && options && r.correctIndex !== undefined) {
      answer = options[r.correctIndex];
    } else if (r.answersKeys && r.answersKeys.length > 0) {
      answer = i18n.keys[r.answersKeys[0]]?.es || r.answer;
    }
    const acceptedAnswers = r.answersKeys ? r.answersKeys.map(k => i18n.keys[k]?.es || k) : (r.acceptedAnswers || (answer ? [answer] : undefined));

    return {
      ...r,
      name,
      question,
      options,
      answer,
      acceptedAnswers,
      hints,
      staticHints: hints
    };
  });
}

function saveForests(filePath) {
  if (!fs.existsSync(filePath)) return;
  const list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const idx = list.findIndex(f => f.id === 'bosque-canejan-cestas');
  if (idx !== -1) {
    list[idx] = canejan;
  }
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  console.log('Saved forest file:', filePath);
}

saveForests(forestsPath);
saveForests(seedPath);
saveForests(dataSeedPath);

console.log('Canejan successfully synchronized with exact base fields and i18n keys!');
