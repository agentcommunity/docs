'use client';

import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { usePathname } from 'next/navigation';
import TopNavbar from './top-navbar';
import type { ReactNode } from 'react';
import { getNavSectionItems } from './nav-items';

interface ClientLayoutWrapperProps {
  sourceTree: DocsLayoutProps['tree'];
  aidSourceTree: DocsLayoutProps['tree'];
  baseOptions: BaseLayoutProps;
  isAID?: boolean;
  children: ReactNode;
}

export function ClientLayoutWrapper({
  sourceTree,
  aidSourceTree,
  baseOptions,
  isAID,
  children
}: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const resolvedIsAID = isAID ?? pathname.startsWith('/aid');

  //

  // For clean navigation, only show the relevant section's tree
  // Don't mix Community and AID navigation items
  const currentTree = resolvedIsAID ? aidSourceTree : sourceTree;

  // prevent sidebar from mirroring header links; keep header using baseOptions directly
  const layoutBase: BaseLayoutProps = { ...baseOptions, links: [] };

  const docsOptions: DocsLayoutProps = {
    ...layoutBase,
    tree: currentTree,
    sidebar: {
      defaultOpenLevel: 0,
      tabs: getNavSectionItems().map((i) => ({
        title: i.title,
        description: i.description,
        url: i.url,
        icon: i.icon,
      })),
    },
    nav: { ...(layoutBase.nav as NonNullable<BaseLayoutProps['nav']>), enabled: true, component: <TopNavbar /> },
  };

  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}
