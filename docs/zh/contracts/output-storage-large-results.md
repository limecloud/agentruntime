---
title: Output storage 与 large results
description: Agent Runtime 大输出、溢写和结果引用契约。
---

# Output storage 与 large results

工具、命令、hook、搜索、浏览器和模型都可能产生大输出。Event stream 应负责事实和顺序，不应承载不可控大 payload。

## Output reference

大输出 SHOULD 使用 `output_ref`：

| Field | 含义 |
| --- | --- |
| `output_ref` | durable output id 或 URI。 |
| `owner` | tool、process、hook、model、artifact、evidence。 |
| `media_type` | text/plain、application/json、image/png 等。 |
| `encoding` | utf-8、base64、binary。 |
| `size_bytes` | 原始大小。 |
| `preview` | 安全截断预览。 |
| `truncation` | none、head、tail、middle、head_tail、tokens。 |
| `redaction` | 是否脱敏或部分隐藏。 |
| `expires_at` | 临时输出的过期时间。 |

## Spill policy

Runtime SHOULD 为大输出定义 spill policy：

- 最大 event payload 字节数。
- 最大 tool result token 数。
- stdout/stderr head-tail 策略。
- hook output 单独限制。
- 二进制输出是否允许内联。
- evidence export 是否复制、引用或摘要。

## Structured results

结构化工具结果 SHOULD 区分：

- `structured_content_ref`：机器可读输出。
- `display_preview`：用户可见摘要。
- `raw_output_ref`：原始输出。
- `artifact_refs`：被提升为 durable artifact 的结果。
- `error_ref`：失败详情。

不要只把 JSON stringify 后塞进 assistant 文本。

## Event classes

- `output.spilled`
- `output.truncated`
- `output.redacted`
- `output.expired`
- `artifact.changed`
- `evidence.changed`

## 反模式

- event payload 内联数 MB 输出导致重连失败。
- 只保留预览，丢失原始输出 ref。
- 大输出在 UI 可见，但 replay/evidence 无法读取。
- hook 输出超过预算后静默截断，没有 truncation fact。
