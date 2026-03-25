import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About – PolyRiver',
  description: 'Learn how PolyRiver works — a real-time flow intelligence terminal for Polymarket traders.',
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        .about-root {
          min-height: 100vh;
          background: #0B0F14;
          color: #E8ECF0;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Nav */
        .about-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid #1E2835;
          position: sticky;
          top: 0;
          background: rgba(11,15,20,0.92);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .about-logo {
          display: flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .about-logo-name {
          font-size: 14px; font-weight: 700; color: #E8ECF0;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .about-nav-links {
          display: flex; align-items: center; gap: 20px;
        }
        .about-nav-link {
          font-size: 12px; color: #5A6478; text-decoration: none;
          transition: color 120ms ease; font-weight: 500;
        }
        .about-nav-link:hover { color: #E8ECF0; }
        .about-nav-cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; background: #F5C542; color: #0B0F14;
          font-size: 12px; font-weight: 700; text-decoration: none;
          border-radius: 3px; letter-spacing: 0.04em;
          transition: background 120ms;
        }
        .about-nav-cta:hover { background: #ffd44e; }

        /* Hero */
        .about-hero {
          text-align: center;
          padding: 80px 24px 64px;
          max-width: 680px;
          margin: 0 auto;
        }
        .about-eyebrow {
          display: inline-block;
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #F5C542;
          border: 1px solid rgba(245,197,66,0.2);
          background: rgba(245,197,66,0.06);
          padding: 4px 12px; border-radius: 2px; margin-bottom: 24px;
        }
        .about-title {
          font-size: clamp(28px, 5vw, 48px); font-weight: 700;
          letter-spacing: -0.02em; line-height: 1.15;
          color: #E8ECF0; margin-bottom: 16px;
        }
        .about-title span { color: #F5C542; }
        .about-sub {
          font-size: 15px; color: #5A6478; line-height: 1.7;
        }

        /* Flow diagram */
        .flow-diagram {
          max-width: 900px; margin: 0 auto 80px;
          padding: 0 24px;
        }
        .flow-diagram-inner {
          display: flex; align-items: center; justify-content: center;
          gap: 0; flex-wrap: wrap;
        }
        .flow-step {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 20px 16px;
          background: #111820; border: 1px solid #1E2835;
          width: 140px; border-radius: 4px;
          transition: border-color 200ms, background 200ms;
        }
        .flow-step:hover { background: #161D28; border-color: rgba(245,197,66,0.2); }
        .flow-step-num {
          font-size: 9px; font-family: monospace; color: #F5C542;
          letter-spacing: 0.08em; margin-bottom: 8px;
        }
        .flow-step-icon { font-size: 20px; margin-bottom: 8px; color: #3A7BD5; }
        .flow-step-name { font-size: 11px; font-weight: 600; color: #E8ECF0; margin-bottom: 4px; }
        .flow-step-desc { font-size: 10px; color: #3A4A5A; line-height: 1.5; }
        .flow-arrow {
          font-size: 14px; color: #1E2835; padding: 0 4px; flex-shrink: 0;
        }

        /* Section */
        .about-section {
          max-width: 960px; margin: 0 auto 80px;
          padding: 0 24px;
        }
        .section-eyebrow {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #3A4A5A; margin-bottom: 10px;
        }
        .section-title {
          font-size: 26px; font-weight: 700; color: #E8ECF0;
          letter-spacing: -0.02em; margin-bottom: 40px; line-height: 1.3;
        }
        .section-title span { color: #F5C542; }

        /* Feature blocks */
        .feature-blocks {
          display: flex; flex-direction: column; gap: 1px;
          background: #1E2835; border: 1px solid #1E2835; border-radius: 4px;
          overflow: hidden;
        }
        .feature-block {
          display: grid; grid-template-columns: 280px 1fr;
          background: #111820;
          transition: background 150ms;
        }
        .feature-block:hover { background: #131C26; }
        .feature-block-left {
          padding: 32px 28px;
          border-right: 1px solid #1E2835;
          display: flex; flex-direction: column; justify-content: center;
        }
        .feature-block-num {
          font-size: 9px; font-family: monospace; color: #3A4A5A;
          letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .feature-block-icon {
          font-size: 24px; margin-bottom: 12px;
        }
        .feature-block-name {
          font-size: 16px; font-weight: 700; color: #E8ECF0; margin-bottom: 6px;
        }
        .feature-block-tag {
          display: inline-block; font-size: 9px; font-family: monospace;
          padding: 2px 6px; border-radius: 2px; letter-spacing: 0.06em;
        }
        .feature-block-tag.yellow { color: #F5C542; background: rgba(245,197,66,0.08); border: 1px solid rgba(245,197,66,0.15); }
        .feature-block-tag.blue { color: #3A7BD5; background: rgba(58,123,213,0.1); border: 1px solid rgba(58,123,213,0.2); }
        .feature-block-tag.green { color: #4CAF6F; background: rgba(76,175,111,0.1); border: 1px solid rgba(76,175,111,0.2); }

        .feature-block-right {
          padding: 32px 32px;
          display: flex; flex-direction: column; justify-content: center; gap: 14px;
        }
        .feature-block-desc {
          font-size: 13px; color: #5A6478; line-height: 1.7;
        }
        .feature-block-details {
          display: flex; flex-direction: column; gap: 8px;
        }
        .feature-block-detail {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 12px; color: #3A4A5A; line-height: 1.5;
        }
        .fbd-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #F5C542; flex-shrink: 0; margin-top: 6px;
        }
        .fbd-dot.blue { background: #3A7BD5; }
        .fbd-dot.green { background: #4CAF6F; }

        /* Mock terminal panel strip */
        .panel-strip {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #1E2835;
          border: 1px solid #1E2835; border-radius: 4px; overflow: hidden;
          margin-bottom: 80px; max-width: 960px; margin-left: auto; margin-right: auto;
        }
        .panel-strip-item {
          background: #111820; padding: 24px;
        }
        .psi-label {
          font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em;
          color: #3A4A5A; margin-bottom: 12px;
        }
        .psi-bar {
          height: 1px; background: linear-gradient(90deg, #F5C542, #3A7BD5, transparent);
          margin-bottom: 12px; opacity: 0.3;
        }
        .psi-line {
          height: 8px; border-radius: 1px; background: #1E2835;
          margin-bottom: 6px;
        }
        .psi-line.w80 { width: 80%; }
        .psi-line.w60 { width: 60%; }
        .psi-line.w90 { width: 90%; }
        .psi-line.w40 { width: 40%; }
        .psi-line.accent { background: rgba(245,197,66,0.15); }
        .psi-line.blue { background: rgba(58,123,213,0.15); }

        /* Signal types */
        .signal-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
          margin-bottom: 80px; max-width: 960px; margin-left: auto; margin-right: auto;
          padding: 0 24px;
        }
        .signal-card {
          background: #111820; border: 1px solid #1E2835;
          border-radius: 4px; padding: 20px;
          transition: border-color 200ms;
        }
        .signal-card:hover { border-color: #2E3A4A; }
        .signal-indicator {
          width: 3px; height: 32px; border-radius: 1px;
          margin-bottom: 14px;
        }
        .signal-indicator.yellow { background: #F5C542; }
        .signal-indicator.blue   { background: #3A7BD5; }
        .signal-indicator.green  { background: #4CAF6F; }
        .signal-name { font-size: 13px; font-weight: 600; color: #E8ECF0; margin-bottom: 6px; }
        .signal-rule {
          font-size: 10px; font-family: monospace; color: #F5C542;
          background: rgba(245,197,66,0.06); padding: 4px 8px;
          border-radius: 2px; margin-bottom: 8px; display: inline-block;
        }
        .signal-desc { font-size: 11px; color: #3A4A5A; line-height: 1.6; }

        /* CTA */
        .about-cta {
          text-align: center; padding: 80px 24px 100px;
          border-top: 1px solid #1E2835;
        }
        .about-cta-title {
          font-size: 28px; font-weight: 700; color: #E8ECF0;
          letter-spacing: -0.02em; margin-bottom: 10px;
        }
        .about-cta-sub { font-size: 13px; color: #3A4A5A; margin-bottom: 28px; }
        .about-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; background: #F5C542; color: #0B0F14;
          font-size: 13px; font-weight: 700; text-decoration: none;
          border-radius: 3px; transition: background 120ms;
        }
        .about-cta-btn:hover { background: #ffd44e; }

        /* Footer */
        .about-footer {
          padding: 24px 40px; border-top: 1px solid #1E2835;
          display: flex; align-items: center; justify-content: space-between;
        }
        .about-footer-copy { font-size: 11px; color: #3A4A5A; }
        .about-footer-link {
          font-size: 11px; color: #3A4A5A; text-decoration: none;
          transition: color 120ms;
        }
        .about-footer-link:hover { color: #8A96A8; }

        @media (max-width: 768px) {
          .feature-block { grid-template-columns: 1fr; }
          .feature-block-left { border-right: none; border-bottom: 1px solid #1E2835; }
          .signal-grid { grid-template-columns: 1fr; }
          .flow-diagram-inner { gap: 4px; }
          .flow-arrow { display: none; }
        }
      `}</style>

      <div className="about-root">
        {/* Nav */}
        <nav className="about-nav">
          <a href="/" className="about-logo">
            <Image src="/logo.png" alt="PolyRiver" width={28} height={28} style={{ borderRadius: 4 }} />
            <span className="about-logo-name">PolyRiver</span>
          </a>
          <div className="about-nav-links">
            <a href="https://x.com/polyriver_app" target="_blank" rel="noopener noreferrer" className="about-nav-link">X (Twitter)</a>
            <Link href="/" className="about-nav-link">Home</Link>
            <Link href="/terminal" className="about-nav-cta">Open Terminal →</Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="about-hero">
          <div className="about-eyebrow">How it works</div>
          <h1 className="about-title">A terminal built around <span>signal clarity</span></h1>
          <p className="about-sub">
            PolyRiver monitors Polymarket in real time, extracts capital flow signals, and surfaces them in a structured, low-noise interface designed for fast decision-making.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="flow-diagram">
          <div className="flow-diagram-inner">
            {[
              { num:'01', icon:'◎', name:'Market Data', desc:'Polymarket CLOB + Gamma API' },
              { num:'02', icon:'⟳', name:'Flow Engine', desc:'Detects trades, spikes, momentum' },
              { num:'03', icon:'◈', name:'Signal Stream', desc:'SSE real-time event push' },
              { num:'04', icon:'△', name:'AI Layer', desc:'Gemini synthesizes insights' },
              { num:'05', icon:'▣', name:'Terminal', desc:'Structured, actionable display' },
            ].map((s, i) => (
              <>
                <div key={s.num} className="flow-step">
                  <span className="flow-step-num">{s.num}</span>
                  <span className="flow-step-icon">{s.icon}</span>
                  <span className="flow-step-name">{s.name}</span>
                  <span className="flow-step-desc">{s.desc}</span>
                </div>
                {i < 4 && <span key={`arrow-${i}`} className="flow-arrow">→</span>}
              </>
            ))}
          </div>
        </div>

        {/* Terminal panels breakdown */}
        <div className="about-section">
          <p className="section-eyebrow">Interface breakdown</p>
          <h2 className="section-title">Three panels. <span>One clear picture.</span></h2>

          <div className="feature-blocks">
            {/* Live Flow Feed */}
            <div className="feature-block">
              <div className="feature-block-left">
                <span className="feature-block-num">PANEL 01 / CENTER</span>
                <span className="feature-block-icon">⟳</span>
                <span className="feature-block-name">Live Flow Feed</span>
                <span className="feature-block-tag yellow">PRIMARY</span>
              </div>
              <div className="feature-block-right">
                <p className="feature-block-desc">
                  The core of the terminal. A continuously updating stream of structured events — every large trade, volume spike, and momentum shift appears here as it happens.
                </p>
                <div className="feature-block-details">
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>New events slide in from the top with a smooth fade animation</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>Color-coded left border: yellow = large trade, blue = volume spike, green = momentum</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>Older events gradually dim to reduce visual noise</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>Updates every 2 seconds via Server-Sent Events — no page refresh needed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Momentum */}
            <div className="feature-block">
              <div className="feature-block-left">
                <span className="feature-block-num">PANEL 02 / RIGHT TOP</span>
                <span className="feature-block-icon">◈</span>
                <span className="feature-block-name">Market Momentum</span>
                <span className="feature-block-tag blue">RANKED</span>
              </div>
              <div className="feature-block-right">
                <p className="feature-block-desc">
                  The top 10 markets sorted by flow score — a composite metric derived from 24-hour volume and liquidity depth. High-score markets glow yellow to signal intensity.
                </p>
                <div className="feature-block-details">
                  <div className="feature-block-detail">
                    <span className="fbd-dot blue" /><span>Flow score = volume acceleration relative to liquidity</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot blue" /><span>Horizontal intensity bar shows relative ranking at a glance</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot blue" /><span>Click any market to open the detail panel with live orderbook and Polymarket trade link</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="feature-block">
              <div className="feature-block-left">
                <span className="feature-block-num">PANEL 03 / RIGHT MID</span>
                <span className="feature-block-icon">△</span>
                <span className="feature-block-name">AI Flow Insight</span>
                <span className="feature-block-tag green">GEMINI</span>
              </div>
              <div className="feature-block-right">
                <p className="feature-block-desc">
                  A Gemini-powered intelligence layer that reads the current flow events and generates a 1–2 sentence summary every 30 seconds. It also flags unusual patterns when detected.
                </p>
                <div className="feature-block-details">
                  <div className="feature-block-detail">
                    <span className="fbd-dot green" /><span>Powered by Google Gemini 1.5 Flash for fast, precise summaries</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot green" /><span>Detects coordinated volume spikes, momentum concentration, and unusual wallet activity</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot green" /><span>Falls back to heuristic summaries if the API is unavailable — always shows something meaningful</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Wallets */}
            <div className="feature-block">
              <div className="feature-block-left">
                <span className="feature-block-num">PANEL 04 / RIGHT BOTTOM</span>
                <span className="feature-block-icon">⬡</span>
                <span className="feature-block-name">Smart Wallets</span>
                <span className="feature-block-tag yellow">ON-CHAIN</span>
              </div>
              <div className="feature-block-right">
                <p className="feature-block-desc">
                  Surfaces the wallet addresses behind large trades as they appear in the flow feed. Shows which wallets are moving significant capital and in which direction.
                </p>
                <div className="feature-block-details">
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>Only shows wallets from trades that exceed the large trade threshold</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>Click any wallet address to view full on-chain history on Polygonscan</span>
                  </div>
                  <div className="feature-block-detail">
                    <span className="fbd-dot" /><span>YES trades shown in green, NO trades in red — direction at a glance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signal types */}
        <div className="about-section">
          <p className="section-eyebrow">Signal Detection</p>
          <h2 className="section-title">Three signal types. <span>Configured automatically.</span></h2>
        </div>
        <div className="signal-grid">
          {[
            {
              cls: 'yellow', name: 'Large Trade',
              rule: 'trade value > $50',
              desc: 'A single order that exceeds the configured dollar threshold. Indicates a high-conviction participant entering a position.',
            },
            {
              cls: 'blue', name: 'Volume Spike',
              rule: 'current bucket > 3x avg',
              desc: 'Current 30-second volume window is significantly above the historical average for that token. Points to sudden crowd interest.',
            },
            {
              cls: 'green', name: 'Momentum',
              rule: 'price delta > 3¢ rapidly',
              desc: 'Rapid directional price movement above the velocity threshold. Often precedes larger moves as more traders pile in.',
            },
          ].map((s) => (
            <div key={s.name} className="signal-card">
              <div className={`signal-indicator ${s.cls}`} />
              <div className="signal-name">{s.name}</div>
              <div className="signal-rule">{s.rule}</div>
              <div className="signal-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="about-cta">
          <div className="about-cta-title">Ready to read the flow?</div>
          <div className="about-cta-sub">Open the terminal and see what&apos;s moving right now.</div>
          <Link href="/terminal" className="about-cta-btn">
            Launch Terminal →
          </Link>
        </div>

        {/* Footer */}
        <footer className="about-footer">
          <span className="about-footer-copy">© 2025 PolyRiver</span>
          <div style={{ display:'flex', gap:20 }}>
            <a href="https://x.com/polyriver_app" target="_blank" rel="noopener noreferrer" className="about-footer-link">X (Twitter)</a>
            <Link href="/" className="about-footer-link">Home</Link>
            <a href="https://docs.polymarket.com/builders/overview" target="_blank" rel="noopener noreferrer" className="about-footer-link">Built on Polymarket</a>
          </div>
        </footer>
      </div>
    </>
  );
}
