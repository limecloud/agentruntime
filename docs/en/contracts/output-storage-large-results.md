---
title: Output storage and large results
description: Agent Runtime large output, spill, and result reference contract.
---

# Output storage and large results

Tools, commands, hooks, search, browser actions, and models can all emit large output. The event stream should carry facts and ordering, not unbounded payloads.

## Output reference

Large output SHOULD use `output_ref` with owner, media type, encoding, size, preview, truncation, redaction, and expiration metadata.

## Spill policy

Runtime SHOULD define max event payload size, max tool result tokens, stdout/stderr head-tail policy, hook output limits, binary inline policy, and evidence copy/reference behavior.

## Structured results

Structured tool results SHOULD separate `structured_content_ref`, `display_preview`, `raw_output_ref`, `artifact_refs`, and `error_ref`.

Events include `output.spilled`, `output.truncated`, `output.redacted`, and `output.expired`.
