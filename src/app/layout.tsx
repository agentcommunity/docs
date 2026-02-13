import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: '.agent Community', template: '%s — .agent Community' },
  description: 'The home for open source agent collaboration.',
  keywords: ['agent community', 'AID specification', 'documentation', 'API', 'developer tools', 'open source'],
  metadataBase: new URL('https://docs.agentcommunity.org'),
  openGraph: {
    type: 'website',
    siteName: '.agent Community',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: '.agent Community',
      url: 'https://agentcommunity.org',
      sameAs: ['https://github.com/agentcommunity'],
    },
    {
      '@type': 'WebSite',
      name: '.agent Community Docs',
      url: 'https://docs.agentcommunity.org',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://docs.agentcommunity.org/api/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="alternate" type="application/rss+xml" title=".agent Community Blog" href="/rss.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
