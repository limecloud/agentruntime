---
title: Permission and sandbox
description: Agent Runtime permission, approval, and sandbox contract.
---

# Permission and sandbox

Permission is not a dialog. Permission is an auditable runtime decision across tools, processes, network, filesystem, host policy, and human approval.

A compatible runtime SHOULD expose three facts for every constrained action:

1. `permission_state`: current mode, rules, policy sources, and whether user interaction is allowed.
2. `permission_decision`: why this action is allowed, denied, asked, unavailable, or sandboxed.
3. `sandbox_profile`: the actual filesystem, network, environment, process, and platform boundary used at execution time.

## Permission modes

The standard does not require exact names, but implementations SHOULD express these semantics: `default`, `untrusted`, `on_request`, `on_failure`, `never`, `plan`, `bypass`, and `auto`.

Every mode must preserve destructive-action facts. A destructive action SHOULD carry `destructive=true`, impact scope, rollback advice, and decision source.

## Permission decision

A permission decision SHOULD include `decision`, `decision_source`, `decision_reason`, `rule_refs`, `updated_input_ref`, `approval_action_id`, `expires_at`, and `scope`.

A hook-provided allow is a decision source, not a universal override. Explicit deny or ask rules SHOULD still apply.

## Sandbox profile

A sandbox profile SHOULD include `mode`, `cwd`, `read_roots`, `write_roots`, `network`, `environment_ref`, `process_limits`, and `violation_refs`.

The runtime MUST NOT show a sandboxed state in a client while omitting the actual sandbox facts from tool, process, and evidence records.

## Event classes

| Event | When |
| --- | --- |
| `permission.evaluated` | Rules, mode, hooks, host policy, or classifiers produced a decision. |
| `permission.requested` | Runtime needs a human or host decision. |
| `permission.resolved` | The action was allowed, denied, timed out, or cancelled. |
| `sandbox.applied` | A tool or process received its execution sandbox. |
| `sandbox.violation` | Filesystem, network, or permission boundary was triggered. |

## Anti-patterns

- Inferring approval from final prose.
- Recording only the dialog result, not the rule and sandbox facts.
- Waiting for user input in a non-interactive mode.
- Reporting sandbox denial as a generic tool failure.
