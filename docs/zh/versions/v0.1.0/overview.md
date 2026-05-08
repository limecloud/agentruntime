---
title: v0.1.0 概览
description: Agent Runtime v0.1.0 的主要变化。
---

# v0.1.0 概览

v0.1.0 将 Agent Runtime 建立为 Agent UI 下方的执行标准。它定义 submit work、stream runtime facts、协调 tools 与 subagents、恢复 state、导出 evidence 的可移植语义。

## 主要变化

- 定义 sessions、threads、turns、tasks、steps、tool calls、action requests、subagents、artifacts 和 evidence 的 runtime identity model。
- 定义覆盖 lifecycle、provider、tool、context、queue、action、subagent、artifact、evidence、limits、snapshots、warnings 和 errors 的 runtime event stream。
- 定义 submit、interrupt、resume、queue、action response、state reads、tool inventory、subagents、evidence 和 replay 的 control plane commands。
- 定义用于恢复和 old-session hydration 的 durable snapshots 与 read models。
- 对齐 MCP、A2A、OpenTelemetry、CloudEvents、JSON-RPC、provider streams 和 durable graph runtimes 的调研结论。
