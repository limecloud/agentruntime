---
title: v0.3.1 规范快照
description: Agent Runtime v0.3.1 规范快照。
---

# v0.3.1 规范快照

v0.3.1 保留 v0.3.0 的 Agent Task 模型，并为 remote channels 与 task delegation 增加显式 A2A peer-task alignment。

## 相比 v0.3.0 的明确要求

兼容 v0.3.1 的实现 SHOULD 保留：

- 即使委派 peer 返回 A2A `taskId`，本地仍要保留 `task_id`。
- 用 `remote_task_ref` 保存 A2A `taskId`、`contextId` 等 peer-native ids。
- 用 `native_protocol` 与 `native_status` 保留归一化之前的 peer protocol 与状态。
- Agent Card 作为 capability snapshot 或 routing input，不作为 runtime ownership record。
- A2A messages 映射为 input、clarification、task interaction 或 status events，而不是 durable outputs。
- A2A artifacts 映射为通过 task graph edges 关联的 artifact refs。
- Streaming、subscribe 或 push notification delivery 映射为 channel、task progress、artifact、cursor、ack 与 snapshot repair facts。
- In-task authorization 映射为 action 与 permission bridge facts。

## Key contracts

- [Remote channels](../../contracts/remote-channels.md)
- [Agent task](../../contracts/agent-task.md)
- [生态边界](../../reference/ecosystem-boundaries.md)
- [调研来源](../../reference/research-sources.md)
- [规范](../../specification.md)
