import fs from 'fs';
import path from 'path';

const canejanAdditions = {
  routePresets: {
    "30min": ["moulin_rouillac", "ruisseau_moulin"],
    "1h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs"],
    "1.5h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "belvedere_canejan"],
    "2h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "belvedere_canejan"],
    "guerra": {
      "30min": ["moulin_rouillac", "ruisseau_moulin"],
      "1h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs"],
      "1.5h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "belvedere_canejan"],
      "2h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "belvedere_canejan"]
    },
    "molino_perdido": {
      "30min": ["moulin_rouillac", "ruisseau_moulin"],
      "1h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs"],
      "1.5h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "belvedere_canejan"],
      "2h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "belvedere_canejan"]
    },
    "hechizo_encantado": {
      "30min": ["moulin_rouillac", "ruisseau_moulin"],
      "1h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs"],
      "1.5h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "pont_sorciere"],
      "2h": ["moulin_rouillac", "ruisseau_moulin", "chene_soupirs", "pont_sorciere", "belvedere_canejan"]
    },
    "promenade_enchantee": {
      "30min": ["ruisseau_moulin", "chene_soupirs"],
      "1h": ["ruisseau_moulin", "chene_soupirs", "pont_sorciere"],
      "1.5h": ["ruisseau_moulin", "chene_soupirs", "pont_sorciere", "moulin_rouillac"],
      "2h": ["ruisseau_moulin", "chene_soupirs", "pont_sorciere", "moulin_rouillac"]
    }
  },
  bridgePhrases: {
    "moulin_rouillac_to_ruisseau_moulin": "bridge_moulin_ruisseau",
    "ruisseau_moulin_to_chene_soupirs": "bridge_ruisseau_chene",
    "chene_soupirs_to_pont_sorciere": "bridge_chene_pont",
    "chene_soupirs_to_belvedere_canejan": "bridge_chene_belvedere",
    "pont_sorciere_to_belvedere_canejan": "bridge_pont_belvedere",
    "pont_sorciere_to_moulin_rouillac": "bridge_pont_moulin"
  },
  metaEnigma: {
    keyword: "ROBLE",
    titleKey: "meta_enigma_canejan_title",
    descriptionKey: "meta_enigma_canejan_description",
    hintKey: "meta_enigma_canejan_hint",
    successNarrativeKey: "meta_enigma_canejan_success",
    fragments: ["R", "O", "B", "L", "E"]
  }
};

const naldaAdditions = {
  routePresets: {
    "30min": ["castillo-nalda", "arco-villa"],
    "1h": ["castillo-nalda", "arco-villa", "mirador-cameros"],
    "1.5h": ["castillo-nalda", "arco-villa", "mirador-cameros", "cuevas-palomares"],
    "1h30": ["castillo-nalda", "arco-villa", "mirador-cameros", "cuevas-palomares"],
    "2h": ["castillo-nalda", "arco-villa", "mirador-cameros", "cuevas-palomares", "ermita-villavieja"]
  },
  bridgePhrases: {
    "castillo-nalda_to_arco-villa": "bridge_nalda_castillo_arco",
    "arco-villa_to_mirador-cameros": "bridge_nalda_arco_mirador",
    "mirador-cameros_to_cuevas-palomares": "bridge_nalda_mirador_cuevas",
    "cuevas-palomares_to_ermita-villavieja": "bridge_nalda_cuevas_ermita"
  },
  metaEnigma: {
    keyword: "NALDA",
    titleKey: "meta_enigma_title",
    descriptionKey: "meta_enigma_description",
    fragments: ["N", "A", "L", "D", "A"]
  }
};

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const forests = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const canejan = forests.find(f => f.id === 'bosque-canejan-cestas');
  if (canejan) {
    canejan.routePresets = canejanAdditions.routePresets;
    canejan.bridgePhrases = canejanAdditions.bridgePhrases;
    canejan.metaEnigma = canejanAdditions.metaEnigma;
  }

  const nalda = forests.find(f => f.id === 'nalda');
  if (nalda) {
    nalda.routePresets = naldaAdditions.routePresets;
    nalda.bridgePhrases = naldaAdditions.bridgePhrases;
    nalda.metaEnigma = {
      ...(nalda.metaEnigma || {}),
      ...naldaAdditions.metaEnigma
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(forests, null, 2), 'utf-8');
  console.log('Synchronized forest packs in:', filePath);
}

updateFile(path.resolve('data/forests.json'));
updateFile(path.resolve('forest-packs-seed.json'));
updateFile(path.resolve('data/forest-packs-seed.json'));
console.log('All forest packs fully updated with user JSON.');
