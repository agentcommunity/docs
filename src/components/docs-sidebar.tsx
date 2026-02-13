'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { NavItem } from '@/lib/types';

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {item.title}
    </Link>
  );
}

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isChildActive = item.children?.some(c => pathname === c.href) ?? false;
  const [open, setOpen] = useState(isChildActive || pathname === item.href);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-sm font-medium hover:text-foreground transition-colors"
      >
        {item.title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-2 mt-1 space-y-0.5 border-l border-border pl-2">
          {item.children?.map(child => <NavLink key={child.slug} item={child} />)}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar({ navigation, className }: { navigation: NavItem[]; className?: string }) {
  return (
    <nav className={className}>
      <div className="space-y-1">
        {navigation.map(item =>
          item.children ? (
            <NavGroup key={item.slug} item={item} />
          ) : (
            <NavLink key={item.slug} item={item} />
          )
        )}
      </div>
    </nav>
  );
}
