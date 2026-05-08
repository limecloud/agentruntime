---
title: Ecosystem boundaries
description: Boundaries between Agent Runtime and adjacent systems.
---

# Ecosystem boundaries

Agent Runtime coordinates many systems. It should not absorb their ownership.

| System | Owns | Runtime relationship |
| --- | --- | --- |
| Agent UI | Surfaces, interactions, local drafts, progressive rendering. | Consumes runtime facts and sends controlled actions. |
| Model providers | Native APIs, streaming formats, usage accounting, provider errors. | Runtime adapts provider facts into normalized lifecycle events. |
| MCP servers and connectors | Tools, resources, prompts, connector auth, external side effects. | Runtime discovers, filters, invokes, and records tool lifecycle. |
| A2A peers | Remote agent capabilities, tasks, messages, artifacts. | Runtime can wrap peer tasks as subagents or remote task refs. |
| Context stores | Memory, knowledge, search, retrieval, source ranking. | Runtime records selected refs, omissions, and compaction boundaries. |
| Policy systems | Permission rules, risk, sandbox profiles, org policy. | Runtime enforces or asks, then records decisions. |
| Artifact services | Content, versions, diff, export bytes. | Runtime emits artifact refs and lifecycle facts. |
| Evidence systems | Traces, verification, replay, review, audit verdicts. | Runtime exports and links evidence facts. |
| Host application | Workspace, account, local storage, deployment, navigation. | Runtime uses host scope and returns portable state models. |

A clean runtime boundary makes it possible to replace the UI, model provider, connector system, or evidence backend without rewriting the execution contract.
