---
title: Research sources
description: External standards and implementations considered for Agent Runtime.
---

# Research sources

Agent Runtime v0.1 was informed by current standards and implementation patterns. These sources are references, not dependencies.

## Standards and protocols

- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18): tools, resources, prompts, sampling, roots, JSON-RPC message shape, and capability negotiation.
- [Agent2Agent Protocol specification](https://a2a-protocol.org/latest/specification/): agent cards, peer tasks, messages, artifacts, streaming, push notifications, security, and protocol bindings for agent-to-agent interoperability.
- [Google Developers Blog: Announcing the Agent2Agent Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/): original A2A positioning around capability discovery, task management, artifacts, collaboration, existing web standards, and MCP complementarity.
- [Linux Foundation A2A project announcement](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents): project governance and vendor-neutral direction for A2A as an open agent-to-agent communication protocol.
- [A2A GitHub project](https://github.com/a2aproject/A2A): released specification, protocol assets, SDKs, samples, and issue history.
- [CloudEvents specification](https://github.com/cloudevents/spec): portable event envelope concepts such as event type, source, id, time, subject, content type, and extension attributes.
- [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification): request, response, notification, method, params, result, and error semantics for transport-neutral control planes.
- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/): traces, spans, logs, metrics, context propagation, baggage, and service/resource attribution.
- [W3C Trace Context](https://www.w3.org/TR/trace-context/): `traceparent` and `tracestate` propagation across services.
- [AsyncAPI specification](https://www.asyncapi.com/docs/reference/specification/latest): event-driven API description patterns.

## Provider and framework references

- [OpenAI API streaming reference](https://platform.openai.com/docs/api-reference/streaming): provider stream events such as response lifecycle, text deltas, and output item updates.
- [Anthropic Messages streaming](https://docs.anthropic.com/en/docs/build-with-claude/streaming): message start, content block start/delta/stop, message delta, and message stop event structure.
- [Anthropic tool use](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use): tool use and tool result blocks as explicit content, not prose-only execution.
- [Vercel AI SDK](https://ai-sdk.dev/docs): `streamText`, `generateObject`, tool calls, tool results, steps, stop conditions, and typed UI messages.
- [LangGraph durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution): persistence, checkpoints, threads, human-in-the-loop, and time-travel patterns for long-running agents.
- [LangGraph interrupts and streaming](https://docs.langchain.com/oss/python/langgraph/interrupts): checkpointer-backed interrupts, resume commands, thread ids, and task-mode streaming.
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/): agents, handoffs, sessions, guardrails, tracing spans, and streaming events for multi-agent workflows.
- [Temporal workflows](https://docs.temporal.io/workflows): workflow ids, run ids, task queues, activities, child workflows, signals, cancellation, retry policies, history, and durable execution.
- [Harbor framework documentation](https://www.harborframework.com/docs): benchmark datasets, tasks, trials, artifacts, trajectories, reward files, and verifier lifecycle for agent evaluations.
- [Cline practical guide to hill climbing](https://cline.bot/blog/a-practical-guide-to-hill-climbing): baseline/candidate iteration, failure analysis, single-variable changes, repeated trials, and pass@k for agent runtime improvement.
- [Agent Runtime battlefield analysis](https://yage.ai/share/agent-runtime-battlefield-20260516.html): runtime/harness can materially affect same-model benchmark outcomes and should be evaluated on project-local tasks.

## Design conclusions

- Runtime events should use a stable envelope, but not require one transport.
- Provider streams should be adapted instead of exposed directly as the portable contract.
- Tool calls and human approvals need explicit ids and lifecycle records.
- Durable snapshots are required because event streams alone do not solve old sessions or process restart.
- Observability correlation belongs in the runtime contract, not only in logs.
- Agent-to-agent work should be modeled as local tasks, subagents, jobs, or remote task refs with parent links; A2A is the peer interoperability reference, not a replacement for runtime facts.
- Task lifecycle must be separate from todo/checklist state and preserve attempts, dependencies, waiting reasons, and delivery state.
- Benchmark trials need first-class runtime correlation so reward changes can be attributed to model, prompt, tool, context, routing, UI projection, environment, or verifier behavior.
- A2A messages and artifacts support the same separation used by Agent Runtime: communication belongs in messages or channel events, while durable outputs belong in artifact refs linked to tasks.
