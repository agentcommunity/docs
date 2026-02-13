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
  openGraph: {
    type: 'website',
    siteName: '.agent Community',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
