import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, Heading } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Date prefix regex: YYYY-MM-DD- at the start of a filename. */
const DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}-/;

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
 * Extract slug from a blog filename.
 * Input:  "2026-02-05-why-aid-now-supports-ucp.mdx"
 * Output: "why-aid-now-supports-ucp"
 */
function extractSlugFromFilename(filename: string): string {
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  return baseName.replace(DATE_PREFIX_REGEX, "");
}

/**
 * Extract date from a blog filename as a fallback.
 * Input:  "2026-02-05-why-aid-now-supports-ucp.mdx"
 * Output: "2026-02-05"
 */
function extractDateFromFilename(filename: string): string {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

/**
 * Parse a single blog file into a BlogPost.
 */
function parseBlogFile(filename: string): BlogPost | null {
  const ext = path.extname(filename);
  if (ext !== ".mdx" && ext !== ".md") return null;
  if (!DATE_PREFIX_REGEX.test(filename)) return null;

  const filePath = path.join(BLOG_DIR, filename);
  const rawFile = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawFile);

  const slug = extractSlugFromFilename(filename);

  // Prefer frontmatter date over filename date
  let date: string;
  if (data.date) {
    // gray-matter may parse date as a Date object; normalize to string
    const d = data.date;
    if (d instanceof Date) {
      date = d.toISOString().split("T")[0];
    } else {
      date = String(d);
    }
  } else {
    date = extractDateFromFilename(filename);
  }

  return {
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    author: (data.author as string) || "Agent Community",
    date,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: (data.image as string) || undefined,
    content,
    rawContent: rawFile,
    slug,
    headings: extractHeadings(content),
  };
}

/**
 * Get a single blog post by slug.
 * The slug is the filename without date prefix and extension.
 */
export function getPost(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const files = fs.readdirSync(BLOG_DIR);

  for (const file of files) {
    const ext = path.extname(file);
    if (ext !== ".mdx" && ext !== ".md") continue;

    if (extractSlugFromFilename(file) === slug) {
      return parseBlogFile(file);
    }
  }

  return null;
}

/**
 * Get all blog posts, sorted by date descending (newest first).
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR);
  const posts: BlogPost[] = [];

  for (const file of files) {
    const post = parseBlogFile(file);
    if (post) {
      posts.push(post);
    }
  }

  // Sort by date descending
  posts.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  return posts;
}

/**
 * Get all unique tags across all blog posts, sorted alphabetically.
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * Get all blog post slugs for generateStaticParams.
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR);
  const slugs: string[] = [];

  for (const file of files) {
    const ext = path.extname(file);
    if (ext !== ".mdx" && ext !== ".md") continue;
    if (!DATE_PREFIX_REGEX.test(file)) continue;

    slugs.push(extractSlugFromFilename(file));
  }

  return slugs;
}
