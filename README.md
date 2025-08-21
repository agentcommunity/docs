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

### Local Development
```bash
npm install
npm run dev
# docs → http://localhost:3000/docs
# blog → http://localhost:3001/blog
```

### Project Structure
- `apps/docs/` - Documentation site with Community and AID sections
- `apps/blog/` - Blog site  
- `content/docs/` - Community documentation content
- `content/docs/aid/` - AID documentation content
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

### Environment Variables
Set `NEXT_PUBLIC_APP_URL=https://agentcommunity.org` for proper canonical URLs.

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
