# Changelog

## v0.3.0 - 2026-05-08

### Added

- Added Agent Task as a first-class Agent Runtime contract covering lifecycle, attempts/runs, task graph relationships, progress, delivery state, control-plane operations, snapshots, and anti-patterns.
- Expanded the latest specification and public JSON Schemas with task orchestration events, task attempts, task read models, dependency edges, and normalized waiting/lost/timeout states.
- Updated implementation analysis and research sources with task pressure from real terminal, scheduler, typed systems, desktop, durable graph, and workflow runtimes.

## v0.2.0 - 2026-05-08

### Added

- Expanded the latest Agent Runtime draft after analyzing real terminal, systems, and desktop agent runtimes.
- Added contracts for permission and sandbox, hooks and policy, execution environment, model routing and limits, subagents and jobs, remote channels, telemetry and tracing, session history and recovery, and large output storage.
- Added a source-analysis reference page that maps implementation pressure into portable standard surfaces.
- Expanded event families to include permission, sandbox, hook, process, routing, cost, quota, channel, job, output, and history repair events.
- Expanded public event and snapshot JSON Schemas with process, channel, routing, permission, sandbox, job, output, telemetry, and recovery fields.
- Added behavior-level acceptance scenarios for permissions, hooks, process stdin, output spill, model routing, limits, remote reconnect, and job retry.

## v0.1.0

### Added

- Initial Agent Runtime draft standard.
- Runtime identity model for sessions, threads, turns, tasks, steps, tool calls, action requests, subagents, artifacts, and evidence.
- Runtime event stream contract covering lifecycle, model, reasoning, tool, action, queue, context, artifact, evidence, subagent, limits, snapshots, warnings, and errors.
- Control plane contract for submitting turns, interrupting, resuming, queue management, action responses, subagent control, state reads, and evidence/replay export.
- Durable snapshot and read-model guidance for old sessions, active threads, pending requests, incidents, queue state, and tool inventory.
- Public JSON Schemas for runtime events and snapshots.
- English and Simplified Chinese documentation site with v0.1.0 version snapshots.
- Research notes from MCP, A2A, OpenTelemetry, CloudEvents, JSON-RPC, OpenAI Responses, Anthropic Messages, Vercel AI SDK, and LangGraph.
