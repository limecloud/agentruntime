---
title: Research sources
description: External standards and implementations considered for Agent Runtime.
---

# Research sources

Agent Runtime v0.1 was informed by current standards and implementation patterns. These sources are references, not dependencies.

## Standards and protocols

- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18): tools, resources, prompts, sampling, roots, JSON-RPC message shape, and capability negotiation.
- [Agent2Agent Protocol specification](https://a2a-protocol.org/dev/specification/): agent cards, tasks, messages, artifacts, streaming, and push-style coordination between agents.
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

## Design conclusions

- Runtime events should use a stable envelope, but not require one transport.
- Provider streams should be adapted instead of exposed directly as the portable contract.
- Tool calls and human approvals need explicit ids and lifecycle records.
- Durable snapshots are required because event streams alone do not solve old sessions or process restart.
- Observability correlation belongs in the runtime contract, not only in logs.
- Agent-to-agent work should be modeled as subagents or remote tasks with parent links.
