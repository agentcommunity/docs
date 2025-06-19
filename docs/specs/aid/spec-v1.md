---
title: "Agent Interface Discovery 'aid'"
description: "Specification"
icon: material/file-document-outline
---


# **Agent Interface Discovery (AID) via DNS – v1**

<!----- Part 1 — Normative Core ----->

**Abstract:**

As the ecosystem of AI agents and agentic services expands, a fundamental interoperability challenge emerges: *How can a client application or another agent discover the endpoint and configuration for a service, given only its domain name?* Current methods rely on manual configuration, proprietary client-specific files, and fragmented documentation. This hinders scalability and creates a poor user experience.

This document proposes **Agent Interface Discovery (AID)**, a simple, decentralized discovery protocol built on existing Internet standards. AID uses a DNS TXT record to enable a client to discover an agent's service information with a single query.

The protocol features a dual-mode design to balance ease-of-use with expressive power:

- **Simple Profile:** For basic, remotely-hosted agents, the DNS record itself contains enough information (URI, protocol, auth hint) for immediate connection with no additional steps.
- **Extended Profile:** For more complex agents—including those that may run locally via packages (Docker, NPX, etc.) or have multiple endpoints—the DNS record can optionally point to a standardized **AID Manifest** (a JSON configuration file). This manifest provides a rich, unambiguous description of multiple implementations, detailed authentication requirements, and configuration options.

AID is pragmatic, protocol-agnostic (supporting MCP, A2A, etc.), and immediately deployable. It provides a robust foundation for a truly interoperable agentic web by leveraging infrastructure that is already ubiquitous (DNS and HTTPS).

---

## 0. Glossary

| Term | Meaning |
| --- | --- |
| **AID Client** | Any software that performs discovery according to this specification (e.g., an IDE plugin, CLI tool, or agent orchestrator). |
| **Provider** | The entity that controls the service's domain and is responsible for publishing the DNS record and hosting the AID Manifest. |
| **Simple Profile** | The discovery mode where all necessary information is contained within the DNS TXT record itself. |
| **Extended Profile** | The discovery mode where the DNS TXT record points to a more detailed AID Manifest. |
| **AID Manifest** | The canonical JSON file (`aid.json`) that describes one or more ways to connect to or run an agent service. |
| **Implementation** | A single, concrete way to use an agent, as defined in the manifest (e.g., a cloud API, a local Docker container). |
| **Schema Version** | The version of the AID Manifest format itself. For this specification, the current value is `"1"`. |
| **Content Version** | A provider-defined string within the manifest that changes whenever the manifest's *content* is updated. Used for client-side cache invalidation. |
| **Implementation Status** | Indicates if an implementation is "active" or "deprecated". Default: "active". |

*The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and "MAY" in this document are to be interpreted as described in RFC 2119 and RFC 8174.*

---

## 1. Introduction

The proliferation of Large Language Models (LLMs) has led to the rise of autonomous AI agents and services. These agents require access to a wide array of tools, but a critical gap remains: **discovery**. Today, connecting an AI tool to a service is a manual, error-prone, and fragmented process.

This proposal introduces **Agent Interface Discovery (AID)** to solve this problem. By leveraging the Domain Name System (DNS), AID provides a simple, decentralized, and standardized mechanism for any client to discover the necessary connection and configuration details for an agent service given only its domain name.

### 1.1. Design Goals

- **Zero-Configuration User Experience:** Enable a user to simply enter a domain name (e.g., `supabase.com`) into their AI tool and have it automatically discover and configure the corresponding agent service.
- **Decentralized Control:** Empower domain owners to advertise their own agent services directly via their DNS records, without requiring registration in a central directory.
- **Pragmatism over Purity:** Leverage existing, universally-supported Internet infrastructure (DNS TXT records and HTTPS) to ensure immediate deployability.
- **Dual-Mode Flexibility:** Provide a frictionless on-ramp for simple remote services while also offering a powerful, extensible path for complex, multi-implementation agents. Simple things should be simple, and complex things should be possible.
- **Unambiguous Contract:** Define a single, standardized format for the configuration payload (the AID Manifest) to ensure reliable interoperability.
- **Security by Design:** Build on well-understood security models like DNSSEC for record integrity and TLS for transport security.

