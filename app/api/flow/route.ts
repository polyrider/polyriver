import { NextResponse } from 'next/server';
import { fetchActiveMarkets, fetchRecentTrades } from '@/lib/clob';
import { processTradesIntoEvents } from '@/lib/flow-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Stateless polling endpoint — works on Vercel serverless
// Client polls this every 3s and gets fresh events each time
export async function GET() {
  try {
    const THRESHOLD = Number(process.env.LARGE_TRADE_THRESHOLD || 50);
    const markets = await fetchActiveMarkets(20);

    if (!markets || markets.length === 0) {
      return NextResponse.json({ events: [], markets: 0 });
    }

    // Pick top 8 markets by volume and fetch trades for each
    const topMarkets = markets
      .sort((a: { volume24hr?: number }, b: { volume24hr?: number }) =>
        (b.volume24hr || 0) - (a.volume24hr || 0))
      .slice(0, 8);

    const allEvents: ReturnType<typeof processTradesIntoEvents>[0][] = [];

    await Promise.allSettled(
      topMarkets.map(async (market: { question?: string; tokens?: { token_id: string; outcome: string }[] }) => {
        const token = market.tokens?.[0];
        if (!token) return;
        try {
          const trades = await fetchRecentTrades(token.token_id);
          if (!trades || trades.length === 0) return;
          const events = processTradesIntoEvents(
            trades,
            market.question || 'Unknown Market',
            THRESHOLD
          );
          allEvents.push(...events);
        } catch {
          // Skip failed markets silently
        }
      })
    );

    // Sort by timestamp descending, return newest 30
    allEvents.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      events: allEvents.slice(0, 30),
      markets: markets.length,
      ts: Date.now(),
    });
  } catch (err) {
    console.error('[/api/flow]', err);
    return NextResponse.json({ events: [], markets: 0, error: 'fetch failed' });
  }
}
