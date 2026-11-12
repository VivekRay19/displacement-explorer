import { APP_VERSION, GIT_COMMIT_SHA, BUILD_DATE, APP_ENVIRONMENT } from '@/lib/version';

export const dynamic = 'force-static';

export async function GET() {
  return Response.json({
    name: 'Displacement Explorer',
    version: APP_VERSION,
    commit: GIT_COMMIT_SHA,
    build_date: BUILD_DATE,
    environment: APP_ENVIRONMENT,
    status: 'healthy',
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
