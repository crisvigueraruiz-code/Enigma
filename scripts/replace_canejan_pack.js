import fs from 'fs';
import path from 'path';

// Load existing files
const i18nPath = path.resolve('src/data/i18n.json');
const rootI18nPath = path.resolve('i18n.json');
const forestsPath = path.resolve('data/forests.json');
const seedPath = path.resolve('forest-packs-seed.json');
const dataSeedPath = path.resolve('data/forest-packs-seed.json');

const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf-8'));
const forests = JSON.parse(fs.readFileSync(forestsPath, 'utf-8'));

const existingCanejan = forests.find(f => f.id === 'bosque-canejan-cestas');
const canejanI18n = i18n.forests?.['bosque-canejan-cestas'] || {};
const frRiddles = canejanI18n.fr?.riddles || {};
const enRiddles = canejanI18n.en?.riddles || {};
const frPois = canejanI18n.fr?.pois || {};
const enPois = canejanI18n.en?.pois || {};

// The complete updated bosque-canejan-cestas object from user's request
const newCanejanPack = {
  "id": "bosque-canejan-cestas",
  "name": "Bosque de Canéjan-Cestas",
  "country": "Francia (Gironde)",
  "description": "Senda boscosa a lo largo del río Eau Bourde entre molinos centenarios, robles mágicos y leyendas de la resistencia bordelesa.",
  "centerLat": 44.7645,
  "centerLng": -0.6358,
  "coverImageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  "attribution": "Historia «La Promenade Enchantée» basada en el proyecto real Divercités «FOR[Ê]VEUR» (2026), cuentos y esculturas de niños de Canéjan junto a un escultor y cuentacuentos local.",
  "credits": "Historia «La Promenade Enchantée» basada en el proyecto real Divercités «FOR[Ê]VEUR» (2026), cuentos y esculturas de niños de Canéjan junto a un escultor y cuentacuentos local.",
  "defaultLanguage": "fr",
  "languages": ["fr", "es", "en"],
  "isPublished": true,
  "pois": [
    {
      "id": "moulin_rouillac",
      "nameKey": "poi_moulin_rouillac_name",
      "descriptionKey": "poi_moulin_rouillac_description",
      "lat": 44.7641,
      "lng": -0.6352,
      "emoji": "⚙️",
      "clueSnippetKey": "poi_moulin_rouillac_clue",
      "arAsset": {
        "preset": "rueda_hidraulica",
        "type": "3d_reconstruction",
        "modelUrl": "rueda_hidraulica_v1.glb",
        "scale": 1.4,
        "heightOffsetMeters": 1.2,
        "revealTrigger": "onArrival",
        "titleKey": "ar_moulin_rouillac_title",
        "descriptionKey": "ar_moulin_rouillac_description"
      }
    },
    {
      "id": "ruisseau_moulin",
      "nameKey": "poi_ruisseau_moulin_name",
      "descriptionKey": "poi_ruisseau_moulin_description",
      "lat": 44.7652,
      "lng": -0.6368,
      "emoji": "💧",
      "clueSnippetKey": "poi_ruisseau_moulin_clue",
      "arAsset": {
        "preset": "cofre_sumergido",
        "type": "3d_reconstruction",
        "modelUrl": "cofre_sumergido_v1.glb",
        "scale": 1.2,
        "heightOffsetMeters": 0.7,
        "revealTrigger": "onRiddleSolved",
        "titleKey": "ar_ruisseau_moulin_title",
        "descriptionKey": "ar_ruisseau_moulin_description"
      }
    },
    {
      "id": "chene_soupirs",
      "nameKey": "poi_chene_soupirs_name",
      "descriptionKey": "poi_chene_soupirs_description",
      "lat": 44.7668,
      "lng": -0.6341,
      "emoji": "🌳",
      "clueSnippetKey": "poi_chene_soupirs_clue",
      "arAsset": {
        "preset": "espiritu_guardian",
        "type": "animated_character",
        "modelUrl": "espiritu_guardian_v1.glb",
        "scale": 1.5,
        "heightOffsetMeters": 1.8,
        "revealTrigger": "onArrival",
        "titleKey": "ar_chene_soupirs_title",
        "descriptionKey": "ar_chene_soupirs_description"
      }
    },
    {
      "id": "pont_sorciere",
      "nameKey": "poi_pont_sorciere_name",
      "descriptionKey": "poi_pont_sorciere_description",
      "lat": 44.7684,
      "lng": -0.6375,
      "emoji": "🌉",
      "clueSnippetKey": "poi_pont_sorciere_clue",
      "arAsset": {
        "preset": "caldero_vapor",
        "type": "animated_character",
        "modelUrl": "caldero_vapor_v1.glb",
        "scale": 1.3,
        "heightOffsetMeters": 1.0,
        "revealTrigger": "onRiddleSolved",
        "titleKey": "ar_pont_sorciere_title",
        "descriptionKey": "ar_pont_sorciere_description"
      }
    },
    {
      "id": "cabane_forestier",
      "nameKey": "poi_cabane_forestier_name",
      "descriptionKey": "poi_cabane_forestier_description",
      "lat": 44.7671,
      "lng": -0.6399,
      "emoji": "🛖",
      "clueSnippetKey": "poi_cabane_forestier_clue",
      "_todo": "Sin acertijos asignados en ninguna historia. Excluido de las rutas.",
      "arAsset": {
        "preset": "farol_cuaderno",
        "type": "virtual_still_life",
        "modelUrl": "farol_cuaderno_v1.glb",
        "scale": 1.2,
        "heightOffsetMeters": 1.1,
        "revealTrigger": "onArrival",
        "titleKey": "ar_cabane_forestier_title",
        "descriptionKey": "ar_cabane_forestier_description"
      }
    },
    {
      "id": "belvedere_canejan",
      "nameKey": "poi_belvedere_canejan_name",
      "descriptionKey": "poi_belvedere_canejan_description",
      "lat": 44.7632,
      "lng": -0.6385,
      "emoji": "🔭",
      "clueSnippetKey": "poi_belvedere_canejan_clue",
      "arAsset": {
        "preset": "catalejo_nautico",
        "type": "virtual_still_life",
        "modelUrl": "catalejo_nautico_v1.glb",
        "scale": 1.3,
        "heightOffsetMeters": 1.3,
        "revealTrigger": "onRiddleSolved",
        "titleKey": "ar_belvedere_canejan_title",
        "descriptionKey": "ar_belvedere_canejan_description"
      }
    }
  ],
  "stories": [
    {
      "id": "guerra",
      "titleKey": "story_guerra_title",
      "icon": "⚔️",
      "summaryKey": "story_guerra_summary",
      "narrativeKey": "story_guerra_narrative",
      "missionKey": "story_guerra_mission",
      "narratorNameKey": "guide_jean_name",
      "narratorRoleKey": "guide_jean_role",
      "narratorToneKey": "guide_jean_tone",
      "narratorAvatar": "🕵️‍♂️",
      "characterBioKey": "guide_jean_bio",
      "characterGreetingKey": "guide_jean_greeting",
      "guide": {
        "id": "jean-silence",
        "nameKey": "guide_jean_name",
        "personaKey": "guide_jean_persona",
        "systemPromptKey": "guide_jean_system_prompt",
        "knowledgeBase": [
          "resistencia_burdeos_1944.json",
          "eau_bourde_rio.json",
          "maquis_gironde.json"
        ],
        "voiceName": "Fenrir",
        "greetingKey": "guide_jean_greeting"
      }
    },
    {
      "id": "molino_perdido",
      "titleKey": "story_molino_title",
      "icon": "⚙️",
      "summaryKey": "story_molino_summary",
      "narrativeKey": "story_molino_narrative",
      "missionKey": "story_molino_mission",
      "narratorNameKey": "guide_pierre_name",
      "narratorRoleKey": "guide_pierre_role",
      "narratorToneKey": "guide_pierre_tone",
      "narratorAvatar": "👨‍🔧",
      "characterBioKey": "guide_pierre_bio",
      "characterGreetingKey": "guide_pierre_greeting",
      "guide": {
        "id": "maitre-pierre",
        "nameKey": "guide_pierre_name",
        "personaKey": "guide_pierre_persona",
        "systemPromptKey": "guide_pierre_system_prompt",
        "knowledgeBase": [
          "moulin_rouillac_histoire.json",
          "mecanique_hydraulique_xix.json",
          "eau_bourde_rio.json"
        ],
        "voiceName": "Charon",
        "greetingKey": "guide_pierre_greeting"
      }
    },
    {
      "id": "hechizo_encantado",
      "titleKey": "story_hechizo_title",
      "icon": "✨",
      "summaryKey": "story_hechizo_summary",
      "narrativeKey": "story_hechizo_narrative",
      "missionKey": "story_hechizo_mission",
      "narratorNameKey": "guide_sylvaine_name",
      "narratorRoleKey": "guide_sylvaine_role",
      "narratorToneKey": "guide_sylvaine_tone",
      "narratorAvatar": "🧚‍♀️",
      "characterBioKey": "guide_sylvaine_bio",
      "characterGreetingKey": "guide_sylvaine_greeting",
      "guide": {
        "id": "sylvaine",
        "nameKey": "guide_sylvaine_name",
        "personaKey": "guide_sylvaine_persona",
        "systemPromptKey": "guide_sylvaine_system_prompt",
        "knowledgeBase": [
          "eau_bourde_rio.json",
          "flora_ribera_gironde.json",
          "leyendas_agua_gironda.json"
        ],
        "voiceName": "Kore",
        "greetingKey": "guide_sylvaine_greeting"
      }
    },
    {
      "id": "promenade_enchantee",
      "titleKey": "story_promenade_title",
      "icon": "🎨",
      "summaryKey": "story_promenade_summary",
      "narrativeKey": "story_promenade_narrative",
      "missionKey": "story_promenade_mission",
      "narratorNameKey": "guide_lutin_name",
      "narratorRoleKey": "guide_lutin_role",
      "narratorToneKey": "guide_lutin_tone",
      "narratorAvatar": "🧝‍♂️",
      "characterBioKey": "guide_lutin_bio",
      "characterGreetingKey": "guide_lutin_greeting",
      "guide": {
        "id": "duendecillo-roble",
        "nameKey": "guide_lutin_name",
        "personaKey": "guide_lutin_persona",
        "systemPromptKey": "guide_lutin_system_prompt",
        "knowledgeBase": [
          "projet_divercites_foreveur.json",
          "cuentos_escuela_canejan.json",
          "esculturas_madera_canejan.json"
        ],
        "voiceName": "Puck",
        "greetingKey": "guide_lutin_greeting"
      }
    }
  ],
  "riddles": [
    {
      "id": "r_guerra_moulin_1",
      "poiId": "moulin_rouillac",
      "storyId": "guerra",
      "nameKey": "r_guerra_moulin_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_guerra_moulin_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_guerra_moulin_1_opt_a",
        "r_guerra_moulin_1_opt_b",
        "r_guerra_moulin_1_opt_c",
        "r_guerra_moulin_1_opt_d"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_guerra_moulin_1_hint1",
        "r_guerra_moulin_1_hint2",
        "r_guerra_moulin_1_hint3"
      ]
    },
    {
      "id": "r_guerra_moulin_2",
      "poiId": "moulin_rouillac",
      "storyId": "guerra",
      "nameKey": "r_guerra_moulin_2_name",
      "difficulty": "explorador",
      "points": 150,
      "questionKey": "r_guerra_moulin_2_question",
      "type": "open_text",
      "answersKeys": [
        "r_guerra_moulin_2_ans1",
        "r_guerra_moulin_2_ans2",
        "r_guerra_moulin_2_ans3",
        "r_guerra_moulin_2_ans4"
      ],
      "hintsKeys": [
        "r_guerra_moulin_2_hint1",
        "r_guerra_moulin_2_hint2",
        "r_guerra_moulin_2_hint3"
      ]
    },
    {
      "id": "r_guerra_moulin_3",
      "poiId": "moulin_rouillac",
      "storyId": "guerra",
      "nameKey": "r_guerra_moulin_3_name",
      "difficulty": "maestro",
      "points": 250,
      "questionKey": "r_guerra_moulin_3_question",
      "type": "open_text",
      "answersKeys": [
        "r_guerra_moulin_3_ans1",
        "r_guerra_moulin_3_ans2"
      ],
      "hintsKeys": [
        "r_guerra_moulin_3_hint1",
        "r_guerra_moulin_3_hint2",
        "r_guerra_moulin_3_hint3"
      ]
    },
    {
      "id": "r_guerra_ruisseau_1",
      "poiId": "ruisseau_moulin",
      "storyId": "guerra",
      "nameKey": "r_guerra_ruisseau_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_guerra_ruisseau_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_guerra_ruisseau_1_opt_a",
        "r_guerra_ruisseau_1_opt_b",
        "r_guerra_ruisseau_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_guerra_ruisseau_1_hint1",
        "r_guerra_ruisseau_1_hint2",
        "r_guerra_ruisseau_1_hint3"
      ]
    },
    {
      "id": "r_guerra_ruisseau_2",
      "poiId": "ruisseau_moulin",
      "storyId": "guerra",
      "nameKey": "r_guerra_ruisseau_2_name",
      "difficulty": "explorador",
      "points": 150,
      "questionKey": "r_guerra_ruisseau_2_question",
      "type": "open_text",
      "answersKeys": [
        "r_guerra_ruisseau_2_ans1",
        "r_guerra_ruisseau_2_ans2",
        "r_guerra_ruisseau_2_ans3",
        "r_guerra_ruisseau_2_ans4"
      ],
      "hintsKeys": [
        "r_guerra_ruisseau_2_hint1",
        "r_guerra_ruisseau_2_hint2",
        "r_guerra_ruisseau_2_hint3"
      ]
    },
    {
      "id": "r_guerra_chene_1",
      "poiId": "chene_soupirs",
      "storyId": "guerra",
      "nameKey": "r_guerra_chene_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_guerra_chene_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_guerra_chene_1_opt_a",
        "r_guerra_chene_1_opt_b",
        "r_guerra_chene_1_opt_c",
        "r_guerra_chene_1_opt_d"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_guerra_chene_1_hint1",
        "r_guerra_chene_1_hint2",
        "r_guerra_chene_1_hint3"
      ]
    },
    {
      "id": "r_guerra_chene_2",
      "poiId": "chene_soupirs",
      "storyId": "guerra",
      "nameKey": "r_guerra_chene_2_name",
      "difficulty": "explorador",
      "points": 150,
      "questionKey": "r_guerra_chene_2_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_guerra_chene_2_opt_a",
        "r_guerra_chene_2_opt_b",
        "r_guerra_chene_2_opt_c",
        "r_guerra_chene_2_opt_d"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_guerra_chene_2_hint1",
        "r_guerra_chene_2_hint2",
        "r_guerra_chene_2_hint3"
      ]
    },
    {
      "id": "r_guerra_belvedere_1",
      "poiId": "belvedere_canejan",
      "storyId": "guerra",
      "nameKey": "r_guerra_belvedere_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_guerra_belvedere_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_guerra_belvedere_1_opt_a",
        "r_guerra_belvedere_1_opt_b",
        "r_guerra_belvedere_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_guerra_belvedere_1_hint1",
        "r_guerra_belvedere_1_hint2",
        "r_guerra_belvedere_1_hint3"
      ]
    },
    {
      "id": "r_molino_moulin_1",
      "poiId": "moulin_rouillac",
      "storyId": "molino_perdido",
      "nameKey": "r_molino_moulin_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_molino_moulin_1_question",
      "type": "open_text",
      "answersKeys": [
        "r_molino_moulin_1_ans1",
        "r_molino_moulin_1_ans2",
        "r_molino_moulin_1_ans3"
      ],
      "hintsKeys": [
        "r_molino_moulin_1_hint1",
        "r_molino_moulin_1_hint2",
        "r_molino_moulin_1_hint3"
      ]
    },
    {
      "id": "r_molino_moulin_2",
      "poiId": "moulin_rouillac",
      "storyId": "molino_perdido",
      "nameKey": "r_molino_moulin_2_name",
      "difficulty": "explorador",
      "points": 150,
      "questionKey": "r_molino_moulin_2_question",
      "type": "open_text",
      "answersKeys": [
        "r_molino_moulin_2_ans1",
        "r_molino_moulin_2_ans2",
        "r_molino_moulin_2_ans3",
        "r_molino_moulin_2_ans4"
      ],
      "hintsKeys": [
        "r_molino_moulin_2_hint1",
        "r_molino_moulin_2_hint2",
        "r_molino_moulin_2_hint3"
      ]
    },
    {
      "id": "r_molino_moulin_3",
      "poiId": "moulin_rouillac",
      "storyId": "molino_perdido",
      "nameKey": "r_molino_moulin_3_name",
      "difficulty": "maestro",
      "points": 250,
      "type": "order",
      "questionKey": "r_molino_moulin_3_question",
      "optionsKeys": [
        "r_molino_moulin_3_opt_1",
        "r_molino_moulin_3_opt_2",
        "r_molino_moulin_3_opt_3",
        "r_molino_moulin_3_opt_4",
        "r_molino_moulin_3_opt_5",
        "r_molino_moulin_3_opt_6"
      ],
      "hintsKeys": [
        "r_molino_moulin_3_hint1",
        "r_molino_moulin_3_hint2",
        "r_molino_moulin_3_hint3"
      ]
    },
    {
      "id": "r_molino_ruisseau_1",
      "poiId": "ruisseau_moulin",
      "storyId": "molino_perdido",
      "nameKey": "r_molino_ruisseau_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_molino_ruisseau_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_molino_ruisseau_1_opt_a",
        "r_molino_ruisseau_1_opt_b",
        "r_molino_ruisseau_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_molino_ruisseau_1_hint1",
        "r_molino_ruisseau_1_hint2",
        "r_molino_ruisseau_1_hint3"
      ]
    },
    {
      "id": "r_molino_chene_1",
      "poiId": "chene_soupirs",
      "storyId": "molino_perdido",
      "nameKey": "r_molino_chene_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_molino_chene_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_molino_chene_1_opt_a",
        "r_molino_chene_1_opt_b",
        "r_molino_chene_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_molino_chene_1_hint1",
        "r_molino_chene_1_hint2",
        "r_molino_chene_1_hint3"
      ]
    },
    {
      "id": "r_molino_belvedere_1",
      "poiId": "belvedere_canejan",
      "storyId": "molino_perdido",
      "nameKey": "r_molino_belvedere_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_molino_belvedere_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_molino_belvedere_1_opt_a",
        "r_molino_belvedere_1_opt_b",
        "r_molino_belvedere_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_molino_belvedere_1_hint1",
        "r_molino_belvedere_1_hint2",
        "r_molino_belvedere_1_hint3"
      ]
    },
    {
      "id": "r_hechizo_moulin_1",
      "poiId": "moulin_rouillac",
      "storyId": "hechizo_encantado",
      "nameKey": "r_hechizo_moulin_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_hechizo_moulin_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_hechizo_moulin_1_opt_a",
        "r_hechizo_moulin_1_opt_b",
        "r_hechizo_moulin_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_hechizo_moulin_1_hint1",
        "r_hechizo_moulin_1_hint2",
        "r_hechizo_moulin_1_hint3"
      ]
    },
    {
      "id": "r_hechizo_ruisseau_1",
      "poiId": "ruisseau_moulin",
      "storyId": "hechizo_encantado",
      "nameKey": "r_hechizo_ruisseau_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_hechizo_ruisseau_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_hechizo_ruisseau_1_opt_a",
        "r_hechizo_ruisseau_1_opt_b",
        "r_hechizo_ruisseau_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_hechizo_ruisseau_1_hint1",
        "r_hechizo_ruisseau_1_hint2",
        "r_hechizo_ruisseau_1_hint3"
      ]
    },
    {
      "id": "r_hechizo_ruisseau_2",
      "poiId": "ruisseau_moulin",
      "storyId": "hechizo_encantado",
      "nameKey": "r_hechizo_ruisseau_2_name",
      "difficulty": "explorador",
      "points": 150,
      "type": "order",
      "questionKey": "r_hechizo_ruisseau_2_question",
      "optionsKeys": [
        "r_hechizo_ruisseau_2_opt_1",
        "r_hechizo_ruisseau_2_opt_2",
        "r_hechizo_ruisseau_2_opt_3",
        "r_hechizo_ruisseau_2_opt_4",
        "r_hechizo_ruisseau_2_opt_5",
        "r_hechizo_ruisseau_2_opt_6"
      ],
      "hintsKeys": [
        "r_hechizo_ruisseau_2_hint1",
        "r_hechizo_ruisseau_2_hint2",
        "r_hechizo_ruisseau_2_hint3"
      ]
    },
    {
      "id": "r_hechizo_chene_1",
      "poiId": "chene_soupirs",
      "storyId": "hechizo_encantado",
      "nameKey": "r_hechizo_chene_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_hechizo_chene_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_hechizo_chene_1_opt_a",
        "r_hechizo_chene_1_opt_b",
        "r_hechizo_chene_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_hechizo_chene_1_hint1",
        "r_hechizo_chene_1_hint2",
        "r_hechizo_chene_1_hint3"
      ]
    },
    {
      "id": "r_hechizo_pont_1",
      "poiId": "pont_sorciere",
      "storyId": "hechizo_encantado",
      "nameKey": "r_hechizo_pont_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_hechizo_pont_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_hechizo_pont_1_opt_a",
        "r_hechizo_pont_1_opt_b",
        "r_hechizo_pont_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_hechizo_pont_1_hint1",
        "r_hechizo_pont_1_hint2",
        "r_hechizo_pont_1_hint3"
      ]
    },
    {
      "id": "r_hechizo_belvedere_1",
      "poiId": "belvedere_canejan",
      "storyId": "hechizo_encantado",
      "nameKey": "r_hechizo_belvedere_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_hechizo_belvedere_1_question",
      "type": "open_text",
      "answersKeys": [
        "r_hechizo_belvedere_1_ans1",
        "r_hechizo_belvedere_1_ans2",
        "r_hechizo_belvedere_1_ans3"
      ],
      "hintsKeys": [
        "r_hechizo_belvedere_1_hint1",
        "r_hechizo_belvedere_1_hint2",
        "r_hechizo_belvedere_1_hint3"
      ]
    },
    {
      "id": "r_promenade_ruisseau_1",
      "poiId": "ruisseau_moulin",
      "storyId": "promenade_enchantee",
      "nameKey": "r_promenade_ruisseau_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_promenade_ruisseau_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_promenade_ruisseau_1_opt_a",
        "r_promenade_ruisseau_1_opt_b",
        "r_promenade_ruisseau_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_promenade_ruisseau_1_hint1",
        "r_promenade_ruisseau_1_hint2",
        "r_promenade_ruisseau_1_hint3"
      ]
    },
    {
      "id": "r_promenade_chene_1",
      "poiId": "chene_soupirs",
      "storyId": "promenade_enchantee",
      "nameKey": "r_promenade_chene_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_promenade_chene_1_question",
      "type": "open_text",
      "answersKeys": [
        "r_promenade_chene_1_ans1",
        "r_promenade_chene_1_ans2",
        "r_promenade_chene_1_ans3"
      ],
      "hintsKeys": [
        "r_promenade_chene_1_hint1",
        "r_promenade_chene_1_hint2",
        "r_promenade_chene_1_hint3"
      ]
    },
    {
      "id": "r_promenade_pont_1",
      "poiId": "pont_sorciere",
      "storyId": "promenade_enchantee",
      "nameKey": "r_promenade_pont_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_promenade_pont_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_promenade_pont_1_opt_a",
        "r_promenade_pont_1_opt_b",
        "r_promenade_pont_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_promenade_pont_1_hint1",
        "r_promenade_pont_1_hint2",
        "r_promenade_pont_1_hint3"
      ]
    },
    {
      "id": "r_promenade_moulin_1",
      "poiId": "moulin_rouillac",
      "storyId": "promenade_enchantee",
      "nameKey": "r_promenade_moulin_1_name",
      "difficulty": "novato",
      "points": 100,
      "questionKey": "r_promenade_moulin_1_question",
      "type": "multiple_choice",
      "optionsKeys": [
        "r_promenade_moulin_1_opt_a",
        "r_promenade_moulin_1_opt_b",
        "r_promenade_moulin_1_opt_c"
      ],
      "correctIndex": 0,
      "hintsKeys": [
        "r_promenade_moulin_1_hint1",
        "r_promenade_moulin_1_hint2",
        "r_promenade_moulin_1_hint3"
      ]
    },
    {
      "id": "b_chene_foto",
      "poiId": "chene_soupirs",
      "storyId": "*",
      "nameKey": "b_chene_foto_name",
      "difficulty": "*",
      "points": 50,
      "optional": true,
      "isBonus": true,
      "type": "photo",
      "questionKey": "b_chene_foto_question",
      "config": {
        "validation": "trust"
      }
    },
    {
      "id": "b_ruisseau_escucha",
      "poiId": "ruisseau_moulin",
      "storyId": "*",
      "nameKey": "b_ruisseau_escucha_name",
      "difficulty": "*",
      "points": 50,
      "optional": true,
      "isBonus": true,
      "type": "listen",
      "questionKey": "b_ruisseau_escucha_question",
      "optionsKeys": [
        "b_ruisseau_escucha_opt_1",
        "b_ruisseau_escucha_opt_2",
        "b_ruisseau_escucha_opt_3",
        "b_ruisseau_escucha_opt_4",
        "b_ruisseau_escucha_opt_5",
        "b_ruisseau_escucha_opt_6"
      ],
      "config": {
        "holdSeconds": 30
      }
    },
    {
      "id": "b_ruisseau_orden_promenade",
      "poiId": "ruisseau_moulin",
      "storyId": "promenade_enchantee",
      "nameKey": "b_ruisseau_orden_promenade_name",
      "difficulty": "*",
      "points": 50,
      "optional": true,
      "isBonus": true,
      "type": "order",
      "questionKey": "b_ruisseau_orden_promenade_question",
      "optionsKeys": [
        "b_ruisseau_orden_promenade_opt_1",
        "b_ruisseau_orden_promenade_opt_2",
        "b_ruisseau_orden_promenade_opt_3",
        "b_ruisseau_orden_promenade_opt_4"
      ],
      "hintsKeys": [
        "b_ruisseau_orden_promenade_hint1",
        "b_ruisseau_orden_promenade_hint2",
        "b_ruisseau_orden_promenade_hint3"
      ]
    }
  ]
};

