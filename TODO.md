Below is a **stack-ranked roadmap** and a **stand-alone PRD** for each step.
No fluffy prose, no unnecessary file trees—just what your Cursor agent needs to build.

---

## Roadmap snapshot

| Priority | Deliverable                                  | Why first                                                                                                   |
| -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1        | **AID Generator Web UI + Public API (MVP)**  | Gives people a zero-install path to produce manifests/DNS TXT; unblocks every later step.                   |
| 2        | **Reference Profiles & Live DNS Deployment** | Concrete, working examples prove the spec, feed automated tests, and serve as tutorial material.            |
| 3        | **AID Resolver Playground**                  | Lets anyone type a domain and see the discovery flow in action—critical for adoption, demos, and debugging. |
| 4        | **Conformance Test-Suite & CI**              | Stops regressions, lets external impls self-certify. Builds trust in the ecosystem.                         |

---

# PRD 1 — AID Generator Web UI + Public API (MVP)

### Goal

Give devs a browser-based way to paste or upload a config and instantly get:

* `aid.json` manifest (download link)
* `aid.txt` DNS snippet
* Validation errors inline

### Success criteria

* 90 % of valid configs generate both files with zero manual edits.
* First-time user to valid output < 60 seconds.

### Scope

| In                                                | Out                           |
| ------------------------------------------------- | ----------------------------- |
| React SPA, no styling beyond basic layout         | Fancy branding/design         |
| REST `POST /generate` returning `{manifest, txt}` | Authentication, rate limiting |
| JSON schema validation in browser and API         | Advanced signing/JWS flow     |

### Key user flows

1. **Paste config** → click **Generate** → success panel with file links + copy buttons.
2. **Drop JSON file** → automatic validation → generate on submit.
3. **cURL/CI usage**: `curl -X POST /generate -d @config.json`.

### Functional requirements

* Validate against exported `AidGeneratorConfig` TS types compiled to JSON Schema.
* Auto-fill `contentVersion` with ISO date if missing.
* Return HTTP 422 with error list on invalid input.
* Size hard-limit 64 KB.

### Technical requirements

* Front-end: Next.js / React, client-side validation via `ajv`.
* API: Node/Express or Next API route wrapping existing `buildManifest` and `buildTxtRecord`.
* Package the generator core as a library (`@aid/core`) and import in both UI and API to avoid drift.
* CI: PR must run unit tests + e2e Cypress test (“paste config → expect files”).

### Open questions

* Deploy on Vercel free tier or dedicated sub-domain?
* Store past jobs? Probably not MVP.

---

# PRD 2 — Reference Profiles & Live DNS Deployment

### Goal

Publish real, queryable AID examples under **agentcommunity.org** to showcase patterns and feed tests.

### Success criteria

* `dig _agent.simple.agentcommunity.org TXT` returns simple inline record.
* `curl https://auth0.agentcommunity.org/.well-known/aid.json` returns manifest with correct checksum.
* Resolver playground (PRD 3) can resolve all references without special-casing.

### Scope

| Included profiles | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `simple`          | Single remote MCP endpoint (hello-world) |
| `multi-cloud`     | Two remote regions                       |
| `mixed`           | Remote + local Docker                    |
| `edgecase`        | Revocation URL, mTLS, deprecated flag    |

### Tasks

1. **Write configs** in `/examples/$name/config.json`.
2. **Generate** manifests + TXT using CLI.
3. **DNS**: Add `_agent.$name.agentcommunity.org` records (Route 53).
4. **Hosting**: Upload `aid.json` files to `https://$name.agentcommunity.org/.well-known/aid.json`.
5. **Automation**: GitHub Action regenerates and verifies on every push; fails if `dig` diff.

### Technical requirements

* Use same generator package as PRD 1.
* Scripts must run on vanilla `pnpm install && pnpm test`.
* All records TTL 3600.

### Acceptance tests

* CI job digs each sub-domain, compares TXT against repo copy.
* JSON schema validation passes for every generated manifest.

---

# PRD 3 — AID Resolver Playground

### Goal

Demo and debug tool: input a domain, watch the discovery chain (DNS → fetch `.well-known/aid.json`) step-by-step.

### Success criteria

* Entering `simple.agentcommunity.org` shows inline TXT path in < 1 s.
* Entering `auth0.agentcommunity.org` shows redirected fetch and renders parsed manifest.
* “Copy cURL” button for both TXT query and manifest fetch.

### Scope

| In                                       | Out                      |
| ---------------------------------------- | ------------------------ |
| Public web page, minimal styling         | Account system           |
| DNS lookup via Cloudflare DNS-over-HTTPS | Raw UDP dig from browser |
| Client-side caching (session only)       | Persistent history       |

### Functional requirements

* Display timeline: DNS TXT → optional `aid.json` fetch → parse.
* Highlight errors: missing TXT, 404 manifest, invalid schema.
* Support both simple and extended TXT formats.
* Code block viewer with syntax highlighting for manifest.

### Technical requirements

* Next.js page in the same repo; reuse validator from PRD 1.
* DNS queries via `https://cloudflare-dns.com/dns-query?type=TXT&name=_agent.$domain`.
* Fetch manifest with CORS proxy (Edge Function) to bypass CORS on arbitrary domains.
* Unit tests plus Playwright e2e.

### Metrics

* Page load < 150 KB JS bundle.
* 95 th percentile resolve latency < 2 s for cached examples.

---

# PRD 4 — Conformance Test-Suite & CI

### Goal

Let any implementation vendor drop a config/manifest pair and get a pass/fail report.

### Success criteria

* Running `pnpm test:conformance examples/` returns green for all shipped examples.
* External project can install `@aid/conformance` and run tests locally with one command.

### Scope

| In                     | Out                                             |
| ---------------------- | ----------------------------------------------- |
| JSON-schema validation | Network security fuzzing                        |
| TXT format linter      | Full DNS integration (already covered in PRD 2) |
| CLI exit codes for CI  | Web UI                                          |

### Technical requirements

* Package `@aid/conformance` exports `validateManifest`, `validateTxt`, `validatePair`.
* Jest test-runner, 100 % branch coverage on validators.
* GitHub Action runs suite on PR.

### Open questions

* Should we publish a badge (“AID-v1 conformant”) via shields.io?
* Future: negative tests (malformed configs) to ensure proper error messages.

---

**Next step:** build PRD 1 first. Once the Web UI/API is live, use it to generate the reference profiles for PRD 2, then wire the Resolver Playground on top.
