import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageQuery } from '@/lib/search/nlpQueryParser';
import { fetchUNHCRData } from '@/lib/search/unhcrClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json({
      error: 'Query parameter q is required'
    }, { status: 400 });
  }

  try {
    const parsed = parseNaturalLanguageQuery(q);
    const result = await fetchUNHCRData(parsed);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({
      error: message
    }, { status: 500 });
  }
}
