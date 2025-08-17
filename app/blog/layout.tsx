import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/blog" className="flex items-center space-x-2">
            <Image 
              src="/blog/assets/logo.svg" 
              alt=".agent Community Logo" 
              width={24} 
              height={24}
            />
            <span className="font-bold">.agent Community</span>
            <span className="text-muted-foreground">Blog</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <a 
              href="https://docs.agentcommunity.org" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation ↗
            </a>
            <a 
              href="https://agentcommunity.org" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Community ↗
            </a>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center space-x-2">
              <Image 
                src="/blog/assets/logo.svg" 
                alt=".agent Community Logo" 
                width={20} 
                height={20}
              />
              <span className="text-sm font-medium">.agent Community</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the agentic future together.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://docs.agentcommunity.org" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Documentation
              </a>
              <a 
                href="https://agentcommunity.org" 
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Community
              </a>
              <a 
                href="https://github.com/orgs/agentcommunity" 
                className="text-sm text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 