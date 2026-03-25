import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PolyRiver – Real-Time Flow Intelligence',
  description: 'Professional flow intelligence terminal for Polymarket traders. Track capital movement, momentum signals, and market activity in real time.',
  keywords: 'Polymarket, prediction markets, trading terminal, flow intelligence, volume tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
