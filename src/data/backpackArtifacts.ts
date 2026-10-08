import { BackpackItem, WindmillPOI } from '../types';

/**
 * Starter explorer kit given to every player embarking on an expedition
 */
export const STARTER_BACKPACK_ITEMS: BackpackItem[] = [
  {
    id: 'starter_magnifier',
    name: 'Lupa Botánica de Latón',
    category: 'tool',
    iconEmoji: '🔍',
    shortDesc: 'Lente de aumento con montura de latón grabada.',
    lore: 'Perteneció a un botánico de la comarca. Permite examinar reliquias minúsculas, vetas de madera e inscripciones talladas casi invisibles a simple vista.',
    canInspect: true,
    inspectClue: 'Al mirar de cerca la montura, descubres números grabados en la juntura: «1844 - VERITAS IN SILVA».',
    canCombineWith: 'canejan_relic_cylinder',
    combinesIntoName: 'Lente de Criptógrafo Desplegada',
  },
  {
    id: 'starter_notebook',
    name: 'Cuaderno de Cuero del Cartógrafo',
    category: 'document',
    iconEmoji: '📜',
    shortDesc: 'Páginas de pergamino vegetal para frotar relieves y trazar rumbos.',
    lore: 'Encuadernado con piel de ciervo y cosido con hilo encerado. Contiene notas preliminares sobre los vientos locales y la orientación de los musgos en los troncos.',
    canInspect: true,
    inspectClue: 'En la guarda interior hay un boceto de una rosa de los vientos con una advertencia: «El norte magnético en el bosque susurra diferente bajo la niebla».',
  },
  {
    id: 'starter_flint',
    name: 'Pedernal & Yesca de Helecho',
    category: 'tool',
    iconEmoji: '🕯️',
    shortDesc: 'Piedra de sílex oscuro y yesca seca para iluminar cavidades.',
    lore: 'Herramienta de supervivencia indispensable. Produce chispas vivas que pueden prender antorchas improvisadas o revelar el brillo de minerales en rocas umbrías.',
    canInspect: true,
    inspectClue: 'El pedernal tiene una hendidura pulida por el pulgar de generaciones de caminantes. Huele a humo y resina vieja.',
  },
];

/**
 * POI specific relics unlocked upon reaching or solving a milestone
 */
