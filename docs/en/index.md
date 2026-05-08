---
title: Overview
description: Agent Runtime overview.
---

# Agent Runtime

Agent Runtime is a draft standard for the execution layer of agent products. It defines the facts and controls needed to run agent work across model providers, tools, context sources, subagents, artifacts, evidence, and UI clients.

A runtime is not a chat component. It is the authority that accepts work, resolves execution context, starts turns, emits typed events, persists durable snapshots, pauses for human decisions, resumes work, and exports evidence.

## Core idea

```text
input channel -> runtime control plane -> execution loop -> durable facts -> consumers
```

Consumers can include Agent UI, workflow engines, remote channels, replay tools, review systems, test harnesses, and audit exports. They should not reconstruct runtime truth from prose or from UI state.

## Current draft scope

- Identity: `session`, `thread`, `turn`, `task`, `step`, `tool_call`, `action_request`, `subagent`, `artifact_ref`, `evidence_ref`.
- Events: typed runtime stream for lifecycle, model, reasoning, tools, actions, queue, context, artifacts, evidence, subagents, limits, snapshots, warnings, and errors.
- Control plane: submit, interrupt, resume, queue, action response, session reads, thread reads, tool inventory, subagent control, evidence export, and replay export.
- State: durable snapshots and read models for recovery, old sessions, pending requests, incidents, queue state, and diagnostics.
- Boundaries: clear ownership between runtime, UI, model provider, tool system, context store, artifact service, evidence system, and host product.
- Runtime depth: permission, sandbox, hooks, process lifecycle, model routing, cost/limits, remote channels, subagent graph, jobs, history recovery, and large output refs.

## Design pressure

Real agent runtimes need more than streaming text. They must survive long turns, tool failures, process restarts, human approvals, queue mutations, context compaction, subagent delegation, background jobs, remote channels, model fallback, quota blocks, large output, and audit review. The current draft names those facts so different clients and backends can interoperate.
