import type { FlowEvent } from './types';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`;

export interface InsightResult {
  summary: string;
  unusual: string | null;
  generatedAt: number;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generateInsight(events: FlowEvent[]): Promise<InsightResult> {
  const now = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || events.length === 0) {
    return buildFallbackInsight(events);
  }

  try {
    const summary = events
      .slice(0, 12)
      .map(e => `[${e.type.toUpperCase()}] ${e.market}: ${e.description}`)
      .join('\n');

    const prompt = `You are a quantitative Polymarket analyst. Analyze these flow signals and respond ONLY with valid JSON: {"summary":"...","unusual":"..." or null}
- summary: 1-2 sentences on capital movement and dominant direction. Be specific.
- unusual: 1 sentence if something stands out, else null.

SIGNALS:
${summary}`;

    const text = await callGemini(prompt, apiKey);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON');
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
    return { summary: 'Monitoring market flow. No significant events in current window.', unusual: null, generatedAt: now };
  }
  const markets = [...new Set(events.map(e => e.market))].slice(0, 2);
  const spikes = events.filter(e => e.type === 'volume_spike').length;
  const momentum = events.filter(e => e.type === 'momentum').length;
  let summary = `Flow signals detected across ${markets.length} market${markets.length !== 1 ? 's' : ''}.`;
  if (spikes > 0) summary += ` ${spikes} volume spike${spikes > 1 ? 's' : ''} detected.`;
  const unusual = momentum >= 2 ? `Rapid price movement in ${momentum} markets — momentum building.` : null;
  return { summary, unusual, generatedAt: now };
}
