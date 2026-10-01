import fs from 'fs';
import path from 'path';

const i18n = JSON.parse(fs.readFileSync('i18n.json', 'utf-8'));
const seed = JSON.parse(fs.readFileSync('forest-packs-seed.json', 'utf-8'));
const nalda = seed.find(f => f.id === 'nalda');
const croniconR = nalda.riddles.filter(r => r.storyId === 'guardian-iregua');

const part4 = {};

// 1. Cronicón riddles
croniconR.forEach(r => {
  if (r.nameKey && i18n.keys[r.nameKey]) part4[r.nameKey] = i18n.keys[r.nameKey];
  if (r.questionKey && i18n.keys[r.questionKey]) part4[r.questionKey] = i18n.keys[r.questionKey];
  if (r.optionsKeys) r.optionsKeys.forEach(k => { if (i18n.keys[k]) part4[k] = i18n.keys[k]; });
  if (r.answersKeys) r.answersKeys.forEach(k => { if (i18n.keys[k]) part4[k] = i18n.keys[k]; });
  if (r.hintsKeys) r.hintsKeys.forEach(k => { if (i18n.keys[k]) part4[k] = i18n.keys[k]; });
  if (r.metaRuneClueKey && i18n.keys[r.metaRuneClueKey]) part4[r.metaRuneClueKey] = i18n.keys[r.metaRuneClueKey];
});

// 2. Extra bonus riddles for Cronicón
const extraBonusKeys = [
  'extra_foto_castillo_title', 'extra_foto_castillo_description',
  'extra_escucha_mirador_title', 'extra_escucha_mirador_description',
  'extra_brujula_mirador_title', 'extra_brujula_mirador_description',
  'extra_ordena_camino_title', 'extra_ordena_camino_description',
  'extra_ordena_camino_opt_1', 'extra_ordena_camino_opt_2', 'extra_ordena_camino_opt_3', 'extra_ordena_camino_opt_4', 'extra_ordena_camino_opt_5',
  'extra_escucha_cuevas_title', 'extra_escucha_cuevas_description'
];
extraBonusKeys.forEach(k => {
  if (i18n.keys[k]) part4[k] = i18n.keys[k];
});

// 3. Durations
const durationKeys = [
  'duration_30min_description', 'duration_1h_description', 'duration_1h30_description', 'duration_2h_description',
  'duration_f_30min_description', 'duration_f_1h_description', 'duration_f_1h30_description', 'duration_f_2h_description'
];
durationKeys.forEach(k => {
  if (i18n.keys[k]) part4[k] = i18n.keys[k];
});

// 4. Meta-enigmas
const metaKeys = [
  'meta_enigma_title', 'meta_enigma_description',
  'meta_enigma_canejan_title', 'meta_enigma_canejan_description', 'meta_enigma_canejan_hint', 'meta_enigma_canejan_success'
];
metaKeys.forEach(k => {
  if (i18n.keys[k]) part4[k] = i18n.keys[k];
});

// 5. Bridge phrases
const bridgeKeys = {
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
  },
  "bridge_nalda_castillo_arco": {
    "es": "Desciende de las ruinas del castillo cruzando los callejones empedrados hasta el portal fortificado del Arco de la Villa.",
    "fr": "Descends des ruines du château en traversant les ruelles pavées jusqu'au portail fortifié de l'Arche de la Villa.",
    "en": "Descend from the castle ruins crossing the cobbled alleys down to the fortified gateway of the Village Arch."
  },
  "bridge_nalda_arco_mirador": {
    "es": "Deja atrás la villa amurallada y asciende hacia la loma donde se abre la vista a la Puerta de Cameros.",
    "fr": "Laisse derrière toi la cité fortifiée et monte vers la colline où s'ouvre la vue sur la Porte de Cameros.",
    "en": "Leave the walled town behind and head up toward the rise where the panorama of the Cameros Gate opens up."
  },
  "bridge_nalda_mirador_cuevas": {
    "es": "Baja por la ladera hacia el cortado arcilloso donde se esconden los cientos de nichos rupestres de Los Palomares.",
    "fr": "Descends par le versant vers la falaise d'argile où se cachent les centaines de niches rupestres de Los Palomares.",
    "en": "Head down the slope toward the clay cliff where the hundreds of rock-hewn niches of Los Palomares are hidden."
  },
  "bridge_nalda_cuevas_ermita": {
    "es": "Sigue el sendero rural entre huertas y viñas que te conducirá hasta el remanso de la Ermita de Villavieja.",
    "fr": "Suis le sentier champêtre entre vergers et vignes qui te mènera jusqu'au havre de l'ermitage de Villavieja.",
    "en": "Follow the country path among orchards and vineyards leading to the haven of Villavieja Hermitage."
  }
};
Object.assign(part4, bridgeKeys);

