import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: { default: 'Agent Community Docs', template: '%s — Agent Community Docs' },
  description: 'Documentation for the .agent Community projects and AID specification.',
  openGraph: {
    title: 'Agent Community Docs',
    description: 'Documentation for the .agent Community projects and AID specification.',
    url: process.env.NEXT_PUBLIC_BASE_PATH ?? '/',
    siteName: 'Agent Community Docs',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}