---
title: Subagents 与 jobs
description: Agent Runtime 子代理、后台任务和批处理 job 契约。
---

# Subagents 与 jobs

子代理和 job 都是 runtime work，但语义不同。二者都可以被分配给 `agent task`，但不能替代 task semantics：

- `subagent` 是带 parent links 的子执行上下文，可以有自己的 thread、tools、permissions 和 history。
- `job` 是可持久化的批处理或后台目标，可以拆成多个 items，并把 items 分配给一个或多个 threads。

Objective、lifecycle、attempts、relationships、acceptance 与 recovery 使用 [Agent task](./agent-task.md) 契约；本页只定义 child agent coordination 与 batch/background item processing。

标准 SHOULD 同时支持两者，避免把所有后台工作都压扁成“一个子代理消息”。

## Subagent model

`subagent` SHOULD 包含：

| Field | 含义 |
| --- | --- |
| `subagent_id` | 子代理稳定 id。 |
| `parent_session_id` / `parent_thread_id` / `parent_turn_id` | 父上下文。 |
| `thread_id` | 子代理自己的执行 thread。 |
| `role` / `nickname` | 可展示但不作为权限依据。 |
| `isolation` | prompt、workspace、worktree、tool、permission、memory 的隔离规则。 |
| `model_policy` | 是否继承模型、是否允许 override。 |
| `status` | queued、running、blocked、completed、failed、cancelled、closed。 |
| `last_message_ref` | 给父代理或 UI 的最后状态引用。 |

## Subagent events

| Event | 何时发出 |
| --- | --- |
| `subagent.spawned` | 子代理 thread 已创建或保留。 |
| `subagent.input` | 父级向子代理发送输入。 |
| `subagent.status` | 子代理状态变化。 |
| `subagent.output` | 子代理输出或摘要可用。 |
| `subagent.completed` / `subagent.failed` | 子代理进入终态。 |
| `subagent.closed` | 父级显式关闭或 runtime 清理。 |

如果存在 parent-child graph，runtime SHOULD 持久化边状态，支持恢复后列出 direct children 和 descendants。

## Job model

`job` 适合批量、后台或长目标：

| Field | 含义 |
| --- | --- |
| `job_id` | durable job id。 |
| `task_id` | 可选，job 所属 agent task。 |
| `status` | pending、running、completed、failed、cancelled。 |
| `instruction_ref` | job 指令引用。 |
| `input_refs` | CSV、JSON、artifact、queue 或 external trigger。 |
| `output_schema_ref` | 可选结构化输出约束。 |
| `max_runtime` | 预算或时限。 |
| `items` | 子项列表或 cursor。 |
| `progress` | pending/running/completed/failed 计数。 |
| `assigned_thread_ids` | 正在处理 job items 的 threads。 |

## Job item lifecycle

Job item SHOULD 有独立状态：pending、running、completed、failed、reported。失败 item SHOULD 记录 attempt count、last error、retryability 和 assigned thread。

Event classes：

- `job.created`
- `job.started`
- `job.progress`
- `job.item.started`
- `job.item.completed`
- `job.item.failed`
- `job.completed`
- `job.failed`
- `job.cancelled`

## Control plane

兼容 runtime SHOULD 暴露或映射下列语义：

- spawn / send / wait / resume / close subagent。
- list subagent children / descendants。
- create / start / cancel / inspect job。
- assign / retry / report job item。
- export job evidence 或 replay。

## 反模式

- 子代理完成后只给父级发一段自然语言，不持久化 child thread。
- 父子关系只保存在 UI state，重启后丢失。
- 批处理 job 没有 item 级状态，失败后无法部分重试。
- 子代理和主线程共享写权限，却没有 isolation 事实。
