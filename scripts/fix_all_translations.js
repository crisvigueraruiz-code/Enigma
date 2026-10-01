import fs from 'fs';
import path from 'path';

const i18nPath = path.resolve('src/data/i18n.json');
const rootI18nPath = path.resolve('i18n.json');
const forestsPath = path.resolve('data/forests.json');
const seedPath = path.resolve('forest-packs-seed.json');
const dataSeedPath = path.resolve('data/forest-packs-seed.json');

const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf-8'));

// 1. Forest Level Keys
const forestKeys = {
  "forest_canejan_name": {
    "es": "Bosque de Canéjan-Cestas",
    "fr": "Forêt de Canéjan-Cestas",
    "en": "Canéjan-Cestas Forest"
  },
  "forest_canejan_description": {
    "es": "Senda boscosa a lo largo del río Eau Bourde entre molinos centenarios, robles mágicos y leyendas de la resistencia bordelesa.",
    "fr": "Sentier forestier le long de l'Eau Bourde entre moulins centenaires, chênes magiques et légendes de la résistance bordelaise.",
    "en": "Wooded trail along the Eau Bourde river among centennial mills, magical oaks, and Bordeaux resistance legends."
  },
  "forest_canejan_country": {
    "es": "Francia (Gironde)",
    "fr": "France (Gironde)",
    "en": "France (Gironde)"
  },
  "forest_nalda_name": {
    "es": "Nalda (La Rioja)",
    "fr": "Nalda (La Rioja)",
    "en": "Nalda (La Rioja)"
  },
  "forest_nalda_description": {
    "es": "Un bosque de historia, piedra y río en el Valle del Iregua. Recorre castillo, arco, cuevas y ermita para recomponer el sello NALDA.",
    "fr": "Une forêt d'histoire, de pierre et de rivière dans la vallée de l'Iregua. Explore château, arche, grottes et ermitage pour recomposer le sceau NALDA.",
    "en": "A forest of history, stone, and river in the Iregua Valley. Explore castle, arch, caves, and hermitage to assemble the NALDA seal."
  },
  "forest_nalda_country": {
    "es": "España (La Rioja)",
    "fr": "Espagne (La Rioja)",
    "en": "Spain (La Rioja)"
  },

  // Guide Roles for Nalda
  "guide_cronicon_role": {
    "es": "Monje copista del siglo XIV (San Millán de la Cogolla)",
    "fr": "Moine copiste du XIVe siècle (San Millán de la Cogolla)",
    "en": "14th-century copyist monk (San Millán de la Cogolla)"
  },
  "guide_fray_role": {
    "es": "Fraile pícaro y devoto de las bodegas",
    "fr": "Moine rusé et fervent amateur des caves",
    "en": "Roguish friar and cellar enthusiast"
  },
  "guide_chucho_role": {
    "es": "Líder canalla de la bandada de Los Palomares",
    "fr": "Chef canaille de la bande de Los Palomares",
    "en": "Streetwise flock leader of Los Palomares"
  },
  "guide_zorbo_role": {
    "es": "Explorador cósmico del sector estelar ZX-4",
    "fr": "Explorateur cosmique du secteur stellaire ZX-4",
    "en": "Cosmic explorer from star sector ZX-4"
  }
};

