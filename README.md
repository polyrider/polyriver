# PolyRiver

**Real-time flow intelligence terminal for Polymarket.**

PolyRiver transforms raw prediction market data into live, actionable signals — built for traders who want to see where capital is moving before others do.

---

## Features

- **Live Flow Feed** — real-time stream of large trades, volume spikes, and momentum events
- **Market Momentum Panel** — top markets ranked by flow score and volume acceleration
- **AI Flow Insight** — Gemini-powered 1–2 sentence market intelligence, refreshed every 30s
- **Smart Wallet Tracker** — surfaces high-value trades and wallet activity
- **Market Detail** — YES/NO prices, orderbook snapshot, and direct link to trade on Polymarket

---

## Stack

- **Next.js 14** (App Router)
- **Polymarket CLOB API** — live orderbook and trade data
- **Polymarket Gamma API** — market discovery and metadata
- **Google Gemini API** — AI insight generation
- **Vanilla CSS** — dark terminal design system

---

## Setup

```bash
npm install
```

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLOB_HOST=https://clob.polymarket.com
NEXT_PUBLIC_GAMMA_API=https://gamma-api.polymarket.com
LARGE_TRADE_THRESHOLD=500
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `GEMINI_API_KEY` in Vercel environment variables.

---

Built on [Polymarket Builder Program](https://docs.polymarket.com/builders/overview).
