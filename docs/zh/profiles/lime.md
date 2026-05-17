---
title: Lime AgentRuntime Profile
description: Lime current runtime 的严格 Agent Runtime profile。
---

# Lime AgentRuntime Profile

Lime Profile 是 Lime current runtime 的实现 profile。它保留公开 Agent Runtime 标准的可移植性，同时把 Lime 执行主链收紧到可测试、可回放、可治理的程度。

该 profile 故意小于公开草案。公开 Agent Runtime 描述可移植语义；Lime Profile 只选择 Lime 当前必须实现的子集，避免 UI、evidence、telemetry 继续各自维护运行真相。

## Conformance levels

| Level | 目的 | 要求 |
| --- | --- | --- |
| Public core | 兼容可移植 Agent Runtime。 | 输出 normalized identities、events、snapshots 与 control-plane 语义。 |
| Lime profile core | 交付 Lime current runtime。 | 使用本页要求的 ids、event families、snapshots 与 evidence join。 |
| Lime extension | Lime 产品细节。 | 只能在 typed payload 或 refs 下增加字段，不能重新定义 owner。 |

Lime-compatible 实现必须先通过 Lime profile core，才能声明更宽功能覆盖。

## Current execution spine

Lime runtime 工作必须流经一条主链：

```text
Objective
  -> Session
  -> Thread
  -> Turn
  -> Step / Item
  -> ToolCall / Action / Process / Subagent
  -> RuntimeEvent
  -> Snapshot / ThreadReadModel
  -> EvidencePack / Replay / Review / UI projection
```

UI 面板、dashboard、analysis prompt 与 review template 都只是这条主链的消费者。它们不能用 UI-only state 重新拼 task status、routing state、permission state、verification gaps 或 evidence summary。

## Required identities

每个 Lime profile event 必须包含 `schemaVersion`、`runtimeId`、`sessionId`、`eventId`、`timestamp`、`sequence`、`type` 与 `payload`。

属于 thread 或 turn 的事件还必须包含：

| Scope | Required ids |
| --- | --- |
| Thread state | `threadId` |
| Turn lifecycle | `threadId`、`turnId` |
| Task lifecycle | `taskId`；存在执行尝试时还要有 `runId` |
| Tool invocation | `threadId`、`turnId`、`stepId`、`toolCallId` |
| Human or policy action | `threadId`、`turnId`、`actionId` |
| Subagent | `subagentId`，以及 parent `sessionId`，通常还有 parent `threadId` / `turnId` |
| Evidence export | `evidenceId`，以及该 scope 下可用的 `sessionId` / `threadId` / `turnId` / `taskId` |

缺失 correlation 是 degraded fact。必须表示为 `unknown`、`unavailable`、`stale` 或 profile validation failure，不能靠解析正文伪造 join。

## Required event families

Lime profile core 要求这些事件族：

- `session.*`、`thread.*`、`turn.*`：工作容器与输入周期。
- `task.*`、`task.attempt.*`、`run.status`：objective work、retry、background work 与 progress。
- `model.*`、`reasoning.*`：归一化 provider generation。
- `tool.*`、`process.*`、`output.*`：工具调用、命令、长期进程、大输出与 result refs。
- `action.*`、`permission.*`、`sandbox.*`、`hook.*`、`policy.changed`：治理与人工决策。
- `context.*`、`history.*`：context assembly、compaction、rollback 与 reconstruction boundary。
- `task.profile.resolved`、`routing.*`、`cost.*`、`rate_limit.hit`、`quota.*`、`limit.changed`：模型路由与经济状态。
- `subagent.*`、`job.*`、`channel.*`：委派、远程或后台工作。
- `benchmark.*`：用于 Agent QC hill climbing 的 dataset/config/trial/reward/comparison facts。
- `artifact.changed`、`evidence.changed`、`snapshot.updated`、`runtime.warning`、`runtime.error`：持久输出、审计、修复与失败。

公开 schema 可以允许更多事件。Lime profile validation 应在 current Lime runtime 路径输出无 scope 或不可 join 的事件时失败。

## Required read models

Lime runtime 必须从同一组 event facts 维护这些 read models：

