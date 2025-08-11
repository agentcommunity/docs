import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { aidSource } from '@/lib/source';
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

export default function AIDLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={mapIcons(aidSource.pageTree as unknown as TreeNode) as Parameters<typeof DocsLayout>[0]['tree']}
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
  );
}


