import React from 'react';
import { parseNaturalLanguageQuery } from '@/lib/search/nlpQueryParser';
import { fetchUNHCRData } from '@/lib/search/unhcrClient';
import { SearchResultsView } from '@/components/search/SearchResultsView';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || 'India to Pakistan';
  const parsed = parseNaturalLanguageQuery(query);
  const data = await fetchUNHCRData(parsed);

  return <SearchResultsView initialData={data} initialQuery={query} />;
}
