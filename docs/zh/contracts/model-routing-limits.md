---
title: Model routing 与 limits
description: Agent Runtime 模型路由、候选集、成本和限额契约。
---

# Model routing 与 limits

模型选择不是 UI 下拉框。模型选择是 runtime 在任务需求、候选能力、用户锁定、host policy、成本、限额和 provider 状态之间做出的可解释决策。

兼容 runtime SHOULD 把模型层拆成三个对象：

1. `task_profile`：这次 turn 需要什么能力。
2. `candidate_model_set`：当前真实可用候选是什么。
3. `routing_decision`：为什么选择、回退、阻断或只剩单候选。

## Task profile

`task_profile` SHOULD 包含：

| Field | 含义 |
| --- | --- |
| `kind` | `chat`、`code_edit`、`review`、`search`、`artifact_generation`、`background_job` 等。 |
| `source` | user、workflow、tool、subagent、scheduled job 或 host service。 |
| `required_capabilities` | vision、tool_use、long_context、structured_output、computer_use 等。 |
| `latency_target` | interactive、background、batch。 |
| `budget_class` | low、medium、high、fixed、unknown。 |
| `fallback_policy` | allow、deny、ask、local_only、host_only。 |
| `settings_source` | 显式选择、会话默认、任务偏好、host policy 或自动策略。 |

## Candidate model set

`candidate_model_set` 不是模型注册表全量目录。它只描述当前 turn 在真实约束下可投递的候选。

它 SHOULD 记录：

- 候选数量。
- 每个候选的 provider、model、capabilities、cost class、limit state。
- 被排除候选及原因。
- 哪些约束是 hard constraint，哪些只是 preference。
- 是否只有单候选。
- 是否缺少凭证、能力、配额或网络。

## Routing decision

`routing_decision` SHOULD 包含：

| Field | 含义 |
| --- | --- |
| `routing_mode` | `no_candidate`、`single_candidate`、`multi_candidate`。 |
| `decision_source` | explicit、session、task_preference、host_policy、policy_auto、runtime_fallback。 |
| `decision_reason` | 可展示解释。 |
| `selected_provider` / `selected_model` | 最终候选。 |
| `requested_provider` / `requested_model` | 用户或上游请求。 |
| `candidate_count` | 当前真实候选数。 |
| `fallback_chain` | 尝试过或可尝试的回退链。 |
| `capability_gap` | 无法满足的关键能力。 |
| `requires_user_override` | 是否需要用户切换或授权。 |
| `limit_state_snapshot` | 决策时的限额快照。 |

单候选不是失败。单候选表示 runtime 没有真正优化空间，但仍要记录能力、成本和限额。

## Cost 与 limit state

Runtime SHOULD 将经济和限制信号沉到底层：

| Object | 语义 |
| --- | --- |
| `limit_state` | rate limit、quota、并发预算、队列、单候选、host access mode。 |
| `cost_state` | 估算成本档、输入/输出 token、缓存 token、实际成本或 unknown。 |
| `limit_event` | `rate_limit_hit`、`quota_low`、`quota_blocked`、`parallel_budget_reached` 等。 |

价格缺失时应写 `unknown`，不能伪造“低成本”。

## Event classes

| Event | 何时发出 |
| --- | --- |
| `task.profile.resolved` | turn 的任务画像已确定。 |
| `routing.candidates.resolved` | 真实候选集已解析。 |
| `routing.decided` | 最终路由决策已产生。 |
| `routing.fallback.applied` | 发生回退。 |
| `routing.not_possible` | 无候选或硬约束阻断。 |
| `routing.single_candidate` | 只有一个真实候选。 |
| `cost.estimated` | dispatch 前成本档或估算产生。 |
| `cost.recorded` | provider usage 返回后记录真实消耗。 |
| `rate_limit.hit` | provider、host 或本地 governor 限流。 |
| `quota.low` / `quota.blocked` | 配额告警或阻断。 |

这些 events SHOULD 进入 thread read、evidence 和 telemetry；UI 只消费，不自行计算最终真相。
