---
layout: home
title: Agent Runtime
description: 面向 AI Agent 的可移植执行语义。

hero:
  name: Agent Runtime
  text: 面向 AI Agent 的可移植执行语义。
  tagline: "提交任务、流式输出事实、控制工具、恢复状态、路由模型、管理 Agent task，并导出 evidence，而不绑定某个 UI 或 provider。"
  actions:
    - theme: brand
      text: 阅读规范
      link: /zh/specification
    - theme: alt
      text: 实现快速开始
      link: /zh/authoring/quickstart
    - theme: alt
      text: 标准生态
      link: /zh/reference/agent-ecosystem
    - theme: alt
      text: LLM 完整上下文
      link: /llms-full.txt

features:
  - title: 执行事实权威
    details: "session、thread、turn、task、run、step、tool、action、subagent、artifact 与 evidence 都表示为 typed runtime facts。"
  - title: 内置控制面
    details: "submit、interrupt、resume、queue、steer、action response、task operations、subagent control、snapshot 与 export 都有标准边界。"
  - title: Task-native runtime
    details: "objective、attempt、dependency、progress、owner、delivery state 与 peer task refs 是一等事实。"
  - title: Provider neutral
    details: "OpenAI、Anthropic、本地模型、graph runtime、terminal agent 与自定义 stream 都可适配同一事件模型。"
  - title: 持久恢复
    details: "snapshot、read model、pending request、incident、queue、history window 与 replay export 能跨重启与迁移保留。"
  - title: 面向信任与遥测
    details: "trace id、span、cost、limit、evidence ref、replay case 与 audit export 通过稳定 correlation id 连接。"
---

## Agent Runtime 定义什么

| 契约 | 回答的问题 |
| --- | --- |
| Runtime event stream | 发生了什么、顺序是什么、绑定哪些稳定 id？ |
| Control plane | 哪些写入被允许，submit、interrupt、resume、queue、task 与 action 由谁拥有？ |
| Agent task | 哪些工作被计划、运行、阻塞、重试、委派、验收或交付？ |
| Tool 与 context | 哪些工具、能力、上下文引用、策略和权限可用？ |
| State snapshots | 哪些状态可以稍后 hydrate、inspect、resume 或 repair？ |
| Evidence 与 replay | 哪些执行事实可以导出用于 review、replay、audit 与 support？ |

## 快速入口

- [什么是 Agent Runtime？](./what-is-agent-runtime.md)
- [最新规范](./specification.md)
- [运行时模型](./concepts/runtime-model.md)
- [Agent task](./contracts/agent-task.md)
- [Control plane](./contracts/control-plane.md)
- [Agent 标准生态](./reference/agent-ecosystem.md)

## 面向 AI 客户端

- [llms.txt](/llms.txt)：简洁导航索引。
- [llms-full.txt](/llms-full.txt)：当前英文核心文档合集。
- [llm.txt](/llm.txt) 与 [llm-full.txt](/llm-full.txt)：兼容别名。

## Agent 标准生态

Runtime 负责执行事实与控制面。UI 投影这些事实，Knowledge 提供上下文，Evidence 打包信任记录，相邻 tool、artifact、policy 系统保持自己的事实权威。
