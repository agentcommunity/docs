---
title: "Agent Interface Discovery 'aid'"
description: "Design Rationale"
icon: material/head-question-outline
---


### 1. Discovery is the missing layer

MCP, A2A, and other agent protocols define *how* agents speak once a connection exists. None specify *where* that connection lives. Today developers must:

* Search scattered documentation
* Copy-paste brittle JSON examples
* Manually wire secrets into each client

This friction slows adoption and causes fragile integrations.

### 2. Why ad-hoc fixes do not scale

**`.well-known` alone** works only when the agent endpoint is served from the same host as the brand domain. It fails for:

* Sub-domains such as `api.example.com`
* Services hosted on third-party infrastructure like `my-startup.vercel.com`
* Local-only agents that have no web server at all

**Central registries** create a new point of failure, drift unless providers remember to update them, and move control away from the domain owner.

### 3. AID design choices

| Goal                    | Decision                                                                   | Benefit                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Decentralized authority | Use a DNS TXT record at `_agent.<domain>`                                  | The domain owner remains the single source of truth                                                               |
| Simple on-ramp          | **Simple Profile**: TXT record holds `uri`, `proto`, optional `auth` hint  | A basic SaaS agent is discoverable with one query                                                                 |
| Power for complex cases | **Extended Profile**: TXT record contains a `config` pointer to `aid.json` | One manifest can list multiple implementations, detailed OAuth flows, config variables, and local Docker commands |
| No new secrets          | `aid.json` is a public menu, never a private recipe                        | Safe to cache and share; secrets stay with the user                                                               |
| Immediate deployability | Built on DNS and HTTPS, secured by DNSSEC and TLS                          | Works everywhere today, no extra infrastructure                                                                   |

### 4. How AID complements `.well-known`

The TXT record is an authoritative pointer. It can direct a client to:

* A manifest under `/.well-known/` (best practice)
* Any other HTTPS location if the manifest is hosted elsewhere

This indirection lets services move or outsource their agent endpoints without breaking discovery.

### 5. Outcome

A client needs only a domain name. Everything else—endpoint location, protocol choice, auth method, and even local execution commands—is auto-discovered and validated. Providers stop maintaining redundant setup guides, integrations ship faster, and the agentic web finally *just works*.