### 1.2. A Pragmatic v1: The TXT On-Ramp and v2 Migration Path

The choice of DNS `TXT` records for AID v1 is a deliberate trade-off, prioritizing universal reach over technical purity. While modern DNS records like `HTTPS/SVCB` (RFC 9460) offer a more structured alternative, their client support and ease of configuration are not yet ubiquitous.

AID v1 uses the tool that every domain owner can leverage today. This proposal explicitly defines **`HTTPS/SVCB` records as the target for a future AID v2.0.** By establishing the `_agent` service name and the key-value semantics in v1, we pave a clear migration path. The ecosystem can adopt the discovery logic now, with the underlying DNS record type evolving as modern infrastructure becomes universally available.

OPTIONAL preview record for early adopters
`_agent.example.com. 3600 IN HTTPS 1 . alpn="aid" port=443`
or with SVCB:
`_agent.example.com. 3600 IN SVCB 0 agent.example.com alpn="aid" port=443`

Clients MUST ignore SVCB/HTTPS records until v2 is published; providers can publish them now without breaking v1.

## 2. The AID Protocol

AID operates in two modes: a **Simple Profile** using only a DNS TXT record, and an **Extended Profile** which uses the DNS record to point to a more detailed JSON **AID Manifest**.

### 2.1. The AID DNS Record

A domain advertises its agent service by publishing a DNS TXT record at a well-known subdomain: `_agent.<domain>`.

The record's content is a single string composed of semicolon-delimited `key=value` pairs. Keys should be concise (ideally ≤9 characters) and use US-ASCII. Registry keys MAY exceed 9 chars once SVCB is adopted; for TXT aim for brevity. To keep DNS responses efficient, the record should be kept under 255 characters. If a record exceeds this length, it may be split into multiple 255-byte strings by DNS; AID Clients **MUST** concatenate these strings before parsing (as per RFC 6763).

**Supported Keys:**

| Key | Requirement | Description | Example Value |
| --- | --- | --- | --- |
| **v** | **Required** | Version of the AID specification. Must be `aid1`. | `v=aid1` |
| **uri** | Required **iff** at least one *remote* implementation exists (MUST be absent if all implementations are local). | The primary remote endpoint URI. In a Simple Profile, this is the only endpoint. In an Extended Profile, this serves as a fallback for simple clients and should correspond to the primary `remote` implementation in the manifest. | `uri=https://api.example.com/agent` |
| **proto** | Required **iff** at least one *remote* implementation exists (MUST be absent if all implementations are local). | Supported protocol(s) at the primary URI. A comma-separated list; the first is preferred. | `proto=mcp` or `proto=mcp,a2a` |
| **auth** | Recommended | Authentication hint(s) for the primary URI. See Appendix A for registry. | `auth=pat` or `auth=oauth2_device,oauth2_code` |
| **env** | Optional | Environment indicator for the endpoint. | `env=prod` |
| **config** | Optional | Absolute `https://` URL of an AID Manifest (`aid.json`). Its presence signals the Extended Profile is available. The URL should use a well-known path (see RFC 8615). | `config=https://example.com/.well-known/aid.json` |

If a service exposes *only* local implementations (e.g., purely-offline tooling), providers MAY omit `uri` and `proto`.

#### 2.1.2. Multi-string TXT example

```
_agent.big-container.com. IN TXT (
  "v=aid1;uri=https://api.big-container.com/mcp;proto=mcp;"
  "config=https://big-container.com/.well-known/aid.json"
)
```

### 2.1.3. Reserved token registries

