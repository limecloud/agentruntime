---
title: Subagents and jobs
description: Agent Runtime subagent, background task, and batch job contract.
---

# Subagents and jobs

A `subagent` is a child execution context with parent links. A `job` is durable batch or background work that can contain many items. Both can be assigned to an `agent task`, but neither replaces task semantics.

Use the [Agent task](./agent-task.md) contract for objective, lifecycle, attempts, relationships, acceptance, and recovery. Use this contract for child agent coordination and batch/background item processing.

## Subagents

A subagent SHOULD include `subagent_id`, parent ids, child `thread_id`, role, nickname, isolation rules, model policy, status, and last message ref.

Events include `subagent.spawned`, `subagent.input`, `subagent.status`, `subagent.output`, `subagent.completed`, `subagent.failed`, and `subagent.closed`.

Parent-child edges SHOULD be durable enough to list direct children and descendants after restart.

## Jobs

A job SHOULD include `job_id`, optional `task_id`, status, instruction ref, input refs, optional output schema ref, max runtime, item cursor, progress counts, and assigned thread ids.

Job item status SHOULD be independent: pending, running, completed, failed, reported. Failed items SHOULD keep attempt count, last error, retryability, and assigned thread.

Events include `job.created`, `job.started`, `job.progress`, `job.item.started`, `job.item.completed`, `job.item.failed`, `job.completed`, `job.failed`, and `job.cancelled`.
