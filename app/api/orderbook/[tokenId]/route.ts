import { NextResponse } from 'next/server';
import { fetchOrderBook } from '@/lib/clob';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;
  if (!tokenId) {
    return NextResponse.json({ error: 'tokenId required' }, { status: 400 });
  }

  try {
    const book = await fetchOrderBook(tokenId);
    if (!book) {
      return NextResponse.json({ error: 'No orderbook found' }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (err) {
    console.error('[/api/orderbook]', err);
    return NextResponse.json({ error: 'Failed to fetch orderbook' }, { status: 500 });
  }
}
