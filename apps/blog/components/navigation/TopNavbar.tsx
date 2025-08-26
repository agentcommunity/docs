import Link from 'next/link';

export function TopNavbar() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/blog';
  return (
    <nav className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/blog" className="flex items-center gap-2 hover:opacity-80">
            {/* Light mode logo */}
            <img src={`${basePath}/assets/logo_docs_lm.svg`} alt=".agent" className="h-5 w-auto dark:hidden" />
            {/* Dark mode logo */}
            <img src={`${basePath}/assets/logo_docs_dm.svg`} alt=".agent" className="h-5 w-auto hidden dark:inline" />
            <span className="font-semibold text-sm">.agent Blog</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <a href="https://agentcommunity.org" className="hover:underline" target="_blank" rel="noreferrer">Home</a>
          <a href={process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.agentcommunity.org'} target="_blank" rel="noreferrer" className="hover:underline">Docs</a>
          <a href="https://x.com/agentcommunity_" target="_blank" rel="noreferrer" className="hover:underline">X</a>
          <a href="https://github.com/agentcommunity" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
        </div>
      </div>
    </nav>
  );
}