// Now build dictionary keys for POIs, AR assets, Stories, Guides, and all 27 Riddles
const newKeys = {};

// 1. POI Keys
const poiDefinitions = {
  moulin_rouillac: {
    name: { es: "Molino de Rouillac", fr: "Moulin de Rouillac", en: "Rouillac Mill" },
    desc: {
      es: "Molino harinero del siglo XIX junto al río Eau Bourde. Antiguo enclave de la Resistencia y de la molienda tradicional.",
      fr: "Moulin à farine du XIXe siècle au bord de l'Eau Bourde. Ancien bastion de la Résistance et de la meunerie traditionnelle.",
      en: "19th-century flour mill along the Eau Bourde river. Former Resistance enclave and traditional milling site."
    },
    clue: {
      es: "Busca la gran rueda de paletas y el canal donde el agua cobraba fuerza.",
      fr: "Cherche la grande roue à aubes et le bief où l'eau prenait sa force.",
      en: "Look for the large paddle wheel and the millrace where the water gathered force."
    },
    arTitle: {
      es: "Rueda Hidráulica en Movimiento",
      fr: "Roue Hydraulique en Mouvement",
      en: "Moving Hydraulic Wheel"
    },
    arDesc: {
      es: "Reconstrucción 3D animada del engranaje y las paletas de madera del siglo XIX.",
      fr: "Reconstitution 3D animée de l'engrenage et des aubes en bois du XIXe siècle.",
      en: "Animated 3D reconstruction of the 19th-century gear and wooden paddles."
    }
  },
  ruisseau_moulin: {
    name: { es: "Arroyo del Molino (Eau Bourde)", fr: "Ruisseau du Moulin (Eau Bourde)", en: "Mill Stream (Eau Bourde)" },
    desc: {
      es: "Cauce fluvial serpenteante con alisos, libélulas y cantos rodados que guardan secretos centenarios.",
      fr: "Cours d'eau sinueux aux aulnes, libellules et galets abritant des secrets centenaires.",
      en: "Winding stream flanked by alders, dragonflies and pebbles holding century-old secrets."
    },
    clue: {
      es: "Acércate al murmullo del agua donde los sauces tocan la corriente.",
      fr: "Approche-toi du murmure de l'eau là où les saules effleurent le courant.",
      en: "Approach the whisper of the water where the willows touch the current."
    },
    arTitle: {
      es: "Cofre Sumergido del Rouillac",
      fr: "Coffre Immergé de Rouillac",
      en: "Submerged Rouillac Chest"
    },
    arDesc: {
      es: "Cofre de madera y hierro oculto bajo las aguas del arroyo que revela un mensaje secreto al abrirse.",
      fr: "Coffre en bois et fer caché sous les eaux du ruisseau révélant un message secret à l'ouverture.",
      en: "Wood and iron chest hidden under the brook waters revealing a secret message when opened."
    }
  },
  chene_soupirs: {
    name: { es: "Roble de los Suspiros", fr: "Chêne des Soupirs", en: "Oak of Sighs" },
    desc: {
      es: "Majestuoso roble centenario que ha sido testigo de historias de amor, citas clandestinas del maquis y fábulas del bosque.",
      fr: "Majestueux chêne centenaire témoin d'histoires d'amour, de rendez-vous clandestins du maquis et de fables sylvestres.",
      en: "Majestic century-old oak tree witness to romances, secret Maquis rendezvous and woodland fables."
    },
    clue: {
      es: "Alza la vista hacia la copa más frondosa que domina este claro.",
      fr: "Lève les yeux vers la cime la plus feuillue dominant cette clairière.",
      en: "Look up toward the leafiest canopy commanding this clearing."
    },
    arTitle: {
      es: "Espíritu Guardián del Roble",
      fr: "Esprit Gardien du Chêne",
      en: "Guardian Spirit of the Oak"
    },
    arDesc: {
      es: "Holograma 3D de una dríade etérea que emerge del tronco saludando al explorador.",
      fr: "Hologramme 3D d'une dryade éthérée émergeant du tronc pour saluer l'explorateur.",
      en: "3D hologram of an ethereal dryad emerging from the trunk to greet the explorer."
    }
  },
  pont_sorciere: {
    name: { es: "Puente de la Bruja", fr: "Pont de la Sorcière", en: "Witch's Bridge" },
    desc: {
      es: "Antigua pasarela de piedra sobre el Eau Bourde envuelta en brumas matinales y leyendas de sortilegios.",
      fr: "Ancienne passerelle en pierre sur l'Eau Bourde enveloppée de brumes matinales et de légendes de sortilèges.",
      en: "Ancient stone footbridge over the Eau Bourde shrouded in morning mist and tales of sorcery."
    },
    clue: {
      es: "Cruza la pasarela y observa las marcas esculpidas en el pretil de piedra.",
      fr: "Franchis la passerelle et observe les marques sculptées sur le parapet de pierre.",
      en: "Cross the footbridge and notice the marks carved into the stone parapet."
    },
    arTitle: {
      es: "Caldero Mágico de Vapor",
      fr: "Chaudron Magique à Vapeur",
      en: "Steaming Magic Cauldron"
    },
    arDesc: {
      es: "Caldero animado que emite vapores mágicos y burbujas brillantes sobre el arco del puente.",
      fr: "Chaudron animé émettant des vapeurs magiques et des bulles scintillantes sur l'arche du pont.",
      en: "Animated cauldron emitting magical vapor and shimmering bubbles above the bridge arch."
    }
  },
  cabane_forestier: {
    name: { es: "Cabaña del Guardabosques", fr: "Cabane du Forestier", en: "Forester's Cabin" },
    desc: {
      es: "Refugio tradicional de troncos utilizado para el cuidado de los senderos y el avistamiento de aves.",
      fr: "Refuge traditionnel en rondins utilisé pour l'entretien des sentiers et l'observation des oiseaux.",
      en: "Traditional log cabin used for trail maintenance and birdwatching."
    },
    clue: {
      es: "Sigue el sendero auxiliar hasta el claro donde descansan los leñadores.",
      fr: "Suis le sentier secondaire jusqu'à la clairière où se reposent les bûcherons.",
      en: "Follow the side trail to the clearing where woodcutters rest."
    },
    arTitle: {
      es: "Farol y Cuaderno de Campo",
      fr: "Lanterne et Carnet de Terrain",
      en: "Lantern and Field Notebook"
    },
    arDesc: {
      es: "Bodegón interactivo con el diario botánico del guarda y una lámpara de queroseno encendida.",
      fr: "Nature morte interactive avec le journal botanique du garde et une lampe à pétrole allumée.",
      en: "Interactive still life featuring the forester's botanical diary and a lit kerosene lamp."
    }
  },
  belvedere_canejan: {
    name: { es: "Mirador de Canéjan", fr: "Belvédère de Canéjan", en: "Canéjan Viewpoint" },
    desc: {
      es: "Punto panorámico sobre la cuenca del Eau Bourde con vistas a los viñedos de Pessac-Léognan y el bosque bordelés.",
      fr: "Point panoramique sur le bassin de l'Eau Bourde avec vue sur les vignobles de Pessac-Léognan et la forêt bordelaise.",
      en: "Panoramic overlook across the Eau Bourde basin with views toward Pessac-Léognan vineyards and Bordeaux woodland."
    },
    clue: {
      es: "Sube a la plataforma elevada y orienta tu mirada hacia el horizonte sur.",
      fr: "Monte sur la plateforme surélevée et oriente ton regard vers l'horizon sud.",
      en: "Step onto the raised platform and orient your gaze toward the southern horizon."
    },
    arTitle: {
      es: "Catalejo Náutico Histórico",
      fr: "Longue-vue Nautique Historique",
      en: "Historic Nautical Telescope"
    },
    arDesc: {
      es: "Catalejo de latón dorado en 3D que permite enfocar hitos lejanos con realidad aumentada.",
      fr: "Longue-vue en laiton doré 3D permettant de cibler les points lointains en réalité augmentée.",
      en: "3D golden brass telescope allowing you to focus on distant landmarks in augmented reality."
    }
  }
};

