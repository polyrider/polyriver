'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FlowEvent, MarketWithScore } from '@/lib/types';

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'now';
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function formatVol(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function MarketDetailPanel({ market, onClose }: { market: MarketWithScore; onClose: () => void }) {
  const [orderbook, setOrderbook] = useState<{ bids: {price:string;size:string}[]; asks: {price:string;size:string}[] } | null>(null);

  useEffect(() => {
    const token = market.tokens?.[0]?.token_id;
    if (!token) return;
    fetch(`/api/orderbook/${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setOrderbook(data))
      .catch(() => {});
  }, [market]);

  const yesToken = market.tokens?.find(t => t.outcome === 'Yes' || t.outcome === 'YES');
  const noToken  = market.tokens?.find(t => t.outcome === 'No'  || t.outcome === 'NO');
  const yesPrice = yesToken?.price ?? 0;
  const noPrice  = noToken?.price  ?? 0;
  const slug = market.slug || market.id;
  const polyUrl = `https://polymarket.com/event/${slug}`;

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-header">
          <div className="detail-title">{market.question}</div>
          <button className="detail-close" onClick={onClose}>×</button>
        </div>
        <div className="detail-body">
          <div className="detail-prices">
            <div className="price-box yes"><div className="price-box-label">YES</div><div className="price-box-value">{(yesPrice * 100).toFixed(1)}¢</div></div>
            <div className="price-box no"><div className="price-box-label">NO</div><div className="price-box-value">{(noPrice * 100).toFixed(1)}¢</div></div>
          </div>
          <div className="detail-meta">
            <div className="detail-meta-item"><span className="detail-meta-label">24h Volume</span><span className="detail-meta-value">{formatVol(market.volume24hr || 0)}</span></div>
            <div className="detail-meta-item"><span className="detail-meta-label">Liquidity</span><span className="detail-meta-value">{formatVol(market.liquidity || 0)}</span></div>
            <div className="detail-meta-item"><span className="detail-meta-label">Flow Score</span><span className="detail-meta-value" style={{ color: 'var(--accent-yellow)' }}>{market.flow_score}</span></div>
          </div>
          {orderbook && (orderbook.bids?.length > 0 || orderbook.asks?.length > 0) && (
            <div className="orderbook-mini" style={{ marginBottom: 14 }}>
              <div className="orderbook-side">
                <div className="orderbook-side-label">Bids</div>
                {(orderbook.bids || []).slice(0, 5).map((b, i) => (
                  <div key={i} className="ob-row bid"><span className="ob-price">{parseFloat(b.price).toFixed(3)}</span><span className="ob-size">{parseFloat(b.size).toFixed(0)}</span></div>
                ))}
              </div>
              <div className="orderbook-side">
                <div className="orderbook-side-label">Asks</div>
                {(orderbook.asks || []).slice(0, 5).map((a, i) => (
                  <div key={i} className="ob-row ask"><span className="ob-price">{parseFloat(a.price).toFixed(3)}</span><span className="ob-size">{parseFloat(a.size).toFixed(0)}</span></div>
                ))}
              </div>
            </div>
          )}
          <a href={polyUrl} target="_blank" rel="noopener noreferrer" className="trade-button">
            Trade on Polymarket<span className="trade-button-arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { id: 'all', label: 'All', icon: '◈' },
  { id: 'politics', label: 'Pol', icon: '⬡' },
  { id: 'crypto', label: 'Crypto', icon: '◎' },
  { id: 'macro', label: 'Macro', icon: '△' },
];

function NavPanel({ activeFilter, onFilter }: { activeFilter: string; onFilter: (f: string) => void }) {
  return (
    <div className="nav-panel">
      <div className="nav-logo">
        <span className="nav-logo-text">PR</span>
        <span className="nav-logo-sub">Flow</span>
      </div>
      {FILTERS.map(f => (
        <button key={f.id} className={`nav-filter${activeFilter === f.id ? ' active' : ''}`} onClick={() => onFilter(f.id)} title={f.id}>
          <span className="nav-filter-icon">{f.icon}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}

function Topbar({ eventCount, marketCount }: { eventCount: number; marketCount: number }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="terminal-topbar">
      <div className="topbar-left">
        <a href="/" style={{ textDecoration: 'none' }}>
          <span className="topbar-brand">POLYRIVER</span>
        </a>
        <div className="topbar-sep" />
        <div className="topbar-stat"><span className="topbar-stat-label">Events</span><span className="topbar-stat-value">{eventCount}</span></div>
        <div className="topbar-stat"><span className="topbar-stat-label">Markets</span><span className="topbar-stat-value">{marketCount}</span></div>
      </div>
      <div className="topbar-right">
        <a href="https://x.com/polyriver_app" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>𝕏</a>
        <span className="live-dot">LIVE</span>
        <span className="topbar-time">{time}</span>
      </div>
    </div>
  );
}

function ageClass(index: number): string {
  if (index < 3) return '';
  if (index < 7) return 'aged-1';
  if (index < 11) return 'aged-2';
  if (index < 15) return 'aged-3';
  return 'aged-4';
}

function FlowFeed({ events, loading }: { events: FlowEvent[]; loading: boolean }) {
  if (loading && events.length === 0) {
    return <div className="state-loading"><div className="spinner" />Scanning Polymarket flow...</div>;
  }
  if (events.length === 0) {
    return <div className="state-loading"><div className="spinner" />Waiting for signals above threshold...</div>;
  }
  return (
    <div className="flow-list">
      {events.slice(0, 20).map((e, idx) => (
        <div key={e.id} className={`flow-event ${ageClass(idx)}`}>
          <div className={`flow-event-bar ${e.type}`} />
          <div className="flow-event-body">
            <div className="flow-event-market">{e.market}</div>
            <div className="flow-event-desc">{e.description}</div>
            <span className={`flow-event-type-badge ${e.type}`}>
              {e.type === 'large_trade' ? 'LARGE TRADE' : e.type === 'volume_spike' ? 'VOL SPIKE' : 'MOMENTUM'}
            </span>
          </div>
          <div className="flow-event-meta">{relativeTime(e.timestamp)}</div>
        </div>
      ))}
    </div>
  );
}

function MomentumPanel({ markets, onSelect }: { markets: MarketWithScore[]; onSelect: (m: MarketWithScore) => void }) {
  if (markets.length === 0) return <div className="state-loading"><div className="spinner" />Loading markets...</div>;
  const maxScore = Math.max(...markets.map(m => m.flow_score), 1);
  return (
    <div className="momentum-list">
      {markets.slice(0, 10).map(m => {
        const pct = Math.round((m.flow_score / maxScore) * 100);
        const isHigh = pct >= 60;
        return (
          <div key={m.id} className="momentum-item" onClick={() => onSelect(m)}>
            <div className="momentum-item-top">
              <span className="momentum-name">{m.question}</span>
              <span className="momentum-metric">{isHigh ? '+' : ''}{formatVol(m.volume24hr || 0)}</span>
            </div>
            <div className="momentum-bar-track">
              <div className={`momentum-bar-fill${isHigh ? ' high' : ''}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WalletTracker({ events }: { events: FlowEvent[] }) {
  const walletEvents = events.filter(e => e.type === 'large_trade' && e.walletAddress);
  if (walletEvents.length === 0) return <div className="state-empty"><span>No wallet data yet</span></div>;
  return (
    <div className="wallet-list">
      {walletEvents.slice(0, 8).map(e => (
        <a key={e.id} className="wallet-row" href={`https://polygonscan.com/address/${e.walletAddress}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <span className="wallet-address">{e.walletAddress!.slice(0, 6)}…{e.walletAddress!.slice(-4)}</span>
          <span className="wallet-market">{e.market.slice(0, 24)}</span>
          <span className={`wallet-amount ${e.side.toLowerCase()}`}>{e.side} ${e.magnitude >= 1000 ? (e.magnitude / 1000).toFixed(1) + 'k' : e.magnitude.toFixed(0)}</span>
        </a>
      ))}
    </div>
  );
}

function AIInsightPanel() {
  const [insight, setInsight] = useState<{ summary: string; unusual: string | null; generatedAt: number } | null>(null);
  const fetchInsight = useCallback(() => {
    fetch('/api/insight', { method: 'POST' }).then(r => r.ok ? r.json() : null).then(data => data && setInsight(data)).catch(() => {});
  }, []);
  useEffect(() => { fetchInsight(); const t = setInterval(fetchInsight, 30_000); return () => clearInterval(t); }, [fetchInsight]);
  if (!insight) return <div className="insight-panel"><div className="state-loading" style={{ height: 40 }}><div className="spinner" />Generating insight...</div></div>;
  return (
    <div className="insight-panel">
      <p className="insight-summary">{insight.summary}</p>
      {insight.unusual && <p className="insight-unusual">{insight.unusual}</p>}
      <div className="insight-footer"><span>AI</span><span style={{ color: 'var(--border)' }}>·</span><span>{relativeTime(insight.generatedAt)}</span></div>
    </div>
  );
}

export default function TerminalPage() {
  const [events, setEvents] = useState<FlowEvent[]>([]);
  const [markets, setMarkets] = useState<MarketWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState<MarketWithScore | null>(null);
  const seenIds = useRef(new Set<string>());

  // ── Markets (30s refresh) ────────────────────────────────────
  const loadMarkets = useCallback((filter: string) => {
    const tag = filter === 'all' ? '' : `&tag=${filter}`;
    fetch(`/api/markets?limit=30${tag}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => Array.isArray(data) && setMarkets(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadMarkets(activeFilter);
    const t = setInterval(() => loadMarkets(activeFilter), 30_000);
    return () => clearInterval(t);
  }, [activeFilter, loadMarkets]);

  // ── Flow polling (every 4s) — stateless, works on Vercel ────
  const pollFlow = useCallback(() => {
    fetch('/api/flow')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setLoading(false);
        const incoming: FlowEvent[] = data.events || [];
        const fresh = incoming.filter(ev => !seenIds.current.has(ev.id));
        if (fresh.length === 0) return;
        fresh.forEach(ev => seenIds.current.add(ev.id));
        setEvents(prev => [...fresh, ...prev].slice(0, 50));
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    pollFlow();
    const t = setInterval(pollFlow, 4_000);
    return () => clearInterval(t);
  }, [pollFlow]);

  return (
    <div className="terminal-shell">
      <Topbar eventCount={events.length} marketCount={markets.length} />
      <div className="flow-river-line" />
      <div className="terminal-body">
        <div className="panel-left">
          <NavPanel activeFilter={activeFilter} onFilter={f => setActiveFilter(f)} />
        </div>
        <div className="panel-center">
          <div className="panel-header">
            <span className="panel-header-label">Live Flow Feed</span>
            <span className="panel-header-badge">{events.length} events</span>
          </div>
          <div className="panel-section"><FlowFeed events={events} loading={loading} /></div>
        </div>
        <div className="panel-right">
          <div className="right-momentum">
            <div className="panel-header"><span className="panel-header-label">Market Momentum</span></div>
            <div className="panel-section"><MomentumPanel markets={markets} onSelect={setSelectedMarket} /></div>
          </div>
          <div className="right-insight">
            <div className="panel-header">
              <span className="panel-header-label">AI Flow Insight</span>
              <span style={{ fontSize: 9, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>GEMINI</span>
            </div>
            <AIInsightPanel />
          </div>
          <div className="right-wallets">
            <div className="panel-header"><span className="panel-header-label">Smart Wallets</span></div>
            <div className="panel-section"><WalletTracker events={events} /></div>
          </div>
        </div>
      </div>
      {selectedMarket && <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />}
    </div>
  );
}
