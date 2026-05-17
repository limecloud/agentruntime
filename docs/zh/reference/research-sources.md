---
title: 调研来源
description: Agent Runtime 参考的外部标准和实现。
---

# 调研来源

Agent Runtime v0.1 参考了当前标准和实现模式。这些来源是参考，不是依赖。

## 标准与协议

- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18)：tools、resources、prompts、sampling、roots、JSON-RPC message shape 和 capability negotiation。
- [Agent2Agent Protocol specification](https://a2a-protocol.org/latest/specification/)：agent cards、peer tasks、messages、artifacts、streaming、push notifications、security，以及 agent-to-agent interoperability 的 protocol bindings。
- [Google Developers Blog: Announcing the Agent2Agent Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)：A2A 对 capability discovery、task management、artifacts、collaboration、现有 Web standards 和 MCP complementarity 的原始定位。
- [Linux Foundation A2A project announcement](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents)：A2A 作为开放 agent-to-agent communication protocol 的项目治理与中立方向。
- [A2A GitHub project](https://github.com/a2aproject/A2A)：已发布 specification、protocol assets、SDKs、samples 与 issue history。
- [CloudEvents specification](https://github.com/cloudevents/spec)：event type、source、id、time、subject、content type 和 extension attributes 等可移植 event envelope 概念。
- [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification)：request、response、notification、method、params、result 和 error semantics。
- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/)：traces、spans、logs、metrics、context propagation、baggage 和 service/resource attribution。
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)：跨服务传播的 `traceparent` 和 `tracestate`。
- [AsyncAPI specification](https://www.asyncapi.com/docs/reference/specification/latest)：事件驱动 API 描述模式。

## Provider 与 framework references

- [OpenAI API streaming reference](https://platform.openai.com/docs/api-reference/streaming)：response lifecycle、text deltas、output item updates 等 provider stream events。
- [Anthropic Messages streaming](https://docs.anthropic.com/en/docs/build-with-claude/streaming)：message start、content block start/delta/stop、message delta 和 message stop event structure。
- [Anthropic tool use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use)：tool use 与 tool result blocks 是显式内容，不应只靠 prose 表示执行。
- [Vercel AI SDK](https://ai-sdk.dev/docs)：`streamText`、`generateObject`、tool calls、tool results、steps、stop conditions 和 typed UI messages。
- [LangGraph durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)：long-running agents 的 persistence、checkpoints、threads、human-in-the-loop 和 time-travel patterns。
- [LangGraph interrupts and streaming](https://docs.langchain.com/oss/python/langgraph/interrupts)：基于 checkpointer 的 interrupts、resume commands、thread ids 和 task-mode streaming。
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)：multi-agent workflows 中的 agents、handoffs、sessions、guardrails、tracing spans 和 streaming events。
- [Temporal workflows](https://docs.temporal.io/workflows)：workflow ids、run ids、task queues、activities、child workflows、signals、cancellation、retry policies、history 和 durable execution。
- [Harbor framework documentation](https://www.harborframework.com/docs)：agent evaluation 的 benchmark datasets、tasks、trials、artifacts、trajectories、reward files 和 verifier lifecycle。
- [Cline practical guide to hill climbing](https://cline.bot/blog/a-practical-guide-to-hill-climbing)：agent runtime improvement 的 baseline/candidate iteration、failure analysis、single-variable changes、repeated trials 和 pass@k。
- [Agent Runtime battlefield analysis](https://yage.ai/share/agent-runtime-battlefield-20260516.html)：runtime/harness 会显著影响同一模型的 benchmark outcome，应在项目本地任务上评估。

## 设计结论

- Runtime events 应使用稳定 envelope，但不强制单一传输层。
- Provider streams 应被适配，而不是直接成为可移植契约。
- Tool calls 和 human approvals 需要显式 ids 与生命周期记录。
- Durable snapshots 必需，因为 event streams 不能单独解决 old sessions 或 process restart。
- Observability correlation 属于 runtime contract，而不只是 logs。
- Agent-to-agent 工作应建模为带 parent links 的 local tasks、subagents、jobs 或 remote task refs；A2A 是 peer interoperability reference，不替代 runtime facts。
- Task lifecycle 必须和 todo/checklist state 分离，并保留 attempts、dependencies、waiting reasons 和 delivery state。
- A2A messages 与 artifacts 支持 Agent Runtime 采用的同一条分离原则：communication 进入 messages 或 channel events，durable outputs 进入与 task 相连的 artifact refs。
