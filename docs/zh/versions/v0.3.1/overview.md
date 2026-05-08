---
title: v0.3.1 概览
description: Agent Runtime v0.3.1 发布概览。
---

# Agent Runtime v0.3.1

Agent Runtime v0.3.1 强化了与 Agent2Agent Protocol 的边界。本 patch release 把 A2A 定位为 peer-agent interoperability reference，同时继续让 Agent Runtime 负责内部 execution facts、task attempts、本地权限、evidence 与 recovery。

## Highlights

- 增加 A2A 官方来源：protocol specification、Google Developers Blog、Linux Foundation 公告和项目仓库。
- 明确 A2A peer tasks 应映射为 local task wrappers 或 remote task refs，而不是替代本地 `task_id` 与 attempt history。
- 扩展 remote channels，加入 `native_protocol`、peer-agent roles、native peer ids、A2A task/context ids 与 peer task lifecycle events。
- 把 A2A Agent Cards、messages、artifacts、streaming、push notifications 和 in-task authorization 映射到 runtime facts。
- 增加反模式：丢失 peer 边界、把 messages 当成 durable outputs、channel 断开后把 peer work 标记 completed。

## Compatibility

v0.3.1 兼容 v0.3.0。它不新增强制传输层，也不把 Agent Runtime 变成 A2A 实现。实现可以暴露 A2A adapter，但 adapter 应同时保留本地 runtime ids 与远端 A2A ids。
