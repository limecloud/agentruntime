---
title: Permission 与 sandbox
description: Agent Runtime 权限、审批和沙箱契约。
---

# Permission 与 sandbox

权限不是一个弹窗。权限是 runtime 在工具、进程、网络、文件系统和人工审批之间留下的可审计决策链。

兼容 runtime SHOULD 把每一次受限动作拆成三层事实：

1. `permission_state`：当前策略、规则来源、审批模式和是否允许交互。
2. `permission_decision`：这一次动作被允许、拒绝、要求询问或被沙箱自动约束的原因。
3. `sandbox_profile`：动作真正运行时的文件系统、网络、环境变量、进程和平台边界。

## Permission mode

标准不强制具体枚举名，但兼容实现 SHOULD 能表达下列语义：

| Mode | 语义 |
| --- | --- |
| `default` | 普通交互模式。安全动作可直接执行，高风险动作进入 approval。 |
| `untrusted` | 未信任输入模式。只有已知安全且只读的动作可自动执行。 |
| `on_request` | 模型或 runtime 可在需要时申请越权。 |
| `on_failure` | 先在受限环境运行，失败后才允许申请更高权限。 |
| `never` | 不允许询问用户；不能执行的动作必须失败并返回事实。 |
| `plan` | 只允许计划和只读观察，写入或副作用动作必须阻断。 |
| `bypass` | 明确绕过权限。必须可审计，并 SHOULD 只在受信任本地环境启用。 |
| `auto` | runtime 允许使用规则、分类器或 policy 自动裁决。 |

任何 mode 都不能让 runtime 隐式批准破坏性动作。破坏性动作 SHOULD 带上 `destructive=true`、影响范围、回滚提示和 decision source。

## Permission decision

每个 permission decision SHOULD 包含：

| Field | 含义 |
| --- | --- |
| `decision` | `allow`、`deny`、`ask`、`sandboxed`、`unavailable`。 |
| `decision_source` | `rule`、`mode`、`hook`、`classifier`、`human`、`host_policy`、`sandbox_override`、`tool_contract`。 |
| `decision_reason` | 可展示但不泄露敏感数据的解释。 |
| `rule_refs` | 命中的 allow / deny / ask 规则引用。 |
| `updated_input_ref` | hook 或审批修改后的安全输入引用。 |
| `approval_action_id` | 如果需要人工响应，关联的 action id。 |
| `expires_at` | 临时授权失效时间。 |
| `scope` | 本次、会话、工作区、组织或 host policy。 |

`allow` 不代表绕过所有后续约束。实现 SHOULD 支持“hook 允许，但显式 deny 规则仍覆盖”的优先级。

## Sandbox profile

`sandbox_profile` SHOULD 描述实际运行边界，而不是只记录用户选择：

| Field | 含义 |
| --- | --- |
| `mode` | `read_only`、`workspace_write`、`danger_full_access`、`external_sandbox` 或实现等价项。 |
| `cwd` | 命令或工具的工作目录。 |
| `read_roots` | 可读边界。 |
| `write_roots` | 可写边界。 |
| `network` | `restricted`、`enabled` 或更细粒度规则。 |
| `environment_ref` | 过滤后的环境变量快照引用。 |
| `process_limits` | 超时、最大输出、最大进程数、TTY、stdin 策略。 |
| `violation_refs` | 沙箱拒绝、网络阻断、路径越界等事实引用。 |

Runtime MUST NOT 只在 UI 上展示“已沙箱”，却不在 tool/process events 和 evidence 里记录沙箱事实。

## Event classes

| Event | 何时发出 |
| --- | --- |
| `permission.evaluated` | 规则、mode、hook、host policy 或分类器完成裁决。 |
| `permission.requested` | runtime 需要 human 或 host 决策。 |
| `permission.resolved` | action 得到 allow / deny / timeout / cancelled。 |
| `sandbox.applied` | 工具或进程确定实际 sandbox profile。 |
| `sandbox.violation` | 沙箱、路径、网络或权限边界被触发。 |

Permission events SHOULD 与 `tool_call_id`、`process_id`、`action_id` 和 `trace_id` 关联。

## 反模式

- 从最终文本推断“工具已被批准”。
- 只记录弹窗结果，不记录触发规则和 sandbox profile。
- 非交互模式下卡住等待用户输入。
- 把沙箱失败伪装成普通工具失败。
- 让 hook 的 allow 覆盖显式 deny 规则。
