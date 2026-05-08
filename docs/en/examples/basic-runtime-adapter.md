---
title: Basic runtime adapter
description: A minimal Agent Runtime adapter example.
---

# Basic runtime adapter

This pseudo-code shows the shape of a minimal adapter. It is not a required SDK.

```ts
type RuntimeEvent = {
  type: string
  eventId: string
  timestamp: string
  sessionId: string
  threadId: string
  taskId?: string
  runId?: string
  turnId?: string
  sequence?: number
  payload?: unknown
}

async function submitTurn(input: SubmitTurn): Promise<AcceptedTurn> {
  const ids = allocateIds(input)
  emit({ type: 'task.created', ...ids, payload: { objective: input.objective } })
  emit({ type: 'turn.submitted', ...ids, payload: { source: input.source } })
  persistThreadRead(ids.threadId, { status: 'preparing', activeTurnId: ids.turnId, tasks: [{ taskId: ids.taskId, status: 'accepted' }] })

  try {
    emit({ type: 'task.started', ...ids })
    emit({ type: 'turn.started', ...ids })
    const context = await resolveContext(input)
    emit({ type: 'context.resolved', ...ids, payload: context.summary })

    const tools = await resolveToolInventory(input)
    emit({ type: 'tool.catalog.resolved', ...ids, payload: tools.summary })

    for await (const part of provider.stream(input, context, tools)) {
      emit(mapProviderPart(part, ids))
    }

    emit({ type: 'task.completed', ...ids })
    emit({ type: 'turn.completed', ...ids })
    persistThreadRead(ids.threadId, { status: 'completed', activeTurnId: undefined, tasks: [{ taskId: ids.taskId, status: 'completed' }] })
  } catch (error) {
    emit({ type: 'task.failed', ...ids, payload: normalizeError(error) })
    emit({ type: 'turn.failed', ...ids, payload: normalizeError(error) })
    persistThreadRead(ids.threadId, { status: 'failed', lastOutcome: normalizeError(error), tasks: [{ taskId: ids.taskId, status: 'failed' }] })
  }

  return ids
}
```

The important part is not the function names. The important part is that every externally visible change becomes a runtime fact before UI, replay, or audit consumers use it.
