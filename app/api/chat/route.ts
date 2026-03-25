import { NextRequest, NextResponse } from 'next/server';
import { fetchActiveMarkets } from '@/lib/clob';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'No message' }, { status: 400 });
    }

    // Fetch current market context
    const markets = await fetchActiveMarkets(15);
    const topMarkets = [...(markets || [])]
      .sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0))
      .slice(0, 8);

    const marketContext = topMarkets
      .map((m) => {
        const vol = m.volume24hr || 0;
        const liq = m.liquidity || 0;
        const tokens = (m.tokens || []) as { outcome?: string; price?: number | string }[];
        const prices = tokens
          .map((t) => `${t.outcome || '?'}: ${(parseFloat(String(t.price || '0')) * 100).toFixed(1)}¢`)
          .join(', ');
        return `• ${m.question} [Vol: $${vol >= 1000 ? (vol / 1000).toFixed(1) + 'k' : vol.toFixed(0)}, Liq: $${liq >= 1000 ? (liq / 1000).toFixed(1) + 'k' : liq.toFixed(0)}, ${prices}]`;
      })
      .join('\n');

    const systemPrompt = `You are a Polymarket flow intelligence analyst embedded in the PolyRiver terminal. 
You have access to real-time Polymarket market data.

Current top markets by volume:
${marketContext || 'Market data unavailable'}

Answer the user's question about Polymarket, prediction markets, or market flow.
Be concise, analytical, and grounded in the data above. If asked about a specific market, reference its price and volume. 
Do not make up prices. If something isn't in the data, say so.
Keep answers to 2-4 sentences max unless detail is explicitly requested.`;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        reply: `I can see ${topMarkets.length} active markets. The top market right now is "${topMarkets[0]?.question}" with $${((topMarkets[0]?.volume24hr || 0) / 1000).toFixed(1)}k in 24h volume. Connect a Gemini API key for full AI analysis.`,
      });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}\nAnswer:`);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[/api/chat]', err);
    return NextResponse.json({ reply: 'Unable to process your question right now. Please try again.' });
  }
}
