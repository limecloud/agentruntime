---
title: Tool 与 context
description: Tool、context、model 与 policy 编排契约。
---

# Tool 与 context

Agent Runtime 协调 tools 和 context，但不拥有所有外部 capability。

## Tool inventory

`tool.catalog.resolved` event 或 inventory response SHOULD 包含：

| Field | 含义 |
| --- | --- |
| `tool_name` | 本 turn 稳定 tool name。 |
| `description` | 安全的用户可见摘要。 |
| `input_schema` | JSON Schema 或等价 schema ref。 |
| `capabilities` | read、write、network、browser、filesystem、shell、artifact 或 custom flags。 |
| `policy` | allowed、ask、denied、sandboxed 或 unavailable。 |
| `runtime_owner` | local、MCP server、hosted connector、provider-native、workflow 或 subagent。 |
| `metadata_ref` | 可选大 metadata 或 private metadata 引用。 |

## Tool invocation

Tool lifecycle events 应保留：

- `tool_call_id`
- safe arguments 或 argument ref
- policy decision 与 approval links
- progress 与 partial output
- result ref、preview、images、artifacts 或 evidence refs
- error category、retryability 和 recovery advice

Tool results 不应被压扁成最终回答正文。

## Context assembly

Runtime 选择重要 context 时 SHOULD 发出 `context.resolved`：

- memory refs
- knowledge/source refs
- workspace 或 file refs
- browser/session refs
- policy facts
- project 或 system instruction refs
- context omissions 或 missing facts

## Compaction

Context compaction 是 runtime 边界。它应发出 start/completed/failed events，携带 trigger、summary preview、affected turns 和 downstream continuation refs。Compaction 不能抹掉 unresolved action requests、active incidents 或 evidence links。

## Model routing

Model routing 与 fallback 应作为 runtime facts 可见：

- requested provider 和 model
- capability requirements
- candidate set
- selected candidate
- fallback chain
- budget 与 rate-limit state
- decision reason

这样 UI、replay 和 review 才能解释 runtime 为什么这样执行。
