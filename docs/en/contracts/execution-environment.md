---
title: Execution environment
description: Agent Runtime process, command, workspace, and execution environment contract.
---

# Execution environment

Real runtimes execute local commands, remote commands, PTY sessions, browser actions, and long-running background processes. The standard does not bind a runner, but execution environment facts must be observable, recoverable, and auditable.

## Environment snapshot

Each turn SHOULD form an `execution_environment` snapshot with `workspace_id`, `cwd`, `additional_roots`, `shell`, `os`, `arch`, `env_ref`, `sandbox_profile`, `network_profile`, and `resource_limits`.

## Process lifecycle

Commands and long-running processes SHOULD use their own lifecycle:

| Event | When |
| --- | --- |
| `process.started` | Command, cwd, sandbox, TTY, and process id are known. |
| `process.output` | stdout, stderr, or binary chunk emitted. |
| `process.input` | Runtime writes to stdin. |
| `process.completed` | Exit code, duration, status, and output refs are known. |
| `process.failed` | Spawn, sandbox, permission, timeout, or transport failure. |
| `process.terminated` | User, policy, parent cancellation, or shutdown ended the process. |

Large output SHOULD be stored by reference.

## Command policy

Before execution, runtime SHOULD record safe command summary, parsed subcommands, destructive flag, permission decision, sandbox profile, cwd, path validation, network decision, and justification.

## Recovery

After restart, the runtime SHOULD tell which processes may still exist, which outputs are durable, which refs are unrecoverable, and which actions remain unresolved.
