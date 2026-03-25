import { NextRequest, NextResponse } from 'next/server';
import { fetchActiveMarkets } from '@/lib/clob';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('No API key');
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Please send a message.' });
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

    const reply = await callGemini(prompt);

    if (!reply) {
      return NextResponse.json({ reply: 'No response from AI. Try again.' });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err) {
    console.error('[/api/chat]', err);
    return NextResponse.json({
      reply: `AI temporarily unavailable. Error: ${err instanceof Error ? err.message.slice(0, 80) : 'unknown'}`,
    });
  }
}
