/**
 * Generate static OG images for all docs and blog pages.
 * Run: pnpm tsx scripts/generate-og-images.ts
 * Output: public/og/*.png (1200x630)
 */

import fs from 'fs';
import path from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// We need to import our content loaders
// Since they use process.cwd(), we run this from the project root
const DOCS_DIR = path.join(process.cwd(), 'content', 'docs');
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og');

// Simple frontmatter parser (avoiding gray-matter import issues with tsx)
function parseFrontmatter(content: string): { title: string; description: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: '', description: '' };
  const yaml = match[1];
  const title = yaml.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
  const description = yaml.match(/description:\s*["']?(.+?)["']?\s*$/m)?.[1] || '';
  return { title, description };
}

interface OGPage {
  title: string;
  description: string;
  slug: string;
  type: 'docs' | 'blog';
}

function collectPages(): OGPage[] {
  const pages: OGPage[] = [];

  // Collect docs
  function walkDocs(dir: string, prefix: string[]) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walkDocs(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
        const { title, description } = parseFrontmatter(content);
        const baseName = entry.name.replace(/\.mdx?$/, '');
        const slug = baseName === 'index'
          ? (prefix.length > 0 ? prefix.join('/') : 'index')
          : [...prefix, baseName].join('/');
        pages.push({ title, description, slug: `docs/${slug}`, type: 'docs' });
      }
    }
  }

  if (fs.existsSync(DOCS_DIR)) walkDocs(DOCS_DIR, []);

  // Collect blog
  if (fs.existsSync(BLOG_DIR)) {
    for (const file of fs.readdirSync(BLOG_DIR)) {
      if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { title, description } = parseFrontmatter(content);
      const slug = file.replace(/\.mdx?$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      pages.push({ title, description, slug: `blog/${slug}`, type: 'blog' });
    }
  }

  return pages;
}

async function generateImage(page: OGPage): Promise<Buffer> {
  const typeLabel = page.type === 'docs' ? 'Documentation' : 'Blog';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: '#0B0B0C',
          color: '#ffffff',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '16px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#8b5cf6',
                      fontWeight: 600,
                    },
                    children: typeLabel,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '52px',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      maxWidth: '900px',
                    },
                    children: page.title || 'Untitled',
                  },
                },
                page.description ? {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '24px',
                      color: '#a1a1aa',
                      lineHeight: 1.4,
                      maxWidth: '800px',
                    },
                    children: page.description,
                  },
                } : null,
              ].filter(Boolean),
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '20px', fontWeight: 600, color: '#e4e4e7' },
                    children: '.agent Community',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '18px', color: '#71717a' },
                    children: 'agentcommunity.org',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetchFont('Inter', 400),
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'Inter',
          data: await fetchFont('Inter', 600),
          weight: 600,
          style: 'normal' as const,
        },
        {
          name: 'Inter',
          data: await fetchFont('Inter', 800),
          weight: 800,
          style: 'normal' as const,
        },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}

async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  const css = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.text());
  const fontUrl = css.match(/src: url\((.+?)\)/)?.[1];
  if (!fontUrl) throw new Error(`Font not found: ${family} ${weight}`);
  return fetch(fontUrl).then(r => r.arrayBuffer());
}

async function main() {
  const pages = collectPages();
  console.log(`Generating ${pages.length} OG images...`);

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const page of pages) {
    const outputPath = path.join(OUTPUT_DIR, `${page.slug.replace(/\//g, '-')}.png`);
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });

    try {
      const png = await generateImage(page);
      fs.writeFileSync(outputPath, png);
      console.log(`  ✓ ${outputPath}`);
    } catch (e) {
      console.error(`  ✗ ${page.slug}: ${e}`);
    }
  }

  console.log('Done!');
}

main();