// 2. UI Keys
const uiKeys = {
  "home.heroBadge": {
    "es": "Side Quest de Rastreo Narrativo al Aire Libre",
    "fr": "Side Quest de Pistage Narratif en Plein Air",
    "en": "Outdoor Narrative Tracking Side Quest"
  },
  "home.heroDesc": {
    "es": "Recorre parajes naturales reales con geolocalización GPS, resuelve enigmas sobre hitos patrimoniales y conversa en tiempo real por voz con personajes históricos y fantásticos impulsados por IA.",
    "fr": "Parcours des sites naturels réels avec géolocalisation GPS, résous des énigmes patrimoniales et discute en direct à la voix avec des personnages historiques et féeriques propulsés par l'IA.",
    "en": "Hike real natural landscapes with GPS geolocation, solve heritage riddles, and chat live by voice with historical and fantasy characters powered by AI."
  },
  "home.statForests": {
    "es": "{count} Bosques Georreferenciados",
    "fr": "{count} Forêts Géoréférencées",
    "en": "{count} Georeferenced Forests"
  },
  "home.statStories": {
    "es": "{count} Historias Diferentes",
    "fr": "{count} Histoires Différentes",
    "en": "{count} Distinct Stories"
  },
  "home.statPois": {
    "es": "{count} Hitos Patrimoniales",
    "fr": "{count} Jalons Patrimoniaux",
    "en": "{count} Heritage Landmarks"
  },
  "home.statTech": {
    "es": "Gemini 3.8 Live & Realidad Aumentada",
    "fr": "Gemini 3.8 Live & Réalité Augmentée",
    "en": "Gemini 3.8 Live & Augmented Reality"
  },
  "home.exploreBtn": {
    "es": "Explorar Bosques Disponibles",
    "fr": "Explorer les Forêts Disponibles",
    "en": "Explore Available Forests"
  },
  "home.resumeBtn": {
    "es": "Reanudar con Código",
    "fr": "Reprendre avec un Code",
    "en": "Resume with Code"
  },
  "home.territoriesTitle": {
    "es": "Bosques y Territorios",
    "fr": "Forêts et Territoires",
    "en": "Forests and Territories"
  },
  "home.territoriesSubtitle": {
    "es": "Selecciona tu destino para elegir historia, duración (30min - 2h) y dificultad.",
    "fr": "Sélectionne ta destination pour choisir histoire, durée (30 min - 2 h) et difficulté.",
    "en": "Select your destination to choose story, duration (30min - 2h), and difficulty."
  },
  "home.durationsAvailable": {
    "es": "Duraciones disponibles:",
    "fr": "Durées disponibles :",
    "en": "Available durations:"
  },
  "home.storiesAvailable": {
    "es": "Historias disponibles:",
    "fr": "Histoires disponibles :",
    "en": "Available stories:"
  },
  "home.startExpedition": {
    "es": "Iniciar Expedición",
    "fr": "Démarrer l'Expédition",
    "en": "Start Expedition"
  },
  "home.galleryTitle": {
    "es": "Galería de Personajes y Guías de la Senda",
    "fr": "Galerie des Personnages et Guides du Sentier",
    "en": "Trail Characters & Guides Gallery"
  },
  "home.gallerySubtitle": {
    "es": "Conoce a los narradores interactivos de cada historia antes o durante tu expedición.",
    "fr": "Fais la connaissance des narrateurs interactifs de chaque histoire avant ou pendant ton expédition.",
    "en": "Meet the interactive narrators of each story before or during your expedition."
  },
  "home.activeTrail": {
    "es": "Senda activa:",
    "fr": "Sentier en cours :",
    "en": "Active trail:"
  },
  "home.accumulatedPoints": {
    "es": "Puntos acumulados",
    "fr": "Points cumulés",
    "en": "Accumulated points"
  },
  "home.continueBtn": {
    "es": "Continuar",
    "fr": "Continuer",
    "en": "Continue"
  },
  "home.resumeCardTitle": {
    "es": "Reanudar Partida con Código de Sesión",
    "fr": "Reprendre la Partie avec un Code",
    "en": "Resume Game with Session Code"
  },
  "home.resumeCardDesc": {
    "es": "Introduce tu código alfanumérico para volver a tu expedición exactamente donde la dejaste.",
    "fr": "Saisis ton code alphanumérique pour retrouver ton expédition exactement là où tu l'as laissée.",
    "en": "Enter your alphanumeric code to return to your expedition exactly where you left off."
  },
  "home.enterCodeBtn": {
    "es": "Introducir Código",
    "fr": "Saisir le Code",
    "en": "Enter Code"
  },

  "characters.title": {
    "es": "Personajes Vivos del Bosque",
    "fr": "Personnages Vivants de la Forêt",
    "en": "Living Forest Characters"
  },
  "characters.subtitle": {
    "es": "Habla por voz o chat con los espíritus, cronistas, monjes y guardianes de cada historia. Cada uno conoce los secretos reales de su sendero.",
    "fr": "Échange à la voix ou par chat avec les esprits, chroniqueurs, moines et gardiens de chaque histoire. Chacun détient les secrets de son sentier.",
    "en": "Talk by voice or chat with spirits, chroniclers, monks, and guardians of each story. Each knows the real secrets of their trail."
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
    "fr": "Jouer avec ce personnage dans son histoire",
    "en": "Play with this character in their story"
  },

  "chat.listening": {
    "es": "Te escucha atentamente... ¡habla!",
    "fr": "T'écoute attentivement... parle !",
    "en": "Listening attentively... speak!"
  },
  "chat.pressMic": {
    "es": "Pulsa el micrófono para hablar con el personaje",
    "fr": "Appuie sur le micro pour parler au personnage",
    "en": "Tap the microphone to speak with the character"
  },
  "chat.tapMute": {
    "es": "Toca para silenciar micrófono",
    "fr": "Touche pour couper le micro",
    "en": "Tap to mute microphone"
  },
  "chat.tapTalk": {
    "es": "Toca para hablar con tu voz",
    "fr": "Touche pour parler à la voix",
    "en": "Tap to speak with your voice"
  },
  "chat.suggestedQuestions": {
    "es": "Preguntas sugeridas a {name}:",
    "fr": "Questions suggérées à {name} :",
    "en": "Suggested questions for {name}:"
  },
  "chat.startConversation": {
    "es": "Inicia la conversación preguntándole cualquier curiosidad a {name}.",
    "fr": "Démarre la conversation en posant n'importe quelle question à {name}.",
    "en": "Start the conversation by asking {name} about anything."
  },
  "chat.you": {
    "es": "Tú",
    "fr": "Toi",
    "en": "You"
  },

  "setup.adultWarningTitle": {
    "es": "Aviso de Contenido Adulto (+18)",
    "fr": "Avertissement Contenu Adulte (+18)",
    "en": "Adult Content Warning (+18)"
  },
  "briefing.adultWarningTitle": {
    "es": "Aviso de Contenido Adulto (+18)",
    "fr": "Avertissement Contenu Adulte (+18)",
    "en": "Adult Content Warning (+18)"
  },
  "game.ambientDefaultText": {
    "es": "Observa detenidamente lo que te rodea en este rincón del bosque.",
    "fr": "Observe attentivement ce qui t'entoure dans ce recoin de la forêt.",
    "en": "Carefully observe your surroundings in this corner of the forest."
  },
  "footer.tagline": {
    "es": "Rutas y acertijos al aire libre",
    "fr": "Sentiers et énigmes en plein air",
    "en": "Outdoor trails and riddles"
  },
  "footer.admin": {
    "es": "Acceso organizador",
    "fr": "Accès organisateur",
    "en": "Organizer access"
  }
};

