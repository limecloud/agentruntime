---
title: v0.3.0 概览
description: Agent Runtime v0.3.0 发布概览。
---

# Agent Runtime v0.3.0

Agent Runtime v0.3.0 把 Agent Task 升级为 runtime 一级对象。本版本不再把 task 当作 UI 概念或 checklist，而是定义成带 lifecycle、attempts、relationships、progress、delivery state 与 recovery semantics 的 durable runtime truth。

## Highlights

- 新增 Agent Task 契约，覆盖 objective、lifecycle、runs/attempts、task graph edges、acceptance 与 recovery。
- 区分 `task`、`run`、`step`、`job` 与 `todo`，避免把真实执行压平成一条 message 或 checklist。
- 扩展 task status semantics：waiting、blocked、paused、retrying、timed out、lost、completed、archived、stale、unknown。
- 新增 task orchestration events，覆盖 progress、waiting、dependency updates、delegation、cancellation intent 与 attempt lifecycle。
- 扩展 event 与 snapshot JSON Schemas，新增 task records、attempts、relationships、graph summaries、blocked tasks、delivery state 和 normalized task status。
- 同步 implementation guidance、acceptance scenarios、telemetry、control plane、snapshots、glossary、source analysis 与 examples，统一使用 task ids 与 run ids。

## Compatibility

v0.3.0 保留 v0.2.0 的 runtime surfaces，并在其上新增 task semantics。已有 turn、job、subagent、process、permission、sandbox、routing 与 telemetry 实现可以渐进接入 task model。
