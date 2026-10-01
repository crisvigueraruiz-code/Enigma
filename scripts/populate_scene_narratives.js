import fs from 'fs';
import path from 'path';

const canejanSceneNarratives = {
  // Guerra
  "guerra_moulin_rouillac": "Las viejas muelas del molino guardan el eco de las reuniones clandestinas de 1944. Busca las señales del maquis.",
  "guerra_ruisseau_moulin": "El rumor del agua amortigua tus pasos. En este arroyo la Resistencia sumergió mensajes en cilindros estancos.",
  "guerra_chene_soupirs": "Bajo las ramas protectoras del roble centenario, los enlaces dejaban contraseñas talladas en la corteza.",
  "guerra_pont_sorciere": "El puente de piedra domina el paso sobre el recodo fluvial. Vigila los caminos antes de cruzar.",
  "guerra_cabane_forestier": "Un refugio de resineros apartado del sendero principal. Aquí descansaban los maquis perseguidos.",
  "guerra_belvedere_canejan": "Desde esta atalaya natural se divisa todo el valle del Eau Bourde hasta los accesos a Burdeos.",

  // Molino Perdido
  "molino_perdido_moulin_rouillac": "Maître Pierre te da la bienvenida al corazón del molino. Escucha el crujido de los engranajes centenarios.",
  "molino_perdido_ruisseau_moulin": "El agua límpida corre hacia el caz. Maître Pierre calculó aquí el caudal necesario para mover la gran rueda.",
  "molino_perdido_chene_soupirs": "El roble proporcionó la madera más noble y resistente para tallar los dientes de los engranajes.",
  "molino_perdido_pont_sorciere": "La cantería del puente revela la pericia de los antiguos constructores de las acequias de Canéjan.",
  "molino_perdido_cabane_forestier": "En la cabaña se guardaban las herramientas de carpintería y las plantillas de las palas del molino.",
  "molino_perdido_belvedere_canejan": "Desde la altura del mirador se comprende la pendiente natural que otorga fuerza motriz a todo el río.",

  // Hechizo Encantado
  "hechizo_encantado_moulin_rouillac": "El agua del molino susurra un lamento apagado por la niebla. Sylvaine te guía para devolverle su melodía.",
  "hechizo_encantado_ruisseau_moulin": "Las piedras cubiertas de musgo centellean con gotas de rocío mágico. El maleficio comienza a disiparse.",
  "hechizo_encantado_chene_soupirs": "El espíritu del bosque pulsa en el corazón del gran roble. Sus hojas susurran los secretos de la arboleda.",
  "hechizo_encantado_pont_sorciere": "Bajo las dovelas del puente, las brumas danzan al compás de viejos encantamientos de agua dulce.",
  "hechizo_encantado_cabane_forestier": "Un círculo de helechos y resina protege la cabaña de los maleficios que vagan con el viento del atardecer.",
  "hechizo_encantado_belvedere_canejan": "El viento de la cumbre limpia las últimas sombras de niebla revelando el esplendor esmeralda del valle.",

  // Promenade Enchantée
  "promenade_enchantee_moulin_rouillac": "¡El duendecillo del molino se esconde tras las muelas! Busca las huellas diminutas sobre la harina.",
  "promenade_enchantee_ruisseau_moulin": "Los renacuajos y las ranitas cantan las rimas que los niños de Canéjan inventaron junto al agua.",
  "promenade_enchantee_chene_soupirs": "¡Mira cuántos gorritos de duende han caído de las ramas! El viejo roble sonríe con los juegos infantiles.",
  "promenade_enchantee_pont_sorciere": "Las esculturas de madera de Divercités cobran vida bajo el puente con historias de brujitas buenas.",
  "promenade_enchantee_cabane_forestier": "La cabaña huele a piñas secas y resina dulce. Un lugar perfecto para merendar y contar cuentos.",
  "promenade_enchantee_belvedere_canejan": "¡Desde aquí arriba los árboles parecen un mar de brócolis gigantes! A ver quién descubre primero el río."
};

const naldaFrayBotijoNarratives = {
  "fraile-botijo_castillo-nalda": "¡Ehhhh, compi! ¡Aquí me encerraron con los pellejos de vino vacíos! Menuda resaca medieval me pillé.",
  "fraile-botijo_arco-villa": "Bajo este arco casi pierdo el botijo persiguiendo a una moza... ¡digo, persiguiendo a un penitente!",
  "fraile-botijo_mirador-cameros": "¡Qué vistas, pardiez! Desde aquí veo si el señor abad viene a buscarme con el báculo levantado.",
  "fraile-botijo_cuevas-palomares": "Un eremitorio fresco para echarse una siestecita sin que te molesten los rezos del convento.",
  "fraile-botijo_ermita-villavieja": "¡La meta santa! Y lo mejor: rodeada de las benditas cepas del vino de Cameros. ¡Salud y bendición!"
};

const files = [
  path.resolve('data/forests.json'),
  path.resolve('forest-packs-seed.json'),
  path.resolve('data/forest-packs-seed.json')
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  const forests = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const canejan = forests.find(f => f.id === 'bosque-canejan-cestas');
  if (canejan) {
    canejan.sceneNarratives = {
      ...canejanSceneNarratives,
      ...(canejan.sceneNarratives || {})
    };
  }

  const nalda = forests.find(f => f.id === 'nalda');
  if (nalda) {
    nalda.sceneNarratives = {
      ...(nalda.sceneNarratives || {}),
      ...naldaFrayBotijoNarratives
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(forests, null, 2), 'utf-8');
  console.log('Updated sceneNarratives in:', filePath);
}

console.log('Successfully populated sceneNarratives!');
