# Setup Guide

## Prerequisites

- Node.js 22.x
- pnpm (via Corepack)
- Git

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd agentcommunity-docs

# Enable Corepack and activate the workspace pnpm version
corepack enable
corepack prepare pnpm@10.12.1 --activate

# Install dependencies using the workspace lockfile
pnpm install --frozen-lockfile
```

### 2. Environment Variables

Create `.env.local` file:

```bash
# Required for proper canonical URLs
NEXT_PUBLIC_APP_URL=https://agentcommunity.org
```

### 3. Development Servers

Start both apps simultaneously:

```bash
# Start both docs and blog apps
pnpm run dev

# Or start individually (path-based invocations)
pnpm run dev:docs    # http://localhost:3000/docs
pnpm run dev:blog    # http://localhost:3001/blog
```

### 4. Content Structure

```
content/
├── docs/           # Community documentation
│   ├── aid/        # AID-specific content
│   └── [pages]     # Community pages
└── blog/           # Blog posts
```

## Build Configuration

### Next.js Configuration

Each app has specific Next.js settings:

**apps/docs/next.config.mjs:**
```js
import { createMDX } from 'fumadocs-mdx';

const withMDX = createMDX({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
});

export default withMDX({
  reactStrictMode: true,
  experimental: { externalDir: true },
});
```

**apps/blog/next.config.mjs:**
```js
import { createMDX } from 'fumadocs-mdx';

const withMDX = createMDX({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
});

export default withMDX({
  reactStrictMode: true,
  experimental: { externalDir: true },
});
```

### ESLint Configuration

Both apps use Next.js ESLint configuration:

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"]
}
```

## Deployment: Vercel Setup

### Project Configuration

1. **Choose deployment mode:**
   - Separate projects per app (recommended):
     - Project A: Root directory `apps/docs`
     - Project B: Root directory `apps/blog`
   - Single project at repo root (advanced): uses root `vercel.json` to install/build both apps.

2. **Environment Variables:**
   - Set `NEXT_PUBLIC_APP_URL=https://agentcommunity.org` on each project

3. **Build Settings (pnpm + Corepack):**
   - Install Command:
     `corepack enable && corepack prepare pnpm@10.12.1 --activate && pnpm -v && pnpm install --frozen-lockfile`
   - Build Command (per app projects): `pnpm run build`
   - Build Command (root project): `pnpm run build` (builds docs then blog)
   - Output Directory: `.next` (default)

4. **Caching & pinning notes:**
   - We pin `fumadocs-mdx` to `11.6.11` via package.json and a pnpm override. If Vercel ever resolves a different version, redeploy with “Clear build cache”.

### Landing Page Configuration

Create a landing Vercel project with rewrite rules:

**vercel.json (landing project):**
```json
{
  "rewrites": [
    {
      "source": "/docs/:path*",
      "destination": "https://agentcommunitydocs.vercel.app/docs/:path*"
    },
    {
      "source": "/blog/:path*",
      "destination": "https://agentcommunityblog.vercel.app/blog/:path*"
    }
  ]
}
```

### Domain Configuration

1. **Primary Domains:**
   - `agentcommunity.org` (landing project)
   - `docs.agentcommunity.org` → redirect to `agentcommunity.org/docs`
   - `blog.agentcommunity.org` → redirect to `agentcommunity.org/blog`

2. **DNS Setup:**
   - Point `agentcommunity.org` to landing project
   - Set up subdomains with redirect rules

## Content Management

### Adding Documentation Pages

1. **Community Docs:** Add `.mdx` files to `content/docs/`
2. **AID Docs:** Add `.mdx` files to `content/docs/aid/`
3. **Blog Posts:** Add `.mdx` files to `content/blog/`

### Frontmatter Requirements

```yaml
---
title: "Page Title"
description: "Brief description"
---

# Content goes here
```

### Meta Configuration

Each content directory needs a `meta.json`:

```json
{
  "title": "Section Title",
  "description": "Section description",
  "icon": "lucide-icon-name"
}
```

