import type { FlowEvent, Trade } from './types';

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatMagnitude(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(0);
}

// Volume tracking per market (stateless-friendly: resets per request, which is fine for spike detection relative to this batch)
const volumeAccum = new Map<string, number>();

// Price history for momentum
const priceHistory = new Map<string, number[]>();

export function processTradesIntoEvents(
  trades: Trade[],
  marketQuestion: string,
  threshold: number
): FlowEvent[] {
  const events: FlowEvent[] = [];
  const seenInBatch = new Set<string>();

  for (const trade of trades) {
    const tradeKey = trade.id || `${trade.match_time}_${trade.price}_${trade.size}`;
    if (seenInBatch.has(tradeKey)) continue;
    seenInBatch.add(tradeKey);

    const size = parseFloat(trade.size || '0');
    const price = parseFloat(trade.price || '0');
    if (isNaN(size) || isNaN(price) || size <= 0 || price <= 0) continue;

    const usdValue = size * price;
    const side = trade.side === 'BUY' ? 'YES' : 'NO';
    const tokenId = trade.asset_id || '';

    // ── Large trade ──────────────────────────────────────────────
    if (usdValue >= threshold) {
      events.push({
        id: `${tradeKey}_large`,
        type: 'large_trade',
        market: marketQuestion,
        marketSlug: '',
        tokenId,
        description: `${side} $${formatMagnitude(usdValue)} at ${(price * 100).toFixed(1)}¢`,
        magnitude: usdValue,
        price,
        side,
        timestamp: new Date(trade.match_time || Date.now()).getTime(),
        walletAddress: trade.maker_address,
      });
    }

    // ── Volume accumulation (relative spike in this batch) ────────
    const prev = volumeAccum.get(tokenId) || 0;
    volumeAccum.set(tokenId, prev + usdValue);
    const total = volumeAccum.get(tokenId)!;
    if (total >= threshold * 5 && !events.find(e => e.type === 'volume_spike' && e.tokenId === tokenId)) {
      events.push({
        id: `${randomId()}_spike`,
        type: 'volume_spike',
        market: marketQuestion,
        marketSlug: '',
        tokenId,
        description: `Volume burst $${formatMagnitude(total)} across recent trades`,
        magnitude: total,
        price,
        side,
        timestamp: Date.now(),
      });
    }

    // ── Momentum (price velocity in this batch) ───────────────────
    if (!priceHistory.has(tokenId)) priceHistory.set(tokenId, []);
    const hist = priceHistory.get(tokenId)!;
    hist.push(price);
    if (hist.length > 20) hist.shift();

    if (hist.length >= 5) {
      const oldest = hist[0];
      const newest = hist[hist.length - 1];
      const delta = Math.abs(newest - oldest);
      if (delta >= 0.03 && !events.find(e => e.type === 'momentum' && e.tokenId === tokenId)) {
        const dir = newest > oldest ? 'YES' : 'NO';
        events.push({
          id: `${randomId()}_momentum`,
          type: 'momentum',
          market: marketQuestion,
          marketSlug: '',
          tokenId,
          description: `${dir} price moved ${(delta * 100).toFixed(1)}¢ across recent trades`,
          magnitude: delta,
          price,
          side: dir,
          timestamp: Date.now(),
        });
      }
    }
  }

  return events;
}
