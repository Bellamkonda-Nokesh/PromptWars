import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VenueFlow AI — Smart Sporting Venue Experience Platform',
  description:
    'AI-powered smart venue experience platform for large-scale sporting events. Real-time navigation, crowd intelligence, and personalized assistance powered by Google Cloud.',
  keywords: 'VenueFlow, AI, stadium, sporting venue, navigation, crowd intelligence, smart venue',
  openGraph: {
    title: 'VenueFlow AI',
    description: 'Smart Sporting Venue Experience Platform',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
