import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://zivyne.online'),
  title: 'ZIVYNE — Amateur.tv Live Creators',
  description: 'Explore live adult creators exclusively from Amateur.tv.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  other: { rating: 'adult' }
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}<footer className="footer"><a href="/legal">Legal</a><span> · </span><a href="/privacy">Privacy</a><span> · </span><a href="/affiliate-disclosure">Affiliate disclosure</a><p>Independent affiliate discovery website. Adults only (18+).</p></footer></body></html>;
}
