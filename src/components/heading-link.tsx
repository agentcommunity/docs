'use client';
import { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';

export function HeadingLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity" aria-label="Copy link">
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
    </button>
  );
}
