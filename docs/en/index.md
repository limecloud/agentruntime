---
layout: home
title: Agent Runtime
description: Portable execution semantics for AI agents.

hero:
  name: Agent Runtime
  text: Portable execution semantics for AI agents.
  tagline: "Submit work, stream facts, control tools, resume state, route models, manage tasks, and export evidence without binding to one UI or provider."
  actions:
    - theme: brand
      text: Read the specification
      link: /en/specification
    - theme: alt
      text: Implementation quickstart
      link: /en/authoring/quickstart
    - theme: alt
      text: Standards ecosystem
      link: /en/reference/agent-ecosystem
    - theme: alt
      text: LLM full context
      link: /llms-full.txt

features:
  - title: Execution authority
    details: "Sessions, threads, turns, tasks, runs, steps, tools, actions, subagents, artifacts, and evidence are represented as typed runtime facts."
  - title: Control plane included
    details: "Submit, interrupt, resume, queue, steer, action response, task operations, subagent control, snapshots, and exports are standard boundaries."
  - title: Task-native runtime
    details: "Objectives, attempts, dependencies, progress, ownership, delivery state, and peer task refs are first-class facts."
  - title: Provider neutral
    details: "OpenAI, Anthropic, local models, graph runtimes, terminal agents, and custom streams can adapt into the same event model."
  - title: Durable recovery
    details: "Snapshots, read models, pending requests, incidents, queues, history windows, and replay exports survive restarts and migrations."
  - title: Trust-ready telemetry
    details: "Trace ids, spans, cost, limits, evidence refs, replay cases, and audit exports share stable correlation ids."
---

## What Agent Runtime Defines

| Contract | What it answers |
| --- | --- |
| Runtime event stream | What happened, in which order, and under which ids? |
| Control plane | Which writes are allowed, and who owns submit, interrupt, resume, queue, task, and action changes? |
| Agent task | What work is planned, running, blocked, retried, delegated, accepted, or delivered? |
| Tool and context | Which tools, capabilities, context refs, policies, and permissions were available? |
| State snapshots | What can be hydrated, inspected, resumed, or repaired later? |
| Evidence and replay | Which execution facts can be exported for review, replay, audit, and support? |

## Start Here

- [What is Agent Runtime?](./what-is-agent-runtime.md)
- [Latest specification](./specification.md)
- [Runtime model](./concepts/runtime-model.md)
- [Agent task](./contracts/agent-task.md)
- [Control plane](./contracts/control-plane.md)
- [Agent standards ecosystem](./reference/agent-ecosystem.md)

## For AI Clients

- [llms.txt](/llms.txt): concise navigation index.
- [llms-full.txt](/llms-full.txt): current English core documentation in one file.
- [llm.txt](/llm.txt) and [llm-full.txt](/llm-full.txt): compatibility aliases.

## Agent Standards Ecosystem

Runtime owns execution facts and controls. UI projects them, Knowledge feeds context, Evidence packages trust records, and adjacent tool/artifact/policy systems keep their own authority.
