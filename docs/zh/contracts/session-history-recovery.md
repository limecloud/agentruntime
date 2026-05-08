---
title: Session history 与 recovery
description: Agent Runtime 会话历史、压缩、回滚和恢复契约。
---

# Session history 与 recovery

长会话不能依赖内存里的 message array。兼容 runtime SHOULD 同时维护 event log、rollout/history records、snapshots 和 read models，让 session 可恢复、可回放、可压缩、可回滚。

## History layers

| Layer | 职责 |
| --- | --- |
| `event_log` | 原始 runtime events，保留顺序和 correlation。 |
| `rollout_log` | 能重建模型输入和 runtime item 的持久记录。 |
| `session_snapshot` | 快速打开会话的 summary 和 cursors。 |
| `thread_read_model` | 当前 thread 状态、pending、incidents、queue。 |
| `context_boundary` | compaction、rollback、reference baseline。 |
| `evidence_export` | 下游审计和 replay 的稳定截面。 |

这些层可以由同一存储实现，但语义不能混用。

## Compaction

Compaction SHOULD 发出完整边界：

- trigger：manual、auto、memory、budget、remote 或 system。
- affected turn ids。
- summary ref。
- replacement history ref 或 continuation ref。
- token usage before / after。
- preserved pending actions、incidents、artifact refs 和 evidence refs。
- compaction errors 或 retry facts。

Compaction 不能静默删除 unresolved actions 或 active incidents。

## Rollback

Rollback SHOULD 记录：

- rollback target。
- removed user turns count 或 ids。
- surviving context baseline。
- 是否影响 artifacts、tools、subagents、jobs。
- read model repair event。

Rollback 后，旧 events 可保留为 audit facts，但 thread read 必须反映当前可继续状态。

## Reconstruction

恢复旧 session 时，runtime SHOULD：

1. 加载 session shell。
2. 加载 thread summaries。
3. 加载 recent window。
4. 重建 active thread read model。
5. 恢复 pending actions、queued turns、subagents 和 jobs。
6. 标记 stale / unavailable facts。

如果只恢复了 transcript 文本，而没有恢复权限、queue、tool 和 evidence links，snapshot 必须标记 degraded。

## Event classes

- `history.window.loaded`
- `history.reconstructed`
- `history.rollback.started`
- `history.rollback.completed`
- `context.compaction.started`
- `context.compaction.completed`
- `context.compaction.failed`
- `snapshot.repaired`

## 反模式

- 把 transcript 当唯一事实源。
- 压缩后丢失 tool call refs。
- 重启后 pending approval 变成普通文本。
- 恢复失败时仍显示 running 或 completed。
