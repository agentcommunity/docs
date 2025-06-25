Below is a **publication-ready change plan** for *Agent Interface Discovery* (AID) that keeps the specification true to its original “aid 1” identity while bringing it fully in-line with the Model Context Protocol (MCP) 2025-06-18 revision.  All feedback from the last review cycle—including version-hinting, capability semantics, dynamic-client-registration hints, and CLI/Device-Grant usability—has been incorporated.

---

## 1  Guiding Principles (unchanged but explicit)

| # | Principle                                | Outcome                                                                        |
| - | ---------------------------------------- | ------------------------------------------------------------------------------ |
| 1 | **Manifest ≠ Configuration**             | The manifest is a *hint*; live negotiation is the source-of-truth.             |
| 2 | **Unknown fields MUST be ignored**       | Forward-compatibility is preserved without major bumps.                        |
| 3 | **Security before convenience**          | PKCE, Resource Indicators, audience checks, and DCR rate-limits are normative. |
| 4 | **Protocol alignment beats convenience** | Where MCP or an IETF RFC defines behaviour, AID defers.                        |

---

## 2  Versioning & Discovery

### 2.1  Keep the TXT record stable

*DNS label:* `v=aid1` remains unchanged to avoid unnecessary churn.

### 2.2  Optional schema hint

Add an **optional** TXT‐record key:

```
_agent.example.com. IN TXT "v=aid1;schema_v=1.1;config=https://example.com/aid.json"
```

* Clients that recognise `schema_v` **SHOULD** skip fetching older schemas.
* Legacy 1.0 clients ignore the key and fail gracefully if the manifest is too new.
* Manifest still carries `"$schema": "https://aid.dev/schema/v1.1/aid.schema.json"` for tooling.

---

## 3  Manifest Schema Deltas (aid 1 → aid 1.1)

| Location               | Field                           | Change                          | Notes                                                                                          |
| ---------------------- | ------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `Implementation`       | **`name`**                      | **Required** machine identifier | Must be unique within the manifest.                                                            |
|                        | **`title`**                     | **Required** display string     | Human-readable label.                                                                          |
|                        | **`capabilities`**              | **Optional** object             | `{ structuredOutput?: {}; resourceLinks?: {} }` (objects left empty to allow future sub-keys). |
|                        | **`mcpVersion`**                | **Optional** string             | e.g. `"2025-06-18"`. Non-binding hint only.                                                    |
| `authentication.oauth` | `authorizationEndpoint` etc.    | **Removed**                     | Static endpoints conflict with RFC 9728 discovery.                                             |
|                        | **`dynamicClientRegistration`** | **Optional** boolean            | `true` signals that RFC 7591 DCR is supported/expected.                                        |

---

## 4  Normative Behaviour Updates

### 4.1  OAuth flow

* Clients **MUST** initiate RFC 9728 discovery after a `401` with `WWW-Authenticate` header. ([datatracker.ietf.org][1])
* Clients **MUST** fetch RFC 8414 metadata from the selected AS. ([datatracker.ietf.org][2])
* **PKCE** is mandatory for all Authorization-Code flows. ([auth0.com][3])
* **Resource Indicators (`resource` parameter)** are mandatory in *all* requests except **Device-Grant fallback** (see 4.4). ([datatracker.ietf.org][4])

### 4.2  Dynamic Client Registration

If `dynamicClientRegistration=true` *and* no `clientId` is present, clients **SHOULD** attempt RFC 7591 registration and cache the result securely. ([datatracker.ietf.org][5])

### 4.3  Capability semantics

`capabilities` and `mcpVersion` are *hints*. The authoritative view comes from the live `initialize` exchange; clients **MUST** trust runtime negotiation over manifest hints. ([datatracker.ietf.org][6])

### 4.4  Device-Grant edge case

Some legacy servers reject `resource` on `device_authorization_request` and return `invalid_target`. In that *single* grant-type only, clients **MAY** retry without the parameter. ([iana.org][7])  This is non-normative guidance; all other flows require the parameter.

### 4.5  Error taxonomy (additions)

| Error (OAuth/IETF)              | Meaning                 | Required Client Action                                        |
| ------------------------------- | ----------------------- | ------------------------------------------------------------- |
| `invalid_target` (RFC 8707)     | `resource` not accepted | Abort or retry Device-Grant without `resource`.               |
| `invalid_token` (RFC 6750)      | expired/incorrect token | Discard token; restart auth flow. ([datatracker.ietf.org][8]) |
| `insufficient_scope` (RFC 6750) | token lacks scopes      | Prompt user; redirect to AS for re-consent.                   |

