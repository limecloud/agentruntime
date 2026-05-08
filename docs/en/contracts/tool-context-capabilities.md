---
title: Tool and context
description: Tool, context, model, and policy orchestration contract.
---

# Tool and context

Agent Runtime coordinates tools and context without owning every external capability.

## Tool inventory

A `tool.catalog.resolved` event or inventory response SHOULD include:

| Field | Meaning |
| --- | --- |
| `tool_name` | Stable tool name for the turn. |
| `description` | Safe user-facing summary. |
| `input_schema` | JSON Schema or equivalent schema ref. |
| `capabilities` | Read, write, network, browser, filesystem, shell, artifact, or custom flags. |
| `policy` | Allowed, ask, denied, sandboxed, or unavailable. |
| `runtime_owner` | Local, MCP server, hosted connector, provider-native, workflow, or subagent. |
| `metadata_ref` | Optional ref for large or private metadata. |

## Tool invocation

Tool lifecycle events should preserve:

- `tool_call_id`
- safe arguments or argument ref
- policy decision and approval links
- progress and partial output
- result ref, preview, images, artifacts, or evidence refs
- error category, retryability, and recovery advice
- concurrency safety, read-only/destructive flags, and interrupt behavior
- pre/post hook outcomes and permission/sandbox refs

Tool results should not be flattened into final assistant text.

## Context assembly

A runtime SHOULD emit `context.resolved` when it selects important context:

- memory refs
- knowledge/source refs
- workspace or file refs
- browser/session refs
- policy facts
- project or system instruction refs
- context omissions or missing facts

## Compaction

Context compaction is a runtime boundary. It should emit start/completed/failed events with trigger, summary preview, affected turns, and downstream continuation refs. Compaction must not erase unresolved action requests, active incidents, or evidence links.

## Model routing

Model routing and fallback should be visible as runtime facts:

- requested provider and model
- capability requirements
- candidate set
- selected candidate
- fallback chain
- budget and rate-limit state
- decision reason

This lets UI, replay, and review explain why a runtime behaved the way it did.


## Concurrency and Interrupt

Tool inventory SHOULD mark `is_read_only`, `is_concurrency_safe`, `is_destructive`, and `interrupt_behavior`.

The runtime MAY run consecutive read-only tools concurrently, but SHOULD serialize write or destructive tools. Cancelled tools should emit explicit cancelled or interrupted facts instead of silently dropping results.
