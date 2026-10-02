const fs = require('fs');
const path = require('path');

const i18nPath1 = path.join(__dirname, '../src/data/i18n.json');
const i18nPath2 = path.join(__dirname, '../i18n.json');

const i18n = JSON.parse(fs.readFileSync(i18nPath1, 'utf-8'));

if (!i18n.ui) i18n.ui = {};
if (!i18n.ui.es) i18n.ui.es = {};
if (!i18n.ui.fr) i18n.ui.fr = {};
if (!i18n.ui.en) i18n.ui.en = {};
if (!i18n.keys) i18n.keys = {};
if (!i18n.forests) i18n.forests = {};
if (!i18n.forests.nalda) i18n.forests.nalda = {};
if (!i18n.forests.nalda.es) i18n.forests.nalda.es = {};
if (!i18n.forests.nalda.fr) i18n.forests.nalda.fr = {};
if (!i18n.forests.nalda.en) i18n.forests.nalda.en = {};
if (!i18n.forests.nalda.es.riddles) i18n.forests.nalda.es.riddles = {};
if (!i18n.forests.nalda.fr.riddles) i18n.forests.nalda.fr.riddles = {};
if (!i18n.forests.nalda.en.riddles) i18n.forests.nalda.en.riddles = {};

const uiAdditions = {
  'riddle.photoTitle': {
    es: 'Verificación Fotográfica en el Bosque',
    fr: 'Vérification Photographique en Forêt',
    en: 'Forest Photographic Verification'
  },
  'riddle.openCamera': {
    es: 'Abrir Cámara / Capturar Foto',
    fr: "Ouvrir l'appareil photo / Prendre la photo",
    en: 'Open Camera / Take Photo'
  },
  'riddle.recordingAudio': {
    es: 'GRABANDO SONIDO AMBIENTE...',
    fr: 'ENREGISTREMENT DU SON AMBIANT...',
    en: 'RECORDING AMBIENT AUDIO...'
  },
  'riddle.startAudio': {
    es: 'Iniciar Grabación de Audio',
    fr: "Démarrer l'enregistrement audio",
    en: 'Start Audio Recording'
  },
  'riddle.recordVideoClip': {
    es: 'Grabar Clip de 3 Segundos',
    fr: 'Enregistrer un clip de 3 secondes',
    en: 'Record a 3-Second Clip'
  },
  'riddle.performMimic': {
    es: 'Realizar Mímica (3s)',
    fr: 'Faire le mime (3s)',
    en: 'Perform Mimic (3s)'
  },
  'riddle.compassTitle': {
    es: 'Reto de Orientación: Brújula al Norte (0°)',
    fr: "Défi d'Orientation : Boussole vers le Nord (0°)",
    en: 'Orientation Challenge: Compass to North (0°)'
  },
  'riddle.compassAligned': {
    es: '¡Alineado con el Norte! Listo para validar.',
    fr: 'Aligné avec le Nord ! Prêt à valider.',
    en: 'Aligned with North! Ready to validate.'
  },
  'riddle.listenTitle': {
    es: 'Escucha Atenta del Bosque',
    fr: 'Écoute attentive de la Forêt',
    en: 'Mindful Forest Listening'
  },
  'riddle.listeningForest': {
    es: 'Escuchando la espesura...',
    fr: "À l'écoute des bois...",
    en: 'Listening to the woodland...'
  },
  'riddle.shuffle': {
    es: 'Barajar',
    fr: 'Mélanger',
    en: 'Shuffle'
  },
  'riddle.codexTitle': {
    es: 'Códice y Descifrado Rúnico',
    fr: 'Codex et Déchiffrage Runique',
    en: 'Codex & Runic Decryption'
  },
  'riddle.codexEquivalence': {
    es: 'Clave de equivalencias:',
    fr: 'Table des correspondances :',
    en: 'Cipher key:'
  },
  'riddle.submitAnswer': {
    es: 'Responder',
    fr: 'Répondre',
    en: 'Submit Answer'
  },
  'riddle.feedbackCorrect': {
    es: '¡Correcto! Enigma resuelto con éxito.',
    fr: 'Correct ! Énigme résolue avec succès.',
    en: 'Correct! Riddle successfully solved.'
  },
  'riddle.feedbackIncorrect': {
    es: 'No es la respuesta correcta. Vuelve a intentarlo.',
    fr: "Ce n'est pas la bonne réponse. Réessaie !",
    en: 'That is not the correct answer. Try again!'
  },
  'ar.mode3d': {
    es: 'Modo Visor 3D',
    fr: 'Mode Visionneuse 3D',
    en: '3D Viewer Mode'
  },
  'ar.modeGeo': {
    es: 'Geo-Anclado',
    fr: 'Géo-Ancré',
    en: 'Geo-Anchored'
  },
  'ar.btnArCamera': {
    es: 'Cámara AR',
    fr: 'Caméra RA',
    en: 'AR Camera'
  },
  'ar.btn3dMode': {
    es: 'Modo Reserva 3D',
    fr: 'Mode Réserve 3D',
    en: '3D Backup Mode'
  },
  'ar.placeGround': {
    es: 'Colocar en el Suelo (AR)',
    fr: 'Poser au sol (RA)',
    en: 'Place on Ground (AR)'
  },
  'ar.targetInSight': {
    es: '¡Artefacto en tu campo visual!',
    fr: 'Artéfact dans ton champ de vision !',
    en: 'Artifact in your field of view!'
  },
  'ar.turnRight': {
    es: 'Gira {deg}° a tu derecha ➔',
    fr: 'Tourne de {deg}° vers ta droite ➔',
    en: 'Turn {deg}° to your right ➔'
  },
  'ar.turnLeft': {
    es: '⬅ Gira {deg}° a tu izquierda',
    fr: '⬅ Tourne de {deg}° vers ta gauche',
    en: '⬅ Turn {deg}° to your left'
  },
  'ar.distance': {
    es: 'Distancia:',
    fr: 'Distance :',
    en: 'Distance:'
  },
  'ar.heading': {
    es: 'Rumbo:',
    fr: 'Cap :',
    en: 'Bearing:'
  },
  'ar.progressNote': {
    es: 'Nota sobre el avance:',
    fr: "Note d'exploration :",
    en: 'Trail progress note:'
  },
  'ar.smoothExperience': {
    es: 'Experiencia visual sin bloqueos:',
    fr: 'Expérience visuelle fluide :',
    en: 'Smooth visual experience:'
  },
  'map.organicFilter': {
    es: 'Filtro Orgánico',
    fr: 'Filtre Organique',
    en: 'Organic Filter'
  },
  'map.reliefContrast': {
    es: 'Contraste de relieve:',
    fr: 'Contraste du relief :',
    en: 'Relief contrast:'
  },
  'map.greenSaturation': {
    es: 'Saturación de verdes:',
    fr: 'Saturation des verts :',
    en: 'Green saturation:'
  },
  'map.warmth': {
    es: 'Calidez terrosa:',
    fr: 'Chaleur tellurique :',
    en: 'Earthly warmth:'
  },
  'map.activateFilter': {
    es: 'Activar filtro',
    fr: 'Activer le filtre',
    en: 'Activate filter'
  },
  'map.arCamera': {
    es: 'Cámara AR',
    fr: 'Caméra RA',
    en: 'AR Camera'
  },
  'map.filterActive': {
    es: 'Filtro orgánico activo',
    fr: 'Filtre organique actif',
    en: 'Organic filter active'
  },
  'map.solved': {
    es: '✓ Resuelto',
    fr: '✓ Résolu',
    en: '✓ Solved'
  },
  'map.mode': {
    es: 'Modo:',
    fr: 'Mode :',
    en: 'Mode:'
  },
  'map.jump25m': {
    es: '+25m hacia POI',
    fr: '+25m vers le jalon',
    en: '+25m toward POI'
  },
  'map.arriveBtn': {
    es: 'Llegar (<30m)',
    fr: 'Arriver (<30m)',
    en: 'Arrive (<30m)'
  },
  'char.reportJoke': {
    es: 'Reportar chiste',
    fr: 'Signaler la blague',
    en: 'Report joke'
  },
  'char.currentPoint': {
    es: 'Punto actual:',
    fr: 'Jalon actuel :',
    en: 'Current waypoint:'
  },
  'char.liveVoice': {
    es: 'Voz en Vivo (Gemini 3.8 Live)',
    fr: 'Voix en Direct (Gemini 3.8 Live)',
    en: 'Live Voice (Gemini 3.8 Live)'
  },
  'char.chatAndQuestions': {
    es: 'Chat de Texto y Preguntas',
    fr: 'Discussion Écrite et Questions',
    en: 'Text Chat & Questions'
  },
  'char.personality': {
    es: 'Personalidad del Personaje',
    fr: 'Personnalité du Guide',
    en: 'Character Personality'
  },
  'char.ask': {
    es: 'Preguntar',
    fr: 'Demander',
    en: 'Ask'
  },
  'setup.errorStory': {
    es: 'Por favor, selecciona una historia para comenzar.',
    fr: 'Veuillez choisir une histoire pour commencer.',
    en: 'Please select a story to begin.'
  },
  'setup.defaultTeam': {
    es: 'Equipo Forestal',
    fr: 'Équipe Sylvestre',
    en: 'Forest Team'
  },
  'setup.defaultSolo': {
    es: 'Explorador Solitario',
    fr: 'Explorateur Solitaire',
    en: 'Solo Explorer'
  },
  'briefing.acknowledge': {
    es: 'He leído y comprendo las normas de seguridad del bosque. Me comprometo a respetarlas.',
    fr: "J'ai lu et compris les consignes de sécurité forestière. Je m'engage à les respecter.",
    en: 'I have read and understood the forest safety rules. I pledge to respect them.'
  },
  'order.result': {
    es: 'Has colocado {n} de {total} elementos en su posición correcta. ¡Sigue probando!',
    fr: 'Tu as placé {n} sur {total} éléments à la bonne place. Continue !',
    en: 'You placed {n} of {total} elements in the correct position. Keep trying!'
  },
  'cardinal.west': {
    es: 'Oeste',
    fr: 'Ouest',
    en: 'West'
  }
};

