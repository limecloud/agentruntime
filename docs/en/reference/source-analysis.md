---
title: Source analysis summary
description: Agent Runtime implementation lessons from real runtimes.
---

# Source analysis summary

This page summarizes runtime pressure from three implementation families. It is not a port of any single project; it extracts portable semantics for the Agent Runtime contract.

## Terminal coding runtime pressure

A terminal runtime shows that tool calls are not simple request/response records. The standard needs tool schema, safe args, progress, partial and final results, concurrent read-only batches, serialized writes, hooks, permission modes, rule sources, classifiers, sandbox profiles, output spill, telemetry-safe errors, local and remote subagents, and compaction boundaries.

## Typed systems runtime pressure

A typed systems runtime shows that SDKs need stable item lifecycle: thread started, turn started, item started/updated/completed, turn completed, turn failed. Command execution, file changes, tool calls, web search, image generation, todo lists, reasoning, approval policy, sandbox policy, hook schemas, process lifecycle, durable state, jobs, remote control, and rollout reconstruction all need explicit facts.

## Desktop agent runtime pressure

A desktop runtime shows that product execution is not a single model request. Submit, queue, resume, interrupt, compact, read models, tool inventory, evidence, replay, review export, turn input snapshots, request telemetry correlation, task profile, candidate sets, routing decisions, cost state, limit state, and quota/rate-limit events need one fact chain.

## Gap matrix

| Gap | Standard surface |
| --- | --- |
| Approval exists only as a client dialog | `permission.*` events and action boundary. |
| Sandbox exists only as config | `sandbox_profile` and `sandbox.*` events. |
| Hooks are not portable | `hook.*` events and hook input/output contracts. |
| Commands are just tool text | `process.*` lifecycle and output refs. |
| Model choice is not explainable | `task_profile`, `candidate_model_set`, `routing_decision`. |
| Cost and limits live only in logs | `cost.*`, `rate_limit.*`, `quota.*`, read models. |
| Subagents are just messages | Durable parent-child graph and job/item model. |
| Remote execution cannot recover | Channel identity, resume cursor, permission bridge. |
| Compaction breaks audit | Context boundaries, rollback, reconstruction. |
| Large output pollutes streams | Output refs, spill, truncation, redaction. |
