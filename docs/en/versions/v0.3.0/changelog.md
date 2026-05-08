---
title: v0.3.0 changelog
description: Agent Runtime v0.3.0 changelog.
---

# v0.3.0 changelog

## Added

- Added Agent Task as a first-class Agent Runtime contract.
- Added task lifecycle, attempts/runs, task graph, progress, delivery state, and task control-plane semantics.
- Added task orchestration events and attempt lifecycle events to the public event schema.
- Added task records, task attempts, task relationships, task summary, blocked tasks, and delivery state to the public snapshot schema.
- Added task-aware implementation guidance, acceptance scenarios, telemetry correlation, quickstart, examples, glossary, source analysis, and research sources.

## Changed

- Clarified that `job`, `subagent`, `run`, `step`, and `todo` are related to task execution but do not replace task semantics.
- Expanded the latest specification's identity, event, control-plane, snapshot, completion/failure, and validation sections around Agent Task.
