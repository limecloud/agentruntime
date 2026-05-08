---
title: v0.2.0 Overview
description: What changed in Agent Runtime v0.2.0.
---

# v0.2.0 Overview

v0.2.0 expands Agent Runtime from a baseline execution contract into a fuller runtime standard shaped by real terminal, systems, and desktop agent runtimes.

## Highlights

- Adds first-class permission and sandbox contracts, including decision source, sandbox profile, violations, and approval linkage.
- Adds hooks and policy contracts for session start, user prompt submit, pre/post tool use, permission request, post sampling, and stop governance.
- Adds execution environment and process lifecycle contracts for commands, PTY sessions, stdin, output refs, exit status, and recovery.
- Adds model routing and limits contracts for task profiles, candidate model sets, routing decisions, fallback, single candidate, cost, quota, and rate-limit events.
- Adds subagent graph and job contracts for child runtime contexts, durable batch/background work, item attempts, and progress.
- Adds remote channel, telemetry/tracing, session history/recovery, and large output storage contracts.
- Expands event and snapshot JSON Schemas with permission, sandbox, hook, process, routing, cost, channel, job, output, telemetry, and recovery fields.
