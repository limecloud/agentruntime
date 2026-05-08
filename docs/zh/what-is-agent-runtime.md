---
title: 什么是 Agent Runtime？
description: Agent Runtime 定义 AI Agent 的可移植执行语义。
---

# 什么是 Agent Runtime？

Agent Runtime 定义 Agent 工作如何被接收、执行、观察、控制、恢复和审计。它位于 Agent UI 之下，位于具体 model provider、tool system、context store、artifact service 和宿主应用存储之上。

适用于需要稳定执行语义的产品：

- 用户 turn，以及带 attempts、progress、graph edges 和 delivery state 的 agent tasks
- model routing、fallback、limits、token / cost accounting
- streaming text、reasoning 和 structured output
- tool calls、tool results、大输出 refs 和 tool errors
- human approval、structured input、interrupt 和 resume
- queues、steering、long-running turns 和 subagents
- context assembly、memory retrieval、compaction 和 missing context
- artifact refs、evidence refs、replay cases 和 review exports

不要用 Agent Runtime 定义视觉界面、模型供应商 API、连接器协议、业务数据库 schema、artifact 文件格式或 evidence review policy。这些属于相邻系统。

## 层次地图

| Layer | 主要问题 | Runtime facts |
| --- | --- | --- |
| `input` | 谁提交了什么工作？ | session、thread、turn、draft、attachments、source channel、request ids。 |
| `execution` | 当前在运行什么，为什么？ | turn status、task lifecycle、task attempts、model routing、tool calls、action requests、subagents。 |
| `state` | 什么可以之后恢复或检查？ | snapshots、thread read model、queue、pending requests、incidents、checkpoints。 |
| `coordination` | 使用了哪些外部系统？ | tool inventory、context refs、artifact refs、evidence refs、policy decisions。 |
| `observability` | 是否能 trace、replay、review 或 audit？ | trace ids、spans、timeline、evidence pack、replay case、verification summaries。 |

Runtime 可以嵌入桌面应用，也可以作为 HTTP API、worker、local/remote agent coordinator 存在。标准约束事实与控制语义，不约束部署形态。
