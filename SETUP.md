# Setup Guide (Local-Only Dual Sources)

This site uses Fumadocs with two local sources for tabs:
- Community: `content/docs/`
- AID: `content/docs/aid/`

## Tabs

- Each section has a `meta.json` to control ordering.
- Tabs are configured in `app/docs/layout.tsx`; we switch between `source.pageTree` and `aidSource.pageTree`.

## Structure

```
content/docs/
├── index.mdx              # Main community landing (Tab 1)
├── work-items/            # Community work items (Tab 1)
├── aid/                   # AID documentation (Tab 2)
│   ├── index.mdx
│   ├── specification.mdx
│   ├── rationale.mdx
│   ├── versioning.mdx
│   ├── quickstart/        # Subsection (Tab 2)
│   │   ├── index.mdx
│   │   ├── quickstart_a2a.mdx
│   │   ├── quickstart_mcp.mdx
│   │   └── quickstart_openapi.mdx
│   │   └── meta.json
│   └── meta.json          # <--- REQUIRED for AID tab
└── meta.json              # <--- REQUIRED for main docs tab
```

## Example meta.json for a section

`content/docs/aid/meta.json`:
```json
{
  "title": "Agent Interface Discovery (AID)",
  "pages": [
    "index",
    "quickstart",
    "specification",
    "rationale",
    "versioning"
  ]
}
```

## Sidebar Tab Configuration

In `/app/docs/layout.tsx`:
```tsx
sidebar={{
  defaultOpenLevel: 0,
  tabs: [
    {
      title: '.agent Community',
      description: 'The home for open source agent collaboration',
      url: '/docs',
    },
    {
      title: 'Agent Interface Discovery (AID)',
        description: 'DNS-based discovery protocol for the agent web',
      url: '/docs/aid',
    },
  ],
  // Custom footer links at the bottom of the sidebar
  footer: (
    <div className="flex flex-row gap-4 px-4 pb-4 items-center">
      <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
      <a href="https://github.com/orgs/agentcommunity/discussions" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discussion</a>
      <a href="https://github.com/agentcommunity" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
    </div>
  ),
}}
```

## Troubleshooting

- **Tabs not showing or not updating:**
  - Ensure each section has a valid `meta.json`.
  - Confirm the tab URL matches the section (e.g., `/docs/aid`).

## Summary

- Two local sources: community + AID
- Tabs controlled by URL and per-source trees
- All docs are local; no remote fetches

## Production

- Set `NEXT_PUBLIC_APP_URL=https://agentcommunity.org` for canonical URLs
- DNS aliases:
  - `docs.agentcommunity.org` → redirects to `/docs`
  - `blog.agentcommunity.org` → redirects to `/blog`

For more, see the [Fumadocs Sidebar Tabs documentation](https://fumadocs.dev/docs/ui/sidebar-tabs) (if available) or the official Fumadocs docs.
