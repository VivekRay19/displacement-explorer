import Fuse from 'fuse.js';
import { SITUATIONS_CATALOGUE } from '../data/situations';
import { GLOSSARY_TERMS } from '../data/glossary';

export interface SearchMatchResult {
  type: 'quick_answer' | 'situation' | 'country' | 'term';
  title: string;
  subtitle?: string;
  link: string;
  quickValue?: string;
  sourceNote?: string;
  situationSlug?: string;
}

// Token dictionaries
const POPULATION_SYNONYMS: Record<string, string> = {
  refugee: 'Refugees',
  refugees: 'Refugees',
  asylum: 'Asylum-seekers',
  'asylum-seeker': 'Asylum-seekers',
  'asylum-seekers': 'Asylum-seekers',
  idp: 'Internally Displaced Persons',
  idps: 'Internally Displaced Persons',
  displaced: 'Refugees',
  displacement: 'Refugees',
  stateless: 'Stateless people'
};

const COUNTRY_ALIASES: Record<string, { code: string; name: string }> = {
  'sri lanka': { code: 'LKA', name: 'Sri Lanka' },
  'sri lankan': { code: 'LKA', name: 'Sri Lanka' },
  'sri lankans': { code: 'LKA', name: 'Sri Lanka' },
  ceylon: { code: 'LKA', name: 'Sri Lanka' },
  india: { code: 'IND', name: 'India' },
  indian: { code: 'IND', name: 'India' },
  myanmar: { code: 'MMR', name: 'Myanmar' },
  burma: { code: 'MMR', name: 'Myanmar' },
  bangladesh: { code: 'BGD', name: 'Bangladesh' },
  rohingya: { code: 'MMR', name: 'Myanmar' },
  sudan: { code: 'SDN', name: 'Sudan' },
  sudanese: { code: 'SDN', name: 'Sudan' }
};

const fuseSituations = new Fuse(SITUATIONS_CATALOGUE, {
  keys: ['title', 'summary', 'originCountry.name', 'hostCountries.name', 'region'],
  threshold: 0.35
});

const fuseGlossary = new Fuse(GLOSSARY_TERMS, {
  keys: ['term', 'plainDefinition'],
  threshold: 0.3
});

export function parseAndExecuteSearch(query: string): SearchMatchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: SearchMatchResult[] = [];

  // 1. Natural question parsing (e.g., "Sri Lankan refugees in India")
  const words = trimmed.replace(/[?.,]/g, '').split(/\s+/);
  const isSriLanka = words.some(w => ['sri', 'lanka', 'lankan', 'lankans'].includes(w));
  const isIndia = words.some(w => ['india', 'indian'].includes(w));
  const isRefugee = words.some(w => ['refugee', 'refugees', 'displacement'].includes(w));

  if (isSriLanka && isIndia && isRefugee) {
    results.push({
      type: 'quick_answer',
      title: 'Sri Lankan refugees in India, 2025: 89,507',
      subtitle: 'Refugees registered with UNHCR at year end (stock).',
      link: '/situations/sri-lankan-refugees-in-india',
      quickValue: '89,507',
      sourceNote: 'UNHCR Refugee Data Finder (Official Population Statistics)',
      situationSlug: 'sri-lankan-refugees-in-india'
    });
  }

  // 2. Fuzzy Match against Situations Catalogue
  const situationHits = fuseSituations.search(trimmed);
  for (const hit of situationHits) {
    results.push({
      type: 'situation',
      title: hit.item.title,
      subtitle: `${hit.item.startYear} to ${hit.item.endYear || 'Present'} · ${hit.item.region}`,
      link: `/situations/${hit.item.slug}`,
      situationSlug: hit.item.slug
    });
  }

  // 3. Match against Glossary
  const glossaryHits = fuseGlossary.search(trimmed);
  for (const hit of glossaryHits) {
    results.push({
      type: 'term',
      title: `Definition: ${hit.item.term}`,
      subtitle: hit.item.plainDefinition,
      link: `/learn#glossary-${hit.item.slug}`
    });
  }

  return results.slice(0, 5);
}
