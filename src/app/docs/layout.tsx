import { getDocNavigation } from '@/lib/docs';
import { DocsSidebar } from '@/components/docs-sidebar';
import { MobileNavProvider } from '@/components/mobile-nav-context';
import { MobileDocsDrawer } from '@/components/mobile-docs-drawer';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigation = getDocNavigation();

  return (
    <MobileNavProvider>
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Single mobile drawer (trigger bar + slide-out panel) */}
        <MobileDocsDrawer navigation={navigation} />

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-border p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <DocsSidebar navigation={navigation} />
        </aside>

        {/* Content + TOC */}
        {children}
      </div>
    </MobileNavProvider>
  );
}
