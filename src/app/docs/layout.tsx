import { getDocNavigation } from '@/lib/docs';
import { DocsSidebar } from '@/components/docs-sidebar';
import { MobileSidebar } from '@/components/mobile-sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigation = getDocNavigation();

  return (
    <div className="mx-auto max-w-7xl flex min-h-[calc(100vh-4rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <DocsSidebar navigation={navigation} />
      </aside>

      {/* Mobile sidebar */}
      <MobileSidebar navigation={navigation} />

      {/* Content + TOC */}
      {children}
    </div>
  );
}
