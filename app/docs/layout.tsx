import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source, aidSource } from '@/lib/source';
import Link from 'next/link';
import * as Lucide from 'lucide-react';

type TreeNode = {
  type?: string;
  name?: string;
  url?: string;
  icon?: unknown;
  children?: TreeNode[];
};

function toPascalCase(input: string): string {
  return input
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

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

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const isAID = slug[0] === 'aid';
  const rawTree = isAID ? aidSource.pageTree : source.pageTree;
  const treeWithIcons = mapIcons(rawTree as unknown as TreeNode) as unknown as Parameters<typeof DocsLayout>[0]['tree'];

  return (
    <DocsLayout 
      tree={treeWithIcons}
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        // No Blog/Discussion/GitHub in nav
      }}
      sidebar={{
        defaultOpenLevel: 0,
        tabs: [
          {
            title: '.agent Community',
            description: 'The home for open source agent collaboration',
            url: '/docs',
            icon: <Lucide.Book className="size-4" />,
          },
          {
            title: 'Agent Identity & Discovery (AID)',
            description: 'Define interfaces between agent systems',
            url: '/docs/aid',
            icon: <Lucide.Globe className="size-4" />,
          },
        ],
        // Custom footer links at the bottom of the sidebar
        footer: (
          <div className="flex flex-row gap-4 px-4 pb-4 items-center">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <a href="https://github.com/orgs/agentcommunity/discussions" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discussion</a>
            <a href="https://github.com/agentcommunity" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
