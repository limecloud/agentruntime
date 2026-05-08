---
title: v0.2.0 概览
description: Agent Runtime v0.2.0 的主要变化。
---

# v0.2.0 概览

v0.2.0 将 Agent Runtime 从基础执行契约扩展为更完整的 runtime 标准，吸收了真实终端型、系统型和桌面型 agent runtime 的执行压力。

## 主要变化

- 新增 permission 与 sandbox 契约，覆盖 decision source、sandbox profile、violation 和 approval 关联。
- 新增 hooks 与 policy 契约，覆盖 session start、user prompt submit、pre/post tool use、permission request、post sampling 和 stop governance。
- 新增 execution environment 与 process lifecycle 契约，覆盖命令、PTY、stdin、output refs、exit status 和 recovery。
- 新增 model routing 与 limits 契约，覆盖 task profile、candidate model set、routing decision、fallback、single candidate、cost、quota 和 rate-limit events。
- 新增 subagent graph 与 job 契约，覆盖 child runtime context、durable batch/background work、item attempts 和 progress。
- 新增 remote channel、telemetry/tracing、session history/recovery 和 large output storage 契约。
- 扩展 event 与 snapshot JSON Schemas，加入 permission、sandbox、hook、process、routing、cost、channel、job、output、telemetry 和 recovery 字段。
