# Agent Runtime v0.2.0

Agent Runtime v0.2.0 expands the v0.1.0 baseline from a basic execution contract into a fuller runtime standard informed by real agent runtimes. It adds first-class contracts for permissions, sandboxing, hooks, process execution, model routing, cost and limits, remote channels, subagents, jobs, recovery, telemetry, and large output storage.

## Highlights

- Permission and sandbox decisions now have explicit state, decision source, sandbox profile, and violation events.
- Hooks and policy are modeled as runtime facts with lifecycle events, duration, input/output refs, and fail-open/fail-closed semantics.
- Commands and PTY-like sessions are represented as process lifecycle events with stdin, output refs, exit status, and recovery semantics.
- Model routing is decomposed into task profile, candidate model set, routing decision, cost state, limit state, and quota/rate-limit events.
- Subagents and jobs are separated into parent-child execution contexts and durable batch/background work with item-level progress.
- Remote channels now cover channel identity, resume cursors, acknowledgements, and cross-channel permission bridges.
- Evidence export guidance now distinguishes exported, not applicable, unsupported, and missing-correlation signals.

---

# Agent Runtime v0.1.0

Agent Runtime v0.1.0 defines the execution layer beneath Agent UI. It standardizes how agent work is submitted, routed, observed, paused for human decisions, resumed, audited, and exported without binding the runtime to one UI, model provider, or tool framework.

## Highlights

- Defines the runtime identity hierarchy: `session`, `thread`, `turn`, `task`, `step`, `tool_call`, `action_request`, `subagent`, `artifact_ref`, and `evidence_ref`.
- Adds a typed runtime event stream for lifecycle, model, reasoning, tool, action, queue, context, artifact, evidence, subagent, limits, snapshots, warning, and error events.
- Adds a control plane for submit, interrupt, resume, queue, action response, session reads, thread reads, tool inventory, subagents, evidence export, and replay export.
- Defines durable snapshots and read models so old sessions, pending requests, incidents, queue state, and evidence summaries can be recovered after restart.
- Documents how Agent Runtime maps to MCP, A2A, OpenTelemetry, CloudEvents, JSON-RPC, model-provider streams, Agent UI, and durable graph runtimes.

## Compatibility

- Provider-native streams should be adapted into normalized runtime events.
- Agent UI should consume runtime facts through a projection boundary instead of becoming the execution authority.
- Tool and connector systems may remain MCP, provider-native, local command, or hosted APIs as long as the runtime emits stable invocation facts.
- Evidence, replay, and review exports should be derived from the same runtime facts that power thread read models.

## Validation

- `npm run build`
- `VITEPRESS_BASE="/agentruntime/" npm run build`
- `npm pack --dry-run`
- Forbidden coupling scan outside generated output.
