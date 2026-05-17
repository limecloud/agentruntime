---
title: Benchmark instrumentation
description: Agent Runtime support for Agent QC benchmark and hill climbing through trial, trajectory, reward, and evidence correlation.
---

# Benchmark instrumentation

Agent Runtime does not own product scoring, but it must make benchmarks reproducible, attributable, and auditable. Lime's goal is to improve through testing, so the runtime should treat every benchmark trial as a first-class execution fact instead of scattering results across GUI smoke logs, console output, and manual summaries.

## Goals

Benchmark instrumentation must answer seven questions:

1. Which dataset, task, and baseline/candidate config did this trial use?
2. Where are the Harbor task, job, trial, and artifact refs?
3. Which tool/action/model/context decisions did the agent make?
4. How did the verifier or reward compute its score?
5. Was the failure caused by runtime, model, tool, GUI projection, environment, or verifier behavior?
6. How does the finding feed back into Agent QC gates, replay, or release blockers?
7. Can the same runtime facts serve replay, review, benchmark viewers, and Lime UI diagnostics?

## Event families

Compatible runtimes SHOULD support these benchmark events:

| Event | Purpose |
| --- | --- |
| `benchmark.dataset.resolved` | Record dataset id, version, selection policy, frozen timestamp, and Harbor local path or registry ref. |
| `benchmark.configuration.resolved` | Record baseline/candidate runtime, agent, model, prompt, tool, context, and routing profiles. |
| `benchmark.trial.started` | Record task, config, attempt, sandbox/env, timeout, budget, and Harbor trial ref. |
| `benchmark.trial.completed` | Record successful trial, duration, artifact refs, trajectory refs, and cleanup. |
| `benchmark.trial.failed` | Record failure, timeout, blocked path, verifier error, environment issue, and failure category. |
| `benchmark.reward.recorded` | Record reward, reward details, criterion summary, verifier refs, and drift/oracle sanity. |
| `benchmark.comparison.completed` | Record baseline/candidate aggregate delta, promotion/revert decision, and remaining risk. |

These events can be written by a benchmark runner, runtime adapter, or evidence exporter, but they must use the same runtime correlation spine.

## Harbor compatibility responsibilities

If Lime runs Agent QC benchmarks with Harbor, the runtime or adapter must provide these facts:

| Harbor fact | Runtime responsibility |
| --- | --- |
| `task.toml` | Keep refs for task id, environment, agent/verifier timeout, artifacts, and multi-step config. |
| `/logs/artifacts/` | Agent-published files for grading; runtime should write a manifest with producer, hash, size, and redaction. |
| `/logs/agent/trajectory.json` | Export an ATIF-compatible trajectory; if the Harbor agent does not emit one, the runtime adapter converts events. |
| `/logs/verifier/reward.txt|json` | Runtime does not change the score; it records reward ref, schema, and verifier status. |
| `/logs/verifier/reward-details.json` | Record criterion scores, judge reasoning, errors, and evidence refs; if absent, use `test-stdout.txt`, `ctrf.json`, or a reviewer note as details. |
| Separate verifier transfer | `/logs/agent/` and `/logs/verifier/` are not implicit inputs to a separate verifier; trajectory grading requires a configured artifact. |
| `jobs/<job>/<trial>/result.json` | Use as the trial result ref; runtime appends correlation, not a rewritten Harbor verdict. |

KISS rule: runtime exports facts; Agent QC owns gate verdicts and promotion decisions.

## Trial correlation spine

Each trial evidence pack SHOULD include:

```json
{
  "benchmark": {
    "datasetId": "lime-internal-agent-runtime-tasks",
    "datasetVersion": "2026-05-frozen",
    "datasetRef": "benchmarks/lime-agent-runtime",
    "taskId": "tool-approval-sandbox-boundary",
    "trialId": "trial-tool-approval-candidate-1",
    "configurationId": "candidate-feedback-v2",
    "role": "candidate",
    "harborJobRef": "jobs/lime-runtime-candidate-feedback-v2",
    "harborTrialRef": "jobs/lime-runtime-candidate-feedback-v2/trial-tool-approval-candidate-1"
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
    "artifactManifestRef": "/logs/artifacts/manifest.json",
    "agentQcReportRef": ".lime/qc/current-agent-qc-report.json"
  }
}
```

Without `runtimeCorrelation`, a benchmark may have a score, but it cannot explain whether Lime Runtime improved.

## ATIF trajectory export

Runtime SHOULD export its internal event stream as a Harbor ATIF-compatible trajectory:

| Runtime fact | ATIF target |
| --- | --- |
| `sessionId` / `runId` | `session_id` or metadata correlation. |
| model selection | `agent.name`, `agent.version`, `agent.model_name`. |
| user input / instruction | `steps[].source = "user"` and message. |
| reasoning/model output | `steps[].source = "agent"`, message, `reasoning_content`. |
| tool start/args/result | `steps[].tool_calls` and `observation.results`. |
| permission decision | Tool/action metadata or observation status. |
| token/cost/cache | `steps[].metrics` and `final_metrics`. |
| runtime warnings/errors | Step metadata, observation error, or final failure category. |

Trajectories may be redacted and summarized, but they must preserve ids needed for failure attribution.

## Trajectory requirements

Trajectory SHOULD keep these events or equivalent summaries:

| Area | Required facts |
| --- | --- |
| Input | Instruction, attachments, options, source channel. |
| Model | Selected model, provider, request ids, token/cost, fallback. |
| Context | Selected refs, compaction, missing facts, context warnings. |
| Tools | Tool inventory, tool args, progress, result/error, result refs. |
| Permission | `action.required`, decision id, approve/deny/edit, side-effect check. |
| Process/browser | Command, cwd, exit code, console/network, cleanup. |
| Artifacts | Produced refs, export status, validation issues. |
| Outcome | Final status, failure category, known gaps, evidence ids. |

