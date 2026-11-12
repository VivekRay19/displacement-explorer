import { resolveCountry, COUNTRY_ALIASES, COUNTRIES_BY_ISO } from './countryDictionary';
import type { CountryMeta } from './countryDictionary';

export type PopulationCategory =
  | 'refugees'
  | 'asylum_seekers'
  | 'idps'
  | 'stateless'
  | 'returned_refugees'
  | 'returned_idps'
  | 'all';

export type TargetDataset =
  | 'PopStatsOfficial'
  | 'AsylumApplications'
  | 'AsylumDecisions'
  | 'Demographics'
  | 'Solutions';

export interface ParsedQuery {
  rawQuery: string;
  originCountry: CountryMeta | null;
  asylumCountry: CountryMeta | null;
  populationCategory: PopulationCategory;
  targetDataset: TargetDataset;
  yearRange: {
    startYear?: number;
    endYear?: number;
    exactYear?: number;
  };
  isAmbiguousDirection: boolean;
  confidence: number;
  explanation: string;
}

// Category keywords mapping
const CATEGORY_MAP: Record<string, PopulationCategory> = {
  refugee: 'refugees',
  refugees: 'refugees',
  asylum: 'asylum_seekers',
  'asylum-seeker': 'asylum_seekers',
  'asylum-seekers': 'asylum_seekers',
  'asylum seeker': 'asylum_seekers',
  'asylum seekers': 'asylum_seekers',
  idp: 'idps',
  idps: 'idps',
  'internally displaced': 'idps',
  'internal displacement': 'idps',
  stateless: 'stateless',
  statelessness: 'stateless',
  returnee: 'returned_refugees',
  returnees: 'returned_refugees',
  'returned refugees': 'returned_refugees',
  'returned idps': 'returned_idps'
};

/**
 * Extracts a year or year range from a query string.
 * Supports patterns like:
 * - "in 2020", "for 2022", "2024"
 * - "from 2015 to 2024", "between 2010 and 2020", "2015 - 2024", "2015-2024"
 * - "since 2018", "after 2015"
 */
export function extractYearRange(query: string): {
  startYear?: number;
  endYear?: number;
  exactYear?: number;
  cleanedText: string;
} {
  let text = query;
  let startYear: number | undefined;
  let endYear: number | undefined;
  let exactYear: number | undefined;

  // Between YYYY and YYYY or from YYYY to YYYY
  const rangeMatch = text.match(/\b(?:between|from)\s+(19\d\d|20\d\d)\s+(?:and|to)\s+(19\d\d|20\d\d)\b/i);
  if (rangeMatch) {
    startYear = parseInt(rangeMatch[1], 10);
    endYear = parseInt(rangeMatch[2], 10);
    text = text.replace(rangeMatch[0], ' ');
    return { startYear, endYear, cleanedText: text.trim() };
  }

  // YYYY-YYYY or YYYY - YYYY
  const hyphenRange = text.match(/\b(19\d\d|20\d\d)\s*[-–—]\s*(19\d\d|20\d\d)\b/);
  if (hyphenRange) {
    startYear = parseInt(hyphenRange[1], 10);
    endYear = parseInt(hyphenRange[2], 10);
    text = text.replace(hyphenRange[0], ' ');
    return { startYear, endYear, cleanedText: text.trim() };
  }

  // since YYYY or after YYYY
  const sinceMatch = text.match(/\b(?:since|after|from)\s+(19\d\d|20\d\d)\b/i);
  if (sinceMatch) {
    startYear = parseInt(sinceMatch[1], 10);
    endYear = 2024;
    text = text.replace(sinceMatch[0], ' ');
    return { startYear, endYear, cleanedText: text.trim() };
  }

  // in YYYY or single YYYY
  const singleYear = text.match(/\b(?:in|for|year)?\s*(19\d\d|20\d\d)\b/i);
  if (singleYear) {
    exactYear = parseInt(singleYear[1], 10);
    text = text.replace(singleYear[0], ' ');
    return { exactYear, cleanedText: text.trim() };
  }

  return { cleanedText: text };
}

