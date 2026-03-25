
<h1 align="center">🌊 POLYRIVER</h1>
<h3 align="center">Real-Time Flow Intelligence Terminal for Polymarket</h3>

<p align="center">
  <a href="https://polyriver.vercel.app/terminal"><img src="https://img.shields.io/badge/status-open%20beta-ffc300?style=for-the-badge&labelColor=0a0c12" alt="Open Beta" /></a>
  <a href="https://x.com/polyriver_app"><img src="https://img.shields.io/badge/follow-%40polyriver__app-1DA1F2?style=for-the-badge&logo=x&labelColor=0a0c12" alt="X" /></a>
  <img src="https://img.shields.io/badge/built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js&labelColor=0a0c12" alt="Next.js" />
  <img src="https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google&labelColor=0a0c12" alt="Gemini" />
</p>

---

## What is PolyRiver?

**PolyRiver** is a real-time flow intelligence terminal built for [Polymarket](https://polymarket.com) — the world's largest prediction market platform.

Most traders react. **PolyRiver helps you get ahead.**

We aggregate live market signals — volume spikes, price momentum, and smart money positioning — into a single, high-density terminal designed for serious participants. Paired with a Gemini-powered AI analyst, PolyRiver lets you ask questions directly about what's happening in the market right now and get grounded, data-driven answers in seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Live Flow Feed** | Real-time signal stream — volume spikes, large flow events, and price momentum across all active markets |
| 📈 **Market Momentum Panel** | Markets ranked by flow score, volume-to-liquidity ratio, and 24h acceleration |
| 🧠 **AI Chat (Gemini)** | Ask anything about current market conditions — the AI is grounded in live price and volume data |
| 🔗 **Market Detail View** | Inline orderbook, YES/NO prices, and direct link to trade on Polymarket |
| 👛 **Smart Wallets** *(coming soon)* | On-chain whale tracking — see exactly which wallets are moving capital and where |
| 🌐 **Multi-category Filters** | Filter flow by Politics, Crypto, Macro, or view all markets simultaneously |

---

## 🏗️ Architecture

```
PolyRiver
├── app/
│   ├── page.tsx              # Landing page w/ river animations
│   ├── about/page.tsx        # How the terminal works
│   ├── terminal/page.tsx     # Core trading terminal (client)
│   └── api/
│       ├── flow/             # Stateless signal engine (Gamma API)
│       ├── markets/          # Active market rankings
│       ├── chat/             # Gemini AI chat endpoint
│       ├── insight/          # Auto market intelligence
│       └── orderbook/        # CLOB orderbook relay
├── lib/
│   ├── clob.ts               # Polymarket Gamma + CLOB API client
│   ├── flow-engine.ts        # Signal processing logic
│   ├── gemini.ts             # Google Gemini integration
│   └── types.ts              # Shared TypeScript types
```

**Stack:** Next.js 15 (App Router) · TypeScript · Google Gemini · Vercel Serverless · Polymarket Gamma API

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com) API key

### Installation

```bash
git clone https://github.com/umbrellaagent/polyriver.git
cd polyriver
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLOB_HOST=https://clob.polymarket.com
NEXT_PUBLIC_GAMMA_API=https://gamma-api.polymarket.com
LARGE_TRADE_THRESHOLD=50
```

### Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🗺️ Roadmap

### ✅ v0.1 — Open Beta (Current)
- [x] Live Flow Feed (Volume spikes, momentum, large flow signals)
- [x] Market Momentum ranking panel
- [x] AI Chat powered by Gemini with live market context
- [x] Market detail view with orderbook and Polymarket trade link
- [x] Landing page with river animations
- [x] About / How It Works page
- [x] Multi-category market filters

### 🔄 v0.2 — Smart Wallets *(In Development)*
- [ ] On-chain wallet tracker via Polygonscan
- [ ] Whale address profiling (win rate, avg position size, market preference)
- [ ] Wallet watchlist — follow specific addresses
- [ ] Alert system when a tracked wallet takes a new position

### 🔮 v0.3 — Flow Intelligence Pro
- [ ] Historical flow replay — rewind and analyze past market events
- [ ] Custom signal alerts (push / Telegram)
- [ ] Multi-market correlation heatmap
- [ ] Order flow imbalance scoring
- [ ] API access for quantitative traders

### 🌊 v1.0 — Full Platform
- [ ] In-terminal gasless trade execution (via builder-relayer)
- [ ] Portfolio tracker — track your own Polymarket positions
- [ ] AI-assisted position sizing recommendations
- [ ] Token-gated premium features
- [ ] Mobile-optimized terminal view

---

## 🤝 Contributing

PolyRiver is currently in **open beta**. We welcome feedback, bug reports, and ideas.

- 🐛 **Issues:** Open a GitHub issue
- 💬 **Community:** [@polyriver_app](https://x.com/polyriver_app) on X
- 📩 **Contact:** DM on X

---

## ⚠️ Disclaimer

PolyRiver is a market intelligence tool only. Nothing displayed in the terminal constitutes financial advice. Always do your own research before trading on any prediction market platform.

---

<p align="center">
  Built with 🌊 by the PolyRiver team &nbsp;·&nbsp;
  <a href="https://x.com/polyriver_app">@polyriver_app</a> &nbsp;·&nbsp;
  <a href="https://polyriver.vercel.app/terminal">Launch Terminal →</a>
</p>
