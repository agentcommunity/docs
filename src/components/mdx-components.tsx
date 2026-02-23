import { Children, isValidElement } from 'react';
import { HeadingLink } from './heading-link';
import { Callout } from './callout';
import { MermaidDiagram } from './mermaid-diagram';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!isValidElement(node)) return '';
  const children = (node.props as { children?: ReactNode }).children;
  if (!children) return '';
  return Children.toArray(children).map(extractTextContent).join('');
}

function isMermaidBlock(children: ReactNode): boolean {
  const child = Children.only(children);
  if (!isValidElement(child)) return false;
  const className = (child.props as { className?: string }).className || '';
  return className.includes('language-mermaid');
}

function normalizeHref(href: string): string {
  if (href.startsWith('.docs.agentcommunity.org/')) {
    return `https://${href.slice(1)}`;
  }
  if (
    href.startsWith('docs.agentcommunity.org/') ||
    href.startsWith('blog.agentcommunity.org/') ||
    href.startsWith('agentcommunity.org/')
  ) {
    return `https://${href}`;
  }
  return href;
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  const sizes: Record<number, string> = {
    1: 'text-3xl font-bold mt-8 mb-4',
    2: 'text-2xl font-semibold mt-8 mb-3 pb-2 border-b border-border',
    3: 'text-xl font-semibold mt-6 mb-2',
    4: 'text-lg font-semibold mt-4 mb-2',
    5: 'text-base font-semibold mt-4 mb-1',
    6: 'text-sm font-semibold mt-4 mb-1',
  };
  return function Heading({ children, id, ...props }: ComponentPropsWithoutRef<'h1'>) {
    return (
      <Tag id={id} className={`${sizes[level]} group scroll-mt-20`} {...props}>
        {children}
        {id && <HeadingLink id={id} />}
      </Tag>
    );
  };
}

function Cards({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 my-4">{children}</div>;
}

function Card({ title, description, href, icon }: { title: string; description?: string; href: string; icon?: ReactNode }) {
  const isExternal = href.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group/card block rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors no-underline"
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div>
          <div className="font-semibold group-hover/card:text-primary transition-colors">{title}</div>
          {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
        </div>
      </div>
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: (props) => <p className="leading-7 mb-4" {...props} />,
  a: ({ href, ...props }) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-primary/80"
      href={typeof href === 'string' ? normalizeHref(href) : href}
      {...props}
    />
  ),
  ul: (props) => <ul className="my-4 ml-6 list-disc space-y-2" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props) => <thead className="border-b border-border" {...props} />,
  th: (props) => <th className="px-4 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="px-4 py-2 border-t border-border" {...props} />,
  blockquote: (props) => <blockquote className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground" {...props} />,
  code: (props) => <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props} />,
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => {
    try {
      if (children && isMermaidBlock(children)) {
        const source = extractTextContent(children);
        return <MermaidDiagram source={source} />;
      }
    } catch {
      // Not a single-child or not mermaid — fall through to normal pre
    }
    return (
      <div className="group relative my-4">
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm" {...props}>
          {children}
        </pre>
      </div>
    );
  },
  img: (props) => <img className="rounded-lg my-4 max-w-full" {...props} />,
  Card,
  Cards,
  Callout,
};