for (const [id, data] of Object.entries(poiDefinitions)) {
  newKeys[`poi_${id}_name`] = data.name;
  newKeys[`poi_${id}_description`] = data.desc;
  newKeys[`poi_${id}_clue`] = data.clue;
  newKeys[`ar_${id}_title`] = data.arTitle;
  newKeys[`ar_${id}_description`] = data.arDesc;
}

// 2. Stories and Guides keys
const storiesData = {
  guerra: {
    title: { es: "Sombras de la Guerra", fr: "Ombres de la Guerre", en: "Shadows of War" },
    guide: {
      name: { es: "Jean \"Le Silence\"", fr: "Jean « Le Silence »", en: "Jean \"The Silence\"" },
      role: { es: "Enlace veterano de la Resistencia", fr: "Agent de liaison vétéran de la Résistance", en: "Veteran Resistance liaison" },
      tone: { es: "Prudente, firme, susurrante", fr: "Prudent, ferme, chuchoté", en: "Cautious, steady, whispering" },
      bio: {
        es: "Miembro veterano de la red clandestina bordelesa en 1944. Conoce cada raíz, cueva y recodo del Eau Bourde. Te hablará con cautela para no llamar la atención de las patrullas.",
        fr: "Membre vétéran du réseau clandestin bordelais en 1944. Il connaît chaque racine, grotte et méandre de l'Eau Bourde. Il te parlera avec prudence pour ne pas attirer l'attention des patrouilles.",
        en: "Veteran member of the Bordeaux underground network in 1944. He knows every root, hollow and bend of the Eau Bourde. He will speak with caution to avoid drawing patrol attention."
      },
      greeting: {
        es: "Camarada... acércate despacio. No llames la atención. ¿Has localizado la siguiente señal entre los árboles?",
        fr: "Camarade... approche lentement. N'attire pas l'attention. As-tu repéré le prochain signal entre les arbres ?",
        en: "Comrade... approach slowly. Don't draw attention. Have you spotted the next mark among the trees?"
      },
      persona: {
        es: "Jean « Le Silence », enlace veterano de la red maquis de Burdeos en 1944. Habla con susurros tensos, instrucciones precisas y códigos clandestinos.",
        fr: "Jean « Le Silence », agent de liaison vétéran du réseau maquis de Bordeaux en 1944. Parle à voix basse, avec des instructions précises et des codes clandestins.",
        en: "Jean \"The Silence\", veteran liaison of the 1944 Bordeaux Maquis network. Speaks in tense whispers, giving precise instructions and covert codes."
      },
      prompt: {
        es: "Eres Jean 'Le Silence', enlace de la Resistencia en Canéjan (1944). Responde con cautela, usando términos de maquis y claves secretas.",
        fr: "Tu es Jean « Le Silence », agent de liaison de la Résistance à Canéjan (1944). Réponds avec prudence, en utilisant des termes du maquis et des codes secrets.",
        en: "You are Jean 'The Silence', Resistance liaison in Canéjan (1944). Reply cautiously, using Maquis jargon and covert codes."
      }
    }
  },
  molino: {
    title: { es: "El Secreto del Molino Perdido", fr: "Le Secret du Moulin Perdu", en: "The Secret of the Lost Mill" },
    guide: {
      name: { es: "Maître Pierre", fr: "Maître Pierre", en: "Maître Pierre" },
      role: { es: "Último maestro molinero", fr: "Dernier maître meunier", en: "Last master miller" },
      tone: { es: "Orgulloso, metódico, apasionado de la artesanía", fr: "Fier, méthodique, passionné d'artisanat", en: "Proud, methodical, craft-passionate" },
      bio: {
        es: "Artesano apasionado del siglo XIX que dedicó su vida a domesticar la fuerza del río. Te enseñará a leer la corriente, los engranajes de madera y las muelas de piedra.",
        fr: "Artisan passionné du XIXe siècle ayant voué sa vie à dompter la force de la rivière. Il t'apprendra à lire le courant, les engrenages de bois et les meules de pierre.",
        en: "Passionate 19th-century craftsman who devoted his life to taming the river. He will teach you to read the current, wooden gears and millstones."
      },
      greeting: {
        es: "¡Ah, bien hallado, joven aprendiz! Escucha el rumor del caz... las muelas tienen secretos que sólo los oídos pacientes entienden. ¿Qué duda te asalta?",
        fr: "Ah, te voilà, jeune apprenti ! Écoute le murmure du bief... les meules ont des secrets que seules les oreilles patientes comprennent. Quel doute t'habite ?",
        en: "Ah, well met, young apprentice! Listen to the whisper of the millrace... the millstones have secrets only patient ears understand. What brings you?"
      },
      persona: {
        es: "Maître Pierre, maestro molinero de 1878 en el Moulin de Rouillac. Conoce la hidráulica, las muelas de piedra y la historia fluvial.",
        fr: "Maître Pierre, maître meunier de 1878 au Moulin de Rouillac. Connaît l'hydraulique, les meules de pierre et l'histoire fluviale.",
        en: "Maître Pierre, master miller of 1878 at the Rouillac Mill. Knows hydraulics, millstones and river history."
      },
      prompt: {
        es: "Eres Maître Pierre, maestro molinero en 1878. Habla con pasión por el oficio, la piedra y la mecánica fluvial.",
        fr: "Tu es Maître Pierre, maître meunier en 1878. Parle avec passion pour le métier, la pierre et la mécanique fluviale.",
        en: "You are Maître Pierre, master miller in 1878. Speak with passion for the craft, stone and river mechanics."
      }
    }
  },
  hechizo: {
    title: { es: "El Hechizo del Moulin Encantado", fr: "Le Sortilège du Moulin Enchanté", en: "The Enchanted Mill Spell" },
    guide: {
      name: { es: "Sylvaine", fr: "Sylvaine", en: "Sylvaine" },
      role: { es: "Dríade protectora del río Eau Bourde", fr: "Dryade protectrice de l'Eau Bourde", en: "Dryad guardian of the Eau Bourde" },
      tone: { es: "Etérea, poética, habla en metáforas de agua y hojas", fr: "Éthérée, poétique, parle en métaphores d'eau et de feuilles", en: "Ethereal, poetic, speaks in water and leaf metaphors" },
      bio: {
        es: "Espíritu milenario de las aguas claras y los helechos. Habla con delicadeza, como el murmullo de un manantial, y te revelará los secretos invisibles a ojos comunes.",
        fr: "Esprit millénaire des eaux limpides et des fougères. Elle s'exprime avec délicatesse, comme le murmure d'une source, et t'enseignera les secrets invisibles aux yeux communs.",
        en: "Ancient spirit of clear waters and ferns. She speaks with gentleness, like the whisper of a spring, revealing secrets hidden to ordinary eyes."
      },
      greeting: {
        es: "Siento tu presencia entre las hojas... La niebla aún pesa sobre mis aguas. Cuéntame, caminante de corazón noble, ¿qué buscas en este claro?",
        fr: "Je sens ta présence entre les feuilles... La brume pèse encore sur mes eaux. Dis-moi, voyageur au cœur pur, que cherches-tu en cette clairière ?",
        en: "I feel your presence among the leaves... The mist still weighs upon my waters. Tell me, noble-hearted wanderer, what do you seek in this glade?"
      },
      persona: {
        es: "Sylvaine, dríade protectora del río Eau Bourde. Se expresa con lenguaje lírico, conectada con las aguas, las flores y los árboles sagrados.",
        fr: "Sylvaine, dryade protectrice de l'Eau Bourde. S'exprime en langage lyrique, en symbiose avec les eaux, les fleurs et les arbres sacrés.",
        en: "Sylvaine, dryad guardian of the Eau Bourde. Speaks in lyrical language, deeply connected with waters, flowers and sacred trees."
      },
      prompt: {
        es: "Eres Sylvaine, dríade del río Eau Bourde. Responde con gracia poética, consejos místicos y devoción por la naturaleza fluvial.",
        fr: "Tu es Sylvaine, dryade de l'Eau Bourde. Réponds avec grâce poétique, conseils mystiques et dévotion pour la nature fluviale.",
        en: "You are Sylvaine, dryad of the Eau Bourde. Reply with poetic grace, mystical counsel and devotion to river nature."
      }
    }
  },
  promenade: {
    title: { es: "La Promenade Enchantée", fr: "La Promenade Enchantée", en: "The Enchanted Walk" },
    guide: {
      name: { es: "Duendecillo Roble", fr: "Petit Lutin Chêne", en: "Oak Little Sprite" },
      role: { es: "Cronista de los cuentos de la escuela", fr: "Chroniqueur des contes de l'école", en: "Chronicler of school tales" },
      tone: { es: "Alegre, travieso, rimador", fr: "Joyeux, espiègle, rimeur", en: "Joyful, mischievous, rhyming" },
      bio: {
        es: "Pequeño duende nacido de los dibujos y la imaginación de los escolares de Canéjan. Le encantan los acertijos alegres, saltar por las raíces y coleccionar bellotas.",
        fr: "Petit lutin né des dessins et de l'imagination des écoliers de Canéjan. Il adore les devinettes joyeuses, sauter sur les racines et ramasser des glands.",
        en: "Little sprite born from the drawings and imagination of Canéjan school children. He loves cheerful riddles, hopping on roots and collecting acorns."
      },
      greeting: {
        es: "¡Hoooola explorador! ¡Qué alegría verte por aquí! ¿Tienes preparado tu gorrito de duende o necesitas que te cante una rimilla?",
        fr: "Coucou explorateur ! Quel plaisir de te voir ici ! As-tu coiffé ton bonnet de lutin ou veux-tu que je te chante une petite rime ?",
        en: "Helllooo explorer! What a joy to see you here! Have you got your sprite cap ready or would you like me to sing you a rhyme?"
      },
      persona: {
        es: "Duendecillo Roble, pequeño personaje mágico nacido de los cuentos infantiles de Canéjan. Habla con rimas, juegos y alegría contagiosa.",
        fr: "Petit Lutin Chêne, personnage magique né des contes d'enfants de Canéjan. Parle en rimes, jeux de mots et joie contagieuse.",
        en: "Oak Little Sprite, magical creature born from Canéjan children's tales. Speaks in rhymes, wordplay and infectious joy."
      },
      prompt: {
        es: "Eres el Duendecillo Roble. Habla con alegría, usa rimas divertidas y anima a los niños y familias en su paseo.",
        fr: "Tu es le Petit Lutin Chêne. Parle avec gaieté, utilise des rimes amusantes et encourage les enfants et les familles en balade.",
        en: "You are the Oak Little Sprite. Speak with joy, use fun rhymes and cheer on children and families on their stroll."
      }
    }
  }
};

