import type { FlowEvent, Trade, Market, FlowEventType } from './types';

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// In-memory circular buffer of recent flow events
const MAX_EVENTS = 200;
const eventBuffer: FlowEvent[] = [];

// Track recently seen trade IDs to avoid duplicates
const seenTradeIds = new Set<string>();
const LARGE_TRADE_THRESHOLD = Number(process.env.LARGE_TRADE_THRESHOLD || 500);

// Volume tracking per market for spike detection
interface VolumeWindow {
  tokenId: string;
  buckets: number[]; // 30s buckets, last 10 = 5 minutes
  lastFlush: number;
}
const volumeWindows = new Map<string, VolumeWindow>();

function getVolumeWindow(tokenId: string): VolumeWindow {
  if (!volumeWindows.has(tokenId)) {
    volumeWindows.set(tokenId, {
      tokenId,
      buckets: Array(10).fill(0),
      lastFlush: Date.now(),
    });
  }
  return volumeWindows.get(tokenId)!;
}

function updateVolumeWindow(tokenId: string, tradeSize: number): { isSpike: boolean; ratio: number } {
  const win = getVolumeWindow(tokenId);
  const now = Date.now();
  const elapsed = now - win.lastFlush;

  // Advance buckets if 30s has passed
  const bucketsToAdvance = Math.min(10, Math.floor(elapsed / 30_000));
  if (bucketsToAdvance > 0) {
    win.buckets = [
      ...Array(bucketsToAdvance).fill(0),
      ...win.buckets.slice(0, 10 - bucketsToAdvance),
    ];
    win.lastFlush = now;
  }

  win.buckets[0] += tradeSize;

  const currentBucket = win.buckets[0];
  const historicalAvg =
    win.buckets.slice(1).reduce((a, b) => a + b, 0) / Math.max(1, win.buckets.slice(1).filter(Boolean).length);

  const ratio = historicalAvg > 0 ? currentBucket / historicalAvg : 1;
  return { isSpike: ratio >= 3 && currentBucket > 100, ratio };
}

// Price tracking for momentum detection
const priceHistory = new Map<string, { price: number; time: number }[]>();

function recordPrice(tokenId: string, price: number): { isMomentum: boolean; velocity: number } {
  if (!priceHistory.has(tokenId)) priceHistory.set(tokenId, []);
  const hist = priceHistory.get(tokenId)!;
  hist.push({ price, time: Date.now() });
  // Keep last 60 records
  if (hist.length > 60) hist.shift();

  if (hist.length < 5) return { isMomentum: false, velocity: 0 };

  const oldest = hist[Math.max(0, hist.length - 10)];
  const newest = hist[hist.length - 1];
  const timeDelta = (newest.time - oldest.time) / 1000; // seconds
  const priceDelta = Math.abs(newest.price - oldest.price);
  const velocity = timeDelta > 0 ? priceDelta / timeDelta : 0;

  return { isMomentum: priceDelta >= 0.03 && velocity > 0.001, velocity };
}

export function processTradesIntoEvents(
  trades: Trade[],
  market: Market
): FlowEvent[] {
  const events: FlowEvent[] = [];

  for (const trade of trades) {
    const tradeKey = trade.id || `${trade.match_time}_${trade.price}_${trade.size}`;
    if (seenTradeIds.has(tradeKey)) continue;
    seenTradeIds.add(tradeKey);
    if (seenTradeIds.size > 10000) {
      const first = seenTradeIds.values().next().value;
      if (first) seenTradeIds.delete(first);
    }

    const size = parseFloat(trade.size || '0');
    const price = parseFloat(trade.price || '0');
    const usdValue = size * price;
    const side = trade.side === 'BUY' ? 'YES' : 'NO';

    // Large trade detection
    if (usdValue >= LARGE_TRADE_THRESHOLD) {
      events.push({
        id: `${tradeKey}_large`,
        type: 'large_trade',
        market: market.question || market.slug,
        marketSlug: market.slug,
        tokenId: trade.asset_id,
        description: `${side} $${formatMagnitude(usdValue)} at ${(price * 100).toFixed(1)}¢`,
        magnitude: usdValue,
        price,
        side,
        timestamp: new Date(trade.match_time || Date.now()).getTime(),
        walletAddress: trade.maker_address,
      });
    }

    // Volume spike detection
    const { isSpike, ratio } = updateVolumeWindow(trade.asset_id, usdValue);
    if (isSpike) {
      const existing = events.find(
        (e) => e.type === 'volume_spike' && e.tokenId === trade.asset_id
      );
      if (!existing) {
        events.push({
          id: `${trade.asset_id}_spike_${Date.now()}`,
          type: 'volume_spike',
          market: market.question || market.slug,
          marketSlug: market.slug,
          tokenId: trade.asset_id,
          description: `Volume spike ${ratio.toFixed(1)}x above average`,
          magnitude: ratio,
          price,
          side,
          timestamp: Date.now(),
        });
      }
    }

    // Momentum detection
    const { isMomentum, velocity } = recordPrice(trade.asset_id, price);
    if (isMomentum) {
      const existing = events.find(
        (e) => e.type === 'momentum' && e.tokenId === trade.asset_id
      );
      if (!existing) {
        const direction = price > 0.5 ? 'YES' : 'NO';
        events.push({
          id: `${trade.asset_id}_momentum_${Date.now()}`,
          type: 'momentum',
          market: market.question || market.slug,
          marketSlug: market.slug,
          tokenId: trade.asset_id,
          description: `Rapid ${direction} price movement (+${(velocity * 1000).toFixed(2)}/s)`,
          magnitude: velocity,
          price,
          side: direction,
          timestamp: Date.now(),
        });
      }
    }
  }

  return events;
}

export function pushEvents(events: FlowEvent[]) {
  for (const e of events) {
    eventBuffer.unshift(e);
  }
  if (eventBuffer.length > MAX_EVENTS) {
    eventBuffer.splice(MAX_EVENTS);
  }
}

export function getRecentEvents(limit = 20): FlowEvent[] {
  return eventBuffer.slice(0, limit);
}

function formatMagnitude(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toFixed(0);
}
