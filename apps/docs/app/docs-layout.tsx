import type { ReactNode } from 'react';
import UnifiedLayout from './(community)/layout';

export default function DocsLayout({ children, isAID }: { children: ReactNode; isAID?: boolean }) {
  return (
    <UnifiedLayout isAID={isAID}>
      {children}
    </UnifiedLayout>
  );
}