// 3. Scene Narratives Keys for Canéjan and Nalda (in 3 languages)
const sceneNarrativeKeys = {
  // Canéjan - Guerra
  "guerra_moulin_rouillac": {
    "es": "Las viejas muelas del molino guardan el eco de las reuniones clandestinas de 1944. Busca las señales del maquis.",
    "fr": "Les vieilles meules du moulin gardent l'écho des réunions clandestines de 1944. Cherche les signes du maquis.",
    "en": "The old millstones hold the echo of 1944 clandestine meetings. Look for the Maquis signs."
  },
  "guerra_ruisseau_moulin": {
    "es": "El rumor del agua amortigua tus pasos. En este arroyo la Resistencia sumergió mensajes en cilindros estancos.",
    "fr": "Le murmure de l'eau étouffe tes pas. Dans ce ruisseau, la Résistance a immergé des messages dans des cylindres étanches.",
    "en": "The whisper of water muffles your footsteps. In this brook, the Resistance submerged messages in watertight cylinders."
  },
  "guerra_chene_soupirs": {
    "es": "Bajo las ramas protectoras del roble centenario, los enlaces dejaban contraseñas talladas en la corteza.",
    "fr": "Sous les branches protectrices du chêne centenaire, les agents de liaison laissaient des mots de passe gravés dans l'écorce.",
    "en": "Beneath the protective boughs of the century-old oak, couriers carved passwords into the bark."
  },
  "guerra_pont_sorciere": {
    "es": "El puente de piedra domina el paso sobre el recodo fluvial. Vigila los caminos antes de cruzar.",
    "fr": "Le pont de pierre domine le passage sur le méandre fluvial. Surveille les chemins avant de traverser.",
    "en": "The stone bridge commands the crossing over the river bend. Watch the roads before crossing."
  },
  "guerra_cabane_forestier": {
    "es": "Un refugio de resineros apartado del sendero principal. Aquí descansaban los maquis perseguidos.",
    "fr": "Un abri de résiniers à l'écart du sentier principal. Les maquisards traqués y trouvaient refuge.",
    "en": "A resin tapper's shelter tucked away from the main trail. Hunted maquisards rested here."
  },
  "guerra_belvedere_canejan": {
    "es": "Desde esta atalaya natural se divisa todo el valle del Eau Bourde hasta los accesos a Burdeos.",
    "fr": "Depuis ce promontoire naturel, on embrasse toute la vallée de l'Eau Bourde jusqu'aux abords de Bordeaux.",
    "en": "From this natural vantage point, the entire Eau Bourde valley stretches toward the approaches to Bordeaux."
  },

  // Canéjan - Molino Perdido
  "molino_perdido_moulin_rouillac": {
    "es": "Maître Pierre te da la bienvenida al corazón del molino. Escucha el crujido de los engranajes centenarios.",
    "fr": "Maître Pierre te souhaite la bienvenue au cœur du moulin. Écoute le grincement des engrenages centenaires.",
    "en": "Maître Pierre welcomes you to the heart of the mill. Listen to the creak of the century-old gears."
  },
  "molino_perdido_ruisseau_moulin": {
    "es": "El agua límpida corre hacia el caz. Maître Pierre calculó aquí el caudal necesario para mover la gran rueda.",
    "fr": "L'eau claire file vers le bief. Maître Pierre a calculé ici le débit requis pour actionner la grande roue.",
    "en": "Clear water races toward the millrace. Here, Maître Pierre calculated the flow needed to drive the great wheel."
  },
  "molino_perdido_chene_soupirs": {
    "es": "El roble proporcionó la madera más noble y resistente para tallar los dientes de los engranajes.",
    "fr": "Le chêne a fourni le bois le plus noble et résistant pour façonner les dents des engrenages.",
    "en": "The oak provided the noblest, sturdiest timber for carving the gear cogs."
  },
  "molino_perdido_pont_sorciere": {
    "es": "La cantería del puente revela la pericia de los antiguos constructores de las acequias de Canéjan.",
    "fr": "La pierre taillée du pont témoigne du savoir-faire des anciens bâtisseurs des canaux de Canéjan.",
    "en": "The bridge's masonry reveals the skill of the ancient builders of Canéjan's irrigation canals."
  },
  "molino_perdido_cabane_forestier": {
    "es": "En la cabaña se guardaban las herramientas de carpintería y las plantillas de las palas del molino.",
    "fr": "Dans la cabane étaient conservés les outils de charpente et les gabarits des aubes du moulin.",
    "en": "In the cabin, carpentry tools and templates for the mill's paddles were kept."
  },
  "molino_perdido_belvedere_canejan": {
    "es": "Desde la altura del mirador se comprende la pendiente natural que otorga fuerza motriz a todo el río.",
    "fr": "Depuis la hauteur du belvédère, on saisit le dénivelé naturel qui confère sa puissance motrice à toute la rivière.",
    "en": "From the height of the viewpoint, you grasp the natural slope that gives driving force to the entire river."
  },

  // Canéjan - Hechizo Encantado
  "hechizo_encantado_moulin_rouillac": {
    "es": "El agua del molino susurra un lamento apagado por la niebla. Sylvaine te guía para devolverle su melodía.",
    "fr": "L'eau du moulin murmure une complainte étouffée par la brume. Sylvaine te guide pour lui rendre sa mélodie.",
    "en": "The mill water whispers a lament muffled by mist. Sylvaine guides you to restore its melody."
  },
  "hechizo_encantado_ruisseau_moulin": {
    "es": "Las piedras cubiertas de musgo centellean con gotas de rocío mágico. El maleficio comienza a disiparse.",
    "fr": "Les pierres couvertes de mousse scintillent de rosée magique. Le sortilège commence à se dissiper.",
    "en": "Moss-covered stones sparkle with magical dew. The enchantment begins to fade."
  },
  "hechizo_encantado_chene_soupirs": {
    "es": "El espíritu del bosque pulsa en el corazón del gran roble. Sus hojas susurran los secretos de la arboleda.",
    "fr": "L'esprit de la forêt palpite au cœur du grand chêne. Ses feuilles murmurent les secrets du sous-bois.",
    "en": "The spirit of the forest pulses in the heart of the great oak. Its leaves whisper woodland secrets."
  },
  "hechizo_encantado_pont_sorciere": {
    "es": "Bajo las dovelas del puente, las brumas danzan al compás de viejos encantamientos de agua dulce.",
    "fr": "Sous les voussures du pont, les brumes dansent au rythme d'anciens enchantements d'eau douce.",
    "en": "Beneath the bridge's voussoirs, mists dance to the rhythm of ancient freshwater spells."
  },
  "hechizo_encantado_cabane_forestier": {
    "es": "Un círculo de helechos y resina protege la cabaña de los maleficios que vagan con el viento del atardecer.",
    "fr": "Un cercle de fougères et de résine protège la cabane des maléfices qui errent avec le vent du soir.",
    "en": "A circle of ferns and resin shields the cabin from curses wandering on the dusk breeze."
  },
  "hechizo_encantado_belvedere_canejan": {
    "es": "El viento de la cumbre limpia las últimas sombras de niebla revelando el esplendor esmeralda del valle.",
    "fr": "Le vent des hauteurs dissipe les dernières ombres de brume, dévoilant la splendeur émeraude de la vallée.",
    "en": "The hilltop wind clears the last shadows of mist, unveiling the emerald splendor of the valley."
  },

  // Canéjan - Promenade Enchantée
  "promenade_enchantee_moulin_rouillac": {
    "es": "¡El duendecillo del molino se esconde tras las muelas! Busca las huellas diminutas sobre la harina.",
    "fr": "Le petit lutin du moulin se cache derrière les meules ! Cherche les empreintes minuscules dans la farine.",
    "en": "The mill sprite hides behind the millstones! Search for tiny footprints in the flour."
  },
  "promenade_enchantee_ruisseau_moulin": {
    "es": "Los renacuajos y las ranitas cantan las rimas que los niños de Canéjan inventaron junto al agua.",
    "fr": "Les têtards et les grenouilles chantent les rimes imaginées par les écoliers de Canéjan au bord de l'eau.",
    "en": "Tadpoles and frogs sing the rhymes invented by Canéjan pupils beside the water."
  },
  "promenade_enchantee_chene_soupirs": {
    "es": "¡Mira cuántos gorritos de duende han caído de las ramas! El viejo roble sonríe con los juegos infantiles.",
    "fr": "Regarde tous ces chapeaux de lutins tombés des branches ! Le vieux chêne sourit aux jeux d'enfants.",
    "en": "Look how many elf hats have fallen from the branches! The old oak smiles at the children's games."
  },
  "promenade_enchantee_pont_sorciere": {
    "es": "Las esculturas de madera de Divercités cobran vida bajo el puente con historias de brujitas buenas.",
    "fr": "Les sculptures en bois de Divercités s'animent sous le pont avec des histoires de gentilles sorcières.",
    "en": "The wooden sculptures from Divercités come alive beneath the bridge with tales of benevolent witches."
  },
  "promenade_enchantee_cabane_forestier": {
    "es": "La cabaña huele a piñas secas y resina dulce. Un lugar perfecto para merendar y contar cuentos.",
    "fr": "La cabane sent la pomme de pin séchée et la douce résine. Un endroit idéal pour goûter et raconter des contes.",
    "en": "The cabin smells of dried pinecones and sweet resin. A perfect spot for a snack and storytelling."
  },
  "promenade_enchantee_belvedere_canejan": {
    "es": "¡Desde aquí arriba los árboles parecen un mar de brócolis gigantes! A ver quién descubre primero el río.",
    "fr": "D'ici-haut, les arbres ressemblent à une mer de brocolis géants ! Qui apercevra la rivière en premier ?",
    "en": "From up here, the trees look like a sea of giant broccoli! Let's see who spots the river first."
  },

  // Nalda - Guardian Iregua
  "guardian-iregua_castillo-nalda": {
    "es": "El Cronicón contempla las piedras del castillo y te invita a recordar la memoria del siglo XIII.",
    "fr": "Le Cronicón contemple les pierres du château et t'invite à plonger dans la mémoire du XIIIe siècle.",
    "en": "The Cronicón gazes upon the castle stones and invites you to recall the 13th-century memories."
  },
  "guardian-iregua_arco-villa": {
    "es": "El arco delimitaba la frontera de protección de la villa medieval frente a incursiones.",
    "fr": "L'arche marquait la frontière protectrice du village médiéval face aux incursions.",
    "en": "The arch marked the protective boundary of the medieval village against incursions."
  },
  "guardian-iregua_mirador-cameros": {
    "es": "El sonido cantarín del Iregua asciende desde el cañón mientras contemplas la entrada a Cameros.",
    "fr": "Le chant de l'Iregua monte du canyon pendant que tu contemples la porte des Cameros.",
    "en": "The bubbling melody of the Iregua rises from the canyon as you gaze upon the gateway to Cameros."
  },
  "guardian-iregua_cuevas-palomares": {
    "es": "El rumor de las palomas y el eremitorio excavado guardan siglos de recogimiento en la roca.",
    "fr": "Le roucoulement des pigeons et l'ermitage troglodytique abritent des siècles de recueillement dans le roc.",
    "en": "The cooing of pigeons and the carved hermitage keep centuries of sanctuary within the rock."
  },
  "guardian-iregua_ermita-villavieja": {
    "es": "Frente a la ermita, los viñedos de la Rioja susurran la historia de la vendimia y la tradición.",
    "fr": "Face à l'ermitage, les vignobles de la Rioja murmurent l'histoire des vendanges et de la tradition.",
    "en": "In front of the hermitage, the Rioja vineyards whisper the history of harvest and tradition."
  },

  // Nalda - Banda Palomar
  "banda-palomar_castillo-nalda": {
    "es": "Chucho sobrevuela las almenas buscando migas y señalando la vista panorámica.",
    "fr": "Chucho survole les créneaux en quête de miettes et t'indique le panorama.",
    "en": "Chucho flies above the battlements hunting for crumbs and pointing out the panoramic vista."
  },
  "banda-palomar_arco-villa": {
    "es": "Las palomas vigilan el arco de entrada como centinelas con plumas.",
    "fr": "Les pigeons surveillent l'arche d'entrée comme des sentinelles emplumées.",
    "en": "The pigeons keep watch over the entrance arch like feathered sentries."
  },
  "banda-palomar_mirador-cameros": {
    "es": "El viento de Cameros levanta el vuelo de la bandada sobre el desfiladero.",
    "fr": "Le vent des Cameros fait tournoyer la volée au-dessus de la gorge.",
    "en": "The Cameros wind lifts the flock's flight above the gorge."
  },
  "banda-palomar_cuevas-palomares": {
    "es": "¡El hogar supremo! El arrullo de docenas de palomas resuena en los nichos de roca.",
    "fr": "Le repaire suprême ! Le roucoulement de dizaines de pigeons résonne dans les alvéoles de pierre.",
    "en": "The ultimate home! The cooing of dozens of pigeons echoes in the rock niches."
  },
  "banda-palomar_ermita-villavieja": {
    "es": "Chucho se posa en la espadaña contemplando la tranquilidad de los viñedos.",
    "fr": "Chucho se perche sur le clocher-mur en admirant la quiétude des vignes.",
    "en": "Chucho perches on the belfry gazing over the tranquility of the vineyards."
  },

  // Nalda - Expediente Zorbo
  "expediente-zorbo_castillo-nalda": {
    "es": "Zorbo apunta su escáner con pitidos agudos hacia las murallas del siglo XIII.",
    "fr": "Zorbo pointe son scanner qui émet des bips aigus vers les murailles du XIIIe siècle.",
    "en": "Zorbo points his scanner with high-pitched beeps toward the 13th-century ramparts."
  },
  "expediente-zorbo_arco-villa": {
    "es": "Zorbo analiza la puerta de piedra sospechando un campo de contención terrícola.",
    "fr": "Zorbo analyse la porte en pierre, soupçonnant un champ de confinement terrien.",
    "en": "Zorbo scans the stone gate, suspecting a Terran forcefield containment perimeter."
  },
  "expediente-zorbo_mirador-cameros": {
    "es": "Zorbo calibra su brújula galáctica con la cordillera de Cameros de fondo.",
    "fr": "Zorbo étalonne son compas galactique avec la chaîne des Cameros en toile de fond.",
    "en": "Zorbo calibrates his galactic compass against the backdrop of the Cameros mountains."
  },
  "expediente-zorbo_cuevas-palomares": {
    "es": "Zorbo cree haber descubierto los camarotes de hibernación de una nave nodriza.",
    "fr": "Zorbo croit avoir découvert les caissons d'hibernation d'un vaisseau mère.",
    "en": "Zorbo suspects he has uncovered the stasis pods of an ancient mothership."
  },
  "expediente-zorbo_ermita-villavieja": {
    "es": "Zorbo degusta la atmósfera tranquila y registra el néctar de las vides riojanas.",
    "fr": "Zorbo savoure l'atmosphère paisible et consigne les molécules des vignes riojanes.",
    "en": "Zorbo savors the peaceful atmosphere and logs the nectar of Rioja vines."
  },

  // Nalda - Fraile Botijo
  "fraile-botijo_castillo-nalda": {
    "es": "¡Ehhhh, compi! ¡Aquí me encerraron con los pellejos de vino vacíos! Menuda resaca medieval me pillé.",
    "fr": "Eh, l'ami ! C'est ici qu'on m'a enfermé avec des outres de vin vides ! Sacrée gueule de bois médiévale.",
    "en": "Hey, buddy! This is where they locked me up with empty wineskins! What a medieval hangover."
  },
  "fraile-botijo_arco-villa": {
    "es": "Bajo este arco casi pierdo el botijo persiguiendo a una moza... ¡digo, persiguiendo a un penitente!",
    "fr": "Sous cette arche, j'ai failli perdre ma gourde en poursuivant une donzelle... enfin, un pénitent !",
    "en": "Under this arch I almost dropped my jug chasing after a maiden... I mean, chasing a penitent!"
  },
  "fraile-botijo_mirador-cameros": {
    "es": "¡Qué vistas, pardiez! Desde aquí veo si el señor abad viene a buscarme con el báculo levantado.",
    "fr": "Quelle vue, morbleu ! D'ici, je vois si le père abbé arrive avec sa crosse levée.",
    "en": "By Jove, what a view! From here I can spot if the abbot is coming after me with his staff raised."
  },
  "fraile-botijo_cuevas-palomares": {
    "es": "Un eremitorio fresco para echarse una siestecita sin que te molesten los rezos del convento.",
    "fr": "Un ermitage bien frais pour faire un somme sans être dérangé par les prières du couvent.",
    "en": "A cool cave shelter for a quick nap without being bothered by monastery prayers."
  },
  "fraile-botijo_ermita-villavieja": {
    "es": "¡La meta santa! Y lo mejor: rodeada de las benditas cepas del vino de Cameros. ¡Salud y bendición!",
    "fr": "L'étape sainte ! Et le meilleur : entourée des vignes bénies du vin de Cameros. Santé et bénédiction !",
    "en": "The holy finish! Best of all: surrounded by the blessed grapevines of Cameros wine. Cheers and blessings!"
  }
};

