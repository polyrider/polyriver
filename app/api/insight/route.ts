import { NextResponse } from 'next/server';
import { generateInsight } from '@/lib/gemini';
import { fetchActiveMarkets, fetchRecentTrades } from '@/lib/clob';
import { processTradesIntoEvents } from '@/lib/flow-engine';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const THRESHOLD = Number(process.env.LARGE_TRADE_THRESHOLD || 50);
    const markets = await fetchActiveMarkets(10);
    const allEvents: ReturnType<typeof processTradesIntoEvents>[0][] = [];

    if (markets && markets.length > 0) {
      const topMarkets = markets
        .sort((a: { volume24hr?: number }, b: { volume24hr?: number }) =>
          (b.volume24hr || 0) - (a.volume24hr || 0))
        .slice(0, 5);

      await Promise.allSettled(
        topMarkets.map(async (market: { question?: string; tokens?: { token_id: string }[] }) => {
          const token = market.tokens?.[0];
          if (!token) return;
          try {
            const trades = await fetchRecentTrades(token.token_id);
            if (!trades || trades.length === 0) return;
            const events = processTradesIntoEvents(trades, market.question || 'Unknown Market', THRESHOLD);
            allEvents.push(...events);
          } catch { /* skip */ }
        })
      );
    }

    const insight = await generateInsight(allEvents.slice(0, 15));
    return NextResponse.json(insight);
  } catch (err) {
    console.error('[/api/insight]', err);
    return NextResponse.json(
      { summary: 'Monitoring market flow. Insight temporarily unavailable.', unusual: null, generatedAt: Date.now() },
      { status: 200 }
    );
  }
}
