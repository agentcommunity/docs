import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';
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
}: {
  children: ReactNode;
}) {
  const rawTree = source.pageTree;
  const treeWithIcons = mapIcons(rawTree as unknown as TreeNode) as unknown as Parameters<typeof DocsLayout>[0]['tree'];

  return (
    <DocsLayout
      tree={treeWithIcons}
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
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
            title: 'AID Docs',
            description: 'AID specification and reference (hosted externally)',
            url: 'https://aid.agentcommunity.org/docs',
            icon: <Lucide.ExternalLink className="size-4" />,
          },
        ],
        footer: (
          <div className="flex flex-col gap-3 px-4 pb-4">
            <div className="flex flex-row gap-4 items-center">
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <a href="https://github.com/orgs/agentcommunity/discussions" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discussion</a>
            </div>
            <div className="flex flex-row gap-3 items-center">
              <a href="https://github.com/agentcommunity" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://x.com/agentcommunity_" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com/orgs/agentcommunity/discussions" target="_blank" rel="noopener noreferrer" aria-label="Questions & Feedback" className="text-muted-foreground hover:text-foreground transition-colors">
                <Lucide.MessageCircleQuestion className="size-4" />
              </a>
            </div>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
