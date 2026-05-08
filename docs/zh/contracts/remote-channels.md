---
title: Remote channels
description: Agent Runtime 远程会话、通道和恢复契约。
---

# Remote channels

Agent Runtime 可以在本地进程、远程服务、浏览器扩展、IDE、移动端或 workflow worker 之间运行。标准不规定传输层，但规定远程通道必须保留 identity、权限、恢复和事件语义。

## Channel identity

每个 channel SHOULD 有：

| Field | 含义 |
| --- | --- |
| `channel_id` | 稳定通道 id。 |
| `transport` | websocket、sse、json_rpc、stdio、http、in_process 或 custom。 |
| `peer_role` | client、host、worker、remote_runtime、tool_server。 |
| `account_ref` | host 账号或租户引用。 |
| `capabilities` | 支持 streaming、resume、permissions、files、artifacts 等。 |
| `last_seen_at` | 最近心跳或事件时间。 |
| `resume_token_ref` | 可选恢复 token 引用。 |

## Remote session ingress

远程输入进入 runtime 时，SHOULD 标准化为 control plane action，而不是直接写 transcript：

1. authenticate / enroll channel。
2. resolve session、thread 和 workspace scope。
3. submit turn 或 append remote action。
4. emit channel events。
5. persist read model 和 recovery cursor。

## Remote permission bridge

远程 runtime 的权限决策必须可追踪：

- 哪个 peer 请求权限。
- 请求作用于哪个 tool/process/action。
- 本地还是远程 host 做最终裁决。
- 用户响应、timeout 或 policy deny 的来源。
- 决策是否只对当前远程 channel 有效。

远程审批不应被压扁成普通 user message。

## Event classes

| Event | 何时发出 |
| --- | --- |
| `channel.connected` | peer 建立可用连接。 |
| `channel.disconnected` | peer 断开或心跳超时。 |
| `channel.resumed` | 使用 cursor 或 token 恢复。 |
| `channel.message` | 非 turn 的通道级消息或状态。 |
| `channel.permission_forwarded` | permission request 跨 channel 转发。 |
| `channel.permission_returned` | 远端或本地裁决返回。 |

## Recovery

客户端重连 SHOULD 先读取 snapshot，再从 last acknowledged sequence 继续。Runtime 不能 replay 时，必须发出 snapshot repair 事实并标记缺口。

远程任务恢复 SHOULD 区分：

- remote session 仍在 running。
- remote session idle 但未完成。
- remote session archived 或 missing。
- auth / network 暂时不可用。

这些状态不应都显示成 failed。

## 反模式

- 远程消息直接写 UI，不进入 runtime event stream。
- 重连后从头重复投递，产生重复 turn。
- 远程权限由浏览器或 host 私下批准，evidence 里没有记录。
- channel 状态丢失导致 running job 被错误标记 completed。
