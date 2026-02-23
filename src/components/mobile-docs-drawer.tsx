'use client';

import { Menu, X } from 'lucide-react';
import { DocsSidebar } from './docs-sidebar';
import { useMobileNav } from './mobile-nav-context';
import type { NavItem } from '@/lib/types';

export function MobileDocsDrawer({ navigation }: { navigation: NavItem[] }) {
  const { isOpen, open, close, headings } = useMobileNav();

  return (
    <>
      {/* Mobile trigger bar — replaces the old floating FAB */}
      <div className="lg:hidden flex items-center border-b border-border px-6 py-2">
        <button
          onClick={open}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border overflow-y-auto transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-sm">Navigation</span>
          <button
            onClick={close}
            className="p-1 hover:bg-muted rounded-md"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Docs page navigation */}
        <div className="p-4">
          <DocsSidebar navigation={navigation} />
        </div>

        {/* On-this-page headings */}
        {headings.length > 0 && (
          <div className="p-4 border-t border-border">
            <p className="font-semibold text-sm mb-2">On this page</p>
            <div className="space-y-1">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={close}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}
                >
                  {heading.text}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
