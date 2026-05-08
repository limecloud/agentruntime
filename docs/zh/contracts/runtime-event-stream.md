---
title: Runtime event stream
description: Agent Runtime event stream 契约。
---

# Runtime event stream

Runtime event stream 是执行事实的 canonical stream。它可以通过 SSE、WebSocket、JSON-RPC notifications、本地进程事件、message bus 或 embedded API 传递。传输层不是标准，normalized event envelope 才是。

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
  "taskId": "task_123",
  "runId": "run_123",
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

Events SHOULD 在 stream 内按 `sequence` 排序。Consumers MUST 能处理重连、重复投递和 snapshot repair。后续 snapshot 可以修正早期事件，但不能静默抹掉 unresolved action 或 failed tool call。

## 大数据

Stream 应为大数据携带 preview 和 refs：

- tool arguments/results 使用 `input_ref`、`output_ref`、`preview`、`metadata`。
- artifacts 使用 `artifact_id`、`read_ref`、`version_id`、`preview_ref`、`diff_ref`。
- evidence 使用 `evidence_id`、`pack_ref`、`trace_ref`、`replay_ref`、`review_ref`。

## Item 与 process lifecycle

Runtime SHOULD 同时支持 coarse lifecycle 和 item lifecycle：

- `turn.*` 描述一次输入周期。
- `task.*` 描述 objective lifecycle、waiting、progress、retry、cancellation、terminal state 和 task graph updates。
- `item.*` 描述 agent message、reasoning、tool call、command、file change、web search、todo、error 等有序 item。
- `process.*` 描述命令、PTY 或长期进程。
- `hook.*`、`permission.*`、`sandbox.*` 描述治理链路。

这让 SDK 可以只消费 `item.*`，而审计和 GUI 可以继续读取更细粒度的 runtime facts。

## Routing, limits, and remote events

Model routing 与远程通道也属于 event stream：

- `task.profile.resolved`、`routing.candidates.resolved`、`routing.decided`。
- `task.attempt.started`、`task.attempt.completed` 和 `task.attempt.failed` 表达 per-run execution history。
- `cost.estimated`、`cost.recorded`、`rate_limit.hit`、`quota.low`、`quota.blocked`。
- `channel.connected`、`channel.resumed`、`channel.permission_forwarded`。

这些事件可以是 telemetry-only 或 read-model-only，但必须能被 evidence/replay/review 关联。

## Provider adaptation

不同 provider 的 stream 不同。Runtime adapter SHOULD 映射为：

- `model.requested`：provider call 开始。
- `model.delta`：text、structured output 或 provider content chunk。
- `reasoning.delta` / `reasoning.summary`：reasoning 单独暴露时。
- `tool.started` / `tool.args`：provider 请求工具调用时。
- `model.completed`：携带 usage 和 stop reason。
- `model.failed`：provider errors。

Runtime 可以保留 raw provider refs 供调试，但对可移植消费者暴露 normalized facts。

## Recovery

客户端重连后 SHOULD 请求 snapshot，再从 last seen event sequence 继续。如果 runtime 不能按 sequence replay，应发出 `snapshot.updated` 并标记 stream recovery mode。
