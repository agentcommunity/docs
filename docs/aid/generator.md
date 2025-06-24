---
title: "Generator, Resolver & Validator"
description: "Tools for working with AID manifests and TXT records"
icon: material/cogs
---

# AID Toolkit

This documentation hub offers three companion tools that make it easy to **create**, **resolve**, and **validate** Agent Interface Discovery (AID) artifacts:

<div class="grid cards" markdown>

- [:material-pencil:{ .lg .middle } __Generator__](https://aid.agentcommunity.org)

  Interactive form-based UI for crafting **`aid.json`** manifests and their corresponding DNS TXT records. Built on the canonical `@aid/core` library, so everything it produces is guaranteed to be spec-compliant.

- [:material-magnify-scan:{ .lg .middle } __Resolver__](https://aid.agentcommunity.org/resolve)

  Visual step-by-step resolver. Enter a domain and watch the discovery flow unfold—from DNS lookup to manifest validation—exactly as a client would experience it.

- [:material-check-decagram:{ .lg .middle } __Validator__](https://aid.agentcommunity.org/validate)

  Paste or upload any **manifest**, **generator config**, **DNS TXT record**, or a **pair**. Instantly see detailed compliance results, powered by the same validation engine used in the core library.

</div>

## How these tools relate to the specification

All three tools are built directly on top of the reference TypeScript implementation described in the [Specification](/aid/v1/specification/). They follow a **single-source-of-truth** philosophy:

1.  **Zod Schemas** in the `@aid/core` package define the spec.
2.  The **Generator** UI uses those schemas to render forms and generate manifests.
3.  The **Validator** uses the same schemas to verify artifacts.
4.  The **Resolver** uses the same logic to walk through discovery and manifest processing.

This guarantees perfect alignment between tooling and spec—the easiest way to stay compliant is simply to use the official toolkit.

---

### Contributing

These tools live in the [AID Core Library repository](https://github.com/agentcommunity/aid-core). Bug reports and feature requests are welcome in that repo. 