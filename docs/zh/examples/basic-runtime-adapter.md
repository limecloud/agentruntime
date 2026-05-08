---
title: 基础 runtime adapter
description: 最小 Agent Runtime adapter 示例。
---

# 基础 runtime adapter

以下伪代码展示最小 adapter 形态。它不是必需 SDK。

```ts
type RuntimeEvent = {
  type: string
  eventId: string
  timestamp: string
  sessionId: string
  threadId: string
  turnId?: string
  sequence?: number
  payload?: unknown
}

async function submitTurn(input: SubmitTurn): Promise<AcceptedTurn> {
  const ids = allocateIds(input)
  emit({ type: 'turn.submitted', ...ids, payload: { source: input.source } })
  persistThreadRead(ids.threadId, { status: 'preparing', activeTurnId: ids.turnId })

  try {
    emit({ type: 'turn.started', ...ids })
    const context = await resolveContext(input)
    emit({ type: 'context.resolved', ...ids, payload: context.summary })

    const tools = await resolveToolInventory(input)
    emit({ type: 'tool.catalog.resolved', ...ids, payload: tools.summary })

    for await (const part of provider.stream(input, context, tools)) {
      emit(mapProviderPart(part, ids))
    }

    emit({ type: 'turn.completed', ...ids })
    persistThreadRead(ids.threadId, { status: 'completed', activeTurnId: undefined })
  } catch (error) {
    emit({ type: 'turn.failed', ...ids, payload: normalizeError(error) })
    persistThreadRead(ids.threadId, { status: 'failed', lastOutcome: normalizeError(error) })
  }

  return ids
}
```

重要的不是函数名，而是每个外部可见变化都先成为 runtime fact，再被 UI、replay 或 audit consumers 使用。
