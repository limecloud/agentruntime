---
title: 生态边界
description: Agent Runtime 与相邻系统的边界。
---

# 生态边界

Agent Runtime 协调许多系统，但不吞并它们的所有权。

| System | 拥有 | Runtime 关系 |
| --- | --- | --- |
| Agent UI | Surfaces、interactions、local drafts、progressive rendering。 | 消费 runtime facts，并发送受控 actions。 |
| Model providers | Native APIs、streaming formats、usage accounting、provider errors。 | Runtime 将 provider facts 适配为 normalized lifecycle events。 |
| MCP servers 与 connectors | Tools、resources、prompts、connector auth、external side effects。 | Runtime discovery、filter、invoke，并记录 tool lifecycle。 |
| A2A peers | Remote agent capabilities、tasks、messages、artifacts。 | Runtime 可把 peer tasks 包装成 subagents 或 remote task refs。 |
| Context stores | Memory、knowledge、search、retrieval、source ranking。 | Runtime 记录 selected refs、omissions 和 compaction boundaries。 |
| Policy systems | Permission rules、risk、sandbox profiles、org policy。 | Runtime enforce 或 ask，并记录 decisions。 |
| Artifact services | Content、versions、diff、export bytes。 | Runtime 发出 artifact refs 与 lifecycle facts。 |
| Evidence systems | Traces、verification、replay、review、audit verdicts。 | Runtime 导出并链接 evidence facts。 |
| Host application | Workspace、account、local storage、deployment、navigation。 | Runtime 使用 host scope，并返回 portable state models。 |

干净的 runtime 边界让 UI、模型供应商、connector system 或 evidence backend 可以替换，而不需要重写执行契约。