## Copy Markdown Feature

### Overview

The documentation site includes a Copy Markdown feature that allows users to copy clean markdown content from any page. This feature provides both pretty URLs and fallback functionality.

### .mdx URLs

Every documentation page is available at a pretty `.mdx` URL:

- **Community Docs:** `https://agentcommunity.org/docs/{page}.mdx`
- **AID Docs:** `https://agentcommunity.org/aid/{page}.mdx`

**Examples:**
```bash
# Copy community docs
curl https://agentcommunity.org/docs/getting-started.mdx

# Copy AID specification
curl https://agentcommunity.org/aid/specification.mdx

# Copy with specific tool
curl https://agentcommunity.org/docs/getting-started.mdx | pbcopy
```

### Copy Button

Each documentation page includes a "Copy Markdown" button that:

1. **Tries pretty URL first:** `{page}.mdx`
2. **Falls back to API:** `/api/mdx/{section}/{page}`
3. **Copies to clipboard:** Clean markdown content with frontmatter, links, and code blocks preserved

### API Endpoints

Direct API access for automation:

- **Community Docs:** `https://agentcommunity.org/api/mdx/docs/{page}`
- **AID Docs:** `https://agentcommunity.org/api/mdx/aid/{page}`

**Examples:**
```bash
# Get raw markdown via API
curl https://agentcommunity.org/api/mdx/docs/index

# Use in scripts
curl https://agentcommunity.org/api/mdx/aid/specification > aid-spec.md
```

### Content Format

The exported markdown includes:

- **Page title and URL** as frontmatter
- **Original description** from frontmatter
- **Processed content** with:
  - Code blocks preserved
  - Internal links maintained as relative paths
  - Frontmatter and metadata included
  - JSX components rendered as markdown

### Usage Examples

```bash
# Download entire AID docs section
for page in index specification security versioning; do
  curl -s https://agentcommunity.org/aid/${page}.mdx > ${page}.md
done

# Create offline documentation bundle
curl -s https://agentcommunity.org/docs/index.mdx > docs.md
curl -s https://agentcommunity.org/aid/index.mdx >> docs.md

# Use with documentation tools
curl https://agentcommunity.org/docs/api.mdx | pandoc -f markdown -t pdf > api-docs.pdf
```

## Development Workflow

### Code Organization

```
apps/
├── docs/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/              # Utilities and configurations
│   └── content/          # MDX content (symlinked)
└── blog/
    ├── app/
    ├── components/
    ├── lib/
    └── content/
```

### Adding New Features

1. **Components:** Add to respective `components/` directory
2. **Utilities:** Add to respective `lib/` directory
3. **Pages:** Add to respective `app/` directory
4. **Styles:** Modify `globals.css` or component styles

### Testing Builds

```bash
# Test individual app builds
pnpm run build:docs
pnpm run build:blog

# Test full monorepo build
pnpm run build
```

## Troubleshooting

### Common Issues

**Build Failures:**
- Ensure Node.js 22.x in CI (Vercel default is fine). Locally, use `pnpm env use --global 22` or nvm.
- Clear Vercel build cache when bumping versions or lockfiles.
- We intentionally pin `fumadocs-mdx` to `11.6.11` to avoid `zod` peer pulls in 11.8.x.
- Verify content file formats and check for broken imports.

**Content Not Loading:**
- Verify file paths in content directories
- Check frontmatter syntax
- Ensure meta.json files exist

**Styling Issues:**
- Check Tailwind CSS configuration
- Verify component class names
- Test responsive breakpoints

### Debug Mode

Enable debug logging:

```bash
DEBUG=* pnpm run dev
```

### Performance Monitoring

Monitor build times and bundle sizes:

```bash
npm run build:docs -- --analyze
```

## Security Considerations

- Keep dependencies updated
- Use environment variables for sensitive data
- Implement proper CORS policies
- Set up proper authentication if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test builds locally
5. Submit a pull request
