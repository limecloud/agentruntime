---
title: 快速开始
description: 如何实现 Agent Runtime adapter。
---

# 快速开始

从一个最小 adapter 开始：能 submit turn、stream events、persist snapshot，并暴露 thread read model。

## 1. 定义 identity

先创建稳定 ids：

```text
session_id, thread_id, task_id, run_id, turn_id, step_id, tool_call_id, action_id, trace_id
```

这一步应早于 provider 或 tool events 适配。没有稳定 ids，replay 和 resume 会不可靠。

## 2. 归一化 provider streams

把 provider-native chunks 映射为：

- `model.requested`
- `model.delta`
- 适用时的 `reasoning.delta`
- provider 请求工具调用时的 `tool.started` 和 `tool.args`
- `model.completed` 或 `model.failed`

## 3. 实现 tool lifecycle

发出 `tool.started`、`tool.progress`、`tool.result` 或 `tool.failed`。大输入与大输出走 refs。

## 4. 增加 task lifecycle

对于带 objective、可能后台运行、可能 retry、会派生 children，或需要 acceptance 的工作，创建 task records。先发出 `task.created`、`task.started`、`task.progress` 与终态 events，再增加复杂编排。

## 5. 增加 human decisions

需要 permission、plan、credential 或 structured input 时，发出 `action.required` 并停止依赖它的工作。只有 `respond_action` 后才能恢复。

## 6. 持久化 snapshots

每个关键 transition 后持久化 compact session snapshot 和 thread read model。先测试进程重启，再加高级功能。

## 7. 导出 evidence

Evidence 和 replay 必须从 read model 的同一份 store 导出。不要创建第二套 diagnostics truth source。