The following registries **MUST** be used for new tokens. `proto`, `auth`, and future key namespaces are allocated via the provisional *AID registries* (see [Appendix H](#appendix-h-iana-considerations)). Until formal IANA review, allocation is "First-Come, Expert-Review".

### 2.1.4. Example DNS Records

- **Simple Remote Profile (basic SaaS agent):**
    
    ```
    _agent.simple-agent.com. IN TXT "v=aid1;uri=https://api.simple-agent.com/mcp;proto=mcp;auth=pat"
    
    ```
    
- **Extended Manifest Profile (complex service):**
    
    ```
    _agent.supabase.com. IN TXT "v=aid1;uri=https://api.supabase.com/v1;proto=mcp;config=https://supabase.com/.well-known/aid.json"
    
    ```
    

### 2.2. The AID Manifest (JSON Configuration Manifest)

When the `config` key is present, it points to an **AID Manifest**, a JSON document that provides a rich, structured description of the agent service. The manifest **MUST** be accessible via HTTPS.

**JSON-Schema Link**

A canonical JSON Schema for `schemaVersion: "1"` is maintained at: 
[`https://aid.dev/schema/v1/aid.schema.json`](https://aid.dev/schema/v1/aid.schema.json)

Providers **MAY** reference it in tooling; clients **MAY** use it for validation.

### 2.2.1. Core Manifest Schema

```json
{
  "schemaVersion": "1",
  "name": "Example Agent Service",
  "metadata": {
    "contentVersion": "2025-06-17.1",
    "documentation": "https://example.com/docs/agents",
    "revocationURL": "https://example.com/agent/status"
  },
  "implementations": [
    /* One or more implementation objects */
  ],
  "signature": {
    /* Optional: A JWS (RFC 7515) or similar signature for the manifest */
  }
}

```

- **`schemaVersion`**: **Required**. String. The version of the manifest schema. For this specification, it **MUST** be `"1"`.
- **`name`**: **Required**. String. Human-readable name of the agent service.
- **`metadata`**: Optional. Object for non-essential metadata.
    - **`contentVersion`**: Optional but **Recommended**. String. A provider-defined version string for the manifest's *content*. Clients **MUST** use this to manage their cache.
    - **`documentation`**: Optional. String. URL to human-readable documentation.
    - **`revocationURL`**: Optional. String. An absolute HTTPS URL for a real-time status check. See Appendix C.

- **`implementations`**: **Required**. Array of one or more **Implementation Objects**.
- **`signature`**: *Reserved for future use; detached JWS signing is expected in v2.*

### 2.2.2. Implementation Object Schema

Each object in the `implementations` array describes one way to run or connect to the agent.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`name`** | String | Yes | A short, human-readable name for the implementation. Displayed to the user. Ex: `"Cloud (Production)"`. |
| **`type`** | String | Yes | Defines the execution environment. Must be either `"remote"` or `"local"`. |
| **`protocol`** | String | Yes | The agent communication protocol. Ex: `"mcp"`, `"a2a"`. |
| **`tags`** | Array of Strings | No | Optional tags for filtering. Ex: `["prod", "beta", "docker"]`. |
| **`uri`** | String | If `type` is `"remote"` | The base HTTPS URL for the agent's remote API endpoint. |
| **`package`** | Object | If `type` is `"local"` | Describes the software package to be executed. See **Package Object Schema** below. |
| **`execution`** | Object | If `type` is `"local"` | Defines the command and arguments to run the local package. See **Execution Object Schema** below. |
| **`authentication`** | Object | Yes | Describes the required authentication method. See **Section 2.2.4**. |
| **`configuration`** | Array of Objects | No | An array of user-configurable settings. See **Configuration Object Schema** below. |
| **`requiredPaths`** | Array of Objects | No | An array of local filesystem paths the user must provide. See **Required Path Object Schema** below. |
| **`status`** | `"active"`\|`"deprecated"` | No | If `"deprecated"`, clients SHOULD hide or warn. |
| **`revocationURL`** | String | No | Overrides global `revocationURL` for this implementation only. |
| **`platformOverrides`** | Object | No | Keys MAY include arch-specific labels, e.g. `"linux_amd64"`, `"linux_arm64"`, `"macos_arm64"`. |
| **`certificate`** | Object | If `authentication.scheme` = `mtls` | `{ "source":"file"\|"enrollment", "enrollmentEndpoint":"https://…" }` |

#### **Package Object Schema (`package`)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`manager`** | String | Yes | The package manager used. Ex: `"docker"`, `"npx"`, `"pip"`. |
| **`identifier`** | String | Yes | The name, image, or identifier of the package. Ex: `"grafana/mcp:latest"`. |
| **`digest`** | String | No | An optional content digest (e.g., `"sha256:..."`) for security verification. |

#### **Execution Object Schema (`execution`)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`command`** | String | Yes | The executable to run. Ex: `"docker"`. |
| **`args`** | Array of Strings | Yes | An array of arguments passed to the command. Supports variable substitution. |
| **`platformOverrides`** | Object | No | An object to specify different `command` or `args` based on client OS (`"windows"`, `"linux"`, `"macos"`). |

#### **Configuration Object Schema (for `configuration` array)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`key`** | String | Yes | The internal key for this setting, used in variable substitution. Ex: `"LOG_LEVEL"`. |
| **`description`** | String | Yes | Human-readable text for the UI prompt. Ex: `"Set the logging verbosity"`. |
| **`type`** | String | Yes | The data type. Allowed values: `"string"`, `"boolean"`, `"integer"`. |
| **`defaultValue`** | Any | No | The default value for this setting. |
| **`secret`** | Boolean | No | If true, clients MUST request the value in a masked / secure input. |

#### **Required Path Object Schema (for `requiredPaths` array)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`key`** | String | Yes | The internal key for this path, used in variable substitution. Ex: `"config_dir"`. |
| **`description`** | String | Yes | Human-readable text for the UI prompt. |
| **`type`** | String | No | Hint for the UI file picker. Either `"file"` or `"directory"`. Defaults to `"file"`. |

### 2.2.3. Variable Substitution

The `execution.args` array supports variable substitution to construct commands dynamically.

- `${package.identifier}`: Replaced by the package identifier.
- `${auth.<key>}`: Replaced by the secret provided by the user for the corresponding `authentication.credentials` `key`.
- `${path.<key>}`: Replaced by the local path provided by the user for the corresponding `requiredPaths` `key`.
- `${config.<key>}`: Replaced by the value set by the user for the corresponding `configuration` `key`.

To prevent injection vulnerabilities, clients **MUST** treat substituted values as atomic arguments and **MUST NOT** allow them to be parsed by a shell.

If a substitution resolves to an empty string, the client **MUST** omit that argument *and* any immediately-preceding token that begins with `-` or `--`.

Example:
```
"--token=${auth.token}"  → omitted entirely if token unset
```

### 2.2.4. Authentication Schema and Patterns

The `authentication` object unambiguously describes how a client should acquire credentials and apply them.

#### **Authentication Object Schema**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`scheme`** | String | Yes | The primary authentication token from the registry in Appendix A. Use `"none"` for no authentication. |
| **`description`** | String | If `scheme` is not `"none"` | Human-readable text for the UI. Ex: `"Your GitHub Personal Access Token with 'repo' scope."`. |
| **`tokenUrl`** | String | No | An optional HTTPS URL where the user can generate the required credential. Clients **SHOULD** display this as a link. |
| **`credentials`** | Array of Objects | No | For multi-part secrets (like Client ID/Secret). If present, prompts are generated from this array. See **Credential Item Schema** below. |
| **`oauth`** | Object | If `scheme` is an `oauth2_*` type | Contains the necessary endpoints and scopes for an OAuth 2.0 flow. See **OAuth Object Schema** below. |
| **`placement`** | Object | No | Describes how to *apply* the final token. Required for `remote` implementations unless `scheme` is `"none"`. See **Placement Object Schema** below. |

#### **Credential Item Schema (for `credentials` array)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`key`** | String | Yes | The internal key for this secret, used in `${auth.<key>}` substitution. |
| **`description`** | String | Yes | Human-readable text for this specific secret's UI prompt. |

#### **OAuth Object Schema (`oauth`)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`authorizationEndpoint`** | String | For `oauth2_code` | The URL for the authorization code grant flow. |
| **`deviceAuthorizationEndpoint`** | String | For `oauth2_device` | The URL for the device authorization flow. |
| **`tokenEndpoint`** | String | Yes | The URL to exchange a code or credentials for an access token. |
| **`scopes`** | Array of Strings | No | An optional list of required OAuth scopes. |

#### **Placement Object Schema (`placement`)**

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| **`in`** | String | Yes | Where to place the token. One of: `"header"`, `"query"`, `"cli_arg"`. |
| **`key`** | String | Yes | For `"header"`/`"query"`, the name of the header/parameter. For `"cli_arg"`, the name of the argument (e.g., `"--token"`). |
| **`format`** | String | No | A format string for the value. `{token}` is the placeholder. Ex: `"Bearer {token}"`. Defaults to `"{token}"`. |

### 2.3. Client Discovery Logic

An AID Client **MUST** perform the following steps for a given `<domain>`:

1. **DNS Lookup:** Query the DNS `TXT` record for `_agent.<domain>`. If no record is found, discovery fails.
2. **Concatenate and Parse:** If the DNS response contains multiple strings for the `TXT` record, the client **MUST** concatenate them into a single string. Then, parse the semicolon-delimited `key=value` pairs. It **MUST** verify that `v=aid1` is present.
3. **Profile Selection:** Check for the `config` key.
    - **If NO `config` key (Simple Profile):** The client uses the `uri`, `proto`, and `auth` hint from the TXT record to connect. Discovery is complete.
    - **If YES `config` key (Extended Profile):** The client **MUST** proceed to fetch the manifest. If a client does not support manifests, it may fall back to using the `uri` and `proto` from the TXT record.
4. **Fetch Manifest:** Perform an HTTPS `GET` request to the URL specified by `config`. The client **MUST** perform standard TLS certificate validation.
5. **Process Manifest:** Upon retrieving a valid JSON manifest:
   a. Validate that `schemaVersion` is a version the client understands (e.g., `"1"`).
   b. Identify viable `implementations` based on the client's capabilities (e.g., a web client cannot run a `local` Docker implementation).
   c. If multiple implementations are viable, the client **MAY** present these options to the user using the `name` field for each.
   d. For the chosen implementation, the client **MUST** follow the instructions in the `authentication`, `configuration`, and `execution` objects to obtain credentials and start/connect to the agent service.
   e. If chosen implementation's "status" = "deprecated", client MUST display a warning or require user confirmation.
6. **Cache Manifest:** The client **MUST** cache the manifest according to the guidance in Appendix B.

### 2.4. Version interlock

The manifest's `"schemaVersion"` **MUST** share the same major number as the TXT `v=` token.
Example: `v=aid2` → `"schemaVersion":"2.0"`.

If the TXT record advertises `v=aid1`, any manifest with `schemaVersion` beginning with '2.' **MUST** be rejected.

### 2.5. Error Handling

- **Missing mandatory TXT keys** → treat as "no AID record".
- **Unparseable manifest** → fall back to Simple Profile if possible, otherwise fail with a clear error to the user.
- **Unknown `schemaVersion`** → client MAY attempt best-effort parse but MUST warn the user and MUST NOT execute any `local` implementation.
- **HTTPS fetch returns ≥400** → treat as transient network error; client MAY retry after exponential back-off.
- **DNSSEC failure** → client MAY continue if user overrides.

<!-- See Part 2 for non-normative guidance -->

---

## 3. Discussion and Rationale *(Non-normative)*

### 3.1. Why a Dual-Mode Standard?

The dual-mode approach addresses the tension between simplicity and flexibility. The Simple Profile provides a frictionless on-ramp for the 80% case, while the Extended Profile makes complex, multi-faceted services possible without burdening simple ones.

### 3.2. Alternatives Considered

- **DNS SRV Records:** SRV records are designed for service location but cannot carry the rich metadata (protocol, auth, manifest URL) that AID requires. Using them would necessitate a second TXT lookup, making a single TXT record a simpler v1 choice.
- **Centralized Service Registry:** A central registry creates a dependency on a new authority. AID is intentionally decentralized, allowing any domain owner to participate without prior registration.
- **Decentralized Identifiers (DIDs):** DIDs introduce significant complexity and new infrastructure. AID achieves similar discovery goals by reusing the web's native identifiers (DNS names, URLs) and existing trust infrastructure (DNSSEC, TLS), making adoption far easier.

### 3.3. AID as a Bootstrapping Layer, Not a Final Identity Solution

It is critical to understand that AID is a **discovery and configuration** protocol, not a cryptographic identity protocol. It answers *where* and *how* to connect to a service. It is designed to work in concert with protocol-specific identity mechanisms.

The intended flow is:

1. **AID (Discovery):** A client uses AID to find the correct endpoint for a service and learns how to connect.
2. **Protocol-Specific Handshake (Identity):** The client then engages the endpoint using the discovered protocol (e.g., A2A). As part of that protocol's own specification, it would perform an identity verification step, such as fetching an A2A "Agent Card" containing public keys.

**AID gets you to the right door; the agent protocol verifies who is behind it.**

---

## 4. Security Considerations *(Non-normative)*

- **DNSSEC for Record Integrity:** Providers are **STRONGLY ENCOURAGED** to sign their DNS records with DNSSEC. Clients **SHOULD** validate the signature on the AID record to ensure it has not been tampered with.
- **HTTPS and TLS:** All `uri` and `config` URLs **MUST** use `https://`. Clients **MUST** perform standard TLS certificate validation, including host name matching.
- **No Secrets in Public Records:** The DNS record and AID Manifest are public. They **MUST NOT** contain any secrets (tokens, keys, passwords). They only describe *how* to authenticate.
- **Separation of Concerns:** AID discovers the service; the agent protocol itself is responsible for securing the communication channel and verifying agent identity.
- **Clients SHOULD resolve DNS via DoH or DoT when available.**
- **Clients SHOULD apply IDNA-2008 A-label conversion before DNS lookup for non-ASCII domains.**
- **Providers MAY publish CAA records to restrict certificate issuance for agent endpoints.**

### 4.1. Client Security Responsibilities for Local Execution

The `execution` block in a manifest represents a command retrieved from the internet and **MUST** be treated as untrusted. Clients that support `local` implementations **MUST** adhere to the following:

1. **Explicit User Consent:** Before executing a command for the first time, the client **MUST** display the full, resolved command (with all variables substituted) to the user and require their explicit, affirmative consent.
2. **Command Integrity Verification:** The client **MUST** compute and store a cryptographic fingerprint (e.g., SHA-256 hash) of the `execution` object. If a newly fetched manifest has a different fingerprint for a previously approved implementation, the client **MUST** treat it as a new, untrusted command and re-trigger the full consent process.
3. **Prevent Command Injection:** The client **MUST NOT** execute the command in a shell that interprets arguments. Substituted values **MUST** be passed as distinct, atomic arguments to the underlying OS `exec` call.
4. **Sandboxing:** It is **STRONGLY RECOMMENDED** that local execution commands be run within a sandboxed environment with minimum necessary permissions.

---

## 5. Path Forward *(Non-normative)*

This v1 specification provides a stable foundation for building an interoperable agent ecosystem. The community can drive adoption through:

- **Reference Implementations:** Building open-source libraries (e.g., in TypeScript, Go, Python) for both clients and providers to simplify adoption.
- **Manifest Generator Tools:** Creating interactive tools to help providers generate valid `aid.json` manifests from existing configuration or documentation.
- **Evolving the Standard:** Future versions may incorporate feedback and evolve. Potential future work includes:
    - **IANA Registration:** Formalizing the `_agent` service label and registries for `proto` and `auth` tokens via the IANA process (RFC 6335) to ensure long-term, collision-free interoperability.
    - **SVCB/HTTPS Migration:** Defining an official profile for using `HTTPS` records (RFC 9460) as a v2 alternative to `TXT` records.

---

## References

- RFC 1035 – Domain Names: Implementation and Specification
- RFC 2119 / RFC 8174 – Key Words for Use in RFCs to Indicate Requirement Levels
- RFC 6763 – DNS-Based Service Discovery (DNS-SD)
- RFC 7515 – JSON Web Signature (JWS)
- RFC 7617 – HTTP Basic Authentication
- RFC 7636 – Proof Key for Code Exchange (PKCE)
- RFC 6750 – OAuth 2.0 Bearer Token Usage
- RFC 8615 – Well-Known URIs
- RFC 9460 – Service Binding (SVCB/HTTPS)
- RFC 9462 – ALPN SvcParam for SVCB/HTTPS
- RFC 6335 – IANA Service Name & Port Registry

---

## Appendix A: Authentication Scheme Registry

| Token | Description |
| --- | --- |
| **`none`** | No authentication required. |
| **`pat`** | Personal Access Token (a user-specific secret). |
| **`apikey`** | API Key (typically a static, non-user-specific secret). |
| **`basic`** | HTTP Basic Authentication. |
| **`oauth2_device`** | OAuth 2.0 Device Authorization Grant flow. |
| **`oauth2_code`** | OAuth 2.0 Authorization Code Grant (typically with PKCE). |
| **`oauth2_service`** | OAuth 2.0 for service-to-service auth (e.g., Client Credentials). |
| **`mtls`** | Mutual TLS (client certificate authentication). Clients resolve certificate details from the implementation-level "certificate" object. If `certificate.source` = `file`, clients **MUST** prompt for the necessary file paths. Any associated passphrases **MUST** be requested in a masked/secure input. |
| **`custom`** | A non-standard scheme. The `description` field in the manifest should provide clear instructions. |

---

## Appendix B: DNS TTL and Caching Guidance *(Normative)*

### DNS Time-To-Live (TTL) for Providers

It is **STRONGLY RECOMMENDED** that providers set a low TTL on their `_agent.<domain>` TXT record.

- **Recommendation:** A TTL of **300 seconds (5 minutes)** is ideal for production.
- **Rationale:** A low TTL ensures that changes to the service (e.g., updating the `config` URL) propagate quickly.

### Manifest Caching for Clients

Clients **MUST** implement a two-layer caching strategy for `aid.json` manifests.

1. **Standard HTTP Caching:** Clients **MUST** respect standard HTTP caching headers (`Cache-Control`, `ETag`, `Last-Modified`) returned by the server.
2. **Authoritative `contentVersion` Caching:** After fetching a manifest, the client **MUST** compare the `contentVersion` of the new manifest with the version of the manifest it last processed. If the `contentVersion` strings differ, the client **MUST** treat the manifest as updated and re-process it.

### Implementation Checklist (Non-Normative)

1. Publish `_agent.<domain>` **TXT** with `v`, `uri`, `proto` (and `config` if Extended Profile).
2. **HTTPS-host** `aid.json` under `/.well-known/` with `schemaVersion:"1"` and increment `contentVersion` on every change.
3. Sign TXT with **DNSSEC**; serve manifest via **TLS**.
4. If you offer a local Docker path, test variable substitution `${auth.*}` and `${config.*}` works end-to-end.
5. Set `_agent` TXT **TTL ≤ 300 s** in production.
6. Optional: Publish a preview SVCB/HTTPS RR for v2.

---

## Appendix C: Revocation Endpoint Contract

If the `revocationURL` is present in the manifest, clients **SHOULD** perform an HTTPS `GET` request before using the associated implementation. The endpoint **MUST** return a `200 OK` status with a JSON body. Any other response should be treated as a temporary failure.

| JSON Body | Meaning |
| --- | --- |
| **`{"status":"valid"}`** | The implementation is active and can be used. |
| **`{"status":"revoked"}`** | The implementation has been permanently disabled. The client **MUST NOT** use it. |

## Appendix D: Example Manifest (Simple Remote Agent)

This manifest describes a single, cloud-hosted API that uses a Personal Access Token.

```json
{
  "schemaVersion": "1",
  "name": "Simple Cloud Agent",
  "metadata": {
    "contentVersion": "2025-06-17.1",
    "documentation": "https://simple-agent.com/docs/api"
  },
  "implementations": [
    {
      "name": "Cloud API (Production)",
      "type": "remote",
      "protocol": "mcp",
              "uri": "https://api.simple-agent.com/mcp",
      "tags": ["cloud", "stable"],
      "authentication": {
        "scheme": "pat",
        "description": "Your Simple Agent API Token.",
        "tokenUrl": "https://simple-agent.com/account/tokens",
        "placement": {
          "in": "header",
          "key": "Authorization",
          "format": "Bearer {token}"
        }
      }
    }
  ]
}
```

## Appendix E: Example Manifest (Complex Local Tool)

This example for a hypothetical "Grafana" service describes a local Docker container that requires user-provided configuration.

```json
{
  "schemaVersion": "1",
  "name": "Grafana Agent (Local)",
  "metadata": {
    "contentVersion": "v2.1.0-2025-06-18",
    "documentation": "https://grafana.com/docs/agent"
  },
  "implementations": [
    {
      "name": "Grafana (Local via Docker for stdio clients)",
      "type": "local",
      "protocol": "mcp",
      "tags": ["docker", "stdio", "stable"],
      "package": {
        "manager": "docker",
        "identifier": "mcp/grafana:latest"
      },
      "authentication": {
        "scheme": "pat",
        "description": "Your Grafana Service Account Token is required to run the agent.",
        "tokenUrl": "https://your-grafana.com/org/apikeys",
        "credentials": [
          {
            "key": "grafana_api_key",
            "description": "Grafana Service Account Token"
          }
        ]
      },
      "requiredPaths": [
        {
          "key": "grafana_config_dir",
          "description": "Path to your local Grafana configuration directory.",
          "type": "directory"
        }
      ],
      "configuration": [
        {
          "key": "GRAFANA_URL",
          "description": "URL of your Grafana instance.",
          "type": "string",
          "defaultValue": "http://localhost:3000"
        }
      ],
      "execution": {
        "command": "docker",
        "args": [
          "run", "--rm", "-i",
          "-e", "GRAFANA_URL=${config.GRAFANA_URL}",
          "-e", "GRAFANA_API_KEY=${auth.grafana_api_key}",
          "-v", "${path.grafana_config_dir}:/etc/grafana",
          "${package.identifier}",
          "-t", "stdio"
        ]
      }
    }
  ]
}
```

---

## Appendix H: IANA Considerations

#### Registered Namespaces
| Registry | Tag | Policy |
|---|---|---|
| AID-proto | strings such as `"mcp"`, `"a2a"` | First-Come, Expert-Review |
| AID-auth  | strings such as `"pat"`, `"oauth2_device"` | First-Come, Expert-Review |
| AID-implType | `"remote"`, `"local"` | Specification Required |

Until IANA action these registries are maintained at aid.dev/registry.

## Appendix I: Quick-start Implementation

**Minimal TXT Record:**
```
_agent.example.com. IN TXT "v=aid1;uri=https://api.example.com/mcp;proto=mcp;auth=pat"
```

**Local-only Service:**
```
_agent.cli-only.io. IN TXT "v=aid1;config=https://cli-only.io/.well-known/aid.json"
```

**Minimal Manifest (aid.json):**
```json
{
  "schemaVersion": "1",
  "name": "Example Service",
  "implementations": [
    {
      "name": "Production API",
      "type": "remote",
      "protocol": "mcp",
      "uri": "https://api.example.com/mcp",
      "authentication": {
        "scheme": "pat",
        "description": "Your API token",
        "placement": { "in": "header", "key": "Authorization", "format": "Bearer {token}" }
      }
    }
  ]
}
```

Feedback? Open an issue at `https://github.com/agent-community/aid-spec`.