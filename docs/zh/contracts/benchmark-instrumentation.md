---
title: Benchmark instrumentation
description: Agent Runtime 为 Agent QC benchmark 与 hill climbing 提供 trial、trajectory、reward 和 evidence correlation。
---

# Benchmark instrumentation

Agent Runtime 不负责给产品打分，但它必须让 benchmark 可复现、可归因、可审计。Lime 的目标是通过测试发现问题并进化，因此 runtime 需要把每次 benchmark trial 当作一等执行事实，而不是把结果散落在 GUI smoke、日志和人工总结里。

## 目标

Benchmark instrumentation 要回答五个问题：

1. 本次 trial 用的是哪个 dataset、task、baseline/candidate config？
2. Agent 执行过程中做了哪些 tool/action/model/context 决策？
3. Verifier 或 reward 是怎样得出分数的？
4. 失败是 runtime、模型、工具、GUI projection、环境还是 verifier 问题？
5. 这个发现如何回写到 Agent QC gate、replay 或 release blocker？

## Event families

兼容 runtime SHOULD 支持这些 benchmark event：

| Event | 用途 |
| --- | --- |
| `benchmark.dataset.resolved` | 记录 dataset id、version、selection policy 与冻结时间。 |
| `benchmark.configuration.resolved` | 记录 baseline/candidate 的 runtime、model、prompt、tool、context、routing profile。 |
| `benchmark.trial.started` | 记录 task、config、attempt、sandbox/env、timeout、预算。 |
| `benchmark.trial.completed` | 记录成功 trial、duration、artifact refs 与 cleanup。 |
| `benchmark.trial.failed` | 记录失败、timeout、blocked、verifier error 或环境问题。 |
| `benchmark.reward.recorded` | 记录 reward、reward details、criterion summary 与 verifier refs。 |
| `benchmark.comparison.completed` | 记录 baseline/candidate aggregate delta、promotion/revert decision 和 remaining risk。 |

这些事件可以由 benchmark runner、runtime adapter 或 evidence exporter 写入，但必须使用同一条 runtime correlation spine。

## Trial correlation spine

每个 trial evidence pack SHOULD 包含：

```json
{
  "benchmark": {
    "datasetId": "lime-internal-agent-runtime-tasks",
    "datasetVersion": "2026-05-frozen",
    "taskId": "tool-approval-sandbox-boundary",
    "trialId": "trial-tool-approval-candidate-1",
    "configurationId": "candidate-feedback-v2",
    "role": "candidate"
  },
  "runtimeCorrelation": {
    "runtimeId": "lime_runtime_local",
    "sessionId": "sess_123",
    "threadId": "thread_123",
    "turnId": "turn_123",
    "taskId": "task_123",
    "runId": "run_123",
    "traceId": "trace_123"
  },
  "refs": {
    "trajectoryRef": "/logs/agent/trajectory.json",
    "runtimeTranscriptRef": "/logs/artifacts/runtime-transcript.json",
    "rewardRef": "/logs/verifier/reward.json",
    "rewardDetailsRef": "/logs/verifier/reward-details.json",
    "agentQcReportRef": ".lime/qc/current-agent-qc-report.json"
  }
}
```

缺少 `runtimeCorrelation` 时，benchmark 可以有分数，但不能用于解释 Lime runtime 是否变好。

## Trajectory requirements

Trajectory SHOULD 保留以下事件或等价摘要：

| Area | 必需事实 |
| --- | --- |
| Input | instruction、attachments、options、source channel。 |
| Model | selected model、provider、request ids、token/cost、fallback。 |
| Context | selected refs、compaction、missing facts、context warnings。 |
| Tools | tool inventory、tool args、progress、result/error、result refs。 |
| Permission | `action.required`、decision id、approve/deny/edit、side-effect check。 |
| Process/browser | command、cwd、exit code、console/network、cleanup。 |
| Artifacts | produced refs、export status、validation issues。 |
| Outcome | final status、failure category、known gaps、evidence ids。 |

Trajectory 可以脱敏和摘要，但不能删除 failure attribution 所需的 ids。

## Control plane support

Runtime 或宿主 SHOULD 提供这些命令语义：

| Command | 目的 |
| --- | --- |
| `start_benchmark_trial` | 绑定 dataset/task/config 并创建 trial scope。 |
| `record_benchmark_reward` | 写入 reward、reward details 和 verifier status。 |
| `export_benchmark_trial` | 导出 trajectory、runtime transcript、artifacts、reward 和 Agent QC refs。 |
| `compare_benchmark_runs` | 记录 baseline/candidate delta 与决策。 |

如果产品不暴露这些命令，也应通过 `export_evidence` / `export_replay` 输出等价结构。

## Lime 测试示例

### 1. 检查 trial pack 是否可关联

```bash
jq -e '
  .benchmark.datasetId
  and .benchmark.taskId
  and .benchmark.trialId
  and .runtimeCorrelation.sessionId
  and .runtimeCorrelation.threadId
  and .runtimeCorrelation.turnId
  and .runtimeCorrelation.runId
  and .refs.trajectoryRef
  and .refs.rewardDetailsRef
' .lime/qc/benchmark/trial-tool-approval-candidate-1.json
```

失败处理：

- 缺 benchmark 字段：benchmark runner 阻断；
- 缺 runtime correlation：Agent Runtime profile 阻断；
- 缺 reward details：`benchmark-eval` 阻断；
- 缺 trajectory：只能做 smoke，不能做 hill climbing。

### 2. 检查 reward 改善没有牺牲 P0 QC

```bash
jq -e '
  .comparison.meanRewardDelta >= 0
  and .comparison.p0QcGateRegressionCount == 0
  and .comparison.evidenceCompletenessRate >= .comparison.baselineEvidenceCompletenessRate
' .lime/qc/benchmark/feedback-v2-comparison.json
```

这个检查应该在 candidate promotion 前运行。它体现 KISS：只用三个硬指标挡住最危险的“分数变高但产品变差”。

### 3. 把失败回写到 QC

当 `benchmark.trial.failed` 的 `failureCategory` 是 `tool-result-missing`、`stream-stuck`、`permission-bypass` 或 `stale-success` 时，Lime 应把该失败写回：

- Agent QC scenario 的 `failureModes`；
- runtime replay fixture；
- 对应 gate 的 verifier criterion；
- 如果影响 release，写入 release blocker 或 waiver。

## 反模式

| 反模式 | 风险 |
| --- | --- |
| Benchmark 只保存最终分数 | 无法归因，无法修复。 |
| Trajectory 缺 tool/action ids | 看不出是模型、工具还是权限问题。 |
| Candidate 用不同 dataset 或 verifier | A/B 失效。 |
| Runtime 不导出成本和 timeout | 高分可能不可运营。 |
| GUI benchmark 不连接 runtime facts | 只证明画面，不证明执行真相。 |
