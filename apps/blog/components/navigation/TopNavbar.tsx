import Link from 'next/link';

export function TopNavbar() {
  return (
    <nav className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/blog" className="flex items-center gap-2 hover:opacity-80">
            <img src="/assets/logo.svg" alt=".agent" className="h-5 w-auto" />
            <span className="font-semibold text-sm">.agent Blog</span>
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/" className="hover:underline">Docs</Link>
          <a href="https://x.com/agentcommunity" target="_blank" rel="noreferrer" className="hover:underline">X</a>
          <a href="https://github.com/agentcommunity/docs" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
        </div>
      </div>
    </nav>
  );
}


