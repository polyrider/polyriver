import { fetchActiveMarkets, fetchRecentTrades } from '@/lib/clob';
import { processTradesIntoEvents, pushEvents, getRecentEvents } from '@/lib/flow-engine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Global polling state (shared across SSE connections in same server process)
let pollingTimer: NodeJS.Timeout | null = null;
let connectedClients = 0;

function startPolling() {
  if (pollingTimer) return;
  pollingTimer = setInterval(async () => {
    try {
      const markets = await fetchActiveMarkets(20);
      for (const market of markets.slice(0, 10)) {
        const tokens = market.tokens || [];
        for (const token of tokens.slice(0, 1)) {
          const trades = await fetchRecentTrades(token.token_id);
          const events = processTradesIntoEvents(trades, market);
          if (events.length > 0) {
            pushEvents(events);
          }
        }
      }
    } catch (err) {
      console.error('[flow-poller]', err);
    }
  }, 4000);
}

function stopPolling() {
  if (connectedClients <= 0 && pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      connectedClients++;
      startPolling();

      // Send initial batch of buffered events
      const initial = getRecentEvents(20);
      if (initial.length > 0) {
        const data = `data: ${JSON.stringify({ type: 'batch', events: initial })}\n\n`;
        controller.enqueue(encoder.encode(data));
      } else {
        // Send heartbeat to confirm connection
        controller.enqueue(encoder.encode(`: connected\n\n`));
      }

      // Push new events every 2s
      const pushInterval = setInterval(() => {
        try {
          const events = getRecentEvents(5);
          const msg = `data: ${JSON.stringify({ type: 'update', events })}\n\n`;
          controller.enqueue(encoder.encode(msg));
        } catch {
          clearInterval(pushInterval);
          controller.close();
        }
      }, 2000);

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      return () => {
        clearInterval(pushInterval);
        clearInterval(heartbeat);
        connectedClients = Math.max(0, connectedClients - 1);
        stopPolling();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
