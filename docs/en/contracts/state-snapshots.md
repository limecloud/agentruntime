---
title: State snapshots
description: Durable snapshots and read models for Agent Runtime.
---

# State snapshots

Snapshots let consumers recover without replaying every event from the beginning. They are also the bridge for old sessions, inactive tabs, remote clients, and evidence exporters.

## Session snapshot

A session snapshot SHOULD include:

- session id, title, timestamps, workspace or account scope
- active thread ids and pinned thread ids
- recent history window with cursor
- thread summaries
- child subagent summaries
- latest evidence and artifact refs
- stale or truncated flags

## Thread read model

A thread read model SHOULD include:

- `thread_id`
- `status`
- `active_turn_id`
- pending action requests
- last outcome
- active incidents
- queued turns
- latest compaction boundary
- diagnostics summary
- tool/artifact/evidence summaries
- model routing and limit state
- permission state, sandbox profile, and pending approvals
- active processes, output refs, and execution environment
- subagent graph, job progress, and remote channel state
- telemetry correlation summary

This read model is the current answer to “what is happening now?” Consumers should not compute it independently from UI state.

## Diagnostics

Diagnostics can include warnings, failed tools, failed commands, pending requests, stalled turns, interrupt state, quota blocks, and context gaps. A missing diagnostic is not the same as a healthy state; mark unsupported facts as `unavailable`.

## History windows

Old sessions should load progressively:

1. session shell and thread summaries
2. recent history window
3. active thread read model
4. queue and pending requests
5. tool, artifact, evidence, and older history on demand

Bounded history and cursors are part of the runtime contract because they define whether clients can restore long-running work safely.


## Snapshot Honesty

Snapshots SHOULD prefer explicit status over optimistic inference:

- `unknown`: runtime lacks enough facts.
- `unavailable`: implementation or environment does not support the fact.
- `not_applicable`: the signal does not apply to this thread.
- `stale`: facts may not be current.
- `blocked`: permission, credential, quota, network, context, or human action is required.

Evidence, review, and UI consumers should use these statuses instead of filling in success defaults.
