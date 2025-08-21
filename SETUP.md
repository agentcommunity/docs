# Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd agentcommunity-docs
npm install
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
npm run dev

# Or start individually:
npm run dev:docs    # http://localhost:3000/docs
npm run dev:blog    # http://localhost:3001/blog
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

1. **Create Vercel Projects:**
   - **agentcommunity-docs**: Root directory `apps/docs`
   - **agentcommunity-blog**: Root directory `apps/blog`

2. **Environment Variables:**
   - Set `NEXT_PUBLIC_APP_URL=https://agentcommunity.org` on both projects

3. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)

### Landing Page Configuration

Create a landing Vercel project with rewrite rules:

**vercel.json:**
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
npm run build:docs
npm run build:blog

# Test full monorepo build
npm run build
```

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Next.js and Fumadocs versions
- Verify content file formats
- Check for broken imports

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
DEBUG=* npm run dev
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
