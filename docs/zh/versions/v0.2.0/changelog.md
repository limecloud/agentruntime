---
title: v0.2.0 变更记录
description: Agent Runtime v0.2.0 变更记录。
---

# v0.2.0 变更记录

## Added

- 在分析真实终端型、系统型和桌面型 agent runtime 后，扩展最新 Agent Runtime 草案。
- 新增 permission and sandbox、hooks and policy、execution environment、model routing and limits、subagents and jobs、remote channels、telemetry and tracing、session history and recovery、large output storage 契约。
- 新增 source-analysis 参考页，将实现压力映射为可移植标准表面。
- 扩展 event families，加入 permission、sandbox、hook、process、routing、cost、quota、channel、job、output 和 history repair events。
- 扩展 public event 与 snapshot JSON Schemas，加入 process、channel、routing、permission、sandbox、job、output、telemetry 和 recovery 字段。
- 新增 permission、hook、process stdin、output spill、model routing、limits、remote reconnect 和 job retry 的行为级验收场景。
