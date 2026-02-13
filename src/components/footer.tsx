export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <p>&copy; {new Date().getFullYear()} .agent Community. Open source under MIT.</p>
      </div>
    </footer>
  );
}
