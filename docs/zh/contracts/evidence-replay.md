---
title: Evidence 与 replay
description: Agent Runtime 的 evidence 与 replay 契约。
---

# Evidence 与 replay

Agent Runtime 应让工作可审计。Evidence 与 replay exports 必须来自驱动 UI 和 diagnostics 的同一份 runtime facts。

## Evidence pack

Evidence pack SHOULD 包含：

- runtime summary
- event 或 timeline summary
- thread read model
- tool calls 与 failed calls
- artifacts 与 artifact refs
- context refs 与 compaction boundaries
- provider routing 与 limit events
- 适用时的 verification outcomes
- 适用时的 review 或 audit notes

Evidence system 拥有 verdicts。Runtime 拥有 export scope、correlation ids 和 references。

## Replay case

Replay case SHOULD 包含：

- input payload 和 selected options
- context 与 tool inventory refs
- expected state 或 behavior assertions
- evidence links
- 适用时的 grader 或 review instructions

Replay 不能只依赖 UI 截图或最终正文。

## Observability

兼容 runtime SHOULD 将执行映射到 trace concepts：

- session/thread/turn 作为 trace attributes
- model call、tool call、context retrieval、artifact write 和 export 作为 spans
- warnings 与 decisions 作为 span events 或 logs
- token usage、latency、retries、queue wait 和 tool duration 作为 metrics

可用时，trace ids 应出现在 runtime events 和 evidence exports 中。
