import { describe, it, expect } from 'vitest';
import { getAllDocSlugs, getDoc, getDocNavigation } from '@/lib/docs';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs');

describe('docs content', () => {
  const slugs = getAllDocSlugs();

  it('discovers at least one doc page', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('includes the root index page (empty slug)', () => {
    const hasRoot = slugs.some(s => s.length === 0);
    expect(hasRoot).toBe(true);
  });

  it.each(slugs.map(s => [s.join('/') || '(index)', s]))(
    'loads doc "%s" with valid frontmatter',
    (_label, slug) => {
      const doc = getDoc(slug);
      expect(doc).not.toBeNull();
      expect(doc!.title).toBeTruthy();
      expect(doc!.content).toBeTruthy();
      expect(doc!.rawContent).toBeTruthy();
    },
  );

  it('every doc has a non-empty description', () => {
    for (const slug of slugs) {
      const doc = getDoc(slug);
      expect(doc!.description, `doc ${slug.join('/')} missing description`).toBeTruthy();
    }
  });

  it('produces no duplicate slugs', () => {
    const keys = slugs.map(s => s.join('/'));
    const unique = new Set(keys);
    expect(keys.length).toBe(unique.size);
  });
});

describe('docs navigation', () => {
  const nav = getDocNavigation();

  it('returns at least one nav item', () => {
    expect(nav.length).toBeGreaterThan(0);
  });

  it('every nav item has title, slug, and href', () => {
    function checkItem(item: (typeof nav)[number]) {
      expect(item.title).toBeTruthy();
      expect(typeof item.href).toBe('string');
      expect(item.href.startsWith('/docs')).toBe(true);
      if (item.children) {
        for (const child of item.children) checkItem(child);
      }
    }
    for (const item of nav) checkItem(item);
  });

  it('every nav href resolves to existing content', () => {
    function checkResolvable(item: (typeof nav)[number]) {
      const slug = item.href === '/docs' ? [] : item.href.replace('/docs/', '').split('/');
      const doc = getDoc(slug);
      expect(doc, `nav href ${item.href} does not resolve`).not.toBeNull();
      if (item.children) {
        for (const child of item.children) checkResolvable(child);
      }
    }
    for (const item of nav) checkResolvable(item);
  });

  it('meta.json pages all exist on disk', () => {
    const metaPath = path.join(DOCS_DIR, 'meta.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    for (const page of meta.pages) {
      if (page === 'index') {
        expect(fs.existsSync(path.join(DOCS_DIR, 'index.mdx')) || fs.existsSync(path.join(DOCS_DIR, 'index.md'))).toBe(true);
      } else {
        const asFile = fs.existsSync(path.join(DOCS_DIR, `${page}.mdx`)) || fs.existsSync(path.join(DOCS_DIR, `${page}.md`));
        const asDir = fs.existsSync(path.join(DOCS_DIR, page, 'index.mdx')) || fs.existsSync(path.join(DOCS_DIR, page, 'index.md'));
        expect(asFile || asDir, `meta.json references "${page}" but no file found`).toBe(true);
      }
    }
  });
});

describe('docs headings', () => {
  const slugs = getAllDocSlugs();

  it('heading IDs are unique within each page', () => {
    for (const slug of slugs) {
      const doc = getDoc(slug);
      if (!doc || doc.headings.length === 0) continue;
      const ids = doc.headings.map(h => h.id);
      const unique = new Set(ids);
      expect(ids.length, `duplicate heading IDs in ${slug.join('/')}`).toBe(unique.size);
    }
  });

  it('heading depths are between 2 and 6', () => {
    for (const slug of slugs) {
      const doc = getDoc(slug);
      if (!doc) continue;
      for (const h of doc.headings) {
        expect(h.depth).toBeGreaterThanOrEqual(2);
        expect(h.depth).toBeLessThanOrEqual(6);
      }
    }
  });
});
