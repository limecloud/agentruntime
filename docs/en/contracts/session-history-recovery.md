---
title: Session history and recovery
description: Agent Runtime session history, compaction, rollback, and recovery contract.
---

# Session history and recovery

Long sessions cannot depend on an in-memory message array. Compatible runtimes SHOULD maintain event logs, rollout/history records, snapshots, and read models.

## Layers

`event_log`, `rollout_log`, `session_snapshot`, `thread_read_model`, `context_boundary`, and `evidence_export` may share storage, but their semantics must stay distinct.

## Compaction

Compaction SHOULD record trigger, affected turns, summary ref, replacement history or continuation ref, token usage before/after, preserved pending actions, incidents, artifact refs, evidence refs, and errors or retries.

Compaction must not silently drop unresolved actions or active incidents.

## Rollback and reconstruction

Rollback SHOULD record target, removed turns, surviving context baseline, affected tools/artifacts/subagents/jobs, and read-model repair.

Recovery SHOULD load session shell, thread summaries, recent window, active thread read model, pending actions, queued turns, subagents, and jobs. Partial recovery must be marked degraded.
