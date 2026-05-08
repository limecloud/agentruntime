---
title: Runtime model
description: Agent Runtime identity and ownership model.
---

# Runtime model

Agent Runtime uses a small identity hierarchy so long-running work can be resumed, inspected, delegated, and audited.

```text
runtime
  session
    thread
      turn
        task
          step
            tool_call | action_request | artifact_ref | evidence_ref
      subagent
```

## Identities

- `session`: durable user-visible container. It may map to a conversation, workspace task, remote channel thread, or workflow job.
- `thread`: ordered execution context inside a session. A session can contain multiple threads when work branches, delegates, or runs in parallel.
- `turn`: one submitted input cycle. It starts when work is accepted or queued and ends when completed, failed, or cancelled.
- `task`: a unit of work that can outlive a single model call, run in the background, or coordinate subagents.
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
- `action_id` for human decisions.
- `artifact_id` and `evidence_id` for durable refs.

If correlation is unavailable, the runtime should mark the gap. It should not invent a false join.
