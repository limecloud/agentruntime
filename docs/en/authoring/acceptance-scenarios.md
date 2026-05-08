---
title: Acceptance scenarios
description: Behavior-level acceptance scenarios for Agent Runtime.
---

# Acceptance scenarios

A compatible Agent Runtime should pass behavior-level checks.

## Submit and first status

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

## Evidence export

Given a completed or failed turn, evidence export includes runtime summary, timeline, tool failures, artifact refs, and verification/review refs when available.

## Old session recovery

Given an old session with many messages, the runtime returns a shell and recent window first, then exposes older history through cursors and details on demand.
