import type { ReactNode } from 'react';
import UnifiedLayout from './(community)/layout';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <UnifiedLayout>
      {children}
    </UnifiedLayout>
  );
}
