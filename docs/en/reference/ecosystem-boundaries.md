---
title: Ecosystem boundaries
description: Boundaries between Agent Runtime and adjacent systems.
---

# Ecosystem boundaries

Agent Runtime coordinates many systems. It should not absorb their ownership.

| System | Owns | Runtime relationship |
| --- | --- | --- |
| Agent UI | Surfaces, interactions, local drafts, progressive rendering. | Consumes runtime facts and sends controlled actions. |
| Model providers | Native APIs, streaming formats, usage accounting, provider errors. | Runtime adapts provider facts into normalized lifecycle events. |
| MCP servers and connectors | Tools, resources, prompts, connector auth, external side effects. | Runtime discovers, filters, invokes, and records tool lifecycle. |
| A2A peers | Remote agent cards, capabilities, peer tasks, messages, artifacts, streaming, and push notifications. | Runtime maps peer work to local task/subagent edges, channel facts, and artifact refs while preserving A2A native ids. |
| Context stores | Memory, knowledge, search, retrieval, source ranking. | Runtime records selected refs, omissions, and compaction boundaries. |
| Policy systems | Permission rules, risk, sandbox profiles, org policy. | Runtime enforces or asks, then records decisions. |
| Artifact services | Content, versions, diff, export bytes. | Runtime emits artifact refs and lifecycle facts. |
| Evidence systems | Traces, verification, replay, review, audit verdicts. | Runtime exports and links evidence facts. |
| Host application | Workspace, account, local storage, deployment, navigation. | Runtime uses host scope and returns portable state models. |

A clean runtime boundary makes it possible to replace the UI, model provider, connector system, or evidence backend without rewriting the execution contract.

## A2A boundary

A2A is the right protocol reference when one agent delegates work to another independent agent. Agent Runtime should cite and interoperate with it, but not absorb it:

| A2A concept | Runtime mapping |
| --- | --- |
| Agent Card | Peer capability snapshot, channel capabilities, routing input, and optional `agent_card_ref`. |
| Task / `taskId` / `contextId` | Remote task ref linked to a local `task_id`, parent task, subagent, or channel. |
| Message | Channel input, task interaction, status message, or clarification; not a durable output by itself. |
| Artifact / artifact update | Artifact refs and `produced_artifact` / `consumed_artifact` task graph edges. |
| Streaming / push notification | `channel.*`, `task.progress`, `task.completed`, `artifact.changed`, cursor, ack, and snapshot repair facts. |
| In-task authorization | `action.required`, permission bridge events, and policy decision facts. |

The runtime boundary remains internal execution truth: attempts, tool calls, process execution, sandbox, hooks, local permission decisions, evidence, and replay are runtime facts even when the remote peer speaks A2A.
