export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} .agent Community. Open source under MIT.</p>
          <nav className="flex items-center gap-4">
            <a href="https://agentcommunity.org" className="hover:text-foreground transition-colors">Home</a>
            <a href="https://agentcommunity.org/about" className="hover:text-foreground transition-colors">About</a>
            <a href="https://agentcommunity.org/join" className="hover:text-foreground transition-colors">Join</a>
            <a href="https://agentcommunity.org/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/rss.xml" className="hover:text-foreground transition-colors">RSS</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