// Merge all keys into i18n
const allNewKeys = {
  ...forestKeys,
  ...uiKeys,
  ...sceneNarrativeKeys
};

if (!i18n.keys) i18n.keys = {};
if (!i18n.ui) i18n.ui = { es: {}, fr: {}, en: {} };

for (const [k, v] of Object.entries(allNewKeys)) {
  i18n.keys[k] = v;
  i18n.ui.es[k] = v.es;
  i18n.ui.fr[k] = v.fr;
  i18n.ui.en[k] = v.en;
}

fs.writeFileSync(i18nPath, JSON.stringify(i18n, null, 2), 'utf-8');
fs.writeFileSync(rootI18nPath, JSON.stringify(i18n, null, 2), 'utf-8');
console.log('Saved all new keys in i18n.json');

// Update forests.json, forest-packs-seed.json, data/forest-packs-seed.json
function updateForestFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return;
  const forests = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));

  // 1. Canéjan
  const canejan = forests.find(f => f.id === 'bosque-canejan-cestas');
  if (canejan) {
    canejan.nameKey = 'forest_canejan_name';
    canejan.descriptionKey = 'forest_canejan_description';
  }

  // 2. Nalda
  const nalda = forests.find(f => f.id === 'nalda');
  if (nalda) {
    nalda.nameKey = 'forest_nalda_name';
    nalda.descriptionKey = 'forest_nalda_description';

    // Assign POI keys
    const naldaPoiKeyMap = {
      'castillo-nalda': { nameKey: 'poi_castillo_name', descriptionKey: 'poi_castillo_description', clueSnippetKey: 'poi_castillo_clue' },
      'arco-villa': { nameKey: 'poi_arco_name', descriptionKey: 'poi_arco_description', clueSnippetKey: 'poi_arco_clue' },
      'mirador-cameros': { nameKey: 'poi_mirador_name', descriptionKey: 'poi_mirador_description', clueSnippetKey: 'poi_mirador_clue' },
      'cuevas-palomares': { nameKey: 'poi_cuevas_name', descriptionKey: 'poi_cuevas_description', clueSnippetKey: 'poi_cuevas_clue' },
      'ermita-villavieja': { nameKey: 'poi_ermita_name', descriptionKey: 'poi_ermita_description', clueSnippetKey: 'poi_ermita_clue' },
    };

    nalda.pois = nalda.pois.map(poi => {
      const keys = naldaPoiKeyMap[poi.id];
      if (keys) {
        return {
          ...poi,
          nameKey: keys.nameKey,
          descriptionKey: keys.descriptionKey,
          clueSnippetKey: keys.clueSnippetKey
        };
      }
      return poi;
    });

    // Assign Story keys
    const naldaStoryKeyMap = {
      'guardian-iregua': {
        titleKey: 'story_guardian_title',
        summaryKey: 'story_guardian_summary',
        narrativeKey: 'story_guardian_narrative',
        missionKey: 'story_guardian_mission',
        narratorNameKey: 'guide_cronicon_name',
        narratorRoleKey: 'guide_cronicon_role'
      },
      'fraile-botijo': {
        titleKey: 'story_fray_title',
        summaryKey: 'story_fray_summary',
        narrativeKey: 'story_fray_narrative',
        missionKey: 'story_fray_mission',
        narratorNameKey: 'guide_fray_name',
        narratorRoleKey: 'guide_fray_role'
      },
      'banda-palomar': {
        titleKey: 'story_palomar_title',
        summaryKey: 'story_palomar_summary',
        narrativeKey: 'story_palomar_narrative',
        missionKey: 'story_palomar_mission',
        narratorNameKey: 'guide_chucho_name',
        narratorRoleKey: 'guide_chucho_role'
      },
      'expediente-zorbo': {
        titleKey: 'story_zorbo_title',
        summaryKey: 'story_zorbo_summary',
        narrativeKey: 'story_zorbo_narrative',
        missionKey: 'story_zorbo_mission',
        narratorNameKey: 'guide_zorbo_name',
        narratorRoleKey: 'guide_zorbo_role'
      }
    };

    nalda.stories = nalda.stories.map(st => {
      const keys = naldaStoryKeyMap[st.id];
      if (keys) {
        return {
          ...st,
          titleKey: keys.titleKey,
          summaryKey: keys.summaryKey,
          narrativeKey: keys.narrativeKey,
          missionKey: keys.missionKey,
          narratorNameKey: keys.narratorNameKey,
          narratorRoleKey: keys.narratorRoleKey
        };
      }
      return st;
    });
  }

  fs.writeFileSync(targetPath, JSON.stringify(forests, null, 2), 'utf-8');
  console.log('Updated forest file:', targetPath);
}

updateForestFiles(forestsPath);
updateForestFiles(seedPath);
updateForestFiles(dataSeedPath);

console.log('Fix script completed successfully!');
