import type { ReactNode } from 'react';
import { source, aidSource } from '@/lib/source';
import { baseOptions } from '@/app/layout.config';
import { ClientLayoutWrapper } from '@/app/components/navigation/ClientLayoutWrapper';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClientLayoutWrapper
      sourceTree={source.pageTree}
      aidSourceTree={aidSource.pageTree}
      baseOptions={baseOptions}
    >
      {children}
    </ClientLayoutWrapper>
  );
}


