import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import * as Lucide from 'lucide-react';

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree as any}
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


