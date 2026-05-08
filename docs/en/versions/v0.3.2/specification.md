---
title: v0.3.2 specification snapshot
description: Agent Runtime v0.3.2 specification snapshot.
---

# v0.3.2 specification snapshot

v0.3.2 keeps the v0.3.1 Agent Runtime semantics and adds documentation distribution requirements for LLM-friendly consumers.

## Required documentation entrypoints

A compatible documentation distribution SHOULD expose:

- `llms.txt`: concise project summary and links to primary docs.
- `llms-full.txt`: concatenated current English core docs with source URLs.
- `llm.txt`: compatibility alias for clients that look for singular naming.
- `llm-full.txt`: compatibility alias for full-context singular naming.

When hosted as a static site, these files SHOULD be served from the site root.
