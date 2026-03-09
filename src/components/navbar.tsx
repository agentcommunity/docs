import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { SearchDialog } from './search-dialog';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/assets/logo_docs_lm.svg" alt=".agent" className="h-5 w-5 dark:hidden" />
            <img src="/assets/logo_docs_dm.svg" alt=".agent" className="hidden h-5 w-5 dark:block" />
            <span>.agent Community</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <a href="https://docs.agentcommunity.org" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">Docs</a>
            <a href="https://blog.agentcommunity.org" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">Blog</a>
            <a href="https://aid.agentcommunity.org" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">AID Spec</a>
            <a href="https://agentcommunity.org/about" className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SearchDialog />
          <a href="https://github.com/agentcommunity" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md hover:bg-muted transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://agentcommunity.org/join" className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Join
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
