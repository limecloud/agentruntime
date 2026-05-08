---
title: v0.3.1 changelog
description: Agent Runtime v0.3.1 changelog.
---

# v0.3.1 changelog

## Added

- Added official A2A references covering the latest specification, Google launch post, Linux Foundation project governance, and GitHub project.
- Added A2A boundary mapping for Agent Card, task ids, context ids, messages, artifacts, streaming, push notifications, and in-task authorization.
- Added A2A peer-task fields such as `native_protocol`, `remote_task_id`, `remote_context_id`, `agent_card_ref`, `delivery_mechanism`, `native_status`, and `remote_artifact_refs`.
- Added remote channel peer-task events for linking and updating remote peer tasks.

## Changed

- Clarified that A2A is a peer interoperability reference, not a replacement for Agent Runtime execution facts.
- Expanded remote channel identity, ingress, recovery, and anti-pattern guidance around peer protocols.
- Clarified that durable outputs should use artifact refs instead of messages.
