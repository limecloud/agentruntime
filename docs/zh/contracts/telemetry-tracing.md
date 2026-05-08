---
title: Telemetry 与 tracing
description: Agent Runtime 遥测、trace 和 evidence 关联契约。
---

# Telemetry 与 tracing

Telemetry 不是另一个真相来源。Telemetry 是 runtime facts 的可观测投影，必须通过稳定 correlation ids 与 session、thread、turn、tool、model request、process、artifact 和 evidence 关联。

## Correlation model

Runtime events、request logs、spans、metrics 和 evidence SHOULD 共享：

- `runtime_id`
- `session_id`
- `thread_id`
- `turn_id`
- `task_id`
- `tool_call_id`
- `process_id`
- `request_id`
- `queued_turn_id`
- `subagent_id`
- `trace_id`
- `span_id`

无法关联时，应记录 `unavailable` 或 `missing_correlation`，不能按时间戳猜测成确定 join。

## Span model

兼容 runtime SHOULD 至少表达：

| Span | 语义 |
| --- | --- |
| `interaction` | 一次用户或系统输入到 runtime 结束。 |
| `context.resolve` | 上下文、memory、policy、tool inventory 解析。 |
| `model.request` | provider 请求、stream、usage 和 retry。 |
| `tool.call` | 工具审批、执行和结果。 |
| `process.exec` | 命令或 PTY 生命周期。 |
| `hook.run` | hook 执行时间与 outcome。 |
| `artifact.write` | 产物写入或更新。 |
| `evidence.export` | evidence、replay 或 review 导出。 |

Span attributes SHOULD 使用 safe metadata，不复制敏感 prompt、文件内容或密钥。

## Metrics

常见 metrics：

- TTFT。
- model latency 与 retry count。
- token usage。
- tool duration。
- hook duration。
- queue wait。
- permission wait。
- process runtime。
- cost estimated / recorded。
- rate limit 和 quota events。
- evidence export duration。

## Evidence 关联

Evidence export SHOULD 说明：

- 哪些 telemetry 可关联。
- 哪些 telemetry 不适用。
- 哪些 telemetry 缺失。
- 缺失是 `unsupported`、`not_applicable`、`not_recorded` 还是 `correlation_missing`。

不适用的信号不应被写成 known gap。gap 代表当前 scope 中已证明缺失的事实。

## 反模式

- UI 自己统计耗时后作为 runtime 真相。
- request log 没有 turn id，却在 evidence 中声称已关联。
- 所有会话都硬塞固定 gap。
- tracing 记录原始敏感 payload。
