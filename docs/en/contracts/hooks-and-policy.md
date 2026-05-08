---
title: Hooks and policy
description: Agent Runtime hooks, policy, and governance contract.
---

# Hooks and policy

Hooks are runtime governance points. They can add context, block input, modify tool arguments, participate in permission decisions, emit audit facts, or run stop checks.

Hooks must not become a second execution path. Hook outcomes must be written back as runtime facts consumed by events, snapshots, evidence, and review.

## Hook points

Compatible runtimes SHOULD support equivalent semantics for `session_start`, `user_prompt_submit`, `pre_tool_use`, `permission_request`, `post_tool_use`, `post_tool_failure`, `post_sampling`, and `stop`.

## Hook input

Hook input SHOULD contain stable scoped identifiers, cwd, workspace scope, permission mode, sandbox summary, safe tool input, transcript refs, routing refs, and policy refs. It MUST NOT include secrets, raw private files, unfiltered environment variables, or unaudited client state by default.

## Hook output

Hook output SHOULD normalize to `continue`, `block`, `allow`, `deny`, `ask`, `updated_input_ref`, `additional_context_refs`, `updated_tool_output_ref`, `suppress_output`, and `audit_refs`.

## Events

| Event | Payload |
| --- | --- |
| `hook.started` | Hook point, handler ref, scope ids, timeout, preview summary. |
| `hook.completed` | Status, duration, decision, added context refs, updated refs. |
| `hook.failed` | Error category, retryability, fail-open or fail-closed behavior. |
| `policy.changed` | Host, workspace, or session policy changed. |

High-risk hooks SHOULD fail closed. Read-only context hooks MAY fail open, but must emit a warning.
