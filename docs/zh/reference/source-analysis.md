---
title: 实现分析摘要
description: Agent Runtime 从真实 agent runtime 实现中提炼出的标准缺口。
---

# 实现分析摘要

本页记录从真实实现中提炼出的 runtime 标准压力。它不是对任何单一项目的移植说明，而是把可复用的执行语义抽象成 Agent Runtime 契约。

## 1. 终端型 coding runtime 的压力

终端型 runtime 证明：工具调用不是一个简单 request/response。

需要标准化的事实包括：

- tool schema、safe args、progress、partial result 和 final result。
- read-only 工具并发，写入或破坏性工具串行。
- pre-tool / post-tool hooks。
- permission mode、规则来源、分类器、人工审批和 deny 优先级。
- sandbox profile、路径校验、网络策略和破坏性命令提示。
- 大输出预算、溢写、截断和 telemetry-safe error 分类。
- 本地子代理、远程子代理、后台输出和恢复。
- 自动 compaction、manual compaction、session memory 和压缩失败熔断。

结论：Agent Runtime 必须把 tool、permission、sandbox、hook、output 和 compaction 作为一级事实。

终端型 runtime 还证明：task state 不能只是模型可见 checklist。Foreground tasks、本地 shell tasks、remote agent tasks、in-process teammate tasks、scheduled tasks、backgrounded work 和 generated output files 都需要 task ids、output offsets、terminal-state eviction、stop controls 和 notifications。

## 2. scheduler / gateway runtime 的压力

Gateway 与 scheduler runtime 证明：后台工作需要 durable storage、secure output refs、origin/delivery context、per-job model/tool overrides、pre-run scripts、prompt-injection gates、inactivity timeouts、delivery failure state、run outputs 和 checkpoint/resume scanning。错过的 scheduled task 或失败投递是 task fact，不只是 log line。

## 3. typed systems runtime 的压力

类型化 systems runtime 证明：event stream 和 SDK 需要比“流文本”更稳定的 item lifecycle。

需要标准化的事实包括：

- `thread.started`、`turn.started`、`item.started`、`item.updated`、`item.completed`、`turn.completed`、`turn.failed`。
- command execution、file change、MCP tool call、web search、image generation、todo list、reasoning 等 item 类型。
- approval policy 与 sandbox policy 作为 turn options，而不是 UI 局部状态。
- hook schemas：session start、user prompt submit、pre tool use、permission request、post tool use、stop。
- process manager：PTY、stdin、stdout/stderr delta、exit code、output buffer、timeout、process limit。
- durable state：threads、logs、memories、goals、remote control enrollment、agent jobs、spawn edges。
- rollout reconstruction：从持久记录恢复 history、compaction baseline 和 previous turn settings。

结论：Agent Runtime 需要 item-level lifecycle、typed hook contracts、process lifecycle 和 durable reconstruction。

类型化 systems runtime 还证明：task 与 run 必须分离。Thread goals、plan items、todo lists、job tables、job item assignments、spawn edges、turn status、approval wait guards 和 thread read models 各自只覆盖工作的一部分。标准需要 task ids、run ids、attempt history、dependency edges、worker assignment 和 lost-state handling 把这些事实 join 起来。

## 4. desktop agent runtime 的压力

桌面型 runtime 证明：产品级执行不是单模型单请求。

需要标准化的事实包括：

- submit turn、queue、resume、interrupt、compact、read model、tool inventory、evidence/replay/review export。
- turn 输入快照：workspace、prompt augmentation、provider routing、tool policy、sandbox、metadata。
- thread read：pending actions、queued turns、last outcome、incidents、diagnostics、latest compaction boundary。
- evidence pack 是 replay、analysis、review 和 UI 的共同事实源。
- request logs 必须携带 session/thread/turn/pending/queued/subagent 关联键。
- task profile、candidate set、routing decision、limit state、cost state 和 limit events。
- 单候选、无候选、fallback、quota、rate limit 和成本事件都要进入 runtime facts。

结论：Agent Runtime 需要把模型路由、成本限额、request telemetry、evidence 和 read model 作为同一条主链。

桌面型 runtime 还证明：foreground turns、subagent turns、automation jobs、execution summaries、task files、artifacts 和 timeline UI projections 应该收敛到同一组 runtime facts。Scheduler ticks 和 UI cards 不应变成独立 task authority。

## 缺口矩阵

| 缺口 | 标准新增落点 |
| --- | --- |
| 权限只表现为 UI 弹窗 | `permission.*` events、permission state、action boundary。 |
| 沙箱只表现为配置 | `sandbox_profile`、`sandbox.applied`、`sandbox.violation`。 |
| hook 没有可移植契约 | `hook.*` events、hook input/output schema。 |
| 命令只当工具文本 | `process.*` lifecycle 与 output refs。 |
| 模型选择不可解释 | `task_profile`、`candidate_model_set`、`routing_decision`。 |
| 成本与限额只在日志 | `cost.*`、`rate_limit.*`、`quota.*` 与 thread read。 |
| Task 只是 todo 或 UI card | `task.*` lifecycle、attempts、graph edges、progress、delivery state。 |
| 子代理只是一段消息 | parent-child graph、subagent status、job/item model。 |
| 远程执行断线不可恢复 | channel identity、resume cursor、remote permission bridge。 |
| 历史压缩破坏审计 | compaction boundary、rollback、history reconstruction。 |
| 大输出污染事件流 | output refs、spill、truncation、redaction facts。 |
