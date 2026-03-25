import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PolyRiver – Real-Time Flow Intelligence for Polymarket',
  description: 'See where capital is moving before others. PolyRiver is a real-time flow intelligence terminal for Polymarket traders.',
};

export default function LandingPage() {
  return (
    <>
      <style>{`
        .landing-root {
          min-height: 100vh;
          background: #0B0F14;
          color: #E8ECF0;
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Animated river canvas ── */
        .river-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .river-line {
          position: absolute;
          left: -20%;
          width: 140%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(58,123,213,0.15) 20%,
            rgba(245,197,66,0.25) 50%,
            rgba(58,123,213,0.15) 80%,
            transparent 100%
          );
          animation: riverDrift linear infinite;
        }

        .river-line:nth-child(1)  { top: 12%;  animation-duration: 18s; animation-delay: 0s; }
        .river-line:nth-child(2)  { top: 24%;  animation-duration: 22s; animation-delay: -4s; opacity: 0.6; }
        .river-line:nth-child(3)  { top: 36%;  animation-duration: 16s; animation-delay: -8s; }
        .river-line:nth-child(4)  { top: 50%;  animation-duration: 20s; animation-delay: -2s; opacity: 0.8; }
        .river-line:nth-child(5)  { top: 62%;  animation-duration: 24s; animation-delay: -6s; opacity: 0.5; }
        .river-line:nth-child(6)  { top: 74%;  animation-duration: 17s; animation-delay: -10s; }
        .river-line:nth-child(7)  { top: 86%;  animation-duration: 21s; animation-delay: -3s; opacity: 0.7; }

        @keyframes riverDrift {
          0%   { transform: translateX(-10%) scaleX(1);   opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateX(5%)  scaleX(1.05); }
          90%  { opacity: 1; }
          100% { transform: translateX(10%) scaleX(1);   opacity: 0; }
        }

        /* Glowing orbs */
        .river-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: orbFloat ease-in-out infinite;
        }

        .river-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(58,123,213,0.07) 0%, transparent 70%);
          top: -10%; left: -10%;
          animation-duration: 20s; animation-delay: 0s;
        }
        .river-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(245,197,66,0.06) 0%, transparent 70%);
          top: 40%; right: -5%;
          animation-duration: 25s; animation-delay: -8s;
        }
        .river-orb-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(58,123,213,0.05) 0%, transparent 70%);
          bottom: 0; left: 30%;
          animation-duration: 18s; animation-delay: -4s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* ── Nav ── */
        .landing-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid rgba(30,40,53,0.8);
          backdrop-filter: blur(8px);
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .landing-logo-mark {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #F5C542, #B88F28);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #0B0F14;
          letter-spacing: -0.5px;
        }

        .landing-logo-name {
          font-size: 15px;
          font-weight: 700;
          color: #E8ECF0;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .landing-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-launch-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          background: #F5C542;
          color: #0B0F14;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 3px;
          letter-spacing: 0.04em;
          transition: background 120ms ease, transform 80ms ease;
        }
        .nav-launch-btn:hover { background: #ffd44e; }
        .nav-launch-btn:active { transform: scale(0.98); }

        .nav-text-link {
          font-size: 12px; color: #5A6478; text-decoration: none;
          font-weight: 500; transition: color 120ms ease;
        }
        .nav-text-link:hover { color: #E8ECF0; }

        /* ── Hero ── */
        .landing-hero {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 100px 20px 80px;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #F5C542;
          border: 1px solid rgba(245,197,66,0.2);
          background: rgba(245,197,66,0.06);
          padding: 4px 12px;
          border-radius: 2px;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease forwards;
        }

        .hero-eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #F5C542;
          animation: pulseDot 2s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.6); }
        }

        .hero-headline {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          line-height: 1.12;
          color: #E8ECF0;
          margin-bottom: 20px;
          animation: fadeUp 0.6s ease 0.1s both;
          letter-spacing: -0.02em;
        }

        .hero-headline-accent {
          color: #F5C542;
          position: relative;
        }

        .hero-sub {
          font-size: 16px;
          color: #5A6478;
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 40px;
          animation: fadeUp 0.6s ease 0.2s both;
          font-weight: 400;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fadeUp 0.6s ease 0.3s both;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: #F5C542;
          color: #0B0F14;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 3px;
          letter-spacing: 0.02em;
          transition: background 120ms ease, transform 80ms ease, box-shadow 200ms ease;
          box-shadow: 0 0 0 0 rgba(245,197,66,0);
        }
        .hero-cta:hover {
          background: #ffd44e;
          box-shadow: 0 0 24px 4px rgba(245,197,66,0.15);
        }
        .hero-cta:active { transform: scale(0.98); }

        .hero-cta-arrow {
          font-size: 16px;
          transition: transform 150ms ease;
        }
        .hero-cta:hover .hero-cta-arrow { transform: translateX(3px); }

        .hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 13px 20px;
          color: #5A6478;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          border: 1px solid #1E2835;
          border-radius: 3px;
          transition: color 120ms ease, border-color 120ms ease;
        }
        .hero-secondary:hover { color: #E8ECF0; border-color: #2E3A4A; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Terminal Preview ── */
        .terminal-preview-wrap {
          position: relative;
          z-index: 10;
          max-width: 1000px;
          margin: 0 auto 80px;
          padding: 0 24px;
          animation: fadeUp 0.6s ease 0.4s both;
        }

        .terminal-preview {
          background: #111820;
          border: 1px solid #1E2835;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,66,0.04);
        }

        .terminal-preview-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: #0D1219;
          border-bottom: 1px solid #1E2835;
        }

        .terminal-preview-dots {
          display: flex; gap: 5px;
        }
        .tp-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .tp-dot-r { background: #3A3A3A; }
        .tp-dot-y { background: #3A3A3A; }
        .tp-dot-g { background: #3A3A3A; }

        .terminal-preview-title {
          font-size: 10px;
          color: #3A4A5A;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.06em;
        }

        .terminal-preview-live {
          display: flex; align-items: center; gap: 4px;
          font-size: 9px; color: #4CAF6F; font-weight: 600; letter-spacing: 0.08em;
        }
        .tp-live-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #4CAF6F;
          animation: pulseDot 2s ease-in-out infinite;
        }

        .terminal-preview-body {
          display: grid;
          grid-template-columns: 60px 1fr 280px;
          min-height: 280px;
          font-size: 11px;
        }

        .tp-left {
          border-right: 1px solid #1E2835;
          padding: 12px 0;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }

        .tp-logo { font-size: 10px; font-weight: 700; color: #F5C542; letter-spacing: 0.08em; }

        .tp-filter {
          display: flex; flex-direction: column; align-items: center;
          font-size: 9px; color: #3A4A5A; gap: 2px; cursor: default;
        }
        .tp-filter.active { color: #F5C542; }
        .tp-filter-icon { font-size: 12px; }

        .tp-center {
          padding: 0;
          overflow: hidden;
        }

        .tp-center-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 14px;
          border-bottom: 1px solid #1E2835;
          font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #3A4A5A;
        }
        .tp-badge { color: #F5C542; }

        .tp-event {
          display: grid;
          grid-template-columns: 3px 1fr auto;
          gap: 0 10px;
          padding: 8px 14px 8px 0;
          border-bottom: 1px solid rgba(30,40,53,0.5);
          align-items: start;
          animation: fadeSlideIn 300ms ease forwards;
        }

        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(-4px); }
          to { opacity:1; transform:translateY(0); }
        }

        .tp-bar { width: 3px; align-self: stretch; min-height: 28px; }
        .tp-bar.y { background: #F5C542; }
        .tp-bar.b { background: #3A7BD5; }
        .tp-bar.g { background: #4CAF6F; }

        .tp-event-market { font-size: 11px; font-weight: 500; color: #E8ECF0; }
        .tp-event-desc { font-size: 10px; color: #5A6478; margin-top: 1px; }
        .tp-event-badge {
          font-size: 9px; font-family: monospace; padding: 1px 4px; border-radius: 1px; margin-top: 2px; display: inline-block;
        }
        .tp-event-badge.y { color: #F5C542; background: rgba(245,197,66,0.08); }
        .tp-event-badge.b { color: #3A7BD5; background: rgba(58,123,213,0.1); }
        .tp-event-badge.g { color: #4CAF6F; background: rgba(76,175,111,0.1); }
        .tp-event-time { font-size: 10px; color: #3A4A5A; font-family: monospace; padding-right: 14px; }

        .tp-right {
          border-left: 1px solid #1E2835;
          display: flex; flex-direction: column;
        }

        .tp-right-section { border-bottom: 1px solid #1E2835; }
        .tp-right-header {
          padding: 8px 14px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #3A4A5A;
          border-bottom: 1px solid #1E2835;
        }
        .tp-momentum-item {
          padding: 6px 14px; display: flex; flex-direction: column; gap: 3px;
          border-bottom: 1px solid rgba(30,40,53,0.5);
        }
        .tp-momentum-row { display: flex; justify-content: space-between; }
        .tp-momentum-name { font-size: 10px; color: #8A96A8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 180px; }
        .tp-momentum-val { font-size: 10px; color: #F5C542; font-family: monospace; flex-shrink: 0; }
        .tp-bar-track { height: 2px; background: #161D28; border-radius: 1px; }
        .tp-bar-fill { height: 100%; border-radius: 1px; background: linear-gradient(90deg, #1F4A8A, #3A7BD5); }
        .tp-bar-fill.hi { background: linear-gradient(90deg, #B88F28, #F5C542); }

        .tp-insight { padding: 10px 14px; font-size: 10px; color: #5A6478; line-height: 1.6; }
        .tp-insight strong { color: #8A96A8; font-weight: 400; }

        /* ── Stats bar ── */
        .stats-bar {
          position: relative; z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          padding: 40px 24px;
          border-top: 1px solid #1E2835;
          border-bottom: 1px solid #1E2835;
          background: rgba(17,24,32,0.5);
          margin-bottom: 80px;
          backdrop-filter: blur(4px);
        }

        .stat-item { text-align: center; }
        .stat-value {
          font-size: 28px; font-weight: 700; color: #E8ECF0;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: -0.02em;
        }
        .stat-value span { color: #F5C542; }
        .stat-label { font-size: 10px; color: #3A4A5A; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }

        /* ── Features ── */
        .features-section {
          position: relative; z-index: 10;
          max-width: 960px; margin: 0 auto 80px;
          padding: 0 24px;
        }

        .section-label {
          text-align: center;
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: #3A4A5A; margin-bottom: 12px;
        }

        .section-title {
          text-align: center;
          font-size: 28px; font-weight: 700; color: #E8ECF0; margin-bottom: 48px;
          letter-spacing: -0.02em; line-height: 1.3;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #1E2835;
          border: 1px solid #1E2835;
          border-radius: 4px;
          overflow: hidden;
        }

        .feature-card {
          background: #111820;
          padding: 24px;
          transition: background 150ms ease;
        }
        .feature-card:hover { background: #161D28; }

        .feature-icon {
          width: 32px; height: 32px;
          background: rgba(245,197,66,0.08);
          border: 1px solid rgba(245,197,66,0.15);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; margin-bottom: 14px; color: #F5C542;
        }

        .feature-name {
          font-size: 13px; font-weight: 600; color: #E8ECF0; margin-bottom: 6px;
        }

        .feature-desc {
          font-size: 11px; color: #3A4A5A; line-height: 1.6;
        }

        /* ── CTA bottom ── */
        .cta-section {
          position: relative; z-index: 10;
          text-align: center;
          padding: 80px 24px 100px;
          border-top: 1px solid #1E2835;
        }

        .cta-title {
          font-size: 32px; font-weight: 700; color: #E8ECF0; margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .cta-sub {
          font-size: 14px; color: #3A4A5A; margin-bottom: 32px;
        }

        /* ── Footer ── */
        .landing-footer {
          position: relative; z-index: 10;
          padding: 24px 40px;
          border-top: 1px solid #1E2835;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-copy {
          font-size: 11px; color: #3A4A5A;
        }
        .footer-poly {
          font-size: 11px; color: #3A4A5A; text-decoration: none;
          transition: color 120ms ease;
        }
        .footer-poly:hover { color: #8A96A8; }
      `}</style>

      <div className="landing-root">
        {/* Animated background */}
        <div className="river-bg">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="river-line" />)}
          <div className="river-orb river-orb-1" />
          <div className="river-orb river-orb-2" />
          <div className="river-orb river-orb-3" />
        </div>

        {/* Nav */}
        <nav className="landing-nav">
          <a href="/" className="landing-logo">
            <span className="landing-logo-name">POLYRIVER</span>
          </a>
          <div className="landing-nav-right" style={{ display:'flex', alignItems:'center', gap:16 }}>
            <Link href="/about" className="nav-text-link">About</Link>
            <a href="https://x.com/polyriver_app" target="_blank" rel="noopener noreferrer" className="nav-text-link">X (Twitter)</a>
            <Link href="/terminal" className="nav-launch-btn">Open Terminal →</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="landing-hero">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Live on Polymarket
          </div>
          <h1 className="hero-headline">
            See where capital<br />
            flows <span className="hero-headline-accent">before others</span>
          </h1>
          <p className="hero-sub">
            PolyRiver is a real-time flow intelligence terminal for Polymarket.
            Track large trades, volume spikes, and momentum signals as they happen.
          </p>
          <div className="hero-actions">
            <Link href="/terminal" className="hero-cta">
              Launch Terminal
              <span className="hero-cta-arrow">→</span>
            </Link>
            <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="hero-secondary">
              Built on Polymarket
            </a>
          </div>
        </section>

        {/* Terminal preview mockup */}
        <div className="terminal-preview-wrap">
          <div className="terminal-preview">
            <div className="terminal-preview-bar">
              <div className="terminal-preview-dots">
                <div className="tp-dot tp-dot-r" />
                <div className="tp-dot tp-dot-y" />
                <div className="tp-dot tp-dot-g" />
              </div>
              <span className="terminal-preview-title">polyriver — flow intelligence</span>
              <div className="terminal-preview-live"><div className="tp-live-dot" />LIVE</div>
            </div>
            <div className="terminal-preview-body">
              {/* Left */}
              <div className="tp-left">
                <span className="tp-logo">PR</span>
                {['◈','⬡','◎','△'].map((icon, i) => (
                  <div key={i} className={`tp-filter${i===0?' active':''}`}>
                    <span className="tp-filter-icon">{icon}</span>
                    <span>{['All','Pol','Crypto','Macro'][i]}</span>
                  </div>
                ))}
              </div>

              {/* Center feed */}
              <div className="tp-center">
                <div className="tp-center-header">
                  <span>Live Flow Feed</span>
                  <span className="tp-badge">12 events</span>
                </div>
                {[
                  { bar:'y', market:'Will Trump win the 2025 election?', desc:'YES $2.3k at 67.2¢', badge:'LARGE TRADE', badgeCls:'y', time:'now' },
                  { bar:'b', market:'Will BTC hit $100k by June?', desc:'Volume spike 4.2x above average', badge:'VOL SPIKE', badgeCls:'b', time:'12s' },
                  { bar:'g', market:'US Fed rate cut in Q2 2025?', desc:'Rapid YES price movement', badge:'MOMENTUM', badgeCls:'g', time:'28s' },
                  { bar:'y', market:'Will Macron resign in 2025?', desc:'YES $1.8k at 22.0¢', badge:'LARGE TRADE', badgeCls:'y', time:'41s' },
                ].map((e, i) => (
                  <div key={i} className="tp-event" style={{ opacity: 1 - i * 0.15 }}>
                    <div className={`tp-bar ${e.bar}`} />
                    <div>
                      <div className="tp-event-market">{e.market}</div>
                      <div className="tp-event-desc">{e.desc}</div>
                      <span className={`tp-event-badge ${e.badgeCls}`}>{e.badge}</span>
                    </div>
                    <span className="tp-event-time">{e.time}</span>
                  </div>
                ))}
              </div>

              {/* Right */}
              <div className="tp-right">
                <div className="tp-right-section">
                  <div className="tp-right-header">Market Momentum</div>
                  {[
                    { name:'Will Trump win the 2025 election?', val:'+$9.3M', pct:95, hi:true },
                    { name:'Will BTC hit $100k by June?', val:'+$4.1M', pct:70, hi:true },
                    { name:'US forces enter Iran by March 31?', val:'+$2.9M', pct:52, hi:false },
                  ].map((m, i) => (
                    <div key={i} className="tp-momentum-item">
                      <div className="tp-momentum-row">
                        <span className="tp-momentum-name">{m.name}</span>
                        <span className="tp-momentum-val">{m.val}</span>
                      </div>
                      <div className="tp-bar-track">
                        <div className={`tp-bar-fill${m.hi?' hi':''}`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tp-right-section">
                  <div className="tp-right-header">AI Flow Insight</div>
                  <div className="tp-insight">
                    <strong>Capital concentrating in political markets.</strong> Large YES flow on Trump and Iran events — momentum building across macro categories.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          {[
            { val: '<span>2</span>s', label: 'Signal latency' },
            { val: '30<span>+</span>', label: 'Markets tracked' },
            { val: '24<span>/7</span>', label: 'Live monitoring' },
            { val: 'AI<span>+</span>', label: 'Gemini insights' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value" dangerouslySetInnerHTML={{ __html: s.val }} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="features-section">
          <p className="section-label">Capabilities</p>
          <h2 className="section-title">Everything you need to read the flow</h2>
          <div className="features-grid">
            {[
              { icon: '⟳', name: 'Live Flow Feed', desc: 'Real-time stream of large trades, volume spikes, and momentum events — updated every 2 seconds.' },
              { icon: '◈', name: 'Market Momentum', desc: 'Top markets ranked by flow score and 24h volume acceleration. Click any market to inspect.' },
              { icon: '◎', name: 'AI Flow Insight', desc: 'Gemini-powered 1–2 sentence intelligence summaries that refresh every 30 seconds.' },
              { icon: '△', name: 'Smart Wallets', desc: 'Surfaces high-value trades and their on-chain wallet activity with direct Polygonscan links.' },
              { icon: '▣', name: 'Orderbook View', desc: 'Instant bid/ask snapshot for any market. Click to trade directly on Polymarket.' },
              { icon: '⬡', name: 'Category Filters', desc: 'Filter flow by Politics, Crypto, or Macro to focus on the sectors you care about.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="cta-section">
          <h2 className="cta-title">Start trading with clarity</h2>
          <p className="cta-sub">Real-time signals. No noise. Just flow.</p>
          <Link href="/terminal" className="hero-cta" style={{ display: 'inline-flex' }}>
            Open the Terminal
            <span className="hero-cta-arrow">→</span>
          </Link>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span className="footer-copy">© 2025 POLYRIVER</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <Link href="/about" className="footer-poly">About</Link>
            <a href="https://x.com/polyriver_app" target="_blank" rel="noopener noreferrer" className="footer-poly">X (Twitter)</a>
            <a href="https://docs.polymarket.com/builders/overview" target="_blank" rel="noopener noreferrer" className="footer-poly">Built on Polymarket</a>
          </div>
        </footer>
      </div>
    </>
  );
}
