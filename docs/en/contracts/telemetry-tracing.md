---
title: Telemetry and tracing
description: Agent Runtime telemetry, trace, and evidence correlation contract.
---

# Telemetry and tracing

Telemetry is not a second truth source. It is an observability projection of runtime facts, joined through stable correlation ids.

## Correlation

Runtime events, request logs, spans, metrics, and evidence SHOULD share `runtime_id`, `session_id`, `thread_id`, `turn_id`, `task_id`, `run_id`, `attempt_id`, `tool_call_id`, `process_id`, `request_id`, `queued_turn_id`, `subagent_id`, `trace_id`, and `span_id` where applicable.

When correlation is not available, record `unavailable` or `missing_correlation`; do not turn timestamp proximity into a certain join.

## Spans

Compatible runtimes SHOULD express interaction, task run, context resolve, model request, tool call, process exec, hook run, artifact write, and evidence export spans.

## Metrics

Common metrics include TTFT, model latency, task duration, retry count, token usage, tool duration, hook duration, queue wait, permission wait, process runtime, cost, rate limit, quota events, and evidence export duration.

Evidence export SHOULD distinguish applicable, not applicable, unsupported, not recorded, and missing correlation.
