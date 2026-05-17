---
title: 验收场景
description: Agent Runtime 的行为级验收场景。
---

# 验收场景

兼容 Agent Runtime 应通过行为级检查。Product profile 可以增加更严格 fixtures。Lime Profile conformance pack 是当前 Lime runtime 的参考严格 profile。


兼容 Agent Runtime 应通过行为级检查。

## Submit 与 first status

## Lime profile fixture validation

Lime-profile runtime 至少发布 submit turn、action required、failed task attempt、routing single candidate、evidence export 与 thread read snapshot fixtures。每个 fixture 都携带 `schemaVersion: "lime-profile-0.4.0"`、稳定 correlation ids 与 typed payloads。


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

## Agent task retry 与 graph

当长任务创建 child work 后失败，runtime 保留原 `task_id`，用 `run_id` 记录失败 attempt，保留 parent/dependency edges，并在 retry 时创建新 attempt，而不是覆盖历史。

## Evidence export

当 turn completed 或 failed，evidence export 包含 runtime summary、timeline、tool failures、artifact refs，以及可用的 verification/review refs。

## Old session recovery

当旧 session 有大量消息，runtime 先返回 shell 和 recent window，再通过 cursor 和按需详情暴露 older history。

## Permission 与 sandbox fact

当 shell 或文件工具请求写入，runtime 先记录 `permission.evaluated` 与 `sandbox.applied`。如果被拒绝或越界，thread read 能说明是 rule、mode、hook、host policy 还是 sandbox violation 导致。

## Hook 修改输入

当 `pre_tool_use` hook 修改工具输入或阻断工具，event stream 包含 `hook.started` / `hook.completed`、updated input ref 或 block reason。最终工具结果不能掩盖 hook 决策。

## Process stdin 与输出溢写

当长期进程需要 stdin，`write_process_stdin` 发出 `process.input`。stdout/stderr 大于预算时，runtime 发出 `output.spilled` 或 `output.truncated`，并保留 output ref。

## Model routing 与单候选

当只有一个可用模型候选，runtime 发出 `routing.single_candidate`，并在 read model 中显示 candidate count、decision reason、capability gap、cost state 和 limit state。

## Quota 或 rate limit

当 provider 或 host 返回限流/配额错误，runtime 发出 `rate_limit.hit`、`quota.low` 或 `quota.blocked`，并把 request log 与 turn ids 关联到 evidence。

## Remote channel reconnect

当远程客户端断线重连，runtime 先返回 snapshot，再从 last acknowledged sequence 继续；无法 replay 时发出 `snapshot.repaired` 并标记 stale 或 unavailable。

## Job item retry

当 batch job 的一个 item 失败，job 保持 running 或 failed item 状态，允许只 retry 该 item，并保留 attempt count 与 last error。

## Benchmark trial export

当 Lime 运行 benchmark task 时，runtime 发出 benchmark dataset/config/trial facts，保留 execution trajectory，记录 reward refs，并导出带 runtime correlation 的 trial pack。Candidate comparison 必须包含 baseline/candidate configs、aggregate deltas、evidence completeness 和 P0 Agent QC regression count。
