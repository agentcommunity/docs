// apps/docs/app/components/navigation/top-navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { baseOptions } from '@/app/layout.config';
import type { ReactNode } from 'react';
import { getNavSectionItems } from './nav-items';

// adjust this import if your package path differs
// search node_modules for "NavbarSidebarTrigger" if it fails
import { NavbarSidebarTrigger } from 'fumadocs-ui/layouts/docs-client';
import { Home } from 'lucide-react';

function isActive(pathname: string, href = '', mode: 'url' | 'nested-url' | 'none' = 'nested-url') {
  if (!href || mode === 'none') return false;
  if (mode === 'url') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

interface SecondaryLink { url: string; label: string; icon: ReactNode }

function isSecondaryLink(x: unknown): x is SecondaryLink {
  if (typeof x !== 'object' || x === null) return false;
  const obj = x as Record<string, unknown>;
  return obj.type === 'icon' && typeof obj.url === 'string' && typeof obj.label === 'string' && 'icon' in obj;
}

export default function TopNavbar() {
  const pathname = usePathname();

  // primary from shared nav items (Community, AID, etc.)
  const primary = getNavSectionItems();
  // secondary still from baseOptions (external icons, etc.)
  const secondary = ((baseOptions.links ?? []) as unknown[]).filter(isSecondaryLink);

  return (
    <div className="flex items-center justify-between h-14 px-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <NavbarSidebarTrigger aria-label="Toggle sidebar" />
        <Link href="https://agentcommunity.org" aria-label="Go to Agent Community home" className="opacity-80 hover:opacity-100">
          <Home size={16} />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2">
        {primary.map((item) => {
          const active = isActive(pathname, item.url, 'nested-url');
          return (
            <Link
              key={item.url}
              href={item.url}
              aria-current={active ? 'page' : undefined}
              className={[
                'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors border',
                active
                  ? 'border-primary text-primary bg-primary/40 hover:bg-primary/15 shadow-md'
                  : 'border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              ].join(' ')}
            >
              {item.icon}
              <span className="truncate max-w-[14ch] sm:max-w-none">{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-3">
        {secondary.map((item) => (
          <Link key={item.url} href={item.url} aria-label={item.label} className="opacity-80 hover:opacity-100">
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
