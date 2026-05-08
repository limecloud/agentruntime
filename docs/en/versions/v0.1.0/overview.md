---
title: v0.1.0 Overview
description: What changed in Agent Runtime v0.1.0.
---

# v0.1.0 Overview

v0.1.0 establishes Agent Runtime as the execution standard below Agent UI. It defines portable semantics for submitting work, streaming runtime facts, coordinating tools and subagents, resuming state, and exporting evidence.

## Highlights

- Runtime identity model for sessions, threads, turns, tasks, steps, tool calls, action requests, subagents, artifacts, and evidence.
- Runtime event stream covering lifecycle, provider, tool, context, queue, action, subagent, artifact, evidence, limits, snapshots, warnings, and errors.
- Control plane commands for submit, interrupt, resume, queue, action response, state reads, tool inventory, subagents, evidence, and replay.
- Durable snapshots and read models for recovery and old-session hydration.
- Research alignment with MCP, A2A, OpenTelemetry, CloudEvents, JSON-RPC, provider streams, and durable graph runtimes.
