import type { FlowEvent } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface InsightResult {
  summary: string;
  unusual: string | null;
  generatedAt: number;
}

let lastInsightTime = 0;
let cachedInsight: InsightResult | null = null;
const INSIGHT_TTL = 25_000; // 25 seconds

export async function generateInsight(events: FlowEvent[]): Promise<InsightResult> {
  const now = Date.now();

  if (cachedInsight && now - lastInsightTime < INSIGHT_TTL) {
    return cachedInsight;
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    const fallback = buildFallbackInsight(events);
    cachedInsight = fallback;
    lastInsightTime = now;
    return fallback;
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const recentEvents = events.slice(0, 15);
    const eventSummary = recentEvents
      .map(
        (e) =>
          `[${e.type.toUpperCase()}] ${e.market}: ${e.description} (t=${new Date(e.timestamp).toISOString()})`
      )
      .join('\n');

    const prompt = `You are a quantitative market analyst for Polymarket, a prediction market platform.
Analyze these recent flow events and provide a brief, precise intelligence summary.

RECENT FLOW EVENTS:
${eventSummary || 'No significant events in last interval.'}

Rules:
- Respond ONLY with valid JSON in this exact format: {"summary": "...", "unusual": "..." or null}
- summary: 1-2 sentences. Describe capital movement patterns, market momentum, and dominant flow direction. Be specific about markets and amounts.
- unusual: 1 sentence if something stands out (size, speed, concentration). null if nothing unusual.
- No generic phrases. No hedging. Specific, actionable language only.
- Do not invent numbers not in the data.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    const insight: InsightResult = {
      summary: parsed.summary || buildFallbackInsight(events).summary,
      unusual: parsed.unusual || null,
      generatedAt: now,
    };

    cachedInsight = insight;
    lastInsightTime = now;
    return insight;
  } catch (err) {
    console.error('[gemini] insight generation failed:', err);
    const fallback = buildFallbackInsight(events);
    cachedInsight = fallback;
    lastInsightTime = now;
    return fallback;
  }
}

function buildFallbackInsight(events: FlowEvent[]): InsightResult {
  if (events.length === 0) {
    return {
      summary: 'Monitoring market flow. No significant events detected in the current window.',
      unusual: null,
      generatedAt: Date.now(),
    };
  }

  const largeTrades = events.filter((e) => e.type === 'large_trade');
  const spikes = events.filter((e) => e.type === 'volume_spike');
  const momentum = events.filter((e) => e.type === 'momentum');

  const topMarkets = Array.from(new Set(events.map((e) => e.market))).slice(0, 2);
  const totalLargeFlow = largeTrades.reduce((s, e) => s + e.magnitude, 0);

  let summary = `Flow activity detected across ${topMarkets.length} market${topMarkets.length !== 1 ? 's' : ''}.`;
  if (largeTrades.length > 0 && totalLargeFlow > 0) {
    summary += ` $${totalLargeFlow > 1000 ? (totalLargeFlow / 1000).toFixed(1) + 'k' : totalLargeFlow.toFixed(0)} in large trades logged.`;
  }

  let unusual: string | null = null;
  if (spikes.length >= 2) {
    unusual = `Volume spike pattern detected in ${spikes.length} markets simultaneously — possible coordinated flow.`;
  } else if (momentum.length >= 2) {
    unusual = `Rapid price movement in ${momentum.length} markets — momentum building across segments.`;
  }

  return { summary, unusual, generatedAt: Date.now() };
}
