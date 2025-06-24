---
title: "Versioning Strategy"
description: "How we version the AID specification."
icon: material/git
---

# Versioning Strategy

To ensure stability and clarity, the AID (Agent Interface Discovery) specification follows a "Scoped Versioning" approach within a single, unified MkDocs site. This strategy was chosen for its simplicity and maintainability, avoiding the complexities of multi-repository or multi-branch versioning systems.

## Key Principles

- **Unified Site:** There is only one documentation site and one `mkdocs.yml` configuration. All content, regardless of version, is part of the same build. This eliminates asset path conflicts and ensures a consistent user experience.

- **Subfolder-Based Versions:** Each major or minor version of the AID specification resides in its own subfolder within the `docs/aid/` directory. For example:
    - `docs/aid/v1/`
    - `docs/aid/v2/`

- **Version-Agnostic Content:** Core documents that apply to all versions, such as the Introduction and Design Rationale, are kept in the parent `docs/aid/` directory.

- **Explicit Navigation:** The site navigation in `mkdocs.yml` explicitly lists each available version, making it clear to users which version they are viewing. There is no "latest" pointer; the default version is simply the highest one listed in the navigation.

## Why This Approach?

This model provides the best balance of features and simplicity:

- **Stable URLs:** Each version has a permanent, predictable URL (e.g., `/aid/v1/spec-v1.md`).
- **Low Maintenance:** Adding a new version is as simple as creating a new folder and updating the navigation configuration.
- **No Build Complexity:** We rely on a standard `mkdocs build`, avoiding complex scripts and external tooling like `mike`. This makes the entire process more robust and easier to debug. 