---
title: v0.3.0 变更记录
description: Agent Runtime v0.3.0 变更记录。
---

# v0.3.0 变更记录

## Added

- 新增 Agent Task 作为 Agent Runtime 一级契约。
- 新增 task lifecycle、attempts/runs、task graph、progress、delivery state 和 task control-plane semantics。
- 在 public event schema 中新增 task orchestration events 与 attempt lifecycle events。
- 在 public snapshot schema 中新增 task records、task attempts、task relationships、task summary、blocked tasks 和 delivery state。
- 新增 task-aware implementation guidance、acceptance scenarios、telemetry correlation、quickstart、examples、glossary、source analysis 和 research sources。

## Changed

- 明确 `job`、`subagent`、`run`、`step` 与 `todo` 都和 task execution 相关，但不能替代 task semantics。
- 围绕 Agent Task 扩展最新规范的 identity、event、control-plane、snapshot、completion/failure 与 validation sections。
