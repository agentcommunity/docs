import * as Lucide from 'lucide-react';
import type { ReactNode } from 'react';

export interface NavSectionItem {
  title: string;
  description: string;
  url: string;
  icon: ReactNode;
}

export const navSectionItems: Readonly<NavSectionItem[]> = [
  {
    title: '.agent Community',
    description: 'The home for open source agent collaboration',
    url: '/',
    icon: (
      <span className="inline-flex items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 size-5">
        <Lucide.Book className="size-3.5" />
      </span>
    ),
  },
  {
    title: 'Agent Identity & Discovery (AID) v1.1.0',
    description: 'Define interfaces between agent systems',
    url: 'https://aid.agentcommunity.org',
    icon: (
      <span className="inline-flex items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 size-5">
        <Lucide.Globe className="size-3.5" />
      </span>
    ),
  },
];

export function getNavSectionItems() {
  return navSectionItems;
}


