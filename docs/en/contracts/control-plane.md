---
title: Control plane
description: Agent Runtime control plane contract.
---

# Control plane

The control plane is the write boundary for runtime state. It may be implemented as HTTP, JSON-RPC, local commands, a worker API, or in-process calls. Names can vary, but semantics should remain stable.

## Commands

| Command | Semantics |
| --- | --- |
| `submit_turn` | Accept user or system input, create or select session/thread, and start or queue a turn. |
| `interrupt_turn` | Request cancellation of current work and clear or preserve queued work according to policy. |
| `resume_thread` | Continue a thread after restart, queue pause, provider continuation, or blocked state. |
| `respond_action` | Resolve a pending human or policy request. |
| `remove_queued_turn` | Remove a queued turn by id. |
| `promote_queued_turn` | Move a queued turn ahead according to policy. |
| `get_session` | Return shell, recent history, thread summaries, and cursor metadata. |
| `get_thread_read` | Return current thread status, pending requests, last outcome, incidents, diagnostics, and queue state. |
| `get_tool_inventory` | Return tools available under current scope and policy. |
| `spawn_subagent` | Create a child runtime context with parent links and isolation rules. |
| `send_subagent_input` | Send structured or text input to a child context. |
| `wait_subagents` | Wait for one or more child contexts. |
| `close_subagent` | Ask a child context to stop and release resources. |
| `export_evidence` | Export evidence pack from runtime facts. |
| `export_replay` | Export replay case from the same facts. |

## Idempotency

Mutating commands SHOULD accept an idempotency key or caller-provided ids. Retrying `submit_turn` must not create duplicate turns when the caller provides a stable `turn_id`.

## Action requests

An `action.required` event pauses execution when a decision is needed. It must include:

- stable `action_id`
- `action_type`
- scope ids
- prompt or structured schema
- available decisions
- policy and timeout metadata when applicable

The runtime may continue unrelated tasks, but it must not treat an unresolved action as approved.

## Queue and resume

Queue state is runtime-owned. A busy thread can accept new input as queued work only if policy allows it. Queue snapshots must survive restart. Resume should be explicit when the runtime cannot prove that background work is already active.
