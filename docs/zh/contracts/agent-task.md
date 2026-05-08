---
title: Agent task
description: Agent Runtime 任务生命周期、编排、尝试、进度与恢复契约。
---

# Agent task

`agent task` 是 runtime 拥有的一等工作单元。它给 Agent 工作提供 objective、scope、lifecycle、progress、relationships 和 delivery semantics。

Task 不是 checklist item，不是 chat message，不是 model request，也不只是 background job。Task 是可持久化的执行对象：它可以跨 turns，启动 runs，派生 subagents，等待输入，产出 artifacts，并在恢复后被审计。

## 设计压力

真实 runtime 以不同形态暴露出同一组 task 压力：

- 终端型 agent 会把前台工作、本地 shell、远程 agent、scheduled work 和 background work 收到同一任务面。
- Gateway / scheduler agent 需要 durable jobs、delivery state、per-run output、checkpoint/resume、missed-run handling 和失败通知。
- 类型化 coding runtime 需要 thread goals、todo lists、plan items、turn status、job items、approval state 和 spawn edges 能用稳定 ids join。
- 桌面 runtime 需要 task profiles、automation jobs、subagent turns、execution summaries、evidence export 和 UI projection 读取同一条事实链。
- Durable workflow systems 证明 workflow id、run id、task queue、child work、signals、cancellation、retries 和 history 不能只留在正文里。

因此，可移植契约需要一个高于单次工具调用、低于宿主产品 workflow 的 task model。

## Task 不是 job、run、step 或 todo

| Object | 含义 | Runtime rule |
| --- | --- | --- |
| `task` | 带 lifecycle、owner、relationships、constraints 和 acceptance 的语义目标。 | 跨 retry、turn、backgrounding 和 recovery 保持稳定。 |
| `run` | 某个 task 的一次执行尝试。 | retry、crash resume 或换 worker 时创建新 run。 |
| `step` | run 或 turn 内的有序 item。 | 可以是 model、reasoning、tool、process、approval、artifact、warning 或 evidence item。 |
| `job` | durable batch 或 scheduled dispatcher。 | 可以创建或拥有 tasks，但不替代 task semantics。 |
| `todo` / `plan item` | Agent 可见 checklist。 | 是有用的进度提示，不是权威 lifecycle。 |

兼容 runtime SHOULD 在这些对象确实存在时分别暴露它们，而不是压平成一个 `message` 或一段 `task` 文本。

## Task record

Task SHOULD 包含：

| Field | 目的 |
| --- | --- |
| `task_id` | 稳定 task id。 |
| `parent_task_id` / `root_task_id` | Task graph linkage。 |
| `session_id` / `thread_id` / `turn_id` | 适用时关联 conversation 或 execution context。 |
| `title` / `objective` | 面向人的工作描述。 |
| `task_kind` / `task_family` | 可移植分类与粗粒度分组。 |
| `visibility` | `foreground`、`background`、`internal` 或 `hidden`。 |
| `status` | 归一化生命周期状态。 |
| `priority` | 调度提示，不是完成保证。 |
| `requested_by` / `owner` / `assignee` | user、agent、workflow、channel 或 worker 归因。 |
| `scope` | workspace、project、thread、account、environment 或 host boundary refs。 |
| `constraints` | permission、sandbox、network、model、tool、cost、time、output 约束。 |
| `task_profile` | capability、latency、budget、fallback 和 continuity profile。 |
| `acceptance` | 完成条件或 refs。 |
| `progress` | percent、phase、current step、summary、counters 或 output refs。 |
| `current_run_id` | 当前 active run。 |
| `attempts` | 历史与当前执行尝试。 |
| `relationships` | dependencies、blocks、child tasks、source tasks、spawned agents、artifacts。 |
| `artifacts` / `evidence_refs` | 产出或消费的 refs。 |
| `last_error` / `status_reason` | 结构化失败、阻塞或等待原因。 |
| `created_at` / `updated_at` / `started_at` / `ended_at` | 生命周期时间。 |

## Status model

可移植 runtime SHOULD 支持这些归一化 task statuses：