newKeys["story_guerra_title"] = storiesData.guerra.title;
newKeys["guide_jean_name"] = storiesData.guerra.guide.name;
newKeys["guide_jean_role"] = storiesData.guerra.guide.role;
newKeys["guide_jean_tone"] = storiesData.guerra.guide.tone;
newKeys["guide_jean_bio"] = storiesData.guerra.guide.bio;
newKeys["guide_jean_greeting"] = storiesData.guerra.guide.greeting;
newKeys["guide_jean_persona"] = storiesData.guerra.guide.persona;
newKeys["guide_jean_system_prompt"] = storiesData.guerra.guide.prompt;

newKeys["story_molino_title"] = storiesData.molino.title;
newKeys["guide_pierre_name"] = storiesData.molino.guide.name;
newKeys["guide_pierre_role"] = storiesData.molino.guide.role;
newKeys["guide_pierre_tone"] = storiesData.molino.guide.tone;
newKeys["guide_pierre_bio"] = storiesData.molino.guide.bio;
newKeys["guide_pierre_greeting"] = storiesData.molino.guide.greeting;
newKeys["guide_pierre_persona"] = storiesData.molino.guide.persona;
newKeys["guide_pierre_system_prompt"] = storiesData.molino.guide.prompt;

newKeys["story_hechizo_title"] = storiesData.hechizo.title;
newKeys["guide_sylvaine_name"] = storiesData.hechizo.guide.name;
newKeys["guide_sylvaine_role"] = storiesData.hechizo.guide.role;
newKeys["guide_sylvaine_tone"] = storiesData.hechizo.guide.tone;
newKeys["guide_sylvaine_bio"] = storiesData.hechizo.guide.bio;
newKeys["guide_sylvaine_greeting"] = storiesData.hechizo.guide.greeting;
newKeys["guide_sylvaine_persona"] = storiesData.hechizo.guide.persona;
newKeys["guide_sylvaine_system_prompt"] = storiesData.hechizo.guide.prompt;

