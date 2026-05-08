---
title: Remote channels
description: Agent Runtime remote session, channel, and recovery contract.
---

# Remote channels

Agent Runtime may run across local processes, remote services, browser extensions, IDEs, mobile clients, or workflow workers. The standard does not prescribe transport, but remote channels must preserve identity, permission, recovery, and event semantics.

## Channel identity

A channel SHOULD include:

| Field | Meaning |
| --- | --- |
| `channel_id` | Stable channel id. |
| `transport` | `websocket`, `sse`, `json_rpc`, `grpc`, `http_json`, `stdio`, `in_process`, or custom. |
| `peer_role` | `client`, `host`, `worker`, `remote_runtime`, `peer_agent`, or `tool_server`. |
| `account_ref` | Host account or tenant reference. |
| `capabilities` | Streaming, resume, permissions, files, artifacts, task delegation, or custom flags. |
| `last_seen_at` | Latest heartbeat or event time. |
| `resume_token_ref` | Optional recovery token reference. |
| `native_protocol` | Optional peer protocol, such as `a2a`, `mcp`, `json_rpc`, or custom. |

## Remote session ingress

Remote input SHOULD enter as a control-plane action, not write directly to transcript state:

1. Authenticate or enroll the channel.
2. Resolve session, thread, task, and workspace scope.
3. Submit a turn, create a task, append remote input, or link a peer task.
4. Emit channel events.
5. Persist read models, native ids, and recovery cursors.

## A2A alignment

When the peer speaks Agent2Agent Protocol, the runtime SHOULD treat A2A as the peer transport and interaction contract while keeping Agent Runtime as the internal execution truth.

| A2A concept | Runtime mapping |
| --- | --- |
| Agent Card | Peer capability snapshot, routing input, `channel.capabilities`, and optional `agent_card_ref`. |
| `SendMessage` / `SendStreamingMessage` | `submit_turn`, `create_task`, `append_task_progress`, and channel events depending on scope. |
| A2A `taskId` / `contextId` | `remote_task_ref` linked to local `task_id`, `parent_task_id`, `subagent_id`, or `channel_id`. |
| A2A Task state | Normalized task status plus `native_status`; do not collapse retries or local attempts. |
| Message | Remote input, clarification, status, or task interaction; do not treat messages as durable task outputs. |
| Artifact / `TaskArtifactUpdateEvent` | Artifact refs, `artifact.changed`, and produced/consumed artifact task graph edges. |
| Streaming / subscribe / push notifications | `channel.connected`, `channel.message`, `task.progress`, `task.completed`, `channel.resumed`, ack, cursor, and snapshot repair facts. |
| In-task authorization | `action.required`, `permission.requested`, `channel.permission_forwarded`, and `channel.permission_returned`. |

A runtime MAY expose an A2A adapter, but the adapter must preserve both identities: the local runtime `task_id` and the remote A2A `taskId` / `contextId`.

## Remote permission bridge

Remote permission decisions must record:

- which peer requested permission.
- which tool, process, action, or peer task the request applies to.
- which side made the final decision.
- the response, timeout, policy deny, or auth failure source.
- whether the decision is channel-scoped.

Remote approvals should not be flattened into normal user messages.

## Event classes

| Event | When emitted |
| --- | --- |
| `channel.connected` | A peer becomes reachable. |
| `channel.disconnected` | A peer disconnects or misses heartbeat. |
| `channel.resumed` | A peer resumes with cursor or token. |
| `channel.message` | Non-turn channel message, protocol notice, or status. |
| `channel.permission_forwarded` | Permission request is forwarded across a channel. |
| `channel.permission_returned` | Remote or local permission decision returns. |
| `channel.peer_task.linked` | A remote peer task is linked to a local task or subagent. |
| `channel.peer_task.updated` | Remote peer task state changes. |

## Recovery

Reconnect SHOULD load a snapshot first, then continue from the last acknowledged sequence. If replay is unavailable, the runtime must emit snapshot repair facts and mark the gap.

Remote task recovery SHOULD distinguish:

- remote session still running.
- remote session idle but not completed.
- remote peer task waiting for input or authorization.
- remote peer task completed but local delivery not reconciled.
- remote session archived or missing.
- auth or network temporarily unavailable.

These states should not all appear as `failed`.

## Anti-patterns

- Writing remote messages directly to UI without entering the runtime event stream.
- Treating A2A `taskId` as the local `task_id` and losing the peer boundary.
- Using A2A messages as durable outputs instead of artifact refs.
- Replaying from the beginning after reconnect and duplicating turns or peer tasks.
- Approving remote permissions privately in the host or browser without evidence facts.
- Marking a running peer task as completed because the channel disconnected.
