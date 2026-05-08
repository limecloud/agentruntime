---
title: Glossary
description: Agent Runtime glossary.
---

# Glossary

- `runtime`: Execution authority that owns agent facts and control semantics.
- `session`: Durable user-visible work container.
- `thread`: Ordered execution context inside a session.
- `turn`: One submitted input cycle.
- `task`: Unit of work that may span turns or run in background.
- `step`: Ordered runtime item in a turn or task.
- `tool_call`: One invocation of a tool or connector.
- `action_request`: Pending human or policy decision.
- `subagent`: Child runtime context delegated by a parent runtime.
- `read model`: Compact view derived from runtime facts for inspection.
- `snapshot`: Durable state used for recovery and hydration.
- `evidence pack`: Exported facts for review, replay, verification, or audit.
- `provider adapter`: Layer that maps provider-native streams to runtime events.
- `capability surface`: Tools and actions available under current policy and context.
- `compaction boundary`: Runtime checkpoint where context was summarized or rewritten.