## Control plane support

Runtime or host SHOULD expose these command semantics:

| Command | Purpose |
| --- | --- |
| `start_benchmark_trial` | Bind dataset/task/config, Harbor job/trial, sandbox, and timeout; create a trial scope. |
| `record_benchmark_reward` | Write reward, reward details, verifier status, failure category, and drift/oracle sanity. |
| `export_benchmark_trial` | Export trajectory, runtime transcript, artifacts, reward, Agent QC refs, and redaction manifest. |
| `compare_benchmark_runs` | Record baseline/candidate delta, cost, evidence completeness, and decision. |

If the product does not expose these commands, `export_evidence` / `export_replay` should emit equivalent structures.

## Event payload examples

`benchmark.trial.started`:

```json
{
  "type": "benchmark.trial.started",
  "eventId": "evt_trial_started_1",
  "schemaVersion": "lime-profile-0.4.0",
  "runtimeId": "lime_runtime_local",
  "sessionId": "sess_123",
  "threadId": "thread_123",
  "turnId": "turn_123",
  "taskId": "task_123",
  "runId": "run_123",
  "sequence": 42,
  "timestamp": "2026-05-17T09:00:00Z",
  "benchmark": {
    "datasetId": "lime-internal-agent-runtime-tasks",
    "datasetVersion": "2026-05-frozen",
    "taskId": "tool-approval-sandbox-boundary",
    "trialId": "trial-tool-approval-candidate-1",
    "configurationId": "candidate-feedback-v2",
    "harborJobRef": "jobs/lime-runtime-candidate-feedback-v2",
    "harborTrialRef": "jobs/lime-runtime-candidate-feedback-v2/trial-tool-approval-candidate-1"
  },
  "refs": {
    "taskTomlRef": "benchmarks/lime-agent-runtime/tool-approval-sandbox-boundary/task.toml"
  },
  "payload": {
    "attempt": 1,
    "timeoutSec": 300,
    "singleChangedVariable": "tool failure feedback profile"
  }
}
```

`benchmark.reward.recorded`:

```json
{
  "type": "benchmark.reward.recorded",
  "eventId": "evt_reward_1",
  "schemaVersion": "lime-profile-0.4.0",
  "runtimeId": "lime_runtime_local",
  "sessionId": "sess_123",
  "threadId": "thread_123",
  "turnId": "turn_123",
  "taskId": "task_123",
  "runId": "run_123",
  "sequence": 55,
  "timestamp": "2026-05-17T09:03:00Z",
  "benchmark": {
    "datasetId": "lime-internal-agent-runtime-tasks",
    "datasetVersion": "2026-05-frozen",
    "taskId": "tool-approval-sandbox-boundary",
    "trialId": "trial-tool-approval-candidate-1",
    "configurationId": "candidate-feedback-v2"
  },
  "refs": {
    "rewardRef": "/logs/verifier/reward.json",
    "rewardDetailsRef": "/logs/verifier/reward-details.json",
    "trajectoryRef": "/logs/agent/trajectory.json"
  },
  "payload": {
    "reward": 1,
    "criteria": ["approval-denial-facts", "trajectory-present"],
    "failureCategory": "none"
  }
}
```

## Lime testing examples

### 1. Check whether the trial pack is joinable

```bash
jq -e '
  .benchmark.datasetId
  and .benchmark.taskId
  and .benchmark.trialId
  and .benchmark.harborJobRef
  and .runtimeCorrelation.sessionId
  and .runtimeCorrelation.threadId
  and .runtimeCorrelation.turnId
  and .runtimeCorrelation.runId
  and .refs.trajectoryRef
  and .refs.rewardDetailsRef
  and .refs.artifactManifestRef
' .lime/qc/benchmark/trial-tool-approval-candidate-1.json
```

Failure handling:

- missing benchmark fields: benchmark runner blocks;
- missing runtime correlation: Agent Runtime profile blocks;
- missing reward details: `benchmark-eval` blocks;
- missing trajectory: smoke only, not hill climbing;
- missing artifact manifest: Harbor may be viewable, but Agent QC cannot promote.

### 2. Check reward improvement did not sacrifice P0 QC

```bash
jq -e '
  .comparison.meanRewardDelta >= 0
  and .comparison.p0QcGateRegressionCount == 0
  and .comparison.evidenceCompletenessRate >= .comparison.baselineEvidenceCompletenessRate
' .lime/qc/benchmark/feedback-v2-comparison.json
```

Run this before candidate promotion. It keeps the guard simple: three hard checks prevent the most dangerous case, a higher score with a worse product.

### 3. Feed failures back into QC

When `benchmark.trial.failed` has a `failureCategory` such as `tool-result-missing`, `stream-stuck`, `permission-bypass`, or `stale-success`, Lime should write the failure back to:

- Agent QC scenario `failureModes`;
- runtime replay fixture;
- verifier criterion for the corresponding gate;
- release blocker or waiver if it affects release risk.

## Anti-patterns

| Anti-pattern | Risk |
| --- | --- |
| Saving only the final benchmark score | No attribution, no repair path. |
| Trajectory missing tool/action ids | Cannot tell whether model, tool, or permission failed. |
| Candidate uses a different dataset or verifier | A/B comparison is invalid. |
| Runtime does not export cost and timeout | High score may be operationally unaffordable. |
| GUI benchmark is not linked to runtime facts | It proves rendering, not execution truth. |
| Separate verifier did not declare trajectory artifact | Verifier cannot audit the agent's real actions. |
