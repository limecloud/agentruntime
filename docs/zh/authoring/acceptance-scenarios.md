---
title: 验收场景
description: Agent Runtime 的行为级验收场景。
---

# 验收场景

兼容 Agent Runtime 应通过行为级检查。

## Submit 与 first status

当客户端提交 turn，runtime 在长模型输出前先发出 accepted 或 queued fact。Thread read model 显示 `preparing`、`queued` 或 `running`，而不是保持 unknown。

## 大结果工具调用

当工具返回大 payload，event stream 包含安全 preview 和 output ref。最终回答不是该结果的唯一存储位置。

## Approval gate

当工具需要审批，runtime 发出带稳定 action id 的 `action.required`。执行不会在 `respond_action` 解决请求前继续。

## Queue 与 resume

当 busy thread 收到另一个 turn，runtime 要么带 policy detail 拒绝，要么存为 queued turn。重启后 queue 仍可见，并能 resume 或 reorder。

## Context compaction

当长 thread 需要 compaction，runtime 发出 compaction start/completed events，并保留 boundary snapshot。Unresolved requests 和 evidence refs 在 compaction 后仍存在。

## Subagent delegation

当 parent turn 生成 child agent，parent/child ids 保持关联。等待、发送输入、失败和关闭都可见，不需要解析 child prose。

## Evidence export

当 turn completed 或 failed，evidence export 包含 runtime summary、timeline、tool failures、artifact refs，以及可用的 verification/review refs。

## Old session recovery

当旧 session 有大量消息，runtime 先返回 shell 和 recent window，再通过 cursor 和按需详情暴露 older history。
