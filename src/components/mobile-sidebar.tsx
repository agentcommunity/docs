'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DocsSidebar } from './docs-sidebar';
import type { NavItem } from '@/lib/types';

export function MobileSidebar({ navigation }: { navigation: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FAB trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay + Sidebar */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border p-6 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm">Navigation</span>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <DocsSidebar navigation={navigation} />
          </div>
        </>
      )}
    </>
  );
}
