
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'USDT Daily Rewards',
  description: 'USDT account and transaction request portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ku">
      <body>{children}</body>
    </html>
  );
}
