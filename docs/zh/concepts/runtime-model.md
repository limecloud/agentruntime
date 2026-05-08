---
title: 运行时模型
description: Agent Runtime identity 与所有权模型。
---

# 运行时模型

Agent Runtime 使用一组小的 identity hierarchy，让长任务可以恢复、检查、委派和审计。

```text
runtime
  session
    task
      run
    thread
      turn
        step
          tool_call | action_request | artifact_ref | evidence_ref
      subagent
```

## Identities

- `session`：用户可见的 durable container，可对应 conversation、workspace task、remote channel thread 或 workflow job。
- `task`：带 objective、lifecycle、attempts、relationships、acceptance 和 recovery state 的 durable work unit。它可以属于 thread、跨多个 turns，或在后台运行。
- `run`：某个 task 的一次执行尝试。Retry、resume 或换 worker 执行时应创建新 run，而不是覆盖 task history。
- `thread`：session 内的有序执行上下文。分支、委派或并行工作时，一个 session 可以有多个 threads。
- `turn`：一次提交输入周期，从 accepted/queued 开始，到 completed/failed/cancelled 结束。
- `step`：有序 runtime item，例如 status、text、reasoning、tool call、approval request、artifact、warning 或 evidence link。
- `subagent`：带 parent ids 的子 runtime context。
- `artifact_ref` 和 `evidence_ref`：指向 owner 系统的稳定引用，不是复制内容。

## 所有权规则

Runtime 拥有 identity、status、sequencing、queue state 和 action lifecycle。相邻系统拥有自己的 facts：

| Fact | Owner |
| --- | --- |
| Model output chunks 与 provider errors | Provider adapter，由 runtime 归一化。 |
| Tool schema 与外部执行 | Tool 或 connector system，由 runtime 编排。 |
| Memory、search、knowledge facts | Context system，由 runtime 选择。 |
| Artifact bytes 与 versions | Artifact service，runtime 引用。 |
| Verification 与 review verdicts | Evidence system，由 runtime 导出。 |
| 可见 UI 状态 | Agent UI 或 host product，永远不是 runtime truth。 |

## Correlation

兼容 runtime SHOULD 在所有边界携带 correlation ids：

- `trace_id` 和 `span_id` 用于 telemetry。
- `request_id` 用于 transport 或 API request 关联。
- `turn_id` 和 `tool_call_id` 用于 tool 与 provider calls。
- `task_id` 和 `run_id` 用于 task lifecycle、retries 和 background work。
- `action_id` 用于 human decisions。
- `artifact_id` 和 `evidence_id` 用于 durable refs。

如果无法关联，runtime 应标记 gap，而不是伪造 join。
