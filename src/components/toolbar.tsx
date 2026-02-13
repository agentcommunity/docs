'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

export function Toolbar({ rawContent, slug, type }: { rawContent: string; slug: string; type: 'docs' | 'blog' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const githubUrl = `https://github.com/agentcommunity/AgentCommunity_DOCS/blob/main/content/${type === 'docs' ? 'docs' : 'blog'}/${slug}`;

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied!' : 'Copy Markdown'}
      </button>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors no-underline text-foreground"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View Source
      </a>
    </div>
  );
}
