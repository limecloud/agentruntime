---
title: 术语表
description: Agent Runtime 术语表。
---

# 术语表

- `runtime`：拥有 Agent facts 和 control semantics 的执行权威。
- `session`：用户可见的 durable work container。
- `thread`：session 内的有序执行上下文。
- `turn`：一次提交输入周期。
- `task`：可跨 turn 或后台运行的工作单元。
- `step`：turn 或 task 内的有序 runtime item。
- `tool_call`：一次工具或 connector 调用。
- `action_request`：等待 human 或 policy decision 的请求。
- `subagent`：由 parent runtime 委派的 child runtime context。
- `read model`：从 runtime facts 派生的紧凑检查视图。
- `snapshot`：用于恢复和 hydration 的 durable state。
- `evidence pack`：用于 review、replay、verification 或 audit 的导出事实。
- `provider adapter`：把 provider-native streams 映射为 runtime events 的层。
- `capability surface`：当前 policy 和 context 下可用的 tools/actions。
- `compaction boundary`：上下文被总结或重写的 runtime checkpoint。
