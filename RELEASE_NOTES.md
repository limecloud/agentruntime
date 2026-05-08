# Agent Runtime v0.3.2

Agent Runtime v0.3.2 adds LLM-friendly documentation entrypoints. It publishes concise and full-context markdown files at the repository root and the documentation site root so AI clients can discover the runtime standard directly.

## Highlights

- Adds `llms.txt` as the concise LLM navigation index.
- Adds `llms-full.txt` as a concatenated English core documentation file with source URLs.
- Adds compatible `llm.txt` and `llm-full.txt` aliases.
- Publishes the same files through `docs/public/` so GitHub Pages serves them from the site root.
- Includes the LLM entrypoint files in the package manifest.

## Validation

- `npm run build`
- `VITEPRESS_BASE="/agentruntime/" npm run build`
- `npm audit --omit=dev`
- `npm pack --dry-run`
- Root/public LLM file consistency checks
- Forbidden coupling scan outside generated output

---

# Agent Runtime v0.3.1

Agent Runtime v0.3.1 strengthens A2A alignment without turning Agent Runtime into an A2A implementation. A2A is now documented as the peer-agent interoperability reference for remote delegation, while Agent Runtime remains the owner of local execution facts, attempts, permissions, evidence, and recovery.

## Highlights

- Added official A2A references: latest protocol specification, Google launch post, Linux Foundation project announcement, and A2A GitHub project.
- Added an A2A boundary map for Agent Card, A2A task/context ids, messages, artifacts, streaming, push notifications, and in-task authorization.
- Expanded remote channels with `native_protocol`, peer-agent roles, native peer ids, remote task refs, and peer task lifecycle events.
- Added A2A peer-task fields including `remote_task_id`, `remote_context_id`, `agent_card_ref`, `delivery_mechanism`, `native_status`, and `remote_artifact_refs`.
- Clarified that A2A messages are communication or interaction facts, while durable outputs should be artifact refs linked to tasks.

## Validation

- `npm run build`
- `VITEPRESS_BASE="/agentruntime/" npm run build`
- `npm audit --omit=dev`
- `npm pack --dry-run`
- Forbidden coupling scan outside generated output

---

# Agent Runtime v0.3.0

Agent Runtime v0.3.0 adds Agent Task as a first-class execution object. It turns tasks from loose UI cards, checklist items, or background labels into durable runtime truth with lifecycle, attempts, task graph relationships, progress, delivery state, and recovery semantics.

## Highlights

- Agent Task is now a first-class contract with objective, owner, constraints, acceptance, progress, attempts, and relationships.
- `task`, `run`, `step`, `job`, and `todo` are clearly separated so real execution does not collapse into a single message or checklist.
- Task status now covers waiting input, waiting permission, waiting resource, blocked, paused, retrying, cancelling, timed out, lost, completed, archived, stale, and unknown states.
- Public event schema now includes task orchestration and attempt lifecycle events such as `task.progress`, `task.delegated`, `task.dependency.updated`, and `task.attempt.*`.
- Public snapshot schema now includes task records, attempts, relationships, summaries, blocked tasks, graph refs, and delivery state.
- Control plane, telemetry, state snapshots, quickstart, examples, acceptance scenarios, glossary, and source analysis now carry task ids and run ids.

## Validation

- `npm run build`
- `VITEPRESS_BASE="/agentruntime/" npm run build`
- `npm audit --omit=dev`
- `npm pack --dry-run`
- JSON Schema parse and task event/schema coverage checks
- Forbidden coupling scan outside generated output

---

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
