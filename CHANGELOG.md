# Changelog

## v0.3.9 - 2026-05-08

- Adds Agent Context to the current standards ecosystem map.
- Refreshes README, LLM entrypoints, and version snapshots for Agent Context discovery.

## v0.3.8 - 2026-05-08

- Adds Agent Tool to the current standards ecosystem map.
- Refreshes README, LLM entrypoints, and version snapshots for Agent Tool discovery.

## v0.3.7 - 2026-05-08

### Added

- Promoted Agent Artifact from future candidate to current Agent standards ecosystem links.
- Added Agent Artifact to README and LLM navigation entrypoints.
- Refreshed version navigation and public LLM copies for ecosystem discovery.

## v0.3.6 - 2026-05-08

### Added

- Promoted Agent Policy from future candidate to current Agent standards ecosystem links.
- Added Agent Policy to README and LLM navigation entrypoints.
- Refreshed version navigation and public LLM copies for ecosystem discovery.


## v0.3.5 - 2026-05-08

### Fixed

- Fixed localized home page LLM entrypoint links for GitHub Pages repository-base deployments.
- Fixed documentation logo asset paths for repository-base deployments.

### Changed

- Updated package and version navigation to 0.3.5.

## v0.3.4 - 2026-05-08

### Fixed

- Fixed Simplified Chinese homepage rendering by making localized index pages proper VitePress home pages.
- Fixed repository-base GitHub Pages logo loading.

### Changed

- Refined English and Simplified Chinese home pages with concise hero actions, quick links, ecosystem links, and LLM entrypoints.
- Updated package and version navigation to 0.3.4.

## v0.3.3 - 2026-05-08

### Added

- Added public Agent standards ecosystem page with mutual links across Agent Knowledge, Agent UI, Agent Runtime, and Agent Evidence.
- Added ecosystem navigation, reference sidebar entries, version snapshots, and LLM index links.

### Changed

- Updated package and version navigation to 0.3.3.

## v0.3.2 - 2026-05-08

### Added

- Added root and site-root `llms.txt` files for concise LLM navigation.
- Added root and site-root `llms-full.txt` files with concatenated English core documentation and source URLs.
- Added `llm.txt` and `llm-full.txt` compatibility aliases.
- Added LLM entrypoint files to the package manifest.

### Changed

- Updated version navigation to include v0.3.2.

## v0.3.1 - 2026-05-08

### Added

- Added official A2A research sources covering the latest Agent2Agent Protocol specification, Google launch post, Linux Foundation project announcement, and A2A GitHub project.
- Added explicit A2A peer-task mapping for Agent Card, A2A `taskId` / `contextId`, messages, artifacts, streaming, push notifications, and in-task authorization.
- Added remote channel fields and events for peer protocol identity, remote task refs, native status, and peer task linking.

### Changed

- Clarified that A2A is a peer-agent interoperability reference, not a replacement for Agent Runtime execution facts.
- Clarified that A2A messages should map to input, clarification, status, or task interaction, while durable outputs should map to artifact refs.

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
