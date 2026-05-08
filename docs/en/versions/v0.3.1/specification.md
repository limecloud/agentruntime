---
title: v0.3.1 specification snapshot
description: Agent Runtime v0.3.1 specification snapshot.
---

# v0.3.1 specification snapshot

v0.3.1 keeps the v0.3.0 Agent Task model and adds explicit A2A peer-task alignment for remote channels and task delegation.

## Required clarifications over v0.3.0

A compatible v0.3.1 implementation SHOULD preserve:

- A local `task_id` even when the delegated peer returns an A2A `taskId`.
- A `remote_task_ref` with peer-native ids such as A2A `taskId` and `contextId`.
- `native_protocol` and `native_status` fields for peer protocols before local normalization.
- Agent Card references as capability snapshots or routing inputs, not as runtime ownership records.
- A2A messages as input, clarification, task interaction, or status events rather than durable outputs.
- A2A artifacts as artifact refs linked through task graph edges.
- Streaming, subscribe, or push notification delivery as channel, task progress, artifact, cursor, ack, and snapshot repair facts.
- In-task authorization as action and permission bridge facts.

## Key contracts

- [Remote channels](../../contracts/remote-channels.md)
- [Agent task](../../contracts/agent-task.md)
- [Ecosystem boundaries](../../reference/ecosystem-boundaries.md)
- [Research sources](../../reference/research-sources.md)
- [Specification](../../specification.md)
