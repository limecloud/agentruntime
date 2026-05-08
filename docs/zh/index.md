---
title: 概览
description: Agent Runtime 概览。
---

# Agent Runtime

Agent Runtime 是面向 Agent 产品执行层的草案标准。它定义模型、工具、上下文、子代理、产物、证据和 UI 客户端之间的运行事实与控制边界。

Runtime 不是聊天组件。Runtime 是执行权威：接收任务、解析执行上下文、启动 turn、发出 typed events、持久化 snapshots、等待人类决策、恢复执行并导出 evidence。

## 核心模型

```text
input channel -> runtime control plane -> execution loop -> durable facts -> consumers
```

Consumers 可以是 Agent UI、workflow engine、remote channel、replay tool、review system、test harness 和 audit export。它们不应从 UI 状态或普通正文里重建 runtime truth。

## 当前草案范围

- Identity：`session`、`thread`、`task`、`run`、`turn`、`step`、`tool_call`、`action_request`、`subagent`、`artifact_ref`、`evidence_ref`。
- Events：覆盖 lifecycle、task orchestration、model、reasoning、tool、action、queue、context、artifact、evidence、subagent、limits、snapshot、warnings 和 errors 的 typed runtime stream。
- Control plane：submit、interrupt、resume、task create/update/cancel/retry、queue、action response、session reads、thread reads、tool inventory、subagent control、evidence export 和 replay export。
- State：用于恢复、旧 session、tasks、pending requests、incidents、queue state 和 diagnostics 的 durable snapshots 与 read models。
- Boundaries：runtime、UI、model provider、tool system、context store、artifact service、evidence system、host product 之间的所有权分离。
- Runtime depth：permission、sandbox、hooks、process lifecycle、model routing、cost/limit、agent tasks、remote channels、subagent graph、jobs、history recovery 和 large output refs。

## 设计压力

真实 Agent runtime 不只是流式文本。它必须处理长 turn、多 attempt task、工具失败、进程重启、人类审批、队列变更、上下文压缩、子代理委派、后台 job、远程通道、模型回退、限额阻断、大输出和审计复盘。当前草案把这些事实命名，让不同客户端和后端能互操作。
