---
title: Agent task
description: Agent Runtime task lifecycle, orchestration, attempts, progress, and recovery contract.
---

# Agent task

An `agent task` is the runtime-owned unit of work that gives an agent objective, scope, lifecycle, progress, relationships, and delivery semantics.

A task is not a checklist item, not a chat message, not a model request, and not only a background job. It is the durable execution object that can span turns, start runs, spawn subagents, wait for input, produce artifacts, and be audited after recovery.

## Design pressure

Real runtimes show the same task pressure in different forms:

- Terminal agents keep foreground work, local shell work, remote agent work, scheduled work, and backgrounded work under one task surface.
- Gateway and scheduler agents need durable jobs, delivery state, per-run output, checkpoint/resume, missed-run handling, and failure notification.
- Typed coding runtimes need thread goals, todo lists, plan items, turn status, job items, approval state, and spawn edges to join through stable ids.
- Desktop runtimes need task profiles, automation jobs, subagent turns, execution summaries, evidence export, and UI projection to read from the same fact chain.
- Durable workflow systems show why workflow id, run id, task queue, child work, signals, cancellation, retries, and history cannot be left as prose.

The portable contract therefore needs a task model above individual tool calls and below host-product workflows.

## Task is not job, run, step, or todo

| Object | Meaning | Runtime rule |
| --- | --- | --- |
| `task` | Semantic objective with lifecycle, owner, relationships, constraints, and acceptance. | Stable across retries, turns, backgrounding, and recovery. |
| `run` | One execution attempt for a task. | New run for retry, resume-after-crash, or alternate worker execution. |
| `step` | Ordered item inside a run or turn. | Model, reasoning, tool, process, approval, artifact, warning, or evidence item. |
| `job` | Durable batch or scheduled dispatcher. | May create or own tasks, but should not replace task semantics. |
| `todo` / `plan item` | Agent-visible checklist. | Useful progress hint, not authoritative lifecycle. |

A compatible runtime SHOULD expose all five concepts when they exist instead of flattening them into one `message` or one `task` string.

## Task record

A task SHOULD include these fields:

| Field | Purpose |
| --- | --- |
| `task_id` | Stable task id. |
| `parent_task_id` / `root_task_id` | Task graph linkage. |
| `session_id` / `thread_id` / `turn_id` | Conversation or execution context linkage when applicable. |
| `title` / `objective` | Human-readable work statement. |
| `task_kind` / `task_family` | Portable classification and coarse grouping. |
| `visibility` | `foreground`, `background`, `internal`, or `hidden`. |
| `status` | Normalized lifecycle status. |
| `priority` | Scheduling hint, not a completion guarantee. |
| `requested_by` / `owner` / `assignee` | User, agent, workflow, channel, or worker attribution. |
| `scope` | Workspace, project, thread, account, environment, or host boundary refs. |
| `constraints` | Permission, sandbox, network, model, tool, cost, time, and output constraints. |
| `task_profile` | Capability, latency, budget, fallback, and continuity profile. |
| `acceptance` | Completion criteria or refs. |
| `progress` | Percent, phase, current step, summary, counters, or output refs. |
| `current_run_id` | Active run, if any. |
| `attempts` | Prior and active runs. |
| `relationships` | Dependencies, blocks, child tasks, source tasks, spawned agents, artifacts. |
| `artifacts` / `evidence_refs` | Produced or consumed refs. |
| `last_error` / `status_reason` | Structured failure, block, or wait explanation. |
| `created_at` / `updated_at` / `started_at` / `ended_at` | Lifecycle timestamps. |

## Status model

A portable runtime SHOULD support these normalized task statuses:

| Status | Meaning |
| --- | --- |
| `draft` | Defined but not yet accepted by runtime. |
| `accepted` | Runtime accepted the task and assigned identity. |
| `queued` | Waiting for scheduler, queue, dependency, or worker capacity. |
| `preparing` | Resolving context, tools, model, policy, or environment. |
| `running` | Active execution is making progress. |
| `waiting_input` | Waiting for user or external structured input. |
| `waiting_permission` | Waiting for human, policy, or host approval. |
| `waiting_resource` | Waiting for credential, quota, file, network, worker, or external system. |
| `blocked` | Cannot proceed until a named blocker is resolved. |
| `paused` | Intentionally paused and resumable. |
| `retrying` | A retry or fallback run is being prepared or active. |
| `cancelling` | Cancellation requested; cleanup is in progress. |
| `cancelled` | Stopped by user, policy, or runtime. |
| `timed_out` | Stopped because a time or inactivity limit fired. |
| `failed` | Terminal failure with error facts. |
| `lost` | Runtime cannot prove whether the worker is still alive. |
| `completed` | Acceptance criteria are satisfied and facts are reconciled. |
| `archived` | No longer active in scheduling, but retained for history. |
| `stale` | Snapshot may not reflect current execution. |
| `unknown` | Runtime lacks enough facts to assert a status. |

Implementation-native states MAY be preserved in `native_status`, but portable consumers SHOULD receive the normalized status.

## Attempts and runs

A task SHOULD keep attempts rather than replacing history on retry.

A `task_attempt` or `run` SHOULD include:

| Field | Purpose |
| --- | --- |
| `run_id` / `attempt_id` | Stable execution attempt id. |
| `status` | Run lifecycle status. |
| `worker` | Agent, process, hosted worker, scheduler, or external runtime. |
| `input_refs` | Prompt, files, dataset rows, schedule trigger, or event refs. |
| `output_refs` | Result, stdout/stderr, artifact, report, or external output refs. |
| `checkpoint_refs` | Resume, rollback, or reconstruction boundaries. |
| `started_at` / `ended_at` | Attempt timing. |
| `attempt_count` | Retry count or ordinal. |
| `retry_policy` | Max attempts, backoff, non-retryable errors, timeout policy. |
| `last_error` | Structured failure fact. |
| `completion_summary` | Final human-readable but non-authoritative summary. |

