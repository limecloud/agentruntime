---
title: State snapshots
description: Agent Runtime 的 durable snapshots 与 read models。
---

# State snapshots

Snapshots 让消费者不必从头 replay 所有 events。它们也是 old sessions、inactive tabs、remote clients 和 evidence exporters 的恢复桥。

## Session snapshot

Session snapshot SHOULD 包含：

- session id、title、timestamps、workspace 或 account scope
- active thread ids 和 pinned thread ids
- 带 cursor 的 recent history window
- thread summaries
- child subagent summaries
- 最新 evidence 和 artifact refs
- stale 或 truncated flags

## Thread read model

Thread read model SHOULD 包含：

- `thread_id`
- `status`
- `active_turn_id`
- pending action requests
- last outcome
- active incidents
- queued turns
- latest compaction boundary
- diagnostics summary
- tool/artifact/evidence summaries
- model routing 和 limit state
- permission state、sandbox profile 和 pending approvals
- active processes、output refs 和 execution environment
- subagent graph、job progress 和 remote channel state
- telemetry correlation summary

这个 read model 是“当前发生了什么”的事实入口。消费者不应从 UI state 独立计算。

## Diagnostics

Diagnostics 可以包括 warnings、failed tools、failed commands、pending requests、stalled turns、interrupt state、quota blocks 和 context gaps。缺少 diagnostic 不等于 healthy；不支持的事实应标为 `unavailable`。

## History windows

旧 session 应渐进加载：

1. session shell 和 thread summaries
2. recent history window
3. active thread read model
4. queue 和 pending requests
5. tool、artifact、evidence 与 older history 按需加载

Bounded history 和 cursors 属于 runtime contract，因为它们决定客户端能否安全恢复长任务。


## Snapshot honesty

Snapshots SHOULD prefer explicit status over optimistic inference:

- `unknown`：runtime 没有足够事实。
- `unavailable`：当前实现或环境不支持。
- `not_applicable`：该信号对当前 thread 不适用。
- `stale`：事实可能不是当前状态。
- `blocked`：需要 permission、credential、quota、network、context 或 human action。

Evidence、review 和 UI 应消费这些状态，而不是自行补默认成功。
