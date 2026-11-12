import { ParsedQuery, TargetDataset, PopulationCategory } from './nlpQueryParser';

export interface UNHCRPopulationRecord {
  year: number;
  coo_id?: number;
  coa_id?: number;
  coo_name?: string;
  coa_name?: string;
  coo?: string;
  coa?: string;
  coo_iso?: string;
  coa_iso?: string;
  refugees?: number | string;
  asylum_seekers?: number | string;
  returned_refugees?: number | string;
  idps?: number | string;
  returned_idps?: number | string;
  stateless?: number | string;
  ooc?: number | string;
  oip?: number | string;
  hst?: number | string;
  // Asylum application specific fields
  applied?: number | string;
  dec_recognized?: number | string;
  dec_rejected?: number | string;
  dec_other?: number | string;
  dec_total?: number | string;
  [key: string]: unknown;
}

export interface UNHCRQueryResponse {
  success: boolean;
  parsedQuery: ParsedQuery;
  records: UNHCRPopulationRecord[];
  totalRecords: number;
  latestYear?: number;
  latestValue?: number;
  metricLabel: string;
  sourceUrl: string;
  disclaimer: string;
  error?: string;
}

const BASE_URL = 'https://api.unhcr.org/population/v1';

// In-memory cache for fast repeated queries
const CACHE = new Map<string, { data: UNHCRQueryResponse; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function parseNumeric(val: unknown): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    if (val === '-' || val === '' || val.toLowerCase() === 'null') return 0;
    const parsed = parseInt(val.replace(/,/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export async function fetchUNHCRData(parsed: ParsedQuery): Promise<UNHCRQueryResponse> {
  const cacheKey = JSON.stringify({
    coo: parsed.originCountry?.iso,
    coa: parsed.asylumCountry?.iso,
    category: parsed.populationCategory,
    dataset: parsed.targetDataset,
    yearRange: parsed.yearRange
  });

  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Determine endpoint based on dataset
  let endpoint = `${BASE_URL}/population/`;
  if (parsed.targetDataset === 'AsylumApplications') {
    endpoint = `${BASE_URL}/asylum-applications/`;
  } else if (parsed.targetDataset === 'AsylumDecisions') {
    endpoint = `${BASE_URL}/asylum-decisions/`;
  }

  const params = new URLSearchParams();
  params.set('cf_type', 'ISO');
  params.set('limit', '500');

  if (parsed.originCountry) {
    params.set('coo', parsed.originCountry.iso);
  }
  if (parsed.asylumCountry) {
    params.set('coa', parsed.asylumCountry.iso);
  }

  // Handle year range
  if (parsed.yearRange.exactYear) {
    params.set('yearFrom', parsed.yearRange.exactYear.toString());
    params.set('yearTo', parsed.yearRange.exactYear.toString());
  } else {
    if (parsed.yearRange.startYear) {
      params.set('yearFrom', parsed.yearRange.startYear.toString());
    }
    if (parsed.yearRange.endYear) {
      params.set('yearTo', parsed.yearRange.endYear.toString());
    }
  }

  const fullUrl = `${endpoint}?${params.toString()}`;

  try {
    const res = await fetch(fullUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Displacement-Explorer/1.0 (academic-research)'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`UNHCR API responded with status ${res.status}`);
    }

    const json = await res.json();
    const rawItems: UNHCRPopulationRecord[] = Array.isArray(json.items) ? json.items : [];

    // Filter and aggregate according to population category
    const records = rawItems.sort((a, b) => a.year - b.year);

    let metricLabel = 'Refugees';
    if (parsed.populationCategory === 'asylum_seekers') metricLabel = 'Asylum-seekers';
    else if (parsed.populationCategory === 'idps') metricLabel = 'Internally Displaced Persons';
    else if (parsed.populationCategory === 'stateless') metricLabel = 'Stateless Persons';
    else if (parsed.populationCategory === 'returned_refugees') metricLabel = 'Returned Refugees';
    else if (parsed.targetDataset === 'AsylumApplications') metricLabel = 'Asylum Applications';
    else if (parsed.targetDataset === 'AsylumDecisions') metricLabel = 'Asylum Decisions';

    // Calculate latest year and value
    let latestYear: number | undefined;
    let latestValue: number | undefined;

    if (records.length > 0) {
      const latestRec = records[records.length - 1];
      latestYear = latestRec.year;

      if (parsed.targetDataset === 'AsylumApplications') {
        // Sum applications for that year
        const yearRecs = records.filter(r => r.year === latestYear);
        latestValue = yearRecs.reduce((sum, r) => sum + parseNumeric(r.applied), 0);
      } else if (parsed.targetDataset === 'AsylumDecisions') {
        const yearRecs = records.filter(r => r.year === latestYear);
        latestValue = yearRecs.reduce((sum, r) => sum + parseNumeric(r.dec_recognized), 0);
      } else {
        const categoryKey = parsed.populationCategory === 'all' ? 'refugees' : parsed.populationCategory;
        const yearRecs = records.filter(r => r.year === latestYear);
        latestValue = yearRecs.reduce((sum, r) => sum + parseNumeric(r[categoryKey]), 0);
      }
    }

    const response: UNHCRQueryResponse = {
      success: true,
      parsedQuery: parsed,
      records,
      totalRecords: records.length,
      latestYear,
      latestValue,
      metricLabel,
      sourceUrl: fullUrl,
      disclaimer: 'Data sourced from official UNHCR Refugee Data Finder API (v1).'
    };

    CACHE.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
    return {
      success: false,
      parsedQuery: parsed,
      records: [],
      totalRecords: 0,
      metricLabel: 'Refugees',
      sourceUrl: fullUrl,
      disclaimer: 'Data sourced from official UNHCR Refugee Data Finder API.',
      error: errorMsg
    };
  }
}