// 6. Fray Botijo meta rune clues
const frayRuneKeys = {
  "f_t1_1_meta_rune_clue": {
    "es": "Letra 'B' de Fray Botijo: Primera letra del tonel sagrado.",
    "fr": "Lettre 'B' de Fray Botijo : Première lettre du tonneau sacré.",
    "en": "Friar Botijo's letter 'B': First letter of the sacred cask."
  },
  "f_t1_2_meta_rune_clue": {
    "es": "Letra 'O' de Fray Botijo: El aro redondo de la bota de vino.",
    "fr": "Lettre 'O' de Fray Botijo : Le cercle rond de l'outre de vin.",
    "en": "Friar Botijo's letter 'O': The round hoop of the wineskin."
  },
  "f_t1_3_meta_rune_clue": {
    "es": "Letra 'T' de Fray Botijo: El trago sagrado que alegra el espíritu.",
    "fr": "Lettre 'T' de Fray Botijo : La gorgée sacrée qui réjouit l'esprit.",
    "en": "Friar Botijo's letter 'T': The sacred swig that cheers the spirit."
  },
  "f_t2_1_meta_rune_clue": {
    "es": "Letra 'I' de Fray Botijo: La línea recta que nunca se tuerce con vino.",
    "fr": "Lettre 'I' de Fray Botijo : La ligne droite qui ne dévie jamais avec le vin.",
    "en": "Friar Botijo's letter 'I': The straight line that never bends with wine."
  },
  "f_t2_2_meta_rune_clue": {
    "es": "Letra 'J' de Fray Botijo: El asa curva del jarro medieval.",
    "fr": "Lettre 'J' de Fray Botijo : L'anse courbée de la cruche médiévale.",
    "en": "Friar Botijo's letter 'J': The curved handle of the medieval jug."
  },
  "f_t2_3_meta_rune_clue": {
    "es": "Letra 'O' de Fray Botijo: El fondo del barril donde duerme la solera.",
    "fr": "Lettre 'O' de Fray Botijo : Le fond du tonneau où repose la solera.",
    "en": "Friar Botijo's letter 'O': The bottom of the barrel where the vintage rests."
  },
  "f_t3_1_meta_rune_clue": {
    "es": "Letra 'B' de Fray Botijo: El brocal de la bodega subterránea.",
    "fr": "Lettre 'B' de Fray Botijo : La margelle de la cave souterraine.",
    "en": "Friar Botijo's letter 'B': The parapet of the subterranean cellar."
  },
  "f_t3_2_meta_rune_clue": {
    "es": "Letra 'O' de Fray Botijo: El ojo de buey del mirador soleado.",
    "fr": "Lettre 'O' de Fray Botijo : L'œil-de-bœuf du belvédère ensoleillé.",
    "en": "Friar Botijo's letter 'O': The bullseye window of the sunny overlook."
  },
  "f_t3_3_meta_rune_clue": {
    "es": "Letra 'T' de Fray Botijo: La tabla de roble donde se sirve el queso y el vino.",
    "fr": "Lettre 'T' de Fray Botijo : La planche de chêne où l'on sert fromage et vin.",
    "en": "Friar Botijo's letter 'T': The oak board where cheese and wine are served."
  },
  "f_t4_1_meta_rune_clue": {
    "es": "Letra 'I' de Fray Botijo: El Iregua que baja fresco de la sierra.",
    "fr": "Lettre 'I' de Fray Botijo : L'Iregua qui descend frais de la montagne.",
    "en": "Friar Botijo's letter 'I': The Iregua flowing fresh from the mountains."
  },
  "f_t4_2_meta_rune_clue": {
    "es": "Letra 'J' de Fray Botijo: La jota que se canta tras vaciar la bota.",
    "fr": "Lettre 'J' de Fray Botijo : La jota chantée après avoir vidé l'outre.",
    "en": "Friar Botijo's letter 'J': The folk song sung after emptying the flask."
  },
  "f_t4_3_meta_rune_clue": {
    "es": "Letra 'O' de Fray Botijo: El ojo vigilante de las palomas en las cuevas.",
    "fr": "Lettre 'O' de Fray Botijo : L'œil vigilant des pigeons dans les grottes.",
    "en": "Friar Botijo's letter 'O': The watchful eye of the cliff doves."
  },
  "f_t5_1_meta_rune_clue": {
    "es": "Letra 'B' de Fray Botijo: La bendición de Villavieja para el caminante.",
    "fr": "Lettre 'B' de Fray Botijo : La bénédiction de Villavieja pour le pèlerin.",
    "en": "Friar Botijo's letter 'B': The blessing of Villavieja for the wayfarer."
  },
  "f_t5_2_meta_rune_clue": {
    "es": "Letra 'O' de Fray Botijo: La última letra que sella el nombre BOTIJO.",
    "fr": "Lettre 'O' de Fray Botijo : La dernière lettre qui scelle le mot BOTIJO.",
    "en": "Friar Botijo's letter 'O': The final letter sealing the word BOTIJO."
  }
};
Object.assign(part4, frayRuneKeys);

fs.writeFileSync('/tmp/part4.json', JSON.stringify(part4, null, 2), 'utf-8');

// Update i18n
function updateI18n(filePath) {
  if (!fs.existsSync(filePath)) return;
  const current = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!current.ui) current.ui = { es: {}, fr: {}, en: {} };
  if (!current.keys) current.keys = {};

  for (const [k, v] of Object.entries(part4)) {
    current.keys[k] = v;
    current.ui.es[k] = v.es;
    current.ui.fr[k] = v.fr;
    current.ui.en[k] = v.en;
  }
  fs.writeFileSync(filePath, JSON.stringify(current, null, 2), 'utf-8');
}

updateI18n(path.resolve('src/data/i18n.json'));
updateI18n(path.resolve('i18n.json'));

console.log('Mensaje 4 keys prepared and saved. Total keys:', Object.keys(part4).length);
