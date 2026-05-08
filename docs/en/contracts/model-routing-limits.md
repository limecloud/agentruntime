---
title: Model routing and limits
description: Agent Runtime model routing, candidate, cost, and limit contract.
---

# Model routing and limits

Model selection is not a client dropdown. It is an explainable runtime decision across task requirements, candidate capabilities, user locks, host policy, cost, limits, and provider state.

Compatible runtimes SHOULD expose `task_profile`, `candidate_model_set`, and `routing_decision`.

## Task profile

A task profile SHOULD include `kind`, `source`, `required_capabilities`, `latency_target`, `budget_class`, `fallback_policy`, and `settings_source`.

## Candidate model set

A candidate set is not the full registry. It describes the candidates actually available for this turn, including candidate count, capability and cost metadata, excluded candidates with reasons, hard constraints, preferences, single-candidate status, credentials, quota, and network gaps.

## Routing decision

A routing decision SHOULD include `routing_mode`, `decision_source`, `decision_reason`, selected and requested provider/model, `candidate_count`, `fallback_chain`, `capability_gap`, `requires_user_override`, and `limit_state_snapshot`.

Single candidate is a first-class path, not a failure. It means the runtime has no optimization space, but still owes capability, cost, and limit facts.

## Events

`task.profile.resolved`, `routing.candidates.resolved`, `routing.decided`, `routing.fallback.applied`, `routing.not_possible`, `routing.single_candidate`, `cost.estimated`, `cost.recorded`, `rate_limit.hit`, `quota.low`, and `quota.blocked` SHOULD flow into read models, evidence, and telemetry.
