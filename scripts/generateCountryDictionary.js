const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '../lib/data/unhcrCountriesRaw.json');
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const countryMap = {};
const aliasMap = {};

// Words that collide with common English stop words or verbs
const STOP_WORD_ALIASES = new Set([
  'are', // United Arab Emirates ISO3
  'and', // Andorra
  'for',
  'the',
  'in',
  'to',
  'of',
  'is',
  'at',
  'by',
  'on'
]);

raw.forEach(c => {
  if (!c.iso) return;
  const iso = c.iso.toUpperCase();
  const name = c.name?.trim();
  countryMap[iso] = {
    iso,
    name,
    code: c.code,
    region: c.region,
    majorArea: c.majorArea,
    nationality: c.nationality
  };

  const addAlias = (alias) => {
    if (!alias) return;
    const clean = alias.toLowerCase().trim();
    if (clean.length > 1 && !STOP_WORD_ALIASES.has(clean)) {
      aliasMap[clean] = iso;
    }
  };

  addAlias(c.name);
  addAlias(c.nameOrigin);
  addAlias(c.nameLong);
  addAlias(c.nameShort);
  addAlias(c.nameFormal);
  addAlias(c.nationality);
  if (!STOP_WORD_ALIASES.has(c.iso.toLowerCase())) {
    addAlias(c.iso);
  }
  if (!STOP_WORD_ALIASES.has(c.code.toLowerCase())) {
    addAlias(c.code);
  }
});

const extras = {
  'afghan': 'AFG', 'afghans': 'AFG', 'afghanistan': 'AFG',
  'syrian': 'SYR', 'syrians': 'SYR', 'syria': 'SYR',
  'ukrainian': 'UKR', 'ukrainians': 'UKR', 'ukraine': 'UKR',
  'sudanese': 'SDN', 'sudan': 'SDN', 'south sudan': 'SSD', 'south sudanese': 'SSD',
  'venezuelan': 'VEN', 'venezuelans': 'VEN', 'venezuela': 'VEN',
  'rohingya': 'MMR', 'burma': 'MMR', 'burmese': 'MMR', 'myanmar': 'MMR',
  'sri lanka': 'LKA', 'sri lankan': 'LKA', 'sri lankans': 'LKA', 'ceylon': 'LKA',
  'india': 'IND', 'indian': 'IND', 'indians': 'IND',
  'pakistan': 'PAK', 'pakistani': 'PAK', 'pakistanis': 'PAK',
  'germany': 'DEU', 'german': 'DEU', 'germans': 'DEU',
  'france': 'FRA', 'french': 'FRA',
  'united states': 'USA', 'us': 'USA', 'usa': 'USA', 'american': 'USA', 'americans': 'USA',
  'united kingdom': 'GBR', 'uk': 'GBR', 'britain': 'GBR', 'british': 'GBR',
  'congo': 'COD', 'drc': 'COD', 'dr congo': 'COD', 'democratic republic of the congo': 'COD',
  'republic of the congo': 'COG', 'congo brazzaville': 'COG',
  'somalia': 'SOM', 'somali': 'SOM', 'somalis': 'SOM',
  'palestine': 'PSE', 'palestinian': 'PSE', 'palestinians': 'PSE', 'gaza': 'PSE', 'west bank': 'PSE',
  'yemen': 'YEM', 'yemeni': 'YEM', 'yemenis': 'YEM',
  'turkey': 'TUR', 'turkiye': 'TUR', 'turkish': 'TUR',
  'lebanon': 'LBN', 'lebanese': 'LBN',
  'jordan': 'JOR', 'jordanian': 'JOR', 'jordanians': 'JOR',
  'poland': 'POL', 'polish': 'POL',
  'russia': 'RUS', 'russian': 'RUS', 'russians': 'RUS',
  'bangladesh': 'BGD', 'bangladeshi': 'BGD', 'bangladeshis': 'BGD',
  'ethiopia': 'ETH', 'ethiopian': 'ETH', 'ethiopians': 'ETH',
  'eritrea': 'ERI', 'eritrean': 'ERI', 'eritreans': 'ERI',
  'iran': 'IRN', 'iranian': 'IRN', 'iranians': 'IRN',
  'iraq': 'IRQ', 'iraqi': 'IRQ', 'iraqis': 'IRQ',
  'uganda': 'UGA', 'ugandan': 'UGA',
  'kenya': 'KEN', 'kenyan': 'KEN',
  'chad': 'TCD', 'chadian': 'TCD',
  'colombia': 'COL', 'colombian': 'COL',
  'canada': 'CAN', 'canadian': 'CAN',
  'mexico': 'MEX', 'mexican': 'MEX'
};

Object.entries(extras).forEach(([k, v]) => {
  aliasMap[k.toLowerCase()] = v;
});

const tsContent = `// Auto-generated comprehensive country & alias dictionary for Displacement Explorer
export interface CountryMeta {
  iso: string;
  name: string;
  code: string;
  region?: string;
  majorArea?: string;
  nationality?: string;
}

export const COUNTRIES_BY_ISO: Record<string, CountryMeta> = ${JSON.stringify(countryMap, null, 2)};

export const COUNTRY_ALIASES: Record<string, string> = ${JSON.stringify(aliasMap, null, 2)};

export function resolveCountry(input: string): CountryMeta | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();
  const iso = COUNTRY_ALIASES[clean] || (clean.length === 3 ? clean.toUpperCase() : null);
  if (iso && COUNTRIES_BY_ISO[iso]) {
    return COUNTRIES_BY_ISO[iso];
  }
  return null;
}
`;

const outPath = path.join(__dirname, '../lib/search/countryDictionary.ts');
fs.writeFileSync(outPath, tsContent);
console.log('Successfully wrote countryDictionary.ts, ISOs:', Object.keys(countryMap).length, 'Aliases:', Object.keys(aliasMap).length);
