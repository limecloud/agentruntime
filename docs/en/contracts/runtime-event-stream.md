---
title: Runtime event stream
description: Agent Runtime event stream contract.
---

# Runtime event stream

The runtime event stream is the canonical stream of execution facts. It can be delivered through Server-Sent Events, WebSocket, JSON-RPC notifications, local process events, a message bus, or an embedded API. The transport is not the standard; the normalized event envelope is.

## Envelope

```json
{
  "type": "tool.started",
  "eventId": "evt_01",
  "schemaVersion": "0.1.0",
  "timestamp": "2026-05-08T02:30:00Z",
  "sequence": 42,
  "sessionId": "sess_123",
  "threadId": "thread_123",
  "turnId": "turn_123",
  "stepId": "step_123",
  "toolCallId": "tool_123",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId": "00f067aa0ba902b7",
  "payload": {
    "toolName": "read_file",
    "safeArgs": { "path": "README.md" },
    "policy": "allowed"
  }
}
```

## Ordering

Events SHOULD be ordered by `sequence` within a stream. Consumers MUST tolerate reconnection, duplicate delivery, and snapshot repair. A later snapshot can correct earlier events, but it must not silently erase an unresolved action or failed tool call.

## Large data

The stream should carry previews and refs for large data:

- tool arguments and results can use `input_ref`, `output_ref`, `preview`, and `metadata`.
- artifacts can use `artifact_id`, `read_ref`, `version_id`, `preview_ref`, and `diff_ref`.
- evidence can use `evidence_id`, `pack_ref`, `trace_ref`, `replay_ref`, and `review_ref`.

## Item and Process Lifecycle

Runtime SHOULD support both coarse lifecycle and item lifecycle:

- `turn.*` describes one input cycle.
- `item.*` describes ordered agent message, reasoning, tool call, command, file change, web search, todo, and error items.
- `process.*` describes commands, PTY sessions, and long-running processes.
- `hook.*`, `permission.*`, and `sandbox.*` describe governance.

SDKs can consume `item.*` while audit and GUI consumers can read deeper runtime facts.

## Routing, Limits, and Remote Events

Model routing and remote channels also belong to the stream:

- `task.profile.resolved`, `routing.candidates.resolved`, `routing.decided`.
- `cost.estimated`, `cost.recorded`, `rate_limit.hit`, `quota.low`, `quota.blocked`.
- `channel.connected`, `channel.resumed`, `channel.permission_forwarded`.

These events may be telemetry-only or read-model-only, but they must be joinable by evidence, replay, and review.

## Provider adaptation

Provider-native streams differ. A runtime adapter SHOULD map them into:

- `model.requested` when a provider call starts.
- `model.delta` for text, structured output, or provider content chunks.
- `reasoning.delta` or `reasoning.summary` when reasoning is exposed separately.
- `tool.started` / `tool.args` when the provider asks for a tool call.
- `model.completed` with usage and stop reason.
- `model.failed` for provider errors.

The runtime should preserve raw provider refs for debugging but expose normalized facts to portable consumers.

## Recovery

A client that reconnects SHOULD request a snapshot, then resume from the last seen event sequence if supported. If the runtime cannot provide replay from a sequence, it should emit `snapshot.updated` and mark the stream recovery mode.
