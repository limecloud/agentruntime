---
title: v0.3.0 规范快照
description: Agent Runtime v0.3.0 规范快照。
---

# v0.3.0 规范快照

v0.3.0 是第一个把 `task` 定义为一级执行对象的 Agent Runtime 快照，而不再只把它当成宽泛的后台工作标签。

## 相比 v0.2.0 的新增要求

兼容 v0.3.0 的实现 SHOULD 暴露：

- 任务执行存在时，携带 `task_id` 与 `run_id` / `attempt_id` correlation。
- 从创建、进度、等待、重试、取消、失败、丢失、完成到归档的 task lifecycle events。
- Task graph edges：parent/child、blocks/blocked-by、source task、source attempt、spawned subagent、assigned thread、artifact、evidence relationships。
- Attempt history：retry 时保留失败 run，不覆盖 task record。
- Snapshot 中的 task read models：active tasks、blocked tasks、attempts、graph edges、delivery state 和 recent terminal tasks。
- Control-plane semantics：create、update、start、progress append、pause、resume、cancel、retry、complete、fail、list、get、link、unlink tasks。

## Key contracts

- [Agent task](../../contracts/agent-task.md)
- [规范](../../specification.md)
- [运行时模型](../../concepts/runtime-model.md)
- [Runtime event stream](../../contracts/runtime-event-stream.md)
- [State snapshots](../../contracts/state-snapshots.md)
- [Control plane](../../contracts/control-plane.md)
