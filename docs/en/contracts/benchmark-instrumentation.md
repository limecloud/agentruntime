---
title: Benchmark instrumentation
description: Agent Runtime support for Agent QC benchmark and hill climbing through trial, trajectory, reward, and evidence correlation.
---

# Benchmark instrumentation

Agent Runtime does not own product scoring, but it must make benchmarks reproducible, attributable, and auditable. Lime's goal is to improve through testing, so the runtime should treat every benchmark trial as a first-class execution fact instead of scattering results across GUI smoke logs, console output, and manual summaries.

## Goals

Benchmark instrumentation answers five questions:

1. Which dataset, task, and baseline/candidate configuration did this trial use?
2. Which tool, action, model, context, and routing decisions happened during execution?
3. How did the verifier or reward produce the score?
4. Was the failure caused by runtime, model, tool, GUI projection, environment, or verifier behavior?
5. How should the finding feed back into Agent QC gates, replay fixtures, or release blockers?

## Event families

Compatible runtimes SHOULD support these benchmark events:

| Event | Purpose |
| --- | --- |
| `benchmark.dataset.resolved` | Record dataset id, version, selection policy, and frozen timestamp. |
| `benchmark.configuration.resolved` | Record baseline/candidate runtime, model, prompt, tool, context, and routing profiles. |
| `benchmark.trial.started` | Record task, config, attempt, sandbox/env, timeout, and budget. |
| `benchmark.trial.completed` | Record successful trial, duration, artifact refs, and cleanup. |
| `benchmark.trial.failed` | Record failure, timeout, blocked path, verifier error, or environment issue. |
| `benchmark.reward.recorded` | Record reward, reward details, criterion summary, and verifier refs. |
| `benchmark.comparison.completed` | Record baseline/candidate aggregate delta, promotion/revert decision, and remaining risk. |

These events can be written by a benchmark runner, runtime adapter, or evidence exporter, but they must use the same runtime correlation spine.

## Trial correlation spine

Every trial evidence pack SHOULD contain:

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

Without `runtimeCorrelation`, a benchmark may have a score, but it cannot explain whether Lime Runtime improved.

## Trajectory requirements

Trajectories SHOULD preserve these events or equivalent summaries:

| Area | Required facts |
| --- | --- |
| Input | instruction, attachments, options, source channel. |
| Model | selected model, provider, request ids, token/cost, fallback. |
| Context | selected refs, compaction, missing facts, context warnings. |
| Tools | tool inventory, tool args, progress, result/error, result refs. |
| Permission | `action.required`, decision id, approve/deny/edit, side-effect check. |
| Process/browser | command, cwd, exit code, console/network, cleanup. |
| Artifacts | produced refs, export status, validation issues. |
| Outcome | final status, failure category, known gaps, evidence ids. |

Trajectories may be redacted and summarized, but they must not remove ids needed for failure attribution.

## Control plane support

The runtime or host SHOULD support these command semantics:

| Command | Purpose |
| --- | --- |
| `start_benchmark_trial` | Bind dataset/task/config and create trial scope. |
| `record_benchmark_reward` | Write reward, reward details, and verifier status. |
| `export_benchmark_trial` | Export trajectory, runtime transcript, artifacts, reward, and Agent QC refs. |
| `compare_benchmark_runs` | Record baseline/candidate delta and decision. |

If the product does not expose these commands directly, `export_evidence` / `export_replay` should output an equivalent structure.

## Lime testing examples

### 1. Check that a trial pack is joinable

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

Failure handling:

- missing benchmark fields: benchmark runner blocks;
- missing runtime correlation: Agent Runtime profile blocks;
- missing reward details: `benchmark-eval` blocks;
- missing trajectory: smoke only, not hill climbing.

### 2. Check reward improvement without P0 QC regression

```bash
jq -e '
  .comparison.meanRewardDelta >= 0
  and .comparison.p0QcGateRegressionCount == 0
  and .comparison.evidenceCompletenessRate >= .comparison.baselineEvidenceCompletenessRate
' .lime/qc/benchmark/feedback-v2-comparison.json
```

Run this before candidate promotion. It keeps the policy simple: three hard metrics block the most dangerous case, where the score rises but product quality regresses.

### 3. Feed failures back into QC

When `benchmark.trial.failed` has a `failureCategory` such as `tool-result-missing`, `stream-stuck`, `permission-bypass`, or `stale-success`, Lime should write the failure back to:

- Agent QC scenario `failureModes`;
- runtime replay fixtures;
- verifier criteria for the matching gate;
- release blocker or waiver if the failure affects release.

## Anti-patterns

| Anti-pattern | Risk |
| --- | --- |
| Saving only the final benchmark score | No attribution, no repair path. |
| Trajectory without tool/action ids | Cannot tell model, tool, or permission failures apart. |
| Candidate uses a different dataset or verifier | A/B comparison is invalid. |
| Runtime omits cost and timeout facts | High score may be operationally unusable. |
| GUI benchmark is not linked to runtime facts | It proves rendering, not execution truth. |
