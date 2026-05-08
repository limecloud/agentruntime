---
title: Remote channels
description: Agent Runtime remote session, channel, and recovery contract.
---

# Remote channels

Agent Runtime may run across local processes, remote services, browser extensions, IDEs, mobile clients, or workflow workers. The standard does not prescribe transport, but remote channels must preserve identity, permission, recovery, and event semantics.

## Channel identity

A channel SHOULD include `channel_id`, `transport`, `peer_role`, `account_ref`, capabilities, `last_seen_at`, and optional `resume_token_ref`.

## Remote session ingress

Remote input should enter as a control-plane action: authenticate or enroll the channel, resolve session/thread/workspace scope, submit or append work, emit channel events, and persist recovery cursors.

## Remote permission bridge

Remote permission decisions must record which peer requested permission, which tool/process/action it applies to, which side made the final decision, the response or timeout, and whether the decision is channel-scoped.

## Events

`channel.connected`, `channel.disconnected`, `channel.resumed`, `channel.message`, `channel.permission_forwarded`, and `channel.permission_returned` describe remote channel lifecycle.

Reconnect should load a snapshot first, then continue from the last acknowledged sequence. If replay is unavailable, emit snapshot repair facts.
