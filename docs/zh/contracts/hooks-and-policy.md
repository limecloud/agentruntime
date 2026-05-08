---
title: Hooks 与 policy
description: Agent Runtime hook、policy 和可插拔治理契约。
---

# Hooks 与 policy

Hooks 是 runtime 的可插拔治理点。它们可以补充上下文、阻断输入、修改工具参数、参与权限裁决、记录审计事实，或在停止前做收尾检查。

Hook 不应成为第二条执行主链。Hook 的输出必须回写为 runtime facts，供 event stream、snapshot、evidence 和 review 复用。

## Hook points

兼容 runtime SHOULD 支持下列 hook point 或等价语义：

| Hook | 作用 |
| --- | --- |
| `session_start` | 会话或远程 thread 初始化时注入上下文或审计标签。 |
| `user_prompt_submit` | 用户输入进入 turn 前检查、补上下文或阻断。 |
| `pre_tool_use` | 工具执行前校验输入、修改输入、补上下文或给出 permission hint。 |
| `permission_request` | runtime 准备询问用户前，让 policy 系统先裁决。 |
| `post_tool_use` | 工具成功后补上下文、改写结构化输出或发出审计事实。 |
| `post_tool_failure` | 工具失败后分类错误、补恢复建议或升级 incident。 |
| `post_sampling` | 模型输出完成后做策略检查或结构化审计。 |
| `stop` | turn 结束前允许 policy 阻断完成、要求继续或附加说明。 |

## Hook input

Hook input SHOULD 使用稳定、最小、可审计的结构：

- `session_id`、`thread_id`、`turn_id`、`tool_call_id`。
- `cwd`、workspace scope、permission mode 和 sandbox summary。
- tool name、safe input、input ref。
- transcript 或 history ref，而不是复制完整敏感上下文。
- model、routing decision 和 host policy refs。

Hook input MUST NOT 默认包含密钥、未脱敏环境变量、完整私有文件或不可审计的 UI 状态。

## Hook output

Hook output SHOULD 归一化为下列效果：

| Output | 语义 |
| --- | --- |
| `continue` | 允许 runtime 继续。 |
| `block` | 阻断当前输入、工具或 turn，并给出 reason。 |
| `allow` / `deny` / `ask` | 对权限流给出裁决或建议。 |
| `updated_input_ref` | 修改后的工具输入或用户输入引用。 |
| `additional_context_refs` | 追加给模型或 review 的上下文引用。 |
| `updated_tool_output_ref` | 对结构化工具输出的受控改写引用。 |
| `suppress_output` | hook 输出不进入可见 transcript。 |
| `audit_refs` | 审计、策略和验证记录引用。 |

Hook 的 `allow` SHOULD 视为一个 decision source，而不是所有 policy 的最终覆盖。

## Hook lifecycle events

| Event | Payload 要点 |
| --- | --- |
| `hook.started` | hook point、handler ref、scope ids、timeout、preview summary。 |
| `hook.completed` | status、duration、decision、additional context refs、updated refs。 |
| `hook.failed` | error category、retryability、是否 fail open / fail closed。 |
| `policy.changed` | host policy、workspace policy 或会话规则发生变更。 |

Hook events SHOULD 保留 `duration_ms`，并进入 telemetry metrics。长时间 hook 会影响 TTFT，不能只记录在日志里。

## Fail-open 与 fail-closed

每个 hook point SHOULD 明确失败策略：

- 权限、安全、外部发送、删除、写文件等高风险点默认 fail closed。
- 只读补上下文、非关键审计可 fail open，但必须发出 warning。
- timeout 应和 failure 一样进入 event stream。

## 反模式

- hook 直接调用模型或工具，却不生成 runtime events。
- hook 把大输出塞回 event payload，导致 stream 无法恢复。
- hook 修改工具输入但 evidence 中没有修改前后引用。
- stop hook 阻断完成，但 thread read 仍显示 completed。
