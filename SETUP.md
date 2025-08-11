# Setup Guide (Multi‑Zone Monorepo)

This repo contains two Next.js apps using Fumadocs:
- apps/docs → basePath `/docs` (Community + AID)
- apps/blog → basePath `/blog` (Blog)

## Local development
```bash
npm install
npm run dev
# docs → http://localhost:3000/docs
# blog → http://localhost:3001/blog
```

## Content
- Community docs: `content/docs/`
- AID docs: `content/docs/aid/`
- Blog: `content/blog/`

## Tabs
- Tabs are configured in `apps/docs/app/layout.tsx` using the two Fumadocs sources.
- AID tab label includes version badge: `v1.0.0`.

## Search
- Docs app exposes `/docs/api/search` merging Docs + AID.
- Blog has no search endpoint by design.

## Deployment (Vercel)
1) Create two projects from this repo:
   - agentcommunity-docs → Root Dir: `apps/docs`
   - agentcommunity-blog → Root Dir: `apps/blog`
2) Set env on both: `NEXT_PUBLIC_APP_URL=https://agentcommunity.org`
3) Landing project rewrites:
```json
{
  "rewrites": [
    { "source": "/docs/:path*", "destination": "https://agentcommunitydocs.vercel.app/docs/:path*" },
    { "source": "/blog/:path*", "destination": "https://agentcommunityblog.vercel.app/blog/:path*" }
  ]
}
```
4) Domains (after deploy)
- docs.agentcommunity.org → Redirect to `https://agentcommunity.org/docs`
- blog.agentcommunity.org → Redirect to `https://agentcommunity.org/blog`

## Canonical
- Path-first canonical: `agentcommunity.org/docs` and `/blog`
- Set `NEXT_PUBLIC_APP_URL` for correct canonical/JSON‑LD.

## Troubleshooting
- 404 for assets/data under main domain: ensure rewrites include the basePath (`/docs/_next/*`, `/blog/_next/*` are covered by the two wildcard rules).
- Local: confirm pages load under the correct basePath and that SPA navigation doesn’t full-reload.
