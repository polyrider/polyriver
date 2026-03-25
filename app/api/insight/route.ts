import { NextResponse } from 'next/server';
import { generateInsight } from '@/lib/gemini';
import { fetchActiveMarkets } from '@/lib/clob';
import type { FlowEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST() {
  try {
    const markets = await fetchActiveMarkets(15);
    const events: FlowEvent[] = [];
    const now = Date.now();

    if (markets && markets.length > 0) {
      const ranked = [...markets].sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0));

      for (const market of ranked.slice(0, 8)) {
        const vol = market.volume24hr || 0;
        const liq = market.liquidity || 1;
        const q = market.question || 'Unknown';
        const tokens: { outcome?: string; price?: number | string; token_id?: string }[] = market.tokens || [];

        if (vol >= 1000) {
          events.push({
            id: `${market.id}_vol`,
            type: 'volume_spike',
            market: q,
            marketSlug: market.slug || '',
            tokenId: '',
            description: `$${(vol / 1000).toFixed(1)}k 24h volume`,
            magnitude: vol,
            price: 0,
            side: 'YES',
            timestamp: now,
          });
        }

        for (const token of tokens) {
          const price = parseFloat(String(token.price || '0'));
          const outcome = token.outcome || 'YES';
          if (price >= 0.70 || price <= 0.30) {
            events.push({
              id: `${market.id}_${outcome}_mo`,
              type: 'momentum',
              market: q,
              marketSlug: '',
              tokenId: token.token_id || '',
              description: `${outcome} at ${(price * 100).toFixed(1)}¢`,
              magnitude: price,
              price,
              side: outcome as 'YES' | 'NO',
              timestamp: now,
            });
          }
        }
      }
    }

    const insight = await generateInsight(events.slice(0, 12));
    return NextResponse.json(insight);
  } catch (err) {
    console.error('[/api/insight]', err);
    return NextResponse.json(
      { summary: 'Monitoring market flow. Insight temporarily unavailable.', unusual: null, generatedAt: Date.now() },
      { status: 200 }
    );
  }
}
