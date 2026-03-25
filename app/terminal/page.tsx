'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FlowEvent, MarketWithScore } from '@/lib/types';

/* ── helpers ───────────────────────────────────────────────── */
function relativeTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return 'now';
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function fmtVol(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

/* ── Market Detail Overlay ─────────────────────────────────── */
function MarketDetailPanel({ market, onClose }: { market: MarketWithScore; onClose: () => void }) {
  const [ob, setOb] = useState<{ bids: { price: string; size: string }[]; asks: { price: string; size: string }[] } | null>(null);
  useEffect(() => {
    const token = market.tokens?.[0]?.token_id;
    if (!token) return;
    fetch(`/api/orderbook/${token}`).then(r => r.ok ? r.json() : null).then(d => d && setOb(d)).catch(() => {});
  }, [market]);

  const yes = market.tokens?.find(t => t.outcome === 'Yes' || t.outcome === 'YES');
  const no = market.tokens?.find(t => t.outcome === 'No' || t.outcome === 'NO');
  const polyUrl = `https://polymarket.com/event/${market.slug || market.id}`;

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-header">
          <div className="detail-title">{market.question}</div>
          <button className="detail-close" onClick={onClose}>×</button>
        </div>
        <div className="detail-body">
          <div className="detail-prices">
            <div className="price-box yes"><div className="price-box-label">YES</div><div className="price-box-value">{((yes?.price ?? 0) * 100).toFixed(1)}¢</div></div>
            <div className="price-box no"><div className="price-box-label">NO</div><div className="price-box-value">{((no?.price ?? 0) * 100).toFixed(1)}¢</div></div>
          </div>
          <div className="detail-meta">
            <div className="detail-meta-item"><span className="detail-meta-label">24h Volume</span><span className="detail-meta-value">{fmtVol(market.volume24hr || 0)}</span></div>
            <div className="detail-meta-item"><span className="detail-meta-label">Liquidity</span><span className="detail-meta-value">{fmtVol(market.liquidity || 0)}</span></div>
            <div className="detail-meta-item"><span className="detail-meta-label">Flow Score</span><span className="detail-meta-value" style={{ color: 'var(--accent-yellow)' }}>{market.flow_score}</span></div>
          </div>
          {ob && (ob.bids?.length > 0 || ob.asks?.length > 0) && (
            <div className="orderbook-mini">
              <div className="orderbook-side">
                <div className="orderbook-side-label">Bids</div>
                {ob.bids.slice(0, 5).map((b, i) => <div key={i} className="ob-row bid"><span className="ob-price">{parseFloat(b.price).toFixed(3)}</span><span className="ob-size">{parseFloat(b.size).toFixed(0)}</span></div>)}
              </div>
              <div className="orderbook-side">
                <div className="orderbook-side-label">Asks</div>
                {ob.asks.slice(0, 5).map((a, i) => <div key={i} className="ob-row ask"><span className="ob-price">{parseFloat(a.price).toFixed(3)}</span><span className="ob-size">{parseFloat(a.size).toFixed(0)}</span></div>)}
              </div>
            </div>
          )}
          <a href={polyUrl} target="_blank" rel="noopener noreferrer" className="trade-button">Trade on Polymarket <span className="trade-button-arrow">→</span></a>
        </div>
      </div>
    </div>
  );
}

/* ── Nav panel ─────────────────────────────────────────────── */
const FILTERS = [
  { id: 'all', label: 'All', icon: '◈' },
  { id: 'politics', label: 'Pol', icon: '⬡' },
  { id: 'crypto', label: 'Crypto', icon: '◎' },
  { id: 'macro', label: 'Macro', icon: '△' },
];

function NavPanel({ active, onFilter }: { active: string; onFilter: (f: string) => void }) {
  return (
    <div className="nav-panel">
      <div className="nav-logo"><span className="nav-logo-text">PR</span><span className="nav-logo-sub">Flow</span></div>
      {FILTERS.map(f => (
        <button key={f.id} className={`nav-filter${active === f.id ? ' active' : ''}`} onClick={() => onFilter(f.id)}>
          <span className="nav-filter-icon">{f.icon}</span>{f.label}
        </button>
      ))}
    </div>
  );
}