| Status | 含义 |
| --- | --- |
| `draft` | 已定义，但 runtime 尚未接受。 |
| `accepted` | Runtime 已接受并分配 identity。 |
| `queued` | 等 scheduler、queue、dependency 或 worker capacity。 |
| `preparing` | 正在解析 context、tools、model、policy 或 environment。 |
| `running` | active execution 正在推进。 |
| `waiting_input` | 等待用户或外部结构化输入。 |
| `waiting_permission` | 等待 human、policy 或 host approval。 |
| `waiting_resource` | 等待 credential、quota、file、network、worker 或 external system。 |
| `blocked` | 必须解决命名 blocker 才能继续。 |
| `paused` | 主动暂停，且可恢复。 |
| `retrying` | 正在准备或执行 retry / fallback run。 |
| `cancelling` | 已请求取消，清理中。 |
| `cancelled` | 被 user、policy 或 runtime 停止。 |
| `timed_out` | time limit 或 inactivity limit 触发停止。 |
| `failed` | 带 error facts 的终态失败。 |
| `lost` | Runtime 无法证明 worker 是否还活着。 |
| `completed` | acceptance criteria 满足，facts 已 reconcile。 |
| `archived` | 不再参与 active scheduling，但保留历史。 |
| `stale` | Snapshot 可能不是当前执行状态。 |
| `unknown` | Runtime 缺少足够事实判断状态。 |

实现原生状态 MAY 保留在 `native_status`，但可移植消费者 SHOULD 读取归一化 status。

## Attempts 与 runs

Task SHOULD 保留 attempts，而不是 retry 时覆盖历史。

`task_attempt` 或 `run` SHOULD 包含：

| Field | 目的 |
| --- | --- |
| `run_id` / `attempt_id` | 稳定 execution attempt id。 |
| `status` | Run lifecycle status。 |
| `worker` | Agent、process、hosted worker、scheduler 或 external runtime。 |
| `input_refs` | Prompt、files、dataset rows、schedule trigger 或 event refs。 |
| `output_refs` | Result、stdout/stderr、artifact、report 或 external output refs。 |
| `checkpoint_refs` | Resume、rollback 或 reconstruction boundaries。 |
| `started_at` / `ended_at` | Attempt timing。 |
| `attempt_count` | Retry count 或 ordinal。 |
| `retry_policy` | Max attempts、backoff、non-retryable errors、timeout policy。 |
| `last_error` | 结构化失败事实。 |
| `completion_summary` | 面向人的结算摘要，但不是权威事实。 |

当 terminal error 后 retry、worker lost、crash recovery、routing decision 改变，或用户要求 rerun 时，SHOULD 创建新 attempt。

## Task graph

Task graph SHOULD 显式表达关系：

| Relationship | 含义 |
| --- | --- |
| `parent` / `child` | 拆解或委派。 |
| `blocks` / `blocked_by` | 依赖顺序。 |
| `source_task` | 上下文或输出来自另一个 task。 |
| `source_attempt` | 上下文或输出来自特定 run。 |
| `spawned_subagent` | 为 task 创建了 child agent context。 |
| `assigned_thread` | 当前执行部分 task 的 thread。 |
| `produced_artifact` | Task 产出的 artifact ref。 |
| `consumed_artifact` | Task 使用的 artifact ref。 |
| `evidence` | Evidence、replay、review、trace 或 audit ref。 |

Edges SHOULD 携带 `created_at`、`updated_at`、`status` 和可选 `reason`。Cancellation intent SHOULD 粘在 graph 上，让 scheduler 立即停止新增 child work，同时允许 active children 自然结算到取消态。

## A2A peer tasks

当 task 委派给 Agent2Agent peer 时，本地 runtime SHOULD 创建 local task wrapper 或 remote task ref，而不是把自己的 task model 替换成 peer protocol object。

A2A mapping SHOULD 保留：

| Field | 目的 |
| --- | --- |
| `native_protocol` | `a2a` 或其他 peer protocol 名称。 |
| `remote_task_id` | A2A `taskId` 或 peer-native task id。 |
| `remote_context_id` | A2A `contextId`，如果存在。 |
| `remote_agent_ref` / `agent_card_ref` | Agent Card、discovery record 或 configured peer。 |
| `delivery_mechanism` | polling、streaming、subscription、push notification 或 custom。 |
| `remote_status` / `native_status` | 归一化之前的 peer-native state。 |
| `remote_artifact_refs` | 从 peer 收到的 artifact refs。 |

A2A messages SHOULD 映射为 task input、clarification 或 status events。A2A artifacts SHOULD 映射为 durable artifact refs 和 task graph edges。Completion SHOULD 同时满足 peer terminal state，以及本地 artifacts、evidence 与 delivery facts 的 reconcile。

## Progress 与 output

Runtime SHOULD 以 facts 报告进度，而不只靠自然语言：

