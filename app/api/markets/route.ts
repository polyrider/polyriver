import { NextResponse } from 'next/server';
import { fetchActiveMarkets, compileMarketScores } from '@/lib/clob';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag') || undefined;
  const limit = parseInt(searchParams.get('limit') || '30', 10);

  try {
    const markets = await fetchActiveMarkets(limit, tag);
    const scored = await compileMarketScores(markets);
    return NextResponse.json(scored);
  } catch (err) {
    console.error('[/api/markets]', err);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
}
