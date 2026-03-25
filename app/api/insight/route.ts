import { NextResponse } from 'next/server';
import { generateInsight } from '@/lib/gemini';
import { getRecentEvents } from '@/lib/flow-engine';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const events = getRecentEvents(15);
    const insight = await generateInsight(events);
    return NextResponse.json(insight);
  } catch (err) {
    console.error('[/api/insight]', err);
    return NextResponse.json(
      { summary: 'Insight unavailable. Monitoring market flow.', unusual: null, generatedAt: Date.now() },
      { status: 200 }
    );
  }
}
