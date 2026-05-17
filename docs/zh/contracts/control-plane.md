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
| `create_task` / `update_task` | 用 objective、profile、constraints、owner、acceptance 和 idempotency 创建或更新 agent task。 |
| `start_task` / `append_task_progress` | 启动 task run，或追加 phase、counters、progress summaries、delivery state、output refs。 |
| `pause_task` / `resume_task` / `cancel_task` / `retry_task` | 在保留 attempts 和 graph edges 的前提下修改 task execution state。 |
| `complete_task` / `fail_task` | 用 artifacts、evidence、delivery 和 errors reconcile terminal task state。 |
| `list_tasks` / `get_task` / `link_tasks` / `unlink_tasks` | 读取 task state，并更新 parent、dependency、source、artifact、evidence 或 subagent edges。 |
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
| `evaluate_permission` / `resolve_permission` | 让 host policy、hook 或审批系统参与 permission 决策。 |
| `get_execution_environment` | 返回 cwd、workspace roots、sandbox、network、process limits。 |
| `write_process_stdin` / `terminate_process` | 与长期进程或 PTY 会话交互。 |
| `list_subagents` | 返回 parent-child graph 和 child thread 状态。 |
| `create_job` / `get_job` / `cancel_job` | 管理 durable background 或 batch work。 |
| `reconnect_channel` / `ack_events` | 远程通道恢复和事件确认。 |
| `export_review` | 从相同 facts 导出 review template 或 audit refs。 |

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

## Tasks

Task commands MUST 写入 runtime facts。Task retry 应创建新的 run 或 attempt，而不是覆盖上一次 attempt。Cancellation 应先记录 intent，再按策略传播到 active child tasks、jobs、processes 或 subagents。


## Process 与 channel control

`write_process_stdin` 和 `terminate_process` MUST 只作用于 runtime 已知的 `process_id`。如果进程不可恢复，应返回 `unavailable`，并发出 repair 或 warning event。

`reconnect_channel` SHOULD 接收 channel id、last acknowledged sequence 和 resume token。Runtime 应先返回 snapshot，再补发可 replay events。

## Jobs

Job control SHOULD 区分 job status 与 job item status。取消 job 不等于取消已经完成的 items；retry item 不应创建重复 output。

## Benchmark control

Benchmark commands 不替代 `export_evidence`。它们为 hill-climbing runs 提供稳定 ids，并保证 baseline/candidate comparison 可审计。如果实现不暴露这些显式命令，必须通过 `export_evidence` 或 `export_replay` 导出等价数据。
