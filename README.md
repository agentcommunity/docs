# Agent Community Documentation

A monorepo containing documentation and blog sites built with Next.js and Fumadocs.

## 📖 Documentation Guide

This repository contains multiple documentation files to help you understand and work with the codebase:

### 📋 README.md (This File)
**Purpose**: Main entry point and developer guide
- Project overview and architecture  
- Quick start guide
- Development workflows
- Links to detailed documentation

### 🏗️ ARCHITECTURE.md
**Purpose**: System architecture and design decisions
- High-level system overview
- File structure and organization
- Technical design decisions
- Deployment architecture

### 📚 GUIDE.md  
**Purpose**: Implementation tutorials and how-to guides
- Step-by-step implementation instructions
- Code examples and patterns
- Best practices and conventions
- Troubleshooting guides

### ⚙️ SETUP.md
**Purpose**: Detailed setup and deployment instructions
- Environment setup
- Configuration details  
- Deployment procedures
- Platform-specific guides

## 🚀 Quick Start

### Project Structure
- `apps/docs/` - Documentation for .agent Community and work items
  - `.source/index.ts` - Auto-generated MDX source files
  - `source.config.ts` - Fumadocs configuration 
- `apps/blog/` - Blog site  
  - `.source/index.ts` - Auto-generated MDX source files
  - `source.config.ts` - Fumadocs configuration 
- `content/docs/` - Community documentation
- `content/docs/aid/` - AID documentation 
- `content/blog/` - Blog content

## 🎯 Key Features

- **Multi-zone architecture** with separate apps for docs and blog
- **Sidebar tabs** switching between Community and AID documentation
- **Shared navigation** with consistent UI across sections
- **Scoped search** functionality
- **SEO optimized** with proper meta tags and structured data
- **Mermaid diagram support**
- **Markdown processing** with copy and "Open in" actions

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development servers
- `npm run build` - Build all apps
- `npm run build:docs` - Build docs app only
- `npm run build:blog` - Build blog app only

### Fumadocs Source Generation

Both the docs and blog apps use Fumadocs for content management. The MDX source files are automatically generated to optimize performance:

#### What it does:
- **Generates `.source/index.ts`** - Creates runtime objects for all MDX content
- **Scans content directories** - Automatically discovers all `.md` and `.mdx` files
- **Creates type-safe imports** - Generates TypeScript interfaces for content
- **Optimizes build performance** - Pre-processes content for faster runtime loading

#### When to regenerate:
- After adding new MDX files to content directories
- After modifying `source.config.ts` configuration
- After changing the directory structure
- If the `.source/index.ts` file gets corrupted or deleted

#### Commands:
```bash
# Regenerate docs app sources
cd apps/docs && npx fumadocs-mdx

# Regenerate blog app sources
cd apps/blog && npx fumadocs-mdx

# Or use npm scripts (docs app only)
cd apps/docs && npm run prebuild  # runs fumadocs-mdx automatically
```

The docs app automatically runs source generation during build via the `prebuild` script, while the blog app generates sources on-demand.

### Environment Variables
- Set `NEXT_PUBLIC_APP_URL=https://docs.agentcommunity.org` for the docs subdomain deployment (docs at root)
- Set `NEXT_PUBLIC_APP_URL=https://agentcommunity.org` for traditional deployment (docs under /docs)

### Local Development
```bash
# Install once
pnpm install --frozen-lockfile

# Run both apps
pnpm run dev

# Or run individually
pnpm run dev:docs   # http://localhost:3000
pnpm run dev:blog   # http://localhost:3001/blog
```

If Corepack prompts appear, run `pnpm -v` then `pnpm run dev` again.

## 📦 Deployment

Deploy to Vercel with two separate projects:
- **agentcommunity-docs**: Root directory `apps/docs`
- **agentcommunity-blog**: Root directory `apps/blog`

Configure rewrites in your landing project:
```json
{
  "rewrites": [
    { "source": "/docs/:path*", "destination": "https://agentcommunitydocs.vercel.app/docs/:path*" },
    { "source": "/blog/:path*", "destination": "https://agentcommunityblog.vercel.app/blog/:path*" }
  ]
}
```

## 🔗 Domains & URLs

- **Canonical URLs**: `agentcommunity.org/docs` and `/blog`
- **Subdomain redirects**:
  - `docs.agentcommunity.org` → `agentcommunity.org/docs`
  - `blog.agentcommunity.org` → `agentcommunity.org/blog`

## 📚 Further Reading

- [🏗️ Architecture](ARCHITECTURE.md) - System design and technical overview
- [📚 Implementation Guide](GUIDE.md) - How to implement features and patterns  
- [⚙️ Setup Guide](SETUP.md) - Detailed setup and deployment instructions
