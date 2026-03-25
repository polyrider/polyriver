import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { fetchActiveMarkets } from '@/lib/clob';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Please send a message.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: 'AI not configured. Add GEMINI_API_KEY to Vercel environment variables.' });
    }

    // Build live market context
    const markets = await fetchActiveMarkets(15);
    const top = [...(markets || [])]
      .sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0))
      .slice(0, 8);

    const ctx = top.map(m => {
      const tokens = (m.tokens || []) as { outcome?: string; price?: number | string }[];
      const prices = tokens
        .map(t => `${t.outcome}: ${(parseFloat(String(t.price || '0')) * 100).toFixed(1)}¢`)
        .join(', ');
      const vol = m.volume24hr || 0;
      return `• ${m.question} — Vol: $${vol >= 1000 ? (vol / 1000).toFixed(1) + 'k' : vol.toFixed(0)} | ${prices}`;
    }).join('\n');

    const prompt = `You are a real-time Polymarket flow analyst inside the PolyRiver terminal.

LIVE MARKET DATA:
${ctx || 'No market data available'}

Answer the user's question concisely (2-4 sentences max). Be specific and reference real prices/volumes from the data above. If asked what's happening, summarize the top moving markets. Do not make up numbers.

User: ${message}
Answer:`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply: reply || 'No response.' });
  } catch (err) {
    console.error('[/api/chat]', err);
    const msg = err instanceof Error ? err.message.slice(0, 120) : 'unknown error';
    return NextResponse.json({ reply: `AI error: ${msg}` });
  }
}
