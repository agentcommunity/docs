import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DocPage, Heading, NavItem } from "./types";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

/**
 * Slugify a heading text: lowercase, strip special chars, spaces to hyphens.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Extract headings (h2-h6) from markdown content.
 * Skips h1 headings.
 */
function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    headings.push({
      depth,
      text,
      id: slugify(text),
    });
  }

  return headings;
}

/**
 * Resolve a file path for a given slug array.
 * Tries in order:
 *   1. {slug}.mdx
 *   2. {slug}/index.mdx
 *   3. {slug}.md
 *   4. {slug}/index.md
 *
 * For an empty slug array, resolves to index.mdx or index.md in the docs root.
 */
function resolveDocPath(slug: string[]): string | null {
  const basePath = path.join(DOCS_DIR, ...slug);

  const candidates = [
    basePath + ".mdx",
    path.join(basePath, "index.mdx"),
    basePath + ".md",
    path.join(basePath, "index.md"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Load a doc page by slug array.
 * Returns null if the doc does not exist.
 */
export function getDoc(slug: string[]): DocPage | null {
  const filePath = resolveDocPath(slug);
  if (!filePath) return null;

  const rawFile = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawFile);

  return {
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    content,
    rawContent: rawFile,
    headings: extractHeadings(content),
    slug,
  };
}

/**
 * Recursively walk content/docs/ and collect all valid slugs.
 * Returns an array of slug arrays for generateStaticParams.
 */
export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];

  function walk(dir: string, segments: string[]): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...segments, entry.name]);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (ext !== ".mdx" && ext !== ".md") continue;

        const baseName = path.basename(entry.name, ext);

        if (baseName === "index") {
          // index file represents the directory itself
          slugs.push(segments);
        } else {
          slugs.push([...segments, baseName]);
        }
      }
    }
  }

  walk(DOCS_DIR, []);
  return slugs;
}

/**
 * Parse content/docs/meta.json and build a navigation tree.
 *
 * meta.json format:
 * {
 *   "title": "...",
 *   "pages": ["index", "work-items", ...]
 * }
 *
 * - "index" maps to slug [], href /docs
 * - Other entries check for file ({name}.mdx) or directory ({name}/index.mdx)
 */
export function getDocNavigation(): NavItem[] {
  const metaPath = path.join(DOCS_DIR, "meta.json");

  if (!fs.existsSync(metaPath)) {
    return [];
  }

  const metaRaw = fs.readFileSync(metaPath, "utf-8");
  const meta = JSON.parse(metaRaw) as {
    title?: string;
    pages?: string[];
  };

  if (!meta.pages || !Array.isArray(meta.pages)) {
    return [];
  }

  const navItems: NavItem[] = [];

  for (const page of meta.pages) {
    if (page === "index") {
      // Root index page
      const doc = getDoc([]);
      navItems.push({
        title: doc?.title || meta.title || "Home",
        slug: "",
        href: "/docs",
      });
    } else {
      // Resolve the page: could be a file or directory
      const slug = [page];
      const doc = getDoc(slug);
      const title = doc?.title || page;

      const navItem: NavItem = {
        title,
        slug: page,
        href: `/docs/${page}`,
      };

      // Check for nested meta.json to build children
      const nestedMetaPath = path.join(DOCS_DIR, page, "meta.json");
      if (fs.existsSync(nestedMetaPath)) {
        const nestedMetaRaw = fs.readFileSync(nestedMetaPath, "utf-8");
        const nestedMeta = JSON.parse(nestedMetaRaw) as {
          title?: string;
          pages?: string[];
        };

        if (nestedMeta.pages && Array.isArray(nestedMeta.pages)) {
          navItem.children = nestedMeta.pages
            .filter((child) => child !== "index")
            .map((child) => {
              const childSlug = [page, child];
              const childDoc = getDoc(childSlug);
              return {
                title: childDoc?.title || child,
                slug: child,
                href: `/docs/${page}/${child}`,
              };
            });
        }
      }

      navItems.push(navItem);
    }
  }

  return navItems;
}
