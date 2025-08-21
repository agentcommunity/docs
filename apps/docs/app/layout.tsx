import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Agent Community Docs',
    template: '%s — Agent Community Docs',
  },
  description: 'Documentation for the .agent Community projects and AID specification.',
  keywords: ['agent community', 'AID specification', 'documentation', 'API', 'developer tools', 'open source'],
  authors: [{ name: 'Agent Community' }],
  creator: 'Agent Community',
  publisher: 'Agent Community',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Agent Community Docs',
    description: 'Documentation for the .agent Community projects and AID specification.',
    url: '/',
    siteName: 'Agent Community Docs',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Agent Community Docs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Community Docs',
    description: 'Documentation for the .agent Community projects and AID specification.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
        <Script id="ld-organization" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Agent Community',
              url: siteUrl,
              sameAs: [
                'https://github.com/agentcommunity'
              ]
            }),
          }}
        />
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Agent Community Docs',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/api/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
      </body>
    </html>
  );
}