- phase：`planning`、`working`、`verifying`、`delivering`、`waiting` 或实现自定义值。
- current step 或 checklist summary。
- items、child tasks、job items、tool calls、tests、files 等 counters。
- 新 output refs 与 append-only logs 的 output offsets。
- delivery state：pending、delivered、queued、failed、parent missing 或 not applicable。
- validation state 与 acceptance coverage。

大输出 SHOULD 使用 refs。Progress event 可以携带小摘要，并指向 stdout、artifact、report 或 evidence refs。

## Events

兼容 runtime SHOULD 发出归一化 task event family：

| Event | 何时发出 |
| --- | --- |
| `task.created` | Task identity 与初始 objective 已存在。 |
| `task.accepted` | Runtime 接受所有权。 |
| `task.queued` | Task 进入 queue。 |
| `task.started` | 首个 run 或 active execution 开始。 |
| `task.updated` | Metadata、owner、constraints 或 profile 变更。 |
| `task.progress` | Progress、counters、phase、summary 或 output refs 变更。 |
| `task.waiting` | 等 input、permission、resource、dependency 或 worker。 |
| `task.blocked` | 遇到必须解决的 blocker。 |
| `task.paused` / `task.resumed` | Task 暂停或恢复。 |
| `task.retrying` | Retry 或 fallback attempt 开始。 |
| `task.cancel_requested` | Cancellation intent 已记录。 |
| `task.cancelled` | Task 到达 cancelled 终态。 |
| `task.timed_out` | Runtime timeout 或 inactivity timeout 触发。 |
| `task.failed` | Task 到达 failed 终态。 |
| `task.lost` | Runtime 丢失 worker 权威状态。 |
| `task.completed` | Task 到达 completed 终态。 |
| `task.archived` | Task 退出 active scheduling。 |
| `task.delegated` | 创建 child task、subagent、job 或 worker assignment。 |
| `task.dependency.updated` | Relationship 或 blocker state 变更。 |
| `task.attempt.started` / `task.attempt.completed` / `task.attempt.failed` | Attempt lifecycle 变更。 |

Task events SHOULD 携带 `task_id`；attempt events 还 SHOULD 携带 `run_id` 或 `attempt_id`。

## Control plane

Runtime SHOULD 暴露或映射这些操作：

| Command | 必需语义 |
| --- | --- |
| `create_task` | 用 objective、scope、profile、constraints 和 idempotency key 创建 task identity。 |
| `update_task` | 更新 title、objective、metadata、priority、assignee、acceptance 或 constraints。 |
| `start_task` | 启动 run，绑定 worker/thread/environment，并发出 attempt facts。 |
| `append_task_progress` | 追加 progress、output refs、counters 或 delivery state。 |
| `pause_task` / `resume_task` | 在不丢失 graph 和 attempt history 的情况下暂停或恢复。 |
| `cancel_task` | 记录 cancellation intent，并传播给 active workers 或 child tasks。 |
| `retry_task` | 带显式 retry reason 和继承 constraints 启动新 attempt。 |
| `complete_task` / `fail_task` | Reconcile terminal state、artifacts、evidence 和 acceptance facts。 |
| `list_tasks` / `get_task` | 返回 durable task read models。 |
| `link_tasks` / `unlink_tasks` | 更新 parent、child、block、source、artifact 或 evidence edges。 |

会修改状态的命令 MUST 写入 runtime facts。UI-only task card 或本地 optimistic state 不是权威事实。

## Snapshot projection

Read models SHOULD 暴露：

- `task_summary`：active count、terminal count、failed count、lost count、waiting count 和 recent terminal tasks。
- `tasks`：包含 status、title、owner、scope、current run、progress、relationships 和 refs 的紧凑 task records。
- `task_graph`：恢复 parent/child 与 dependency views 所需 edges。
- `attempts`：active 与 recent attempts，包含 output 和 checkpoint refs。
- `blocked_tasks`：blockers 与 required action ids。
- `delivery_state`：output 是否已投递回 parent、channel 或 UI。

Snapshots SHOULD 把缺失数据标为 `unknown`、`stale` 或 `not_applicable`，而不是推断成功。

## 反模式

- 把模型 todo list 当成 task lifecycle 权威。
- Retry 时覆盖 task record，导致 prior attempt failures 丢失。
- Background work 只保存在 UI memory，重启后丢失。
- Artifacts、evidence 或 delivery facts 未 reconcile 就报告 `completed`。
- 创建 child agents 或 jobs 却没有 task graph edges。
- 长任务只发 final prose，不发 progress、output refs 或 errors。
- 把 scheduler ticks 当成产品级 tasks。
- 因为没观察到 error，就把 lost worker 当作 success。
