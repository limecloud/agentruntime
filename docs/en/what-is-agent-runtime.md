---
title: What is Agent Runtime?
description: Agent Runtime defines portable execution semantics for AI agents.
---

# What is Agent Runtime?

Agent Runtime defines how agent work is accepted, executed, observed, controlled, resumed, and audited. It is the layer below Agent UI and above concrete model providers, tool systems, context stores, artifact services, and host application storage.

Use Agent Runtime when a product needs stable semantics for:

- submitted user turns and agent tasks with attempts, progress, graph edges, and delivery state
- model routing, fallback, limits, and token/cost accounting
- streaming text, reasoning, and structured output
- tool calls, tool results, large output refs, and tool errors
- human approval, structured input, interruption, and resume
- queues, steering, long-running turns, and subagents
- context assembly, memory retrieval, compaction, and missing context
- artifact refs, evidence refs, replay cases, and review exports

Do not use it to define the visual interface, model provider API, connector protocol, business database schema, artifact file format, or evidence review policy. Those systems remain adjacent owners.

## Layer map

| Layer | Main question | Runtime facts |
| --- | --- | --- |
| `input` | What work was submitted and by whom? | session, thread, turn, draft, attachments, source channel, request ids. |
| `execution` | What is running and why? | turn status, task lifecycle, task attempts, model routing, tool calls, action requests, subagents. |
| `state` | What can be resumed or inspected later? | snapshots, thread read model, queue, pending requests, incidents, checkpoints. |
| `coordination` | What external systems were used? | tool inventory, context refs, artifact refs, evidence refs, policy decisions. |
| `observability` | Can the work be traced, replayed, reviewed, or audited? | trace ids, spans, timeline, evidence pack, replay case, verification summaries. |

The runtime may be embedded in a desktop app, hosted behind an HTTP API, run in a worker, or coordinate local and remote agents. The standard constrains facts and control semantics, not deployment shape.
