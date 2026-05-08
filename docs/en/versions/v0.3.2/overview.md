---
title: v0.3.2 overview
description: Agent Runtime v0.3.2 release overview.
---

# Agent Runtime v0.3.2

Agent Runtime v0.3.2 adds LLM-friendly documentation entrypoints. The release publishes concise and full-context markdown files at the repository root and the documentation site root so AI clients can discover the runtime standard directly.

## Highlights

- Adds `llms.txt` as the concise LLM navigation index.
- Adds `llms-full.txt` as a concatenated English core documentation file with source URLs.
- Adds compatible `llm.txt` and `llm-full.txt` aliases.
- Publishes the same files through `docs/public/` so GitHub Pages serves them from the site root.
- Includes the LLM entrypoint files in the package manifest.

## Compatibility

v0.3.2 is compatible with v0.3.1. It does not change runtime event, control-plane, task, A2A, or snapshot semantics.
