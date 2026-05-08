---
title: Implementation quickstart
description: How to implement an Agent Runtime adapter.
---

# Implementation quickstart

Start with a minimal adapter that can submit a turn, stream events, persist a snapshot, and expose a thread read model.

## 1. Define identity

Create stable ids for:

```text
session_id, thread_id, turn_id, step_id, tool_call_id, action_id, trace_id
```

Do this before adapting provider or tool events. Without stable ids, replay and resume will be unreliable.

## 2. Normalize provider streams

Map provider-native chunks into:

- `model.requested`
- `model.delta`
- `reasoning.delta` when applicable
- `tool.started` and `tool.args` when a tool call is requested
- `model.completed` or `model.failed`

## 3. Implement tool lifecycle

Emit `tool.started`, `tool.progress`, `tool.result`, or `tool.failed`. Store large inputs and outputs behind refs.

## 4. Add human decisions

When a permission, plan, credential, or structured input is required, emit `action.required` and stop the dependent work. Resume only after `respond_action`.

## 5. Persist snapshots

Persist a compact session snapshot and thread read model after each major transition. Test process restart before adding advanced features.

## 6. Export evidence

Export evidence and replay from the same store that powers the read model. Do not create a second diagnostic truth source.