for (const [key, vals] of Object.entries(uiAdditions)) {
  i18n.ui.es[key] = vals.es;
  i18n.ui.fr[key] = vals.fr;
  i18n.ui.en[key] = vals.en;
  if (!i18n.keys[key]) {
    i18n.keys[key] = vals;
  }
}

// Translations for all 49 Nalda riddles
const naldaRiddlesTranslations = {
  't1-1': {
    name: { es: 'El Noble Prisionero', fr: 'Le Noble Prisonnier', en: 'The Noble Prisoner' },
    question: {
      es: '¿Quién fue el noble que estuvo prisionero aquí en 1299?',
      fr: 'Qui était le noble emprisonné ici en 1299 ?',
      en: 'Who was the noble imprisoned here in 1299?'
    },
    options: {
      es: ['Juan Núñez de Lara', 'El Cid Campeador', 'Alfonso X', 'García Sánchez'],
      fr: ['Juan Núñez de Lara', 'Le Cid Campeador', 'Alphonse X', 'García Sánchez'],
      en: ['Juan Núñez de Lara', 'El Cid', 'Alfonso X', 'García Sánchez']
    },
    answer: { es: 'Juan Núñez de Lara', fr: 'Juan Núñez de Lara', en: 'Juan Núñez de Lara' },
    hints: {
      es: ['Era un noble castellano rebelde.', 'Lara es su apellido.'],
      fr: ['C’était un noble castillan rebelle.', 'Son nom de famille est Lara.'],
      en: ['He was a rebellious Castilian nobleman.', 'His surname is Lara.']
    }
  },
  't1-2': {
    name: { es: 'Los Aljibes del Castillo', fr: 'Les Citernes du Château', en: 'The Castle Cisterns' },
    question: {
      es: 'El castillo tenía un sistema de aljibes. ¿Para qué servían?',
      fr: 'Le château possédait un système de citernes. À quoi servaient-elles ?',
      en: 'The castle had a cistern system. What were they used for?'
    },
    options: {
      es: ['Almacenar agua de lluvia', 'Mazmorras secretas', 'Guardar pólvora', 'Bodega de vino'],
      fr: ['Stocker l’eau de pluie', 'Oubliettes secrètes', 'Entreposer la poudre', 'Cave à vin'],
      en: ['Store rainwater', 'Secret dungeons', 'Store gunpowder', 'Wine cellar']
    },
    answer: { es: 'Almacenar agua de lluvia', fr: 'Stocker l’eau de pluie', en: 'Store rainwater' },
    hints: {
      es: ['El agua era vital durante un asedio.', 'Recogían lluvia.'],
      fr: ['L’eau était vitale lors d’un siège.', 'Elles recueillaient la pluie.'],
      en: ['Water was crucial during sieges.', 'They collected rain.']
    }
  },
  't1-3': {
    name: { es: 'Fratricidio Real', fr: 'Fratricide Royal', en: 'Royal Fratricide' },
    question: {
      es: '¿Qué rey mató a su hermanastro con un puñal en Montiel (1369)?',
      fr: 'Quel roi tua son demi-frère d’un coup de poignard à Montiel (1369) ?',
      en: 'Which king killed his half-brother with a dagger at Montiel (1369)?'
    },
    options: {
      es: ['Enrique II de Trastámara', 'Pedro I el Cruel', 'Fernando III', 'Juan I'],
      fr: ['Henri II de Trastamare', 'Pierre Ier le Cruel', 'Ferdinand III', 'Jean Ier'],
      en: ['Henry II of Trastámara', 'Peter I the Cruel', 'Ferdinand III', 'John I']
    },
    answer: { es: 'Enrique II de Trastámara', fr: 'Henri II de Trastamare', en: 'Henry II of Trastámara' },
    hints: {
      es: ['Inauguró la dinastía Trastámara.', 'Enrique el de las Mercedes.'],
      fr: ['Il inaugura la dynastie de Trastamare.', 'Henri le Noble.'],
      en: ['He founded the Trastámara dynasty.', 'Henry of Trastámara.']
    }
  },
  't2-1': {
    name: { es: 'Límites del Arco', fr: 'Limites de l’Arche', en: 'Village Arch Boundaries' },
    question: {
      es: '¿Qué delimitaba el Arco de la Villa?',
      fr: 'Que délimitait l’Arche du Village (Arco de la Villa) ?',
      en: 'What did the Village Arch demarcate?'
    },
    options: {
      es: ['La entrada al recinto amurallado', 'El puente sobre el río', 'El límite con Viguera', 'El inicio del viñedo'],
      fr: ['L’entrée de l’enceinte fortifiée', 'Le pont sur la rivière', 'La frontière avec Viguera', 'Le début des vignobles'],
      en: ['Entrance to the walled town', 'Bridge over the river', 'Boundary with Viguera', 'Beginning of the vineyards']
    },
    answer: { es: 'La entrada al recinto amurallado', fr: 'L’entrée de l’enceinte fortifiée', en: 'Entrance to the walled town' },
    hints: {
      es: ['Era la puerta principal del pueblo medieval.', 'Paso de la muralla.'],
      fr: ['C’était la porte principale du bourg médiéval.', 'Passage de la muraille.'],
      en: ['It was the main gate of the medieval town.', 'Rampart gateway.']
    }
  },
  't2-2': {
    name: { es: 'Señorío de Cameros', fr: 'Seigneurie de Cameros', en: 'Lords of Cameros' },
    question: {
      es: '¿Qué familia noble fue señora de Cameros y habitó este castillo?',
      fr: 'Quelle famille noble fut seigneur de Cameros et occupa ce château ?',
      en: 'Which noble family held the lordship of Cameros and occupied this castle?'
    },
    options: {
      es: ['Los Haro', 'Los Lara', 'Los Mendoza', 'Los Trastámara'],
      fr: ['Les Haro', 'Les Lara', 'Les Mendoza', 'Les Trastamare'],
      en: ['The Haro family', 'The Lara family', 'The Mendoza family', 'The Trastámara family']
    },
    answer: { es: 'Los Haro', fr: 'Les Haro', en: 'The Haro family' },
    hints: {
      es: ['Linaje vizcaíno y riojano muy influyente.', 'Juan Alonso de Haro.'],
      fr: ['Lignée très influente de Biscaye et de La Rioja.', 'Juan Alonso de Haro.'],
      en: ['Influential family of Biscay and La Rioja.', 'Juan Alonso de Haro.']
    }
  },
  't2-3': {
    name: { es: 'Anagrama Alado', fr: 'Anagramme Ailé', en: 'Winged Anagram' },
    question: {
      es: 'Anagrama: R A L O M P A → ordena para formar una palabra relacionada con las aves de las cuevas:',
      fr: 'Anagramme : R A L O M P A → ordonne pour former le nom des oiseaux des grottes (en espagnol PALOMAR) :',
      en: 'Anagram: R A L O M P A → unscramble to reveal the Spanish word for dovecote (PALOMAR):'
    },
    options: {
      es: ['PALOMAR', 'PARMOLA', 'LOMAPAR', 'MORAPAL'],
      fr: ['PALOMAR', 'PARMOLA', 'LOMAPAR', 'MORAPAL'],
      en: ['PALOMAR', 'PARMOLA', 'LOMAPAR', 'MORAPAL']
    },
    answer: { es: 'PALOMAR', fr: 'PALOMAR', en: 'PALOMAR' },
    hints: {
      es: ['Nombre de las cuevas famosas de Nalda.', 'Lugar de palomas.'],
      fr: ['Nom des célèbres grottes de Nalda.', 'Lieu où nichent les pigeons.'],
      en: ['Name of Nalda’s famous caves.', 'Place where doves nest.']
    }
  },
  't3-1': {
    name: { es: 'El Río del Valle', fr: 'La Rivière de la Vallée', en: 'The Valley River' },
    question: {
      es: '¿Cómo se llama el río que atraviesa este valle y fertiliza los huertos de Nalda?',
      fr: 'Comment s’appelle la rivière qui traverse cette vallée et fertilise les vergers de Nalda ?',
      en: 'What is the name of the river that flows through this valley and waters Nalda’s orchards?'
    },
    options: {
      es: ['Río Iregua', 'Río Najerilla', 'Río Leza', 'Río Cidacos'],
      fr: ['Rivière Iregua', 'Rivière Najerilla', 'Rivière Leza', 'Rivière Cidacos'],
      en: ['Iregua River', 'Najerilla River', 'Leza River', 'Cidacos River']
    },
    answer: { es: 'Río Iregua', fr: 'Rivière Iregua', en: 'Iregua River' },
    hints: {
      es: ['Nace en la Sierra Cebollera y desemboca en el Ebro.', 'Empieza por I.'],
      fr: ['Prend sa source dans la Sierra Cebollera.', 'Commence par I.'],
      en: ['Rises in the Sierra Cebollera and joins the Ebro.', 'Starts with I.']
    }
  },
  't3-2': {
    name: { es: 'Caudal del Iregua', fr: 'Débit de l’Iregua', en: 'Iregua Water Flow' },
    question: {
      es: 'Si el caudal medio es de 6,35 m³/s, ¿cuántos litros de agua pasan por segundo aproximadamente?',
      fr: 'Si le débit moyen est de 6,35 m³/s, combien de litres d’eau passent par seconde environ ?',
      en: 'If the average flow is 6.35 m³/s, roughly how many liters of water pass per second?'
    },
    options: {
      es: ['6.350 litros', '635 litros', '63.500 litros', '635.000 litros'],
      fr: ['6 350 litres', '635 litres', '63 500 litres', '635 000 litres'],
      en: ['6,350 liters', '635 liters', '63,500 liters', '635,000 liters']
    },
    answer: { es: '6.350 litros', fr: '6 350 litres', en: '6,350 liters' },
    hints: {
      es: ['1 metro cúbico equivale a 1.000 litros.', 'Multiplica 6,35 por 1.000.'],
      fr: ['1 mètre cube équivaut à 1 000 litres.', 'Multiplie 6,35 par 1 000.'],
      en: ['1 cubic meter equals 1,000 liters.', 'Multiply 6.35 by 1,000.']
    }
  },
  't3-3': {
    name: { es: 'Puerta a la Montaña', fr: 'Porte vers la Montagne', en: 'Gateway to the Mountains' },
    question: {
      es: '¿A qué comarca montañosa histórica daba paso natural este mirador?',
      fr: 'Vers quelle contrée montagneuse historique ce belvédère ouvrait-il la voie ?',
      en: 'To which historic mountainous region did this viewpoint provide a natural gateway?'
    },
    options: {
      es: ['Tierra de Cameros', 'La Alcarria', 'Las Merindades', 'El Somontano'],
      fr: ['Terre de Cameros', 'La Alcarria', 'Las Merindades', 'El Somontano'],
      en: ['Land of Cameros', 'La Alcarria', 'Las Merindades', 'El Somontano']
    },
    answer: { es: 'Tierra de Cameros', fr: 'Terre de Cameros', en: 'Land of Cameros' },
    hints: {
      es: ['El mirador se llama Puerta de Cameros.', 'Cameros nuevo y viejo.'],
      fr: ['Le belvédère s’appelle Puerta de Cameros.', 'Cameros neuf et vieux.'],
      en: ['The viewpoint is called Puerta de Cameros.', 'Cameros.']
    }
  },
  't4-1': {
    name: { es: 'Uso de las Cuevas', fr: 'Usage des Grottes', en: 'Use of the Caves' },
    question: {
      es: '¿Cuál era el uso religioso y posterior de las Cuevas de Los Palomares?',
      fr: 'Quel fut l’usage religieux puis avicole des Grottes de Los Palomares ?',
      en: 'What was the religious and subsequent use of the Los Palomares Caves?'
    },
    options: {
      es: ['Eremitorio rupestre medieval y luego palomar', 'Cantera de mármol', 'Mina de plata', 'Almacén de grano'],
      fr: ['Ermitage rupestre médiéval puis colombier', 'Carrière de marbre', 'Mine d’argent', 'Grenier à grains'],
      en: ['Medieval rock hermitage and later dovecote', 'Marble quarry', 'Silver mine', 'Grain silo']
    },
    answer: { es: 'Eremitorio rupestre medieval y luego palomar', fr: 'Ermitage rupestre médiéval puis colombier', en: 'Medieval rock hermitage and later dovecote' },
    hints: {
      es: ['Monjes en soledad y después cría de palomas.', 'Hornacinas en la roca.'],
      fr: ['Des moines dans la solitude puis élevage de pigeons.', 'Niches dans la roche.'],
      en: ['Solitary monks, then pigeon keeping.', 'Niches carved in the rock.']
    }
  },
  't4-2': {
    name: { es: 'Arquitectura Rupestre', fr: 'Architecture Rupestre', en: 'Cave Architecture' },
    question: {
      es: 'Las cuevas tienen varios niveles tallados en la roca. ¿En qué material geológico están excavadas?',
      fr: 'Les grottes comptent plusieurs niveaux sculptés dans la falaise. Dans quelle roche sont-elles creusées ?',
      en: 'The caves feature multiple levels carved in the cliff. What rock are they excavated into?'
    },
    options: {
      es: ['Areniscas y conglomerados arcillosos', 'Granito volcánico', 'Basalto puro', 'Pizarra laminar'],
      fr: ['Grès et conglomérats argileux', 'Granite volcanique', 'Basalte pur', 'Schiste lamellaire'],
      en: ['Sandstone and clay conglomerates', 'Volcanic granite', 'Pure basalt', 'Lamellar slate']
    },
    answer: { es: 'Areniscas y conglomerados arcillosos', fr: 'Grès et conglomérats argileux', en: 'Sandstone and clay conglomerates' },
    hints: {
      es: ['Roca sedimentaria fácil de tallar pero erosionable.', 'Arenisca rojiza.'],
      fr: ['Roche sédimentaire facile à tailler.', 'Grès rougeâtre.'],
      en: ['Sedimentary rock, easy to carve.', 'Reddish sandstone.']
    }
  },
  't4-3': {
    name: { es: 'Mensajes Alados', fr: 'Messages Ailés', en: 'Winged Messages' },
    question: {
      es: 'Las palomas mensajeras llevaban mensajes atados a sus patas. ¿Qué nombre recibe este sistema de comunicación?',
      fr: 'Les pigeons voyageurs portaient des messages à leurs pattes. Comment nomme-t-on cette communication ?',
      en: 'Carrier pigeons bore dispatches bound to their feet. What is this communication system called?'
    },
    options: {
      es: ['Colombofilia', 'Cetrería', 'Ornitología', 'Apicultura'],
      fr: ['Colombophilie', 'Fauconnerie', 'Ornithologie', 'Apiculture'],
      en: ['Pigeon post (Colombophilia)', 'Falconry', 'Ornithology', 'Beekeeping']
    },
    answer: { es: 'Colombofilia', fr: 'Colombophilie', en: 'Pigeon post (Colombophilia)' },
    hints: {
      es: ['Viene del latín "columba" (paloma).', 'Cría y adiestramiento de palomas.'],
      fr: ['Vient du latin columba (colombe/pigeon).', 'Élevage et dressage de pigeons.'],
      en: ['From Latin columba (dove/pigeon).', 'Breeding and training pigeons.']
    }
  },
  't5-1': {
    name: { es: 'Tierra de Viñedos', fr: 'Terre de Vignobles', en: 'Land of Vineyards' },
    question: {
      es: 'Nalda es tierra de viñedos (Rioja). ¿En qué barricas se cría tradicionalmente el vino de Rioja?',
      fr: 'Nalda est une terre de vignobles (La Rioja). Dans quel bois élève-t-on traditionnellement le vin ?',
      en: 'Nalda is a land of vineyards (Rioja). In which wood barrels is Rioja wine traditionally aged?'
    },
    options: {
      es: ['Roble americano y francés', 'Pino silvestre', 'Castaño dulce', 'Eucalipto'],
      fr: ['Chêne américain et français', 'Pin sylvestre', 'Châtaignier', 'Eucalyptus'],
      en: ['American and French oak', 'Scots pine', 'Sweet chestnut', 'Eucalyptus']
    },
    answer: { es: 'Roble americano y francés', fr: 'Chêne américain et français', en: 'American and French oak' },
    hints: {
      es: ['El árbol que da la bellota.', 'Madera noble de roble.'],
      fr: ['L’arbre qui produit le gland.', 'Bois noble de chêne.'],
      en: ['The tree that produces acorns.', 'Noble oak wood.']
    }
  },
  't5-2': {
    name: { es: 'El Códice de Nalda', fr: 'Le Codex de Nalda', en: 'The Codex of Nalda' },
    question: {
      es: 'Has recogido fragmentos en cada POI. Ordena las letras para formar el sello sagrado de 5 letras de este municipio:',
      fr: 'Tu as recueilli des fragments à chaque étape. Ordonne les 5 lettres pour former le sceau sacré de la commune :',
      en: 'You gathered fragments at each waypoint. Unscramble the 5 letters to form the town’s sacred seal:'
    },
    options: {
      es: ['NALDA', 'ALDNA', 'LANDA', 'ADLAN'],
      fr: ['NALDA', 'ALDNA', 'LANDA', 'ADLAN'],
      en: ['NALDA', 'ALDNA', 'LANDA', 'ADLAN']
    },
    answer: { es: 'NALDA', fr: 'NALDA', en: 'NALDA' },
    hints: {
      es: ['El nombre de esta villa riojana.', 'Comienza por N.'],
      fr: ['Le nom de ce village de La Rioja.', 'Commence par N.'],
      en: ['The name of this town in La Rioja.', 'Starts with N.']
    }
  },
  'extra-foto-castillo': {
    name: { es: 'Marca de Cantería', fr: 'Marque de Tailleur de Pierre', en: 'Stonemason Mark' },
    question: {
      es: 'Fotografía una piedra con marca de cantero o sillar antiguo sin tocar nada.',
      fr: 'Prends en photo une pierre portant une marque de tailleur ou un bloc ancien sans rien toucher.',
      en: 'Photograph a stone bearing an ancient stonemason mark without touching anything.'
    },
    answer: { es: 'Foto de marca de cantero', fr: 'Photo de marque de tailleur', en: 'Photo of stonemason mark' }
  },
  'extra-escucha-mirador': {
    name: { es: 'Eco de Cameros', fr: 'Écho de Cameros', en: 'Echo of Cameros' },
    question: {
      es: '30 segundos en silencio. Marca los sonidos que oyes desde el valle:',
      fr: '30 secondes de silence. Coche les sons que tu perçois depuis la vallée :',
      en: '30 seconds in silence. Check the sounds you hear echoing from the valley:'
    },
    options: {
      es: ['Viento en la roca', 'Pájaros del valle', 'Campana lejana', 'Agua del Iregua'],
      fr: ['Vent sur la roche', 'Oiseaux de la vallée', 'Cloche lointaine', 'Eau de l’Iregua'],
      en: ['Wind on the rock', 'Valley birds', 'Distant bell', 'Water of the Iregua']
    },
    answer: { es: 'Viento en la roca, Pájaros del valle, Campana lejana, Agua del Iregua', fr: 'Vent sur la roche, Oiseaux de la vallée, Cloche lointaine, Eau de l’Iregua', en: 'Wind on the rock, Valley birds, Distant bell, Water of the Iregua' }
  },
  'extra-brujula-mirador': {
    name: { es: 'Orientación Norte', fr: 'Orientation Nord', en: 'North Orientation' },
    question: {
      es: 'Mantén el móvil orientado al Norte 3 s (±15°) mirando hacia Logroño y el Ebro.',
      fr: 'Maintiens le téléphone orienté vers le Nord pendant 3 s (±15°) en regardant vers Logroño et l’Èbre.',
      en: 'Keep your phone pointed North for 3 seconds (±15°) facing Logroño and the Ebro.'
    },
    answer: { es: '0', fr: '0', en: '0' }
  },
  'extra-ordena-camino': {
    name: { es: 'La Vía Romana del Iregua', fr: 'La Voie Romaine de l’Iregua', en: 'Roman Road of the Iregua' },
    question: {
      es: 'Ordena de norte a sur los hitos del Valle del Iregua: Vareia → Nalda → Viguera → Torrecilla → Puerto de Piqueras',
      fr: 'Ordonne du nord au sud les étapes de la Vallée de l’Iregua : Vareia → Nalda → Viguera → Torrecilla → Col de Piqueras',
      en: 'Order from North to South the stations of the Iregua Valley: Vareia → Nalda → Viguera → Torrecilla → Piqueras Pass'
    },
    options: {
      es: ['Vareia (Logroño)', 'Nalda', 'Viguera', 'Torrecilla en Cameros', 'Puerto de Piqueras'],
      fr: ['Vareia (Logroño)', 'Nalda', 'Viguera', 'Torrecilla en Cameros', 'Col de Piqueras'],
      en: ['Vareia (Logroño)', 'Nalda', 'Viguera', 'Torrecilla en Cameros', 'Piqueras Pass']
    },
    answer: {
      es: 'Vareia (Logroño), Nalda, Viguera, Torrecilla en Cameros, Puerto de Piqueras',
      fr: 'Vareia (Logroño), Nalda, Viguera, Torrecilla en Cameros, Col de Piqueras',
      en: 'Vareia (Logroño), Nalda, Viguera, Torrecilla en Cameros, Piqueras Pass'
    }
  },
  'extra-escucha-cuevas': {
    name: { es: 'El Susurro de las Hornacinas', fr: 'Le Chuchotement des Niches', en: 'Whisper of the Niches' },
    question: {
      es: '30 s en silencio dentro de las cuevas. ¿Qué oyes en la roca?',
      fr: '30 s de silence dans les grottes. Qu’entends-tu dans la roche ?',
      en: '30 seconds of silence inside the caves. What do you hear in the rock?'
    },
    options: {
      es: ['Aleteo de palomas', 'Goteo de humedad', 'Eco del viento', 'Silencio monacal'],
      fr: ['Battement d’ailes', 'Gouttes d’humidité', 'Écho du vent', 'Silence monastique'],
      en: ['Flapping wings', 'Moisture drips', 'Wind echo', 'Monastic silence']
    },
    answer: { es: 'Aleteo de palomas, Goteo de humedad, Eco del viento, Silencio monacal', fr: 'Battement d’ailes, Gouttes d’humidité, Écho du vent, Silence monastique', en: 'Flapping wings, Moisture drips, Wind echo, Monastic silence' }
  },
  'f-t1-1': {
    name: { es: 'El Preso de Fray Botijo', fr: 'Le Prisonnier de Fray Botijo', en: 'Fray Botijo’s Inmate' },
    question: {
      es: 'A ver, chaval, aquí encerraron a un noble en 1299. ¿A quién? Pista: yo estaba borracho, pero me acuerdo de que era un poco plasta.',
      fr: 'Bon, mon gars, ici on a enfermé un noble en 1299. Qui ? Indice : j’étais soûl, mais je me rappelle qu’il était un peu casse-pieds.',
      en: 'Listen here, mate, they locked up a nobleman here in 1299. Who was it? Hint: I was drunk, but I remember he was a bit of a pain.'
    },
    options: {
      es: ['Juan Núñez de Lara', 'El Cid Campeador', 'El Obispo de Calahorra', 'El Conde Duque de Olivares'],
      fr: ['Juan Núñez de Lara', 'Le Cid Campeador', 'L’évêque de Calahorra', 'Le Comte-Duc d’Olivares'],
      en: ['Juan Núñez de Lara', 'El Cid', 'The Bishop of Calahorra', 'The Count-Duke of Olivares']
    },
    answer: { es: 'Juan Núñez de Lara', fr: 'Juan Núñez de Lara', en: 'Juan Núñez de Lara' },
    hints: {
      es: ['Lara, como el apellido.', 'Noble de postín.'],
      fr: ['Lara, comme le nom de famille.', 'Grand seigneur.'],
      en: ['Lara, that is the surname.', 'High-born nobleman.']
    }
  },
  'f-t1-2': {
    name: { es: 'Las Almenas Medievales', fr: 'Les Créneaux Médiévaux', en: 'The Medieval Battlements' },
    question: {
      es: '¿En qué siglo se alzaron las defensas principales de este castillo de Nalda?',
      fr: 'En quel siècle les défenses principales de ce château de Nalda furent-elles érigées ?',
      en: 'In which century were the main defenses of this castle of Nalda erected?'
    },
    options: {
      es: ['Siglo XIII', 'Siglo XXI', 'Siglo V a.C.', 'Siglo XIX'],
      fr: ['XIIIe siècle', 'XXIe siècle', 'Ve siècle av. J.-C.', 'XIXe siècle'],
      en: ['13th Century', '21st Century', '5th Century BC', '19th Century']
    },
    answer: { es: 'Siglo XIII', fr: 'XIIIe siècle', en: '13th Century' },
    hints: {
      es: ['Plena Edad Media.', 'Años 1200.'],
      fr: ['Plein Moyen Âge.', 'Années 1200.'],
      en: ['High Middle Ages.', 'The 1200s.']
    }
  },
  'f-t1-3': {
    name: { es: 'El Linaje de los Haro', fr: 'La Lignée des Haro', en: 'The House of Haro' },
    question: {
      es: '¿Qué linaje señorial tomó posesión del Castillo de Nalda en el siglo XIII?',
      fr: 'Quelle lignée seigneuriale prit possession du Château de Nalda au XIIIe siècle ?',
      en: 'Which noble lineage took possession of Nalda Castle in the 13th century?'
    },
    options: {
      es: ['Los Señores de Cameros (familia Haro)', 'Los Borgia', 'Los Reyes Católicos', 'Los Templarios de París'],
      fr: ['Les Seigneurs de Cameros (famille Haro)', 'Les Borgia', 'Les Rois Catholiques', 'Les Templiers de Paris'],
      en: ['The Lords of Cameros (Haro family)', 'The Borgias', 'The Catholic Monarchs', 'The Knights Templar']
    },
    answer: { es: 'Los Señores de Cameros (familia Haro)', fr: 'Les Seigneurs de Cameros (famille Haro)', en: 'The Lords of Cameros (Haro family)' },
    hints: {
      es: ['Juan Alonso de Haro.', 'Señorío de Cameros.'],
      fr: ['Juan Alonso de Haro.', 'Seigneurie de Cameros.'],
      en: ['Juan Alonso de Haro.', 'Lordship of Cameros.']
    }
  },
  'f-t2-1': {
    name: { es: 'La Puerta del Arco', fr: 'La Porte de l’Arche', en: 'The Arch Gateway' },
    question: {
      es: 'Al cruzar el Arco de la Villa, ¿qué función defensiva cumplía en la muralla?',
      fr: 'En franchissant l’Arche de la Ville, quelle fonction défensive remplissait-elle ?',
      en: 'When passing through the Village Arch, what defensive role did it play?'
    },
    options: {
      es: ['Puerta fortificada y control de paso', 'Túnel de escape secreto', 'Almacén de barriles', 'Torre del reloj'],
      fr: ['Porte fortifiée et contrôle de passage', 'Tunnel secret d’évasion', 'Entrepôt de tonneaux', 'Tour de l’horloge'],
      en: ['Fortified gate and checkpoint', 'Secret escape tunnel', 'Barrel warehouse', 'Clock tower']
    },
    answer: { es: 'Puerta fortificada y control de paso', fr: 'Porte fortifiée et contrôle de passage', en: 'Fortified gate and checkpoint' },
    hints: {
      es: ['Nadie entraba sin permiso a la villa.', 'Puerta de la muralla.'],
      fr: ['Nul n’entrait sans autorisation.', 'Porte de la muraille.'],
      en: ['No one entered without permission.', 'Rampart gate.']
    }
  },
  'f-t2-2': {
    name: { es: 'La Piedra del Arco', fr: 'La Pierre de l’Arche', en: 'The Arch Stonework' },
    question: {
      es: '¿Qué tipo de piedra arenisca característica da color dorado a los sillares del Arco?',
      fr: 'Quel type de grès caractéristique confère sa teinte dorée aux pierres de l’Arche ?',
      en: 'What characteristic sandstone gives the Arch’s ashlars their golden hue?'
    },
    options: {
      es: ['Arenisca dorada de cantera local', 'Mármol negro pulido', 'Granito blanco del norte', 'Ladrillo cocido'],
      fr: ['Grès doré des carrières locales', 'Marbre noir poli', 'Granite blanc du nord', 'Brique cuite'],
      en: ['Golden sandstone from local quarries', 'Polished black marble', 'White northern granite', 'Fired brick']
    },
    answer: { es: 'Arenisca dorada de cantera local', fr: 'Grès doré des carrières locales', en: 'Golden sandstone from local quarries' },
    hints: {
      es: ['Piedra de la comarca.', 'Color miel y arena.'],
      fr: ['Pierre du cru.', 'Teinte miel et sable.'],
      en: ['Local stone.', 'Honey and sand color.']
    }
  },
  'f-t2-3': {
    name: { es: 'La Hornacina Devota', fr: 'La Niche Dévote', en: 'The Devout Niche' },
    question: {
      es: '¿Qué patrona religiosa coronaba tradicionalmente la hornacina de protección del Arco?',
      fr: 'Quelle sainte patronne protectrice veillait traditionnellement dans la niche de l’Arche ?',
      en: 'Which protective patron saint traditionally topped the protective niche of the Arch?'
    },
    options: {
      es: ['La Virgen protectora de los caminantes', 'Santa Bárbara de los truenos', 'San Millán de la Cogolla', 'San Mateo del vino'],
      fr: ['La Vierge protectrice des pèlerins', 'Sainte Barbe du tonnerre', 'Saint Émilien de la Cogolla', 'Saint Matthieu du vin'],
      en: ['The Virgin protecting wayfarers', 'Saint Barbara of thunder', 'Saint Emilian of Cogolla', 'Saint Matthew of wine']
    },
    answer: { es: 'La Virgen protectora de los caminantes', fr: 'La Vierge protectrice des pèlerins', en: 'The Virgin protecting wayfarers' },
    hints: {
      es: ['Advocación mariana que bendecía a quien cruzaba.', 'La Virgen.'],
      fr: ['Figure mariale bénissant les passants.', 'La Vierge.'],
      en: ['Marian invocation blessing travelers.', 'The Virgin.']
    }
  },
  'f-t3-1': {
    name: { es: 'Vistas desde Cameros', fr: 'Vue depuis Cameros', en: 'Views from Cameros' },
    question: {
      es: 'Desde el Mirador Puerta de Cameros se domina el paso hacia el sur. ¿Qué río labró este cañón?',
      fr: 'Depuis le belvédère Puerta de Cameros, on domine le passage vers le sud. Quelle rivière a creusé ce défilé ?',
      en: 'From the Puerta de Cameros Viewpoint, you overlook the southern pass. What river carved this canyon?'
    },
    options: {
      es: ['El río Iregua', 'El río Sena', 'El río Támesis', 'El río Danubio'],
      fr: ['La rivière Iregua', 'La Seine', 'La Tamise', 'Le Danube'],
      en: ['The Iregua River', 'The Seine', 'The Thames', 'The Danube']
    },
    answer: { es: 'El río Iregua', fr: 'La rivière Iregua', en: 'The Iregua River' },
    hints: {
      es: ['Río emblemático de Nalda.', 'Iregua.'],
      fr: ['Rivière emblématique de Nalda.', 'Iregua.'],
      en: ['Nalda’s iconic river.', 'Iregua.']
    }
  },
  'f-t3-2': {
    name: { es: 'Las Peñas del Valle', fr: 'Les Falaises de la Vallée', en: 'The Valley Crags' },
    question: {
      es: '¿Qué formación montañosa de cortados rocosos se divisa al fondo hacia Islallana y Viguera?',
      fr: 'Quelle falaise spectaculaire aperçoit-on au fond en direction d’Islallana et Viguera ?',
      en: 'What dramatic rock cliff formation is visible in the distance toward Islallana and Viguera?'
    },
    options: {
      es: ['Las Peñas del Iregua (Peña Bajenza y el Castillo)', 'Los Pirineos nevados', 'Los Alpes marítimos', 'El Teide volcánico'],
      fr: ['Les Falaises de l’Iregua (Peña Bajenza)', 'Les Pyrénées enneigées', 'Les Alpes maritimes', 'Le Teide volcanique'],
      en: ['The Iregua Crags (Peña Bajenza)', 'The snowy Pyrenees', 'The Maritime Alps', 'Mount Teide']
    },
    answer: { es: 'Las Peñas del Iregua (Peña Bajenza y el Castillo)', fr: 'Les Falaises de l’Iregua (Peña Bajenza)', en: 'The Iregua Crags (Peña Bajenza)' },
    hints: {
      es: ['Enormes cortados de conglomerado rojizo.', 'Peña Bajenza.'],
      fr: ['Immenses parois de conglomérat rouge.', 'Peña Bajenza.'],
      en: ['Giant reddish conglomerate bluffs.', 'Peña Bajenza.']
    }
  },
  'f-t3-3': {
    name: { es: 'Trasnshumancia y Lana', fr: 'Transhumance et Laine', en: 'Transhumance and Wool' },
    question: {
      es: '¿Qué actividad económica milenaria de trashumancia trajo riqueza y lana fina a Cameros y Nalda?',
      fr: 'Quelle activité pastorale ancestrale de transhumance apporta fortune et laine fine à Cameros et Nalda ?',
      en: 'What ancient pastoral transhumance activity brought wealth and fine wool to Cameros and Nalda?'
    },
    options: {
      es: ['El pastoreo de ovejas merinas por cañadas reales', 'La pesca de trucha en alta mar', 'El cultivo de piña tropical', 'La minería de carbón'],
      fr: ['L’élevage des brebis mérinos sur les drailles royales', 'La pêche à la truite en haute mer', 'La culture d’ananas', 'L’extraction de charbon'],
      en: ['Merino sheep pastoralism along royal drover paths', 'Deep-sea trout fishing', 'Pineapple farming', 'Coal mining']
    },
    answer: { es: 'El pastoreo de ovejas merinas por cañadas reales', fr: 'L’élevage des brebis mérinos sur les drailles royales', en: 'Merino sheep pastoralism along royal drover paths' },
    hints: {
      es: ['La Mesta y las ovejas merinas.', 'Cañadas de ganado.'],
      fr: ['La Mesta et les brebis mérinos.', 'Voies de transhumance.'],
      en: ['The Mesta and Merino sheep.', 'Livestock drovers.']
    }
  },
  'f-t4-1': {
    name: { es: 'Las Celdas del Silencio', fr: 'Les Cellules du Silence', en: 'Cells of Silence' },
    question: {
      es: 'Las Cuevas de Los Palomares tienen decenas de huecos. ¿Qué hacían allí los monjes ermitaños en el medievo?',
      fr: 'Les Grottes de Los Palomares comptent des dizaines de cavités. Que faisaient là les moines ermites ?',
      en: 'The Los Palomares Caves have dozens of niches. What did hermit monks do there in the Middle Ages?'
    },
    options: {
      es: ['Orar en retiro espiritual y penitencia', 'Montar fiestas clandestinas', 'Guardar barcos', 'Producir fuegos artificiales'],
      fr: ['Prier dans la retraite spirituelle et le jeûne', 'Donner des fêtes clandestines', 'Entreposer des navires', 'Fabriquer des feux d’artifice'],
      en: ['Pray in spiritual retreat and penance', 'Hold secret parties', 'Store ships', 'Manufacture fireworks']
    },
    answer: { es: 'Orar en retiro espiritual y penitencia', fr: 'Prier dans la retraite spirituelle et le jeûne', en: 'Pray in spiritual retreat and penance' },
    hints: {
      es: ['Vida ascética alejada del mundo.', 'Oración y retiro.'],
      fr: ['Vie ascétique loin du monde.', 'Prière et retraite.'],
      en: ['Ascetic life away from the world.', 'Prayer and retreat.']
    }
  },
  'f-t4-2': {
    name: { es: 'Geología de Palomares', fr: 'Géologie des Palomares', en: 'Palomares Geology' },
    question: {
      es: '¿En qué tipo de roca blanda conglomerada se excavaron a mano estas galerías?',
      fr: 'Dans quelle roche meuble conglomératique ces galeries ont-elles été creusées à la main ?',
      en: 'Into what soft conglomerate rock were these galleries carved by hand?'
    },
    options: {
      es: ['Conglomerado arenoso de origen fluvial', 'Diamante puro', 'Granito impermeable', 'Mármol de Carrara'],
      fr: ['Conglomérat sableux d’origine fluviale', 'Diamant pur', 'Granite imperméable', 'Marbre de Carrare'],
      en: ['Sandy conglomerate of river origin', 'Pure diamond', 'Impermeable granite', 'Carrara marble']
    },
    answer: { es: 'Conglomerado arenoso de origen fluvial', fr: 'Conglomérat sableux d’origine fluviale', en: 'Sandy conglomerate of river origin' },
    hints: {
      es: ['Sedimentos que se pueden excavar con pico de hierro.', 'Grava y arena compacta.'],
      fr: ['Sédiments pouvant être creusés au pic.', 'Gravier et sable compactés.'],
      en: ['Sediments easily hewn with an iron pick.', 'Compacted gravel and sand.']
    }
  },
  'f-t4-3': {
    name: { es: 'Censo de Hornacinas', fr: 'Recensement des Niches', en: 'Census of Niches' },
    question: {
      es: '¿Aproximadamente cuántos nichos individuales tallados se conservan en la pared de Los Palomares?',
      fr: 'Combien de niches individuelles taillées dénombre-t-on environ dans la paroi des Palomares ?',
      en: 'Roughly how many carved individual niches are preserved in the Los Palomares cliff wall?'
    },
    options: {
      es: ['Más de 200 hornacinas', 'Exactamente 3', 'Tres millones', 'Ninguna'],
      fr: ['Plus de 200 niches', 'Exactement 3', 'Trois millions', 'Aucune'],
      en: ['More than 200 niches', 'Exactly 3', 'Three million', 'None']
    },
    answer: { es: 'Más de 200 hornacinas', fr: 'Plus de 200 niches', en: 'More than 200 niches' },
    hints: {
      es: ['Cientos de huecos que parecen un panal.', 'Más de dos centenas.'],
      fr: ['Des centaines de cavités comme une ruche.', 'Plus de deux cents.'],
      en: ['Hundreds of cavities resembling a honeycomb.', 'Over two hundred.']
    }
  },
  'f-t5-1': {
    name: { es: 'El Estilo de Villavieja', fr: 'Le Style de Villavieja', en: 'Style of Villavieja' },
    question: {
      es: 'En la Ermita de Villavieja, ¿qué estilo arquitectónico sobrio y popular rural predomina?',
      fr: 'À l’Ermitage de Villavieja, quel style architectural rural et sobre prédomine ?',
      en: 'At the Hermitage of Villavieja, which sober and popular rural architectural style predominates?'
    },
    options: {
      es: ['Barroco rural del siglo XVII con espadaña', 'Gótico radiante francés', 'Rascacielos art déco', 'Panteón romano'],
      fr: ['Baroque rural du XVIIe siècle à clocheton', 'Gothique rayonnant français', 'Gratte-ciel Art déco', 'Panthéon romain'],
      en: ['17th-century rural Baroque with belfry', 'French Rayonnant Gothic', 'Art Deco skyscraper', 'Roman Pantheon']
    },
    answer: { es: 'Barroco rural del siglo XVII con espadaña', fr: 'Baroque rural du XVIIe siècle à clocheton', en: '17th-century rural Baroque with belfry' },
    hints: {
      es: ['Edificio del siglo XVII.', 'Sencilla espadaña de campana.'],
      fr: ['Édifice du XVIIe siècle.', 'Simple clocheton.'],
      en: ['17th-century sanctuary.', 'Modest belfry.']
    }
  },
  'f-t5-2': {
    name: { es: 'La Romería del Bollo', fr: 'Le Pèlerinage du Brioche', en: 'The Bread Pilgrimage' },
    question: {
      es: '¿Qué celebración popular reúne cada primavera a los vecinos de Nalda en la pradera de esta ermita?',
      fr: 'Quelle fête populaire rassemble chaque printemps les habitants de Nalda dans le pré de cet ermitage ?',
      en: 'What popular celebration gathers the townsfolk of Nalda every spring in this hermitage meadow?'
    },
    options: {
      es: ['La Fiesta de los Gallos y Romería de Villavieja', 'El Carnaval de Río', 'El Festival de Cine de Cannes', 'La Fiesta de la Cerveza de Múnich'],
      fr: ['La Fête des Coqs et Pèlerinage de Villavieja', 'Le Carnaval de Rio', 'Le Festival de Cannes', 'L’Oktoberfest de Munich'],
      en: ['Feast of the Roosters & Villavieja Pilgrimage', 'Rio Carnival', 'Cannes Film Festival', 'Munich Oktoberfest']
    },
    answer: { es: 'La Fiesta de los Gallos y Romería de Villavieja', fr: 'La Fête des Coqs et Pèlerinage de Villavieja', en: 'Feast of the Roosters & Villavieja Pilgrimage' },
    hints: {
      es: ['Reparto de bollos preñados y bendición popular.', 'Romería tradicional.'],
      fr: ['Distribution de brioches garnies et bénédiction.', 'Pèlerinage traditionnel.'],
      en: ['Sharing traditional stuffed rolls and blessing.', 'Traditional pilgrimage.']
    }
  },
  'f-extra-brindis': {
    name: { es: 'El Brindis de Fray Botijo', fr: 'Le Toast de Fray Botijo', en: 'Fray Botijo’s Toast' },
    question: {
      es: 'Hazte una foto alzando una bota, vaso o cantimplora brindando con las ruinas del castillo al fondo. Si es vino, +10 puntos de respeto del fraile.',
      fr: 'Prends une photo en levant une gourde, un verre ou une fiole en trinquant avec les ruines du château en arrière-plan.',
      en: 'Take a photo raising a canteen, cup, or glass toasting with the castle ruins in the background.'
    },
    answer: { es: 'Foto de brindis festivo', fr: 'Photo de toast festif', en: 'Photo of festive toast' }
  },
  'f-extra-eructo': {
    name: { es: 'Acústica de Taberna', fr: 'Acoustique de Taverne', en: 'Tavern Acoustics' },
    question: {
      es: 'Graba un sonoro suspiro, eructo o exclamación de taberna bajo la acústica de la bóveda del arco. Cuanto más gordo, mejor.',
      fr: 'Enregistre un soupir théâtral ou une joyeuse exclamation de taverne sous la voûte de l’Arche.',
      en: 'Record a loud sigh or hearty tavern exclamation beneath the vaulted acoustics of the arch.'
    },
    answer: { es: 'Audio bajo el arco', fr: 'Audio sous l’arche', en: 'Audio under the arch' }
  },
  'f-extra-confesion': {
    name: { es: 'La Hornacina Confesionario', fr: 'La Niche Confessionnal', en: 'Confessional Niche' },
    question: {
      es: 'Susurra un secreto inconfesable (o un pecado gastronómico) en una de las hornacinas de Los Palomares. El fraile escucha, aunque esté borracho.',
      fr: 'Chuchote un petit péché gourmand dans l’une des niches de Los Palomares. Le moine pardonne tout !',
      en: 'Whisper a confession (or a food craving) into one of the rock niches of Los Palomares. The friar listens!'
    },
    answer: { es: 'Confesión en la roca', fr: 'Confession dans la roche', en: 'Confession in the rock' }
  },
  'f-extra-pecho': {
    name: { es: 'El Señor del Viento', fr: 'Le Seigneur du Vent', en: 'Lord of the Wind' },
    question: {
      es: 'Sácate una foto abriendo los brazos al viento de Cameros como si fueras el rey del Iregua. El fraile te nombra escudero honorífico.',
      fr: 'Prends une photo en ouvrant les bras au vent de Cameros comme si tu régnas sur l’Iregua. Le moine t’adoube écuyer !',
      en: 'Take a photo opening your arms to the Cameros wind as if reigning over the Iregua valley!'
    },
    answer: { es: 'Foto brazos abiertos', fr: 'Photo bras ouverts', en: 'Photo arms outstretched' }
  },
  'f-extra-siesta': {
    name: { es: 'La Siesta Sagrada', fr: 'La Sieste Sacrée', en: 'The Sacred Nap' },
    question: {
      es: 'Graba un breve vídeo de 3 segundos fingiendo roncar plácidamente en el banco o prado de la ermita. La siesta es sagrada, como el vino.',
      fr: 'Enregistre une courte vidéo de 3 secondes mimant une sieste paisible sur l’herbe de l’ermitage. La sieste est sacrée !',
      en: 'Record a 3-second video pretending to take a peaceful nap on the hermitage lawn. The siesta is sacred!'
    },
    answer: { es: 'Vídeo de siesta', fr: 'Vidéo de sieste', en: 'Video of nap' }
  },
  'f-extra-baile-vino': {
    name: { es: 'El Baile Achispado', fr: 'La Danse du Moine Joyeux', en: 'The Merry Monk Dance' },
    question: {
      es: 'Imita los pasos torpes y alegres de Fray Botijo celebrando una buena cosecha de vino de Rioja. Cuanto más ridículo, mejor.',
      fr: 'Imite les pas joyeux de Fray Botijo fêtant une belle récolte de vin de La Rioja !',
      en: 'Mimic Fray Botijo’s joyful clumsy dance steps celebrating a bountiful Rioja grape harvest!'
    },
    answer: { es: 'Mímica del baile', fr: 'Mime de la danse', en: 'Mimic of dance' }
  },
  'chucho-t1-castillo': {
    name: { es: 'Ojo de Paloma en el Castillo', fr: 'Œil de Pigeon au Château', en: 'Pigeon Eye on the Castle' },
    question: {
      es: 'Oye, plumas: desde lo alto de la torre del castillo veo todo el valle. En 1299 encerraron aquí a un noble de postín. ¿Quién era el pájaro enjaulado?',
      fr: 'Dis donc, camarade emplumé : du haut de la tour du château, je vois toute la vallée. En 1299, on a enfermé ici un noble huppé. Qui était cet oiseau en cage ?',
      en: 'Hey feathers: from atop the castle tower, I can spot the whole valley. In 1299 they caged a fancy noble here. Who was this bird?'
    },
    options: {
      es: ['Don Juan de Austria', 'Juan Alonso de Haro', 'El Obispo de Calahorra', 'El Cid Campeador'],
      fr: ['Don Juan d’Autriche', 'Juan Alonso de Haro', 'L’évêque de Calahorra', 'Le Cid Campeador'],
      en: ['Don John of Austria', 'Juan Alonso de Haro', 'The Bishop of Calahorra', 'El Cid']
    },
    answer: { es: 'Juan Alonso de Haro', fr: 'Juan Alonso de Haro', en: 'Juan Alonso de Haro' },
    hints: {
      es: ['No llevaba plumas, pero era señor de Cameros.', 'Su apellido tiene nombre de pueblo con mucho vino.'],
      fr: ['Il n’avait pas d’ailes, mais c’était le seigneur de Cameros.', 'Son nom est celui d’une célèbre ville viticole.'],
      en: ['He had no wings, but was Lord of Cameros.', 'His name shares a famous wine town.']
    }
  },
  'chucho-t2-arco': {
    name: { es: 'Aduana de Plumas en el Arco', fr: 'Douane des Plumes à l’Arche', en: 'Feather Toll at the Arch' },
    question: {
      es: 'Mis palomas montan guardia en lo alto del Arco de la Villa. ¿Qué función histórica tenía este arco de piedra en la muralla medieval?',
      fr: 'Mes pigeons montent la garde au sommet de l’Arche de la Ville. Quelle fonction historique avait cette porte de pierre ?',
      en: 'My pigeons keep watch from atop the Village Arch. What historic function did this stone arch serve in the medieval walls?'
    },
    answer: { es: 'Puerta defensiva de entrada a la villa', fr: 'Porte défensive d’entrée de la ville', en: 'Defensive town entrance gate' },
    hints: {
      es: ['Nadie pasaba sin ser visto desde arriba.', 'Era la puerta principal del recinto amurallado.'],
      fr: ['Personne ne passait sans être repéré d’en haut.', 'C’était la porte d’entrée de la muraille.'],
      en: ['Nobody passed without being spotted from above.', 'It was the main gate in the walls.']
    }
  },
  'chucho-t3-mirador': {
    name: { es: 'Ruta de Vuelo Cameros', fr: 'Couloir de Vol de Cameros', en: 'Cameros Flight Path' },
    question: {
      es: '¿Qué río desciende por el cañón hacia el Ebro y es nuestra piscina favorita para remojar las plumas?',
      fr: 'Quelle rivière descend le canyon vers l’Èbre et sert de bain favori pour nos plumes ?',
      en: 'Which river flows down the canyon toward the Ebro and is our favorite bath to ruffle our feathers?'
    },
    answer: { es: 'Iregua', fr: 'Iregua', en: 'Iregua' },
    hints: {
      es: ['Empieza por I y tiene 6 letras.', 'Pasa rozando Nalda.'],
      fr: ['Commence par un I et compte 6 lettres.', 'Frôle Nalda.'],
      en: ['Starts with an I and has 6 letters.', 'Borders Nalda.']
    }
  },
  'chucho-t4-palomares': {
    name: { es: 'El Cuartel General de la Banda', fr: 'Le Quartier Général de la Bande', en: 'Flock Headquarters' },
    question: {
      es: '¡Aquí está mi palacio! Las Cuevas de Los Palomares tienen decenas de huecos tallados en roca. ¿Qué uso religioso tuvieron antes de ser nuestro hogar?',
      fr: 'Voici mon palais ! Les Grottes de Los Palomares ont des dizaines d’alvéoles sculptées dans la roche. Quel usage religieux avaient-elles autrefois ?',
      en: 'Here is my palace! Los Palomares Caves have dozens of rock-hewn chambers. What religious purpose did they serve before becoming our roost?'
    },
    options: {
      es: ['Eremitorio medieval de monjes', 'Almacén de pólvora carlista', 'Caballerizas romanas', 'Molino de agua subterráneo'],
      fr: ['Ermitage médiéval de moines', 'Poudrière carliste', 'Écuries romaines', 'Moulin à eau souterrain'],
      en: ['Medieval monk hermitage', 'Carlist gunpowder stash', 'Roman stables', 'Underground water mill']
    },
    answer: { es: 'Eremitorio medieval de monjes', fr: 'Ermitage médiéval de moines', en: 'Medieval monk hermitage' },
    hints: {
      es: ['Eran celdas de silencio y oración para ermitaños.', 'Siglos después vinieron las palomas.'],
      fr: ['C’étaient des cellules de prière pour ermites.', 'Des siècles plus tard arrivèrent les pigeons.'],
      en: ['They were quiet cells of contemplation for hermits.', 'Pigeons moved in centuries later.']
    }
  },
  'chucho-t5-ermita': {
    name: { es: 'La Campana de Villavieja', fr: 'La Cloche de Villavieja', en: 'The Bell of Villavieja' },
    question: {
      es: 'En la espadaña de la Ermita de Villavieja nos posamos a tomar el sol. ¿Qué celebración tradicional reúne a los vecinos con bollos y procesión en este lugar?',
      fr: 'Sur le clocheton de l’Ermitage de Villavieja, nous prenons le soleil. Quelle fête traditionnelle rassemble les villageois avec brioches et procession ?',
      en: 'On the bell gable of Villavieja Hermitage, we bask in the sun. What traditional festival gathers locals with bread rolls and procession here?'
    },
    options: {
      es: ['La Romería de Villavieja', 'La Tomatina de Nalda', 'La Batalla del Vino de Cameros', 'El Desfile de Halcones'],
      fr: ['Le Pèlerinage de Villavieja', 'La Tomatina de Nalda', 'La Bataille du Vin de Cameros', 'Le Défilé des Faucons'],
      en: ['The Villavieja Pilgrimage', 'Nalda Tomato Fight', 'Cameros Wine Battle', 'Falcon Parade']
    },
    answer: { es: 'La Romería de Villavieja', fr: 'Le Pèlerinage de Villavieja', en: 'The Villavieja Pilgrimage' },
    hints: {
      es: ['Una fiesta popular llena de cánticos y devoción.', 'Se sube en romería.'],
      fr: ['Une fête populaire rythmée de chants dévots.', 'On y monte en pèlerinage.'],
      en: ['A beloved local festival with hymns and devotion.', 'A traditional pilgrimage.']
    }
  },
  'zorbo-t1-castillo': {
    name: { es: 'La Rampa de Lanzamiento Medieval', fr: 'La Rampe de Lancement Médiévale', en: 'The Medieval Launchpad' },
    question: {
      es: '¡Por las lunas de Júpiter! La elevación de este castillo ofrece un ángulo de reentrada orbital perfecto. ¿En qué siglo terrícola se construyó la fortaleza defensiva de Nalda?',
      fr: 'Par les lunes de Jupiter ! L’élévation de ce château offre un angle de rentrée orbitale optimal. En quel siècle terrestre la forteresse de Nalda fut-elle bâtie ?',
      en: 'By the moons of Jupiter! The altitude of this castle offers a prime orbital re-entry vector. In which Earth century was Nalda’s fortress constructed?'
    },
    options: {
      es: ['Siglo X (Edad Media)', 'Siglo XIII (Edad Media)', 'Siglo XX (Era Espacial)', 'Año 3000'],
      fr: ['Xe siècle (Moyen Âge)', 'XIIIe siècle (Moyen Âge)', 'XXe siècle (Ère spatiale)', 'An 3000'],
      en: ['10th Century (Middle Ages)', '13th Century (Middle Ages)', '20th Century (Space Age)', 'Year 3000']
    },
    answer: { es: 'Siglo XIII (Edad Media)', fr: 'XIIIe siècle (Moyen Âge)', en: '13th Century (Middle Ages)' },
    hints: {
      es: ['Fue durante la época de los Señores de Cameros en el medievo.', 'Alrededor del año 1200-1300.'],
      fr: ['Pendant l’époque des Seigneurs de Cameros.', 'Autour de l’an 1250.'],
      en: ['During the era of the Lords of Cameros.', 'Around the 1200s.']
    }
  },
  'zorbo-t2-arco': {
    name: { es: 'El Portal de Cuarzo y Caliza', fr: 'Le Portail de Quartz et Calcaire', en: 'The Quartz and Limestone Portal' },
    question: {
      es: 'Mis escáneres registran una curvatura geométrica perfecta en este arco. En la cultura terrícola, ¿para qué servía esta compuerta de la villa amurallada?',
      fr: 'Mes capteurs détectent une courbure géométrique parfaite sur cette arche. Dans la civilisation terrestre, à quoi servait ce sas fortifié ?',
      en: 'My scanners record a precise geometric arch curvature. In Earthling civilization, what was the purpose of this gate in the walled perimeter?'
    },
    answer: { es: 'Control y defensa de acceso a la población', fr: 'Contrôle et défense d’accès à la cité', en: 'Control and defense of town entry' },
    hints: {
      es: ['Evitaba que enemigos o forasteros entraran sin permiso.', 'Control de paso.'],
      fr: ['Empêchait l’intrusion d’hostiles sans accréditation.', 'Sas d’entrée.'],
      en: ['Prevented unauthorized outsiders from entering.', 'Checkpoint gate.']
    }
  },
  'zorbo-t3-mirador': {
    name: { es: 'Sensor Óptico Puerta de Cameros', fr: 'Capteur Optique Porte de Cameros', en: 'Optical Sensor Cameros Gateway' },
    question: {
      es: 'Desde este puesto de observación se domina el relieve de la comarca. ¿Cómo denominan los nativos a esta comarca montañosa al sur de Nalda?',
      fr: 'Depuis ce poste d’observation, on domine le relief régional. Quel nom les autochtones donnent-ils à ce massif au sud de Nalda ?',
      en: 'From this vantage post, the topographic sector is visible. What designation do natives give to this mountainous region south of Nalda?'
    },
    answer: { es: 'Cameros', fr: 'Cameros', en: 'Cameros' },
    hints: {
      es: ['El mismo mirador lleva su nombre.', 'Empieza por C.'],
      fr: ['Le belvédère porte ce même nom.', 'Commence par C.'],
      en: ['The viewpoint shares this name.', 'Starts with C.']
    }
  },
  'zorbo-t4-palomares': {
    name: { es: 'Matriz Biológica de Silicio', fr: 'Matrice Biologique de Silicium', en: 'Biological Silicon Matrix' },
    question: {
      es: '¡Fascinante! Cientos de hornacinas cúbicas excavadas en la pared de roca. ¿A qué bípedos con alas alberga hoy este complejo?',
      fr: 'Fascinant ! Des centaines d’alvéoles cubiques taillées dans la falaise. Quels bipèdes ailés nichent aujourd’hui dans ce complexe ?',
      en: 'Fascinating! Hundreds of cubic recesses hollowed into the rock face. Which winged bipeds inhabit this complex today?'
    },
    options: {
      es: ['Palomas bravías y torcaces', 'Murciélagos de titanio', 'Drones de reconocimiento', 'Dragones del Iregua'],
      fr: ['Pigeons bisets et ramiers', 'Chauves-souris en titane', 'Drones de reconnaissance', 'Dragons de l’Iregua'],
      en: ['Rock doves and pigeons', 'Titanium bats', 'Reconnaissance drones', 'Dragons of the Iregua']
    },
    answer: { es: 'Palomas bravías y torcaces', fr: 'Pigeons bisets et ramiers', en: 'Rock doves and pigeons' },
    hints: {
      es: ['Son aves comunes de plumas grises.', 'El propio nombre del sitio lo indica: Los Palomares.'],
      fr: ['Oiseaux à plumes grises fort répandus.', 'Le toponyme l’indique : Los Palomares.'],
      en: ['Common grey-feathered birds.', 'The site’s name says it: Los Palomares (The Dovecotes).']
    }
  },
  'zorbo-t5-ermita': {
    name: { es: 'El Transmisor de Villavieja', fr: 'Le Transmetteur de Villavieja', en: 'The Villavieja Transmitter' },
    question: {
      es: 'En las inmediaciones de esta ermita los humanos cultivan unas bayas púrpuras en espaldera para producir un combustible bebible. ¿Qué fruto es?',
      fr: 'Aux abords de cet ermitage, les humains cultivent des baies pourpres en treille pour synthétiser un carburant buvable. De quel fruit s’agit-il ?',
      en: 'In the vicinity of this shrine, humans cultivate purple berries on trellises to synthesize a consumable liquid fuel. Which fruit is it?'
    },
    options: {
      es: ['Uva de viñedo de Rioja', 'Criptonita silvestre', 'Naranjas lunares', 'Bayas de antimateria'],
      fr: ['Raisin des vignobles de La Rioja', 'Kryptonite sauvage', 'Oranges lunaires', 'Baies d’antimatière'],
      en: ['Grape of Rioja vineyards', 'Wild kryptonite', 'Lunar oranges', 'Antimatter berries']
    },
    answer: { es: 'Uva de viñedo de Rioja', fr: 'Raisin des vignobles de La Rioja', en: 'Grape of Rioja vineyards' },
    hints: {
      es: ['Se cosecha en la vendimia de otoño.', 'Da lugar al prestigioso vino riojano.'],
      fr: ['Récolté lors des vendanges d’automne.', 'Donne le célèbre vin de La Rioja.'],
      en: ['Harvested in the autumn grape harvest.', 'Produces renowned Rioja wine.']
    }
  }
};

// Populate into i18n
for (const [rId, trans] of Object.entries(naldaRiddlesTranslations)) {
  ['es', 'fr', 'en'].forEach(lang => {
    i18n.forests.nalda[lang].riddles[rId] = {
      name: trans.name[lang],
      question: trans.question[lang],
      options: trans.options ? trans.options[lang] : undefined,
      answer: trans.answer[lang],
      hints: trans.hints ? trans.hints[lang] : undefined,
    };
  });
}

fs.writeFileSync(i18nPath1, JSON.stringify(i18n, null, 2), 'utf-8');
fs.writeFileSync(i18nPath2, JSON.stringify(i18n, null, 2), 'utf-8');
console.log('Successfully updated i18n in both paths with UI keys and all Nalda riddles!');
