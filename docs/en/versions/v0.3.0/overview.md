---
title: v0.3.0 overview
description: Agent Runtime v0.3.0 release overview.
---

# Agent Runtime v0.3.0

Agent Runtime v0.3.0 adds Agent Task as a first-class runtime object. The release turns task work from a loose UI concept or checklist into durable runtime truth with lifecycle, attempts, relationships, progress, delivery state, and recovery semantics.

## Highlights

- Adds the Agent Task contract for objective, lifecycle, runs/attempts, task graph edges, acceptance, and recovery.
- Separates `task`, `run`, `step`, `job`, and `todo` so implementations do not flatten real execution into a single message or checklist.
- Expands task status semantics with waiting, blocked, paused, retrying, timed out, lost, completed, archived, stale, and unknown states.
- Adds task orchestration events for progress, waiting, dependency updates, delegation, cancellation intent, and attempt lifecycle.
- Expands event and snapshot JSON Schemas with task records, attempts, relationships, graph summaries, blocked tasks, delivery state, and normalized task status.
- Updates implementation guidance, acceptance scenarios, telemetry, control plane, snapshots, glossary, source analysis, and examples to use task ids and run ids.

## Compatibility

v0.3.0 keeps the v0.2.0 runtime surfaces and adds task semantics on top. Existing turn, job, subagent, process, permission, sandbox, routing, and telemetry implementations can adopt the task model incrementally.