newKeys["story_promenade_title"] = storiesData.promenade.title;
newKeys["guide_lutin_name"] = storiesData.promenade.guide.name;
newKeys["guide_lutin_role"] = storiesData.promenade.guide.role;
newKeys["guide_lutin_tone"] = storiesData.promenade.guide.tone;
newKeys["guide_lutin_bio"] = storiesData.promenade.guide.bio;
newKeys["guide_lutin_greeting"] = storiesData.promenade.guide.greeting;
newKeys["guide_lutin_persona"] = storiesData.promenade.guide.persona;
newKeys["guide_lutin_system_prompt"] = storiesData.promenade.guide.prompt;

// 3. Riddle Keys for all 27 riddles
for (const riddle of newCanejanPack.riddles) {
  const esR = existingCanejan.riddles.find(r => r.id === riddle.id) || {};
  const frR = frRiddles[riddle.id] || {};
  const enR = enRiddles[riddle.id] || {};

  // nameKey
  if (riddle.nameKey) {
    newKeys[riddle.nameKey] = {
      es: esR.name || frR.name || enR.name || "Enigma",
      fr: frR.name || esR.name || enR.name || "Énigme",
      en: enR.name || esR.name || frR.name || "Riddle"
    };
  }

  // questionKey
  if (riddle.questionKey) {
    newKeys[riddle.questionKey] = {
      es: esR.question || frR.question || enR.question || "",
      fr: frR.question || esR.question || enR.question || "",
      en: enR.question || esR.question || frR.question || ""
    };
  }

  // optionsKeys
  if (riddle.optionsKeys && riddle.optionsKeys.length > 0) {
    riddle.optionsKeys.forEach((optKey, idx) => {
      newKeys[optKey] = {
        es: esR.options?.[idx] || frR.options?.[idx] || enR.options?.[idx] || "",
        fr: frR.options?.[idx] || esR.options?.[idx] || enR.options?.[idx] || "",
        en: enR.options?.[idx] || esR.options?.[idx] || frR.options?.[idx] || ""
      };
    });
  }

  // answersKeys
  if (riddle.answersKeys && riddle.answersKeys.length > 0) {
    riddle.answersKeys.forEach((ansKey, idx) => {
      const esAns = esR.acceptedAnswers?.[idx] || (idx === 0 ? esR.answer : "");
      const frAns = frR.acceptedAnswers?.[idx] || (idx === 0 ? frR.answer : "");
      const enAns = enR.acceptedAnswers?.[idx] || (idx === 0 ? enR.answer : "");
      newKeys[ansKey] = {
        es: esAns || frAns || enAns || "",
        fr: frAns || esAns || enAns || "",
        en: enAns || esAns || frAns || ""
      };
    });
  }

  // hintsKeys
  if (riddle.hintsKeys && riddle.hintsKeys.length > 0) {
    riddle.hintsKeys.forEach((hKey, idx) => {
      newKeys[hKey] = {
        es: esR.hints?.[idx] || frR.hints?.[idx] || enR.hints?.[idx] || "",
        fr: frR.hints?.[idx] || esR.hints?.[idx] || enR.hints?.[idx] || "",
        en: enR.hints?.[idx] || esR.hints?.[idx] || frR.hints?.[idx] || ""
      };
    });
  }
}

