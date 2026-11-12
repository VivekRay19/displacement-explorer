import Fuse from 'fuse.js';
import { SITUATIONS_CATALOGUE } from '../data/situations';
import { GLOSSARY_TERMS } from '../data/glossary';
import { parseNaturalLanguageQuery } from './nlpQueryParser';

export interface SearchMatchResult {
  type: 'live_query' | 'quick_answer' | 'situation' | 'country' | 'term';
  title: string;
  subtitle?: string;
  link: string;
  quickValue?: string;
  sourceNote?: string;
  situationSlug?: string;
}

const fuseSituations = new Fuse(SITUATIONS_CATALOGUE, {
  keys: ['title', 'summary', 'originCountry.name', 'hostCountries.name', 'region'],
  threshold: 0.35
});

const fuseGlossary = new Fuse(GLOSSARY_TERMS, {
  keys: ['term', 'plainDefinition'],
  threshold: 0.3
});

export function parseAndExecuteSearch(query: string): SearchMatchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: SearchMatchResult[] = [];

  // 1. Intelligent Natural Language Parser Interpretation
  const nlp = parseNaturalLanguageQuery(trimmed);
  if (nlp.originCountry || nlp.asylumCountry) {
    let title = '';
    if (nlp.originCountry && nlp.asylumCountry) {
      title = `${nlp.originCountry.name} to ${nlp.asylumCountry.name} (${nlp.populationCategory.replace('_', ' ')})`;
    } else if (nlp.originCountry) {
      title = `${nlp.originCountry.name} (${nlp.populationCategory.replace('_', ' ')})`;
    } else if (nlp.asylumCountry) {
      title = `Hosted in ${nlp.asylumCountry.name}`;
    }

    results.push({
      type: 'live_query',
      title: `Search UNHCR Data: ${title}`,
      subtitle: nlp.explanation,
      link: `/search?q=${encodeURIComponent(trimmed)}`,
      sourceNote: 'UNHCR Refugee Data Portal'
    });
  }

  // 2. Exact question / situation fast path (e.g., "Sri Lankan refugees in India")
  const lower = trimmed.toLowerCase();
  const words = lower.replace(/[?.,]/g, '').split(/\s+/);
  const isSriLanka = words.some(w => ['sri', 'lanka', 'lankan', 'lankans'].includes(w));
  const isIndia = words.some(w => ['india', 'indian'].includes(w));
  const isRefugee = words.some(w => ['refugee', 'refugees', 'displacement'].includes(w));

  if (isSriLanka && isIndia && isRefugee) {
    results.push({
      type: 'quick_answer',
      title: 'Sri Lankan refugees in India: 89,507',
      subtitle: 'Research dossier with full historical stock series and source trace.',
      link: '/situations/sri-lankan-refugees-in-india',
      quickValue: '89,507',
      sourceNote: 'UNHCR Refugee Data Finder (Official Population Statistics)',
      situationSlug: 'sri-lankan-refugees-in-india'
    });
  }

  // 3. Fuzzy Match against Situations Catalogue
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

  // 4. Match against Glossary
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
