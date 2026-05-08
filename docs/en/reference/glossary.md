---
title: Glossary
description: Agent Runtime glossary.
---

# Glossary

- `runtime`: Execution authority that owns agent facts and control semantics.
- `session`: Durable user-visible work container.
- `thread`: Ordered execution context inside a session.
- `turn`: One submitted input cycle.
- `task`: Durable objective with lifecycle, attempts, relationships, progress, acceptance, and recovery state.
- `run` / `attempt`: One execution attempt for a task.
- `step`: Ordered runtime item in a turn, task, or run.
- `tool_call`: One invocation of a tool or connector.
- `action_request`: Pending human or policy decision.
- `subagent`: Child runtime context delegated by a parent runtime.
- `read model`: Compact view derived from runtime facts for inspection.
- `snapshot`: Durable state used for recovery and hydration.
- `evidence pack`: Exported facts for review, replay, verification, or audit.
- `provider adapter`: Layer that maps provider-native streams to runtime events.
- `capability surface`: Tools and actions available under current policy and context.
- `compaction boundary`: Runtime checkpoint where context was summarized or rewritten.