| Read model | 必需用途 |
| --- | --- |
| `SessionSnapshot` | Session shell、threads、recent history window、tasks、evidence refs 与 recovery cursor。 |
| `ThreadReadModel` | 当前 thread status、active turn、queued turns、pending actions、incidents、diagnostics、tool calls 与 last outcome。 |
| `TaskSnapshot` | Objective、status、current run、attempts、parent/dependency edges、progress、outputs、artifacts、evidence refs 与 delivery state。 |
| `PermissionSandboxSummary` | Effective permission mode、pending approvals、evaluated decisions、sandbox profile 与 violations。 |
| `RoutingLimitSummary` | Task profile、candidate count、selected model、fallback/no-candidate/single-candidate facts、cost、quota 与 rate-limit state。 |
| `EvidenceSummary` | Evidence pack refs、replay refs、review refs、verification outcomes 与真正适用的 known gaps。 |
| `BenchmarkSummary` | Dataset/task/config ids、trial status、trajectory refs、reward refs、aggregate delta、promotion/revert decision 与 QC regression count。 |

如果信号不适用，应省略或标记 `not_applicable`。不能为每个 session 输出通用 gap。

## Control-plane mapping

Lime 命令可以保留产品命名，但必须映射到这些 profile 语义：

| Profile semantic | Lime boundary |
| --- | --- |
| `submit_turn` | 创建或排队 turn，记录 input snapshot，并在长时间工作前发出 `turn.submitted`。 |
| `interrupt_turn` | 记录 interrupt intent，按策略处理 active tool/process/subagent cleanup，并保留 queued work。 |
| `resume_thread` | 先 rehydrate snapshot，必要时 repair history，并在继续前发出 recovery facts。 |
| `respond_action` | 用稳定 `actionId` 解决 pending action；未解决 action 不能当作 approved。 |
| `create_task` / `update_task` / `retry_task` / `complete_task` | 写入带 attempts 和 graph edges 的 task facts，而不是 UI-only cards。 |
| `get_session` / `get_thread_read` | 读取 durable snapshots 和 read models，而不是 UI 摘要。 |
| `export_evidence` / `export_replay` / `export_review` | 从与 UI、diagnostics 共享的 runtime facts 导出。 |
| `start_benchmark_trial` / `record_benchmark_reward` / `export_benchmark_trial` / `compare_benchmark_runs` | 保留 Agent QC benchmark task、trajectory、reward 和 comparison facts。 |

任何写 runtime truth 的 current Tauri command、frontend gateway、mock 或 catalog entry，都应能追踪到这些语义之一。

## Evidence boundary

Lime Profile 规定 evidence 是 runtime facts 的消费者，不是另一套 reporter。Evidence export 必须包含适用于导出 scope 的 correlation spine：

```json
{
  "runtimeCorrelation": {
    "runtimeId": "lime_runtime_local",
    "sessionId": "sess_123",
    "threadId": "thread_123",
    "turnId": "turn_123",
    "taskId": "task_123",
    "runId": "run_123",
    "traceId": "trace_123"
  }
}
```

Replay、review、analysis handoff、benchmark comparison 与 UI diagnostics 必须消费同一组 runtime facts。它们可以摘要，但不能从 thread prose 重建 observability state。

对于 benchmark trials，evidence export 还必须包含 dataset id/version、task id、configuration id、trial id、trajectory ref、reward ref、reward details ref，以及用于检测 P0 gate regression 的 Agent QC report ref。

## Profile schemas and fixtures

可移植公开 schema 保持不变：

- `/schemas/agentruntime-event.schema.json`
- `/schemas/agentruntime-snapshot.schema.json`

Lime Profile 新增严格 schema 和示例 fixtures：

- `/schemas/agentruntime-lime-profile-event.schema.json`
- `/schemas/agentruntime-lime-profile-snapshot.schema.json`
- `/fixtures/lime-profile/submit-turn-event.json`
- `/fixtures/lime-profile/tool-approval-action-required-event.json`
- `/fixtures/lime-profile/task-retry-attempt-failed-event.json`
- `/fixtures/lime-profile/routing-single-candidate-event.json`
- `/fixtures/lime-profile/evidence-export-event.json`
- `/fixtures/lime-profile/thread-read-snapshot.json`
- `/fixtures/lime-profile/benchmark-trial-pack.json`

这些 fixtures 是 Lime profile core 的最小 conformance pack。
