---
title: Evidence and replay
description: Evidence and replay contract for Agent Runtime.
---

# Evidence and replay

Agent Runtime should make work auditable. Evidence and replay exports must be derived from the same runtime facts that drive UI and diagnostics.

## Evidence pack

An evidence pack SHOULD include:

- runtime summary
- event or timeline summary
- thread read model
- tool calls and failed calls
- artifacts and artifact refs
- context refs and compaction boundaries
- provider routing, permission, sandbox, hook, process, and limit events
- verification outcomes when available
- review or audit notes when available

Evidence systems own verdicts. Runtime owns export scope, correlation ids, and references.

## Replay case

A replay case SHOULD include:

- input payload and selected options
- context and tool inventory refs
- expected state or behavior assertions
- evidence links
- grader or review instructions when available

Replay must not depend on UI screenshots or final prose alone.

## Observability

A compatible runtime SHOULD map execution into trace concepts:

- session/thread/turn as trace attributes
- model call, tool call, context retrieval, artifact write, and export as spans
- warnings and decisions as span events or logs
- token usage, latency, retries, queue wait, and tool duration as metrics

Trace ids should appear in runtime events and evidence exports when available.


## Signal Applicability

Evidence SHOULD distinguish `exported`, `not_applicable`, `unsupported`, and `missing_correlation`.

`known_gaps` should only describe signals that apply to the current scope but were not exported. Do not turn every future capability into a gap for every thread.
