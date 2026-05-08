---
title: v0.3.1 变更记录
description: Agent Runtime v0.3.1 变更记录。
---

# v0.3.1 变更记录

## Added

- 增加 A2A 官方引用，覆盖最新 specification、Google launch post、Linux Foundation project governance 和 GitHub project。
- 增加 A2A 边界映射，覆盖 Agent Card、task ids、context ids、messages、artifacts、streaming、push notifications 和 in-task authorization。
- 增加 A2A peer-task 字段：`native_protocol`、`remote_task_id`、`remote_context_id`、`agent_card_ref`、`delivery_mechanism`、`native_status` 和 `remote_artifact_refs`。
- 增加 remote channel peer-task events，用于记录 remote peer tasks 的 link 与 update。

## Changed

- 明确 A2A 是 peer interoperability reference，不替代 Agent Runtime execution facts。
- 扩展 remote channel identity、ingress、recovery 与 peer protocols 相关反模式。
- 明确 durable outputs 应使用 artifact refs，而不是 messages。