---

## 5  Security Considerations (additions)

* Servers **MUST** rate-limit Dynamic Client Registration requests. ([oauth.net][9])
* Servers acting as Resource Servers **MUST** verify `aud` against their canonical URI. ([datatracker.ietf.org][4])
* Local/CLI implementations are **strongly encouraged** to support *Device Authorization Grant* (`oauth2_device`) to avoid browser-flows in headless environments. ([auth0.com][10])

---

## 6  Tooling & Linting

| Severity    | Condition                                               | Rationale                      |
| ----------- | ------------------------------------------------------- | ------------------------------ |
| **Error**   | Deprecated static OAuth fields *in a v1.1 manifest*     | Violates normative removal.    |
| **Warning** | Deprecated fields *in a v1.0 manifest*                  | Graceful ecosystem transition. |
| **Error**   | `schema_v` advertises 1.1 but manifest `$schema` is 1.0 | Prevent mis-labelling.         |

---

## 7  Examples & Migration Aids

### 7.1  jq one-liner

```bash
jq '(.implementations[].authentication.oauth) |= del(.authorizationEndpoint,.tokenEndpoint,.deviceAuthorizationEndpoint)' \
    old_manifest.json > new_manifest.json
```

### 7.2  DNS sample

```
v=aid1;schema_v=1.1;config=https://cdn.example.com/aid.json
```

### 7.3  Minimal OAuth manifest snippet

```jsonc
{
  "scheme": "oauth2_device",
  "description": "Login with Example ID",
  "oauth": {
    "dynamicClientRegistration": true,
    "scopes": ["openid", "profile", "offline_access"]
  },
  "placement": "remote"
}
```

---

## 8  Conformance Test Suite (excerpt)

| ID | Scenario                                           | Pass Criteria                                                 |
| -- | -------------------------------------------------- | ------------------------------------------------------------- |
| A  | 401 → RFC 9728 → RFC 8414 discovery                | Endpoints resolved; PKCE & `resource` applied.                |
| B  | Resource Indicator audience check                  | Token `aud` mismatching server URI rejected with 401.         |
| C  | `invalid_target` handling                          | Client retries Device-Grant without `resource` then succeeds. |
| D  | Linter warns on v1.0 static fields, errors on v1.1 | Severity logic verified.                                      |

---

### **Ready for Editorial Sign-off**

All previously identified gaps are now closed:

* **Versioning** solved by `schema_v`.
* **Manifest-vs-Runtime** clarified.
* **DCR hint** provided.
* **CLI usability** addressed via Device-Grant guidance.
* **Consistent `name`/`title`** applied everywhere.

No additional normative changes are required.

[1]: https://datatracker.ietf.org/doc/rfc9728/?utm_source=chatgpt.com "RFC 9728 - OAuth 2.0 Protected Resource Metadata"
[2]: https://datatracker.ietf.org/doc/html/rfc8414?utm_source=chatgpt.com "RFC 8414 - OAuth 2.0 Authorization Server Metadata"
[3]: https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce "Authorization Code Flow with Proof Key for Code Exchange (PKCE)"
[4]: https://datatracker.ietf.org/doc/html/rfc8707 "
            
                RFC 8707 - Resource Indicators for OAuth 2.0
            
        "
[5]: https://datatracker.ietf.org/doc/html/rfc7591?utm_source=chatgpt.com "RFC 7591 - OAuth 2.0 Dynamic Client Registration Protocol"
[6]: https://datatracker.ietf.org/doc/draft-ietf-oauth-resource-metadata/13/?utm_source=chatgpt.com "OAuth 2.0 Protected Resource Metadata - IETF Datatracker"
[7]: https://www.iana.org/assignments/oauth-parameters?utm_source=chatgpt.com "OAuth Parameters - Internet Assigned Numbers Authority"
[8]: https://datatracker.ietf.org/doc/html/rfc6750?utm_source=chatgpt.com "RFC 6750 - The OAuth 2.0 Authorization Framework: Bearer Token ..."
[9]: https://oauth.net/2/authorization-server-metadata/?utm_source=chatgpt.com "OAuth 2.0 Authorization Server Metadata"
[10]: https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce?utm_source=chatgpt.com "Authorization Code Flow with Proof Key for Code Exchange (PKCE)"
