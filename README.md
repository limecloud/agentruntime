# Agent Runtime

Agent Runtime is a runtime-first draft standard for portable agent execution. It defines how an AI client, host product, workflow system, or agent platform submits work, observes execution, coordinates tools and subagents, handles human decisions, writes durable state, and exports evidence without tying those behaviors to one UI, model provider, or tool framework.

Agent Runtime sits below Agent UI. The runtime owns execution facts. Agent UI owns projection into interaction surfaces. Model providers own generation APIs. Tool systems own external capabilities. Artifact and evidence systems own durable deliverables and verification records.

## Core boundary

| Adjacent system | It owns | Agent Runtime owns |
| --- | --- | --- |
| Agent UI | Visible surfaces, local drafts, interaction affordances, progressive rendering. | Authoritative session, thread, turn, task, queue, status, action, and event facts. |
| Model providers | Model APIs, provider-native streams, token accounting, provider errors. | Provider selection, routing trace, normalized generation lifecycle, retry/fallback state. |
| Tools and connectors | External systems, tool schemas, execution backends, connector auth. | Tool inventory snapshot, invocation lifecycle, safe arguments/results references, policy checks. |
| A2A peers | Remote agent cards, peer tasks, messages, artifacts, streaming, push notifications. | Local task refs, channel facts, permission bridges, artifact refs, and native peer id mapping. |
| Context and memory | Knowledge, memory, source retrieval, policy facts, trust metadata. | Context assembly trace, selected refs, compaction boundaries, missing-context warnings. |
| Artifacts and evidence | Files, versions, exports, traces, replay cases, verification and review facts. | Stable refs, lifecycle events, ownership links, evidence export requests and correlation ids. |
| Host application | Workspaces, accounts, storage, product navigation, deployment policy. | Runtime control plane, durable snapshots, queue/resume/interrupt semantics, read models. |

## Product profiles and conformance

Agent Runtime now separates the portable public standard from stricter product profiles. Public core keeps the shared execution model stable. Product profiles make a selected implementation testable by requiring specific ids, event families, payloads, read models, fixtures, and validation. The [Lime AgentRuntime Profile](docs/en/profiles/lime.md) is the reference profile for Lime current runtime.

## What the current draft defines

- Runtime identity model: `session`, `thread`, `task`, `run`, `turn`, `step`, `tool_call`, `action_request`, `subagent`, `artifact_ref`, and `evidence_ref`.
- A typed runtime event stream for lifecycle, task orchestration, model, reasoning, tool, action, queue, context, artifact, evidence, subagent, limit, snapshot, warning, and error events.
- A control plane for submit, interrupt, resume, task create/update/cancel/retry, queue, respond-action, inspect, list sessions, spawn subagents, and export evidence/replay.
- Durable read models for session snapshots, thread status, task state, pending requests, incidents, queue state, tool inventory, and evidence summaries.
- Permission, sandbox, hook, process, remote channel, model routing, cost/limit, job, recovery, and large-output contracts drawn from real runtimes.
- A2A peer-task alignment for Agent Cards, task/context ids, messages, artifacts, streaming, push notifications, and in-task authorization.
- Benchmark instrumentation for Agent QC hill climbing: dataset/config/task correlation, trajectories, reward refs, and comparison decisions.
- Compatibility guidance for MCP, A2A, OpenTelemetry, CloudEvents, JSON-RPC, provider streaming APIs, and Agent UI projection.

## Runtime architecture

```text
client / channel / workflow input
  -> runtime control plane
  -> provider + context + policy + tool orchestration
  -> typed runtime event stream
  -> durable snapshots and read models
  -> Agent UI projection / evidence / replay / audit consumers
```

Compatible implementations should:

1. Treat runtime events and snapshots as execution facts, not as UI state.
2. Keep provider-native chunks behind an adapter and emit normalized runtime events.
3. Resolve tools, context, policy, model routing, and output schemas before or during each turn with traceable decisions.
4. Represent human approvals and structured input as `action.required` records with stable ids.
5. Record permission, sandbox, hook, process, routing, cost, and quota decisions as first-class facts.
6. Persist enough state to resume, replay, audit, and explain a turn after process restart.
7. Export evidence and replay from the same facts that drive the UI and diagnostics.
8. Use stable correlation ids across runtime events, traces, tool calls, artifacts, and evidence.

## Documentation

Key pages:

- [Specification](docs/en/specification.md)
- [Lime AgentRuntime Profile](docs/en/profiles/lime.md)
- [Runtime model](docs/en/concepts/runtime-model.md)
- [Runtime event stream](docs/en/contracts/runtime-event-stream.md)
- [Control plane](docs/en/contracts/control-plane.md)
- [State snapshots](docs/en/contracts/state-snapshots.md)
- [Evidence and replay](docs/en/contracts/evidence-replay.md)
- [Permission and sandbox](docs/en/contracts/permission-and-sandbox.md)
- [Hooks and policy](docs/en/contracts/hooks-and-policy.md)
- [Execution environment](docs/en/contracts/execution-environment.md)
- [Model routing and limits](docs/en/contracts/model-routing-limits.md)
- [Agent task](docs/en/contracts/agent-task.md)
- [Subagents and jobs](docs/en/contracts/subagents-and-jobs.md)
- [Remote channels](docs/en/contracts/remote-channels.md)
- [Benchmark instrumentation](docs/en/contracts/benchmark-instrumentation.md)
- [Session history and recovery](docs/en/contracts/session-history-recovery.md)
- [Output storage and large results](docs/en/contracts/output-storage-large-results.md)
- [Source analysis](docs/en/reference/source-analysis.md)
- [Research sources](docs/en/reference/research-sources.md)
- [中文规范](docs/zh/specification.md)
- [Lime Profile 中文文档](docs/zh/profiles/lime.md)


## Related Agent standards

- [Agent Knowledge](https://limecloud.github.io/agentknowledge/) - source-grounded knowledge packs.
- [Agent UI](https://limecloud.github.io/agentui/) - interaction surfaces for agent products.
- [Agent Runtime](https://limecloud.github.io/agentruntime/) - execution facts, controls, tasks, tools, and recovery.
- [Agent Evidence](https://limecloud.github.io/agentevidence/) - evidence, provenance, verification, review, replay, and export.
- [Agent Policy](https://limecloud.github.io/agentpolicy/) - policy decisions, approvals, permissions, risk, retention, waivers, and traces.
- [Agent Artifact](https://limecloud.github.io/agentartifact/) - durable deliverables, versions, parts, previews, exports, and handoff packages.
- [Agent Tool](https://limecloud.github.io/agenttool/) - tool declarations, surfaces, invocations, progress, results, permissions, and audit refs.
- [Agent Context](https://limecloud.github.io/agentcontext/) - context surfaces, items, source refs, selection, budgets, assembly, injection, compaction, and missing-context facts.

See the [Agent standards ecosystem](docs/en/reference/agent-ecosystem.md) page for the mutual-link map and future standard candidates.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static site is generated at `docs/.vitepress/dist`.