/* ── Topbar ────────────────────────────────────────────────── */
function Topbar({ eventCount, marketCount }: { eventCount: number; marketCount: number }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, []);
  return (
    <div className="terminal-topbar">
      <div className="topbar-left">
        <a href="/" style={{ textDecoration: 'none' }}><span className="topbar-brand">POLYRIVER</span></a>
        <div className="topbar-sep" />
        <div className="topbar-stat"><span className="topbar-stat-label">Events</span><span className="topbar-stat-value">{eventCount}</span></div>
        <div className="topbar-stat"><span className="topbar-stat-label">Markets</span><span className="topbar-stat-value">{marketCount}</span></div>
      </div>
      <div className="topbar-right">
        <a href="https://x.com/polyriver_app" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'none' }}>𝕏</a>
        <a href="https://github.com/polyrider/polyriver" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'none', marginLeft: 10 }}>GITHUB</a>
        <span className="live-dot">LIVE</span>
        <span className="topbar-time">{time}</span>
      </div>
    </div>
  );
}

/* ── Flow Feed ─────────────────────────────────────────────── */
function FlowFeed({ events, loading }: { events: FlowEvent[]; loading: boolean }) {
  function ageClass(i: number) {
    if (i < 3) return ''; if (i < 7) return 'aged-1'; if (i < 11) return 'aged-2'; if (i < 15) return 'aged-3'; return 'aged-4';
  }
  if (loading && events.length === 0) return <div className="state-loading"><div className="spinner" />Scanning Polymarket flow…</div>;
  if (events.length === 0) return <div className="state-loading"><div className="spinner" />Loading market signals…</div>;
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

/* ── Momentum Panel ────────────────────────────────────────── */
function MomentumPanel({ markets, onSelect }: { markets: MarketWithScore[]; onSelect: (m: MarketWithScore) => void }) {
  if (markets.length === 0) return <div className="state-loading"><div className="spinner" />Loading markets…</div>;
  const maxScore = Math.max(...markets.map(m => m.flow_score), 1);
  return (
    <div className="momentum-list">
      {markets.slice(0, 10).map(m => {
        const pct = Math.round((m.flow_score / maxScore) * 100);
        return (
          <div key={m.id} className="momentum-item" onClick={() => onSelect(m)}>
            <div className="momentum-item-top">
              <span className="momentum-name">{m.question}</span>
              <span className="momentum-metric">{pct >= 60 ? '+' : ''}{fmtVol(m.volume24hr || 0)}</span>
            </div>
            <div className="momentum-bar-track"><div className={`momentum-bar-fill${pct >= 60 ? ' high' : ''}`} style={{ width: `${pct}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

/* ── AI Chat Panel ─────────────────────────────────────────── */
interface ChatMessage { role: 'user' | 'ai'; text: string; }

function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Ask me anything about current Polymarket flow — market prices, volume, what\'s moving, or trading ideas.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || 'No response.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Try again.' }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <span className="chat-msg-role">{m.role === 'ai' ? 'AI' : 'YOU'}</span>
            <span className="chat-msg-text">{m.text}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-msg ai">
            <span className="chat-msg-role">AI</span>
            <span className="chat-msg-text chat-typing"><span /><span /><span /></span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-wrap">
        <input
          className="chat-input"
          placeholder="Ask about markets…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          maxLength={300}
        />
        <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>→</button>
      </div>
    </div>
  );
}

/* ── Smart Wallets ─────────────────────────────────────────── */
function WalletTracker({ events }: { events: FlowEvent[] }) {
  const wallets = events.filter(e => e.type === 'large_trade' && e.walletAddress);
  if (wallets.length === 0) return <div className="state-empty"><span>No wallet data yet</span></div>;
  return (
    <div className="wallet-list">
      {wallets.slice(0, 8).map(e => (
        <a key={e.id} className="wallet-row" href={`https://polygonscan.com/address/${e.walletAddress}`} target="_blank" rel="noopener noreferrer">
          <span className="wallet-address">{e.walletAddress!.slice(0, 6)}…{e.walletAddress!.slice(-4)}</span>
          <span className="wallet-market">{e.market.slice(0, 24)}</span>
          <span className={`wallet-amount ${e.side.toLowerCase()}`}>{e.side} ${e.magnitude >= 1000 ? (e.magnitude / 1000).toFixed(1) + 'k' : e.magnitude.toFixed(0)}</span>
        </a>
      ))}
    </div>
  );
}

/* ── Main Terminal ─────────────────────────────────────────── */
export default function TerminalPage() {
  const [events, setEvents] = useState<FlowEvent[]>([]);
  const [markets, setMarkets] = useState<MarketWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState<MarketWithScore | null>(null);
  const seenIds = useRef(new Set<string>());

  /* markets */
  const loadMarkets = useCallback((filter: string) => {
    const tag = filter === 'all' ? '' : `&tag=${filter}`;
    fetch(`/api/markets?limit=30${tag}`).then(r => r.ok ? r.json() : []).then(d => Array.isArray(d) && setMarkets(d)).catch(() => {});
  }, []);
  useEffect(() => { loadMarkets(activeFilter); const t = setInterval(() => loadMarkets(activeFilter), 30_000); return () => clearInterval(t); }, [activeFilter, loadMarkets]);

  /* flow polling */
  const pollFlow = useCallback(() => {
    fetch('/api/flow').then(r => r.ok ? r.json() : null).then(data => {
      if (!data) return;
      setLoading(false);
      const incoming: FlowEvent[] = data.events || [];
      const fresh = incoming.filter(ev => !seenIds.current.has(ev.id));
      if (fresh.length === 0) return;
      fresh.forEach(ev => seenIds.current.add(ev.id));
      setEvents(prev => [...fresh, ...prev].slice(0, 50));
    }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { pollFlow(); const t = setInterval(pollFlow, 4_000); return () => clearInterval(t); }, [pollFlow]);

  return (
    <>
      <style>{`
        .chat-panel {
          display: flex; flex-direction: column; height: 100%;
          overflow: hidden;
        }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 10px 12px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        .chat-msg {
          display: flex; flex-direction: column; gap: 3px;
        }
        .chat-msg-role {
          font-size: 8px; letter-spacing: 0.1em;
          font-family: var(--font-mono); color: var(--text-muted);
        }
        .chat-msg.ai .chat-msg-role { color: var(--accent-blue); }
        .chat-msg.user .chat-msg-role { color: var(--accent-yellow); }
        .chat-msg-text {
          font-size: 11px; color: var(--text-muted); line-height: 1.6;
          white-space: pre-wrap;
        }
        .chat-msg.user .chat-msg-text { color: var(--text-primary); }
        .chat-typing span {
          display: inline-block; width: 4px; height: 4px; border-radius: 50%;
          background: var(--accent-blue); margin: 0 1px;
          animation: typingDot 1.2s ease-in-out infinite;
        }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        .chat-input-wrap {
          display: flex; gap: 6px; padding: 10px 12px;
          border-top: 1px solid var(--border);
          background: var(--bg-panel);
        }
        .chat-input {
          flex: 1; background: var(--bg-base); border: 1px solid var(--border);
          color: var(--text-primary); font-size: 11px; padding: 6px 10px;
          border-radius: 2px; outline: none; font-family: var(--font-sans);
          transition: border-color 150ms;
        }
        .chat-input:focus { border-color: var(--accent-blue); }
        .chat-input::placeholder { color: var(--text-muted); }
        .chat-send {
          background: var(--accent-yellow); color: var(--bg-base);
          border: none; padding: 6px 12px; font-size: 12px; font-weight: 700;
          border-radius: 2px; cursor: pointer; transition: background 120ms;
        }
        .chat-send:hover:not(:disabled) { background: #ffd44e; }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
      <div className="terminal-shell">
        <Topbar eventCount={events.length} marketCount={markets.length} />
        <div className="flow-river-line" />
        <div className="terminal-body">
          <div className="panel-left">
            <NavPanel active={activeFilter} onFilter={f => setActiveFilter(f)} />
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
            <div className="right-insight" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="panel-header">
                <span className="panel-header-label">AI Chat</span>
                <span style={{ fontSize: 9, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>GEMINI</span>
              </div>
              <AIChatPanel />
            </div>
            <div className="right-wallets">
              <div className="panel-header"><span className="panel-header-label">Smart Wallets</span></div>
              <div className="panel-section"><WalletTracker events={events} /></div>
            </div>
          </div>
        </div>
        {selectedMarket && <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />}
      </div>
    </>
  );
}
