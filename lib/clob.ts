import type { Market, MarketWithScore, Trade } from './types';

const GAMMA_API = process.env.NEXT_PUBLIC_GAMMA_API || 'https://gamma-api.polymarket.com';
const CLOB_HOST = process.env.NEXT_PUBLIC_CLOB_HOST || 'https://clob.polymarket.com';

// Cache with TTL
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs: number) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

export async function fetchActiveMarkets(limit = 50, tag?: string): Promise<Market[]> {
  const cacheKey = `markets:${limit}:${tag || 'all'}`;
  const cached = getCache<Market[]>(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      active: 'true',
      closed: 'false',
      limit: String(limit),
      order: 'volume24hr',
      ascending: 'false',
    });
    if (tag) params.set('tag', tag);

    const res = await fetch(`${GAMMA_API}/markets?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error(`Gamma API error: ${res.status}`);
    const data = await res.json();
    const markets = Array.isArray(data) ? data : (data.data || data.markets || []);
    setCache(cacheKey, markets, 30_000);
    return markets;
  } catch (err) {
    console.error('[gamma] fetchActiveMarkets error:', err);
    return [];
  }
}

export async function fetchMarket(slug: string): Promise<Market | null> {
  const cacheKey = `market:${slug}`;
  const cached = getCache<Market>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${GAMMA_API}/markets?slug=${encodeURIComponent(slug)}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const markets = Array.isArray(data) ? data : (data.data || []);
    const market = markets[0] || null;
    if (market) setCache(cacheKey, market, 60_000);
    return market;
  } catch {
    return null;
  }
}

export async function fetchOrderBook(tokenId: string) {
  try {
    const res = await fetch(`${CLOB_HOST}/book?token_id=${tokenId}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchRecentTrades(tokenId: string): Promise<Trade[]> {
  try {
    const res = await fetch(
      `${CLOB_HOST}/last-trades-and-prices?token_id=${tokenId}`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) {
      // fallback: try trades endpoint
      const res2 = await fetch(
        `${CLOB_HOST}/trades?token_id=${tokenId}&limit=25`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (!res2.ok) return [];
      const data2 = await res2.json();
      return Array.isArray(data2) ? data2 : (data2.data || []);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch {
    return [];
  }
}

export async function compileMarketScores(markets: Market[]): Promise<MarketWithScore[]> {
  const LARGE_TRADE_THRESHOLD = Number(process.env.LARGE_TRADE_THRESHOLD || 500);

  return markets.map((m) => {
    const vol = m.volume24hr || 0;
    const liq = m.liquidity || 1;
    // Synthetic flow score: weighted by short-term volume and liquidity depth
    const flow_score = Math.min(100, Math.round((vol / Math.max(liq, 1)) * 10));
    const price_velocity = 0; // requires historical data – will be live computed
    const volume_acceleration = vol;
    return { ...m, flow_score, price_velocity, volume_acceleration };
  }).sort((a, b) => b.flow_score - a.flow_score);
}
