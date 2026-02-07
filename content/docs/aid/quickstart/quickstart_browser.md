---
title: 'How to — Browser'
description: 'Discover agents in the browser via DNS-over-HTTPS'
icon: material/web
---

# Browser

Uses DNS-over-HTTPS under the hood.

## Install

```bash
pnpm add @agentcommunity/aid
```

## Discover by Domain

```ts
import { discover } from '@agentcommunity/aid/browser';

const { record, ttl } = await discover('supabase.agentcommunity.org');
console.log(record.proto, record.uri, ttl);
```

## Options

```ts
// Hint protocol-specific subdomain first
await discover('example.com', { protocol: 'mcp' });

// Custom DoH endpoint (defaults to Cloudflare)
await discover('example.com', { dohProvider: 'https://dns.google/dns-query' });
```

## Parse Only

```ts
import { parse } from '@agentcommunity/aid';
console.log(parse('v=aid1;uri=https://api.example.com/mcp;proto=mcp').uri);
```

Security

- Remote URIs must be `https://`.
- Description is limited to 60 UTF-8 bytes.
- `proto` must be one of supported tokens.

## See also

- [Quick Start home](./quickstart)
- [TypeScript / Node.js](./quickstart_ts)
- [Go](./quickstart_go)
- [Python](./quickstart_python)
- [Java](./quickstart_java)
- [.NET](./quickstart_dotnet)
- [Protocols & Auth Tokens](../Reference/protocols)
- [Troubleshooting](../Reference/troubleshooting)
- [Conformance](../Tooling/conformance)

---
 info "Implementation Files" - [Generated constants](https://github.com/agentcommunity/agent-identity-discovery/blob/main/packages/aid/src/constants.ts) - [Generated spec types](https://github.com/agentcommunity/agent-identity-discovery/blob/main/protocol/spec.ts)
