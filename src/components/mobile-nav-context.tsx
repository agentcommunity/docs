'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { Heading } from '@/lib/types';

interface MobileNavState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  headings: Heading[];
  setHeadings: (headings: Heading[]) => void;
}

const MobileNavContext = createContext<MobileNavState | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <MobileNavContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        headings,
        setHeadings,
      }}
    >
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) throw new Error('useMobileNav must be used within MobileNavProvider');
  return ctx;
}

/** Drop into a server-rendered page to push headings into the mobile drawer. */
export function SetMobileHeadings({ headings }: { headings: Heading[] }) {
  const { setHeadings } = useMobileNav();

  useEffect(() => {
    setHeadings(headings);
    return () => setHeadings([]);
  }, [headings, setHeadings]);

  return null;
}