/**
 * Parses query text to extract intent, dataset, countries, and directional relationship.
 */
export function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      rawQuery: '',
      originCountry: null,
      asylumCountry: null,
      populationCategory: 'refugees',
      targetDataset: 'PopStatsOfficial',
      yearRange: {},
      isAmbiguousDirection: false,
      confidence: 0,
      explanation: 'Empty query'
    };
  }

  // 1. Extract years
  const { startYear, endYear, exactYear, cleanedText } = extractYearRange(trimmed);

  // 2. Identify Target Dataset
  let targetDataset: TargetDataset = 'PopStatsOfficial';
  const lower = cleanedText.toLowerCase();

  if (lower.includes('asylum application') || lower.includes('asylum claim') || lower.includes('applied for asylum') || lower.includes('asylum applications')) {
    targetDataset = 'AsylumApplications';
  } else if (lower.includes('asylum decision') || lower.includes('recognition rate') || lower.includes('rejected asylum') || lower.includes('decisions')) {
    targetDataset = 'AsylumDecisions';
  } else if (lower.includes('demographic') || lower.includes('age') || lower.includes('gender') || lower.includes('women') || lower.includes('children')) {
    targetDataset = 'Demographics';
  } else if (lower.includes('resettlement') || lower.includes('repatriation') || lower.includes('durable solutions') || lower.includes('returnee')) {
    targetDataset = 'Solutions';
  }

  // 3. Identify Population Category
  let populationCategory: PopulationCategory = 'refugees';
  if (targetDataset === 'AsylumApplications') {
    populationCategory = 'asylum_seekers';
  } else {
    for (const [key, category] of Object.entries(CATEGORY_MAP)) {
      if (new RegExp(`\\b${key}\\b`, 'i').test(lower)) {
        populationCategory = category;
        break;
      }
    }
  }

  // 4. Extract Countries & Detect Direction
  // Normalizing punctuation while keeping word order
  const normalized = lower.replace(/[?,.!]/g, ' ').replace(/\s+/g, ' ');

  // A) Match directional patterns explicitly:
  // "from [Origin] in [Asylum]" / "from [Origin] to [Asylum]"
  const fromInMatch = normalized.match(/(?:refugees\s+|displacement\s+)?from\s+([a-z\s]+?)\s+(?:in|into|to|living in|hosted by)\s+([a-z\s]+)/i);
  if (fromInMatch) {
    const origin = resolveCountry(fromInMatch[1]);
    const asylum = resolveCountry(fromInMatch[2]);
    if (origin && asylum) {
      return {
        rawQuery: trimmed,
        originCountry: origin,
        asylumCountry: asylum,
        populationCategory,
        targetDataset,
        yearRange: { startYear, endYear, exactYear },
        isAmbiguousDirection: false,
        confidence: 0.95,
        explanation: `People originating in ${origin.name} seeking safety / living in ${asylum.name}`
      };
    }
  }

  // "[Asylum] hosting (refugees from) [Origin]" or "refugees in [Asylum] from [Origin]"
  const inFromMatch = normalized.match(/(?:refugees\s+|people\s+)?in\s+([a-z\s]+?)\s+from\s+([a-z\s]+)/i);
  if (inFromMatch) {
    const asylum = resolveCountry(inFromMatch[1]);
    const origin = resolveCountry(inFromMatch[2]);
    if (asylum && origin) {
      return {
        rawQuery: trimmed,
        originCountry: origin,
        asylumCountry: asylum,
        populationCategory,
        targetDataset,
        yearRange: { startYear, endYear, exactYear },
        isAmbiguousDirection: false,
        confidence: 0.95,
        explanation: `Refugees in ${asylum.name} originating from ${origin.name}`
      };
    }
  }

  // "[Origin] to [Asylum]" (e.g. "India to Pakistan", "Ukraine to Poland")
  const toMatch = normalized.match(/([a-z\s]+?)\s+to\s+([a-z\s]+)/i);
  if (toMatch) {
    const origin = resolveCountry(toMatch[1]);
    const asylum = resolveCountry(toMatch[2]);
    if (origin && asylum) {
      return {
        rawQuery: trimmed,
        originCountry: origin,
        asylumCountry: asylum,
        populationCategory,
        targetDataset,
        yearRange: { startYear, endYear, exactYear },
        isAmbiguousDirection: false,
        confidence: 0.92,
        explanation: `Displacement corridor from ${origin.name} to ${asylum.name}`
      };
    }
  }

  // B) Generic Country Detection by Scanning Tokens
  // Scan all known country aliases in length-descending order to avoid partial matches
  const recognizedCountries: { meta: CountryMeta; index: number; text: string }[] = [];
  const words = normalized.split(/\s+/);

  // Check multi-word (up to 4 words) and single-word sequences
  for (let len = 4; len >= 1; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(' ');
      const country = resolveCountry(phrase);
      if (country) {
        // Ensure not already matched
        const overlaps = recognizedCountries.some(
          rc => Math.max(rc.index, i) < Math.min(rc.index + rc.text.split(' ').length, i + len)
        );
        if (!overlaps) {
          recognizedCountries.push({ meta: country, index: i, text: phrase });
        }
      }
    }
  }

  // Sort by appearance in query
  recognizedCountries.sort((a, b) => a.index - b.index);

  // Single Country Found:
  if (recognizedCountries.length === 1) {
    const found = recognizedCountries[0].meta;
    // Check if query implies Origin or Asylum host
    const isIn = new RegExp(`\\b(in|into|hosted by|hosting|living in)\\s+${recognizedCountries[0].text}\\b`, 'i').test(normalized);
    const isFrom = new RegExp(`\\b(from|origin|originating|fleeing)\\s+${recognizedCountries[0].text}\\b`, 'i').test(normalized);

    if (isIn && !isFrom) {
      return {
        rawQuery: trimmed,
        originCountry: null,
        asylumCountry: found,
        populationCategory,
        targetDataset,
        yearRange: { startYear, endYear, exactYear },
        isAmbiguousDirection: false,
        confidence: 0.85,
        explanation: `Populations hosted in ${found.name} from all countries of origin`
      };
    } else {
      // Default single country to Origin (e.g. "Afghan refugees", "Refugees from Ukraine")
      return {
        rawQuery: trimmed,
        originCountry: found,
        asylumCountry: null,
        populationCategory,
        targetDataset,
        yearRange: { startYear, endYear, exactYear },
        isAmbiguousDirection: false,
        confidence: 0.88,
        explanation: `Populations originating from ${found.name} across all host countries`
      };
    }
  }

  // Two Countries Found (e.g. "India Pakistan refugees")
  if (recognizedCountries.length >= 2) {
    const c1 = recognizedCountries[0].meta;
    const c2 = recognizedCountries[1].meta;

    // If query contains "in C2 from C1" or "from C1 in C2"
    return {
      rawQuery: trimmed,
      originCountry: c1,
      asylumCountry: c2,
      populationCategory,
      targetDataset,
      yearRange: { startYear, endYear, exactYear },
      isAmbiguousDirection: true, // Flag as potentially ambiguous so UI can offer quick reversal toggle
      confidence: 0.75,
      explanation: `Corridor between ${c1.name} and ${c2.name} (Assumed Origin: ${c1.name}, Asylum: ${c2.name})`
    };
  }

  return {
    rawQuery: trimmed,
    originCountry: null,
    asylumCountry: null,
    populationCategory,
    targetDataset,
    yearRange: { startYear, endYear, exactYear },
    isAmbiguousDirection: false,
    confidence: 0.3,
    explanation: 'Could not detect specific country or corridor in query.'
  };
}
