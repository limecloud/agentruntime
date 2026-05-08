---
title: v0.3.0 specification snapshot
description: Agent Runtime v0.3.0 specification snapshot.
---

# v0.3.0 specification snapshot

v0.3.0 is the first Agent Runtime snapshot where `task` is a first-class execution object instead of only a loose background-work label.

## Required additions over v0.2.0

A compatible v0.3.0 implementation SHOULD expose:

- `task_id` and `run_id` / `attempt_id` correlation where task execution exists.
- Task lifecycle events from creation through progress, waiting, retry, cancellation, failure, loss, completion, and archive.
- Task graph edges for parent/child, blocks/blocked-by, source task, source attempt, spawned subagent, assigned thread, artifact, and evidence relationships.
- Attempt history that preserves failed runs instead of overwriting task records on retry.
- Task read models in snapshots, including active tasks, blocked tasks, attempts, graph edges, delivery state, and recent terminal tasks.
- Control-plane semantics for create, update, start, progress append, pause, resume, cancel, retry, complete, fail, list, get, link, and unlink tasks.

## Key contracts

- [Agent task](../../contracts/agent-task.md)
- [Specification](../../specification.md)
- [Runtime model](../../concepts/runtime-model.md)
- [Runtime event stream](../../contracts/runtime-event-stream.md)
- [State snapshots](../../contracts/state-snapshots.md)
- [Control plane](../../contracts/control-plane.md)
