---
title: v0.3.1 overview
description: Agent Runtime v0.3.1 release overview.
---

# Agent Runtime v0.3.1

Agent Runtime v0.3.1 strengthens the boundary with Agent2Agent Protocol. This patch release treats A2A as the peer-agent interoperability reference while keeping Agent Runtime responsible for internal execution facts, task attempts, local permissions, evidence, and recovery.

## Highlights

- Adds official A2A sources from the protocol specification, Google Developers Blog, Linux Foundation announcement, and project repository.
- Clarifies that A2A peer tasks map to local task wrappers or remote task refs, not replacements for local `task_id` and attempt history.
- Expands remote channels with `native_protocol`, peer-agent roles, native peer ids, A2A task/context ids, and peer task lifecycle events.
- Maps A2A Agent Cards, messages, artifacts, streaming, push notifications, and in-task authorization into runtime facts.
- Adds anti-patterns for losing peer boundaries, treating messages as durable outputs, and marking disconnected peer work as completed.

## Compatibility

v0.3.1 is compatible with v0.3.0. It does not add a required transport or turn Agent Runtime into an A2A implementation. Implementations can expose an A2A adapter, but the adapter should preserve both local runtime ids and remote A2A ids.
