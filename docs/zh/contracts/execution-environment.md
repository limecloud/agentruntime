---
title: Execution environment
description: Agent Runtime 进程、命令、工作区和执行环境契约。
---

# Execution environment

真实 runtime 经常需要运行本地命令、远程命令、PTY 会话、浏览器动作或长期后台进程。标准不绑定具体执行器，但要求执行环境事实可观察、可恢复、可审计。

## Environment snapshot

每个 turn SHOULD 形成 `execution_environment` snapshot：

| Field | 含义 |
| --- | --- |
| `workspace_id` | host 层工作区或项目标识。 |
| `cwd` | 默认工作目录。 |
| `additional_roots` | 额外允许目录和来源。 |
| `shell` | shell 或 process runner 类型。 |
| `os` / `arch` | 平台摘要；不要暴露不必要指纹。 |
| `env_ref` | 已过滤环境变量引用。 |
| `sandbox_profile` | 当前默认 sandbox profile。 |
| `network_profile` | 当前网络策略。 |
| `resource_limits` | 输出、进程数、超时、并发限制。 |

执行环境 snapshot 是工具和进程事件的默认上下文。单个工具可覆盖，但必须留下覆盖原因。

## Process lifecycle

命令或长期进程 SHOULD 使用独立 lifecycle，而不是只作为普通 tool result：

| Event | 何时发出 |
| --- | --- |
| `process.started` | 命令、cwd、sandbox、tty、process id 已确定。 |
| `process.output` | stdout/stderr 或二进制 chunk 输出。 |
| `process.input` | runtime 向 stdin 写入内容。 |
| `process.completed` | exit code、duration、status、output refs。 |
| `process.failed` | spawn、sandbox、权限、timeout 或 transport failure。 |
| `process.terminated` | user、policy、parent cancellation 或 runtime shutdown 终止。 |

大输出 SHOULD 写入 output storage，并在 event 中只放 preview 与 ref。

## Command policy

Runtime SHOULD 在执行前记录：

- command args 或安全摘要。
- parsed command / subcommand summary。
- destructive flag。
- permission decision。
- sandbox profile。
- cwd 与路径校验结果。
- network decision。
- justification 或 user-provided reason。

这能避免“命令看起来成功，但实际在错误目录、无网络或只读沙箱中运行”的不可诊断状态。

## Interactive sessions

PTY / terminal session SHOULD 支持：

- stable `process_id`。
- `write_stdin` 操作的 event 与 output window。
- idle、running、exited、failed 状态。
- max output、head/tail buffer 和 truncation policy。
- parent turn 或 task 结束后的保留 / 终止策略。

## 恢复与清理

Runtime 重启后 SHOULD 能回答：

1. 哪些进程仍可能存在。
2. 哪些输出已持久化。
3. 哪些 process refs 已不可恢复。
4. 哪些 action 或 permission 仍未解决。

如果无法恢复，snapshot 应标为 `stale` 或 `unavailable`，不能假装 completed。
