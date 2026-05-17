---
title: Lime AgentRuntime Profile
description: Strict Agent Runtime profile for Lime current runtime implementation.
---

# Lime AgentRuntime Profile

The Lime profile is the implementation profile for Lime's current runtime. It keeps the public Agent Runtime standard portable, while making the Lime execution spine strict enough to test, replay, and govern.

The profile is intentionally narrower than the public draft. Public Agent Runtime describes portable semantics. The Lime profile selects the current subset that Lime must implement without parallel UI, evidence, or telemetry truth sources.

## Conformance levels

| Level | Purpose | Requirement |
| --- | --- | --- |
| Public core | Portable Agent Runtime compatibility. | Emits normalized identities, events, snapshots, and control-plane semantics. |
| Lime profile core | Lime current runtime delivery. | Uses the required ids, event families, snapshots, and evidence joins in this page. |
| Lime extension | Product-specific details. | Adds payload fields only under typed payload objects or refs; does not redefine ownership. |

A Lime-compatible implementation MUST pass the Lime profile core before claiming broader feature coverage.

## Current execution spine

Lime runtime work MUST flow through one spine:

```text
Objective
  -> Session
  -> Thread
  -> Turn
  -> Step / Item
  -> ToolCall / Action / Process / Subagent
  -> RuntimeEvent
  -> Snapshot / ThreadReadModel
  -> EvidencePack / Replay / Review / UI projection
```

UI panels, dashboards, analysis prompts, and review templates are consumers of this spine. They MUST NOT rebuild task status, routing state, permission state, verification gaps, or evidence summaries from local UI-only state.

## Required identities

Every Lime profile event MUST include `schemaVersion`, `runtimeId`, `sessionId`, `eventId`, `timestamp`, `sequence`, `type`, and `payload`.

Events scoped to a thread or turn MUST also include:

| Scope | Required ids |
| --- | --- |
| Thread state | `threadId` |
| Turn lifecycle | `threadId`, `turnId` |
| Task lifecycle | `taskId`; `runId` when an execution attempt exists |
| Tool invocation | `threadId`, `turnId`, `stepId`, `toolCallId` |
| Human or policy action | `threadId`, `turnId`, `actionId` |
| Subagent | `subagentId`, plus parent `sessionId` and usually parent `threadId` / `turnId` |
| Evidence export | `evidenceId`, plus the highest available `sessionId` / `threadId` / `turnId` / `taskId` scope |

Missing correlation is a degraded fact. It MUST be represented as `unknown`, `unavailable`, `stale`, or an explicit profile validation failure. It MUST NOT be joined by parsing prose.

## Required event families

The Lime profile core requires these families:

- `session.*`, `thread.*`, `turn.*` for work containers and input cycles.
- `task.*`, `task.attempt.*`, and `run.status` for objective work, retries, background work, and progress.
- `model.*` and `reasoning.*` for normalized provider generation.
- `tool.*`, `process.*`, `output.*` for tool calls, commands, long-running processes, large outputs, and result refs.
- `action.*`, `permission.*`, `sandbox.*`, `hook.*`, and `policy.changed` for governance and human decisions.
- `context.*` and `history.*` for context assembly, compaction, rollback, and reconstruction boundaries.
- `task.profile.resolved`, `routing.*`, `cost.*`, `rate_limit.hit`, `quota.*`, and `limit.changed` for model routing and economic state.
- `subagent.*`, `job.*`, and `channel.*` for delegated, remote, or background work.
- `artifact.changed`, `evidence.changed`, `snapshot.updated`, `runtime.warning`, and `runtime.error` for durable outputs, audit, repair, and failures.

The public schema may allow more events. Lime profile validation should fail when a current Lime runtime path emits an unscoped or unjoinable event for these families.

## Required read models

A Lime runtime MUST maintain these read models from the same event facts that drive evidence and UI:

| Read model | Required purpose |
| --- | --- |
| `SessionSnapshot` | Session shell, threads, recent history window, tasks, evidence refs, and recovery cursor. |
| `ThreadReadModel` | Current thread status, active turn, queued turns, pending actions, incidents, diagnostics, tool calls, and last outcome. |
| `TaskSnapshot` | Objective, status, current run, attempts, parent/dependency edges, progress, outputs, artifacts, evidence refs, and delivery state. |
| `PermissionSandboxSummary` | Effective permission mode, pending approvals, evaluated decisions, sandbox profile, and violations. |
| `RoutingLimitSummary` | Task profile, candidate count, selected model, fallback/no-candidate/single-candidate facts, cost, quota, and rate-limit state. |
| `EvidenceSummary` | Evidence pack refs, replay refs, review refs, verification outcomes, and known gaps that are actually applicable. |

If a signal is not applicable, the read model should omit it or mark it `not_applicable`. It must not emit a generic gap for every session.

## Control-plane mapping

Lime commands can keep product-specific names, but they MUST map to these profile semantics:

| Profile semantic | Lime boundary |
| --- | --- |
| `submit_turn` | Create or queue a turn, record input snapshot, emit `turn.submitted` before long-running work. |
| `interrupt_turn` | Record interruption intent, resolve active tool/process/subagent cleanup, and preserve queued work by policy. |
| `resume_thread` | Rehydrate snapshot, repair history if needed, and emit recovery facts before continuing. |
| `respond_action` | Resolve a pending action by stable `actionId`; unresolved actions cannot be treated as approved. |
| `create_task` / `update_task` / `retry_task` / `complete_task` | Mutate task facts with attempts and graph edges, not UI-only cards. |
| `get_session` / `get_thread_read` | Read durable snapshots and read models, not reconstructed UI summaries. |
| `export_evidence` / `export_replay` / `export_review` | Export from runtime facts shared with UI and diagnostics. |
| `start_benchmark_trial` / `record_benchmark_reward` / `export_benchmark_trial` / `compare_benchmark_runs` | Preserve Agent QC benchmark task, trajectory, reward, and comparison facts. |

Any current Tauri command, frontend gateway, mock, or catalog entry that writes runtime truth should be traceable to one of these semantics.

## Evidence boundary

The Lime profile makes evidence a consumer of runtime facts, not a separate reporter. Evidence exports MUST include the correlation spine that applies to the exported scope:

```json
{
  "runtimeCorrelation": {
    "runtimeId": "lime_runtime_local",
    "sessionId": "sess_123",
    "threadId": "thread_123",
    "turnId": "turn_123",
    "taskId": "task_123",
    "runId": "run_123",
    "traceId": "trace_123"
  }
}
```

Replay, review, analysis handoff, and UI diagnostics MUST consume the same runtime facts. They may summarize but MUST NOT recreate observability state from thread prose.

For benchmark trials, evidence export MUST also include dataset id/version, Harbor job/trial ref, task id, configuration id, trial id, trajectory ref, reward ref, reward details ref, artifact manifest ref, and the Agent QC report ref used to detect P0 gate regressions.

## Profile schemas and fixtures

The portable schemas remain available for public compatibility:

- `/schemas/agentruntime-event.schema.json`
- `/schemas/agentruntime-snapshot.schema.json`

The Lime profile adds stricter schemas and example fixtures:

- `/schemas/agentruntime-lime-profile-event.schema.json`
- `/schemas/agentruntime-lime-profile-snapshot.schema.json`
- `/fixtures/lime-profile/submit-turn-event.json`
- `/fixtures/lime-profile/tool-approval-action-required-event.json`
- `/fixtures/lime-profile/task-retry-attempt-failed-event.json`
- `/fixtures/lime-profile/routing-single-candidate-event.json`
- `/fixtures/lime-profile/evidence-export-event.json`
- `/fixtures/lime-profile/thread-read-snapshot.json`
- `/fixtures/lime-profile/benchmark-trial-pack.json`

These fixtures are the minimum conformance pack for Lime profile core.