export const POI_RELICS_MAP: Record<string, Omit<BackpackItem, 'acquiredAt'>> = {
  // --- Bosque de Canéjan-Cestas ---
  'moulin_rouillac': {
    id: 'canejan_relic_gear',
    name: 'Engranaje de Bronce de Rouillac',
    category: 'relic',
    iconEmoji: '⚙️',
    shortDesc: 'Diente de engranaje forjado en 1840 de las muelas del molino.',
    lore: 'Recogido cerca del caz del Eau Bourde. Lleva la marca del herrero de Canéjan y aún huele a harina tostada por la fricción de la piedra centenaria.',
    canInspect: true,
    inspectClue: 'En la cara posterior del diente hay una muesca en forma de tridente: el símbolo secreto que usaban los enlaces del maquis bordelés.',
    canCombineWith: 'starter_flint',
    combinesIntoName: 'Chispero Mecánico de Resistencia',
  },
  'ruisseau_moulin': {
    id: 'canejan_relic_cylinder',
    name: 'Cilindro Estanco de la Resistencia',
    category: 'document',
    iconEmoji: '🧪',
    shortDesc: 'Tubo de latón sellado con cera roja hallado en el arroyo.',
    lore: 'Utilizado por los partisanos de 1944 para sumergir mensajes en el cauce sin que la humedad los dañara. Permanece herméticamente sellado.',
    canInspect: true,
    inspectClue: 'La cera del lacre tiene grabado un cuervo. Al raspar con cuidado la boquilla, puedes atisbar un rollo de papel milimetrado en su interior.',
    canCombineWith: 'starter_magnifier',
    combinesIntoName: 'Despacho Cifrado del Maquis',
  },
  'chene_soupirs': {
    id: 'canejan_relic_acorn',
    name: 'Bellota de Cobre Votiva',
    category: 'curio',
    iconEmoji: '🌰',
    shortDesc: 'Ofrenda metálica hallada en un hueco del gran roble.',
    lore: 'Una antigua costumbre de los leñadores de Gironda: depositar una bellota fundida en cobre para pedir protección antes de adentrarse en la espesura.',
    canInspect: true,
    inspectClue: 'Al agitarla, se percibe algo suelto en su interior: una semilla diminuta envuelta en hilo de plata.',
  },
  'pont_sorciere': {
    id: 'canejan_relic_crystal',
    name: 'Prisma de Cuarzo del Eau Bourde',
    category: 'relic',
    iconEmoji: '🔮',
    shortDesc: 'Cristal de roca tallado por la corriente fluvial durante siglos.',
    lore: 'Dicen los cuentos de Divercités que refracta la luz del atardecer revelando reflejos dorados sobre el agua del recodo del puente.',
    canInspect: true,
    inspectClue: 'Al mirar al sol a través de sus facetas, los reflejos proyectan una figura que recuerda a las alas de un duende.',
  },
  'cabane_forestier': {
    id: 'canejan_relic_key',
    name: 'Llave Esquelética del Resinero',
    category: 'tool',
    iconEmoji: '🗝️',
    shortDesc: 'Llave forjada a mano para los viejos cajones de resina.',
    lore: 'Hallada junto a las vigas de pino de la cabaña. Su paletón de tres muescas abre los candados tradicionales de las haciendas forestales.',
    canInspect: true,
    inspectClue: 'Tiene un hilo rojo atado al aro: contraseña visual que indicaba que el refugio era seguro.',
  },
  'belvedere_canejan': {
    id: 'canejan_relic_monocular',
    name: 'Catalejo de Campaña Biselado',
    category: 'tool',
    iconEmoji: '🔭',
    shortDesc: 'Óptica de latón extensible con graduación en yardas.',
    lore: 'Utilizado para vigilar los caminos de aproximación al valle desde la atalaya del mirador. Su lente conserva nitidez cristalina.',
    canInspect: true,
    inspectClue: 'El anillo de enfoque tiene un pequeño tope metálico fijado en la distancia exacta hacia el campanario de Cestas.',
  },

  // --- Bosque de Nalda (La Rioja) ---
  'castillo-nalda': {
    id: 'nalda_relic_seal',
    name: 'Sello Señorial de los Cameros',
    category: 'relic',
    iconEmoji: '🛡️',
    shortDesc: 'Medallón de plomo con el blasón tallado de los señores de Nalda.',
    lore: 'Recuperado entre los sillares del aljibe del castillo. Muestra el león rampante y las barras heráldicas de la nobleza camerana del siglo XIV.',
    canInspect: true,
    inspectClue: 'En el borde circular hay grabado en letras góticas: «NIHIL TIMENDUM IN ALTO» (Nada se teme en las alturas).',
  },
  'arco-villa': {
    id: 'nalda_relic_coin',
    name: 'Maravedí de Fray Botijo',
    category: 'curio',
    iconEmoji: '🪙',
    shortDesc: 'Moneda de cobre desgastada de 1610 con orificio central.',
    lore: 'El fraile la llevaba cosida al cordón del hábito como amuleto contra los salteadores del Camino Real hacia Soria.',
    canInspect: true,
    inspectClue: 'El reverso tiene una cruz patada grabada a punta de navaja: signo de devoción del peregrino.',
  },
  'mirador-cameros': {
    id: 'nalda_relic_feather',
    name: 'Pluma de Halcón de las Peñas',
    category: 'curio',
    iconEmoji: '🦅',
    shortDesc: 'Pluma remera encontrada en la cornisa de los buitres y halcones.',
    lore: 'Utilizada antaño para caligrafiar las cédulas de paso entre el Valle del Iregua y la Sierra de Cameros.',
    canInspect: true,
    inspectClue: 'El cálamo está cortado en ángulo con extrema precisión: lista para ser tintada y escribir.',
  },
  'cuevas-palomares': {
    id: 'nalda_relic_tile',
    name: 'Fragmento de Cerámica Eremítica',
    category: 'relic',
    iconEmoji: '🏺',
    shortDesc: 'Tesela de barro cocido con incisiones rúnicas y solares.',
    lore: 'Hallada en uno de los nichos excavados en la roca caliza. Evidencia de los antiguos anacoretas que habitaban el cantil en soledad.',
    canInspect: true,
    inspectClue: 'Uniendo las líneas de incisión se forma una espiral dextrógira, símbolo universal del ciclo del agua y las estaciones.',
  },
  'ermita-villavieja': {
    id: 'nalda_relic_bell',
    name: 'Campanilla de Bronce de San Antón',
    category: 'relic',
    iconEmoji: '🔔',
    shortDesc: 'Campanilla de mano que bendecía a los rebaños de ovejas merinas.',
    lore: 'Su tintineo agudo se escuchaba a leguas a través de la cañada real durante la trashumancia riojana.',
    canInspect: true,
    inspectClue: 'El badajo es una pieza de hierro forjado con forma de bellota. Al sonar, produce una vibración pura de tono La sostenido.',
  },
};

