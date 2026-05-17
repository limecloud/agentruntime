---
title: Acceptance scenarios
description: Behavior-level acceptance scenarios for Agent Runtime.
---

# Acceptance scenarios

Compatible Agent Runtime implementations should pass behavior-level checks. Product profiles may add stricter fixtures. The Lime profile conformance pack is the reference strict profile for current Lime runtime.


A compatible Agent Runtime should pass behavior-level checks.

## Submit and first status

## Lime profile fixture validation

A Lime-profile runtime publishes at least one valid fixture for submit turn, action required, failed task attempt, routing single candidate, evidence export, and thread read snapshot. Each fixture carries `schemaVersion: "lime-profile-0.4.0"`, stable correlation ids, and typed payloads.


Given a client submits a turn, the runtime emits an accepted or queued fact before any long model output. The thread read model shows `preparing`, `queued`, or `running` instead of remaining unknown.

## Tool call with large result

Given a tool returns a large payload, the event stream includes a safe preview and output ref. The final answer does not become the only storage location for the result.

## Approval gate

Given a tool needs approval, the runtime emits `action.required` with a stable action id. Execution does not continue until `respond_action` resolves the request.

## Queue and resume

Given a busy thread receives another turn, the runtime either rejects it with policy detail or stores it as a queued turn. After restart, the queue is still visible and can be resumed or reordered.

## Context compaction

Given a long thread requires compaction, the runtime emits compaction start and completed events and keeps a boundary snapshot. Unresolved requests and evidence refs survive compaction.

## Subagent delegation

Given a parent turn spawns a child agent, parent and child ids are linked. Waiting, sending input, failure, and close events are visible without parsing child prose.

## Agent task retry and graph

Given a long-running task creates child work and then fails, the runtime preserves the original `task_id`, records the failed attempt with `run_id`, keeps parent/dependency edges, and starts a new attempt on retry instead of overwriting history.

## Evidence export

Given a completed or failed turn, evidence export includes runtime summary, timeline, tool failures, artifact refs, and verification/review refs when available.

## Old session recovery

Given an old session with many messages, the runtime returns a shell and recent window first, then exposes older history through cursors and details on demand.

## Permission and sandbox fact

Given a shell or file tool requests a write, the runtime records `permission.evaluated` and `sandbox.applied` first. If denied or out of bounds, the thread read model explains whether a rule, mode, hook, host policy, or sandbox violation caused it.

## Hook input rewrite

Given a `pre_tool_use` hook rewrites tool input or blocks the tool, the stream contains `hook.started` / `hook.completed`, updated input ref, or block reason. The final tool result must not hide the hook decision.

## Process stdin and output spill

Given a long-running process needs stdin, `write_process_stdin` emits `process.input`. When stdout/stderr exceed budget, runtime emits `output.spilled` or `output.truncated` and preserves an output ref.

## Model routing and single candidate

Given only one model candidate is available, runtime emits `routing.single_candidate` and the read model shows candidate count, decision reason, capability gap, cost state, and limit state.

## Quota or rate limit

Given provider or host limits are hit, runtime emits `rate_limit.hit`, `quota.low`, or `quota.blocked`, and joins request logs to turn ids in evidence.

## Remote channel reconnect

Given a remote client reconnects, runtime returns a snapshot first and continues from the last acknowledged sequence. If replay is unavailable, it emits `snapshot.repaired` and marks stale or unavailable facts.

## Job item retry

Given one item in a batch job fails, the job keeps job/item status separately, allows retrying only that item, and preserves attempt count and last error.

## Benchmark trial export

Given Lime runs a benchmark task, the runtime emits benchmark dataset/config/trial facts, preserves the execution trajectory, records reward refs, and exports a trial pack with runtime correlation. A candidate comparison must include baseline/candidate configs, aggregate deltas, evidence completeness, and P0 Agent QC regression count.