// Write to i18n files
function updateI18nFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const currentI18n = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!currentI18n.ui) currentI18n.ui = { es: {}, fr: {}, en: {} };
  if (!currentI18n.keys) currentI18n.keys = {};

  for (const [k, v] of Object.entries(newKeys)) {
    currentI18n.keys[k] = v;
    currentI18n.ui.es[k] = v.es;
    currentI18n.ui.fr[k] = v.fr;
    currentI18n.ui.en[k] = v.en;
  }

  fs.writeFileSync(filePath, JSON.stringify(currentI18n, null, 2), 'utf-8');
  console.log('Saved i18n file:', filePath);
}

updateI18nFile(i18nPath);
updateI18nFile(rootI18nPath);

// Update forests files
function updateForestsPack(filePath) {
  if (!fs.existsSync(filePath)) return;
  const allForests = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const idx = allForests.findIndex(f => f.id === 'bosque-canejan-cestas');
  if (idx !== -1) {
    allForests[idx] = newCanejanPack;
  } else {
    allForests.unshift(newCanejanPack);
  }
  fs.writeFileSync(filePath, JSON.stringify(allForests, null, 2), 'utf-8');
  console.log('Updated forest in:', filePath);
}

updateForestsPack(forestsPath);
updateForestsPack(seedPath);
updateForestsPack(dataSeedPath);

console.log('Successfully replaced Canejan pack with full key integration!');