A new attempt SHOULD be created for retry after terminal error, worker loss, crash recovery, different routing decision, or user-requested rerun.

## Task graph

A task graph SHOULD represent relationships explicitly:

| Relationship | Meaning |
| --- | --- |
| `parent` / `child` | Decomposition or delegation. |
| `blocks` / `blocked_by` | Dependency ordering. |
| `source_task` | Output or context came from another task. |
| `source_attempt` | Output or context came from a specific run. |
| `spawned_subagent` | Child agent context was created for the task. |
| `assigned_thread` | Thread currently executing part of the task. |
| `produced_artifact` | Artifact ref produced by the task. |
| `consumed_artifact` | Artifact ref used as input. |
| `evidence` | Evidence, replay, review, trace, or audit ref. |

Edges SHOULD carry `created_at`, `updated_at`, `status`, and optional `reason`. Cancellation intent SHOULD stick to the graph so schedulers stop adding new child work while active children settle.

## Progress and output

A runtime SHOULD report progress as facts, not only natural language:

- phase: `planning`, `working`, `verifying`, `delivering`, `waiting`, or implementation-specific values.
- current step or checklist summary.
- counters for items, child tasks, job items, tool calls, tests, or files.
- new output refs and output offsets for append-only logs.
- delivery state: pending, delivered, queued, failed, parent missing, or not applicable.
- validation state and acceptance coverage.

Large output SHOULD use refs. A progress event may carry a small summary and point to stdout, artifact, report, or evidence refs.

## Events

A compatible runtime SHOULD emit the normalized task family:

| Event | When emitted |
| --- | --- |
| `task.created` | Task identity and initial objective exist. |
| `task.accepted` | Runtime accepted ownership. |
| `task.queued` | Task entered a queue. |
| `task.started` | First run or active execution started. |
| `task.updated` | Metadata, owner, constraints, or profile changed. |
| `task.progress` | Progress, counters, phase, summary, or output refs changed. |
| `task.waiting` | Task waits for input, permission, resource, dependency, or worker. |
| `task.blocked` | Task cannot proceed until a blocker is resolved. |
| `task.paused` / `task.resumed` | Task was paused or resumed. |
| `task.retrying` | Retry or fallback attempt began. |
| `task.cancel_requested` | Cancellation intent recorded. |
| `task.cancelled` | Task reached cancelled terminal state. |
| `task.timed_out` | Runtime timeout or inactivity timeout fired. |
| `task.failed` | Task reached failed terminal state. |
| `task.lost` | Runtime lost authoritative worker state. |
| `task.completed` | Task reached completed terminal state. |
| `task.archived` | Task was removed from active scheduling. |
| `task.delegated` | Child task, subagent, job, or worker assignment was created. |
| `task.dependency.updated` | Relationship or blocker state changed. |
| `task.attempt.started` / `task.attempt.completed` / `task.attempt.failed` | Attempt lifecycle changed. |

Task events SHOULD carry `task_id`; attempt events SHOULD also carry `run_id` or `attempt_id`.

## Control plane

A runtime SHOULD expose or map these operations:

| Command | Required semantics |
| --- | --- |
| `create_task` | Create task identity with objective, scope, profile, constraints, and idempotency key. |
| `update_task` | Update title, objective, metadata, priority, assignee, acceptance, or constraints. |
| `start_task` | Start a run, bind worker/thread/environment, and emit attempt facts. |
| `append_task_progress` | Append progress, output refs, counters, or delivery state. |
| `pause_task` / `resume_task` | Pause or resume without losing graph and attempt history. |
| `cancel_task` | Record cancellation intent and propagate to active workers or child tasks. |
| `retry_task` | Start a new attempt with explicit retry reason and inherited constraints. |
| `complete_task` / `fail_task` | Reconcile terminal state, artifacts, evidence, and acceptance facts. |
| `list_tasks` / `get_task` | Return durable task read models. |
| `link_tasks` / `unlink_tasks` | Update parent, child, block, source, artifact, or evidence edges. |

Mutating commands MUST write runtime facts. UI-only task cards or local optimistic state are not authoritative.

## Snapshot projection

Read models SHOULD expose:

- `task_summary`: active count, terminal count, failed count, lost count, waiting count, and recent terminal tasks.
- `tasks`: compact task records with status, title, owner, scope, current run, progress, relationships, and refs.
- `task_graph`: edges needed to recover parent/child and dependency views.
- `attempts`: active and recent attempts with output and checkpoint refs.
- `blocked_tasks`: blockers and required action ids.
- `delivery_state`: whether output was delivered back to parent, channel, or UI.

Snapshots SHOULD mark missing data as `unknown`, `stale`, or `not_applicable` rather than inferring success.

## Anti-patterns

- Treating the model's todo list as the task lifecycle authority.
- Replacing a task record on retry and losing prior attempt failures.
- Keeping background work only in UI memory, so restart loses the task.
- Reporting `completed` before artifacts, evidence, or delivery facts are reconciled.
- Creating child agents or jobs without task graph edges.
- Emitting only final prose for a long-running task without progress, output refs, or errors.
- Using scheduler ticks as product-level tasks.
- Treating a lost worker as success because no error was observed.
