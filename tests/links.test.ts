import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type LinkRef = {
  file: string;
  line: number;
  href: string;
};

function walkMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(full));
      continue;
    }
    if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(full);
    }
  }

  return files;
}

function collectLinks(file: string): LinkRef[] {
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  const refs: LinkRef[] = [];
  const pattern = /!?\[[^\]]*]\(([^)\s]+(?:\s+["'][^"']*["'])?)\)/g;

  lines.forEach((line, idx) => {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(line)) !== null) {
      const raw = match[1].trim();
      const href = raw.split(/\s+["']/)[0];
      refs.push({ file, line: idx + 1, href });
    }
  });

  return refs;
}

describe('content links', () => {
  const markdownFiles = walkMarkdownFiles(CONTENT_DIR);
  const linkRefs = markdownFiles.flatMap(collectLinks);
  const blogRefs = linkRefs.filter((ref) => ref.file.includes('/content/blog/'));

  it('contains at least one link (sanity check)', () => {
    expect(linkRefs.length).toBeGreaterThan(0);
  });

  it('does not use http:// links', () => {
    const invalid = linkRefs.filter((ref) => ref.href.startsWith('http://'));
    expect(invalid, JSON.stringify(invalid, null, 2)).toEqual([]);
  });

  it('does not use bare site domains without https://', () => {
    const bareDomain = /^(?:\.?docs\.agentcommunity\.org|blog\.agentcommunity\.org|agentcommunity\.org)\//;
    const invalid = linkRefs.filter((ref) => bareDomain.test(ref.href));
    expect(invalid, JSON.stringify(invalid, null, 2)).toEqual([]);
  });

  it('blog posts do not use date-prefixed blog routes', () => {
    const invalid = blogRefs.filter((ref) => /^\/blog\/\d{4}-\d{2}-\d{2}-/.test(ref.href));
    expect(invalid, JSON.stringify(invalid, null, 2)).toEqual([]);
  });

  it('blog posts do not use relative markdown links', () => {
    const allowedPrefixes = ['https://', '/', '#', 'mailto:', 'tel:'];
    const invalid = blogRefs.filter((ref) => !allowedPrefixes.some((prefix) => ref.href.startsWith(prefix)));
    expect(invalid, JSON.stringify(invalid, null, 2)).toEqual([]);
  });
});
