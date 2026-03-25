import { NextResponse } from 'next/server';
import { fetchActiveMarkets } from '@/lib/clob';
import type { FlowEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Stateless flow signal generator using Gamma API market data.
// The CLOB /trades endpoint requires auth — Gamma API is fully public.
// Signals are derived from current market state (volume, price, liquidity).
// Event IDs use minute-level time buckets so the feed auto-refreshes every minute.

function randomId(base: string): string {
  return `${base}_${Math.floor(Date.now() / 60_000)}`;
}

function formatVal(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

export async function GET() {
  try {
    const markets = await fetchActiveMarkets(30);

    if (!markets || markets.length === 0) {
      return NextResponse.json({ events: [], markets: 0 });
    }

    // Sort by volume so we look at the most active markets first
    const ranked = [...markets].sort(
      (a, b) => (b.volume24hr || 0) - (a.volume24hr || 0)
    );

    const events: FlowEvent[] = [];

    for (const market of ranked.slice(0, 20)) {
      const vol = market.volume24hr || 0;
      const liq = market.liquidity || 1;
      const flowRatio = vol / Math.max(liq, 1);
      const q = market.question || 'Unknown market';
      const now = Date.now();

      const tokens: { outcome?: string; price?: number | string; token_id?: string }[] =
        market.tokens || [];

      // ── High-volume markets → volume signal ───────────────────
      if (vol >= 2_000) {
        events.push({
          id: randomId(`${market.id}_vol`),
          type: 'volume_spike',
          market: q,
          marketSlug: market.slug || '',
          tokenId: tokens[0]?.token_id || '',
          description: `${formatVal(vol)} traded in last 24h — ${(flowRatio * 100).toFixed(0)}% of liquidity`,
          magnitude: vol,
          price: 0,
          side: 'YES',
          timestamp: now,
        });
      }

      // ── Strong price lean → momentum signal ───────────────────
      for (const token of tokens) {
        const price = parseFloat(String(token.price || '0'));
        if (isNaN(price) || price <= 0) continue;
        const outcome = token.outcome || 'YES';
        const isStrong = price >= 0.70 || price <= 0.30;
        const isVeryStrong = price >= 0.85 || price <= 0.15;
        if (isStrong && vol >= 500) {
          events.push({
            id: randomId(`${market.id}_${outcome}_momentum`),
            type: 'momentum',
            market: q,
            marketSlug: market.slug || '',
            tokenId: token.token_id || '',
            description: `${outcome} at ${(price * 100).toFixed(1)}¢${isVeryStrong ? ' — near certainty' : ' — strong lean'}`,
            magnitude: price,
            price,
            side: outcome as 'YES' | 'NO',
            timestamp: now,
          });
        }
      }

      // ── High flow ratio → implied large trade signal ──────────
      if (flowRatio >= 0.5 && vol >= 1_000) {
        const yesToken = tokens.find(t => t.outcome === 'Yes' || t.outcome === 'YES');
        const price = parseFloat(String(yesToken?.price || '0.5'));
        events.push({
          id: randomId(`${market.id}_flow`),
          type: 'large_trade',
          market: q,
          marketSlug: market.slug || '',
          tokenId: yesToken?.token_id || '',
          description: `High flow: ${formatVal(vol)} / ${formatVal(liq)} liquidity (${(flowRatio * 100).toFixed(0)}% ratio)`,
          magnitude: vol,
          price,
          side: price >= 0.5 ? 'YES' : 'NO',
          timestamp: now,
          walletAddress: undefined,
        });
      }
    }

    // Sort by magnitude descending, cap at 30
    events.sort((a, b) => b.magnitude - a.magnitude);

    return NextResponse.json({
      events: events.slice(0, 30),
      markets: markets.length,
      ts: Date.now(),
    });
  } catch (err) {
    console.error('[/api/flow]', err);
    return NextResponse.json({ events: [], markets: 0, error: 'fetch failed' });
  }
}
