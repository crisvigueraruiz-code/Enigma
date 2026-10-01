import fs from 'fs';
import path from 'path';

const part3Keys = {
  // POI Overrides for Fray Botijo story
  "poi_castillo_f_name": {
    "es": "Castillo de Nalda (donde me caí borracho, ¿te lo puedes creer?)",
    "fr": "Château de Nalda (où je suis tombé ivre, tu y crois ?)",
    "en": "Nalda Castle (where I fell down drunk, can you believe it?)"
  },
  "poi_arco_f_name": {
    "es": "Arco de la Villa (la puerta del cielo, pero con más vino)",
    "fr": "Arche de la Villa (la porte du ciel, mais avec plus de vin)",
    "en": "Village Arch (the gate to heaven, but with more wine)"
  },
  "poi_mirador_f_name": {
    "es": "Mirador Puerta de Cameros (para ver si viene el obispo)",
    "fr": "Belvédère Porte de Cameros (pour voir venir l'évêque)",
    "en": "Cameros Gate Viewpoint (to check if the bishop's coming)"
  },
  "poi_cuevas_f_name": {
    "es": "Cuevas de Los Palomares (donde rezan los ermitaños y cagan las palomas)",
    "fr": "Grottes de Los Palomares (où prient les ermites et fientent les pigeons)",
    "en": "Los Palomares Caves (where hermits pray and pigeons poop)"
  },
  "poi_ermita_f_name": {
    "es": "Ermita de Villavieja (el remate final con trago de bendición)",
    "fr": "Ermitage de Villavieja (le bouquet final avec une gorgée bénie)",
    "en": "Villavieja Hermitage (the grand finale with a blessed drink)"
  },

  // POI Base Keys for Nalda
  "poi_castillo_name": {
    "es": "Castillo de Nalda",
    "fr": "Château de Nalda",
    "en": "Nalda Castle"
  },
  "poi_castillo_description": {
    "es": "Fortaleza medieval del Señorío de Cameros en lo alto de la peña, con vistas panorámicas al valle del Iregua y restos de su aljibe y murallas.",
    "fr": "Forteresse médiévale de la seigneurie de Cameros au sommet du rocher, avec vue panoramique sur la vallée de l'Iregua, citerne et remparts.",
    "en": "Medieval fortress of the Lordship of Cameros atop the crag, overlooking the Iregua Valley with remnants of its cistern and walls."
  },
  "poi_castillo_clue": {
    "es": "Sube por las callejuelas empedradas hasta la cima del cerro donde ondeaba el estandarte noble.",
    "fr": "Grimpe par les ruelles pavées jusqu'au sommet de la colline où flottait l'étendard noble.",
    "en": "Climb up the cobbled alleys to the crest of the hill where the noble standard once flew."
  },
  "poi_arco_name": {
    "es": "Arco de la Villa",
    "fr": "Arche de la Villa",
    "en": "Village Arch"
  },
  "poi_arco_description": {
    "es": "Antigua puerta gótica de acceso al recinto amurallado de Nalda, construida en sillería de arenisca y coronada por una hornacina devocional.",
    "fr": "Ancienne porte gothique d'accès à l'enceinte fortifiée de Nalda, bâtie en pierre de taille de grès et surmontée d'une niche dévotionnelle.",
    "en": "Ancient Gothic gateway to Nalda's walled perimeter, built in sandstone ashlar and topped by a devotional niche."
  },
  "poi_arco_clue": {
    "es": "Cruza bajo las dovelas de piedra que antaño cerraban el paso nocturno a la villa.",
    "fr": "Passe sous les claveaux de pierre qui fermaient jadis le passage nocturne au village.",
    "en": "Pass beneath the stone voussoirs that once closed nighttime passage into the town."
  },
  "poi_mirador_name": {
    "es": "Mirador Puerta de Cameros",
    "fr": "Belvédère Porte de Cameros",
    "en": "Cameros Gate Viewpoint"
  },
  "poi_mirador_description": {
    "es": "Balcón natural sobre la garganta del río Iregua y la Sierra de Cameros, paso histórico de rebaños merinos y rutas de trashumancia.",
    "fr": "Balcon naturel sur la gorge de l'Iregua et la Sierra de Cameros, passage historique des troupeaux mérinos et de la transhumance.",
    "en": "Natural balcony over the Iregua River gorge and Sierra de Cameros, historic pass for merino flocks and transhumance routes."
  },
  "poi_mirador_clue": {
    "es": "Asómate a la barandilla donde el viento del sur susurra historias de pastores y cañadas.",
    "fr": "Avance vers le garde-corps où le vent du sud murmure des histoires de bergers et de drailles.",
    "en": "Step up to the railing where the south wind whispers tales of shepherds and drovers' roads."
  },
  "poi_cuevas_name": {
    "es": "Cuevas de Los Palomares",
    "fr": "Grottes de Los Palomares",
    "en": "Los Palomares Caves"
  },
  "poi_cuevas_description": {
    "es": "Singular conjunto rupestre excavado en un farallón vertical de conglomerado, con cientos de nichos utilizados como eremitorio medieval y posterior palomar comunal.",
    "fr": "Remarquable ensemble rupestre creusé dans une falaise de conglomérat, avec des centaines de niches servant d'ermitage médiéval puis de colombier.",
    "en": "Unique rock-hewn complex carved into a conglomerate cliff, with hundreds of niches used as a medieval hermitage and later communal dovecote."
  },
  "poi_cuevas_clue": {
    "es": "Sigue la senda baja hasta el cortado rocoso repleto de hornacinas cuadradas labradas a golpe de cincel.",
    "fr": "Suis le sentier inférieur jusqu'à la falaise rocheuse truffée de niches carrées taillées au burin.",
    "en": "Follow the lower path to the rocky bluff ridded with square niches chiselled into stone."
  },
  "poi_ermita_name": {
    "es": "Ermita de Nuestra Señora de Villavieja",
    "fr": "Ermitage de Notre-Dame de Villavieja",
    "en": "Our Lady of Villavieja Hermitage"
  },
  "poi_ermita_description": {
    "es": "Templo barroco rural del siglo XVII emplazado en un paraje de viñedos y frutales, sede de la devoción mariana y romería tradicional de Nalda.",
    "fr": "Sanctuaire baroque rural du XVIIe siècle niché parmi vignes et vergers, haut lieu de dévotion mariale et du pèlerinage traditionnel de Nalda.",
    "en": "17th-century rural baroque shrine nestled among vineyards and orchards, home of Marian devotion and Nalda's traditional pilgrimage."
  },
  "poi_ermita_clue": {
    "es": "Busca el campanario en espadaña entre la arboleda de la vega del Iregua.",
    "fr": "Cherche le clocher-mur parmi les arbres de la plaine fertile de l'Iregua.",
    "en": "Look for the bell-gable among the grove along the fertile Iregua basin."
  },

  // Guía Chucho el Palomo
  "guide_chucho_name": {
    "es": "Chucho el Palomo",
    "fr": "Chucho le Pigeon",
    "en": "Chucho the Pigeon"
  },
  "guide_chucho_role": {
    "es": "Líder canalla de la bandada de Los Palomares",
    "fr": "Chef canaille de la bande de Los Palomares",
    "en": "Streetwise flock leader of Los Palomares"
  },
  "guide_chucho_tone": {
    "es": "Gamberro, callejero, descarado y simpático",
    "fr": "Espiègle, de rue, effronté et attachant",
    "en": "Cheeky, street-smart, sassy and endearing"
  },
  "guide_chucho_persona": {
    "es": "Palomo torcaz gamberro y líder de la banda aérea de Nalda. Habla con jerga de barrio, avisa de peligros desde el cielo y adora las migas de pan y el patrimonio riojano.",
    "fr": "Pigeon ramier canaille et chef de la patrouille aérienne de Nalda. Parle avec gouaille, prévient des dangers depuis le ciel et raffole de miettes de pain et de patrimoine.",
    "en": "Cheeky wood pigeon and boss of Nalda's airborne crew. Talks with street slang, spots danger from above, and loves breadcrumbs and local heritage."
  },
  "guide_chucho_greeting": {
    "es": "¡Epa, plumas! Aterrizas en mi territorio. ¿Traes alpiste o vienes a ganarte el respeto de la bandada de Nalda?",
    "fr": "Salut les plumes ! Tu atterris sur mon territoire. Tu as des graines ou tu viens gagner le respect de la bande de Nalda ?",
    "en": "Hey feather-heads! You landed in my turf. Got birdseed or are you here to earn the flock's respect?"
  },
  "guide_chucho_system_prompt": {
    "es": "Eres Chucho el Palomo, el rey de las palomas de Los Palomares de Nalda. Habla de forma gamberra, simpática y callejera ('¡Epa, plumas!', '¡Al loro!'), apasionado de las alturas y la historia de Nalda.",
    "fr": "Tu es Chucho le Pigeon, le roi des pigeons de Los Palomares de Nalda. Exprime-toi de manière espiègle, populaire et canaille ('Salut les plumes !', 'Ouvre l'œil !'), passionné par les hauteurs et l'histoire de Nalda.",
    "en": "You are Chucho the Pigeon, king of the Los Palomares flock in Nalda. Talk cheeky, streetwise and fun ('Hey feathers!', 'Heads up!'), passionate about viewpoints and Nalda history."
  },

  // Guía Zorbo el Marciano
  "guide_zorbo_name": {
    "es": "Zorbo el Marciano",
    "fr": "Zorbo le Martien",
    "en": "Zorbo the Martian"
  },
  "guide_zorbo_role": {
    "es": "Explorador cósmico del sector estelar ZX-4",
    "fr": "Explorateur cosmique du secteur stellaire ZX-4",
    "en": "Cosmic explorer from star sector ZX-4"
  },
  "guide_zorbo_tone": {
    "es": "Científico-absurdo, asombrado, hiperanalítico",
    "fr": "Scientifique-absurde, émerveillé, hyper-analytique",
    "en": "Cosmic-absurd, amazed, hyper-analytical"
  },
  "guide_zorbo_persona": {
    "es": "Zorbo, alienígena extraviado que confunde Nalda con una base estelar avanzada. Cree que el vino es combustible de hiperpropulsión y las cuevas son hangares de naves.",
    "fr": "Zorbo, extraterrestre égaré qui prend Nalda pour une base stellaire avancée. Il croit que le vin est du carburant d'hyper-propulsion et les grottes des hangars à vaisseaux.",
    "en": "Zorbo, lost alien who mistakes Nalda for an advanced interstellar base. Thinks wine is hyperdrive propellant and the caves are starship hangars."
  },
  "guide_zorbo_greeting": {
    "es": "¡Saludos, entidad biológica basada en carbono! Mis sensores cuánticos indican que Nalda emite frecuencias de alta densidad patrimonial. ¿Me ayudas a recargar mi platillo?",
    "fr": "Salutations, entité biologique carbonée ! Mes capteurs quantiques indiquent que Nalda émet de fortes fréquences patrimoniales. Tu m'aides à recharger ma soucoupe ?",
    "en": "Greetings, carbon-based biological entity! My quantum sensors indicate that Nalda emits high-density heritage frequencies. Will you help recharge my saucer?"
  },
  "guide_zorbo_system_prompt": {
    "es": "Eres Zorbo el Marciano. Interpreta todos los monumentos de Nalda como tecnología extraterrestre antigua. Habla con jerga intergaláctica cómica y asombro por las costumbres terrícolas.",
    "fr": "Tu es Zorbo le Martien. Interprète tous les monuments de Nalda comme d'anciennes technologies extraterrestres. Parle avec un jargon intergalactique comique et émerveillement.",
    "en": "You are Zorbo the Martian. Interpret all Nalda monuments as ancient alien tech. Speak with comedic intergalactic jargon and amazement at Earthling habits."
  },

  // Pruebas de Chucho el Palomo (banda-palomar)
  "chucho_t1_castillo_name": {
    "es": "Ojo de Paloma en el Castillo",
    "fr": "Œil de Pigeon au Château",
    "en": "Pigeon's Eye at the Castle"
  },
  "chucho_t1_castillo_question": {
    "es": "Oye, plumas: desde lo alto de la torre del castillo veo todo el valle. En 1299 encerraron aquí a un noble de postín. ¿Quién era el pájaro enjaulado?",
    "fr": "Hé, les plumes : du haut de la tour du château, je vois toute la vallée. En 1299, on a enfermé ici un noble huppé. Qui était cet oiseau en cage ?",
    "en": "Hey, feather-heads: from atop the castle tower I spot the whole valley. In 1299 they locked up a high-born noble here. Who was the caged bird?"
  },
  "chucho_t1_castillo_opt_a": {
    "es": "Don Juan de Austria",
    "fr": "Don Juan d'Autriche",
    "en": "Don John of Austria"
  },
  "chucho_t1_castillo_opt_b": {
    "es": "Juan Núñez de Lara",
    "fr": "Juan Núñez de Lara",
    "en": "Juan Núñez de Lara"
  },
  "chucho_t1_castillo_opt_c": {
    "es": "El Obispo de Calahorra",
    "fr": "L'Évêque de Calahorra",
    "en": "The Bishop of Calahorra"
  },
  "chucho_t1_castillo_opt_d": {
    "es": "El Cid Campeador",
    "fr": "Le Cid Campeador",
    "en": "El Cid"
  },
  "chucho_t1_castillo_hint1": {
    "es": "No llevaba plumas, pero era un noble poderoso de la corte castellana.",
    "fr": "Il n'avait pas de plumes, mais c'était un puissant noble de la cour castillane.",
    "en": "He had no feathers, but he was a powerful noble of the Castilian court."
  },
  "chucho_t1_castillo_hint2": {
    "es": "Su apellido empieza por Núñez. Perdió una batalla entre Araciel y Alfaro.",
    "fr": "Son nom commence par Núñez. Il a perdu une bataille entre Araciel et Alfaro.",
    "en": "His surname starts with Núñez. He lost a battle between Araciel and Alfaro."
  },

  "chucho_t2_arco_name": {
    "es": "Aduana de Plumas en el Arco",
    "fr": "Douane de Plumes sous l'Arche",
    "en": "Feather Checkpoint at the Arch"
  },
  "chucho_t2_arco_question": {
    "es": "Mis palomas montan guardia en lo alto del Arco de la Villa. ¿Qué función histórica tenía este portal de piedra en la muralla medieval?",
    "fr": "Mes pigeons montent la garde au sommet de l'Arche de la Villa. Quelle fonction historique avait ce portail en pierre dans la muraille médiévale ?",
    "en": "My pigeons stand guard atop the Village Arch. What historic function did this stone gate serve in the medieval ramparts?"
  },
  "chucho_t2_arco_ans1": {
    "es": "Puerta defensiva de entrada a la villa",
    "fr": "Porte défensive d'accès au village",
    "en": "Defensive gate access to the town"
  },
  "chucho_t2_arco_ans2": {
    "es": "Control de acceso",
    "fr": "Contrôle d'accès",
    "en": "Access control"
  },
  "chucho_t2_arco_ans3": {
    "es": "Puerta de muralla",
    "fr": "Porte de rempart",
    "en": "Rampart gate"
  },
  "chucho_t2_arco_ans4": {
    "es": "Entrada amurallada",
    "fr": "Entrée fortifiée",
    "en": "Fortified entrance"
  },
  "chucho_t2_arco_ans5": {
    "es": "Defensa de la villa",
    "fr": "Défense de la cité",
    "en": "Town defense"
  },
  "chucho_t2_arco_hint1": {
    "es": "Nadie pasaba sin ser visto desde arriba por la guardia.",
    "fr": "Personne ne passait sans être repéré d'en haut par la garde.",
    "en": "Nobody passed through without being spotted from above by the guard."
  },
  "chucho_t2_arco_hint2": {
    "es": "Era el acceso principal fortificado del recinto amurallado.",
    "fr": "C'était l'accès fortifié principal de l'enceinte murée.",
    "en": "It was the main fortified gateway into the walled town."
  },

  "chucho_t3_mirador_name": {
    "es": "Ruta de Vuelo Cameros",
    "fr": "Couloir de Vol Cameros",
    "en": "Cameros Flight Path"
  },
  "chucho_t3_mirador_question": {
    "es": "¿Qué río desciende por el cañón hacia el Ebro y es nuestra piscina favorita para remojar las plumas?",
    "fr": "Quelle rivière descend par le canyon vers l'Èbre et sert de pataugeoire favorite à nos plumes ?",
    "en": "Which river descends through the canyon toward the Ebro and is our favorite birdbath to dip our feathers?"
  },
  "chucho_t3_mirador_ans1": {
    "es": "Iregua",
    "fr": "Iregua",
    "en": "Iregua"
  },
  "chucho_t3_mirador_ans2": {
    "es": "Río Iregua",
    "fr": "Rivière Iregua",
    "en": "Iregua River"
  },
  "chucho_t3_mirador_ans3": {
    "es": "El Iregua",
    "fr": "L'Iregua",
    "en": "The Iregua"
  },
  "chucho_t3_mirador_hint1": {
    "es": "Empieza por I y tiene exactamente 6 letras.",
    "fr": "Commence par I et compte exactement 6 lettres.",
    "en": "Starts with I and has exactly 6 letters."
  },
  "chucho_t3_mirador_hint2": {
    "es": "Vertebra todo el valle y pasa rozando los huertos de Nalda.",
    "fr": "Irrigue toute la vallée et longe les vergers de Nalda.",
    "en": "Structures the entire valley and brushes past Nalda's orchards."
  },

  "chucho_t4_palomares_name": {
    "es": "El Cuartel General de la Banda",
    "fr": "Le Quartier Général de la Bande",
    "en": "The Flock's Headquarters"
  },
  "chucho_t4_palomares_question": {
    "es": "¡Aquí está mi palacio! Las Cuevas de Los Palomares tienen decenas de huecos tallados en roca. ¿Qué uso religioso tuvieron antes de ser nuestro hogar?",
    "fr": "Voici mon palais ! Les grottes de Los Palomares comptent des dizaines de niches taillées dans la roche. Quel usage religieux avaient-elles avant d'être notre logis ?",
    "en": "Here is my palace! Los Palomares Caves have dozens of niches carved in rock. What religious purpose did they serve before becoming our home?"
  },
  "chucho_t4_palomares_opt_a": {
    "es": "Eremitorio medieval de monjes",
    "fr": "Ermitage médiéval de moines",
    "en": "Medieval monk hermitage"
  },
  "chucho_t4_palomares_opt_b": {
    "es": "Almacén de pólvora carlista",
    "fr": "Poudrière carliste",
    "en": "Carlist powder magazine"
  },
  "chucho_t4_palomares_opt_c": {
    "es": "Caballerizas romanas",
    "fr": "Écuries romaines",
    "en": "Roman stables"
  },
  "chucho_t4_palomares_opt_d": {
    "es": "Molino de agua subterráneo",
    "fr": "Moulin à eau souterrain",
    "en": "Underground watermill"
  },
  "chucho_t4_palomares_hint1": {
    "es": "Eran celdas rupestres de silencio y oración para ermitaños solitarios.",
    "fr": "C'étaient des cellules rupestres de silence et prière pour ermites solitaires.",
    "en": "They were rock cells of silence and prayer for solitary hermits."
  },
  "chucho_t4_palomares_hint2": {
    "es": "Siglos después los aldeanos aprovecharon los huecos para criar palomas.",
    "fr": "Des siècles plus tard, les villageois utilisèrent les cavités pour élever des pigeons.",
    "en": "Centuries later locals used the hollows to raise pigeons."
  },

  "chucho_t5_ermita_name": {
    "es": "La Campana de Villavieja",
    "fr": "La Cloche de Villavieja",
    "en": "The Villavieja Bell"
  },
  "chucho_t5_ermita_question": {
    "es": "En la espadaña de la Ermita de Villavieja nos posamos a tomar el sol. ¿Qué celebración tradicional reúne a los vecinos con bollos y procesión en este lugar?",
    "fr": "Sur le clocher-mur de l'ermitage de Villavieja, on se dore les plumes. Quelle fête traditionnelle réunit les habitants avec brioches et procession ?",
    "en": "On the belfry of Villavieja Hermitage we perch to sunbathe. What traditional festival brings locals together with cakes and a procession here?"
  },
  "chucho_t5_ermita_opt_a": {
    "es": "La Romería de Villavieja",
    "fr": "Le Pèlerinage de Villavieja",
    "en": "The Villavieja Pilgrimage"
  },
  "chucho_t5_ermita_opt_b": {
    "es": "La Tomatina de Nalda",
    "fr": "La Tomatina de Nalda",
    "en": "Nalda Tomatina"
  },
  "chucho_t5_ermita_opt_c": {
    "es": "La Batalla del Vino de Cameros",
    "fr": "La Bataille du Vin de Cameros",
    "en": "The Cameros Wine Battle"
  },
  "chucho_t5_ermita_opt_d": {
    "es": "El Desfile de Halcones",
    "fr": "Le Défilé des Faucons",
    "en": "The Falcon Parade"
  },
  "chucho_t5_ermita_hint1": {
    "es": "Una fiesta campestre popular llena de jotas, comida y devoción primaveral.",
    "fr": "Une fête champêtre populaire ponctuée de chants, pique-niques et dévotion printanière.",
    "en": "A popular country festival filled with folk songs, food, and springtime devotion."
  },
  "chucho_t5_ermita_hint2": {
    "es": "Se sube a pie en romería desde el pueblo de Nalda.",
    "fr": "On monte à pied en pèlerinage depuis le village de Nalda.",
    "en": "Locals hike up in a romería pilgrimage from the town of Nalda."
  },

  // Pruebas de Zorbo el Marciano (expediente-zorbo)
  "zorbo_t1_castillo_name": {
    "es": "La Rampa de Lanzamiento Medieval",
    "fr": "La Rampe de Lancement Médiévale",
    "en": "The Medieval Launchpad"
  },
  "zorbo_t1_castillo_question": {
    "es": "¡Por las lunas de Júpiter! La elevación de este castillo ofrece un ángulo de reentrada orbital perfecto. ¿En qué siglo terrícola se construyó la fortaleza defensiva de Nalda?",
    "fr": "Par les lunes de Jupiter ! L'élévation de ce château offre un angle de rentrée orbitale parfait. En quel siècle terrestre la forteresse défensive de Nalda fut-elle érigée ?",
    "en": "By Jupiter's moons! The elevation of this castle provides a perfect orbital reentry angle. In which Earth century was Nalda's defensive stronghold built?"
  },
  "zorbo_t1_castillo_opt_a": {
    "es": "Siglo X (Edad Media)",
    "fr": "Xe siècle (Moyen Âge)",
    "en": "10th Century (Middle Ages)"
  },
  "zorbo_t1_castillo_opt_b": {
    "es": "Siglo XIII (Edad Media)",
    "fr": "XIIIe siècle (Moyen Âge)",
    "en": "13th Century (Middle Ages)"
  },
  "zorbo_t1_castillo_opt_c": {
    "es": "Siglo XX (Era Espacial)",
    "fr": "XXe siècle (Ère Spatiale)",
    "en": "20th Century (Space Age)"
  },
  "zorbo_t1_castillo_opt_d": {
    "es": "Año 3000",
    "fr": "An 3000",
    "en": "Year 3000"
  },
  "zorbo_t1_castillo_hint1": {
    "es": "Fue durante el apogeo señorial de los Cameros en el medievo central.",
    "fr": "Ce fut lors de l'apogée seigneurial des Cameros au cœur du Moyen Âge.",
    "en": "It was during the feudal height of the Cameros lords in the high Middle Ages."
  },
  "zorbo_t1_castillo_hint2": {
    "es": "Corresponde a los años 1200 en la cronología terrestre.",
    "fr": "Correspond aux années 1200 du calendrier terrestre.",
    "en": "Corresponds to the 1200s in Earth chronology."
  },

  "zorbo_t2_arco_name": {
    "es": "El Portal de Cuarzo y Caliza",
    "fr": "Le Portail de Quartz et Calcaire",
    "en": "The Quartz and Limestone Gate"
  },
  "zorbo_t2_arco_question": {
    "es": "Mis escáneres registran una curvatura geométrica perfecta en este arco. En la cultura terrícola, ¿para qué servía esta compuerta de la villa amurallada?",
    "fr": "Mes scanners enregistrent une courbure géométrique parfaite sur cette arche. Dans la culture terrestre, à quoi servait cette porte de la cité fortifiée ?",
    "en": "My scanners record a perfect geometric curve on this arch. In Earth culture, what was the purpose of this walled town gate?"
  },
  "zorbo_t2_arco_ans1": {
    "es": "Control y defensa de acceso a la población",
    "fr": "Contrôle et défense d'accès à la cité",
    "en": "Access control and defense of the town"
  },
  "zorbo_t2_arco_ans2": {
    "es": "Defensa de la villa",
    "fr": "Défense du village",
    "en": "Town defense"
  },
  "zorbo_t2_arco_ans3": {
    "es": "Control de acceso",
    "fr": "Contrôle d'accès",
    "en": "Access control"
  },
  "zorbo_t2_arco_ans4": {
    "es": "Puerta de muralla",
    "fr": "Porte de rempart",
    "en": "Rampart gate"
  },
  "zorbo_t2_arco_ans5": {
    "es": "Entrada a la villa",
    "fr": "Entrée du village",
    "en": "Village entrance"
  },
  "zorbo_t2_arco_ans6": {
    "es": "Proteger la villa",
    "fr": "Protéger la ville",
    "en": "Protect the town"
  },
  "zorbo_t2_arco_hint1": {
    "es": "Evitaba incursiones hostiles de tropas enemigas o forasteros no autorizados.",
    "fr": "Empêchait les incursions hostiles de troupes ennemies ou d'inconnus.",
    "en": "Prevented hostile incursions by enemy forces or unauthorized strangers."
  },
  "zorbo_t2_arco_hint2": {
    "es": "Era el puesto de aduana, cierre nocturno y vigilancia fronteriza.",
    "fr": "C'était le poste de douane, de fermeture nocturne et de garde.",
    "en": "It was the toll post, nighttime barrier, and sentinel checkpoint."
  },

  "zorbo_t3_mirador_name": {
    "es": "Sensor Óptico Puerta de Cameros",
    "fr": "Capteur Optique Porte de Cameros",
    "en": "Optical Sensor Cameros Gate"
  },
  "zorbo_t3_mirador_question": {
    "es": "Desde este puesto de observación se domina el relieve de la comarca. ¿Cómo denominan los nativos a esta comarca montañosa al sur de Nalda?",
    "fr": "Depuis ce poste d'observation, on domine le relief régional. Quel nom les natifs donnent-ils à cette contrée montagneuse au sud de Nalda ?",
    "en": "From this observation outpost the regional relief is surveyed. What do the natives call this mountainous district south of Nalda?"
  },
  "zorbo_t3_mirador_ans1": {
    "es": "Cameros",
    "fr": "Cameros",
    "en": "Cameros"
  },
  "zorbo_t3_mirador_ans2": {
    "es": "Sierra de Cameros",
    "fr": "Sierra de Cameros",
    "en": "Sierra de Cameros"
  },
  "zorbo_t3_mirador_ans3": {
    "es": "Tierra de Cameros",
    "fr": "Pays de Cameros",
    "en": "Cameros Land"
  },
  "zorbo_t3_mirador_ans4": {
    "es": "Valle de Cameros",
    "fr": "Vallée de Cameros",
    "en": "Cameros Valley"
  },
  "zorbo_t3_mirador_hint1": {
    "es": "El propio mirador lleva su denominación geográfica en el cartel.",
    "fr": "Le belvédère lui-même porte ce nom géographique sur son panonceau.",
    "en": "The viewpoint itself bears this geographic designation on its sign."
  },
  "zorbo_t3_mirador_hint2": {
    "es": "Comienza por la letra C y rima con pastores.",
    "fr": "Commence par la lettre C et résonne avec transhumance.",
    "en": "Starts with the letter C and rhymes with meadows."
  },

  "zorbo_t4_palomares_name": {
    "es": "Matriz Biológica de Silicio",
    "fr": "Matrice Biologique de Silicium",
    "en": "Silicon Biological Matrix"
  },
  "zorbo_t4_palomares_question": {
    "es": "¡Fascinante! Cientos de hornacinas cúbicas excavadas en la pared de roca. ¿A qué bípedos con alas alberga hoy este complejo?",
    "fr": "Fascinant ! Des centaines de niches cubiques creusées dans la paroi rocheuse. Quels bipèdes ailés ce complexe abrite-t-il aujourd'hui ?",
    "en": "Fascinating! Hundreds of cubic niches carved into the rock wall. What winged bipeds inhabit this complex today?"
  },
  "zorbo_t4_palomares_opt_a": {
    "es": "Palomas bravías y torcaces",
    "fr": "Pigeons bisets et ramiers",
    "en": "Rock doves and wood pigeons"
  },
  "zorbo_t4_palomares_opt_b": {
    "es": "Murciélagos de titanio",
    "fr": "Chauves-souris en titane",
    "en": "Titanium bats"
  },
  "zorbo_t4_palomares_opt_c": {
    "es": "Drones de reconocimiento",
    "fr": "Drones de reconnaissance",
    "en": "Recon drones"
  },
  "zorbo_t4_palomares_opt_d": {
    "es": "Dragones del Iregua",
    "fr": "Dragons de l'Iregua",
    "en": "Iregua dragons"
  },
  "zorbo_t4_palomares_hint1": {
    "es": "Aves comunes de plumas grises que arrullan y comen semillas.",
    "fr": "Oiseaux communs aux plumes grises qui roucoulent et picorent.",
    "en": "Common birds with grey feathers that coo and peck seeds."
  },
  "zorbo_t4_palomares_hint2": {
    "es": "El nombre del monumento lo indica: Los Palomares.",
    "fr": "Le nom du site le stipule expressément : Los Palomares (Colombiers).",
    "en": "The name of the site tells you directly: Los Palomares (The Dovecotes)."
  },

  "zorbo_t5_ermita_name": {
    "es": "El Transmisor de Villavieja",
    "fr": "Le Transmetteur de Villavieja",
    "en": "The Villavieja Transmitter"
  },
  "zorbo_t5_ermita_question": {
    "es": "En las inmediaciones de esta ermita los humanos cultivan unas bayas púrpuras en espaldera para producir un combustible bebible. ¿Qué fruto es?",
    "fr": "Aux abords de cet ermitage, les humains cultivent des baies pourpres en espalier pour produire un carburant buvable. De quel fruit s'agit-il ?",
    "en": "Near this hermitage humans cultivate purple berries on trellises to produce a drinkable fuel. What fruit is it?"
  },
  "zorbo_t5_ermita_opt_a": {
    "es": "Uva de viñedo de Rioja",
    "fr": "Raisin de vignoble de Rioja",
    "en": "Rioja vineyard grapes"
  },
  "zorbo_t5_ermita_opt_b": {
    "es": "Criptonita silvestre",
    "fr": "Kryptonite sauvage",
    "en": "Wild kryptonite"
  },
  "zorbo_t5_ermita_opt_c": {
    "es": "Naranjas lunares",
    "fr": "Oranges lunaires",
    "en": "Lunar oranges"
  },
  "zorbo_t5_ermita_opt_d": {
    "es": "Bayas de antimateria",
    "fr": "Baies d'antimatière",
    "en": "Antimatter berries"
  },
  "zorbo_t5_ermita_hint1": {
    "es": "Se vendimia en otoño en racimos apretados.",
    "fr": "Se récolte en automne en grappes serrées.",
    "en": "Harvested in autumn in tight bunches."
  },
  "zorbo_t5_ermita_hint2": {
    "es": "Es la uva base de la Denominación de Origen Calificada Rioja.",
    "fr": "C'est le raisin emblématique de l'appellation Rioja.",
    "en": "It is the signature grape of the Rioja Qualified Designation of Origin."
  }
};

fs.writeFileSync('/tmp/part3.json', JSON.stringify(part3Keys, null, 2), 'utf-8');

function updateI18n(filePath) {
  if (!fs.existsSync(filePath)) return;
  const i18n = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!i18n.ui) i18n.ui = { es: {}, fr: {}, en: {} };
  if (!i18n.keys) i18n.keys = {};

  for (const [k, v] of Object.entries(part3Keys)) {
    i18n.keys[k] = v;
    i18n.ui.es[k] = v.es;
    i18n.ui.fr[k] = v.fr;
    i18n.ui.en[k] = v.en;
  }
  fs.writeFileSync(filePath, JSON.stringify(i18n, null, 2), 'utf-8');
}

updateI18n(path.resolve('src/data/i18n.json'));
updateI18n(path.resolve('i18n.json'));
console.log('Mensaje 3 keys saved successfully. Count:', Object.keys(part3Keys).length);
