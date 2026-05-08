# Changelog

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
