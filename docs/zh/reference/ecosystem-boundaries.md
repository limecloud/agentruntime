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
| A2A peers | Remote agent cards、capabilities、peer tasks、messages、artifacts、streaming 和 push notifications。 | Runtime 把 peer work 映射为 local task/subagent edges、channel facts 与 artifact refs，同时保留 A2A native ids。 |
| Context stores | Memory、knowledge、search、retrieval、source ranking。 | Runtime 记录 selected refs、omissions 和 compaction boundaries。 |
| Policy systems | Permission rules、risk、sandbox profiles、org policy。 | Runtime enforce 或 ask，并记录 decisions。 |
| Artifact services | Content、versions、diff、export bytes。 | Runtime 发出 artifact refs 与 lifecycle facts。 |
| Evidence systems | Traces、verification、replay、review、audit verdicts。 | Runtime 导出并链接 evidence facts。 |
| Host application | Workspace、account、local storage、deployment、navigation。 | Runtime 使用 host scope，并返回 portable state models。 |

干净的 runtime 边界让 UI、模型供应商、connector system 或 evidence backend 可以替换，而不需要重写执行契约。

## A2A 边界

当一个 Agent 把工作委派给另一个独立 Agent 时，A2A 是正确的协议参考。Agent Runtime 应引用并可互操作，但不吞并它：

| A2A concept | Runtime mapping |
| --- | --- |
| Agent Card | Peer capability snapshot、channel capabilities、routing input，以及可选 `agent_card_ref`。 |
| Task / `taskId` / `contextId` | 关联到本地 `task_id`、parent task、subagent 或 channel 的 remote task ref。 |
| Message | Channel input、task interaction、status message 或 clarification；它本身不是 durable output。 |
| Artifact / artifact update | Artifact refs，以及 `produced_artifact` / `consumed_artifact` task graph edges。 |
| Streaming / push notification | `channel.*`、`task.progress`、`task.completed`、`artifact.changed`、cursor、ack 和 snapshot repair facts。 |
| In-task authorization | `action.required`、permission bridge events 与 policy decision facts。 |

Runtime 边界仍然是内部执行真相：attempts、tool calls、process execution、sandbox、hooks、本地 permission decisions、evidence 和 replay 都是 runtime facts，即使远端 peer 使用 A2A。