/**
 * Recipes for combining 2 backpack items into a new enhanced relic
 */
export const CRAFTING_RECIPES: {
  itemA: string;
  itemB: string;
  result: BackpackItem;
}[] = [
  {
    itemA: 'starter_magnifier',
    itemB: 'canejan_relic_cylinder',
    result: {
      id: 'crafted_resistance_dossier',
      name: 'Despacho Cifrado del Maquis (Desclasificado)',
      category: 'document',
      iconEmoji: '📜',
      shortDesc: 'Plano cartográfico secreto y claves de paso de 1944 leídas con la lupa.',
      lore: '¡Combinación exitosa! Con la lente de latón has desenrollado el pergamino hermético: contiene las coordenadas de escape y una felicitación formal firmada por la Resistencia.',
      canInspect: true,
      inspectClue: 'Las coordenadas señalan el molino de Rouillac como refugio primordial: «Puntos de encuentro activos hasta el amanecer».',
      isInspected: true,
    },
  },
  {
    itemA: 'starter_flint',
    itemB: 'canejan_relic_gear',
    result: {
      id: 'crafted_spark_tool',
      name: 'Chispero Mecánico de Rouillac',
      category: 'tool',
      iconEmoji: '⚡',
      shortDesc: 'Herramienta de fricción que combina bronce y pedernal.',
      lore: 'El diente de engranaje metálico raspa el pedernal con gran eficacia, produciendo chispas continuas y seguras para orientarse en la penumbra.',
      canInspect: true,
      inspectClue: 'El destello ilumina símbolos fosforescentes en la madera y piedras cercanas.',
      isInspected: true,
    },
  },
  {
    itemA: 'starter_notebook',
    itemB: 'nalda_relic_tile',
    result: {
      id: 'crafted_eremite_rubbing',
      name: 'Calco en Carbón de las Cuevas Palomares',
      category: 'document',
      iconEmoji: '🗺️',
      shortDesc: 'Impresión frotada a lápiz de carbón de las runas eremíticas.',
      lore: 'Al frotar el papel del cuaderno contra la cerámica, el relieve de la espiral rúnica ha quedado calcado con absoluta fidelidad.',
      canInspect: true,
      inspectClue: 'El patrón coincide exactamente con la alineación de las peñas que rodean Nalda.',
      isInspected: true,
    },
  },
];

/**
 * Returns the relic for a POI or a themed fallback if custom
 */
export function getRelicForPoi(poi: WindmillPOI, forestName: string): BackpackItem {
  if (POI_RELICS_MAP[poi.id]) {
    const base = POI_RELICS_MAP[poi.id];
    return {
      ...base,
      foundAtPoiId: poi.id,
      foundAtPoiName: poi.name,
      acquiredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // Fallback procedural relic for custom or unexpected POIs
  return {
    id: `relic_${poi.id}_${Date.now()}`,
    name: `Reliquia de ${poi.name}`,
    category: 'relic',
    iconEmoji: poi.emoji || '🏺',
    shortDesc: `Vestigio patrimonial hallado en ${poi.name}.`,
    lore: `Descubierto durante la exploración de ${forestName}. Guarda memoria del pasado natural y las tradiciones locales del enclave.`,
    foundAtPoiId: poi.id,
    foundAtPoiName: poi.name,
    acquiredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    canInspect: true,
    inspectClue: `Inscripción descubierta: «Recuerdo del paso por ${poi.name}».`,
  };
}
