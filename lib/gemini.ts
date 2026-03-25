import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FlowEvent } from './types';

export interface InsightResult {
  summary: string;
  unusual: string | null;
  generatedAt: number;
}

export async function generateInsight(events: FlowEvent[]): Promise<InsightResult> {
  const now = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || events.length === 0) {
    return buildFallbackInsight(events);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const summary = events
      .slice(0, 12)
      .map(e => `[${e.type.toUpperCase()}] ${e.market}: ${e.description}`)
      .join('\n');

    const prompt = `You are a quantitative Polymarket analyst. Analyze these flow signals and respond ONLY with valid JSON: {"summary":"...","unusual":"..." or null}
- summary: 1-2 sentences on capital movement and dominant direction. Be specific.
- unusual: 1 sentence if something stands out, else null.

SIGNALS:
${summary}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in response');
    const parsed = JSON.parse(match[0]);

    return {
      summary: parsed.summary || buildFallbackInsight(events).summary,
      unusual: parsed.unusual || null,
      generatedAt: now,
    };
  } catch (err) {
    console.error('[gemini] insight error:', err);
    return buildFallbackInsight(events);
  }
}

function buildFallbackInsight(events: FlowEvent[]): InsightResult {
  const now = Date.now();
  if (events.length === 0) {
    return { summary: 'Monitoring market flow. Scanning for significant signals.', unusual: null, generatedAt: now };
  }
  const markets = [...new Set(events.map(e => e.market))].slice(0, 2);
  const spikes = events.filter(e => e.type === 'volume_spike').length;
  const momentum = events.filter(e => e.type === 'momentum').length;
  let summary = `Flow signals detected across ${markets.length} market${markets.length !== 1 ? 's' : ''}.`;
  if (spikes > 0) summary += ` ${spikes} volume spike${spikes > 1 ? 's' : ''} detected.`;
  const unusual = momentum >= 2 ? `Rapid price movement in ${momentum} markets — momentum building.` : null;
  return { summary, unusual, generatedAt: now };
}
