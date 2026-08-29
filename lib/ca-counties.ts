import type { Region } from './types'

// Full FIPS -> county name map for all 58 California counties (state FIPS 06).
export const CA_COUNTY_FIPS: Record<string, string> = {
  '06001': 'Alameda',
  '06003': 'Alpine',
  '06005': 'Amador',
  '06007': 'Butte',
  '06009': 'Calaveras',
  '06011': 'Colusa',
  '06013': 'Contra Costa',
  '06015': 'Del Norte',
  '06017': 'El Dorado',
  '06019': 'Fresno',
  '06021': 'Glenn',
  '06023': 'Humboldt',
  '06025': 'Imperial',
  '06027': 'Inyo',
  '06029': 'Kern',
  '06031': 'Kings',
  '06033': 'Lake',
  '06035': 'Lassen',
  '06037': 'Los Angeles',
  '06039': 'Madera',
  '06041': 'Marin',
  '06043': 'Mariposa',
  '06045': 'Mendocino',
  '06047': 'Merced',
  '06049': 'Modoc',
  '06051': 'Mono',
  '06053': 'Monterey',
  '06055': 'Napa',
  '06057': 'Nevada',
  '06059': 'Orange',
  '06061': 'Placer',
  '06063': 'Plumas',
  '06065': 'Riverside',
  '06067': 'Sacramento',
  '06069': 'San Benito',
  '06071': 'San Bernardino',
  '06073': 'San Diego',
  '06075': 'San Francisco',
  '06077': 'San Joaquin',
  '06079': 'San Luis Obispo',
  '06081': 'San Mateo',
  '06083': 'Santa Barbara',
  '06085': 'Santa Clara',
  '06087': 'Santa Cruz',
  '06089': 'Shasta',
  '06091': 'Sierra',
  '06093': 'Siskiyou',
  '06095': 'Solano',
  '06097': 'Sonoma',
  '06099': 'Stanislaus',
  '06101': 'Sutter',
  '06103': 'Tehama',
  '06105': 'Trinity',
  '06107': 'Tulare',
  '06109': 'Tuolumne',
  '06111': 'Ventura',
  '06113': 'Yolo',
  '06115': 'Yuba',
}

// Every county assigned to exactly one of the five pipeline regions so the
// choropleth has full statewide coverage (no unmapped counties).
const COUNTY_TO_REGION: Record<string, Region> = {
  // Bay Area
  Alameda: 'bay-area',
  'Contra Costa': 'bay-area',
  Marin: 'bay-area',
  Napa: 'bay-area',
  'San Francisco': 'bay-area',
  'San Mateo': 'bay-area',
  'Santa Clara': 'bay-area',
  Solano: 'bay-area',
  Sonoma: 'bay-area',
  'Santa Cruz': 'bay-area',
  'San Benito': 'bay-area',
  Monterey: 'bay-area',

  // Central Valley
  'San Joaquin': 'central-valley',
  Fresno: 'central-valley',
  Kern: 'central-valley',
  Stanislaus: 'central-valley',
  Merced: 'central-valley',
  Sacramento: 'central-valley',
  Yolo: 'central-valley',
  Sutter: 'central-valley',
  Yuba: 'central-valley',
  Placer: 'central-valley',
  'El Dorado': 'central-valley',
  Nevada: 'central-valley',
  Sierra: 'central-valley',
  Colusa: 'central-valley',
  Glenn: 'central-valley',
  Butte: 'central-valley',
  Tehama: 'central-valley',
  Kings: 'central-valley',
  Madera: 'central-valley',
  Tulare: 'central-valley',
  Amador: 'central-valley',
  Calaveras: 'central-valley',
  Tuolumne: 'central-valley',
  Mariposa: 'central-valley',
  Alpine: 'central-valley',
  Mono: 'central-valley',

  // Los Angeles (Southern California)
  'Los Angeles': 'los-angeles',
  Ventura: 'los-angeles',
  Orange: 'los-angeles',
  'San Luis Obispo': 'los-angeles',
  'Santa Barbara': 'los-angeles',
  Inyo: 'los-angeles',

  // Rural North
  Humboldt: 'rural-north',
  Shasta: 'rural-north',
  'Del Norte': 'rural-north',
  Trinity: 'rural-north',
  Siskiyou: 'rural-north',
  Lake: 'rural-north',
  Lassen: 'rural-north',
  Mendocino: 'rural-north',
  Modoc: 'rural-north',
  Plumas: 'rural-north',

  // Inland Empire / Imperial
  Riverside: 'inland-empire',
  'San Bernardino': 'inland-empire',
  Imperial: 'inland-empire',
  'San Diego': 'inland-empire',
}

export function regionForCountyFips(fips: string): Region | null {
  const name = CA_COUNTY_FIPS[fips]
  if (!name) return null
  return COUNTY_TO_REGION[name] ?? null
}

export function regionForCountyName(name: string): Region | null {
  return COUNTY_TO_REGION[name] ?? null
}
