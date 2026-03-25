export interface Market {
  id: string;
  slug: string;
  question: string;
  conditionId: string;
  tokens: Array<{ token_id: string; outcome: string; price: number }>;
  volume: number;
  volume24hr: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  tags: string[];
  startDate: string;
  endDate: string;
  category?: string;
}

export interface MarketWithScore extends Market {
  flow_score: number;
  price_velocity: number;
  volume_acceleration: number;
}

export interface OrderBook {
  market: string;
  asset_id: string;
  bids: Array<{ price: string; size: string }>;
  asks: Array<{ price: string; size: string }>;
  timestamp: number;
}

export interface Trade {
  id: string;
  taker_order_id: string;
  market: string;
  asset_id: string;
  side: 'BUY' | 'SELL';
  size: string;
  fee_rate_bps: string;
  price: string;
  status: string;
  match_time: string;
  last_update: string;
  outcome: string;
  maker_address: string;
  transaction_hash?: string;
  bucket_index: number;
  type: string;
}

export type FlowEventType = 'large_trade' | 'volume_spike' | 'momentum';

export interface FlowEvent {
  id: string;
  type: FlowEventType;
  market: string;
  marketSlug: string;
  tokenId: string;
  description: string;
  magnitude: number;
  price: number;
  side: 'YES' | 'NO';
  timestamp: number;
  walletAddress?: string;
}
