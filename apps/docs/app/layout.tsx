import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import * as Lucide from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source, aidSource } from '@/lib/source';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: { default: 'Agent Community Docs', template: '%s — Agent Community Docs' },
  description: 'Documentation for the .agent Community projects and AID specification.',
  openGraph: {
    title: 'Agent Community Docs',
    description: 'Documentation for the .agent Community projects and AID specification.',
    url: '/',
    siteName: 'Agent Community Docs',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

function toPascalCase(input: string): string {
  return input
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

type TreeNode = {
  type?: string;
  name?: string;
  url?: string;
  icon?: unknown;
  children?: TreeNode[];
};

const iconAlias: Record<string, string> = {
  aid: 'Globe',
  docs: 'Book',
  documentation: 'Book',
  book: 'Book',
  spec: 'FileText',
  specification: 'FileText',
  rationale: 'HelpCircle',
  versioning: 'GitBranch',
  changelog: 'GitBranch',
  quickstart: 'Rocket',
  guide: 'FileText',
};

function mapIcons(node: TreeNode): TreeNode {
  const mapped: TreeNode = { ...node };
  if (typeof node.icon === 'string') {
    const aliased = iconAlias[node.icon.toLowerCase()] ?? node.icon;
    const pascal = toPascalCase(aliased);
    type IconComponent = React.ComponentType<{ className?: string }>;
    const IconComp = (Lucide as unknown as Record<string, IconComponent>)[pascal];
    if (IconComp) mapped.icon = <IconComp className="size-4" />;
  }
  if (Array.isArray(node.children)) mapped.children = node.children.map(mapIcons);
  return mapped;
}

export default async function Layout({ children }: { children: ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') || '';
  const first = pathname.split('/').filter(Boolean)[0];
  const isAID = first === 'aid';

  const rawTree = (isAID ? aidSource.pageTree : source.pageTree) as unknown as TreeNode;
  const treeWithIcons = mapIcons(rawTree) as unknown as Parameters<typeof DocsLayout>[0]['tree'];

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootProvider>
            <DocsLayout
              tree={treeWithIcons}
              nav={{ enabled: true }}
              sidebar={{
                defaultOpenLevel: 0,
                tabs: [
                  { title: '.agent Community', description: 'The home for open source agent collaboration', url: '/', icon: <Lucide.Book className="size-4" /> },
                  { title: 'Agent Interface Discovery (AID) v1.0.0', description: 'Define interfaces between agent systems', url: '/aid', icon: <Lucide.Globe className="size-4" /> },
                ],
              }}
            >
              {children}
            </DocsLayout>
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}