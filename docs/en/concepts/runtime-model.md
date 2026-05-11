---
title: Runtime model
description: Agent Runtime identity and ownership model.
---

# Runtime model

Agent Runtime uses a small identity hierarchy so long-running work can be resumed, inspected, delegated, and audited.

```text
runtime
  session
    task
      run
    thread
      turn
        step
          tool_call | action_request | artifact_ref | evidence_ref
      subagent
```

## Identities

- `session`: durable user-visible container. It may map to a conversation, workspace task, remote channel thread, or workflow job.
- `task`: durable unit of work with objective, lifecycle, attempts, relationships, acceptance, and recovery state. It may belong to a thread, span multiple turns, or run in the background.
- `run`: one execution attempt for a task. Retries, resumes, and alternate worker executions should create new runs instead of overwriting task history.
- `thread`: ordered execution context inside a session. A session can contain multiple threads when work branches, delegates, or runs in parallel.
- `turn`: one submitted input cycle. It starts when work is accepted or queued and ends when completed, failed, or cancelled.
- `step`: ordered runtime item such as status, text, reasoning, tool call, approval request, artifact, warning, or evidence link.
- `subagent`: child runtime context with parent ids and its own lifecycle.
- `artifact_ref` and `evidence_ref`: stable references to owned systems, not copied content.

## Ownership rule

The runtime owns identity, status, sequencing, queue state, and action lifecycle. Adjacent systems own their own facts:

| Fact | Owner |
| --- | --- |
| Model output chunks and provider errors | Provider adapter, normalized by runtime. |
| Tool schema and external execution | Tool or connector system, orchestrated by runtime. |
| Memory, search, and knowledge facts | Context system, selected by runtime. |
| Artifact bytes and versions | Artifact service, referenced by runtime. |
| Verification and review verdicts | Evidence system, exported by runtime. |
| Visible UI state | Agent UI or host product, never runtime truth. |

## Correlation

A compatible runtime SHOULD carry correlation ids through every boundary:

- `trace_id` and `span_id` for telemetry.
- `request_id` for transport or API request correlation.
- `turn_id` and `tool_call_id` for tool and provider calls.
- `task_id` and `run_id` for task lifecycle, retries, and background work.
- `action_id` for human decisions.
- `artifact_id` and `evidence_id` for durable refs.

If correlation is unavailable, the runtime should mark the gap. It should not invent a false join.

## Public model and product profiles

The public runtime model defines ownership and portable ids. A product profile may make this stricter for one implementation. For example, the Lime profile requires every current runtime event to carry `runtimeId`, `sessionId`, `eventId`, `timestamp`, `schemaVersion`, `sequence`, and a typed `payload`, and then adds scope-specific ids for turns, tools, actions, tasks, subagents, and evidence.

Profiles are conformance layers, not separate standards. They must preserve the same owner map so UI, evidence, context, policy, tool, and artifact systems do not become competing runtime truth sources.
