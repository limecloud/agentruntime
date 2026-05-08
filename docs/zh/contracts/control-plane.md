---
title: Control plane
description: Agent Runtime control plane 契约。
---

# Control plane

Control plane 是 runtime state 的写入边界。它可以是 HTTP、JSON-RPC、本地命令、worker API 或 in-process calls。命名可以不同，但语义应稳定。

## Commands

| Command | 语义 |
| --- | --- |
| `submit_turn` | 接收用户或系统输入，创建/选择 session/thread，并启动或排队 turn。 |
| `interrupt_turn` | 请求取消当前工作，并按策略清理或保留 queued work。 |
| `resume_thread` | 在重启、queue pause、provider continuation 或 blocked state 后继续 thread。 |
| `respond_action` | 解决 pending human 或 policy request。 |
| `remove_queued_turn` | 按 id 移除 queued turn。 |
| `promote_queued_turn` | 按策略提升 queued turn。 |
| `get_session` | 返回 shell、recent history、thread summaries 和 cursor metadata。 |
| `get_thread_read` | 返回当前 thread status、pending requests、last outcome、incidents、diagnostics 和 queue state。 |
| `get_tool_inventory` | 返回当前 scope 和 policy 下可用的 tools。 |
| `spawn_subagent` | 创建带 parent links 与 isolation rules 的 child runtime context。 |
| `send_subagent_input` | 给 child context 发送 structured 或 text input。 |
| `wait_subagents` | 等待一个或多个 child contexts。 |
| `close_subagent` | 请求 child context 停止并释放资源。 |
| `export_evidence` | 从 runtime facts 导出 evidence pack。 |
| `export_replay` | 从相同 facts 导出 replay case。 |

## Idempotency

Mutating commands SHOULD 接收 idempotency key 或 caller-provided ids。调用方提供稳定 `turn_id` 时，重试 `submit_turn` 不能产生重复 turns。

## Action requests

当需要决策时，`action.required` 会暂停执行。它必须包含：

- 稳定 `action_id`
- `action_type`
- scope ids
- prompt 或 structured schema
- 可选 decisions
- 适用时的 policy 与 timeout metadata

Runtime 可以继续无关任务，但不能把 unresolved action 当成 approved。

## Queue 与 resume

Queue state 属于 runtime。Busy thread 只有在 policy 允许时才能接受新输入为 queued work。Queue snapshots 必须跨重启保存。Runtime 无法证明后台工作已活跃时，resume 应显式发生。
