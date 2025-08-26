import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { TopNavbar } from '../components/navigation/TopNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: { default: '.agent Community Blog', template: '%s — .agent Community Blog' },
  description: 'Insights, updates, and thoughts from the .agent community',
  keywords: ['agent community', 'blog', 'updates', 'insights', 'technology', 'open source'],
  authors: [{ name: 'Agent Community' }],
  creator: 'Agent Community',
  publisher: 'Agent Community',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '.agent Community Blog',
    description: 'Insights, updates, and thoughts from the .agent community',
    url: '/blog',
    siteName: '.agent Community Blog',
    type: 'website',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: '.agent Community Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '.agent Community Blog',
    description: 'Insights, updates, and thoughts from the .agent community',
    images: ['/api/og'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootProvider>
            <TopNavbar />
            {children}
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}